## 2026-10-29T10:55:54Z
You are spec_miner_survey_2, working in `.agents/teamwork/spec_miner_survey_2/`.
Your parent orchestrator is conversation ID `3f1111fd-5fd5-4769-8c63-6bedcf960bdd`.

MANDATORY FIRST STEP:
Read the file: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\.agents\teamwork\ORIGINAL_REQUEST.md`.

Your objective:
Thoroughly mine and extract functional domain specifications, user flows, state machines, and business logic requirements from:
1. `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\docs\PARTNER-APP-PLAN.md`
2. `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\docs\NATIVE-APP-PLAYBOOK.md`
3. Any mock data, user models, or specs in the codebase.

Specifically investigate and document:
1. R1: Shared Foundation & Auth Workflows:
   - Phone OTP auth flow details (screens, inputs, OTP verification, mock numbers).
   - Role selection logic: Medicine Vendor vs Nurse/Caretaker (one account = one permanent role, navigation branching).
   - Role-specific KYC document upload with demo approval mechanism (vendor license/GST vs nursing registration/ID, status states: pending, approved).
   - Earnings & transaction tracking (summary metrics, transaction history, payouts/settlement simulation).
   - Shared utility screens (profile, settings, help/support).
2. R2: Medicine Vendor Module:
   - Vendor dashboard: store open/closed toggle, today summary metrics, low-stock indicators.
   - Order lifecycle state machine: simulated incoming order alert, acceptance timer (e.g. 60s countdown), accept/reject, packing checklist, rider handover with OTP verification.
   - Prescription review flow: viewing uploaded prescription image, medicine quote builder (adding lines, quantities, pricing), simulated user acceptance, moving to packing.
   - Catalogue management: categories, adding/editing medicines, pricing, stock availability toggle.
3. R3: Nursing & Caretaker Module:
   - Availability management: weekly shift schedule (days, time slots) and leave calendar.
   - Simulated booking requests: timer-based acceptance, availability slot filtering (only generate requests during available slots).
   - Active booking lifecycle state machine: request alert -> accept -> "on my way" -> GPS check-in at patient address -> active shift timer with care checklist -> service completion with family OTP and care summary.
   - Ratings and reviews display.
4. Business Logic & State Machines for Unit Testing:
   - Identify exact state transition logic, pure functions, and data structures suitable for unit testing with Jest (order state transitions, booking state transitions, earnings calculations, simulator availability filtering).

Maintain progress in `.agents/teamwork/spec_miner_survey_2/progress.md`.
Write your full findings to `.agents/teamwork/spec_miner_survey_2/functional_spec.md` and create a comprehensive `.agents/teamwork/spec_miner_survey_2/handoff.md`.
When finished, send a message to your parent orchestrator (`3f1111fd-5fd5-4769-8c63-6bedcf960bdd`) summarizing your findings and referencing the file paths.
