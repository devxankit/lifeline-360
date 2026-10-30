import { DEMO, earningsSummary, initialState, nextOpenSlot, orderTotal, reducer } from '../src/store/PartnerStore';
import { PartnerState, WeeklySchedule } from '../src/store/types';
import { isoDate, startOfDay } from '../src/ui/utils/format';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// A Wednesday morning, so schedule-based tests are stable.
const NOW = new Date(2026, 9, 28, 9, 0, 0).getTime();

function approved(role: 'vendor' | 'caretaker'): PartnerState {
  let s = initialState(NOW);
  s = reducer(s, { type: 'LOGIN_PHONE', phone: '9876543210' });
  s = reducer(s, { type: 'VERIFY_OTP' });
  s = reducer(s, { type: 'SELECT_ROLE', role });
  s = reducer(s, { type: 'SUBMIT_KYC' });
  return reducer(s, { type: 'APPROVE_KYC', now: NOW });
}

/** Tick until the simulator creates something (or give up). */
function tickUntil(s: PartnerState, done: (x: PartnerState) => boolean, from = NOW) {
  let t = from;
  for (let i = 0; i < 400 && !done(s); i++) {
    t += 1000;
    s = reducer(s, { type: 'TICK', now: t, rand: 0.42 });
  }
  return { s, t };
}

test('a normal order goes new → packing → ready → completed and lands in earnings', () => {
  const start = approved('vendor');
  let { s, t } = tickUntil(start, (x) => x.orders.some((o) => o.status === 'new'));
  const order = s.orders.find((o) => o.status === 'new')!;
  expect(order.prescription).toBeUndefined();

  s = reducer(s, { type: 'ACCEPT_ORDER', id: order.id });
  expect(s.orders.find((o) => o.id === order.id)!.status).toBe('packing');

  const stockBefore = s.catalogue.find((m) => m.id === order.items[0].medId)!.stock;
  s = reducer(s, { type: 'MARK_READY', id: order.id, now: t });
  expect(s.orders.find((o) => o.id === order.id)!.status).toBe('ready');
  expect(s.catalogue.find((m) => m.id === order.items[0].medId)!.stock).toBe(stockBefore - order.items[0].qty);

  // Handover is refused until a rider is assigned.
  expect(reducer(s, { type: 'HANDOVER', id: order.id, now: t })).toBe(s);
  s = reducer(s, { type: 'TICK', now: t + DEMO.riderAssign, rand: 0.1 });
  expect(s.orders.find((o) => o.id === order.id)!.rider).toBeDefined();

  const ledgerBefore = s.ledger.vendor.length;
  s = reducer(s, { type: 'HANDOVER', id: order.id, now: t + DEMO.riderAssign + 1000 });
  expect(s.orders.find((o) => o.id === order.id)!.status).toBe('completed');
  const entry = s.ledger.vendor[ledgerBefore];
  expect(entry.gross).toBe(orderTotal(order));
  expect(entry.gross - entry.commission).toBe(entry.net);
});

test('a prescription order is quoted, confirmed by the customer, then packed', () => {
  let s = approved('vendor');
  s = { ...s, arrivals: 2 }; // every third arrival carries a prescription
  let t: number;
  ({ s, t } = tickUntil(s, (x) => x.orders.some((o) => o.status === 'new')));
  const order = s.orders.find((o) => o.status === 'new')!;
  expect(order.prescription).toBeDefined();
  expect(order.items).toHaveLength(0);

  // Accepting without a quote does nothing for an Rx order.
  expect(reducer(s, { type: 'ACCEPT_ORDER', id: order.id }).orders.find((o) => o.id === order.id)!.status).toBe('new');

  const telma = s.catalogue.find((m) => m.id === 'm6')!;
  s = reducer(s, { type: 'SEND_QUOTE', id: order.id, now: t, items: [{ medId: telma.id, name: telma.name, pack: telma.pack, qty: 2, price: telma.price, rx: true, packed: false, unavailable: false }] });
  expect(s.orders.find((o) => o.id === order.id)!.status).toBe('quote_sent');
  s = reducer(s, { type: 'TICK', now: t + DEMO.quoteConfirm, rand: 0.5 });
  expect(s.orders.find((o) => o.id === order.id)!.status).toBe('packing');
});

