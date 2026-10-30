# Handoff Report — Specification Miner Survey 2 (Partner App Functional Domain Spec)

## 1. Observation

Direct observations extracted from authoritative reference files and existing implementations:

1. **`ORIGINAL_REQUEST.md` (lines 16-24, 41-55)**:
   - "Extract the shared theme, UI kit, and brand components from the existing user app into `packages/mobile-ui`... and implement shared foundation flows: phone OTP authentication, role selection (Medicine Vendor vs. Nurse/Caretaker; one account = one role), role-specific KYC document upload with demo approval, earnings/transaction tracking, and shared utility screens."
   - "Vendor dashboard displays store open/closed toggle, today's summary metrics, and low-stock indicators."
   - "Order flow executes end-to-end: receiving simulated order alert, accepting order within timer, completing packing checklist, and completing handover with rider OTP."
   - "Prescription flow allows viewing uploaded prescription image, assembling medicine quote lines, and advancing to confirmed/packing upon simulated user acceptance."
   - "Availability calendar allows setting weekly shifts and leave dates, and the request simulator generates incoming requests only within available slots."
   - "Caretaker request flow executes end-to-end: receiving request alert, accepting within timer, transitioning through 'on my way', performing GPS check-in, tracking active shift timer with care checklist items, and completing service via family OTP and care summary."

2. **`docs/PARTNER-APP-PLAN.md` (lines 5-9, 58-68, 73-77, 241-249)**:
   - Line 58-59: Package name permanent: `com.lifeline360.partner`; Role model: "Choose the role at signup; one account = one role".
   - Line 73-77: Role accent colors: "Vendor screens use mint (the Medicine colour) for highlights and empty states. Caretaker screens use lavender (the Nursing colour). Teal stays the primary action colour in both."
   - Line 241-249: Two state machines:
     * Order: `new → accepted → packing → ready → handed_over → delivered` (+ `rejected`, `quote_sent → quote_confirmed` for Rx).
     * Booking: `requested → accepted → on_the_way → checked_in → in_progress → completed` (+ `rejected`, `cancelled_by_user`).
   - Line 246: "Catalogue stock is live in the store: packing an order reduces stock; low-stock thresholds drive the dashboard alert."
   - Line 248: "Booking IDs match the User app (`LL-M-xxxxx` for medicine, `LL-N-xxxxx` for nursing), and so do medicine names and service names, so the three apps can be shown side by side."

3. **`user-app/src/data/catalog.ts` (lines 133-162, 200-222)**:
   - Medicine categories defined: `fever`, `diabetes`, `heart`, `vitamins`, `digestion`, `skin`, `baby`, `devices`.
   - Sample medicines `m1` to `m15`: Dolo 650, Crocin Advance, Volini Gel, Glycomet 500 SR (Rx), Telma 40 (Rx), Ecosprin 75 (Rx), etc.
   - Nursing services defined: `n1` Elderly care, `n2` Post-surgery care, `n3` Nurse visit, `n4` Mother & baby care, `n5` Physiotherapy at home.
   - Caretaker profile `c1`: Sunita Rao, Registered nurse (GNM), 8 yrs exp, rating 4.9, 156 reviews.

4. **`user-app/src/screens/medicine.tsx` (lines 342-395)**:
   - Order tracking metadata references pharmacy "Sri Sai Medicals" and delivery partner "Ravi Kumar".

5. **`driver-app/src/store/DriverStore.tsx` and `driver-app/src/screens/kyc/`**:
   - Demonstrated pattern for KYC document status (`missing` -> `pending` -> `approved`), demo auto-approval timeout (6 seconds), earnings aggregation (`todayStats`, `chart`), and pure state machines.

---

## 2. Logic Chain

1. **Role Separation and Navigation Model**:
   - `PARTNER-APP-PLAN.md` specifies that one partner app serves two distinct roles (Medicine Vendor and Nurse/Caretaker).
   - Because `one account = one permanent role`, once the role is chosen during onboarding, the application branches cleanly:
     - `VendorTabs` (`Orders`, `Catalogue`, `Earnings`, `Profile`) with mint accents (`#1A8A57`).
     - `CaretakerTabs` (`Today`, `Requests`, `Earnings`, `Profile`) with lavender accents (`#6F5BC9`).
   - The shared foundation screens (Splash, Phone Login, OTP Verification, KYC Upload, Pending, Masked Call, Notifications, Help/Legal) are reused across both personas.

