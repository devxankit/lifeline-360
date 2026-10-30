# Lifeline 360 Partner App — Comprehensive Functional Domain Specification

**Target App Package**: `com.lifeline360.partner`  
**Application Label**: `Lifeline Partner`  
**Working Directory**: `partner-app/`  
**Authoritative Sources**: `docs/PARTNER-APP-PLAN.md`, `docs/NATIVE-APP-PLAYBOOK.md`, `user-app/`, `driver-app/`, and `ORIGINAL_REQUEST.md`.

---

## 1. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | R1 Auth | Phone Login | Mobile number entry with country code prefix (+91) | 10-digit phone number string | Form validation, navigation to OTP screen | Validation error if length < 10 or non-numeric | `PARTNER-APP-PLAN.md` §4, `driver-app/src/screens/auth/PhoneLoginScreen.tsx` |
| 2 | R1 Auth | OTP Verification | 6-digit OTP verification screen with demo bypass | 6-digit OTP string | Authenticated session token, next screen routing | Error if < 6 digits; in demo mode any 6 digits succeed | `PARTNER-APP-PLAN.md` §4, `driver-app/src/screens/auth/OtpScreen.tsx` |
| 3 | R1 Auth | Role Selection | Branching between Medicine Vendor and Nurse/Caretaker | Single choice ('vendor' \| 'caretaker') | Persistent role assignment, navigation branch initialization | Mandatory selection before proceeding; immutable post-registration | `PARTNER-APP-PLAN.md` §2 Q2 & §4 screen 4 |
| 4 | R1 Auth | Vendor Profile Setup | Entry of pharmacy trade name, DL number, GSTIN, address, hours, pharmacist name | Pharmacy profile form fields | Updated vendor profile in store | Required field validation on submit | `PARTNER-APP-PLAN.md` §1 & §4 screen 5 |
| 5 | R1 Auth | Caretaker Profile Setup | Entry of caretaker full name, qualification (GNM/ANM/BSc), experience years, languages, bio | Caretaker profile form fields | Updated caretaker profile in store | Required field validation on submit | `PARTNER-APP-PLAN.md` §1 & §4 screen 5 |
| 6 | R1 KYC | Role-Specific KYC Document List | Displays list of required regulatory documents filtered by partner role | Selected role ('vendor' vs 'caretaker') | List of KYC document items with status badges | Blocks final submission until all mandatory items uploaded | `PARTNER-APP-PLAN.md` §1 & `driver-app/src/screens/kyc/DocumentListScreen.tsx` |
| 7 | R1 KYC | Document Upload Screen | Captures document photo, document serial number, and expiry date | Camera/gallery image, ID number string, expiry date | Document status updated to 'pending' | Rejects submission if photo or mandatory identifier missing | `PARTNER-APP-PLAN.md` §4 & `driver-app/src/screens/kyc/DocumentUploadScreen.tsx` |
| 8 | R1 KYC | Verification Pending & Demo Approval | Status screen showing pending review with instant demo activation mechanism | User view or "Activate Now" CTA | Status transitions from 'pending' to 'approved' after 6s timeout or CTA tap | None (auto-approves in demo mode) | `PARTNER-APP-PLAN.md` §5 & `driver-app/src/screens/kyc/KycPendingScreen.tsx` |
| 9 | R1 KYC | Welcome Approved Screen | Congratulations onboarding completion screen introducing role duties | Navigation from approved status | Resets root navigation to role-specific Tab navigator | None | `driver-app/src/screens/kyc/WelcomeApprovedScreen.tsx` |
| 10 | R1 Nav | Role-Based Navigation Routing | Mounts either VendorTabs or CaretakerTabs based on permanent role | `session.role` ('vendor' \| 'caretaker') | Root Tab Navigator (Orders/Catalogue/Earnings/Profile OR Today/Requests/Earnings/Profile) | Fails safe to role selection if role undefined | `PARTNER-APP-PLAN.md` §9 & `ORIGINAL_REQUEST.md` line 43 |
| 11 | R1 Shared | Earnings Summary Metrics | Displays period gross sales, platform commission, net earnings, completed jobs | Transactions list, completed orders/bookings | Currency formatted totals (₹), metrics cards | Handles 0 records gracefully | `PARTNER-APP-PLAN.md` §4 screen 25/40 & `driver-app/src/screens/earnings/EarningsScreen.tsx` |
| 12 | R1 Shared | Earnings Weekly Bar Chart | 7-day bar chart showing daily earnings with active day highlight | Daily earnings array | Scaled vector bar chart with labels and active day indicator | Renders zero-height bars when day amount is 0 | `driver-app/src/screens/earnings/EarningsScreen.tsx` & `PARTNER-APP-PLAN.md` §3 board 9 |
| 13 | R1 Shared | Transaction History | Chronological list of credits, payouts, and incentives with type icons | Filter/tab selection ('all' \| 'credits' \| 'payouts') | Formatted list rows with status, timestamp, and amount | Empty state when no transactions match filter | `PARTNER-APP-PLAN.md` §4 screen 26/40 |
| 14 | R1 Shared | Payouts & Settlement Simulation | Bank account management and simulated payout schedule | Bank account details (A/C, IFSC, Bank Name) | Payout schedule display, manual transfer simulation | Disables transfer if balance is 0 | `PARTNER-APP-PLAN.md` §2 Q6, §4 screen 26/40 |
| 15 | R1 Shared | Masked Call Modal | Privacy-preserving simulated call interface connecting partner to patient/rider | Target name, role ('Patient' \| 'Rider' \| 'Family') | Interactive in-call screen with timer and mute/speaker toggles | Safe fallback if no phone number provided | `PARTNER-APP-PLAN.md` §4 screen 11 & `driver-app/src/screens/profile/MaskedCallModal.tsx` |
| 16 | R1 Shared | Notifications Screen | Feed of system, order, and payout alerts with unread markers | Filter type ('all' \| 'unread') | List of notifications with timestamp, read toggle | Displays empty inbox illustration | `PARTNER-APP-PLAN.md` §4 screen 10 |
| 17 | R1 Shared | Profile Management Screen | Displays partner info, credentials, rating, badge, and navigation to sub-settings | Profile state | Profile header card, quick action list rows | None | `PARTNER-APP-PLAN.md` §4 screen 27/42 & `driver-app/src/screens/profile/ProfileScreen.tsx` |
| 18 | R1 Shared | Settings Screen | Toggles for sound alerts, auto-acceptance, notifications, app theme | Toggle booleans | Updated preference state in AsyncStorage | Persists immediately | `PARTNER-APP-PLAN.md` §4 screen 28/43 |
| 19 | R1 Shared | Help & Support / Legal | FAQ accordions, dispatch helpline dialer, terms of service, privacy policy | Accordion taps | Expandable answer cards, direct tel: dialer | Opens fallback support dialog | `PARTNER-APP-PLAN.md` §4 screen 12 |
| 20 | R2 Vendor | Store Status Toggle | Online/Offline switch on vendor dashboard controlling order reception | Toggle state (boolean: open/closed) | Vendor status badge, enables/disables order simulator | Closes simulator; prevents incoming alerts while closed | `PARTNER-APP-PLAN.md` §4 screen 13 & `ORIGINAL_REQUEST.md` line 46 |
| 21 | R2 Vendor | Today Summary Cards | Dashboard metric cards: Today's Sales, Orders Count, Pending, Low Stock | Orders list, catalogue stock counts | Numerical and monetary stat cards | Renders ₹0 and 0 counts on empty data | `PARTNER-APP-PLAN.md` §4 screen 13 |
| 22 | R2 Vendor | Low-Stock Alerts Banner | Prominent dashboard warning when catalogue items drop below threshold (< 10) | Catalogue item quantities | Warning banner with count of affected items and shortcut to catalogue | Hidden when all items have stock >= threshold | `PARTNER-APP-PLAN.md` §4 screen 13 & §5 |
| 23 | R2 Vendor | Simulated Order Alert Modal | Incoming order notification with audible alert, vibration, and countdown timer | Simulated order trigger from timer | Fullscreen/modal banner with 60s countdown, items preview, delivery area | Auto-declines order when countdown reaches 0 | `PARTNER-APP-PLAN.md` §5 & `ORIGINAL_REQUEST.md` line 47 |
| 24 | R2 Vendor | Order Acceptance & Rejection | Accept order to begin packing or reject with structured reason | Order ID, action ('accept' \| 'reject'), reason string | State transitions to 'packing' OR 'rejected' | Requires selection of rejection reason before submit | `PARTNER-APP-PLAN.md` §4 screens 16-17 |
| 25 | R2 Vendor | Packing Checklist Screen | Item-by-item verification checklist for pharmacy staff during fulfillment | Checkbox taps per medicine line | Item checkmark toggles; enables "Mark Packed" CTA once all verified | Disables final "Ready for Pickup" button until all items ticked | `PARTNER-APP-PLAN.md` §4 screen 19 & §5 |
| 26 | R2 Vendor | Item Substitution Flow | Marks out-of-stock item and suggests alternative from catalogue | Item ID, replacement medicine ID | Order item updated with substitute tag and price differential | Alerts user if substitute price exceeds original MRP | `PARTNER-APP-PLAN.md` §4 screen 19 |
| 27 | R2 Vendor | Rider Handover Screen | Shows assigned Lifeline delivery rider details and ETA | Order state 'ready' | Rider name, photo, phone, vehicle plate, OTP input field | Displays rider card ("Ravi Kumar") | `PARTNER-APP-PLAN.md` §4 screen 20 & `user-app/src/screens/medicine.tsx` |
| 28 | R2 Vendor | Handover OTP Verification | Verifies 4-digit handover code provided by rider before releasing medicines | 4-digit numeric OTP | Order state transitions to 'handed_over' -> 'completed', decrements stock | Rejects invalid OTP with shake animation and error text | `PARTNER-APP-PLAN.md` §1 & `ORIGINAL_REQUEST.md` line 47 |
| 29 | R2 Vendor | Prescription Image Viewer | High-resolution viewer with pinch-to-zoom, pan, and rotate for doctor prescriptions | Rx image URI | Interactive canvas with zoom controls | Shows placeholder if image fails to load | `PARTNER-APP-PLAN.md` §6 & §13 |
| 30 | R2 Vendor | Medicine Quote Builder | Assembles prescribed medicines into itemized quote lines with pricing | Medicine search selection, pack quantity, unit price | Itemized quote list with subtotal, taxes, delivery fee, grand total | Disallows quote submission with 0 items | `PARTNER-APP-PLAN.md` §4 screen 18 & §5 |
| 31 | R2 Vendor | Simulated Quote Acceptance | Simulates patient reviewing and accepting vendor's quote | Tap "Send Quote to Patient" | Order transitions to 'quote_sent'; auto-transitions to 'quote_confirmed' after 6s | Reverts to draft if cancelled | `PARTNER-APP-PLAN.md` §5 & `ORIGINAL_REQUEST.md` line 48 |
| 32 | R2 Vendor | Catalogue List & Search | Searchable, filterable catalogue of all stocked medicines | Search query string, category filter tab | Filtered list of medicine cards with stock, price, Rx badge | Displays "No medicines found" empty state | `PARTNER-APP-PLAN.md` §4 screen 22 |
| 33 | R2 Vendor | Add / Edit Medicine Form | Form to create or update medicines in the pharmacy catalogue | Name, maker, category, pack, MRP, price, stock, Rx required | Upserted medicine in store catalogue | Form validation on required fields and price <= MRP | `PARTNER-APP-PLAN.md` §4 screen 23 |
| 34 | R2 Vendor | Stock Availability Toggle | Immediate single-tap switch to mark an item In Stock or Out of Stock | Item ID, boolean inStock | Updates medicine `inStock` property in real-time | Out of stock items greyed out in search | `PARTNER-APP-PLAN.md` §1 & §4 screen 22 |
| 35 | R2 Vendor | Category Management | View, reorder, create, or hide medicine categories | Category name, icon/color tag, visibility toggle | Updated category list | Prevents deletion of categories containing active items | `PARTNER-APP-PLAN.md` §4 screen 24 |
| 36 | R3 Caretaker | Today Dashboard | Caretaker command center with availability switch, next booking, shift stats | Store state, active bookings | Active shift card, upcoming booking countdown, today earnings | Shows rest state when offline with no bookings | `PARTNER-APP-PLAN.md` §4 screen 29 |
| 37 | R3 Caretaker | Weekly Shift Schedule Manager | Interactive matrix of 7 days x time slots to set regular working availability | Day selection, slot toggles (Morning, Evening, 12h Day, Night, 24h) | Saved weekly availability schedule | Requires at least 1 active slot per week | `PARTNER-APP-PLAN.md` §4 screen 38 & §5 |
| 38 | R3 Caretaker | Leave Calendar Manager | Date picker to select upcoming leave dates / vacation days | Date selection | Array of marked leave date strings (YYYY-MM-DD) | Disallows setting leave on dates with confirmed bookings | `PARTNER-APP-PLAN.md` §4 screen 38 & §5 |
| 39 | R3 Caretaker | Booking Request Simulator | Simulates incoming home care booking requests respecting availability schedule | Timer interval, caretaker schedule, leave calendar | Incoming booking modal if slot is available and caretaker is online | Suppresses request if offline, on leave, or already booked | `PARTNER-APP-PLAN.md` §5 & `ORIGINAL_REQUEST.md` line 52 |
| 40 | R3 Caretaker | Booking Request Alert Modal | Fullscreen incoming booking alert with timer, patient condition, schedule, payout | Simulated request payload | 60s countdown timer, Accept and Decline buttons | Auto-declines on timeout expiry | `PARTNER-APP-PLAN.md` §4 screens 30-31 |
| 41 | R3 Caretaker | Booking Rejection Reason Sheet | Modal to decline booking with predefined rationale | Reason code ('distance' \| 'conflict' \| 'skill' \| 'emergency' \| 'other') | Booking removed from queue, logged in decline history | Requires reason selection before dismiss | `PARTNER-APP-PLAN.md` §4 screen 32 |
| 42 | R3 Caretaker | Upcoming Bookings List | Tab/screen displaying accepted upcoming care visits grouped by date | Bookings store state | List cards showing patient, service, date, time, address | Displays empty schedule illustration if none | `PARTNER-APP-PLAN.md` §4 screen 33 |
| 43 | R3 Caretaker | Booking Detail Screen | Comprehensive patient profile, medical condition, care notes, family contact | Booking ID | Patient age/gender, condition notes, address, directions CTA | Masked phone button for family contact | `PARTNER-APP-PLAN.md` §4 screen 34 |
| 44 | R3 Caretaker | "On My Way" Stage Transition | Caretaker marks transit departure to patient home; reveals address navigation | Action tap "Start Travel / On My Way" | Booking state transitions to 'on_the_way'; enables directions button | None | `PARTNER-APP-PLAN.md` §4 screen 35 & §5 |
| 45 | R3 Caretaker | GPS Check-in at Patient Address | Verifies caretaker physical arrival at patient home via geofence / demo check-in | GPS coordinates or demo check-in tap | Distance calculation (<= 100m required), transitions to 'checked_in' | Warns if caretaker is > 100m from address (bypass in demo) | `PARTNER-APP-PLAN.md` §4 screen 35, §6, §13 |
| 46 | R3 Caretaker | Active Shift Timer & Wake Lock | Real-time circular progress timer showing elapsed/remaining shift duration | Booking start time and package duration | Running clock, percentage progress ring, keeps screen awake | Continues running in background if app minimized | `PARTNER-APP-PLAN.md` §4 screen 36 & §6 |
| 47 | R3 Caretaker | Clinical Care Checklist | Service-specific care tasks (vitals measurement, medicines, meals, mobility) | Task checkbox taps, vitals numeric values (BP, sugar, pulse) | Recorded care actions with timestamp and caregiver notes | Validates blood pressure format (e.g. 120/80) | `PARTNER-APP-PLAN.md` §4 screen 36 |
| 48 | R3 Caretaker | Service Completion Flow | Wrap-up screen requiring care summary text and family OTP verification | Care summary notes string, 4-digit family OTP | Booking state transitions to 'completed', credits caretaker earnings | Rejects invalid family OTP | `PARTNER-APP-PLAN.md` §4 screen 37 & §5 |
| 49 | R3 Caretaker | Services & Rates Configuration | Allows caretaker to configure which care categories they offer and custom rates | Service toggles (Elderly, Post-Surgery, Nurse Visit, Baby Care, Physio) | Updated service catalog and baseline shift rates | Disallows disabling all services | `PARTNER-APP-PLAN.md` §4 screen 39 |
| 50 | R3 Caretaker | Ratings & Reviews Screen | Comprehensive caregiver scorecard with average rating, star distribution, reviews | Caretaker reviews data in store | 4.9 average badge, breakdown bars, list of family testimonials | Empty state if new partner with zero reviews | `PARTNER-APP-PLAN.md` §4 screen 41 |

