export type PartnerRole = 'vendor' | 'caretaker';

export type KycStatus = 'missing' | 'pending' | 'approved' | 'rejected';

export interface PartnerSession {
  phone: string;
  isLoggedIn: boolean;
  role: PartnerRole | null;
  detailsDone: boolean;
  kycStatus: KycStatus;
}

export interface KycDocumentItem {
  id: string;
  title: string;
  description: string;
  numberLabel?: string;
  needsExpiry?: boolean;
  status: KycStatus;
  docNumber?: string;
  expiryDate?: string;
  uploadedAt?: number;
}

export interface BankAccount {
  bank: string;
  holder: string;
  last4: string;
  ifsc: string;
}

export interface VendorProfile {
  storeName: string;
  ownerName: string;
  pharmacistName: string;
  pharmacistReg: string;
  drugLicence: string;
  gstin: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  opensAt: string;
  closesAt: string;
  deliveryRadiusKm: number;
  rating: number;
  bank: BankAccount;
}

export interface CaretakerProfile {
  fullName: string;
  title: string;
  councilReg: string;
  experienceYears: number;
  languages: string[];
  skills: string[];
  bio: string;
  area: string;
  city: string;
  bank: BankAccount;
}

/* ------------------------------------------------------------ Vendor */

export interface Category {
  id: string;
  label: string;
  hidden: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  maker: string;
  category: string;
  pack: string;
  mrp: number;
  price: number;
  stock: number;
  lowStockAt: number;
  rx: boolean;
  inStock: boolean;
}

export interface OrderItem {
  medId: string;
  name: string;
  pack: string;
  qty: number;
  price: number;
  rx: boolean;
  packed: boolean;
  unavailable: boolean;
  substitute?: string;
}

/**
 * new → packing → ready → completed. Prescription orders go new → quote_sent → packing.
 * rejected covers both a vendor rejection and a missed acceptance window.
 */
export type OrderStatus = 'new' | 'quote_sent' | 'packing' | 'ready' | 'completed' | 'rejected';

export interface Rider {
  name: string;
  phone: string;
  vehicle: string;
}

export interface Prescription {
  doctor: string;
  clinic: string;
  date: string;
  lines: string[];
}

export interface VendorOrder {
  id: string;
  code: string;
  customerName: string;
  customerArea: string;
  address: string;
  distanceKm: number;
  placedAt: number;
  acceptBy: number;
  status: OrderStatus;
  items: OrderItem[];
  prescription?: Prescription;
  payment: 'Paid online' | 'Cash on delivery';
  deliveryFee: number;
  seen: boolean;
  quoteSentAt?: number;
  readyAt?: number;
  rider?: Rider;
  handoverOtp: string;
  completedAt?: number;
  rejectReason?: string;
}

/* --------------------------------------------------------- Caretaker */

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'declined';

export interface CareTask {
  id: string;
  label: string;
  time: string;
  done: boolean;
  doneAt?: number;
}

export interface Review {
  id: string;
  name: string;
  stars: number;
  text: string;
  at: number;
  service: string;
}

export interface Booking {
  id: string;
  code: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female';
  condition: string;
  serviceId: string;
  serviceName: string;
  packageLabel: string;
  startAt: number;
  hours: number;
  address: string;
  area: string;
  distanceKm: number;
  familyName: string;
  familyRelation: string;
  careNotes: string[];
  tasks: CareTask[];
  payout: number;
  status: BookingStatus;
  requestedAt: number;
  respondBy: number;
  seen: boolean;
  checkInDistanceM?: number;
  startedAt?: number;
  completedAt?: number;
  notes: string;
  completionOtp: string;
  declineReason?: string;
  rating?: number;
}

export type SlotKey = 'morning' | 'afternoon' | 'night';
export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type WeeklySchedule = Record<DayKey, SlotKey[]>;

export interface CareService {
  id: string;
  name: string;
  unit: string;
  rate: number;
  enabled: boolean;
}

/* ------------------------------------------------------------ Shared */

export interface LedgerEntry {
  id: string;
  ref: string;
  title: string;
  at: number;
  gross: number;
  commission: number;
  /** Positive for credits, negative for payouts. */
  net: number;
  kind: 'order' | 'booking' | 'incentive' | 'payout';
}

export interface AppNotification {
  id: string;
  title: string;
  text: string;
  at: number;
  read: boolean;
  role: PartnerRole | 'all';
}

export interface Settings {
  alertVibration: boolean;
  keepAwake: boolean;
  orderAcceptMinutes: number;
}

export interface PartnerState {
  session: PartnerSession;
  vendorProfile: VendorProfile;
  caretakerProfile: CaretakerProfile;
  documents: Record<PartnerRole, KycDocumentItem[]>;
  approvedAt?: number;

  isStoreOpen: boolean;
  orders: VendorOrder[];
  catalogue: Medicine[];
  categories: Category[];

  isAvailable: boolean;
  bookings: Booking[];
  schedule: WeeklySchedule;
  leaveDates: string[];
  services: CareService[];
  reviews: Review[];

  ledger: Record<PartnerRole, LedgerEntry[]>;
  notifications: AppNotification[];
  settings: Settings;

  /** When the simulator next creates an order or a booking request (0 = not scheduled). */
  nextArrivalAt: number;
  arrivals: number;
}
