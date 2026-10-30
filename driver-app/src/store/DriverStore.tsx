import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DriverProfile,
  EmergencyRequest,
  INITIAL_DOCUMENTS,
  INITIAL_DRIVER,
  KycDocument,
  SAMPLE_EMERGENCY_REQUESTS,
  SAMPLE_PAST_TRIPS,
  SAMPLE_TRANSACTIONS,
  TransactionRecord,
  TripRecord,
} from '../data/sampleData';

export type TripStage =
  | 'IDLE'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'TO_PICKUP'
  | 'ARRIVED'
  | 'PATIENT_ON_BOARD'
  | 'TO_HOSPITAL'
  | 'REACHED'
  | 'COMPLETED';

/** The trip state machine: what each swipe moves the trip to. */
export function nextStage(stage: TripStage): TripStage {
  switch (stage) {
    case 'ACCEPTED':
      return 'TO_PICKUP';
    case 'TO_PICKUP':
      return 'ARRIVED';
    case 'ARRIVED':
      // "Patient on board" starts the drive to hospital straight away.
      return 'TO_HOSPITAL';
    case 'PATIENT_ON_BOARD':
      return 'TO_HOSPITAL';
    case 'TO_HOSPITAL':
      return 'REACHED';
    case 'REACHED':
      return 'COMPLETED';
    default:
      return stage;
  }
}

/** Driver keeps 80% of the fare; the rest is the platform commission (placeholder rate). */
export const DRIVER_SHARE = 0.8;
export const driverShareOf = (fare: number) => Math.round(fare * DRIVER_SHARE);

/** Splits a fare into the three lines shown on the trip summary; always sums to the fare. */
export function fareBreakdown(fare: number) {
  const base = Math.min(600, fare);
  const distance = Math.round((fare - base) * 0.65);
  return { base, distance, equipment: fare - base - distance };
}

/** Seconds between going online (or finishing a trip) and the next simulated request. */
const REQUEST_DELAY_MS = [8000, 15000];

interface ActiveTripState {
  stage: TripStage;
  request: EmergencyRequest | null;
  progress: number;
  paymentCollected: boolean;
  patientRating: number;
  startedAt?: number;
}

interface DriverSession {
  phone: string;
  isLoggedIn: boolean;
  isOnboarded: boolean;
  kycStatus: 'pending' | 'approved';
}

interface ShiftState {
  /** When the driver last went online; null while offline. */
  onlineSince: number | null;
  /** Online time banked from earlier stretches today. */
  bankedMs: number;
  day: string;
  offered: number;
  accepted: number;
}

interface DriverStoreContextType {
  hydrated: boolean;
  session: DriverSession;
  profile: DriverProfile;
  documents: KycDocument[];
  isOnline: boolean;
  incomingRequest: EmergencyRequest | null;
  activeTrip: ActiveTripState;
  trips: TripRecord[];
  transactions: TransactionRecord[];
  todayStats: {
    tripsCount: number;
    hoursOnline: string;
    earningsTotal: number;
    acceptanceRate: number;
  };
  loginPhone: (phone: string) => void;
  verifyOtp: (otp: string) => boolean;
  updateProfile: (details: Partial<DriverProfile>) => void;
  updateDocumentStatus: (id: string, status: KycDocument['status']) => void;
  submitKyc: () => void;
  approveKyc: () => void;
  toggleOnline: () => void;
  triggerSimulatedRequest: () => void;
  acceptRequest: () => void;
  declineRequest: (reason?: string) => void;
  advanceTripStage: () => void;
  completeTrip: (cashCollected: boolean, rating: number) => void;
  logout: () => void;
}

const STORAGE_KEY = '@lifeline360_driver_store_v2';

const IDLE_TRIP: ActiveTripState = { stage: 'IDLE', request: null, progress: 0, paymentCollected: false, patientRating: 5 };
const FIRST_RUN_SESSION: DriverSession = { phone: '', isLoggedIn: false, isOnboarded: false, kycStatus: 'pending' };
const today = () => new Date().toDateString();
const freshShift = (): ShiftState => ({ onlineSince: null, bankedMs: 0, day: today(), offered: 0, accepted: 0 });

const DriverContext = createContext<DriverStoreContextType | null>(null);

