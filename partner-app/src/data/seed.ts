/**
 * Sample data for the demo build. Medicine names, nursing services and booking IDs
 * match the User app, so the two apps can be shown side by side.
 */
import { startOfDay } from '../ui/utils/format';
import {
  Booking,
  CareService,
  CareTask,
  Category,
  KycDocumentItem,
  LedgerEntry,
  Medicine,
  OrderItem,
  PartnerRole,
  Prescription,
  Review,
  Rider,
  VendorOrder,
  VendorProfile,
  CaretakerProfile,
  WeeklySchedule,
} from '../store/types';

const HOUR = 3600000;
const DAY = 24 * HOUR;

/** Share of each sale or shift kept by Lifeline (placeholder until the client confirms). */
export const COMMISSION: Record<PartnerRole, number> = { vendor: 0.1, caretaker: 0.15 };

export const VENDOR_PROFILE: VendorProfile = {
  storeName: 'Sri Sai Medicals',
  ownerName: 'Ramesh Sharma',
  pharmacistName: 'Ramesh Sharma, B.Pharm',
  pharmacistReg: 'KSPC-29410',
  drugLicence: 'KA-B1-20B-88291',
  gstin: '29ABCDE1234F1Z5',
  address: '14, 12th Main Road, HAL 2nd Stage',
  area: 'Indiranagar',
  city: 'Bengaluru',
  pincode: '560038',
  opensAt: '8:00 AM',
  closesAt: '11:00 PM',
  deliveryRadiusKm: 5,
  rating: 4.8,
  bank: { bank: 'HDFC Bank', holder: 'Sri Sai Medicals', last4: '4012', ifsc: 'HDFC0001234' },
};

export const CARETAKER_PROFILE: CaretakerProfile = {
  fullName: 'Sunita Rao',
  title: 'Registered nurse (GNM)',
  councilReg: 'KNC-84920',
  experienceYears: 8,
  languages: ['Kannada', 'Hindi', 'English'],
  skills: ['Vitals monitoring', 'Wound dressing', 'IV & injections', 'Catheter care', 'Elderly mobility', 'Diabetic care'],
  bio: 'Eight years in post-operative and elderly care at Manipal Hospital and in home care. Calm, punctual and careful with medicine schedules.',
  area: 'Indiranagar',
  city: 'Bengaluru',
  bank: { bank: 'State Bank of India', holder: 'Sunita Rao', last4: '7731', ifsc: 'SBIN0004567' },
};

export const DOCUMENTS: Record<PartnerRole, KycDocumentItem[]> = {
  vendor: [
    { id: 'dl', title: 'Drug licence (Form 20 / 21)', description: 'Retail drug licence from the State Drug Controller', numberLabel: 'Licence number', needsExpiry: true, status: 'missing' },
    { id: 'gst', title: 'GST certificate', description: 'GSTIN registration certificate', numberLabel: 'GSTIN', status: 'missing' },
    { id: 'pharmacist', title: 'Pharmacist registration', description: 'State Pharmacy Council certificate', numberLabel: 'Registration number', needsExpiry: true, status: 'missing' },
    { id: 'shop', title: 'Shop photo', description: 'Front of the pharmacy with the signboard visible', status: 'missing' },
    { id: 'id', title: 'Owner ID proof', description: 'Aadhaar or PAN card of the proprietor', numberLabel: 'ID number', status: 'missing' },
  ],
  caretaker: [
    { id: 'cert', title: 'Nursing certificate', description: 'GNM, ANM, BSc Nursing or caregiver certificate', numberLabel: 'Council registration number', needsExpiry: true, status: 'missing' },
    { id: 'id', title: 'Government photo ID', description: 'Aadhaar, voter ID or passport', numberLabel: 'ID number', status: 'missing' },
    { id: 'police', title: 'Police verification', description: 'Police clearance certificate from your city', numberLabel: 'Certificate number', needsExpiry: true, status: 'missing' },
    { id: 'photo', title: 'Profile photo', description: 'Clear, front-facing photo in uniform', status: 'missing' },
  ],
};

export const CATEGORIES: Category[] = [
  { id: 'fever', label: 'Fever & pain', hidden: false },
  { id: 'diabetes', label: 'Diabetes', hidden: false },
  { id: 'heart', label: 'Heart care', hidden: false },
  { id: 'vitamins', label: 'Vitamins', hidden: false },
  { id: 'digestion', label: 'Digestion', hidden: false },
  { id: 'skin', label: 'Skin care', hidden: false },
  { id: 'baby', label: 'Baby care', hidden: false },
  { id: 'devices', label: 'Devices', hidden: false },
];

