import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CARE_SERVICES,
  CARETAKER_PROFILE,
  CATALOGUE,
  CATEGORIES,
  COMMISSION,
  DOCUMENTS,
  RIDERS,
  SCHEDULE,
  SLOTS,
  VENDOR_PROFILE,
  makeOrder,
  makeRequest,
  seedBookings,
  seedLedger,
  seedOrders,
  seedReviews,
} from '../data/seed';
import { isoDate, startOfDay } from '../ui/utils/format';
import {
  AppNotification,
  Booking,
  CaretakerProfile,
  DayKey,
  LedgerEntry,
  Medicine,
  OrderItem,
  PartnerRole,
  PartnerState,
  Settings,
  SlotKey,
  VendorOrder,
  VendorProfile,
} from './types';

export const PARTNER_STORAGE_KEY = '@lifeline360_partner_store_v2';

const SEC = 1000;
/** Demo timings. */
export const DEMO = {
  firstArrival: 8 * SEC,
  arrivalGap: 45 * SEC,
  quoteConfirm: 8 * SEC,
  riderAssign: 5 * SEC,
  ratingAfter: 20 * SEC,
};

const DAY_KEYS: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const dayKeyOf = (at: number): DayKey => DAY_KEYS[new Date(at).getDay()];

export function initialState(now: number): PartnerState {
  return {
    session: { phone: '', isLoggedIn: false, role: null, detailsDone: false, kycStatus: 'missing' },
    vendorProfile: VENDOR_PROFILE,
    caretakerProfile: CARETAKER_PROFILE,
    documents: DOCUMENTS,
    isStoreOpen: true,
    orders: seedOrders(now),
    catalogue: CATALOGUE,
    categories: CATEGORIES,
    isAvailable: true,
    bookings: seedBookings(now),
    schedule: SCHEDULE,
    leaveDates: [],
    services: CARE_SERVICES,
    reviews: seedReviews(now),
    ledger: seedLedger(now),
    notifications: [],
    settings: { alertVibration: true, keepAwake: true, orderAcceptMinutes: 3 },
    nextArrivalAt: 0,
    arrivals: 0,
  };
}

/* ----------------------------------------------------------- Derived values */

export const orderTotal = (o: Pick<VendorOrder, 'items' | 'deliveryFee'>) =>
  o.items.filter((i) => !i.unavailable).reduce((s, i) => s + i.qty * i.price, 0) + o.deliveryFee;

export const isLowStock = (m: Medicine) => m.inStock && m.stock <= m.lowStockAt;

/** Gross amount the user paid for a booking, given what the caretaker takes home. */
export const bookingGross = (payout: number) => Math.round(payout / (1 - COMMISSION.caretaker));

export function earningsSummary(ledger: LedgerEntry[], now: number) {
  const today = startOfDay(now);
  const weekStart = today - 6 * 86400000;
  const credits = ledger.filter((e) => e.kind !== 'payout');
  const sum = (list: LedgerEntry[], k: 'gross' | 'net' | 'commission') => list.reduce((s, e) => s + e[k], 0);
  const todays = credits.filter((e) => e.at >= today);
  const week = credits.filter((e) => e.at >= weekStart);
  const days = Array.from({ length: 7 }, (_, i) => {
    const from = weekStart + i * 86400000;
    const list = credits.filter((e) => e.at >= from && e.at < from + 86400000);
    return { label: DAY_KEYS[new Date(from).getDay()].replace(/^./, (c) => c.toUpperCase()), amount: sum(list, 'net'), active: i === 6 };
  });
  return {
    todayGross: sum(todays, 'gross'),
    todayNet: sum(todays, 'net'),
    todayJobs: todays.filter((e) => e.kind === 'order' || e.kind === 'booking').length,
    weekGross: sum(week, 'gross'),
    weekCommission: sum(week, 'commission'),
    weekNet: sum(week, 'net'),
    days,
    balance: ledger.reduce((s, e) => s + e.net, 0),
  };
}