---

## 2. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Phone Auth | Phone number with spaces, hyphens, or leading 0 (` 098-765-43210 `) | Strips non-digit characters; normalizes to 10-digit number `9876543210`; strips leading `+91` or `0` before validation. |
| 2 | Phone Auth | Less than 10 digits entered (`98765`) | Disables "Get OTP" button or displays inline validation error: "Please enter a valid 10-digit mobile number". |
| 3 | OTP Auth | Entering invalid characters in OTP input (letters, symbols) | `keyboardType="number-pad"` restricts input; non-numeric keystrokes discarded. |
| 4 | OTP Auth | OTP timer expires without user input | "Resend OTP" button becomes enabled; previous OTP remains valid in demo mode. |
| 5 | Role Selection | Attempting to switch roles after signup | Application prohibits role switching; role is permanently stored in `session.role`. If user needs another role, they must log out and register with a different account. |
| 6 | KYC Upload | Missing mandatory document when tapping "Submit for verification" | Button disabled with label: "Upload X more documents" showing remaining count. |
| 7 | KYC Upload | Document file size > 5MB | Error banner: "File exceeds 5MB limit. Please take a new photo or select a smaller image." |
| 8 | KYC Approval | App backgrounded during 6-second pending approval timer | Timer completes or state hydrates to 'approved' upon foreground resume; user lands directly on `WelcomeApproved`. |
| 9 | Vendor Orders | Order incoming while vendor is currently in the middle of packing another order | Banner notification appears at top of screen without dismissing current packing screen; audio chime sounds; order added to New Orders queue. |
| 10 | Vendor Orders | Order acceptance countdown timer expires (reaches 0s) | Modal auto-dismisses; order status moves to `rejected` with reason "Acceptance timeout expired"; simulator re-queues order to next partner. |
| 11 | Vendor Orders | Vendor attempts to mark order as "Packed" with unverified items | "Mark Packed" CTA remains disabled or alerts: "Please verify all items in the packing checklist before handover." |
| 12 | Vendor Orders | Vendor enters incorrect rider handover OTP (`0000` vs expected `4829`) | Rejection message: "Invalid handover code. Please ask rider Ravi Kumar for the 4-digit verification code." State remains `ready`. |
| 13 | Vendor Catalogue | Toggling in-stock switch for an item currently in an active customer order | The catalogue reflects Out of Stock for future searches; the active order fulfillment checklist is unaffected. |
| 14 | Vendor Catalogue | Stock deduction drives catalogue quantity below 10 (e.g. from 12 to 8) | Item immediately flagged with `isLowStock: true`; Dashboard displays orange Low Stock warning banner with updated count. |
| 15 | Vendor Catalogue | Selling price set higher than MRP in Add/Edit Medicine form | Form validation prevents submission: "Selling price cannot exceed Maximum Retail Price (MRP)." |
| 16 | Prescription Quote | Vendor adds 0 medicine lines and taps "Send Quote" | "Send Quote" button disabled; validation warning: "Add at least one medicine item to assemble quote." |
| 17 | Prescription Quote | User rejects simulated quote (or quote expired) | Order moves to `cancelled`; quote lines archived; no inventory decremented. |
| 18 | Caretaker Requests | Request simulator triggers while caretaker is marked "Offline" on Today screen | Simulator execution skipped completely; no alert generated. |
| 19 | Caretaker Requests | Request simulator triggers on a date/day marked in Leave Calendar | Simulator detects date match against `leaveDates`; request generation aborted. |
| 20 | Caretaker Requests | Request simulator triggers for a time slot disabled in Weekly Schedule | Simulator filters slots against `schedule[dayOfWeek]`; request generation aborted. |
| 21 | Caretaker Requests | Request simulator triggers while caretaker has an active booking in `in_progress` | Request is suppressed; caretaker cannot hold multiple concurrent active shifts. |
| 22 | Caretaker Check-in | Caretaker taps GPS Check-in when physical distance is > 100 meters | Modal warning: "You are X meters from patient location. Check-in requires being at the patient's premises." Provides "Demo Override Check-in" option for demo testing. |
| 23 | Caretaker Complete | Caretaker enters incorrect family completion OTP (`1111` vs expected `7193`) | Verification error: "Incorrect family OTP. Please verify the 4-digit code provided by the family." State remains `in_progress`. |
| 24 | Caretaker Complete | Shift timer duration not fully elapsed when caretaker completes | Prompts warning: "Shift scheduled for 12 hours. Only X hours elapsed. Are you sure you want to complete early?", requiring care summary justification before family OTP entry. |
| 25 | Earnings | Zero transactions exist for today | Earnings card displays `₹0`; weekly chart displays 0 for today without breaking layout or division by zero. |