2. **Order Lifecycle State Machine for Vendors**:
   - The vendor workflow mirrors physical counter operations: receiving an incoming order, accepting it before the countdown timer expires, retrieving and checking items from shelves, packaging them, handing off to the assigned courier, and verifying handover via a secure OTP.
   - For prescription orders, the vendor acts as an order creator: reading the doctor's prescription image via a zoomable viewer, building an itemized quote from the catalogue, and dispatching it to the patient. Once the patient accepts (simulated after 6s in demo mode), the order transitions seamlessly into the packing checklist.

3. **Booking Lifecycle State Machine for Caretakers**:
   - The caretaker workflow models home healthcare delivery: setting weekly shift availability and leave dates, receiving booking offers only during active available slots, accepting within a countdown timer, traveling to the patient's residence ("On my way"), performing physical GPS check-in (<= 100m geofence), tracking the active shift with an on-screen timer ring and clinical care checklist, and securing shift completion via a 4-digit OTP provided by the family.

4. **Unit Testable Business Logic Boundaries**:
   - All state transitions (`orderStateMachine.ts`, `bookingStateMachine.ts`), earnings calculations (`earningsCalculator.ts`), availability schedule filtering (`availabilityFilter.ts`), catalogue stock deductions (`catalogueStock.ts`), and quote aggregations (`quoteBuilder.ts`) are pure, side-effect-free functions.
   - This design allows 100% test coverage with Jest without needing React Native native mocks or AsyncStorage wrappers.

---

## 3. Caveats

1. **Hardware Native Modules in Demo Mode**:
   - GPS check-in geofencing and camera document capture utilize React Native native libraries (`@react-native-community/geolocation`, `react-native-image-picker`). In demo mode and emulator runs, pure fallback mocks (e.g. "Demo: Verify Check-in" button, bundled sample prescription/document photos) ensure zero blocker friction when physical sensors are unavailable.
2. **Backend Gateway Simulation**:
   - Real-time WebSockets and FCM push notifications are simulated in this capability showcase using internal interval timers (`orderSimulator` and `requestSimulator`) stored in memory/AsyncStorage, exactly as was done for `user-app` and `driver-app`.

---

## 4. Conclusion

The functional domain specification for the Lifeline 360 Partner App is fully discovered, reconciled, and documented in `.agents/teamwork/spec_miner_survey_2/functional_spec.md`. The specification covers:
- **50 discovered features** across R1 (Shared Foundations & Auth), R2 (Medicine Vendor), and R3 (Nursing & Caretaker).
- **25 detailed edge cases** addressing invalid inputs, timeout expiries, stock threshold drops, geofence disparities, and OTP rejections.
- **Pure business logic contracts and state machine transition tables** ready for immediate Jest unit testing.
- **Cross-app ecosystem consistency**, aligning booking codes (`LL-M-xxxxx`, `LL-N-xxxxx`), sample catalogues, and partner personas with the existing User App.

---

## 5. Verification Method

To independently verify this specification:

1. **Inspect Specification Documents**:
   - Functional specification: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\.agents\teamwork\spec_miner_survey_2\functional_spec.md`
   - Progress tracker: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\.agents\teamwork\spec_miner_survey_2\progress.md`
   - Plan reference: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\docs\PARTNER-APP-PLAN.md`
   - Requirements reference: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\.agents\teamwork\ORIGINAL_REQUEST.md`

2. **Verify Cross-App Consistency**:
   - Check User App medicine catalog: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\user-app\src\data\catalog.ts` (lines 146–162)
   - Check User App nursing catalog: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\user-app\src\data\catalog.ts` (lines 202–221)
   - Check User App order steps and persona: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\user-app\src\screens\medicine.tsx` (lines 342–395)
