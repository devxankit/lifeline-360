import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceKey } from '../theme';

/* ------------------------------------------------------------------ Types */

export type User = { phone: string; name: string; gender: string; dob: string; bloodGroup: string; email: string };
export type Address = { id: string; label: string; line: string; area: string; city: string; pincode: string };
export type Member = { id: string; name: string; relation: string; age: string; gender: string };
export type Contact = { id: string; name: string; relation: string; phone: string };

export type Booking = {
  id: string;
  service: ServiceKey;
  title: string;
  subtitle: string;
  when: string;
  status: string;
  amount: number | null;
  createdAt: number;
  /** Service-specific details (doctor id, items, address, mode…). */
  meta: Record<string, any>;
};

export type Notice = { id: string; title: string; text: string; at: number; read: boolean; service?: ServiceKey };

export type Membership = { plan: 'monthly' | 'annual'; memberId: string; validTill: string; autoRenew: boolean; members: string[]; startedAt: number };

type State = {
  onboarded: boolean;
  user: User | null;
  addresses: Address[];
  addressId: string | null;
  family: Member[];
  contacts: Contact[];
  medCart: Record<string, number>;
  rxUploaded: boolean;
  labCart: string[];
  bookings: Booking[];
  notices: Notice[];
  membership: Membership | null;
  prefs: { bookings: boolean; offers: boolean; reminders: boolean; reports: boolean; whatsapp: boolean };
};

const INITIAL: State = {
  onboarded: false,
  user: null,
  addresses: [
    { id: 'a1', label: 'Home', line: '12th Main, HAL 2nd Stage', area: 'Indiranagar', city: 'Bengaluru', pincode: '560038' },
    { id: 'a2', label: 'Parents', line: '4th Cross, 9th Block', area: 'Jayanagar', city: 'Bengaluru', pincode: '560069' },
  ],
  addressId: 'a1',
  family: [
    { id: 'f1', name: 'Vikram Rao', relation: 'Spouse', age: '36', gender: 'Male' },
    { id: 'f2', name: 'K. Raghavan', relation: 'Father', age: '68', gender: 'Male' },
  ],
  contacts: [{ id: 'e1', name: 'Vikram Rao', relation: 'Spouse', phone: '98450 11223' }],
  medCart: {},
  rxUploaded: false,
  labCart: [],
  bookings: [],
  notices: [],
  membership: null,
  prefs: { bookings: true, offers: false, reminders: true, reports: true, whatsapp: true },
};

const KEY = 'lifeline360.user.v1';

/** Seed history so a fresh demo account does not look empty. */
function seedBookings(): Booking[] {
  const now = Date.now();
  const day = 86400000;
  return [
    {
      id: 'LL-D-40912', service: 'doctor', title: 'Dr. Arjun Mehta', subtitle: 'Cardiologist · Video consultation', when: 'Tomorrow, 10:30 AM',
      status: 'Confirmed', amount: 800, createdAt: now - day, meta: { doctorId: 'd1', mode: 'video', slot: '10:30 AM', patient: 'Self' },
    },
    {
      id: 'LL-M-20417', service: 'medicine', title: 'Medicine order · 3 items', subtitle: 'Sri Sai Medicals', when: 'Arriving by 6:00 PM',
      status: 'Out for delivery', amount: 642, createdAt: now - 3600000, meta: { items: [['m6', 2], ['m7', 1], ['m1', 1]], step: 3 },
    },
    {
      id: 'LL-L-11872', service: 'lab', title: 'Full body checkup', subtitle: 'Home sample collection', when: '6 Nov, 7:00 – 8:00 AM',
      status: 'Report ready', amount: 1499, createdAt: now - 3 * day, meta: { items: ['l1'], step: 4, patient: 'Self' },
    },
    {
      id: 'LL-N-07731', service: 'nursing', title: 'Elderly care · 12-hour day shift', subtitle: 'Sunita Rao · for K. Raghavan', when: '2 Nov, 8:00 AM',
      status: 'Completed', amount: 1200, createdAt: now - 6 * day, meta: { serviceId: 'n1', caretakerId: 'c1', step: 3 },
    },
  ];
}

/* ---------------------------------------------------------------- Context */