export const CATEGORY_TINT: Record<string, { bg: string; fg: string }> = {
  fever: { bg: '#FDECEC', fg: '#D13238' },
  diabetes: { bg: '#E3EFFB', fg: '#1D6FAE' },
  heart: { bg: '#FDE8EF', fg: '#C62E57' },
  vitamins: { bg: '#FFF6DA', fg: '#C99A12' },
  digestion: { bg: '#E2F5EA', fg: '#1A8A57' },
  skin: { bg: '#ECE9FB', fg: '#6F5BC9' },
  baby: { bg: '#DDF1EC', fg: '#128078' },
  devices: { bg: '#F2F4F3', fg: '#4A5170' },
};
export const tintFor = (category: string) => CATEGORY_TINT[category] ?? { bg: '#E6F5F2', fg: '#128078' };

const med = (
  id: string, name: string, maker: string, category: string, pack: string,
  mrp: number, price: number, stock: number, rx: boolean,
): Medicine => ({ id, name, maker, category, pack, mrp, price, stock, lowStockAt: 10, rx, inStock: stock > 0 });

export const CATALOGUE: Medicine[] = [
  med('m1', 'Dolo 650 Tablet', 'Micro Labs', 'fever', 'Strip of 15 tablets', 34, 31, 64, false),
  med('m2', 'Crocin Advance', 'GSK', 'fever', 'Strip of 20 tablets', 46, 42, 8, false),
  med('m3', 'Volini Pain Relief Gel', 'Sun Pharma', 'fever', 'Tube of 75 g', 245, 221, 18, false),
  med('m4', 'Glycomet 500 SR', 'USV', 'diabetes', 'Strip of 20 tablets', 52, 47, 26, true),
  med('m5', 'Accu-Chek Active Strips', 'Roche', 'diabetes', 'Box of 50 strips', 1199, 999, 12, false),
  med('m6', 'Telma 40 Tablet', 'Glenmark', 'heart', 'Strip of 30 tablets', 238, 214, 24, true),
  med('m7', 'Ecosprin 75 Tablet', 'USV', 'heart', 'Strip of 14 tablets', 6, 5, 80, true),
  med('m8', 'Becosules Capsule', 'Pfizer', 'vitamins', 'Strip of 20 capsules', 52, 47, 30, false),
  med('m9', 'Shelcal 500', 'Torrent', 'vitamins', 'Bottle of 15 tablets', 128, 115, 5, false),
  med('m10', 'Digene Antacid Gel', 'Abbott', 'digestion', 'Bottle of 200 ml', 145, 131, 15, false),
  med('m11', 'Electral ORS Powder', 'FDC', 'digestion', 'Pack of 5 sachets', 110, 99, 40, false),
  med('m12', 'Cetaphil Gentle Cleanser', 'Galderma', 'skin', 'Bottle of 125 ml', 399, 359, 9, false),
  med('m13', 'Himalaya Baby Lotion', 'Himalaya', 'baby', 'Bottle of 200 ml', 225, 202, 14, false),
  med('m14', 'Omron Digital BP Monitor', 'Omron', 'devices', '1 unit', 2490, 1990, 4, false),
  med('m15', 'Pulse Oximeter', 'Dr Trust', 'devices', '1 unit', 1499, 899, 7, false),
  med('m16', 'Pan 40 Tablet', 'Alkem', 'digestion', 'Strip of 15 tablets', 155, 140, 0, true),
];

export const REJECT_REASONS = {
  vendor: ['Items out of stock', 'Prescription unclear or invalid', 'Store closing soon', 'Outside delivery area', 'Other'],
  caretaker: ['Not available at that time', 'Too far from my location', 'Service not in my skills', 'Personal emergency', 'Other'],
};

export const RIDERS: Rider[] = [
  { name: 'Manjunath K', phone: '98860 41207', vehicle: 'KA 03 HX 2291 · Activa' },
  { name: 'Syed Farhan', phone: '97412 08853', vehicle: 'KA 01 JM 7740 · Jupiter' },
  { name: 'Prakash Gowda', phone: '99011 56230', vehicle: 'KA 05 KP 1186 · Splendor' },
];