/** The first slot in the next 7 days that is open, not on leave, and at least 2 hours away. */
export function nextOpenSlot(state: Pick<PartnerState, 'schedule' | 'leaveDates'>, now: number): number | null {
  const today = startOfDay(now);
  for (let d = 0; d < 8; d++) {
    const date = today + d * 86400000;
    if (state.leaveDates.includes(isoDate(date))) continue;
    const open = state.schedule[dayKeyOf(date)];
    for (const slot of SLOTS) {
      if (!open.includes(slot.key)) continue;
      const startAt = date + slot.startHour * 3600000;
      if (startAt > now + 2 * 3600000) return startAt;
    }
  }
  return null;
}

/* ------------------------------------------------------------------ Actions */

export type Action =
  | { type: 'HYDRATE'; state: PartnerState }
  | { type: 'LOGIN_PHONE'; phone: string }
  | { type: 'VERIFY_OTP' }
  | { type: 'SELECT_ROLE'; role: PartnerRole }
  | { type: 'SAVE_VENDOR_PROFILE'; patch: Partial<VendorProfile>; details?: boolean }
  | { type: 'SAVE_CARETAKER_PROFILE'; patch: Partial<CaretakerProfile>; details?: boolean }
  | { type: 'UPLOAD_DOC'; docId: string; docNumber?: string; expiryDate?: string; now: number }
  | { type: 'SUBMIT_KYC' }
  | { type: 'APPROVE_KYC'; now: number }
  | { type: 'LOGOUT'; now: number }
  | { type: 'SET_OPEN'; open: boolean; now: number }
  | { type: 'SET_AVAILABLE'; available: boolean; now: number }
  | { type: 'MARK_SEEN'; id: string }
  | { type: 'ACCEPT_ORDER'; id: string }
  | { type: 'REJECT_ORDER'; id: string; reason: string; now: number }
  | { type: 'SEND_QUOTE'; id: string; items: OrderItem[]; now: number }
  | { type: 'TOGGLE_PACKED'; id: string; medId: string }
  | { type: 'SET_UNAVAILABLE'; id: string; medId: string; unavailable: boolean; substitute?: string }
  | { type: 'MARK_READY'; id: string; now: number }
  | { type: 'HANDOVER'; id: string; now: number }
  | { type: 'UPSERT_MEDICINE'; medicine: Medicine }
  | { type: 'SET_IN_STOCK'; id: string; inStock: boolean }
  | { type: 'ADD_CATEGORY'; label: string; now: number }
  | { type: 'RENAME_CATEGORY'; id: string; label: string }
  | { type: 'TOGGLE_CATEGORY'; id: string }
  | { type: 'MOVE_CATEGORY'; id: string; dir: -1 | 1 }
  | { type: 'ACCEPT_BOOKING'; id: string }
  | { type: 'DECLINE_BOOKING'; id: string; reason: string }
  | { type: 'START_TRAVEL'; id: string }
  | { type: 'CHECK_IN'; id: string; distanceM: number; now: number }
  | { type: 'TOGGLE_TASK'; id: string; taskId: string; now: number }
  | { type: 'SET_NOTES'; id: string; notes: string }
  | { type: 'COMPLETE_BOOKING'; id: string; now: number }
  | { type: 'TOGGLE_SLOT'; day: DayKey; slot: SlotKey }
  | { type: 'TOGGLE_LEAVE'; date: string }
  | { type: 'UPDATE_SERVICE'; id: string; enabled?: boolean; rate?: number }
  | { type: 'REQUEST_PAYOUT'; now: number }
  | { type: 'READ_NOTIFICATIONS' }
  | { type: 'UPDATE_SETTINGS'; patch: Partial<Settings> }
  | { type: 'TICK'; now: number; rand: number };

const notify = (s: PartnerState, n: Omit<AppNotification, 'id' | 'read'>): AppNotification[] =>
  [{ ...n, id: `n-${n.at}-${s.notifications.length}`, read: false }, ...s.notifications].slice(0, 40);

const mapOrder = (s: PartnerState, id: string, fn: (o: VendorOrder) => VendorOrder): PartnerState => ({
  ...s,
  orders: s.orders.map((o) => (o.id === id ? fn(o) : o)),
});

const mapBooking = (s: PartnerState, id: string, fn: (b: Booking) => Booking): PartnerState => ({
  ...s,
  bookings: s.bookings.map((b) => (b.id === id ? fn(b) : b)),
});