---

## 3. Detailed Functional Domain Specifications

### R1: Shared Foundation & Auth Workflows

#### 1. Authentication & Session Flow
- **Splash Screen**:
  - Checks `AsyncStorage` key `@lifeline360_partner_session`.
  - If not logged in -> navigate to `PhoneLogin`.
  - If logged in but `role` is null -> navigate to `RoleSelection`.
  - If logged in but `kycStatus !== 'approved'` -> navigate to `KycPending`.
  - If logged in and approved:
    - If `role === 'vendor'` -> reset to `VendorTabs`.
    - If `role === 'caretaker'` -> reset to `CaretakerTabs`.
- **Phone Login Screen**:
  - Country code fixed to `+91` with flag / divider.
  - 10-digit mobile number input with `keyboardType="phone-pad"`.
  - Pre-filled demo accounts:
    - Vendor Demo: `9876543210` (Sri Sai Medicals)
    - Caretaker Demo: `9845011223` (Sunita Rao, GNM)
  - Pressing "Get OTP" generates simulated 6-digit OTP and navigates to `OtpScreen`.
- **OTP Screen**:
  - Displays target masked phone: `+91 98••• ••210`.
  - 6 individual digit cells or a 6-digit formatted numeric text input.
  - Demo mode notice: "Demo build: any 6-digit code is accepted."
  - Auto-submits on 6th digit or button press.
