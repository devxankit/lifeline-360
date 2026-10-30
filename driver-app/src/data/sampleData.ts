/**
 * Lifeline 360 Driver App — Sample data for standalone demo mode.
 * Aligns with User app emergency service format (LL-A-xxxxx).
 */

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  totalTrips: number;
  experienceYears: number;
  vehicleType: 'ALS' | 'BLS' | 'ICU';
  vehiclePlate: string;
  vehicleModel: string;
  equipment: string[];
}

export interface KycDocument {
  id: string;
  title: string;
  description: string;
  status: 'approved' | 'pending' | 'rejected' | 'missing';
  expiryDate?: string;
  rejectionReason?: string;
}

export interface EmergencyRequest {
  id: string;
  bookingCode: string;
  severity: 'Critical' | 'Severe' | 'Urgent';
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female';
  condition: string;
  pickupAddress: string;
  pickupLandmark: string;
  distanceKm: number;
  etaMinutes: number;
  hospitalName: string;
  hospitalAddress: string;
  hospitalDistanceKm: number;
  estimatedFare: number;
  serviceType: string;
  createdAt: number;
}

export interface TripRecord {
  id: string;
  bookingCode: string;
  date: string;
  patientName: string;
  pickup: string;
  destination: string;
  fare: number;
  driverShare: number;
  distanceKm: number;
  durationMins: number;
  status: 'completed' | 'cancelled';
  serviceType: string;
  paymentMode: 'Online' | 'Cash';
}

export interface TransactionRecord {
  id: string;
  tripId: string;
  title: string;
  date: string;
  amount: number;
  type: 'trip_credit' | 'payout' | 'incentive';
  status: 'settled' | 'processing';
}

export const INITIAL_DRIVER: DriverProfile = {
  id: 'LL-DRV-104',
  name: 'Imran Pasha',
  phone: '9876543210',
  email: 'imran.driver@lifeline360.in',
  rating: 4.9,
  totalTrips: 184,
  experienceYears: 6,
  vehicleType: 'ALS',
  vehiclePlate: 'KA 01 AB 4521',
  vehicleModel: 'Force Traveller ALS (2024) · White',
  equipment: [
    'Oxygen Cylinder (Type D)',
    'Transport Ventilator',
    'Biphasic Defibrillator',
    'Electric Suction Unit',
    'Scoop Stretcher & Spine Board',
    'Emergency Trauma Kit',
  ],
};

export const INITIAL_DOCUMENTS: KycDocument[] = [
  {
    id: 'dl',
    title: 'Commercial Driving Licence',
    description: 'Valid HMV / Commercial passenger vehicle licence',
    status: 'missing',
    expiryDate: '14 Oct 2029',
  },
  {
    id: 'rc',
    title: 'Ambulance Registration (RC)',
    description: 'State transport commercial ambulance permit',
    status: 'missing',
    expiryDate: '22 Dec 2030',
  },
  {
    id: 'insurance',
    title: 'Comprehensive Insurance',
    description: 'Vehicle & third-party patient transit coverage',
    status: 'missing',
    expiryDate: '18 Nov 2027',
  },
  {
    id: 'puc',
    title: 'Pollution Certificate (PUCC)',
    description: 'Valid BS6 emission clearance certificate',
    status: 'missing',
    expiryDate: '30 Mar 2027',
  },
  {
    id: 'first_aid',
    title: 'BLS / Emergency Medical Technician (EMT) Certificate',
    description: 'Red Cross / St. John accredited paramedic certification',
    status: 'missing',
    expiryDate: '12 Jan 2028',
  },
  {
    id: 'police',
    title: 'Police Clearance Certificate',
    description: 'Background verification issued by Bengaluru City Police',
    status: 'missing',
    expiryDate: '01 Aug 2027',
  },
];