const addLedger = (s: PartnerState, role: PartnerRole, e: LedgerEntry): PartnerState => ({
  ...s,
  ledger: { ...s.ledger, [role]: [...s.ledger[role], e] },
});

export function reducer(s: PartnerState, a: Action): PartnerState {
  const role = s.session.role;
  switch (a.type) {
    case 'HYDRATE':
      return a.state;
    case 'LOGIN_PHONE':
      return { ...s, session: { ...s.session, phone: a.phone } };
    case 'VERIFY_OTP':
      return { ...s, session: { ...s.session, isLoggedIn: true } };
    case 'SELECT_ROLE':
      return { ...s, session: { ...s.session, role: a.role } };
    case 'SAVE_VENDOR_PROFILE':
      return { ...s, vendorProfile: { ...s.vendorProfile, ...a.patch }, session: a.details ? { ...s.session, detailsDone: true } : s.session };
    case 'SAVE_CARETAKER_PROFILE':
      return { ...s, caretakerProfile: { ...s.caretakerProfile, ...a.patch }, session: a.details ? { ...s.session, detailsDone: true } : s.session };
    case 'UPLOAD_DOC': {
      if (!role) return s;
      const docs = s.documents[role].map((d) =>
        d.id === a.docId ? { ...d, status: 'pending' as const, docNumber: a.docNumber, expiryDate: a.expiryDate, uploadedAt: a.now } : d,
      );
      return { ...s, documents: { ...s.documents, [role]: docs } };
    }
    case 'SUBMIT_KYC':
      return { ...s, session: { ...s.session, kycStatus: 'pending' } };
    case 'APPROVE_KYC': {
      if (!role || s.session.kycStatus === 'approved') return s;
      return {
        ...s,
        session: { ...s.session, kycStatus: 'approved' },
        documents: { ...s.documents, [role]: s.documents[role].map((d) => ({ ...d, status: 'approved' as const })) },
        approvedAt: a.now,
        nextArrivalAt: a.now + DEMO.firstArrival + 4 * SEC,
        notifications: notify(s, {
          title: 'Account verified',
          text: role === 'vendor' ? 'Your pharmacy is live on Lifeline 360. Keep the store open to receive orders.' : 'Your profile is live. Stay available to receive booking requests.',
          at: a.now,
          role,
        }),
      };
    }
    case 'LOGOUT':
      return initialState(a.now);

    case 'SET_OPEN':
      return { ...s, isStoreOpen: a.open, nextArrivalAt: a.open ? a.now + DEMO.firstArrival : 0 };
    case 'SET_AVAILABLE':
      return { ...s, isAvailable: a.available, nextArrivalAt: a.available ? a.now + DEMO.firstArrival : 0 };

    case 'MARK_SEEN':
      return {
        ...s,
        orders: s.orders.map((o) => (o.id === a.id ? { ...o, seen: true } : o)),
        bookings: s.bookings.map((b) => (b.id === a.id ? { ...b, seen: true } : b)),
      };

    /* ------------------------------------------------------------ Vendor */
    case 'ACCEPT_ORDER':
      return mapOrder(s, a.id, (o) => (o.status === 'new' && !o.prescription ? { ...o, status: 'packing', seen: true } : o));
    case 'REJECT_ORDER':
      return mapOrder(s, a.id, (o) =>
        o.status === 'new' || o.status === 'quote_sent' ? { ...o, status: 'rejected', rejectReason: a.reason, seen: true, completedAt: a.now } : o,
      );
    case 'SEND_QUOTE':
      return mapOrder(s, a.id, (o) => (o.status === 'new' ? { ...o, items: a.items, status: 'quote_sent', quoteSentAt: a.now, seen: true } : o));
    case 'TOGGLE_PACKED':
      return mapOrder(s, a.id, (o) => ({ ...o, items: o.items.map((i) => (i.medId === a.medId ? { ...i, packed: !i.packed } : i)) }));
    case 'SET_UNAVAILABLE':
      return mapOrder(s, a.id, (o) => ({
        ...o,
        items: o.items.map((i) =>
          i.medId === a.medId ? { ...i, unavailable: a.unavailable, substitute: a.unavailable ? a.substitute : undefined, packed: a.unavailable ? false : i.packed } : i,
        ),
      }));
    case 'MARK_READY': {
      const order = s.orders.find((o) => o.id === a.id);
      if (!order || order.status !== 'packing') return s;
      const used = new Map(order.items.filter((i) => !i.unavailable).map((i) => [i.medId, i.qty]));
      return {
        ...mapOrder(s, a.id, (o) => ({ ...o, status: 'ready', readyAt: a.now })),
        catalogue: s.catalogue.map((m) => {
          const q = used.get(m.id);
          if (!q) return m;
          const stock = Math.max(0, m.stock - q);
          return { ...m, stock, inStock: stock > 0 && m.inStock };
        }),
      };
    }
    case 'HANDOVER': {
      const order = s.orders.find((o) => o.id === a.id);
      if (!order || order.status !== 'ready' || !order.rider) return s;
      const gross = orderTotal(order);
      const commission = Math.round(gross * COMMISSION.vendor);
      const next = mapOrder(s, a.id, (o) => ({ ...o, status: 'completed', completedAt: a.now }));
      return addLedger(next, 'vendor', {
        id: `vl-${order.id}`,
        ref: order.code,
        title: `Order · ${order.items.filter((i) => !i.unavailable).length} items`,
        at: a.now,
        gross,
        commission,
        net: gross - commission,
        kind: 'order',
      });
    }
    case 'UPSERT_MEDICINE': {
      const exists = s.catalogue.some((m) => m.id === a.medicine.id);
      return { ...s, catalogue: exists ? s.catalogue.map((m) => (m.id === a.medicine.id ? a.medicine : m)) : [a.medicine, ...s.catalogue] };
    }
    case 'SET_IN_STOCK':
      return { ...s, catalogue: s.catalogue.map((m) => (m.id === a.id ? { ...m, inStock: a.inStock } : m)) };
    case 'ADD_CATEGORY':
      return { ...s, categories: [...s.categories, { id: `cat-${a.now}`, label: a.label, hidden: false }] };
    case 'RENAME_CATEGORY':
      return { ...s, categories: s.categories.map((c) => (c.id === a.id ? { ...c, label: a.label } : c)) };
    case 'TOGGLE_CATEGORY':
      return { ...s, categories: s.categories.map((c) => (c.id === a.id ? { ...c, hidden: !c.hidden } : c)) };
    case 'MOVE_CATEGORY': {
      const i = s.categories.findIndex((c) => c.id === a.id);
      const j = i + a.dir;
      if (i < 0 || j < 0 || j >= s.categories.length) return s;
      const list = [...s.categories];
      [list[i], list[j]] = [list[j], list[i]];
      return { ...s, categories: list };
    }

    /* --------------------------------------------------------- Caretaker */
    case 'ACCEPT_BOOKING':
      return mapBooking(s, a.id, (b) => (b.status === 'requested' ? { ...b, status: 'accepted', seen: true } : b));
    case 'DECLINE_BOOKING':
      return mapBooking(s, a.id, (b) => (b.status === 'requested' ? { ...b, status: 'declined', declineReason: a.reason, seen: true } : b));
    case 'START_TRAVEL':
      return mapBooking(s, a.id, (b) => (b.status === 'accepted' ? { ...b, status: 'on_the_way' } : b));
    case 'CHECK_IN':
      return mapBooking(s, a.id, (b) =>
        b.status === 'on_the_way' || b.status === 'accepted' ? { ...b, status: 'in_progress', startedAt: a.now, checkInDistanceM: a.distanceM } : b,
      );
    case 'TOGGLE_TASK':
      return mapBooking(s, a.id, (b) => ({
        ...b,
        tasks: b.tasks.map((t) => (t.id === a.taskId ? { ...t, done: !t.done, doneAt: t.done ? undefined : a.now } : t)),
      }));
    case 'SET_NOTES':
      return mapBooking(s, a.id, (b) => ({ ...b, notes: a.notes }));
    case 'COMPLETE_BOOKING': {
      const b = s.bookings.find((x) => x.id === a.id);
      if (!b || b.status !== 'in_progress') return s;
      const gross = bookingGross(b.payout);
      const next = mapBooking(s, a.id, (x) => ({ ...x, status: 'completed', completedAt: a.now }));
      return addLedger(next, 'caretaker', {
        id: `cl-${b.id}`,
        ref: b.code,
        title: `${b.serviceName} · ${b.packageLabel}`,
        at: a.now,
        gross,
        commission: gross - b.payout,
        net: b.payout,
        kind: 'booking',
      });
    }
    case 'TOGGLE_SLOT': {
      const cur = s.schedule[a.day];
      const next = cur.includes(a.slot) ? cur.filter((x) => x !== a.slot) : [...cur, a.slot];
      return { ...s, schedule: { ...s.schedule, [a.day]: next } };
    }
    case 'TOGGLE_LEAVE':
      return { ...s, leaveDates: s.leaveDates.includes(a.date) ? s.leaveDates.filter((d) => d !== a.date) : [...s.leaveDates, a.date].sort() };
    case 'UPDATE_SERVICE':
      return {
        ...s,
        services: s.services.map((x) =>
          x.id === a.id ? { ...x, enabled: a.enabled ?? x.enabled, rate: a.rate ?? x.rate } : x,
        ),
      };

    /* ------------------------------------------------------------ Shared */
    case 'REQUEST_PAYOUT': {
      if (!role) return s;
      const balance = s.ledger[role].reduce((sum, e) => sum + e.net, 0);
      if (balance <= 0) return s;
      const bank = role === 'vendor' ? s.vendorProfile.bank : s.caretakerProfile.bank;
      const next = addLedger(s, role, {
        id: `pay-${a.now}`,
        ref: `UTR ${String(a.now).slice(-8, -4)} ${String(a.now).slice(-4)}`,
        title: `Payout to ${bank.bank} ••${bank.last4}`,
        at: a.now,
        gross: 0,
        commission: 0,
        net: -balance,
        kind: 'payout',
      });
      return { ...next, notifications: notify(s, { title: 'Payout initiated', text: `₹${balance.toLocaleString('en-IN')} will reach ${bank.bank} ••${bank.last4} within 24 hours.`, at: a.now, role }) };
    }
    case 'READ_NOTIFICATIONS':
      return s.notifications.some((n) => !n.read) ? { ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) } : s;
    case 'UPDATE_SETTINGS':
      return { ...s, settings: { ...s.settings, ...a.patch } };

    case 'TICK':
      return tick(s, a.now, a.rand);
  }
  return s;
}