- **Role Selection Screen**:
  - Header: "Choose Your Partner Role".
  - Subtitle: "Select your service specialty. This determines your workspace and cannot be changed later."
  - Two prominent role selection cards:
    1. **Medicine Vendor (Pharmacy)**:
       - Icon: Pill / Storefront in Mint badge (`#1A8A57` / `#E2F5EA`).
       - Title: "Medicine Vendor".
       - Description: "For retail pharmacies, chemists, and medical stores. Receive orders, review prescriptions, and dispatch via Lifeline riders."
    2. **Nurse or Caretaker**:
       - Icon: HeartPulse / UserCheck in Lavender badge (`#6F5BC9` / `#ECE9FB`).
       - Title: "Nurse or Caretaker".
       - Description: "For registered nurses, certified caregivers, and physiotherapists. Manage availability, accept patient shifts, and deliver home care."
  - Selection is single-choice, highlighted with 2px border in service color.
  - "Continue" button saves `session.role = 'vendor' | 'caretaker'`.

#### 2. Role-Specific Profile & KYC Document Upload
- **Vendor KYC Documents**:
  1. `dl`: Drug Licence (Form 20 / Form 21) — Expiry date required.
  2. `gst`: GSTIN Registration Certificate.
  3. `pharmacist`: Registered Pharmacist Certificate (State Pharmacy Council).
  4. `shop_photo`: Pharmacy Storefront & Signboard Photo.
  5. `id_proof`: Proprietor / Pharmacist Aadhaar or PAN Card.
