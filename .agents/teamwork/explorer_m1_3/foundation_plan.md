# Partner App M1 Shared Foundations & UI Architecture Plan

**Document Path**: `.agents/teamwork/explorer_m1_3/foundation_plan.md`  
**Target Application**: `partner-app` (`com.lifeline360.partner`)  
**Package Dependencies**: `@lifeline/mobile-ui`, `@react-native-async-storage/async-storage`, `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `react-native-safe-area-context`, `lucide-react-native`  
**Prepared by**: `explorer_m1_3`  
**Milestone**: M1 (Shared Foundations & Mobile UI Package)

---

## 1. Executive Summary & Problem Boundary

The Lifeline Partner native application is a dual-persona showcase serving two distinct healthcare service providers:
1. **Medicine Vendor (Retail Pharmacy)**: receives prescription/OTC medicine orders, performs packing checklists, verifies rider handover OTP, and manages medicine catalogue and stock. Brand accent: **Mint** (`#1A8A57` / `#E2F5EA`).
2. **Nurse or Caretaker (Home Healthcare)**: manages weekly availability slots and leave calendars, receives geofenced booking requests, checks in at patient address via GPS, runs active shift timers with clinical checklists, and completes care via family OTP. Brand accent: **Lavender** (`#6F5BC9` / `#ECE9FB`).

### Architectural Tenet: Strict One-Account = One-Role Immutability
A partner account is permanently bound to a single role upon registration and KYC approval. Role switching post-onboarding is strictly prohibited for regulatory and domain isolation reasons. Navigation permanently branches to `VendorTabs` or `CaretakerTabs` once KYC is approved.

---

## 2. Store Architecture & TypeScript Contracts

### 2.1 File: `partner-app/src/store/types.ts`

```typescript
export type PartnerRole = 'vendor' | 'caretaker';

export type KycStatus = 'missing' | 'pending' | 'approved' | 'rejected';

export interface PartnerSession {
  phone: string;
  isLoggedIn: boolean;
  role: PartnerRole | null;
  kycStatus: KycStatus;
  selectedRoleTimestamp?: number;
}

export interface KycDocumentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  status: KycStatus;
  docNumber?: string;
  expiryDate?: string;
  fileUri?: string;
  uploadedAt?: number;
}

export interface VendorProfile {
  id: string;
  storeName: string;
  tradeName: string;
  pharmacistName: string;
  regNumber: string; // State Pharmacy Council Reg Number
  gstin: string;
  address: string;
  city: string;
  pincode: string;
  rating: number;
  totalOrders: number;
}

export interface CaretakerProfile {
  id: string;
  fullName: string;
  title: string; // e.g. "Registered Nurse (GNM)"
  councilRegNumber: string; // Nursing Council Reg Number
  experienceYears: number;
  rating: number;
  totalReviews: number;
  languages: string[];
  city: string;
  bio: string;
}

export interface WeeklyScheduleDay {
  enabled: boolean;
  slots: string[]; // e.g. ['08:00 - 14:00', '14:00 - 20:00', '20:00 - 08:00']
}

export type WeeklySchedule = Record<
  'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun',
  WeeklyScheduleDay
>;

export interface MedicineCatalogueItem {
  id: string;
  name: string;
  manufacturer: string;
  category: 'fever' | 'diabetes' | 'heart' | 'vitamins' | 'digestion' | 'skin' | 'baby' | 'devices';
  packSize: string;
  mrp: number;
  price: number;
  stock: number;
  isRxRequired: boolean;
  inStock: boolean;
}

export interface VendorOrderSummary {
  id: string;
  orderCode: string; // LL-M-xxxxx
  customerName: string;
  customerArea: string;
  itemCount: number;
  totalAmount: number;
  status: 'new' | 'accepted' | 'packing' | 'ready' | 'handed_over' | 'completed' | 'rejected';
  createdAt: string;
}

export interface CaretakerBookingSummary {
  id: string;
  bookingCode: string; // LL-N-xxxxx
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  serviceName: string;
  scheduleTime: string;
  locationArea: string;
  payoutAmount: number;
  status: 'requested' | 'accepted' | 'on_the_way' | 'checked_in' | 'in_progress' | 'completed' | 'declined';
  createdAt: string;
}

export interface EarningsSummary {
  todayGross: number;
  todayNet: number;
  todayCount: number;
  weekGross: number;
  weekNet: number;
  monthGross: number;
  monthNet: number;
  walletBalance: number;
}

export interface TransactionItem {
  id: string;
  referenceCode: string;
  title: string;
  date: string;
  amount: number;
  type: 'order_credit' | 'shift_credit' | 'platform_commission' | 'bank_payout';
  status: 'settled' | 'pending';
}

export interface PartnerStoreState {
  hydrated: boolean;
  session: PartnerSession;
  vendorProfile: VendorProfile;
  caretakerProfile: CaretakerProfile;
  vendorDocuments: KycDocumentItem[];
  caretakerDocuments: KycDocumentItem[];
  // Vendor operational state
  isStoreOpen: boolean;
  vendorOrders: VendorOrderSummary[];
  catalogue: MedicineCatalogueItem[];
  // Caretaker operational state
  isAvailableOnline: boolean;
  weeklySchedule: WeeklySchedule;
  leaveDates: string[];
  caretakerBookings: CaretakerBookingSummary[];
  // Shared financials
  earnings: EarningsSummary;
  transactions: TransactionItem[];
}

export interface PartnerStoreContextType extends PartnerStoreState {
  // Authentication & Role
  loginPhone: (phone: string) => void;
  verifyOtp: (otp: string) => boolean;
  selectRole: (role: PartnerRole) => void;
  // KYC Actions
  updateDocumentStatus: (
    role: PartnerRole,
    docId: string,
    details: { docNumber?: string; expiryDate?: string; fileUri?: string; status: KycStatus }
  ) => void;
  submitKyc: () => void;
  approveKyc: () => void;
  // Operational toggles
  toggleStoreOpen: () => void;
  toggleAvailableOnline: () => void;
  // Profile updates
  updateVendorProfile: (profile: Partial<VendorProfile>) => void;
  updateCaretakerProfile: (profile: Partial<CaretakerProfile>) => void;
  // Session reset
  logout: () => void;
}
```

---

### 2.2 File: `partner-app/src/store/PartnerStore.tsx`

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CaretakerBookingSummary,
  CaretakerProfile,
  EarningsSummary,
  KycDocumentItem,
  KycStatus,
  MedicineCatalogueItem,
  PartnerRole,
  PartnerSession,
  PartnerStoreContextType,
  PartnerStoreState,
  TransactionItem,
  VendorOrderSummary,
  VendorProfile,
  WeeklySchedule,
} from './types';

export const PARTNER_STORAGE_KEY = '@lifeline360_partner_store_v1';

// Initial Mock Profiles & Documents
export const INITIAL_VENDOR_PROFILE: VendorProfile = {
  id: 'v1',
  storeName: 'Sri Sai Medicals',
  tradeName: 'Sri Sai Medicals Chemist & Druggist',
  pharmacistName: 'Ramesh Sharma, B.Pharm',
  regNumber: 'KA-29410',
  gstin: '29ABCDE1234F1Z5',
  address: '12th Main Road, HAL 2nd Stage, Indiranagar',
  city: 'Bengaluru',
  pincode: '560038',
  rating: 4.8,
  totalOrders: 142,
};