export function DriverStoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<DriverSession>(FIRST_RUN_SESSION);
  const [profile, setProfile] = useState<DriverProfile>(INITIAL_DRIVER);
  const [documents, setDocuments] = useState<KycDocument[]>(INITIAL_DOCUMENTS);
  const [shift, setShift] = useState<ShiftState>(freshShift);
  const [incomingRequest, setIncomingRequest] = useState<EmergencyRequest | null>(null);
  const [activeTrip, setActiveTrip] = useState<ActiveTripState>(IDLE_TRIP);
  const [trips, setTrips] = useState<TripRecord[]>(SAMPLE_PAST_TRIPS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(SAMPLE_TRANSACTIONS);
  const [, setTick] = useState(0);
  const isOnline = shift.onlineSince != null;

  // Load once; nothing is saved until this finishes, so defaults never overwrite stored data.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const p = JSON.parse(raw);
        if (p.session) setSession(p.session);
        if (p.profile) setProfile(p.profile);
        if (p.documents) setDocuments(p.documents);
        if (p.trips) setTrips(p.trips);
        if (p.transactions) setTransactions(p.transactions);
        if (p.activeTrip) setActiveTrip(p.activeTrip.stage === 'ACCEPTED' ? { ...p.activeTrip, stage: 'TO_PICKUP', progress: 0.05 } : p.activeTrip);
        if (p.shift) setShift(p.shift.day === today() ? p.shift : { ...freshShift(), onlineSince: p.shift.onlineSince ? Date.now() : null });
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ session, profile, documents, trips, transactions, activeTrip, shift })).catch(() => {});
  }, [hydrated, session, profile, documents, trips, transactions, activeTrip, shift]);

  // Refresh the online-hours figure every minute while online.
  useEffect(() => {
    if (!isOnline) return;
    const t = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(t);
  }, [isOnline]);

  // Simulated vehicle movement while driving to the pickup or the hospital.
  useEffect(() => {
    if (activeTrip.stage !== 'TO_PICKUP' && activeTrip.stage !== 'TO_HOSPITAL') return;
    const interval = setInterval(() => {
      setActiveTrip((prev) => (prev.progress >= 1 ? prev : { ...prev, progress: Math.min(1, prev.progress + 0.08) }));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTrip.stage]);

  const offerRequest = useCallback(() => {
    const sample = SAMPLE_EMERGENCY_REQUESTS[Math.floor(Math.random() * SAMPLE_EMERGENCY_REQUESTS.length)];
    setIncomingRequest({ ...sample, id: 'req_' + Date.now(), createdAt: Date.now() });
    setShift((s) => ({ ...s, offered: s.offered + 1 }));
  }, []);

  // Demo dispatch: while online and free, a request arrives on its own after a short wait.
  // The backend will replace this with push / socket events.
  const canReceive = hydrated && session.isOnboarded && isOnline && activeTrip.stage === 'IDLE' && !incomingRequest;
  const scheduled = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!canReceive) return;
    const [min, max] = REQUEST_DELAY_MS;
    scheduled.current = setTimeout(offerRequest, min + Math.random() * (max - min));
    return () => {
      if (scheduled.current) clearTimeout(scheduled.current);
    };
  }, [canReceive, offerRequest]);

  const todayTrips = trips.filter((t) => t.date.startsWith('Today'));
  const onlineMs = shift.bankedMs + (shift.onlineSince ? Date.now() - shift.onlineSince : 0);
  const mins = Math.floor(onlineMs / 60000);
  const todayStats = {
    tripsCount: todayTrips.length,
    hoursOnline: `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`,
    earningsTotal: todayTrips.reduce((acc, t) => acc + t.driverShare, 0),
    acceptanceRate: shift.offered ? Math.round((shift.accepted / shift.offered) * 100) : 100,
  };

  const loginPhone = (phone: string) => setSession((s) => ({ ...s, phone }));

  const verifyOtp = (_otp: string) => {
    // Demo mode: any 6-digit code works until the SMS gateway is connected.
    setSession((s) => ({ ...s, isLoggedIn: true }));
    return true;
  };

  const updateProfile = (details: Partial<DriverProfile>) => setProfile((p) => ({ ...p, ...details }));

  const updateDocumentStatus = (id: string, status: KycDocument['status']) =>
    setDocuments((docs) => docs.map((d) => (d.id === id ? { ...d, status } : d)));

  const submitKyc = () => setSession((s) => ({ ...s, isOnboarded: true, kycStatus: 'pending' }));

  const approveKyc = () => {
    setDocuments((docs) => docs.map((d) => ({ ...d, status: 'approved' })));
    setSession((s) => ({ ...s, kycStatus: 'approved', isOnboarded: true }));
  };

  const toggleOnline = () => {
    if (activeTrip.stage !== 'IDLE') return; // cannot go offline during an emergency trip
    setShift((s) => {
      const base = s.day === today() ? s : freshShift();
      return base.onlineSince
        ? { ...base, bankedMs: base.bankedMs + (Date.now() - base.onlineSince), onlineSince: null }
        : { ...base, onlineSince: Date.now() };
    });
    if (isOnline) setIncomingRequest(null);
  };

  const triggerSimulatedRequest = () => {
    if (!isOnline || activeTrip.stage !== 'IDLE' || incomingRequest) return;
    if (scheduled.current) clearTimeout(scheduled.current);
    offerRequest();
  };

  const acceptRequest = () => {
    if (!incomingRequest) return;
    setActiveTrip({ ...IDLE_TRIP, stage: 'TO_PICKUP', progress: 0.05, request: incomingRequest, startedAt: Date.now() });
    setIncomingRequest(null);
    setShift((s) => ({ ...s, accepted: s.accepted + 1 }));
  };

  const declineRequest = (_reason?: string) => setIncomingRequest(null);

  const advanceTripStage = () =>
    setActiveTrip((prev) => {
      const stage = nextStage(prev.stage);
      const progress = stage === 'TO_PICKUP' || stage === 'TO_HOSPITAL' ? 0.1 : stage === 'PATIENT_ON_BOARD' ? 0 : 1;
      return { ...prev, stage, progress };
    });

  const completeTrip = (cashCollected: boolean, rating: number) => {
    const req = activeTrip.request;
    if (!req) return;
    const share = driverShareOf(req.estimatedFare);
    const tripMins = activeTrip.startedAt ? Math.max(1, Math.round((Date.now() - activeTrip.startedAt) / 60000)) : 18;
    const time = new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

    setTrips((prev) => [
      {
        id: 'tr_' + Date.now(),
        bookingCode: req.bookingCode,
        date: `Today, ${time}`,
        patientName: req.patientName,
        pickup: req.pickupAddress,
        destination: req.hospitalName,
        fare: req.estimatedFare,
        driverShare: share,
        distanceKm: req.distanceKm + req.hospitalDistanceKm,
        durationMins: tripMins,
        status: 'completed',
        serviceType: req.serviceType,
        paymentMode: cashCollected ? 'Cash' : 'Online',
      },
      ...prev,
    ]);
    setTransactions((prev) => [
      {
        id: 'tx_' + Date.now(),
        tripId: req.bookingCode,
        title: `Emergency trip fare (${req.bookingCode})`,
        date: `Today, ${time}`,
        amount: share,
        type: 'trip_credit',
        status: 'settled',
      },
      ...prev,
    ]);
    setActiveTrip({ ...IDLE_TRIP, patientRating: rating });
  };

  const logout = () => {
    setSession(FIRST_RUN_SESSION);
    setShift(freshShift());
    setIncomingRequest(null);
    setActiveTrip(IDLE_TRIP);
    setProfile(INITIAL_DRIVER);
    setDocuments(INITIAL_DOCUMENTS);
    setTrips(SAMPLE_PAST_TRIPS);
    setTransactions(SAMPLE_TRANSACTIONS);
  };

  const value: DriverStoreContextType = {
    hydrated,
    session,
    profile,
    documents,
    isOnline,
    incomingRequest,
    activeTrip,
    trips,
    transactions,
    todayStats,
    loginPhone,
    verifyOtp,
    updateProfile,
    updateDocumentStatus,
    submitKyc,
    approveKyc,
    toggleOnline,
    triggerSimulatedRequest,
    acceptRequest,
    declineRequest,
    advanceTripStage,
    completeTrip,
    logout,
  };

  return <DriverContext.Provider value={value}>{children}</DriverContext.Provider>;
}

export function useDriverStore() {
  const ctx = useContext(DriverContext);
  if (!ctx) throw new Error('useDriverStore must be used within DriverStoreProvider');
  return ctx;
}
