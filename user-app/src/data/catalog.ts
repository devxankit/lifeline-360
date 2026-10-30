/**
 * Sample catalogue for the demo build. Every list here is placeholder data
 * that the backend will replace; names, fees and stock are illustrative.
 */
import { ImageSourcePropType } from 'react-native';

export const images = {
  heroCare: require('../assets/images/hero-care.jpg'),
  bannerFamily: require('../assets/images/banner-family.jpg'),
  bannerLab: require('../assets/images/banner-lab.jpg'),
  bannerNurse: require('../assets/images/banner-nurse.jpg'),
  bannerMeds: require('../assets/images/banner-meds.jpg'),
  svcDoctor: require('../assets/images/svc-doctor.jpg'),
  svcMeds: require('../assets/images/svc-meds.jpg'),
  svcLab: require('../assets/images/svc-lab.jpg'),
  svcNurse: require('../assets/images/svc-nurse.jpg'),
  logo: require('../assets/images/logo-mark.png'),
};

/* --------------------------------------------------------------- Doctors */

export type Doctor = {
  id: string;
  name: string;
  photo?: ImageSourcePropType;
  specialty: string;
  role: string;
  degree: string;
  exp: number;
  rating: string;
  reviews: number;
  feeClinic: number;
  feeVideo: number;
  clinic: string;
  area: string;
  distance: string;
  languages: string;
  about: string;
  next: string;
};

export const specialties = [
  { id: 'cardio', label: 'Cardiology', role: 'Cardiologist' },
  { id: 'gp', label: 'General physician', role: 'General physician' },
  { id: 'derma', label: 'Dermatology', role: 'Dermatologist' },
  { id: 'peds', label: 'Pediatrics', role: 'Pediatrician' },
  { id: 'gyn', label: 'Gynecology', role: 'Gynecologist' },
  { id: 'ortho', label: 'Orthopedics', role: 'Orthopedist' },
  { id: 'neuro', label: 'Neurology', role: 'Neurologist' },
  { id: 'ent', label: 'ENT', role: 'ENT specialist' },
];

const P = {
  arjun: require('../assets/images/dr-arjun.jpg'),
  priya: require('../assets/images/dr-priya.jpg'),
  imran: require('../assets/images/dr-imran.jpg'),
  kavya: require('../assets/images/dr-kavya.jpg'),
};