export const CARE_SERVICES: CareService[] = [
  { id: 'n1', name: 'Elderly care', unit: '12-hour shift', rate: 1020, enabled: true },
  { id: 'n2', name: 'Post-surgery care', unit: '12-hour shift', rate: 1275, enabled: true },
  { id: 'n3', name: 'Nurse visit', unit: 'per visit', rate: 425, enabled: true },
  { id: 'n4', name: 'Mother & baby care', unit: '12-hour shift', rate: 1100, enabled: false },
  { id: 'n5', name: 'Physiotherapy at home', unit: 'per session', rate: 595, enabled: false },
];

export const SCHEDULE: WeeklySchedule = {
  mon: ['morning', 'afternoon'],
  tue: ['morning', 'afternoon'],
  wed: ['morning', 'afternoon'],
  thu: ['morning', 'afternoon'],
  fri: ['morning', 'afternoon'],
  sat: ['morning'],
  sun: [],
};

export const SLOTS: { key: 'morning' | 'afternoon' | 'night'; label: string; hours: string; startHour: number }[] = [
  { key: 'morning', label: 'Morning', hours: '8 AM – 2 PM', startHour: 8 },
  { key: 'afternoon', label: 'Afternoon', hours: '2 PM – 8 PM', startHour: 14 },
  { key: 'night', label: 'Night', hours: '8 PM – 8 AM', startHour: 20 },
];

/* ------------------------------------------------------ Order templates */

const line = (m: Medicine, qty: number): OrderItem => ({
  medId: m.id, name: m.name, pack: m.pack, qty, price: m.price, rx: m.rx, packed: false, unavailable: false,
});
const byId = (id: string) => CATALOGUE.find((m) => m.id === id)!;

const CUSTOMERS = [
  { name: 'Meera Rao', area: 'Indiranagar', address: 'Flat 302, Prestige Shantiniketan, 100 Feet Road, Indiranagar', km: 1.2 },
  { name: 'Arvind Kulkarni', area: 'Domlur', address: '27, 2nd Cross, Domlur Layout', km: 2.6 },
  { name: 'Fathima Begum', area: 'HAL 3rd Stage', address: '8/1, 5th Main, HAL 3rd Stage', km: 1.9 },
  { name: 'Rohan Shetty', area: 'Jeevan Bima Nagar', address: '112, 12th Cross, Jeevan Bima Nagar', km: 3.4 },
  { name: 'Lakshmi Narayan', area: 'Kodihalli', address: 'Villa 6, Embassy Pristine, Kodihalli', km: 2.2 },
  { name: 'Deepak Menon', area: 'CV Raman Nagar', address: '41, DRDO Township, CV Raman Nagar', km: 4.1 },
];

const NORMAL_BASKETS: [string, number][][] = [
  [['m1', 2], ['m11', 1], ['m8', 1]],
  [['m5', 1], ['m15', 1]],
  [['m10', 1], ['m3', 1]],
  [['m9', 2], ['m13', 1], ['m2', 1]],
  [['m12', 1], ['m1', 1]],
];

const PRESCRIPTIONS: Prescription[] = [
  { doctor: 'Dr. Arjun Mehta, MD, DM', clinic: 'Manipal Hospital, Old Airport Road', date: '', lines: ['Tab. Telma 40 — 1-0-0 × 30 days', 'Tab. Ecosprin 75 — 0-1-0 × 30 days', 'Tab. Glycomet 500 SR — 1-0-1 × 30 days'] },
  { doctor: 'Dr. Kavya Sharma, MD', clinic: 'CityCare Clinic, Domlur', date: '', lines: ['Tab. Pan 40 — 1-0-0 before breakfast × 14 days', 'Digene gel — 10 ml after meals SOS', 'Electral ORS — 1 sachet in 1 L water'] },
];

export const otp4 = (rand: number) => String(1000 + Math.floor(rand * 8999));
export const bookingCode = (prefix: 'M' | 'N', rand: number) => `LL-${prefix}-${String(10000 + Math.floor(rand * 89999))}`;