export const INITIAL_CARETAKER_PROFILE: CaretakerProfile = {
  id: 'c1',
  fullName: 'Sunita Rao',
  title: 'Registered Nurse (GNM)',
  councilRegNumber: 'KNC-84920',
  experienceYears: 8,
  rating: 4.9,
  totalReviews: 156,
  languages: ['Kannada', 'Hindi', 'English'],
  city: 'Bengaluru',
  bio: 'Experienced in post-operative geriatric nursing, continuous vitals monitoring, and rehabilitation support.',
};

export const INITIAL_VENDOR_DOCUMENTS: KycDocumentItem[] = [
  {
    id: 'dl',
    title: 'Drug Licence (Form 20 / Form 21)',
    description: 'Mandatory State Drug Controller retail license',
    required: true,
    status: 'missing',
    docNumber: 'KA-B1-2023-88291',
    expiryDate: '31/12/2028',
  },
  {
    id: 'gst',
    title: 'GSTIN Registration Certificate',
    description: 'Valid GST certificate for pharmaceutical trade',
    required: true,
    status: 'missing',
    docNumber: '29ABCDE1234F1Z5',
  },
  {
    id: 'pharmacist_cert',
    title: 'Registered Pharmacist Certificate',
    description: 'State Pharmacy Council valid registration certificate',
    required: true,
    status: 'missing',
    docNumber: 'KSPC-Reg-29410',
    expiryDate: '15/08/2029',
  },
  {
    id: 'storefront_photo',
    title: 'Pharmacy Storefront & Board Photo',
    description: 'Clear exterior photograph with pharmacy signboard visible',
    required: true,
    status: 'missing',
  },
  {
    id: 'id_proof',
    title: 'Proprietor Aadhaar / PAN Card',
    description: 'Government photo identification of business owner',
    required: true,
    status: 'missing',
    docNumber: 'XXXX-XXXX-9142',
  },
];

export const INITIAL_CARETAKER_DOCUMENTS: KycDocumentItem[] = [
  {
    id: 'nursing_cert',
    title: 'Nursing Council Registration / Degree',
    description: 'Valid GNM / ANM / BSc Nursing or Caregiver Council Certificate',
    required: true,
    status: 'missing',
    docNumber: 'KNC-84920-RN',
    expiryDate: '24/11/2030',
  },
  {
    id: 'id_proof',
    title: 'Government Photo ID (Aadhaar / Voter ID)',
    description: 'Official identity proof verifying address and age',
    required: true,
    status: 'missing',
    docNumber: 'XXXX-XXXX-3829',
  },
  {
    id: 'police_clearance',
    title: 'Police Clearance Certificate (PCC)',
    description: 'Official criminal background check verification certificate',
    required: true,
    status: 'missing',
    docNumber: 'BLR-PCC-2025-1049',
    expiryDate: '10/05/2027',
  },
  {
    id: 'portrait_photo',
    title: 'Healthcare Profile Portrait Photo',
    description: 'Professional front-facing photo in medical/care attire',
    required: true,
    status: 'missing',
  },
];

export const INITIAL_WEEKLY_SCHEDULE: WeeklySchedule = {
  mon: { enabled: true, slots: ['08:00 - 14:00', '14:00 - 20:00'] },
  tue: { enabled: true, slots: ['08:00 - 14:00', '14:00 - 20:00'] },
  wed: { enabled: true, slots: ['08:00 - 14:00', '14:00 - 20:00'] },
  thu: { enabled: true, slots: ['08:00 - 14:00', '14:00 - 20:00'] },
  fri: { enabled: true, slots: ['08:00 - 14:00', '14:00 - 20:00'] },
  sat: { enabled: true, slots: ['08:00 - 14:00'] },
  sun: { enabled: false, slots: [] },
};

export const INITIAL_CATALOGUE: MedicineCatalogueItem[] = [
  { id: 'm1', name: 'Dolo 650 Tablet', manufacturer: 'Micro Labs', category: 'fever', packSize: 'Strip of 15 tablets', mrp: 34, price: 31, stock: 45, isRxRequired: false, inStock: true },
  { id: 'm2', name: 'Crocin Advance', manufacturer: 'GSK', category: 'fever', packSize: 'Strip of 20 tablets', mrp: 46, price: 42, stock: 8, isRxRequired: false, inStock: true },
  { id: 'm3', name: 'Volini Pain Relief Gel', manufacturer: 'Sun Pharma', category: 'fever', packSize: 'Tube of 75 g', mrp: 245, price: 221, stock: 18, isRxRequired: false, inStock: true },
  { id: 'm4', name: 'Glycomet 500 SR', manufacturer: 'USV', category: 'diabetes', packSize: 'Strip of 20 tablets', mrp: 52, price: 47, stock: 6, isRxRequired: true, inStock: true },
  { id: 'm5', name: 'Accu-Chek Active Strips', manufacturer: 'Roche', category: 'diabetes', packSize: 'Box of 50 strips', mrp: 1199, price: 999, stock: 12, isRxRequired: false, inStock: true },
  { id: 'm6', name: 'Telma 40 Tablet', manufacturer: 'Glenmark', category: 'heart', packSize: 'Strip of 30 tablets', mrp: 238, price: 214, stock: 24, isRxRequired: true, inStock: true },
  { id: 'm7', name: 'Ecosprin 75 Tablet', manufacturer: 'USV', category: 'heart', packSize: 'Strip of 14 tablets', mrp: 6, price: 5, stock: 80, isRxRequired: true, inStock: true },
  { id: 'm8', name: 'Becosules Capsule', manufacturer: 'Pfizer', category: 'vitamins', packSize: 'Strip of 20 capsules', mrp: 52, price: 47, stock: 30, isRxRequired: false, inStock: true },
  { id: 'm9', name: 'Shelcal 500', manufacturer: 'Torrent', category: 'vitamins', packSize: 'Bottle of 15 tablets', mrp: 128, price: 115, stock: 5, isRxRequired: false, inStock: true },
  { id: 'm10', name: 'Digene Antacid Gel', manufacturer: 'Abbott', category: 'digestion', packSize: 'Bottle of 200 ml', mrp: 145, price: 131, stock: 15, isRxRequired: false, inStock: true },
];

export const INITIAL_EARNINGS: EarningsSummary = {
  todayGross: 3450,
  todayNet: 3105,
  todayCount: 4,
  weekGross: 24800,
  weekNet: 22320,
  monthGross: 98400,
  monthNet: 88560,
  walletBalance: 8450,
};

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  { id: 'tx_1', referenceCode: 'LL-M-48921', title: 'Medicine Order Fulfillment', date: 'Today, 2:15 PM', amount: 578, type: 'order_credit', status: 'settled' },
  { id: 'tx_2', referenceCode: 'LL-M-48902', title: 'Medicine Order Fulfillment', date: 'Today, 11:30 AM', amount: 890, type: 'order_credit', status: 'settled' },
  { id: 'tx_3', referenceCode: 'LL-N-07731', title: '12h Day Shift · Elderly Care', date: 'Yesterday, 8:00 PM', amount: 1020, type: 'shift_credit', status: 'settled' },
  { id: 'tx_4', referenceCode: 'BANK-9921', title: 'Weekly Bank Payout', date: '26 Oct 2026', amount: 14200, type: 'bank_payout', status: 'settled' },
];