- **Caretaker KYC Documents**:
  1. `nursing_cert`: Nursing Council Registration (GNM / ANM / BSc Nursing) or Caregiver Certificate.
  2. `id_proof`: Government Photo ID (Aadhaar / Voter ID / Passport).
  3. `police_clearance`: Police Verification / Character Clearance Certificate.
  4. `photo`: Professional Healthcare Portrait Photo.
- **Document Status State**:
  - Each document has status: `'missing' | 'pending' | 'approved' | 'rejected'`.
  - Tapping document opens `DocumentUploadScreen` with camera/gallery picker simulation.
  - Once all documents are uploaded (status `pending`), "Submit for Verification" CTA unlocks.
- **Verification Pending Screen**:
  - Amber clock illustration: "Verification in Progress".
  - Explanatory copy: "Our onboarding team is reviewing your regulatory credentials."
  - Demo auto-approval: `setTimeout` for 6 seconds automatically sets `kycStatus = 'approved'` and navigates to `WelcomeApprovedScreen`.
  - Secondary instant CTA: "Demo Mode: Activate Account Now" for immediate evaluation.
- **Welcome Approved Screen**:
  - Green checkmark celebration.
  - Role-tailored welcoming guidelines:
    - Vendor: "Your pharmacy is verified. Keep your store open to receive orders."
    - Caretaker: "Your nursing credentials are confirmed. Set your shift availability to start receiving bookings."
  - Primary button: "Enter Partner Console" -> resets root to `VendorTabs` or `CaretakerTabs`.

#### 3. Shared Utilities & Navigation
- **Navigation Layout**:
  - Vendor Root Tabs:
    1. `Orders` (Mint accent `#1A8A57`)
    2. `Catalogue`
    3. `Earnings`
    4. `Profile`
  - Caretaker Root Tabs:
    1. `Today` (Lavender accent `#6F5BC9`)
    2. `Requests`
    3. `Earnings`
    4. `Profile`
- **Shared Modals & Screens**:
  - `MaskedCall`: Simulated full-screen calling interface with dial tone, elapsed timer, mute, speaker, end call.
  - `Notifications`: System alerts, order updates, payout confirmations.
  - `Profile`: Partner details, verification badge, rating, logout CTA.
  - `Settings`: Push alert sounds, auto-accept toggle, dark night mode toggle, language.
  - `HelpSupport`: 24/7 hotline 1800-360-911, WhatsApp support, FAQ accordions.

---

### R2: Medicine Vendor Module

#### 1. Vendor Dashboard
- **Header & Store Status**:
  - Pharmacy trade name: "Sri Sai Medicals" (aligning with `user-app` order metadata `LL-M-20417`).
  - Pharmacist name: "Ramesh Sharma, B.Pharm · Reg #KA-29410".
  - Store Status Toggle: "Store Open" (Green) vs "Store Closed" (Grey).
  - Toggling closed prevents order simulator from triggering and displays prominent offline banner.
- **Summary Metrics (Today)**:
  - Today's Sales: `₹4,850` (or dynamic calculation).
  - Orders Completed: `6`.
  - In Progress / Packing: `2`.
  - Low Stock Alerts: `3 items`.
- **Low Stock Banner**:
  - If any item in catalogue has `stock < 10`, displays amber warning tile: "3 medicines low in stock. Tap to reorder or update catalogue."

#### 2. Order Lifecycle Management
- **Order ID Scheme**: `LL-M-xxxxx` (e.g., `LL-M-48921`), strictly consistent with User App medicine bookings.
- **Order State Machine**:
  ```text
  [NEW (Simulated Alert)]
        │
        ├──> [REJECTED] (With reason)
        │
        ▼
   [ACCEPTED]
        │
        ▼
    [PACKING] (Checklist: tick items, handle substitutes)
        │
        ▼
     [READY] (Rider assigned: Ravi Kumar)
        │
        ▼ (Rider arrives & provides Handover OTP)
  [HANDED_OVER]
        │
        ▼
   [COMPLETED] (Stock decremented, earnings credited)
  ```
- **Simulated Incoming Order**:
  - Modal banner with repeating audible alert and vibration.
  - 60-second countdown timer ring.
  - Order details: customer area ("Indiranagar 12th Main, 1.8 km"), item count (e.g., 3 items), order value (`₹642`).
  - Actions: "Accept Order" or "Decline".
- **Packing Checklist**:
  - Screen lists all prescribed items with dosage, packaging, quantity, and unit price:
    - Item 1: Dolo 650 Tablet (Strip of 15) x 1
    - Item 2: Telma 40 Tablet (Strip of 30) x 2
    - Item 3: Becosules Capsule (Strip of 20) x 1
  - Checkbox per row. Staff ticks each box as item is pulled from shelf.
  - "Out of Stock" button per row: allows offering substitute or adjusting quantity.
  - Once all checked, "Mark Packed & Request Rider" transitions order to `ready`.
- **Rider Handover & OTP Verification**:
  - Displays assigned Lifeline delivery partner: "Ravi Kumar" (KA 03 EZ 9142), matching `user-app/src/screens/medicine.tsx`.
  - Rider status: "Arrived at pharmacy".
  - Handover verification: 4-digit OTP input field.
  - Preset test OTP: `4829` (or random 4-digit code generated per order).
  - Correct OTP submission triggers:
    1. Order status changes to `handed_over` then `completed`.
    2. Order items are decremented from catalogue stock in store.
    3. Sale credit transaction added to earnings.

#### 3. Prescription Review & Quote Builder
- **Prescription Order Flow**:
  - When an order has `isPrescriptionOrder: true` and no predefined items, it enters `rx_review` state.
  - Prescribed image view: shows uploaded doctor prescription (sample Rx photo).
  - High-resolution pinch-to-zoom / pan to inspect handwriting, doctor signature, and date.
- **Quote Builder Interface**:
  - Search catalogue to add items:
    - Type-ahead search filtering by name or category.
    - Select medicine -> specifies quantity (stepper: 1, 2, 3...).
    - Price defaults to selling price from catalogue.
  - Added lines display in table:
    - `[Item Name] [Pack] [Qty] [Unit Price] [Line Total] [Delete]`
  - Real-time calculation:
    - Subtotal
    - Delivery fee (`₹40`, free above ₹500)
    - Taxes (GST @ 12% on applicable items)
    - Total Quote Amount
  - Action: "Send Quote to Patient" -> order status changes to `quote_sent`.
  - Demo auto-acceptance: after 6 seconds, simulated user accepts quote (`quote_confirmed`).
  - Order automatically transitions to `packing` checklist with the quoted items!

