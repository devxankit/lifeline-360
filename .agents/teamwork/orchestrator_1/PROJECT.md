# Project: Lifeline Partner Native Android App

## Architecture
- **Architecture Style**: Monorepo with independent packages and mobile applications.
  - `packages/mobile-ui`: Reusable design system package containing theme tokens (`colors`, `service`, `font`, `radius`, `shadow`), typography (`T`), core UI primitives (`Button`, `Card`, `AppBar`, `Field`, `Chip`, `Badge`, `Toggle`, etc.), brand SVG assets, and interactive partner widgets (`CountdownRing`, `SwipeToConfirm`, `BarChart`, `OnlineToggle`).
  - `partner-app`: React Native CLI 0.87.1 native Android application serving Medicine Vendor and Nursing/Caretaker personas.
    - Application ID / Namespace: `com.lifeline360.partner`
    - Application Label: "Lifeline Partner"
    - Store: `PartnerStore.tsx` using React Context + `AsyncStorage` for offline-first state persistence.
    - Navigation: Role-based branching (`VendorTabs` vs `CaretakerTabs`).
    - Simulator Engines: `orderSimulator.ts` (vendor) and `requestSimulator.ts` (caretaker) running realistic background order/booking generation.
    - Business Logic Modules: Pure, testable state machines and calculation utilities (`orderStateMachine.ts`, `bookingStateMachine.ts`, `earningsCalculator.ts`, `availabilityFilter.ts`, `quoteBuilder.ts`).