/** Builds the next simulated order. Every third one carries a prescription to quote. */
export function makeOrder(n: number, now: number, rand: number, acceptMinutes: number): VendorOrder {
  const c = CUSTOMERS[n % CUSTOMERS.length];
  const isRx = n % 3 === 2;
  const rx = isRx ? { ...PRESCRIPTIONS[n % PRESCRIPTIONS.length], date: '' } : undefined;
  return {
    id: `o-${now}`,
    code: bookingCode('M', rand),
    customerName: c.name,
    customerArea: c.area,
    address: c.address,
    distanceKm: c.km,
    placedAt: now,
    acceptBy: now + acceptMinutes * 60000,
    status: 'new',
    items: isRx ? [] : NORMAL_BASKETS[n % NORMAL_BASKETS.length].map(([id, q]) => line(byId(id), q)),
    prescription: rx,
    payment: n % 4 === 3 ? 'Cash on delivery' : 'Paid online',
    deliveryFee: 0,
    seen: false,
    handoverOtp: otp4(rand),
  };
}

/* ---------------------------------------------------- Booking templates */

const tasks = (labels: [string, string][]): CareTask[] =>
  labels.map(([time, label], i) => ({ id: `t${i}`, time, label, done: false }));

const SHIFT_TASKS = tasks([
  ['8:00 AM', 'Check vitals (BP, pulse, SpO₂, temperature)'],
  ['8:30 AM', 'Morning medicines after breakfast'],
  ['10:00 AM', 'Assisted walk, 15 minutes'],
  ['1:00 PM', 'Lunch and afternoon medicines'],
  ['4:00 PM', 'Check vitals and blood sugar'],
  ['7:30 PM', 'Dinner, evening medicines, handover notes'],
]);
const VISIT_TASKS = tasks([
  ['On arrival', 'Check vitals'],
  ['', 'Wound inspection and dressing change'],
  ['', 'Insulin injection as prescribed'],
  ['Before leaving', 'Dispose of sharps and update the family'],
]);

const PATIENTS = [
  { name: 'Shanta Iyer', age: 74, gender: 'Female' as const, condition: 'Knee replacement, day 6 after surgery. Needs help walking.', service: 'n2', area: 'Domlur', address: '27, 2nd Cross, Domlur Layout', km: 2.6, family: 'Arjun Iyer', relation: 'Son', notes: ['Walker at bedside, fall risk', 'Pain medicine every 8 hours', 'Diabetic, no sugar in tea'] },
  { name: 'Abdul Rahman', age: 66, gender: 'Male' as const, condition: 'Type 2 diabetes with a foot ulcer. Daily dressing.', service: 'n3', area: 'HAL 3rd Stage', address: '8/1, 5th Main, HAL 3rd Stage', km: 1.9, family: 'Fathima Begum', relation: 'Daughter', notes: ['Insulin pen in the fridge', 'Check blood sugar before injection'] },
  { name: 'Gopal Krishnan', age: 81, gender: 'Male' as const, condition: 'Early dementia, mild hypertension. Needs supervision.', service: 'n1', area: 'Kodihalli', address: 'Villa 6, Embassy Pristine, Kodihalli', km: 2.2, family: 'Lakshmi Narayan', relation: 'Daughter', notes: ['Gets anxious in the evening', 'Likes old Kannada songs', 'BP tablet at 8 AM'] },
];

/** Builds the next simulated booking request for a slot inside the caretaker's availability. */
export function makeRequest(n: number, now: number, startAt: number, services: CareService[], rand: number): Booking | null {
  const enabled = services.filter((s) => s.enabled);
  if (!enabled.length) return null;
  const preferred = PATIENTS.filter((p) => enabled.some((s) => s.id === p.service));
  const p = (preferred.length ? preferred : PATIENTS)[n % (preferred.length || PATIENTS.length)];
  const svc = enabled.find((s) => s.id === p.service) ?? enabled[n % enabled.length];
  const isVisit = svc.unit !== '12-hour shift';
  return {
    id: `b-${now}`,
    code: bookingCode('N', rand),
    patientName: p.name,
    patientAge: p.age,
    patientGender: p.gender,
    condition: p.condition,
    serviceId: svc.id,
    serviceName: svc.name,
    packageLabel: isVisit ? (svc.id === 'n5' ? 'Single session' : 'Single visit') : '12-hour shift',
    startAt,
    hours: isVisit ? 1 : 12,
    address: p.address,
    area: p.area,
    distanceKm: p.km,
    familyName: p.family,
    familyRelation: p.relation,
    careNotes: p.notes,
    tasks: isVisit ? VISIT_TASKS : SHIFT_TASKS,
    payout: svc.rate,
    status: 'requested',
    requestedAt: now,
    respondBy: now + 5 * 60000,
    seen: false,
    notes: '',
    completionOtp: otp4(rand),
  };
}