export const doctors: Doctor[] = [
  {
    id: 'd1', name: 'Dr. Arjun Mehta', photo: P.arjun, specialty: 'cardio', role: 'Cardiologist', degree: 'MBBS, MD, DM (Cardiology)', exp: 12, rating: '4.9', reviews: 320,
    feeClinic: 1000, feeVideo: 800, clinic: 'Lifeline Heart Clinic', area: 'Indiranagar', distance: '0.8 km', languages: 'English, Hindi, Kannada',
    about: 'Interventional cardiologist focused on preventive heart care, hypertension and post-angioplasty follow-up.', next: 'Available today at 4:30 PM',
  },
  {
    id: 'd2', name: 'Dr. Priya Iyer', photo: P.priya, specialty: 'cardio', role: 'Cardiologist', degree: 'MBBS, MD', exp: 21, rating: '4.8', reviews: 265,
    feeClinic: 800, feeVideo: 600, clinic: 'CityCare Hospital', area: 'Domlur', distance: '2.1 km', languages: 'English, Tamil, Hindi',
    about: 'Senior consultant with two decades of experience in heart failure and women’s cardiac health.', next: 'Available today at 6:00 PM',
  },
  {
    id: 'd3', name: 'Dr. Imran Khan', photo: P.imran, specialty: 'gp', role: 'General physician', degree: 'MBBS, DNB', exp: 9, rating: '4.7', reviews: 188,
    feeClinic: 500, feeVideo: 400, clinic: 'Sunrise Clinic', area: 'HAL 2nd Stage', distance: '1.4 km', languages: 'English, Hindi, Urdu',
    about: 'Family physician for fever, infections, diabetes and blood pressure management.', next: 'Available today at 5:00 PM',
  },
  {
    id: 'd4', name: 'Dr. Kavya Sharma', photo: P.kavya, specialty: 'gp', role: 'General physician', degree: 'MBBS, MD (Medicine)', exp: 11, rating: '4.8', reviews: 241,
    feeClinic: 600, feeVideo: 450, clinic: 'Lifeline Family Clinic', area: 'Jeevan Bhima Nagar', distance: '2.6 km', languages: 'English, Hindi, Punjabi',
    about: 'Internal medicine specialist with a focus on elderly care and chronic conditions.', next: 'Next available tomorrow, 9:00 AM',
  },
  {
    id: 'd5', name: 'Dr. Neha Kulkarni', specialty: 'derma', role: 'Dermatologist', degree: 'MBBS, MD (Dermatology)', exp: 8, rating: '4.6', reviews: 142,
    feeClinic: 700, feeVideo: 500, clinic: 'SkinFirst Clinic', area: 'Indiranagar', distance: '1.1 km', languages: 'English, Marathi, Hindi',
    about: 'Treats acne, eczema, hair fall and pigmentation, with a conservative, evidence-based approach.', next: 'Available today at 7:00 PM',
  },
  {
    id: 'd6', name: 'Dr. Rahul Desai', specialty: 'peds', role: 'Pediatrician', degree: 'MBBS, MD (Pediatrics)', exp: 14, rating: '4.9', reviews: 298,
    feeClinic: 700, feeVideo: 500, clinic: 'Little Steps Children’s Clinic', area: 'Domlur', distance: '2.4 km', languages: 'English, Hindi, Gujarati',
    about: 'Child specialist for newborn care, vaccinations and growth monitoring.', next: 'Available today at 5:30 PM',
  },
  {
    id: 'd7', name: 'Dr. Ananya Bose', specialty: 'gyn', role: 'Gynecologist', degree: 'MBBS, MS (OBG)', exp: 16, rating: '4.8', reviews: 276,
    feeClinic: 900, feeVideo: 700, clinic: 'CityCare Hospital', area: 'Domlur', distance: '2.1 km', languages: 'English, Bengali, Hindi',
    about: 'Obstetrician and gynecologist for pregnancy care, PCOS and women’s health.', next: 'Next available tomorrow, 11:00 AM',
  },
  {
    id: 'd8', name: 'Dr. Sameer Rao', specialty: 'ortho', role: 'Orthopedist', degree: 'MBBS, MS (Ortho)', exp: 13, rating: '4.7', reviews: 201,
    feeClinic: 800, feeVideo: 600, clinic: 'BoneCare Centre', area: 'Old Airport Road', distance: '3.2 km', languages: 'English, Kannada, Telugu',
    about: 'Joint and spine specialist for knee pain, sports injuries and fracture care.', next: 'Available today at 6:30 PM',
  },
];

/** Slots for a day index (0 = today). Some are pre-booked so the grid looks real. */
export function slotsFor(dayIndex: number) {
  const groups = [
    { name: 'Morning', slots: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
    { name: 'Afternoon', slots: ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'] },
    { name: 'Evening', slots: ['4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'] },
  ];
  const taken = new Set(
    dayIndex === 0
      ? ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '2:00 PM', '3:00 PM']
      : dayIndex === 1
        ? ['9:30 AM', '2:30 PM', '5:00 PM']
        : ['10:00 AM'],
  );
  return groups.map((g) => ({ ...g, slots: g.slots.map((s) => ({ label: s, taken: taken.has(s) })) }));
}

export function nextDays(count = 7) {
  const out: { key: string; label: string; short: string; date: Date }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const short = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    out.push({ key: d.toISOString().slice(0, 10), label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : short, short, date: d });
  }
  return out;
}

/* ------------------------------------------------------------- Medicines */