const FIRST_RUN_SESSION: PartnerSession = {
  phone: '',
  isLoggedIn: false,
  role: null,
  kycStatus: 'missing',
};

const PartnerContext = createContext<PartnerStoreContextType | null>(null);

export function PartnerStoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<PartnerSession>(FIRST_RUN_SESSION);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile>(INITIAL_VENDOR_PROFILE);
  const [caretakerProfile, setCaretakerProfile] = useState<CaretakerProfile>(INITIAL_CARETAKER_PROFILE);
  const [vendorDocuments, setVendorDocuments] = useState<KycDocumentItem[]>(INITIAL_VENDOR_DOCUMENTS);
  const [caretakerDocuments, setCaretakerDocuments] = useState<KycDocumentItem[]>(INITIAL_CARETAKER_DOCUMENTS);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [vendorOrders, setVendorOrders] = useState<VendorOrderSummary[]>([]);
  const [catalogue, setCatalogue] = useState<MedicineCatalogueItem[]>(INITIAL_CATALOGUE);
  const [isAvailableOnline, setIsAvailableOnline] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(INITIAL_WEEKLY_SCHEDULE);
  const [leaveDates, setLeaveDates] = useState<string[]>([]);
  const [caretakerBookings, setCaretakerBookings] = useState<CaretakerBookingSummary[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary>(INITIAL_EARNINGS);
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);

  // 1. Hydrate from AsyncStorage on startup
  useEffect(() => {
    AsyncStorage.getItem(PARTNER_STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed.session) setSession(parsed.session);
        if (parsed.vendorProfile) setVendorProfile(parsed.vendorProfile);
        if (parsed.caretakerProfile) setCaretakerProfile(parsed.caretakerProfile);
        if (parsed.vendorDocuments) setVendorDocuments(parsed.vendorDocuments);
        if (parsed.caretakerDocuments) setCaretakerDocuments(parsed.caretakerDocuments);
        if (typeof parsed.isStoreOpen === 'boolean') setIsStoreOpen(parsed.isStoreOpen);
        if (typeof parsed.isAvailableOnline === 'boolean') setIsAvailableOnline(parsed.isAvailableOnline);
        if (parsed.catalogue) setCatalogue(parsed.catalogue);
        if (parsed.weeklySchedule) setWeeklySchedule(parsed.weeklySchedule);
        if (parsed.leaveDates) setLeaveDates(parsed.leaveDates);
        if (parsed.vendorOrders) setVendorOrders(parsed.vendorOrders);
        if (parsed.caretakerBookings) setCaretakerBookings(parsed.caretakerBookings);
        if (parsed.earnings) setEarnings(parsed.earnings);
        if (parsed.transactions) setTransactions(parsed.transactions);
      })
      .catch((err) => console.warn('PartnerStore hydrate error:', err))
      .finally(() => setHydrated(true));
  }, []);

  // 2. Persist to AsyncStorage on state change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    const snapshot = {
      session,
      vendorProfile,
      caretakerProfile,
      vendorDocuments,
      caretakerDocuments,
      isStoreOpen,
      isAvailableOnline,
      catalogue,
      weeklySchedule,
      leaveDates,
      vendorOrders,
      caretakerBookings,
      earnings,
      transactions,
    };
    AsyncStorage.setItem(PARTNER_STORAGE_KEY, JSON.stringify(snapshot)).catch((err) =>
      console.warn('PartnerStore persist error:', err)
    );
  }, [
    hydrated,
    session,
    vendorProfile,
    caretakerProfile,
    vendorDocuments,
    caretakerDocuments,
    isStoreOpen,
    isAvailableOnline,
    catalogue,
    weeklySchedule,
    leaveDates,
    vendorOrders,
    caretakerBookings,
    earnings,
    transactions,
  ]);

  // Auth Actions
  const loginPhone = (phone: string) => {
    setSession((prev) => ({
      ...prev,
      phone,
    }));
  };

  const verifyOtp = (_otp: string): boolean => {
    // In demo mode: any 6-digit code is accepted
    setSession((prev) => ({
      ...prev,
      isLoggedIn: true,
    }));
    return true;
  };

  const selectRole = (role: PartnerRole) => {
    setSession((prev) => ({
      ...prev,
      role,
      selectedRoleTimestamp: Date.now(),
    }));
  };

  // KYC Actions
  const updateDocumentStatus = (
    role: PartnerRole,
    docId: string,
    details: { docNumber?: string; expiryDate?: string; fileUri?: string; status: KycStatus }
  ) => {
    if (role === 'vendor') {
      setVendorDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, ...details, uploadedAt: Date.now() } : d))
      );
    } else {
      setCaretakerDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, ...details, uploadedAt: Date.now() } : d))
      );
    }
  };

  const submitKyc = () => {
    setSession((prev) => ({
      ...prev,
      kycStatus: 'pending',
    }));
  };

  const approveKyc = () => {
    if (session.role === 'vendor') {
      setVendorDocuments((prev) => prev.map((d) => ({ ...d, status: 'approved' })));
    } else if (session.role === 'caretaker') {
      setCaretakerDocuments((prev) => prev.map((d) => ({ ...d, status: 'approved' })));
    }
    setSession((prev) => ({
      ...prev,
      kycStatus: 'approved',
    }));
  };

  // Operational toggles
  const toggleStoreOpen = () => setIsStoreOpen((prev) => !prev);
  const toggleAvailableOnline = () => setIsAvailableOnline((prev) => !prev);

  // Profile updaters
  const updateVendorProfile = (p: Partial<VendorProfile>) =>
    setVendorProfile((prev) => ({ ...prev, ...p }));
  const updateCaretakerProfile = (p: Partial<CaretakerProfile>) =>
    setCaretakerProfile((prev) => ({ ...prev, ...p }));

  const logout = () => {
    setSession(FIRST_RUN_SESSION);
    setVendorDocuments(INITIAL_VENDOR_DOCUMENTS);
    setCaretakerDocuments(INITIAL_CARETAKER_DOCUMENTS);
    setIsStoreOpen(true);
    setIsAvailableOnline(true);
  };

  const value: PartnerStoreContextType = {
    hydrated,
    session,
    vendorProfile,
    caretakerProfile,
    vendorDocuments,
    caretakerDocuments,
    isStoreOpen,
    vendorOrders,
    catalogue,
    isAvailableOnline,
    weeklySchedule,
    leaveDates,
    caretakerBookings,
    earnings,
    transactions,
    loginPhone,
    verifyOtp,
    selectRole,
    updateDocumentStatus,
    submitKyc,
    approveKyc,
    toggleStoreOpen,
    toggleAvailableOnline,
    updateVendorProfile,
    updateCaretakerProfile,
    logout,
  };

  return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
}

export function usePartnerStore(): PartnerStoreContextType {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error('usePartnerStore must be used within a PartnerStoreProvider');
  }
  return context;
}
```

---

## 3. Screen Specifications & Implementation Details

### 3.1 File: `partner-app/src/screens/auth/SplashScreen.tsx`

```tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Pill, HeartPulse } from 'lucide-react-native';
import { LifelineMark, Wordmark } from '@lifeline/mobile-ui';
import { T } from '@lifeline/mobile-ui';
import { colors, radius } from '@lifeline/mobile-ui';
import { usePartnerStore } from '../../store/PartnerStore';