export const SAMPLE_EMERGENCY_REQUESTS: EmergencyRequest[] = [
  {
    id: 'req_001',
    bookingCode: 'LL-A-94821',
    severity: 'Critical',
    patientName: 'Vikram Shetty',
    patientAge: 54,
    patientGender: 'Male',
    condition: 'Acute chest pain, severe shortness of breath',
    pickupAddress: '12th Main, HAL 2nd Stage, Indiranagar',
    pickupLandmark: 'Opposite CMH Road metro pillar 112',
    distanceKm: 2.4,
    etaMinutes: 6,
    hospitalName: 'Manipal Hospital',
    hospitalAddress: 'HAL Old Airport Road, Kodihalli',
    hospitalDistanceKm: 5.8,
    estimatedFare: 1850,
    serviceType: 'Advanced Life Support (ALS)',
    createdAt: Date.now(),
  },
  {
    id: 'req_002',
    bookingCode: 'LL-A-83910',
    severity: 'Severe',
    patientName: 'Priyanka Das',
    patientAge: 42,
    patientGender: 'Female',
    condition: 'Road accident, compound fracture, stable vitals',
    pickupAddress: 'Outer Ring Road, near Marathahalli bridge',
    pickupLandmark: 'Bus stop opposite Innovative Multiplex',
    distanceKm: 3.8,
    etaMinutes: 8,
    hospitalName: 'Sakra World Hospital',
    hospitalAddress: 'Devarabeesanahalli, Bellandur',
    hospitalDistanceKm: 7.2,
    estimatedFare: 1450,
    serviceType: 'Advanced Life Support (ALS)',
    createdAt: Date.now(),
  },
];

export const SAMPLE_PAST_TRIPS: TripRecord[] = [
  {
    id: 'tr_101',
    bookingCode: 'LL-A-81023',
    date: 'Today, 10:15 AM',
    patientName: 'Anil Gowda',
    pickup: '4th Cross, 9th Block, Jayanagar',
    destination: 'St. John’s Medical College Hospital, Koramangala',
    fare: 1650,
    driverShare: 1320,
    distanceKm: 9.2,
    durationMins: 22,
    status: 'completed',
    serviceType: 'ALS Ambulance',
    paymentMode: 'Online',
  },
  {
    id: 'tr_102',
    bookingCode: 'LL-A-79241',
    date: 'Today, 07:45 AM',
    patientName: 'Kavita Rao',
    pickup: 'Whitefield Main Road, Hoodi',
    destination: 'Manipal Hospital, Old Airport Road',
    fare: 2100,
    driverShare: 1680,
    distanceKm: 12.5,
    durationMins: 28,
    status: 'completed',
    serviceType: 'ICU Ambulance',
    paymentMode: 'Online',
  },
  {
    id: 'tr_103',
    bookingCode: 'LL-A-77402',
    date: 'Yesterday, 09:30 PM',
    patientName: 'Ramesh Iyer',
    pickup: '80 Feet Road, Koramangala 4th Block',
    destination: 'CityCare Hospital, Domlur',
    fare: 1400,
    driverShare: 1120,
    distanceKm: 6.8,
    durationMins: 16,
    status: 'completed',
    serviceType: 'ALS Ambulance',
    paymentMode: 'Cash',
  },
  {
    id: 'tr_104',
    bookingCode: 'LL-A-76118',
    date: 'Yesterday, 03:10 PM',
    patientName: 'Pooja Nair',
    pickup: 'Malleswaram 8th Cross',
    destination: 'Bowring & Lady Curzon Hospital, Shivajinagar',
    fare: 1350,
    driverShare: 1080,
    distanceKm: 5.4,
    durationMins: 15,
    status: 'completed',
    serviceType: 'ALS Ambulance',
    paymentMode: 'Online',
  },
];

export const WEEKLY_CHART_DATA = [
  { label: 'Mon', amount: 2800 },
  { label: 'Tue', amount: 3400 },
  { label: 'Wed', amount: 4100 },
  { label: 'Thu', amount: 3900 },
  { label: 'Fri', amount: 4600 },
  { label: 'Sat', amount: 5200 },
  { label: 'Sun', amount: 4850, active: true },
];

export const SAMPLE_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx_301',
    tripId: 'LL-A-81023',
    title: 'Trip Fare Credit (LL-A-81023)',
    date: 'Today, 10:42 AM',
    amount: 1320,
    type: 'trip_credit',
    status: 'settled',
  },
  {
    id: 'tx_302',
    tripId: 'LL-A-79241',
    title: 'Trip Fare Credit (LL-A-79241)',
    date: 'Today, 08:20 AM',
    amount: 1680,
    type: 'trip_credit',
    status: 'settled',
  },
  {
    id: 'tx_303',
    tripId: 'inc_201',
    title: 'Weekly Shift Incentive (50+ Trips)',
    date: 'Yesterday',
    amount: 1500,
    type: 'incentive',
    status: 'settled',
  },
  {
    id: 'tx_304',
    tripId: 'po_109',
    title: 'Weekly Bank Payout to HDFC ••••4012',
    date: '27 Oct 2026',
    amount: -18450,
    type: 'payout',
    status: 'settled',
  },
];