export const medCategories = [
  { id: 'fever', label: 'Fever & pain', tint: { bg: '#FDECEC', fg: '#D13238' } },
  { id: 'diabetes', label: 'Diabetes', tint: { bg: '#E3EFFB', fg: '#1D6FAE' } },
  { id: 'heart', label: 'Heart care', tint: { bg: '#FDE8EF', fg: '#C62E57' } },
  { id: 'vitamins', label: 'Vitamins', tint: { bg: '#FFF6DA', fg: '#C99A12' } },
  { id: 'digestion', label: 'Digestion', tint: { bg: '#E2F5EA', fg: '#1A8A57' } },
  { id: 'skin', label: 'Skin care', tint: { bg: '#ECE9FB', fg: '#6F5BC9' } },
  { id: 'baby', label: 'Baby care', tint: { bg: '#DDF1EC', fg: '#128078' } },
  { id: 'devices', label: 'Devices', tint: { bg: '#F2F4F3', fg: '#4A5170' } },
];

export type Medicine = { id: string; name: string; pack: string; mrp: number; price: number; rx: boolean; category: string; maker: string; about: string };

export const medicines: Medicine[] = [
  { id: 'm1', name: 'Dolo 650 Tablet', pack: 'Strip of 15 tablets', mrp: 34, price: 31, rx: false, category: 'fever', maker: 'Micro Labs', about: 'Paracetamol for fever and mild to moderate pain.' },
  { id: 'm2', name: 'Crocin Advance', pack: 'Strip of 20 tablets', mrp: 46, price: 42, rx: false, category: 'fever', maker: 'GSK', about: 'Fast-absorbing paracetamol for headache and fever.' },
  { id: 'm3', name: 'Volini Pain Relief Gel', pack: 'Tube of 75 g', mrp: 245, price: 221, rx: false, category: 'fever', maker: 'Sun Pharma', about: 'Topical gel for muscle and joint pain.' },
  { id: 'm4', name: 'Glycomet 500 SR', pack: 'Strip of 20 tablets', mrp: 52, price: 47, rx: true, category: 'diabetes', maker: 'USV', about: 'Metformin for type 2 diabetes. Prescription required.' },
  { id: 'm5', name: 'Accu-Chek Active Strips', pack: 'Box of 50 strips', mrp: 1199, price: 999, rx: false, category: 'diabetes', maker: 'Roche', about: 'Test strips for the Accu-Chek Active glucometer.' },
  { id: 'm6', name: 'Telma 40 Tablet', pack: 'Strip of 30 tablets', mrp: 238, price: 214, rx: true, category: 'heart', maker: 'Glenmark', about: 'Telmisartan for high blood pressure. Prescription required.' },
  { id: 'm7', name: 'Ecosprin 75 Tablet', pack: 'Strip of 14 tablets', mrp: 6, price: 5, rx: true, category: 'heart', maker: 'USV', about: 'Low-dose aspirin. Prescription required.' },
  { id: 'm8', name: 'Becosules Capsule', pack: 'Strip of 20 capsules', mrp: 52, price: 47, rx: false, category: 'vitamins', maker: 'Pfizer', about: 'Vitamin B-complex with vitamin C.' },
  { id: 'm9', name: 'Shelcal 500', pack: 'Bottle of 15 tablets', mrp: 128, price: 115, rx: false, category: 'vitamins', maker: 'Torrent', about: 'Calcium with vitamin D3.' },
  { id: 'm10', name: 'Digene Antacid Gel', pack: 'Bottle of 200 ml', mrp: 145, price: 131, rx: false, category: 'digestion', maker: 'Abbott', about: 'Relief from acidity and gas.' },
  { id: 'm11', name: 'Electral ORS Powder', pack: 'Pack of 5 sachets', mrp: 110, price: 99, rx: false, category: 'digestion', maker: 'FDC', about: 'Oral rehydration salts.' },
  { id: 'm12', name: 'Cetaphil Gentle Cleanser', pack: 'Bottle of 125 ml', mrp: 399, price: 359, rx: false, category: 'skin', maker: 'Galderma', about: 'Soap-free cleanser for sensitive skin.' },
  { id: 'm13', name: 'Himalaya Baby Lotion', pack: 'Bottle of 200 ml', mrp: 225, price: 202, rx: false, category: 'baby', maker: 'Himalaya', about: 'Gentle moisturising lotion for babies.' },
  { id: 'm14', name: 'Omron Digital BP Monitor', pack: '1 unit', mrp: 2490, price: 1990, rx: false, category: 'devices', maker: 'Omron', about: 'Automatic upper-arm blood pressure monitor.' },
  { id: 'm15', name: 'Pulse Oximeter', pack: '1 unit', mrp: 1499, price: 899, rx: false, category: 'devices', maker: 'Dr Trust', about: 'Fingertip oxygen saturation and pulse monitor.' },
];