export default function SplashScreen() {
  const nav = useNavigation<any>();
  const { hydrated, session } = usePartnerStore();

  useEffect(() => {
    if (!hydrated) return;

    const timer = setTimeout(() => {
      // 1. Not logged in -> Login
      if (!session.isLoggedIn) {
        nav.replace('Login');
        return;
      }

      // 2. Logged in but role not selected -> RoleSelection
      if (!session.role) {
        nav.replace('RoleSelection');
        return;
      }

      // 3. Role selected but KYC not approved
      if (session.kycStatus === 'missing') {
        nav.replace('KycUpload');
        return;
      }
      if (session.kycStatus === 'pending') {
        nav.replace('KycPending');
        return;
      }

      // 4. KYC approved -> role-based Tab console
      if (session.role === 'vendor') {
        nav.replace('VendorTabs');
      } else {
        nav.replace('CaretakerTabs');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [hydrated, session, nav]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <LifelineMark size={76} />
        <View style={{ height: 16 }} />
        <Wordmark size={26} light />
        <View style={{ height: 10 }} />
        <T size={14} color="#9AA0B4" w="semibold">
          Healthcare Partner Console
        </T>

        <View style={styles.pillRow}>
          <View style={[styles.roleBadge, { backgroundColor: '#1A8A5720', borderColor: '#1A8A57' }]}>
            <Pill size={13} color="#1A8A57" />
            <T size={11} color="#E2F5EA" w="bold">
              Medicine Vendor
            </T>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: '#6F5BC920', borderColor: '#6F5BC9' }]}>
            <HeartPulse size={13} color="#6F5BC9" />
            <T size={11} color="#ECE9FB" w="bold">
              Nurse & Caretaker
            </T>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator color={colors.teal} size="small" />
        <T size={11} color="#646A88" style={{ marginTop: 10 }}>
          Version 1.0.0 · Capability Showcase
        </T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2340', // Deep Lifeline Ink
    justifyContent: 'space-between',
    paddingVertical: 50,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  footer: {
    alignItems: 'center',
  },
});
```

---

### 3.2 File: `partner-app/src/screens/auth/LoginScreen.tsx`

```tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShieldCheck, PhoneCall, Store, HeartPulse, Sparkles } from 'lucide-react-native';
import { LifelineMark, Wordmark, Button, Card, Field, T, colors, radius, service } from '@lifeline/mobile-ui';
import { usePartnerStore } from '../../store/PartnerStore';