type Store = State & {
  hydrated: boolean;
  completeOnboarding: () => void;
  login: (phone: string) => void;
  saveProfile: (u: Partial<User>) => void;
  logout: () => void;
  selectAddress: (id: string) => void;
  saveAddress: (a: Address) => void;
  removeAddress: (id: string) => void;
  saveMember: (m: Member) => void;
  removeMember: (id: string) => void;
  saveContact: (c: Contact) => void;
  removeContact: (id: string) => void;
  setCartQty: (id: string, qty: number) => void;
  clearMedCart: () => void;
  setRxUploaded: (v: boolean) => void;
  toggleLab: (id: string) => void;
  clearLabCart: () => void;
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking> | ((b: Booking) => Partial<Booking>)) => void;
  notify: (n: Omit<Notice, 'id' | 'at' | 'read'>) => void;
  markNoticesRead: () => void;
  activateMembership: (plan: 'monthly' | 'annual') => void;
  updateMembership: (patch: Partial<Membership>) => void;
  setPref: (k: keyof State['prefs'], v: boolean) => void;
};

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(INITIAL);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setState({ ...INITIAL, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
    }, 250);
  }, [state, hydrated]);

  const set = useCallback((fn: (s: State) => Partial<State>) => setState((s) => ({ ...s, ...fn(s) })), []);

  const notify = useCallback(
    (n: Omit<Notice, 'id' | 'at' | 'read'>) =>
      set((s) => ({ notices: [{ ...n, id: String(Date.now() + Math.random()), at: Date.now(), read: false }, ...s.notices].slice(0, 40) })),
    [set],
  );

  const actions = useMemo(
    () => ({
      completeOnboarding: () => set(() => ({ onboarded: true })),
      login: (phone: string) =>
        set((s) => ({
          user: s.user && s.user.phone === phone ? s.user : { phone, name: '', gender: '', dob: '', bloodGroup: '', email: '' },
          bookings: s.bookings.length ? s.bookings : seedBookings(),
          notices: s.notices.length
            ? s.notices
            : [
                { id: 'n1', title: 'Report ready', text: 'Your Full body checkup report is ready to view.', at: Date.now() - 7200000, read: false, service: 'lab' as ServiceKey },
                { id: 'n2', title: 'Order out for delivery', text: 'Order LL-M-20417 will arrive by 6:00 PM.', at: Date.now() - 3600000, read: false, service: 'medicine' as ServiceKey },
              ],
        })),
      saveProfile: (u: Partial<User>) => set((s) => ({ user: { ...(s.user as User), ...u } })),
      logout: () => set(() => ({ user: null, medCart: {}, labCart: [], rxUploaded: false })),
      selectAddress: (id: string) => set(() => ({ addressId: id })),
      saveAddress: (a: Address) =>
        set((s) => ({ addresses: s.addresses.some((x) => x.id === a.id) ? s.addresses.map((x) => (x.id === a.id ? a : x)) : [...s.addresses, a] })),
      removeAddress: (id: string) =>
        set((s) => ({ addresses: s.addresses.filter((x) => x.id !== id), addressId: s.addressId === id ? s.addresses[0]?.id ?? null : s.addressId })),
      saveMember: (m: Member) =>
        set((s) => ({ family: s.family.some((x) => x.id === m.id) ? s.family.map((x) => (x.id === m.id ? m : x)) : [...s.family, m] })),
      removeMember: (id: string) => set((s) => ({ family: s.family.filter((x) => x.id !== id) })),
      saveContact: (c: Contact) =>
        set((s) => ({ contacts: s.contacts.some((x) => x.id === c.id) ? s.contacts.map((x) => (x.id === c.id ? c : x)) : [...s.contacts, c] })),
      removeContact: (id: string) => set((s) => ({ contacts: s.contacts.filter((x) => x.id !== id) })),
      setCartQty: (id: string, qty: number) =>
        set((s) => {
          const next = { ...s.medCart };
          if (qty <= 0) delete next[id];
          else next[id] = qty;
          return { medCart: next };
        }),
      clearMedCart: () => set(() => ({ medCart: {}, rxUploaded: false })),
      setRxUploaded: (v: boolean) => set(() => ({ rxUploaded: v })),
      toggleLab: (id: string) => set((s) => ({ labCart: s.labCart.includes(id) ? s.labCart.filter((x) => x !== id) : [...s.labCart, id] })),
      clearLabCart: () => set(() => ({ labCart: [] })),
      addBooking: (b: Booking) => set((s) => ({ bookings: [b, ...s.bookings] })),
      updateBooking: (id: string, patch: Partial<Booking> | ((b: Booking) => Partial<Booking>)) =>
        set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...(typeof patch === 'function' ? patch(b) : patch) } : b)) })),
      notify,
      markNoticesRead: () => set((s) => ({ notices: s.notices.map((n) => ({ ...n, read: true })) })),
      activateMembership: (plan: 'monthly' | 'annual') =>
        set(() => {
          const d = new Date();
          d.setMonth(d.getMonth() + (plan === 'annual' ? 12 : 1));
          return {
            membership: {
              plan,
              memberId: 'LL36 ' + String(Math.floor(1000 + Math.random() * 9000)) + ' ' + String(Math.floor(1000 + Math.random() * 9000)),
              validTill: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              autoRenew: true,
              members: ['self'],
              startedAt: Date.now(),
            },
          };
        }),
      updateMembership: (patch: Partial<Membership>) => set((s) => ({ membership: s.membership ? { ...s.membership, ...patch } : null })),
      setPref: (k: keyof State['prefs'], v: boolean) => set((s) => ({ prefs: { ...s.prefs, [k]: v } })),
    }),
    [set, notify],
  );

  const value = useMemo(() => ({ ...state, hydrated, ...actions }), [state, hydrated, actions]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside AppStoreProvider');
  return s;
}

export const newId = (prefix: string) => `LL-${prefix}-${String(Math.floor(10000 + Math.random() * 89999))}`;