export const medTint = (categoryId: string) => medCategories.find((c) => c.id === categoryId)?.tint ?? medCategories[7].tint;

/* -------------------------------------------------------------- Lab tests */

export type LabItem = {
  id: string;
  name: string;
  kind: 'package' | 'test';
  tests: number;
  price: number;
  mrp: number;
  tat: string;
  sample: string;
  prep: string;
  includes: string[];
};

export const labItems: LabItem[] = [
  { id: 'l1', name: 'Full body checkup', kind: 'package', tests: 72, price: 1499, mrp: 2800, tat: 'Reports in 24 hours', sample: 'Blood, urine', prep: '10–12 hours fasting', includes: ['Complete blood count', 'Lipid profile', 'Liver function', 'Kidney function', 'Thyroid profile', 'HbA1c', 'Vitamin D', 'Urine routine'] },
  { id: 'l2', name: 'Diabetes care', kind: 'package', tests: 28, price: 799, mrp: 1350, tat: 'Reports in 24 hours', sample: 'Blood, urine', prep: '8–10 hours fasting', includes: ['Fasting blood sugar', 'HbA1c', 'Kidney function', 'Lipid profile', 'Urine microalbumin'] },
  { id: 'l3', name: 'Heart health', kind: 'package', tests: 40, price: 1299, mrp: 2200, tat: 'Reports in 24 hours', sample: 'Blood', prep: '10–12 hours fasting', includes: ['Lipid profile', 'hs-CRP', 'Apolipoprotein A1 & B', 'Homocysteine', 'Complete blood count'] },
  { id: 'l4', name: 'Women’s wellness', kind: 'package', tests: 56, price: 1699, mrp: 3100, tat: 'Reports in 36 hours', sample: 'Blood, urine', prep: '10–12 hours fasting', includes: ['Thyroid profile', 'Iron studies', 'Vitamin B12 & D', 'Calcium', 'Complete blood count'] },
  { id: 't1', name: 'Complete blood count (CBC)', kind: 'test', tests: 1, price: 299, mrp: 450, tat: 'Reports in 12 hours', sample: 'Blood', prep: 'No preparation', includes: ['Haemoglobin', 'RBC, WBC, platelets', 'Differential count'] },
  { id: 't2', name: 'HbA1c', kind: 'test', tests: 1, price: 399, mrp: 600, tat: 'Reports in 12 hours', sample: 'Blood', prep: 'No preparation', includes: ['Glycated haemoglobin', 'Estimated average glucose'] },
  { id: 't3', name: 'Lipid profile', kind: 'test', tests: 1, price: 449, mrp: 700, tat: 'Reports in 12 hours', sample: 'Blood', prep: '10–12 hours fasting', includes: ['Total cholesterol', 'HDL, LDL', 'Triglycerides'] },
  { id: 't4', name: 'Thyroid profile (T3, T4, TSH)', kind: 'test', tests: 1, price: 499, mrp: 800, tat: 'Reports in 24 hours', sample: 'Blood', prep: 'No preparation', includes: ['T3', 'T4', 'TSH'] },
  { id: 't5', name: 'Vitamin D (25-OH)', kind: 'test', tests: 1, price: 899, mrp: 1400, tat: 'Reports in 24 hours', sample: 'Blood', prep: 'No preparation', includes: ['25-hydroxy vitamin D'] },
  { id: 't6', name: 'Vitamin B12', kind: 'test', tests: 1, price: 699, mrp: 1100, tat: 'Reports in 24 hours', sample: 'Blood', prep: 'No preparation', includes: ['Serum vitamin B12'] },
  { id: 't7', name: 'Liver function test (LFT)', kind: 'test', tests: 1, price: 549, mrp: 850, tat: 'Reports in 12 hours', sample: 'Blood', prep: 'No preparation', includes: ['Bilirubin', 'SGOT, SGPT', 'Albumin'] },
  { id: 't8', name: 'Kidney function test (KFT)', kind: 'test', tests: 1, price: 549, mrp: 850, tat: 'Reports in 12 hours', sample: 'Blood', prep: 'No preparation', includes: ['Urea', 'Creatinine', 'Uric acid', 'Electrolytes'] },
];