/* ------------------------------------------------------------ Seed state */

export function seedOrders(now: number): VendorOrder[] {
  const today = startOfDay(now);
  const done = (id: string, code: string, cIdx: number, basket: [string, number][], at: number, payment: VendorOrder['payment'] = 'Paid online'): VendorOrder => {
    const c = CUSTOMERS[cIdx];
    return {
      id, code, customerName: c.name, customerArea: c.area, address: c.address, distanceKm: c.km,
      placedAt: at - 40 * 60000, acceptBy: at - 37 * 60000, status: 'completed',
      items: basket.map(([mid, q]) => ({ ...line(byId(mid), q), packed: true })),
      payment, deliveryFee: 0, seen: true, readyAt: at - 10 * 60000, rider: RIDERS[cIdx % RIDERS.length],
      handoverOtp: '4821', completedAt: at,
    };
  };
  const packing: VendorOrder = {
    id: 'o-seed-packing', code: 'LL-M-20533', customerName: 'Arvind Kulkarni', customerArea: 'Domlur',
    address: CUSTOMERS[1].address, distanceKm: 2.6, placedAt: now - 6 * 60000, acceptBy: now - 3 * 60000,
    status: 'packing', items: [line(byId('m5'), 1), line(byId('m4'), 2), line(byId('m15'), 1)],
    payment: 'Paid online', deliveryFee: 0, seen: true, handoverOtp: '7305',
  };
  const earlier = Math.min(now - 2 * HOUR, today + 11 * HOUR);
  return [
    packing,
    // Same order the User app shows as "out for delivery".
    done('o-seed-1', 'LL-M-20417', 0, [['m1', 2], ['m8', 1], ['m11', 1]], earlier),
    done('o-seed-2', 'LL-M-20388', 4, [['m6', 1], ['m7', 2]], earlier - 2 * HOUR),
    done('o-seed-3', 'LL-M-20291', 2, [['m14', 1]], today - DAY + 18 * HOUR, 'Cash on delivery'),
    { ...done('o-seed-4', 'LL-M-20250', 3, [['m16', 2]], today - DAY + 15 * HOUR), status: 'rejected', completedAt: undefined, rejectReason: 'Items out of stock', rider: undefined },
  ];
}

export function seedBookings(now: number): Booking[] {
  const today = startOfDay(now);
  const svc = (id: string) => CARE_SERVICES.find((s) => s.id === id)!;
  const base = (p: (typeof PATIENTS)[number], id: string, code: string, startAt: number, status: Booking['status']): Booking => {
    const s = svc(p.service);
    const isVisit = s.unit !== '12-hour shift';
    return {
      id, code, patientName: p.name, patientAge: p.age, patientGender: p.gender, condition: p.condition,
      serviceId: s.id, serviceName: s.name, packageLabel: isVisit ? 'Single visit' : '12-hour shift',
      startAt, hours: isVisit ? 1 : 12, address: p.address, area: p.area, distanceKm: p.km,
      familyName: p.family, familyRelation: p.relation, careNotes: p.notes,
      tasks: isVisit ? VISIT_TASKS : SHIFT_TASKS, payout: s.rate, status,
      requestedAt: startAt - 2 * DAY, respondBy: startAt - 2 * DAY, seen: true, notes: '', completionOtp: '2468',
    };
  };
  // Next booking: a nurse visit later today (or tomorrow morning when it is already late).
  const visitAt = new Date(now).getHours() < 19 ? now + 90 * 60000 : today + DAY + 9 * HOUR;
  const raghavan: Booking = {
    ...base(PATIENTS[2], 'b-seed-raghavan', 'LL-N-07731', today + 4 * DAY + 8 * HOUR, 'accepted'),
    patientName: 'K. Raghavan', patientAge: 68, condition: 'Recovering from a mild stroke. Needs help with walking and medicines.',
    address: 'Flat 302, Prestige Shantiniketan, 100 Feet Road, Indiranagar', area: 'Indiranagar', distanceKm: 1.2,
    familyName: 'Vikram Rao', familyRelation: 'Son-in-law', careNotes: ['Left side weakness, walk with support', 'Soft diet', 'BP and sugar twice a day'],
  };
  const past = (p: (typeof PATIENTS)[number], id: string, code: string, daysAgo: number, rating: number): Booking => {
    const startAt = today - daysAgo * DAY + 8 * HOUR;
    const b = base(p, id, code, startAt, 'completed');
    return { ...b, startedAt: startAt, completedAt: startAt + b.hours * HOUR, rating, tasks: b.tasks.map((t) => ({ ...t, done: true })) };
  };
  return [
    base(PATIENTS[1], 'b-seed-visit', 'LL-N-08102', visitAt, 'accepted'),
    raghavan,
    past(PATIENTS[0], 'b-seed-p1', 'LL-N-07640', 1, 5),
    past(PATIENTS[2], 'b-seed-p2', 'LL-N-07588', 2, 5),
    past(PATIENTS[1], 'b-seed-p3', 'LL-N-07502', 4, 4),
  ];
}