## Code Layout
```
c:/Users/AnkitAhirwar/OneDrive/Desktop/lifeline 360/
├── packages/
│   └── mobile-ui/
│       ├── package.json               # @lifeline/mobile-ui package definition
│       ├── tsconfig.json              # TypeScript config
│       └── src/
│           ├── index.ts               # Barrel exports
│           ├── theme/                 # colors, service, font, radius, shadow
│           ├── components/            # T, Button, Card, AppBar, Field, etc.
│           ├── brand/                 # LifelineMark, Wordmark, ProductThumb, etc.
│           └── utils/                 # format, rupees, greeting, etc.
└── partner-app/
    ├── package.json                   # Dependencies, react-native 0.87.1, @lifeline/mobile-ui
    ├── tsconfig.json                  # TS config with path mappings
    ├── metro.config.js                # Metro with watchFolders for packages/mobile-ui and subst drive
    ├── babel.config.js
    ├── index.js                       # App registry entry point
    ├── App.tsx                        # Root navigator with PartnerProvider
    ├── src/
    │   ├── theme/                     # App-specific overrides (mint, lavender)
    │   ├── store/                     # PartnerStore.tsx, types.ts
    │   ├── logic/                     # Pure business logic modules (state machines, calculators)
    │   ├── simulators/                # orderSimulator.ts, requestSimulator.ts
    │   ├── data/                      # Initial sample catalogues, mock partners, reviews
    │   ├── navigation/                # RootNavigator, VendorTabs, CaretakerTabs
    │   └── screens/
    │       ├── auth/                  # Splash, Login, OTP, RoleSelection, KycUpload, KycPending
    │       ├── vendor/                # Dashboard, Orders, OrderDetail, Packing, Handover, RxReview, Catalogue, AddEditMedicine
    │       ├── caretaker/             # Today, Availability, Requests, ActiveBooking, GpsCheckIn, ShiftTimer, CompletionOtp, Reviews
    │       └── shared/                # Earnings, Profile, Settings, MaskedCall, Notifications, Help
    ├── __tests__/                     # Unit tests for pure business logic
    └── android/                       # Native Android project
        ├── app/
        │   ├── build.gradle           # Release guard, signingConfig, namespace com.lifeline360.partner
        │   └── src/main/
        │       ├── AndroidManifest.xml # package, label, permissions, MainActivity
        │       └── res/               # Custom mint-tile launcher icons & drawables
        ├── keystore/                  # lifeline360-partner-upload.keystore
        └── build.gradle
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Mobile UI Theme Extraction | Extract colors, typography, spacing, radius, and shadows into `packages/mobile-ui` | M1 | Survey |
| 2 | Mobile UI Primitives Extraction | Extract core UI components (Button, Card, AppBar, Field, Chip, Badge, Toggle, etc.) | M1 | Survey |
| 3 | Mobile UI Brand Assets | Extract SVG brand assets (LifelineMark, Wordmark, ProductThumb, DesignedMap) | M1 | Survey |
| 4 | Mobile UI Partner Widgets | Extract CountdownRing, SwipeToConfirm, BarChart, OnlineToggle into mobile-ui | M1 | Survey |
| 5 | Partner App Project Scaffolding | React Native 0.87.1 CLI scaffolding in `partner-app/` with TS and Metro config | M1 | Survey |
| 6 | Mobile UI Local Package Wiring | Wire `partner-app/package.json` to `"@lifeline/mobile-ui": "file:../packages/mobile-ui"` | M1 | Survey |
| 7 | Partner State & Storage Setup | Setup `PartnerStore.tsx` with offline persistence for role, auth, and state | M1 | Survey |
| 8 | Phone Login Screen | Phone number entry with country code, prefilled demo quick-select buttons | M1 | Survey |
| 9 | OTP Verification Screen | 6-digit OTP input with auto-focus, countdown timer, resend button, and demo bypass | M1 | Survey |
| 10 | Permanent Role Selection | Select Medicine Vendor vs Nurse/Caretaker with strict one-account = one-role rule | M1 | Survey |
| 11 | Role-Specific KYC Document Upload | Upload form tailored to role (Vendor: Drug License, GST; Caretaker: Nursing Reg, ID) | M1 | Survey |
| 12 | KYC Pending & Demo Approval | Pending state with simulated 6s auto-approval and instant activation override | M1 | Survey |
| 13 | Role-Based Navigation Branching | Permanent branch: Vendor -> `VendorTabs`, Caretaker -> `CaretakerTabs` | M1 | Survey |
| 14 | Vendor Dashboard Header & Status | Pharmacy name, rating, address, and live store open/closed toggle switch | M2 | Survey |
| 15 | Vendor Dashboard Today Metrics | Summary cards: Today's Orders, Revenue, Pending Handover, and Low-Stock count | M2 | Survey |
| 16 | Vendor Low-Stock Alert Banner | Alert banner highlighting catalogue items below threshold (< 10 units) | M2 | Survey |
| 17 | Vendor Order Simulator | Simulated order generator honoring store open/closed status | M2 | Survey |
| 18 | Vendor Incoming Order Notification | Floating modal/banner with 60s countdown timer and audio/vibration cue | M2 | Survey |
| 19 | Vendor Order Accept & Reject | Accept button advances order; Reject opens reason sheet with cancellation handling | M2 | Survey |
| 20 | Vendor Orders Tab List | Segmented list: New, In Progress (Packing/Ready), Handed Over, and Past Orders | M2 | Survey |
| 21 | Vendor Order Detail Screen | Full order breakdown: customer details, items, quantities, subtotal, and status | M2 | Survey |
| 22 | Vendor Packing Checklist | Interactive item-by-item checklist requiring all items verified before ready | M2 | Survey |
| 23 | Vendor Rider Handover & OTP | Handover view showing assigned rider details and 4-digit OTP entry/verification | M2 | Survey |
| 24 | Vendor Prescription Inbox | Dedicated queue for incoming prescription upload orders | M2 | Survey |
| 25 | Vendor Prescription Viewer | Zoomable prescription image viewer with pinch-to-zoom and pan support | M2 | Survey |
| 26 | Vendor Prescription Quote Builder | Line-by-line medicine search from catalogue, unit price, quantity, taxes, and fees | M2 | Survey |
| 27 | Vendor Quote Dispatch & Acceptance | Send quote to user with simulated user acceptance (6s) moving order to packing | M2 | Survey |
| 28 | Vendor Catalogue Category Filter | Browse catalogue by 8 categories (fever, diabetes, heart, vitamins, etc.) | M2 | Survey |
| 29 | Vendor Catalogue Search & List | Search medicines by brand/generic name with stock and price display | M2 | Survey |
| 30 | Vendor Stock Availability Toggle | Instant toggle switch to mark any medicine in/out of stock | M2 | Survey |
| 31 | Vendor Add/Edit Medicine Modal | Form to add new medicine or edit name, category, price, and initial stock units | M2 | Survey |
| 32 | Caretaker Today Dashboard | Caretaker header, rating (4.9), online/offline toggle, and today's schedule | M3 | Survey |
| 33 | Caretaker Weekly Slot Management | 7-day schedule matrix configuring available morning, afternoon, and night slots | M3 | Survey |
| 34 | Caretaker Leave Calendar | Date picker to mark leave/unavailable dates blocking incoming requests | M3 | Survey |
| 35 | Caretaker Request Simulator | Background simulator generating booking requests strictly during available slots | M3 | Survey |
| 36 | Caretaker Incoming Request Alert | Full-screen alert with service type, patient details, distance, fee, and timer | M3 | Survey |
| 37 | Caretaker Request Accept/Decline | Accept transitions to active booking; Decline logs reason and updates stats | M3 | Survey |
| 38 | Caretaker Requests Inbox Tab | Tab view of pending offers, upcoming confirmed bookings, and past history | M3 | Survey |
| 39 | Caretaker "On My Way" Transition | Status update notifying family that caretaker has departed with map/ETA display | M3 | Survey |
| 40 | Caretaker GPS Geofenced Check-In | Verification at patient address (<= 100m geofence) with demo bypass button | M3 | Survey |
| 41 | Caretaker Active Shift Timer Ring | Circular countdown timer showing remaining hours/minutes of active shift | M3 | Survey |
| 42 | Caretaker Clinical Care Checklist | Role-specific checklist (vitals, medication administered, feeding, hygiene) | M3 | Survey |
| 43 | Caretaker Care Notes & Summary | Text notes field for observations to be included in final family care report | M3 | Survey |
| 44 | Caretaker Family Completion OTP | Shift completion gate requiring 4-digit completion OTP provided by patient family | M3 | Survey |
| 45 | Caretaker Ratings & Reviews Feed | Reviews scorecard (4.9 average, 156 reviews), star breakdown, and user feedback | M3 | Survey |
| 46 | Earnings Summary Dashboard | Today, this week, and this month earnings with role-specific commission deducted | M4 | Survey |
| 47 | Earnings Trend Bar Chart | Interactive 7-day bar chart showing daily earnings distribution | M4 | Survey |
| 48 | Transaction History List | Detailed transaction ledger showing order/booking ID, date, gross, commission, net | M4 | Survey |
| 49 | Payout & Settlement Simulation | Payout button with mock bank account settlement flow | M4 | Survey |
| 50 | Shared Profile & Store Settings | Profile management, operating hours, store details, and bank account info | M4 | Survey |
| 51 | Shared Masked Calling Screen | Privacy-safe phone dialer connecting vendor/caretaker to customer/family | M4 | Survey |
| 52 | Shared Notifications Screen | System announcements, order alerts, policy updates, and payment alerts | M4 | Survey |
| 53 | Shared Help, Legal & Support | FAQs, support hotline contact, privacy policy, and terms of service | M4 | Survey |
| 54 | Pure Business Logic State Machines | Unit-tested state transitions: `orderStateMachine.ts` and `bookingStateMachine.ts` | M4 | Survey |
| 55 | Pure Business Logic Calculators | Unit-tested pure functions: `earningsCalculator.ts`, `quoteBuilder.ts`, `stock.ts` | M4 | Survey |
| 56 | Availability Filter Unit Tests | Unit tests verifying request simulator filtering against schedule and leave | M4 | Survey |
| 57 | Release Keystore Generation | Create dedicated `lifeline360-partner-upload.keystore` with partner credentials | M4 | Survey |
| 58 | Gradle Release Guard Configuration | Configure release signing and release guard in `partner-app/android/app/build.gradle`| M4 | Survey |
| 59 | Custom Partner App Icon & Resources | Generate custom mint-tile app icon `#E2F5EA` for Android mipmap folders | M4 | Survey |
| 60 | Signed Release APK Build | Build signed release APK via Gradle in `partner-app/android` | M4 | Survey |
| 61 | APK Verification via apksigner & aapt2 | Verify release signature cert and dump badging for package and label | M4 | Survey |
| 62 | E2E Test Suite Pass (Tiers 1-4) | Pass 100% of requirement-derived opaque-box E2E test suite published by test track | M5 | Survey |
| 63 | Adversarial Coverage Hardening (Tier 5)| White-box challenger hardening, edge-case validation, and final integration check | M5 | Survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Shared Foundations & Mobile UI Package | Features 1-13: UI kit extraction to `packages/mobile-ui`, `partner-app` scaffolding, phone OTP auth, role selection, KYC upload & demo approval, navigation branching | none | IN_PROGRESS |
| M2 | Medicine Vendor Operations | Features 14-31: Vendor dashboard, store open/closed, low-stock alerts, order simulator, order lifecycle (timer, checklist, handover OTP), prescription quote builder, catalogue CRUD | M1 | PLANNED |
| M3 | Nursing & Caretaker Services | Features 32-45: Caretaker dashboard, availability schedule & leave calendar, request simulator, booking lifecycle ("on my way", GPS check-in, shift timer, care checklist, family OTP), reviews | M1 | PLANNED |
| M4 | Earnings, Utilities, Unit Tests & Release APK | Features 46-61: Earnings tracking & charts, utility screens (profile, masked call, help), pure logic unit test suites (order/booking state machines, earnings, availability filter), release keystore, Gradle release guard, custom app icon, signed release APK build, apksigner & aapt2 verification | M2, M3 | PLANNED |
| M5 | Final E2E Suite Pass & Adversarial Hardening | Features 62-63: Pass 100% of E2E test suite (Tiers 1-4) and Tier 5 adversarial coverage hardening | M4, E2E Track | PLANNED |
| E2E | E2E Testing Track | Requirement-driven opaque-box test suite: test infrastructure, Tier 1 (feature coverage), Tier 2 (boundary/corner), Tier 3 (cross-feature), Tier 4 (real-world workflows), publish `TEST_READY.md` | none (parallel) | PLANNED |