export const labSlots = ['6:00 – 7:00 AM', '7:00 – 8:00 AM', '8:00 – 9:00 AM', '9:00 – 10:00 AM', '10:00 – 11:00 AM', '4:00 – 5:00 PM'];

/* ---------------------------------------------------- Nursing / caretakers */

export type NursingService = { id: string; name: string; short: string; about: string; packages: { id: string; label: string; price: number; note: string }[] };

export const nursingServices: NursingService[] = [
  { id: 'n1', name: 'Elderly care', short: 'Daily living support and companionship', about: 'Trained caretakers help with bathing, meals, medicines, mobility and companionship at home.', packages: [
    { id: 'p1', label: '12-hour day shift', price: 1200, note: '8 AM – 8 PM' }, { id: 'p2', label: '24-hour live-in', price: 1800, note: 'Stays with the patient' }, { id: 'p3', label: 'Monthly plan', price: 32000, note: '30 days, day shift' }] },
  { id: 'n2', name: 'Post-surgery care', short: 'Recovery support after hospital discharge', about: 'Wound care, medicine schedules, vitals monitoring and mobility support during recovery.', packages: [
    { id: 'p1', label: '12-hour shift', price: 1500, note: 'Trained nurse' }, { id: 'p2', label: '24-hour care', price: 2400, note: 'Two nurses in rotation' }] },
  { id: 'n3', name: 'Nurse visit', short: 'Injections, dressing, IV and catheter care', about: 'A registered nurse visits for a single procedure such as an injection, dressing change or IV.', packages: [
    { id: 'p1', label: 'Single visit', price: 499, note: 'Up to 1 hour' }, { id: 'p2', label: '5-visit pack', price: 2250, note: 'Use within 30 days' }] },
  { id: 'n4', name: 'Mother & baby care', short: 'Newborn care and new-mother support', about: 'Japa and newborn care including baby massage, bathing, feeding support and mother’s recovery.', packages: [
    { id: 'p1', label: '12-hour shift', price: 1300, note: 'Day or night' }, { id: 'p2', label: '24-hour live-in', price: 1900, note: 'Stays with the family' }] },
  { id: 'n5', name: 'Physiotherapy at home', short: 'Rehab sessions by certified physios', about: 'Physiotherapy for stroke recovery, joint replacement, back pain and sports injuries.', packages: [
    { id: 'p1', label: 'Single session', price: 699, note: '45 minutes' }, { id: 'p2', label: '10-session pack', price: 6290, note: 'Use within 45 days' }] },
];

export type Caretaker = { id: string; name: string; photo?: ImageSourcePropType; role: string; exp: number; rating: string; reviews: number; languages: string; verified: boolean };

export const caretakers: Caretaker[] = [
  { id: 'c1', name: 'Sunita Rao', photo: require('../assets/images/ct-sunita.jpg'), role: 'Registered nurse (GNM)', exp: 8, rating: '4.9', reviews: 156, languages: 'Kannada, Hindi, English', verified: true },
  { id: 'c2', name: 'Rekha Thomas', photo: require('../assets/images/ct-rekha.jpg'), role: 'Elderly care specialist', exp: 6, rating: '4.8', reviews: 112, languages: 'Malayalam, English, Hindi', verified: true },
  { id: 'c3', name: 'Anita Joseph', photo: require('../assets/images/ct-anita.jpg'), role: 'Registered nurse (BSc)', exp: 5, rating: '4.7', reviews: 89, languages: 'English, Tamil, Hindi', verified: true },
];