export function seedReviews(now: number): Review[] {
  return [
    { id: 'r1', name: 'Arjun Iyer', stars: 5, text: 'Sunita was patient with my mother and kept us updated through the day. Very professional.', at: now - 1 * DAY, service: 'Post-surgery care' },
    { id: 'r2', name: 'Lakshmi Narayan', stars: 5, text: 'On time, gentle and calm with appa. He was comfortable with her from day one.', at: now - 2 * DAY, service: 'Elderly care' },
    { id: 'r3', name: 'Fathima Begum', stars: 4, text: 'Good dressing and clear instructions. Came 10 minutes late once.', at: now - 4 * DAY, service: 'Nurse visit' },
    { id: 'r4', name: 'Priya Natarajan', stars: 5, text: 'Excellent care for my newborn and me. Would book again.', at: now - 9 * DAY, service: 'Mother & baby care' },
    { id: 'r5', name: 'Harish Gowda', stars: 5, text: 'Very knowledgeable about diabetic care.', at: now - 13 * DAY, service: 'Nurse visit' },
  ];
}

const entry = (role: PartnerRole, id: string, ref: string, title: string, at: number, gross: number, kind: LedgerEntry['kind'] = role === 'vendor' ? 'order' : 'booking'): LedgerEntry => {
  const commission = kind === 'incentive' ? 0 : Math.round(gross * COMMISSION[role]);
  return { id, ref, title, at, gross, commission, net: gross - commission, kind };
};

export function seedLedger(now: number): Record<PartnerRole, LedgerEntry[]> {
  const today = startOfDay(now);
  const vendorDaily = [2840, 3420, 4100, 3260, 4580, 5120];
  const vendor: LedgerEntry[] = [];
  vendorDaily.forEach((gross, i) => {
    const d = 6 - i;
    vendor.push(entry('vendor', `vl-${d}`, `${Math.round(gross / 450)} orders`, 'Order sales', today - d * DAY + 21 * HOUR, gross));
  });
  vendor.push(entry('vendor', 'vl-p', 'UTR 6120 4471', 'Weekly settlement to HDFC ••4012', today - 3 * DAY + 10 * HOUR, 0, 'payout'));
  vendor[vendor.length - 1].net = -11800;
  for (const o of seedOrders(now).filter((x) => x.status === 'completed' && x.completedAt! >= today)) {
    const gross = o.items.reduce((s, it) => s + it.qty * it.price, 0);
    vendor.push(entry('vendor', `vl-${o.id}`, o.code, `Order · ${o.items.length} items`, o.completedAt!, gross));
  }

  const caretaker: LedgerEntry[] = [];
  for (const b of seedBookings(now).filter((x) => x.status === 'completed')) {
    caretaker.push(entry('caretaker', `cl-${b.id}`, b.code, `${b.serviceName} · ${b.packageLabel}`, b.completedAt!, Math.round(b.payout / (1 - COMMISSION.caretaker))));
  }
  caretaker.push(entry('caretaker', 'cl-5', 'LL-N-07455', 'Elderly care · 12-hour shift', today - 5 * DAY + 20 * HOUR, 1200));
  caretaker.push(entry('caretaker', 'cl-6', 'LL-N-07410', 'Nurse visit · Single visit', today - 6 * DAY + 11 * HOUR, 500));
  caretaker.push(entry('caretaker', 'cl-i', 'Weekly bonus', '5-star week incentive', today - 3 * DAY + 9 * HOUR, 300, 'incentive'));
  caretaker.push({ ...entry('caretaker', 'cl-p', 'UTR 6120 3398', 'Weekly settlement to SBI ••7731', today - 3 * DAY + 10 * HOUR, 0, 'payout'), net: -2400 });
  return { vendor, caretaker };
}