/** Time-driven demo behaviour. Returns the same object when nothing changed. */
export function tick(s: PartnerState, now: number, rand: number): PartnerState {
  let next = s;
  const edit = (fn: (x: PartnerState) => PartnerState) => {
    next = fn(next);
  };

  for (const o of s.orders) {
    if (o.status === 'new' && now > o.acceptBy) {
      edit((x) => ({
        ...mapOrder(x, o.id, (y) => ({ ...y, status: 'rejected', rejectReason: 'Not accepted in time', seen: true, completedAt: now })),
        notifications: notify(x, { title: 'Order missed', text: `${o.code} was passed to another pharmacy because it was not accepted in time.`, at: now, role: 'vendor' }),
      }));
    } else if (o.status === 'quote_sent' && o.quoteSentAt && now >= o.quoteSentAt + DEMO.quoteConfirm) {
      edit((x) => ({
        ...mapOrder(x, o.id, (y) => ({ ...y, status: 'packing' })),
        notifications: notify(x, { title: 'Quote confirmed', text: `${o.customerName} confirmed and paid ₹${orderTotal(o).toLocaleString('en-IN')} for ${o.code}. Start packing.`, at: now, role: 'vendor' }),
      }));
    } else if (o.status === 'ready' && !o.rider && o.readyAt && now >= o.readyAt + DEMO.riderAssign) {
      const rider = RIDERS[Math.floor(rand * RIDERS.length) % RIDERS.length];
      edit((x) => ({
        ...mapOrder(x, o.id, (y) => ({ ...y, rider })),
        notifications: notify(x, { title: 'Rider assigned', text: `${rider.name} is coming to pick up ${o.code}.`, at: now, role: 'vendor' }),
      }));
    }
  }

  for (const b of s.bookings) {
    if (b.status === 'requested' && now > b.respondBy) {
      edit((x) => mapBooking(x, b.id, (y) => ({ ...y, status: 'declined', declineReason: 'Request expired', seen: true })));
    } else if (b.status === 'completed' && b.rating == null && b.completedAt && now >= b.completedAt + DEMO.ratingAfter) {
      const stars = 5;
      edit((x) => ({
        ...mapBooking(x, b.id, (y) => ({ ...y, rating: stars })),
        reviews: [
          { id: `r-${b.id}`, name: b.familyName, stars, text: `Thank you for taking such good care of ${b.patientName.split(' ')[0]}. Very professional and kind.`, at: now, service: b.serviceName },
          ...x.reviews,
        ],
        notifications: notify(x, { title: 'New 5-star rating', text: `${b.familyName} rated your ${b.serviceName.toLowerCase()} for ${b.patientName}.`, at: now, role: 'caretaker' }),
      }));
    }
  }

  // New arrivals: one pending order or request at a time, only while open/available.
  const { role, kycStatus } = s.session;
  if (kycStatus === 'approved' && role) {
    const live = role === 'vendor' ? s.isStoreOpen : s.isAvailable;
    const pending = role === 'vendor' ? next.orders.some((o) => o.status === 'new') : next.bookings.some((b) => b.status === 'requested');
    if (live && !pending) {
      if (!next.nextArrivalAt) {
        edit((x) => ({ ...x, nextArrivalAt: now + DEMO.arrivalGap }));
      } else if (now >= next.nextArrivalAt) {
        const gap = DEMO.arrivalGap + Math.floor(rand * 30) * SEC;
        if (role === 'vendor') {
          const order = makeOrder(s.arrivals, now, rand, s.settings.orderAcceptMinutes);
          edit((x) => ({
            ...x,
            orders: [order, ...x.orders],
            arrivals: x.arrivals + 1,
            nextArrivalAt: now + gap,
            notifications: notify(x, { title: order.prescription ? 'New prescription order' : 'New order', text: `${order.code} from ${order.customerArea}. Accept within ${s.settings.orderAcceptMinutes} minutes.`, at: now, role: 'vendor' }),
          }));
        } else {
          const startAt = nextOpenSlot(next, now);
          const req = startAt ? makeRequest(s.arrivals, now, startAt, s.services, rand) : null;
          edit((x) =>
            req
              ? {
                  ...x,
                  bookings: [req, ...x.bookings],
                  arrivals: x.arrivals + 1,
                  nextArrivalAt: now + gap,
                  notifications: notify(x, { title: 'New booking request', text: `${req.serviceName} for ${req.patientName} in ${req.area}.`, at: now, role: 'caretaker' }),
                }
              : { ...x, nextArrivalAt: now + gap },
          );
        }
      }
    }
  }
  return next;
}

/* ------------------------------------------------------------------ Provider */

type Ctx = PartnerState & {
  hydrated: boolean;
  dispatch: React.Dispatch<Action>;
};

const PartnerContext = createContext<Ctx | null>(null);

export function PartnerStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState(Date.now()));
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(PARTNER_STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<PartnerState>;
        dispatch({ type: 'HYDRATE', state: { ...initialState(Date.now()), ...saved } });
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  // Save after hydration, batched so the 1-second tick does not write on every change.
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(PARTNER_STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
    }, 400);
  }, [hydrated, state]);

  useEffect(() => {
    if (!hydrated) return;
    const id = setInterval(() => dispatch({ type: 'TICK', now: Date.now(), rand: Math.random() }), 1000);
    return () => clearInterval(id);
  }, [hydrated]);

  const value = useMemo(() => ({ ...state, hydrated, dispatch }), [state, hydrated]);
  return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
}

export function usePartnerStore(): Ctx {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error('usePartnerStore must be used inside PartnerStoreProvider');
  return ctx;
}

/** Re-renders the caller every `ms` so countdowns and timers stay live. */
export function useNow(ms = 1000): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}
