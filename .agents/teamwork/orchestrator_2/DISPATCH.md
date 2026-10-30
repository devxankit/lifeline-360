## 2026-10-29T12:30:00Z
Build the native Android Partner app (Lifeline Partner) for Lifeline 360 as a capability showcase serving Medicine Vendor and Nursing/Caretaker roles, following docs/NATIVE-APP-PLAYBOOK.md and docs/PARTNER-APP-PLAN.md.

Working directory: partner-app
Integrity mode: development

Reference material:
- `docs/NATIVE-APP-PLAYBOOK.md`
- `docs/PARTNER-APP-PLAN.md`

## Requirements
### R1. Shared Foundations and Shared Mobile UI Package
Extract the shared theme, UI kit, and brand components from the existing user app into `packages/mobile-ui` (configured as a local package for the partner app) and implement shared foundation flows: phone OTP authentication, role selection (Medicine Vendor vs. Nurse/Caretaker; one account = one role), role-specific KYC document upload with demo approval, earnings/transaction tracking, and shared utility screens.

### R2. Medicine Vendor Module
Implement the complete Medicine Vendor experience with sample data and simulated orders: vendor dashboard with store status toggle and low-stock alerts; order lifecycle management (simulated incoming orders, timer, accept/reject, packing checklist, and rider handover OTP); prescription review with quote builder; and catalogue management (categories, adding/editing medicines, pricing, and stock toggles).

### R3. Nursing and Caretaker Module
Implement the complete Nursing and Caretaker experience with sample data and simulated bookings: availability management (weekly slot schedule and leave calendar); simulated booking requests with acceptance timer (respecting availability); active booking lifecycle (on my way, GPS check-in at address, active shift timer with care checklist, and completion with family OTP and care summary); and ratings and reviews.

### R4. Android Native Project & Signed Release APK
Scaffold the native Android application in `partner-app/` with package name `com.lifeline360.partner` and application label "Lifeline Partner" with custom app icon, configure release signing with a dedicated release keystore and release guard in Gradle, and build a verified signed release APK.

CONTEXT & RESUMPTION NOTE:
You are re-spawned because predecessor orchestrator (orchestrator_1) encountered an unexpected network timeout.
Prior progress is fully preserved on disk:
- `PROJECT.md` is available at `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\.agents\teamwork\orchestrator_1\PROJECT.md`.
- Milestone M1 (Shared Foundations & packages/mobile-ui) is already implemented and largely verified.
- `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\.agents\teamwork\challenger_m1_2_repl\challenge_report.md` identified 3 concrete fixes needed for M1:
  1. Fix Jest mock hoisting in `partner-app/__tests__/MobileUiExportsStress.test.tsx` (ReferenceError: React).
  2. Add role immutability guard in `partner-app/src/store/PartnerStore.tsx` when kycStatus === 'approved'.
  3. Ensure logout in `partner-app/src/navigation/TabStubs.tsx` (`SharedProfileScreen`) resets navigation to 'Login'.
- Once those 3 items are addressed and verified, sign off Milestone M1 Gate and execute M2 (Medicine Vendor), M3 (Nursing/Caretaker), M4 (Release APK & Sign), and M5 (Final E2E Suite Pass), then report completion.