#### 4. Catalogue Management
- **Categories**:
  - Fever & pain (`fever`), Diabetes (`diabetes`), Heart care (`heart`), Vitamins (`vitamins`), Digestion (`digestion`), Skin care (`skin`), Baby care (`baby`), Devices (`devices`).
- **Catalogue List**:
  - Search bar across medicine name and manufacturer.
  - Horizontal category scroll chips.
  - Medicine cards showing: Name, Pack size, Manufacturer, Price, MRP, Stock level, Rx badge, and In-Stock toggle switch.
- **Add / Edit Medicine**:
  - Fields: Name, Manufacturer, Category dropdown, Pack size description, MRP (₹), Selling Price (₹), Current Stock Quantity, Rx Required (toggle), In Stock (toggle).
  - Validation: Selling price cannot exceed MRP; stock must be non-negative integer.
- **Live Stock Management**:
  - Toggling switch immediately marks item out of stock.
  - Packing orders decrements quantity.
  - Items with `stock < 10` display orange "Low Stock (X remaining)" badge.

---

### R3: Nursing & Caretaker Module

#### 1. Availability Management
- **Master Duty Switch**:
  - "Available for Bookings" (Lavender / Teal toggle).
  - When off, caretaker is off-duty; booking simulator will not trigger.
- **Weekly Shift Schedule Matrix**:
  - Days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
  - Configurable standard slots per day:
    - Morning: `8:00 AM – 2:00 PM` (6 hours)
    - Day Shift: `8:00 AM – 8:00 PM` (12 hours)
    - Evening: `2:00 PM – 8:00 PM` (6 hours)
    - Night Shift: `8:00 PM – 8:00 AM` (12 hours)
    - 24-Hour Live-in
  - Caretaker can toggle individual slots on or off per day.
- **Leave Calendar**:
  - Calendar picker where caretaker can mark vacation / sick days.
  - Displays list of booked leave dates (e.g. `2026-11-04`, `2026-11-05`).
  - Active leave dates completely suppress booking alerts for those days.

#### 2. Booking Request Simulator
- **Eligibility Check**:
  - Pure rule: Simulator generates request ONLY if:
    1. Caretaker is Online (`isOnline === true`).
    2. Caretaker has NO active booking (`activeBooking === null` or stage is `IDLE`).
    3. Target booking date is NOT in `leaveDates`.
    4. Target booking time falls within an enabled slot for that day of the week.