/* ------------------------------------------------------------- Ambulance */

export const ambulanceTypes = [
  { id: 'bls', name: 'Basic life support', short: 'BLS', note: 'Oxygen, stretcher, first aid. For stable patients.', eta: '6 min', fare: '₹1,200 – 1,500' },
  { id: 'als', name: 'Advanced life support', short: 'ALS', note: 'Cardiac monitor, ventilator, paramedic on board.', eta: '9 min', fare: '₹2,500 – 3,200' },
  { id: 'icu', name: 'ICU on wheels', short: 'ICU', note: 'ICU setup with doctor for critical transfers.', eta: '14 min', fare: '₹4,500 – 6,000' },
  { id: 'mortuary', name: 'Mortuary van', short: 'Mortuary', note: 'Freezer box for dignified transport.', eta: '20 min', fare: '₹1,800 – 2,400' },
];

export const hospitals = [
  { id: 'h1', name: 'Manipal Hospital', area: 'Old Airport Road', distance: '5.8 km', ayushman: true, emergency: true },
  { id: 'h2', name: 'Sakra World Hospital', area: 'Bellandur', distance: '8.4 km', ayushman: false, emergency: true },
  { id: 'h3', name: 'St. John’s Medical College Hospital', area: 'Koramangala', distance: '6.9 km', ayushman: true, emergency: true },
  { id: 'h4', name: 'CityCare Hospital', area: 'Domlur', distance: '2.1 km', ayushman: true, emergency: true },
  { id: 'h5', name: 'Bowring & Lady Curzon Hospital', area: 'Shivajinagar', distance: '5.2 km', ayushman: true, emergency: true },
];

/* ------------------------------------------------------------ Blood banks */

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
export const bloodComponents = ['Whole blood', 'Red cells (PRBC)', 'Platelets', 'Plasma (FFP)'];

export const bloodBanks = [
  { id: 'b1', name: 'Rotary Blood Centre', area: 'Indiranagar', distance: '1.6 km', open: 'Open 24 hours', stock: { 'A+': 24, 'A-': 6, 'B+': 19, 'B-': 2, 'O+': 34, 'O-': 5, 'AB+': 11, 'AB-': 0 } as Record<string, number> },
  { id: 'b2', name: 'Lions Blood Bank', area: 'Jayanagar', distance: '7.3 km', open: 'Open 24 hours', stock: { 'A+': 12, 'A-': 1, 'B+': 15, 'B-': 4, 'O+': 20, 'O-': 0, 'AB+': 6, 'AB-': 2 } as Record<string, number> },
  { id: 'b3', name: 'Manipal Hospital Blood Bank', area: 'Old Airport Road', distance: '5.8 km', open: 'Open 24 hours', stock: { 'A+': 30, 'A-': 4, 'B+': 26, 'B-': 3, 'O+': 41, 'O-': 7, 'AB+': 14, 'AB-': 1 } as Record<string, number> },
  { id: 'b4', name: 'Red Cross Blood Bank', area: 'Race Course Road', distance: '6.5 km', open: '8 AM – 8 PM', stock: { 'A+': 8, 'A-': 0, 'B+': 10, 'B-': 1, 'O+': 14, 'O-': 2, 'AB+': 3, 'AB-': 0 } as Record<string, number> },
];

/* ------------------------------------------------------------- Membership */

/** Prices are not decided yet, so the app says so rather than inventing figures. */
export const membershipPlans = [
  { id: 'monthly', name: 'Monthly', note: 'Flexible, renews every month', price: null as number | null },
  { id: 'annual', name: 'Annual', note: 'One payment, twelve months of benefits', price: null as number | null, featured: true },
];

export const membershipBenefits = [
  { id: 'consult', title: 'Consultation benefits', text: 'Applied automatically at doctor checkout' },
  { id: 'lab', title: 'Laboratory discounts', text: 'On tests and health packages' },
  { id: 'priority', title: 'Priority healthcare', text: 'Faster handling across services' },
];
