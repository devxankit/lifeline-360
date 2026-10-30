## 2026-10-29T10:53:34Z

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

## Acceptance Criteria

### Build & Release
- [ ] `packages/mobile-ui` is set up and consumed by `partner-app/` without packaging or path errors.
- [ ] Release APK is built successfully at `partner-app/android/app/build/outputs/apk/release/app-release.apk` (or copied to `partner-app/release/`).
- [ ] `apksigner verify --print-certs` on the release APK verifies successfully with the dedicated partner release certificate (not the Android debug certificate).
- [ ] `aapt2 dump badging` on the release APK confirms package name `com.lifeline360.partner` and application label "Lifeline Partner".

### Quality & Static Checks
- [ ] TypeScript compilation (`npx tsc --noEmit`) passes with 0 errors in `partner-app/`.
- [ ] ESLint checks (`npx eslint src`) pass with 0 errors in `partner-app/`.
- [ ] Automated unit tests (`npx jest`) pass for core business logic, including order state transitions, booking state transitions, earnings calculations, and simulator availability filtering.

### Shared & Auth Workflows
- [ ] Authentication flow supports phone number input, OTP entry, role selection, role-specific KYC document capture, and transition from pending to approved state.
- [ ] Selected role permanently determines navigation: Vendor role mounts vendor tab navigation (Orders, Catalogue, Earnings, Profile) and Caretaker role mounts caretaker tab navigation (Today, Requests, Earnings, Profile).

### Medicine Vendor Workflows
- [ ] Vendor dashboard displays store open/closed toggle, today's summary metrics, and low-stock indicators.
- [ ] Order flow executes end-to-end: receiving simulated order alert, accepting order within timer, completing packing checklist, and completing handover with rider OTP.
- [ ] Prescription flow allows viewing uploaded prescription image, assembling medicine quote lines, and advancing to confirmed/packing upon simulated user acceptance.
- [ ] Catalogue allows searching, filtering by category, adding/editing medicine items, and toggling stock availability.

### Nursing & Caretaker Workflows
- [ ] Availability calendar allows setting weekly shifts and leave dates, and the request simulator generates incoming requests only within available slots.
- [ ] Caretaker request flow executes end-to-end: receiving request alert, accepting within timer, transitioning through "on my way", performing GPS check-in, tracking active shift timer with care checklist items, and completing service via family OTP and care summary.
- [ ] Completed bookings and orders accurately update earnings history and transaction summaries.