## Interface Contracts
### `packages/mobile-ui` ↔ `partner-app`
- Exported Modules:
  - Theme: `colors`, `service`, `font`, `radius`, `shadow`, `typography`
  - Components: `T`, `Button`, `Card`, `AppBar`, `IconButton`, `Field`, `Chip`, `Badge`, `StatusBadge`, `Toggle`, `Divider`, `Gap`, `ListRow`, `Avatar`, `Timeline`, `EmptyState`
  - Brand: `LifelineMark`, `Wordmark`, `Fade`, `DuoIcon`, `ProductThumb`, `DesignedMap`
  - Interactive Widgets: `CountdownRing`, `SwipeToConfirm`, `BarChart`, `OnlineToggle`
  - Utils: `rupees(amount: number): string`, `greeting(): string`, `timeAgo(date: string | Date): string`, `maskPhone(phone: string): string`

### `PartnerStore` Contract
```typescript
export interface PartnerState {
  role: 'vendor' | 'caretaker' | null;
  isAuthenticated: boolean;
  phone: string;
  partnerInfo: PartnerProfile;
  kyc: KycState;
  // Vendor specific state
  vendor: {
    isOpen: boolean;
    orders: VendorOrder[];
    catalogue: MedicineItem[];
    activeRx: PrescriptionQuote | null;
  };
  // Caretaker specific state
  caretaker: {
    isOnline: boolean;
    availability: WeeklySchedule;
    leaveDates: string[];
    bookings: CaretakerBooking[];
    activeBooking: CaretakerBooking | null;
  };
  // Shared state
  earnings: EarningsSummary;
  transactions: TransactionItem[];
}
```

### Order State Machine Transitions (`orderStateMachine.ts`)
```typescript
export type OrderStatus = 'new' | 'accepted' | 'packing' | 'ready' | 'handed_over' | 'delivered' | 'rejected';
export function transitionOrder(current: OrderStatus, action: OrderAction): OrderStatus;
```

### Booking State Machine Transitions (`bookingStateMachine.ts`)
```typescript
export type BookingStatus = 'requested' | 'accepted' | 'on_the_way' | 'checked_in' | 'in_progress' | 'completed' | 'declined';
export function transitionBooking(current: BookingStatus, action: BookingAction): BookingStatus;
```

### Availability Filter Contract (`availabilityFilter.ts`)
```typescript
export function isCaretakerAvailable(
  schedule: WeeklySchedule,
  leaveDates: string[],
  requestedTime: Date,
  activeBooking: CaretakerBooking | null,
  isOnline: boolean
): boolean;
```

### Earnings Calculator Contract (`earningsCalculator.ts`)
```typescript
export function calculateNetEarnings(grossAmount: number, role: 'vendor' | 'caretaker'): {
  gross: number;
  commissionRate: number;
  commission: number;
  net: number;
};
```