- **Incoming Request Card / Modal**:
  - Booking ID: `LL-N-xxxxx` (e.g., `LL-N-07731`, matching `user-app`'s nursing booking seed).
  - Patient Name: e.g. "K. Raghavan" (Age 68, Male).
  - Service: e.g. "Elderly Care · 12-Hour Day Shift".
  - Caretaker payout: e.g. `₹1,020` (from total `₹1,200` fee).
  - Schedule: "Today, 8:00 AM – 8:00 PM".
  - Location: "Indiranagar 12th Main (2.1 km away)".
  - Family Contact: "Vikram Rao (Spouse/Son)".
  - Care Notes: "Post-knee surgery mobility assistance, daily BP check, medicine reminders."
  - 60-second acceptance countdown timer.
  - Actions: "Accept Booking" or "Decline" (with reason sheet).

#### 3. Active Booking Lifecycle State Machine
```text
[REQUESTED]
     │
     ├──> [REJECTED] (With reason)
     │
     ▼
[ACCEPTED] (Appears in Today / Upcoming)
     │
     ▼
[ON_THE_WAY] (Caretaker travels to patient home; directions active)
     │
     ▼
[CHECKED_IN] (GPS geofence verification <= 100m)
     │
     ▼
[IN_PROGRESS] (Shift timer running; care tasks checklist active)
     │
     ▼ (Shift ends, care summary recorded, family provides completion OTP)
[COMPLETED] (Family OTP verified, earnings credited, rating generated)
```

- **Stage 1: "On My Way"**:
  - Caretaker taps "Start Travel".
  - Shows address, navigation shortcut, and masked call button to family.
- **Stage 2: GPS Check-in**:
  - Caretaker arrives at patient residence.
  - Taps "GPS Check-in".
  - App checks distance against patient coordinates:
    - Distance <= 100m -> Verified!
    - Demo override: "Demo: Verify Check-in" allows instant bypass.
  - Transitions to `checked_in`.
- **Stage 3: In Progress & Shift Timer**:
  - Shift timer starts ticking down (or counting elapsed time).
  - Circular progress ring showing time completed vs total shift hours.
  - Prevents screen lock using wake lock if available.
  - **Clinical Care Checklist**:
    1. Vitals measurement: Blood Pressure (Systolic/Diastolic), Pulse rate, SpO2, Temperature.
    2. Medication log: Morning / Afternoon / Evening medicine administration.
    3. Hygiene & Comfort: Assisted bath / sponge, dressing, bed linen change.
    4. Nutrition & Hydration: Breakfast, lunch, fluid intake log.
    5. Mobility & Exercise: 20-min assisted walking, passive joint movement.
    6. Caregiver observation notes (multiline text).
- **Stage 4: Service Completion & Family OTP**:
  - Caretaker completes shift summary report.
  - Prompts for 4-digit Family Completion OTP.
  - The family receives OTP via SMS/User app (e.g. `7193`).
  - Caretaker inputs OTP -> Verified.
  - Booking marks `completed`.
  - Payout share (e.g. 85% of booking fee) credited to partner wallet and transaction log.
  - Demo mode schedules a simulated 5-star patient family review to arrive after 10 seconds.

#### 4. Ratings and Reviews Module
- **Profile Scorecard**:
  - Overall Rating: `4.9` / `5.0`.
  - Total Reviews: `156`.
  - Star Breakdown:
    - 5 Stars: 92%
    - 4 Stars: 6%
    - 3 Stars: 2%
    - 2 Stars: 0%
    - 1 Star: 0%
- **Reviews Feed**:
  - Sample Review 1: "Sunita Rao was exceptional with my father after his discharge. Very punctual, skilled with vitals and medication, and treated him with great warmth." — *Vikram Rao · 28 Oct 2026* (5 stars)
  - Sample Review 2: "Reliable and gentle caretaker. Followed the doctor's physiotherapy routine accurately." — *Priya Sharma · 14 Oct 2026* (5 stars)

---

## 4. Testable Business Logic & State Machines for Unit Testing

The partner app contains critical pure business logic, calculations, and state machines that must be isolated and verified via Jest automated unit tests (`npx jest`).

### 1. Vendor Order State Machine (`orderStateMachine.ts`)
- **Types**:
  ```typescript
  export type OrderState =
    | 'new'
    | 'accepted'
    | 'rx_review'
    | 'quote_sent'
    | 'quote_confirmed'
    | 'packing'
    | 'ready'
    | 'handed_over'
    | 'delivered'
    | 'rejected'
    | 'cancelled';

  export type OrderAction =
    | 'ACCEPT'
    | 'REJECT'
    | 'START_RX_REVIEW'
    | 'SEND_QUOTE'
    | 'CONFIRM_QUOTE'
    | 'START_PACKING'
    | 'MARK_PACKED'
    | 'VERIFY_HANDOVER_OTP'
    | 'DELIVER'
    | 'CANCEL';
  ```
- **State Transition Function**:
  `export function transitionOrder(currentState: OrderState, action: OrderAction, payload?: any): { nextState: OrderState; error?: string }`
  - Valid transitions:
    - `new + ACCEPT -> packing` (for standard order)
    - `new + START_RX_REVIEW -> rx_review` (for prescription order)
    - `new + REJECT -> rejected`
    - `rx_review + SEND_QUOTE -> quote_sent`
    - `quote_sent + CONFIRM_QUOTE -> quote_confirmed`
    - `quote_confirmed + START_PACKING -> packing`
    - `packing + MARK_PACKED -> ready`
    - `ready + VERIFY_HANDOVER_OTP -> handed_over` (requires `payload.otp === order.handoverOtp`)
    - `handed_over + DELIVER -> delivered`
  - Any unauthorized transition returns `{ nextState: currentState, error: 'Invalid transition' }`.
- **OTP Verification Helper**:
  `export function verifyHandoverOtp(inputOtp: string, expectedOtp: string): boolean`
  - Must strip whitespace, verify exactly 4 digits, compare strictly.

### 2. Caretaker Booking State Machine (`bookingStateMachine.ts`)
- **Types**:
  ```typescript
  export type BookingState =
    | 'requested'
    | 'accepted'
    | 'on_the_way'
    | 'checked_in'
    | 'in_progress'
    | 'completed'
    | 'rejected'
    | 'cancelled';

  export type BookingAction =
    | 'ACCEPT'
    | 'REJECT'
    | 'START_TRAVEL'
    | 'GPS_CHECK_IN'
    | 'START_SHIFT'
    | 'COMPLETE_SERVICE'
    | 'CANCEL';
  ```
- **State Transition Function**:
  `export function transitionBooking(currentState: BookingState, action: BookingAction, payload?: any): { nextState: BookingState; error?: string }`
  - Valid transitions:
    - `requested + ACCEPT -> accepted`
    - `requested + REJECT -> rejected`
    - `accepted + START_TRAVEL -> on_the_way`
    - `on_the_way + GPS_CHECK_IN -> checked_in` (validates `isWithinDistance(patientLocation, caregiverLocation, 100)`)
    - `checked_in + START_SHIFT -> in_progress`
    - `in_progress + COMPLETE_SERVICE -> completed` (validates `payload.otp === booking.completionOtp`)
- **GPS Distance Calculation (Haversine Formula)**:
  `export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number`
  `export function isWithinCheckInRadius(patient: { lat: number; lng: number }, caretaker: { lat: number; lng: number }, maxMeters: number = 100): boolean`
- **Family Completion OTP Verification**:
  `export function verifyFamilyCompletionOtp(inputOtp: string, expectedOtp: string): boolean`

### 3. Earnings & Commission Calculations (`earningsCalculator.ts`)
- **Formulas**:
  - **Vendor Share**:
    Platform takes 10% commission on medicine orders; vendor retains 90%.
    ```typescript
    export const VENDOR_COMMISSION_RATE = 0.10;
    export function calculateVendorShare(orderTotal: number, commissionRate = VENDOR_COMMISSION_RATE): { gross: number; commission: number; net: number } {
      const gross = Math.max(0, Math.round(orderTotal));
      const commission = Math.round(gross * commissionRate);
      const net = gross - commission;
      return { gross, commission, net };
    }
    ```
  - **Caretaker Share**:
    Platform takes 15% commission on nursing/care shifts; caregiver retains 85%.
    ```typescript
    export const CARETAKER_COMMISSION_RATE = 0.15;
    export function calculateCaretakerShare(bookingTotal: number, commissionRate = CARETAKER_COMMISSION_RATE): { gross: number; commission: number; net: number } {
      const gross = Math.max(0, Math.round(bookingTotal));
      const commission = Math.round(gross * commissionRate);
      const net = gross - commission;
      return { gross, commission, net };
    }
    ```
  - **Daily Aggregator**:
    `export function aggregateTodayStats(records: Array<{ amount: number; net: number; date: string }>, todayDateStr: string)`
    Calculates total gross sales, net earnings, and count of jobs.
  - **Weekly Chart Aggregator**:
    `export function generateWeeklyChartData(transactions: Array<{ amount: number; timestamp: number }>, referenceDate: Date = new Date())`
    Returns array of 7 items `[{ label: 'Mon', amount: number, active: boolean }, ...]`.

### 4. Simulator Availability Filtering (`availabilityFilter.ts`)
- **Data Structures**:
  ```typescript
  export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

  export interface WeeklySchedule {
    [day: string]: {
      enabled: boolean;
      slots: string[]; // e.g. ['08:00', '14:00', '20:00']
    };
  }
  ```
- **Filter Functions**:
  - `export function isDateOnLeave(leaveDates: string[], targetDateString: string): boolean`
  - `export function isTimeSlotActive(schedule: WeeklySchedule, targetDate: Date, timeSlotString: string): boolean`
  - `export function canReceiveBookingRequest(params: { isOnline: boolean; hasActiveBooking: boolean; schedule: WeeklySchedule; leaveDates: string[]; requestDate: Date; requestSlot: string }): boolean`
    - Evaluates to `true` ONLY when:
      1. `isOnline === true`
      2. `hasActiveBooking === false`
      3. `!isDateOnLeave(leaveDates, requestDateStr)`
      4. `isTimeSlotActive(schedule, requestDate, requestSlot)`
    - If any condition is violated, returns `false`.

### 5. Catalogue Stock Management (`catalogueStock.ts`)
- **Functions**:
  - `export function deductStockForOrder(catalogue: MedicineItem[], orderItems: Array<{ id: string; quantity: number }>): { updatedCatalogue: MedicineItem[]; lowStockAlerts: MedicineItem[] }`
    - Pure immutable reduction of inventory.
    - If resulting stock drops below threshold (`10`), flags item in `lowStockAlerts`.
    - Throws or returns error if order quantity exceeds current stock.
  - `export function toggleMedicineStock(catalogue: MedicineItem[], medicineId: string): MedicineItem[]`
    - Flips `inStock` boolean immutably.
  - `export function getLowStockItems(catalogue: MedicineItem[], threshold = 10): MedicineItem[]`

### 6. Prescription Quote Calculation (`quoteBuilder.ts`)
- **Formula**:
  ```typescript
  export interface QuoteLine {
    medicineId: string;
    medicineName: string;
    quantity: number;
    unitPrice: number;
    mrp: number;
  }

  export function calculateQuote(lines: QuoteLine[], deliveryFeeThreshold = 500, defaultDeliveryFee = 40, gstRate = 0.12): {
    subtotal: number;
    discount: number;
    gst: number;
    deliveryFee: number;
    total: number;
  }
  ```
  - Calculates line totals, savings against MRP, conditional free delivery, and tax rounding.

---

## 5. Mock Data & Model Specifications

To ensure exact interoperability across the Lifeline 360 ecosystem (User App, Driver App, Partner App), data schemas align directly with `user-app/src/data/catalog.ts` and `user-app/src/store/AppStore.tsx`:

### 1. Medicine Catalogue Mock Data (Vendor)
Seeded from `user-app/src/data/catalog.ts`:
- `m1`: Dolo 650 Tablet (Micro Labs) · Strip of 15 tablets · MRP ₹34 · Price ₹31 · Rx: false · Category: fever · Stock: 45 · inStock: true
- `m2`: Crocin Advance (GSK) · Strip of 20 tablets · MRP ₹46 · Price ₹42 · Rx: false · Category: fever · Stock: 8 (Low Stock!) · inStock: true
- `m3`: Volini Pain Relief Gel (Sun Pharma) · Tube of 75 g · MRP ₹245 · Price ₹221 · Rx: false · Category: fever · Stock: 18 · inStock: true
- `m4`: Glycomet 500 SR (USV) · Strip of 20 tablets · MRP ₹52 · Price ₹47 · Rx: true · Category: diabetes · Stock: 6 (Low Stock!) · inStock: true
- `m5`: Accu-Chek Active Strips (Roche) · Box of 50 strips · MRP ₹1199 · Price ₹999 · Rx: false · Category: diabetes · Stock: 12 · inStock: true
- `m6`: Telma 40 Tablet (Glenmark) · Strip of 30 tablets · MRP ₹238 · Price ₹214 · Rx: true · Category: heart · Stock: 24 · inStock: true
- `m7`: Ecosprin 75 Tablet (USV) · Strip of 14 tablets · MRP ₹6 · Price ₹5 · Rx: true · Category: heart · Stock: 80 · inStock: true
- `m8`: Becosules Capsule (Pfizer) · Strip of 20 capsules · MRP ₹52 · Price ₹47 · Rx: false · Category: vitamins · Stock: 30 · inStock: true
- `m9`: Shelcal 500 (Torrent) · Bottle of 15 tablets · MRP ₹128 · Price ₹115 · Rx: false · Category: vitamins · Stock: 5 (Low Stock!) · inStock: true
- `m10`: Digene Antacid Gel (Abbott) · Bottle of 200 ml · MRP ₹145 · Price ₹131 · Rx: false · Category: digestion · Stock: 15 · inStock: true

### 2. Nursing Services & Caretaker Profiles (Caretaker)
Seeded from `user-app/src/data/catalog.ts`:
- Services:
  - `n1`: Elderly care (`12-hour day shift` @ ₹1,200, `24-hour live-in` @ ₹1,800, `Monthly plan` @ ₹32,000)
  - `n2`: Post-surgery care (`12-hour shift` @ ₹1,500, `24-hour care` @ ₹2,400)
  - `n3`: Nurse visit (`Single visit` @ ₹499, `5-visit pack` @ ₹2,250)
  - `n4`: Mother & baby care (`12-hour shift` @ ₹1,300, `24-hour live-in` @ ₹1,900)
  - `n5`: Physiotherapy at home (`Single session` @ ₹699, `10-session pack` @ ₹6,290)
- Caretaker Identity for Showcase:
  - ID: `c1`
  - Name: `Sunita Rao`
  - Role: `Registered Nurse (GNM)`
  - Experience: `8 years`
  - Rating: `4.9` (156 reviews)
  - Languages: `Kannada, Hindi, English`
  - Verified: `true`

### 3. Cross-App Consistency Identifiers
- Medicine Order Codes: `LL-M-xxxxx` (e.g. `LL-M-20417` in User App, `LL-M-48921` in Partner App)
- Nursing Booking Codes: `LL-N-xxxxx` (e.g. `LL-N-07731` in User App, `LL-N-90234` in Partner App)
- Rider Persona: `Ravi Kumar` (KA 03 EZ 9142)
- Pharmacy Persona: `Sri Sai Medicals` (Indiranagar, Bengaluru)
- Patient Persona: `K. Raghavan` (Age 68, Father of Vikram Rao)
- Customer Address: `12th Main, HAL 2nd Stage, Indiranagar, Bengaluru 560038`