export default function LoginScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { loginPhone } = usePartnerStore();
  const [phone, setPhone] = useState('9876543210');
  const [error, setError] = useState('');

  const handleQuickSelect = (selectedPhone: string) => {
    setPhone(selectedPhone);
    setError('');
  };

  const handleContinue = () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    loginPhone(clean);
    nav.navigate('Otp', { phone: clean });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
        {/* Header Branding */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <LifelineMark size={50} />
          <View style={{ height: 8 }} />
          <Wordmark size={20} />
          <T size={13} color={colors.muted} style={{ marginTop: 4 }}>
            Healthcare Partner Console
          </T>
        </View>

        <T w="extrabold" size={24} style={{ marginBottom: 6 }}>
          Partner Login
        </T>
        <T size={14} color={colors.muted} style={{ marginBottom: 22 }} lh={20}>
          Sign in or register your pharmacy or home nursing service with your mobile number.
        </T>

        {/* Mobile Input Field */}
        <Field
          label="Mobile Number"
          placeholder="10-digit mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={(t) => {
            setPhone(t);
            setError('');
          }}
          error={error}
          left={
            <View style={{ paddingRight: 10, borderRightWidth: 1, borderRightColor: colors.line }}>
              <T w="bold" size={15} color={colors.ink}>
                +91
              </T>
            </View>
          }
        />

        <View style={{ height: 12 }} />
        <Button title="Get OTP" onPress={handleContinue} />

        {/* Demo Quick-Select Accounts */}
        <View style={{ marginTop: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Sparkles size={16} color={colors.teal} />
            <T w="bold" size={13} color={colors.ink}>
              Demo Quick-Select Accounts
            </T>
          </View>

          {/* Quick Option 1: Vendor */}
          <Pressable
            onPress={() => handleQuickSelect('9876543210')}
            style={({ pressed }) => [
              styles.quickCard,
              {
                borderColor: phone === '9876543210' ? colors.green : colors.line,
                backgroundColor: phone === '9876543210' ? service.medicine.bg : colors.surface2,
                opacity: pressed ? 0.8 : 1,
              },
            ]}>
            <View style={[styles.avatarCircle, { backgroundColor: service.medicine.bg }]}>
              <Store size={20} color={service.medicine.fg} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <T w="bold" size={14}>
                  Medicine Vendor Demo
                </T>
                {phone === '9876543210' && (
                  <View style={styles.activeTag}>
                    <T size={10} color={colors.white} w="bold">
                      SELECTED
                    </T>
                  </View>
                )}
              </View>
              <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
                Sri Sai Medicals · +91 98765 43210
              </T>
            </View>
          </Pressable>

          {/* Quick Option 2: Caretaker */}
          <Pressable
            onPress={() => handleQuickSelect('9845011223')}
            style={({ pressed }) => [
              styles.quickCard,
              {
                borderColor: phone === '9845011223' ? service.nursing.fg : colors.line,
                backgroundColor: phone === '9845011223' ? service.nursing.bg : colors.surface2,
                opacity: pressed ? 0.8 : 1,
                marginTop: 10,
              },
            ]}>
            <View style={[styles.avatarCircle, { backgroundColor: service.nursing.bg }]}>
              <HeartPulse size={20} color={service.nursing.fg} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <T w="bold" size={14}>
                  Nurse / Caretaker Demo
                </T>
                {phone === '9845011223' && (
                  <View style={[styles.activeTag, { backgroundColor: service.nursing.fg }]}>
                    <T size={10} color={colors.white} w="bold">
                      SELECTED
                    </T>
                  </View>
                )}
              </View>
              <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
                Sunita Rao, GNM · +91 98450 11223
              </T>
            </View>
          </Pressable>
        </View>

        {/* Footer Support */}
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: insets.bottom + 16, marginTop: 36 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <PhoneCall size={14} color={colors.muted} />
            <T size={12} color={colors.muted}>
              Need partner onboarding support? Call 1800-360-911
            </T>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activeTag: {
    backgroundColor: colors.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
```

---

### 3.3 File: `partner-app/src/screens/auth/OtpScreen.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyRound, ShieldAlert, RotateCw } from 'lucide-react-native';
import { AppBar, Button, Card, Field, T, colors, radius } from '@lifeline/mobile-ui';
import { usePartnerStore } from '../../store/PartnerStore';

export default function OtpScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { verifyOtp, session } = usePartnerStore();
  const phone = route.params?.phone || '9876543210';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleResend = () => {
    setCountdown(30);
    setError('');
  };

  const handleVerify = () => {
    const clean = otp.replace(/\D/g, '');
    if (clean.length < 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }
    setError('');
    verifyOtp(clean);

    // Evaluate destination routing
    if (!session.role) {
      nav.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
    } else if (session.kycStatus === 'missing') {
      nav.reset({ index: 0, routes: [{ name: 'KycUpload' }] });
    } else if (session.kycStatus === 'pending') {
      nav.reset({ index: 0, routes: [{ name: 'KycPending' }] });
    } else {
      const nextTab = session.role === 'vendor' ? 'VendorTabs' : 'CaretakerTabs';
      nav.reset({ index: 0, routes: [{ name: nextTab }] });
    }
  };

  const masked = phone.length >= 10 ? `${phone.slice(0, 2)}•••• ••${phone.slice(8)}` : phone;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Verify OTP" onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <T w="extrabold" size={22} style={{ marginBottom: 6 }}>
          Enter Verification Code
        </T>
        <T size={14} color={colors.muted} style={{ marginBottom: 24 }} lh={20}>
          We sent a 6-digit OTP to +91 {masked}.
        </T>

        <Field
          label="6-Digit OTP"
          placeholder="e.g. 123456"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={(t) => {
            setOtp(t);
            setError('');
          }}
          error={error}
        />

        <View style={{ height: 16 }} />
        <Button title="Verify & Proceed" onPress={handleVerify} />

        {/* Resend Countdown */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          {countdown > 0 ? (
            <T size={13} color={colors.muted}>
              Resend OTP in <T w="bold" color={colors.ink}>{countdown}s</T>
            </T>
          ) : (
            <Pressable onPress={handleResend} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <RotateCw size={14} color={colors.teal} />
              <T size={13} color={colors.teal} w="bold">
                Resend OTP Now
              </T>
            </Pressable>
          )}
        </View>

        {/* Demo Mode Notice */}
        <View style={{ marginTop: 28 }}>
          <Card style={{ backgroundColor: colors.surface2, borderColor: colors.lineStrong }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <KeyRound size={16} color={colors.teal} />
              <T w="bold" size={13}>
                Demo Mode Notice
              </T>
            </View>
            <T size={12} color={colors.muted} lh={18}>
              Any 6-digit code (e.g. 123456) is accepted during showcase mode. Tap Verify to continue.
            </T>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
```

---

### 3.4 File: `partner-app/src/screens/auth/RoleSelectionScreen.tsx`

```tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Pill, HeartPulse, CheckCircle2, Lock, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { AppBar, Button, Card, T, colors, radius, service } from '@lifeline/mobile-ui';
import { usePartnerStore } from '../../store/PartnerStore';
import { PartnerRole } from '../../store/types';

export default function RoleSelectionScreen() {
  const nav = useNavigation<any>();
  const { session, selectRole } = usePartnerStore();

  // Smart preselection: 9876543210 -> vendor, 9845011223 -> caretaker
  const defaultRole: PartnerRole = session.phone === '9845011223' ? 'caretaker' : 'vendor';
  const [selectedRole, setSelectedRole] = useState<PartnerRole>(session.role || defaultRole);

  const handleConfirmRole = () => {
    selectRole(selectedRole);
    nav.navigate('KycUpload');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Partner Role" onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Title */}
        <T w="extrabold" size={22} style={{ marginBottom: 6 }}>
          Choose Your Partner Role
        </T>
        <T size={14} color={colors.muted} style={{ marginBottom: 18 }} lh={20}>
          Select your service specialty. This determines your workspace and cannot be changed later.
        </T>

        {/* Strict Immutability Alert */}
        <Card style={{ backgroundColor: '#FFF6DA', borderColor: '#C99A12', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Lock size={16} color="#7A5A00" />
            <T w="bold" size={13} color="#7A5A00">
              One Account = One Role (Permanent)
            </T>
          </View>
          <T size={12} color="#7A5A00" lh={18}>
            Due to state pharmacy and healthcare licensing regulations, your profile cannot switch roles once onboarded.
          </T>
        </Card>

        {/* Role Option 1: Medicine Vendor */}
        <Pressable
          onPress={() => setSelectedRole('vendor')}
          style={({ pressed }) => [
            styles.roleCard,
            {
              borderColor: selectedRole === 'vendor' ? '#1A8A57' : colors.line,
              backgroundColor: selectedRole === 'vendor' ? '#E2F5EA' : colors.white,
              borderWidth: selectedRole === 'vendor' ? 2 : 1,
              opacity: pressed ? 0.9 : 1,
            },
          ]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={[styles.iconCircle, { backgroundColor: '#E2F5EA', borderColor: '#1A8A57' }]}>
              <Pill size={24} color="#1A8A57" />
            </View>
            {selectedRole === 'vendor' ? (
              <CheckCircle2 size={22} color="#1A8A57" />
            ) : (
              <View style={styles.radioUnselected} />
            )}
          </View>

          <T w="extrabold" size={17} color={colors.ink}>
            Medicine Vendor (Pharmacy)
          </T>
          <T size={13} color={colors.muted} style={{ marginTop: 4, marginBottom: 12 }} lh={18}>
            For retail chemists, medical stores, and licensed pharmacies fulfilling prescription orders.
          </T>

          <View style={styles.featureList}>
            <T size={12} color={colors.ink} style={{ marginBottom: 3 }}>
              • Receive simulated prescription & OTC medicine orders
            </T>
            <T size={12} color={colors.ink} style={{ marginBottom: 3 }}>
              • Packing checklist verification & rider handover OTP
            </T>
            <T size={12} color={colors.ink}>
              • Live catalogue stock toggles & quote builder
            </T>
          </View>
        </Pressable>

        {/* Role Option 2: Nurse / Caretaker */}
        <Pressable
          onPress={() => setSelectedRole('caretaker')}
          style={({ pressed }) => [
            styles.roleCard,
            {
              borderColor: selectedRole === 'caretaker' ? '#6F5BC9' : colors.line,
              backgroundColor: selectedRole === 'caretaker' ? '#ECE9FB' : colors.white,
              borderWidth: selectedRole === 'caretaker' ? 2 : 1,
              marginTop: 14,
              opacity: pressed ? 0.9 : 1,
            },
          ]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={[styles.iconCircle, { backgroundColor: '#ECE9FB', borderColor: '#6F5BC9' }]}>
              <HeartPulse size={24} color="#6F5BC9" />
            </View>
            {selectedRole === 'caretaker' ? (
              <CheckCircle2 size={22} color="#6F5BC9" />
            ) : (
              <View style={styles.radioUnselected} />
            )}
          </View>

          <T w="extrabold" size={17} color={colors.ink}>
            Nurse or Caretaker
          </T>
          <T size={13} color={colors.muted} style={{ marginTop: 4, marginBottom: 12 }} lh={18}>
            For registered GNM/ANM nurses, certified caregivers, and home health professionals.
          </T>

          <View style={styles.featureList}>
            <T size={12} color={colors.ink} style={{ marginBottom: 3 }}>
              • Manage weekly shifts, available slots & leave dates
            </T>
            <T size={12} color={colors.ink} style={{ marginBottom: 3 }}>
              • GPS geofence arrival check-in at patient address
            </T>
            <T size={12} color={colors.ink}>
              • Active shift timer, vitals checklist & family completion OTP
            </T>
          </View>
        </Pressable>

        <View style={{ height: 24 }} />
        <Button
          title={`Confirm ${selectedRole === 'vendor' ? 'Medicine Vendor' : 'Caretaker'} Role`}
          onPress={handleConfirmRole}
          icon={<ArrowRight size={18} color={colors.white} />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  roleCard: {
    padding: 16,
    borderRadius: radius.lg,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.lineStrong,
  },
  featureList: {
    borderTopWidth: 1,
    borderTopColor: '#E6E9E8',
    paddingTop: 10,
  },
});
```

---

### 3.5 File: `partner-app/src/screens/auth/KycUploadScreen.tsx`

```tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FileText, CheckCircle2, Clock, UploadCloud, Camera, ShieldCheck, ChevronRight } from 'lucide-react-native';
import { AppBar, Button, Card, Badge, T, colors, radius, service } from '@lifeline/mobile-ui';
import { usePartnerStore } from '../../store/PartnerStore';
import { KycDocumentItem } from '../../store/types';

export default function KycUploadScreen() {
  const nav = useNavigation<any>();
  const { session, vendorDocuments, caretakerDocuments, updateDocumentStatus, submitKyc } = usePartnerStore();
  const role = session.role || 'vendor';
  const documents = role === 'vendor' ? vendorDocuments : caretakerDocuments;

  const [activeDoc, setActiveDoc] = useState<KycDocumentItem | null>(null);

  const missingCount = documents.filter((d) => d.status === 'missing' || d.status === 'rejected').length;

  // Mock document photo capture & upload simulation
  const handleSimulateUpload = (doc: KycDocumentItem) => {
    updateDocumentStatus(role, doc.id, {
      status: 'pending',
      fileUri: `file://simulated_kyc/${doc.id}_signed.jpg`,
      docNumber: doc.docNumber || `DOC-${Date.now().toString().slice(-6)}`,
    });
    Alert.alert('Document Captured', `Mock upload completed for "${doc.title}". Status updated to Pending Review.`);
    setActiveDoc(null);
  };

  const handleSubmitAll = () => {
    submitKyc();
    nav.replace('KycPending');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="KYC Verification" onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        {/* Role Banner */}
        <View
          style={[
            styles.banner,
            {
              backgroundColor: role === 'vendor' ? service.medicine.bg : service.nursing.bg,
              borderColor: role === 'vendor' ? service.medicine.fg : service.nursing.fg,
            },
          ]}>
          <ShieldCheck size={20} color={role === 'vendor' ? service.medicine.fg : service.nursing.fg} />
          <View style={{ flex: 1 }}>
            <T w="bold" size={14} color={role === 'vendor' ? service.medicine.text : service.nursing.text}>
              {role === 'vendor' ? 'Medicine Vendor Regulatory KYC' : 'Nursing Caretaker Credential Check'}
            </T>
            <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
              Upload required government & council certificates to activate partner console.
            </T>
          </View>
        </View>

        <T w="extrabold" size={18} style={{ marginBottom: 4 }}>
          Required Compliance Documents
        </T>
        <T size={13} color={colors.muted} style={{ marginBottom: 16 }}>
          All mandatory documents must be uploaded before submitting for fleet approval.
        </T>

        {/* Document Cards */}
        {documents.map((doc) => {
          const isUploaded = doc.status === 'pending' || doc.status === 'approved';
          const isApproved = doc.status === 'approved';

          return (
            <Pressable
              key={doc.id}
              onPress={() => handleSimulateUpload(doc)}
              style={({ pressed }) => [
                styles.docCard,
                {
                  opacity: pressed ? 0.8 : 1,
                  borderColor: isUploaded ? colors.teal : colors.line,
                },
              ]}>
              <View
                style={[
                  styles.docIcon,
                  { backgroundColor: isApproved ? colors.greenSoft : isUploaded ? colors.tealTint : colors.surface2 },
                ]}>
                {isApproved ? (
                  <CheckCircle2 size={20} color={colors.green} />
                ) : isUploaded ? (
                  <Clock size={20} color={colors.teal} />
                ) : (
                  <FileText size={20} color={colors.muted} />
                )}
              </View>

              <View style={{ flex: 1, marginRight: 8 }}>
                <T w="bold" size={14} numberOfLines={1}>
                  {doc.title}
                </T>
                <T size={12} color={colors.muted} numberOfLines={1} style={{ marginTop: 2 }}>
                  {doc.description}
                </T>
                {doc.docNumber && (
                  <T size={11} color={colors.teal} style={{ marginTop: 3 }}>
                    ID: {doc.docNumber} {doc.expiryDate ? `· Exp: ${doc.expiryDate}` : ''}
                  </T>
                )}
              </View>

              <Badge
                label={isApproved ? 'Verified' : isUploaded ? 'Uploaded' : 'Upload'}
                variant={isApproved ? 'success' : isUploaded ? 'info' : 'neutral'}
              />
            </Pressable>
          );
        })}

        <View style={{ height: 20 }} />

        {/* Submit Button */}
        <Button
          title={
            missingCount > 0
              ? `Upload ${missingCount} More Document${missingCount > 1 ? 's' : ''}`
              : 'Submit for Verification'
          }
          disabled={missingCount > 0}
          onPress={handleSubmitAll}
        />

        {/* Fast Mock Upload Helper */}
        {missingCount > 0 && (
          <Pressable
            onPress={() => {
              documents.forEach((d) => handleSimulateUpload(d));
            }}
            style={{ alignItems: 'center', marginTop: 14 }}>
            <T size={12} color={colors.teal} w="bold">
              ⚡ Demo Shortcut: Upload All Documents at Once
            </T>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: 20,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: 10,
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
```

---

### 3.6 File: `partner-app/src/screens/auth/KycPendingScreen.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Clock, CheckCircle2, ShieldCheck, PhoneCall, ArrowRight } from 'lucide-react-native';
import { AppBar, Button, Card, T, colors, radius, service } from '@lifeline/mobile-ui';
import { usePartnerStore } from '../../store/PartnerStore';

export default function KycPendingScreen() {
  const nav = useNavigation<any>();
  const { session, approveKyc } = usePartnerStore();
  const [countdown, setCountdown] = useState(6);

  const role = session.role || 'vendor';

  const handleInstantApprove = () => {
    approveKyc();
    nav.replace('WelcomeApproved');
  };

  // 6-second simulated auto-approval countdown
  useEffect(() => {
    if (session.kycStatus === 'approved') return;

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          approveKyc();
          nav.replace('WelcomeApproved');
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.kycStatus]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Verification Status" onBack={() => nav.navigate('KycUpload')} />
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
        {/* Pulsing Clock Icon */}
        <View style={styles.clockCircle}>
          <Clock size={44} color="#C99A12" />
        </View>

        <T w="extrabold" size={22} center style={{ marginBottom: 8 }}>
          Verification in Progress
        </T>
        <T size={14} color={colors.muted} center lh={22} style={{ marginBottom: 20 }}>
          {role === 'vendor'
            ? 'Your Drug License (Form 20/21) and GSTIN credentials have been submitted to Lifeline Pharmacy Operations.'
            : 'Your Nursing Council registration and background clearance certificates have been submitted to Clinical Operations.'}
        </T>

        {/* Countdown Box */}
        <View style={styles.countdownBox}>
          <T size={12} color={colors.ink} w="semibold">
            Simulated Demo Auto-Approval in:
          </T>
          <T w="extrabold" size={20} color={colors.teal}>
            00:0{countdown}
          </T>
        </View>

        {/* Informational Next Steps */}
        <Card style={{ width: '100%', backgroundColor: colors.surface2, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <ShieldCheck size={18} color={colors.teal} />
            <T w="bold" size={14}>
              What happens during review?
            </T>
          </View>
          <T size={12} color={colors.muted} lh={18}>
            {role === 'vendor'
              ? '1. Verification with State Drug Control Department.\n2. Pharmacist registration status confirmed.\n3. Digital store unlocked for instant order dispatch.'
              : '1. Registration check with State Nursing Council.\n2. Identity & police clearance validation.\n3. Shift availability schedule unlocked for booking offers.'}
          </T>
        </Card>

        {/* Demo Instant Override Button */}
        <Button
          title="Demo Mode: Approve Now"
          variant="primary"
          icon={<CheckCircle2 size={18} color={colors.white} />}
          onPress={handleInstantApprove}
          style={{ width: '100%', marginBottom: 12 }}
        />

        {/* Helpline */}
        <Button
          title="Onboarding Hotline (1800-360-911)"
          variant="outline"
          icon={<PhoneCall size={18} color={colors.teal} />}
          onPress={() => Alert.alert('Helpline', 'Calling Lifeline Partner Support at 1800-360-911')}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  clockCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FFF6DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  countdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: colors.tealTint,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.tealLine,
  },
});
```

---

### 3.7 File: `partner-app/src/screens/auth/WelcomeApprovedScreen.tsx`

```tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle2, ArrowRight, Store, HeartPulse } from 'lucide-react-native';
import { Button, Card, T, colors, radius, service } from '@lifeline/mobile-ui';
import { usePartnerStore } from '../../store/PartnerStore';

export default function WelcomeApprovedScreen() {
  const nav = useNavigation<any>();
  const { session, vendorProfile, caretakerProfile } = usePartnerStore();
  const role = session.role || 'vendor';

  const handleEnterConsole = () => {
    const nextTab = role === 'vendor' ? 'VendorTabs' : 'CaretakerTabs';
    nav.reset({ index: 0, routes: [{ name: nextTab }] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
        <View style={styles.celebrationCircle}>
          <CheckCircle2 size={54} color={colors.green} />
        </View>

        <T w="extrabold" size={24} center style={{ marginBottom: 8 }}>
          Account Verified & Active!
        </T>

        <T size={14} color={colors.muted} center lh={22} style={{ marginBottom: 24 }}>
          {role === 'vendor'
            ? `Welcome aboard, ${vendorProfile.storeName}! Your pharmacy has been verified by Lifeline 360.`
            : `Welcome aboard, Nurse ${caretakerProfile.fullName}! Your nursing credentials have been verified.`}
        </T>

        <Card
          style={{
            width: '100%',
            backgroundColor: role === 'vendor' ? service.medicine.bg : service.nursing.bg,
            borderColor: role === 'vendor' ? service.medicine.fg : service.nursing.fg,
            marginBottom: 28,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            {role === 'vendor' ? (
              <Store size={20} color={service.medicine.fg} />
            ) : (
              <HeartPulse size={20} color={service.nursing.fg} />
            )}
            <T w="bold" size={15} color={role === 'vendor' ? service.medicine.text : service.nursing.text}>
              {role === 'vendor' ? 'Store Status: Live & Ready' : 'Duty Status: Available'}
            </T>
          </View>
          <T size={12} color={colors.ink} lh={18}>
            {role === 'vendor'
              ? 'Keep your store toggle ON in the dashboard to receive orders from nearby patients and dispatch via Lifeline riders.'
              : 'Set your weekly shift slots in the Today tab to start receiving home care and nursing requests.'}
          </T>
        </Card>

        <Button
          title="Enter Partner Console"
          icon={<ArrowRight size={18} color={colors.white} />}
          onPress={handleEnterConsole}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  celebrationCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
});
```

---

## 4. Navigation Architecture: `RootNavigator.tsx`

### 4.1 Navigation Branching Logic
```
                      [RootNavigator]
                             │
            ┌────────────────┴────────────────┐
   [Not Authenticated / KYC]             [Approved]
            │                                 │
     Auth Stack:                              │
     - Splash                                 │
     - Login                                  │
     - Otp                                    │
     - RoleSelection                          │
     - KycUpload                              │
     - KycPending                             │
     - WelcomeApproved                        │
                                              │
                      ┌───────────────────────┴───────────────────────┐
             (role === 'vendor')                            (role === 'caretaker')
                      │                                               │
                 [VendorTabs]                                   [CaretakerTabs]
              1. Orders (Mint #1A8A57)                       1. Today (Lavender #6F5BC9)
              2. Catalogue                                   2. Requests
              3. Earnings                                    3. Earnings
              4. Profile                                     4. Profile
```

### 4.2 File: `partner-app/src/navigation/RootNavigator.tsx`

```tsx
import React from 'react';
import { Pressable, StatusBar, View, Text } from 'react-native';
import { NavigationContainer, createNavigationContainerRef, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  User,
  CalendarDays,
  Inbox,
  House,
} from 'lucide-react-native';

import { colors, radius, service, T } from '@lifeline/mobile-ui';
import { usePartnerStore } from '../store/PartnerStore';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import KycUploadScreen from '../screens/auth/KycUploadScreen';
import KycPendingScreen from '../screens/auth/KycPendingScreen';
import WelcomeApprovedScreen from '../screens/auth/WelcomeApprovedScreen';

// Stub Tab Screens for M1 Compilation (Worker replaces with full M2/M3/M4 implementations)
import {
  VendorOrdersScreen,
  VendorCatalogueScreen,
  CaretakerTodayScreen,
  CaretakerRequestsScreen,
  SharedEarningsScreen,
  SharedProfileScreen,
} from './TabStubs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const navigationRef = createNavigationContainerRef<any>();

const DARK_SCREENS = new Set(['Splash']);
function syncStatusBar() {
  const current = navigationRef.getCurrentRoute()?.name;
  StatusBar.setBarStyle(current && DARK_SCREENS.has(current) ? 'light-content' : 'dark-content', true);
}

// Vendor Tabs Definition
const VENDOR_TABS = [
  { name: 'VendorOrders', label: 'Orders', Icon: ShoppingBag, component: VendorOrdersScreen },
  { name: 'VendorCatalogue', label: 'Catalogue', Icon: Package, component: VendorCatalogueScreen },
  { name: 'VendorEarnings', label: 'Earnings', Icon: TrendingUp, component: SharedEarningsScreen },
  { name: 'VendorProfile', label: 'Profile', Icon: User, component: SharedProfileScreen },
];

// Caretaker Tabs Definition
const CARETAKER_TABS = [
  { name: 'CaretakerToday', label: 'Today', Icon: CalendarDays, component: CaretakerTodayScreen },
  { name: 'CaretakerRequests', label: 'Requests', Icon: Inbox, component: CaretakerRequestsScreen },
  { name: 'CaretakerEarnings', label: 'Earnings', Icon: TrendingUp, component: SharedEarningsScreen },
  { name: 'CaretakerProfile', label: 'Profile', Icon: User, component: SharedProfileScreen },
];

function PartnerTabBar({ state, navigation, tabs, activeColor }: BottomTabBarProps & { tabs: any[]; activeColor: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.line,
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
      }}>
      {state.routes.map((route, index) => {
        const tab = tabs.find((t) => t.name === route.name) || tabs[0];
        const isFocused = state.index === index;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={{ flex: 1, alignItems: 'center', gap: 3, paddingVertical: 2 }}>
            {isFocused && (
              <View
                style={{
                  position: 'absolute',
                  top: -8,
                  width: 28,
                  height: 3,
                  borderBottomLeftRadius: 3,
                  borderBottomRightRadius: 3,
                  backgroundColor: activeColor,
                }}
              />
            )}
            <tab.Icon
              size={22}
              color={isFocused ? activeColor : colors.muted}
              strokeWidth={isFocused ? 2.2 : 1.8}
            />
            <T w={isFocused ? 'bold' : 'semibold'} size={11} color={isFocused ? activeColor : colors.muted}>
              {tab.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

function VendorTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <PartnerTabBar {...props} tabs={VENDOR_TABS} activeColor={colors.green} />}>
      {VENDOR_TABS.map((t) => (
        <Tab.Screen key={t.name} name={t.name} component={t.component} />
      ))}
    </Tab.Navigator>
  );
}

function CaretakerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <PartnerTabBar {...props} tabs={CARETAKER_TABS} activeColor={service.nursing.fg} />}>
      {CARETAKER_TABS.map((t) => (
        <Tab.Screen key={t.name} name={t.name} component={t.component} />
      ))}
    </Tab.Navigator>
  );
}

const partnerTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    primary: colors.teal,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef} theme={partnerTheme} onReady={syncStatusBar} onStateChange={syncStatusBar}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }} initialRouteName="Splash">
        {/* Shared Auth & Onboarding Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="KycUpload" component={KycUploadScreen} />
        <Stack.Screen name="KycPending" component={KycPendingScreen} />
        <Stack.Screen name="WelcomeApproved" component={WelcomeApprovedScreen} />

        {/* Role-Specific Consoles */}
        <Stack.Screen name="VendorTabs" component={VendorTabs} options={{ animation: 'fade' }} />
        <Stack.Screen name="CaretakerTabs" component={CaretakerTabs} options={{ animation: 'fade' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 4.3 File: `partner-app/src/navigation/TabStubs.tsx` (Ensures M1 Compiles Cleanly)

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppBar, Card, Button, T, colors, radius, service } from '@lifeline/mobile-ui';
import { usePartnerStore } from '../store/PartnerStore';
import { ShoppingBag, Package, TrendingUp, User, CalendarDays, Inbox, Power } from 'lucide-react-native';

export function VendorOrdersScreen() {
  const { vendorProfile, isStoreOpen, toggleStoreOpen } = usePartnerStore();
  return (
    <View style={styles.container}>
      <AppBar title="Orders" />
      <View style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16, backgroundColor: isStoreOpen ? '#E2F5EA' : colors.surface2 }}>
          <T w="bold" size={16} color={colors.ink}>
            {vendorProfile.storeName}
          </T>
          <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
            {vendorProfile.pharmacistName} · Status: {isStoreOpen ? 'STORE OPEN' : 'STORE CLOSED'}
          </T>
        </Card>
        <Button
          title={isStoreOpen ? 'Toggle Store Offline' : 'Toggle Store Online'}
          variant={isStoreOpen ? 'outline' : 'primary'}
          onPress={toggleStoreOpen}
        />
      </View>
    </View>
  );
}

export function VendorCatalogueScreen() {
  const { catalogue } = usePartnerStore();
  return (
    <View style={styles.container}>
      <AppBar title="Catalogue" />
      <View style={{ padding: 16 }}>
        <T w="bold" size={14}>
          Catalogue ({catalogue.length} items loaded)
        </T>
      </View>
    </View>
  );
}

export function CaretakerTodayScreen() {
  const { caretakerProfile, isAvailableOnline, toggleAvailableOnline } = usePartnerStore();
  return (
    <View style={styles.container}>
      <AppBar title="Today" />
      <View style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16, backgroundColor: isAvailableOnline ? '#ECE9FB' : colors.surface2 }}>
          <T w="bold" size={16} color={colors.ink}>
            Nurse {caretakerProfile.fullName}
          </T>
          <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
            {caretakerProfile.title} · Duty: {isAvailableOnline ? 'AVAILABLE FOR SHIFTS' : 'OFFLINE'}
          </T>
        </Card>
        <Button
          title={isAvailableOnline ? 'Go Off Duty' : 'Go On Duty'}
          variant={isAvailableOnline ? 'outline' : 'primary'}
          onPress={toggleAvailableOnline}
        />
      </View>
    </View>
  );
}

export function CaretakerRequestsScreen() {
  return (
    <View style={styles.container}>
      <AppBar title="Requests" />
      <View style={{ padding: 16 }}>
        <T size={14} color={colors.muted}>
          Incoming Shift Requests Inbox
        </T>
      </View>
    </View>
  );
}

export function SharedEarningsScreen() {
  const { earnings } = usePartnerStore();
  return (
    <View style={styles.container}>
      <AppBar title="Earnings" />
      <View style={{ padding: 16 }}>
        <Card>
          <T size={12} color={colors.muted}>
            Today's Net Earnings
          </T>
          <T w="extrabold" size={24} color={colors.teal} style={{ marginTop: 4 }}>
            ₹{earnings.todayNet.toLocaleString('en-IN')}
          </T>
        </Card>
      </View>
    </View>
  );
}

export function SharedProfileScreen() {
  const { session, logout } = usePartnerStore();
  return (
    <View style={styles.container}>
      <AppBar title="Profile" />
      <View style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16 }}>
          <T w="bold" size={14}>
            Role: {session.role === 'vendor' ? 'Medicine Vendor' : 'Nurse / Caretaker'}
          </T>
          <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
            Registered Mobile: +91 {session.phone}
          </T>
        </Card>
        <Button title="Logout" variant="outline" onPress={logout} icon={<Power size={18} color={colors.red} />} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
```

---

## 5. App Entry Point: `partner-app/App.tsx`

```tsx
/**
 * Lifeline 360 — Partner App (Medicine Vendor & Nurse/Caretaker)
 * Native Android Capability Showcase
 */
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PartnerStoreProvider } from './src/store/PartnerStore';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PartnerStoreProvider>
        <RootNavigator />
      </PartnerStoreProvider>
    </SafeAreaProvider>
  );
}
```

---

## 6. Step-by-Step Implementation Instructions for Worker

1. **Verify Prerequisite Files**:
   - Ensure `@lifeline/mobile-ui` is built or mapped in `partner-app/package.json` and `partner-app/tsconfig.json`.
2. **Create State Store**:
   - Write `partner-app/src/store/types.ts` with all types.
   - Write `partner-app/src/store/PartnerStore.tsx` with initial seeds and context hooks.
3. **Create Auth & KYC Screens**:
   - Write `partner-app/src/screens/auth/SplashScreen.tsx`.
   - Write `partner-app/src/screens/auth/LoginScreen.tsx`.
   - Write `partner-app/src/screens/auth/OtpScreen.tsx`.
   - Write `partner-app/src/screens/auth/RoleSelectionScreen.tsx`.
   - Write `partner-app/src/screens/auth/KycUploadScreen.tsx`.
   - Write `partner-app/src/screens/auth/KycPendingScreen.tsx`.
   - Write `partner-app/src/screens/auth/WelcomeApprovedScreen.tsx`.
4. **Create Navigation & Tab Stubs**:
   - Write `partner-app/src/navigation/TabStubs.tsx`.
   - Write `partner-app/src/navigation/RootNavigator.tsx`.
   - Write `partner-app/App.tsx`.
5. **Static Verification**:
   - Run `npx tsc --noEmit` in `partner-app/` to confirm 0 TypeScript errors.
   - Run `npx eslint src` to confirm 0 lint errors.