test('an order not accepted in time is marked missed, and only one new order waits at a time', () => {
  let { s, t } = tickUntil(approved('vendor'), (x) => x.orders.some((o) => o.status === 'new'));
  const order = s.orders.find((o) => o.status === 'new')!;
  s = reducer(s, { type: 'TICK', now: t + 60000, rand: 0.5 });
  expect(s.orders.filter((o) => o.status === 'new')).toHaveLength(1);
  s = reducer(s, { type: 'TICK', now: order.acceptBy + 1, rand: 0.5 });
  const missed = s.orders.find((o) => o.id === order.id)!;
  expect(missed.status).toBe('rejected');
  expect(missed.rejectReason).toBe('Not accepted in time');
});

test('no orders arrive while the store is closed', () => {
  let s = approved('vendor');
  s = reducer(s, { type: 'SET_OPEN', open: false, now: NOW });
  const { s: after } = tickUntil(s, () => false);
  expect(after.orders.some((o) => o.status === 'new')).toBe(false);
});

test('unavailable items are left out of the total and the stock', () => {
  let s = approved('vendor');
  const order = s.orders.find((o) => o.status === 'packing')!;
  const dropped = order.items[0];
  s = reducer(s, { type: 'SET_UNAVAILABLE', id: order.id, medId: dropped.medId, unavailable: true, substitute: 'Something else' });
  const updated = s.orders.find((o) => o.id === order.id)!;
  expect(orderTotal(updated)).toBe(orderTotal(order) - dropped.qty * dropped.price);
  const stockBefore = s.catalogue.find((m) => m.id === dropped.medId)!.stock;
  s = reducer(s, { type: 'MARK_READY', id: order.id, now: NOW });
  expect(s.catalogue.find((m) => m.id === dropped.medId)!.stock).toBe(stockBefore);
});

test('a booking goes requested → accepted → on the way → in progress → completed, then gets rated', () => {
  let { s, t } = tickUntil(approved('caretaker'), (x) => x.bookings.some((b) => b.status === 'requested'));
  const b = s.bookings.find((x) => x.status === 'requested')!;
  s = reducer(s, { type: 'ACCEPT_BOOKING', id: b.id });
  s = reducer(s, { type: 'START_TRAVEL', id: b.id });
  expect(s.bookings.find((x) => x.id === b.id)!.status).toBe('on_the_way');
  s = reducer(s, { type: 'CHECK_IN', id: b.id, distanceM: 40, now: t });
  s = reducer(s, { type: 'TOGGLE_TASK', id: b.id, taskId: 't0', now: t + 1000 });
  expect(s.bookings.find((x) => x.id === b.id)!.tasks[0].done).toBe(true);

  const before = earningsSummary(s.ledger.caretaker, t).balance;
  s = reducer(s, { type: 'COMPLETE_BOOKING', id: b.id, now: t + 2000 });
  expect(s.bookings.find((x) => x.id === b.id)!.status).toBe('completed');
  expect(earningsSummary(s.ledger.caretaker, t + 2000).balance).toBe(before + b.payout);

  s = reducer(s, { type: 'TICK', now: t + 2000 + DEMO.ratingAfter, rand: 0.5 });
  expect(s.bookings.find((x) => x.id === b.id)!.rating).toBe(5);
  expect(s.reviews[0].id).toBe(`r-${b.id}`);
});

test('requests only use open slots and skip leave days', () => {
  const onlyFriday: WeeklySchedule = { mon: [], tue: [], wed: [], thu: [], fri: ['afternoon'], sat: [], sun: [] };
  const friday = startOfDay(NOW) + 2 * 86400000; // NOW is a Wednesday
  expect(nextOpenSlot({ schedule: onlyFriday, leaveDates: [] }, NOW)).toBe(friday + 14 * 3600000);
  // Friday on leave leaves no open slot inside the 7-day window.
  expect(nextOpenSlot({ schedule: onlyFriday, leaveDates: [isoDate(friday)] }, NOW)).toBeNull();

  const closed: WeeklySchedule = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
  let s = { ...approved('caretaker'), schedule: closed };
  ({ s } = tickUntil(s, () => false));
  expect(s.bookings.some((b) => b.status === 'requested')).toBe(false);
});

test('payout empties the balance and logout resets the session', () => {
  let s = approved('vendor');
  expect(earningsSummary(s.ledger.vendor, NOW).balance).toBeGreaterThan(0);
  s = reducer(s, { type: 'REQUEST_PAYOUT', now: NOW });
  expect(earningsSummary(s.ledger.vendor, NOW).balance).toBe(0);
  expect(reducer(s, { type: 'REQUEST_PAYOUT', now: NOW })).toBe(s);
  s = reducer(s, { type: 'LOGOUT', now: NOW });
  expect(s.session.isLoggedIn).toBe(false);
  expect(s.session.role).toBeNull();
});
