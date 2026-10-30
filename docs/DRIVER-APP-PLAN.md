# Lifeline 360 — Driver / Ambulance App: Build Plan

The second native app, planned with [NATIVE-APP-PLAYBOOK.md](NATIVE-APP-PLAYBOOK.md). It pairs with the finished User app (`user-app/`): the user books an ambulance, the driver gets it here, accepts it, and runs the trip.

**Why this app next:** it completes the emergency flow already demoed in the User app, it's the smallest of the remaining apps (about 25 screens), and it reuses most of the User app's code. The Medicine Vendor + Caretaker app follows with the same approach (see the end).

---

## 1. Scope (from the Scope of Work, section 6)

| Scope item | Where it lives in the app |
|---|---|
| Driver registration | Onboarding: phone + OTP → personal details |
| KYC / document verification | Document upload steps → "verification pending" → approved |
| Ambulance / vehicle details | Vehicle step (type, number, equipment) + Vehicle screen |
| Online / offline availability | Toggle on Home |
| Emergency booking requests | Full-screen incoming request with countdown |
| Accept / reject request | Swipe to accept, or decline with a reason |
| Pickup location | Active trip: to pickup |
| Destination / hospital details | Active trip: to hospital |
| Navigation | "Navigate" opens Google Maps turn-by-turn |
| Live GPS location | Location shared while online or on a trip |
| Trip status | Arrived → Patient on board → Reached hospital → Completed |
| Emergency booking history | Trips tab + trip detail |
| Earnings / transactions | Earnings tab: summary, chart, transactions, payouts |
| Notifications | Notifications screen + push |
| Call masking | Call screen through the masked line (same as the User app) |

Out of scope: hospital-side screens, fleet-owner dashboards (fleet management sits in the Master Admin).

## 2. Decisions to confirm before building

Recommended answers first. Ask them all together.

| # | Question | Recommended | Alternatives |
|---|---|---|---|
| 1 | Package name (permanent) | **`com.lifeline360.driver`** | `in.lifeline360.driver` |
| 2 | Data for this build | **Sample data + simulated requests** (same as the User app) | Connect the backend now |
| 3 | Maps in the app | **Designed vector map now, Google Maps later** | Google Maps now (needs an API key) |
| 4 | Turn-by-turn navigation | **Hand off to the Google Maps app** (deep link) | Navigation SDK inside the app (paid, heavier) |
| 5 | Incoming request alert | **Full-screen screen + loud ringtone + vibration** | In-app banner only |
| 6 | Theme | **Light app, dark navy for the incoming request and night use** | Full dark mode |
| 7 | Driver payout model shown | **Per-trip earnings + weekly payout** (labelled sample) | Monthly salary view |
| 8 | Release output | **Signed APK** (same as the User app) | APK + AAB |
| 9 | Code sharing with the User app | **Copy the theme and UI kit now, shared package later** | Monorepo shared package now |

Facts we need from the client (placeholders until then): fare and commission rules, document list per state, payout schedule, support number.

## 3. Design (Phase 2–3 of the playbook)

The design system is already approved: teal + white, the logo's pastels, navy text, red for emergencies only, Plus Jakarta Sans. The canvas already has the **Driver · Incoming emergency** board (dark navy, countdown ring, swipe to accept).

Add these boards to the same canvas (https://claude.ai/artifact/QXz5GWX29PhDZfPbX7wC2k) and get approval before coding:

1. **Home: offline and online.** Big online/offline toggle, today's trips/hours/earnings, map with your position, the shift's status.
2. **Active trip: to pickup.** Map with the route, patient name and condition, pickup address, Navigate / Call / Arrived.
3. **Active trip: to hospital.** Hospital card, ETA, "Reached hospital", emergency contact.
4. **Trip complete.** Fare breakdown, cash/online collected, rating received.
5. **Earnings.** Week chart (bars), totals, transactions, next payout.
6. **KYC upload step.** Document list with statuses (pending / uploaded / approved / rejected with reason).

Rules carried over from the User app (avoid the "AI look"): a real driver photo, dense real information (plate, distance, ETA, fare), a flat tab bar, 10–16px corners, no decorative illustrations. The driver app is used **while driving**: big touch targets (56px for primary actions), high contrast, one primary action per screen, swipe-to-confirm for irreversible steps.

## 4. Screens (about 25)

**Onboarding and KYC**
1. Splash
2. Phone login
3. OTP
4. Personal details (name, photo, date of birth, address, emergency contact)
5. Vehicle details (type BLS/ALS/ICU/Mortuary, registration number, model, equipment checklist)
6. Documents (driving licence, RC, insurance, PUC, ID proof, police verification): list with per-document status
7. Document upload (front/back photo, expiry date)
8. Verification pending (what happens next, support call)
9. Approved / welcome

**Main tabs: Home · Trips · Earnings · Profile**

10. Home: offline/online toggle, today's stats, map, shift status
11. Incoming request (full screen, countdown, swipe to accept, decline)
12. Decline reason sheet
13. Active trip: to pickup (navigate, call, arrived)
14. Arrived at pickup (patient on board, swipe to confirm)
15. Active trip: to hospital (navigate, ETA, reached hospital)
16. Trip complete (fare, payment collected, rate the patient's side)
17. Trips list (today / week / all, filters)
18. Trip detail (timeline, route, fare, patient, hospital)
19. Earnings (week chart, totals, incentives)
20. Transactions
21. Payouts and bank account
22. Notifications
23. Masked call (shared)

**Profile**

24. Profile (photo, rating, vehicle summary)
25. Vehicle and documents (renewal reminders)
26. Settings (language, sound, navigation app)
27. Help & support / SOS to the control room
28. Legal (terms, privacy)

## 5. Main flows

1. **First run:** Splash → Phone → OTP → Personal → Vehicle → Documents → Pending. For the demo, pending turns to approved after a few seconds (later: admin approves in the Master Admin KYC queue).
2. **Go online:** Home toggle → location permission → "Online · waiting for requests".
3. **Emergency request:** a simulated request arrives 5–10 seconds after going online → full-screen alert with ringtone and vibration, 30-second countdown.
   - Accept → Active trip (to pickup).
   - Decline or timeout → reason sheet → back to waiting.
4. **Trip:** to pickup (vehicle moves on the designed map, ETA counts down) → Arrived → Patient on board → to hospital → Reached → Trip complete (fare, mark cash collected) → back online.
5. **Earnings:** each completed trip adds a transaction; the weekly total and chart update.
6. **Go offline:** only allowed with no active trip; summary of the shift.

Simulated in this build (labelled "Demo"): OTP, requests, GPS movement, fares, payouts, document approval.

## 6. Native features this app needs (beyond the User app)

| Need | Package (demo build) | Later (production) |
|---|---|---|
| Location while online / on trip | `@react-native-community/geolocation` for the current position; simulated movement for the demo | Foreground service + background location, sent to the backend over a socket |
| Keep the screen on during a trip | `@sayem314/react-native-keep-awake` | same |
| Incoming alert sound + vibration | `react-native` `Vibration` + a bundled ringtone (`react-native-nitro-sound` or a small native sound module) | FCM high-priority message + full-screen intent notification |
| Camera / gallery for documents | `react-native-image-picker` | same, with upload to cloud storage |
| Permissions flow | `react-native-permissions` | same |
| Open turn-by-turn navigation | `Linking.openURL('google.navigation:q=lat,lng')` with a web fallback | same |
| Native splash screen | `react-native-bootsplash` | same |
| Push notifications | — | `@react-native-firebase/messaging` |

Android manifest additions: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `CAMERA`, `VIBRATE`, `WAKE_LOCK`. Later: `ACCESS_BACKGROUND_LOCATION`, `FOREGROUND_SERVICE_LOCATION`, `POST_NOTIFICATIONS`, `USE_FULL_SCREEN_INTENT`. Explain each permission in-app before asking.

## 7. Project setup

Folder: `driver-app/` at the repo root, a sibling of `user-app/`.

```bash
npx @react-native-community/cli@20.2.0 init Lifeline360Driver --version 0.87.1 \
  --package-name com.lifeline360.driver --directory driver-app --skip-git-init --pm npm --install-pods false
npm uninstall @react-native/new-app-screen && npm pkg set name=lifeline360-driver
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-screens react-native-svg lucide-react-native @react-native-async-storage/async-storage@2.2.0 \
  @react-native-community/geolocation @sayem314/react-native-keep-awake react-native-image-picker react-native-permissions
```

Copy straight from `user-app/` (no changes needed):
- `metro.config.js` (subst `watchFolders` fix), `.eslintrc.js`, `gradle.properties` memory settings
- `android/app/build.gradle` signing block + release guard (new keystore: `lifeline360-driver-upload.keystore`)
- `scripts/generate-icons.py`, the fonts in `assets/fonts` and `android/app/src/main/assets/fonts`
- `src/theme/index.ts`, `src/components/T.tsx`, `ui.tsx`, `brand.tsx` (DesignedMap, LifelineMark, DuoIcon, Fade)
- `src/screens/checkout.tsx` → only `CallScreen` is needed
- `src/utils/format.ts`

App icon: the same Lifeline mark, on a **navy tile** so drivers can tell it apart from the User app on the same phone. Add a background-colour option to the icon script. App name: "Lifeline Driver".

## 8. Architecture

```text
driver-app/src/
  theme/        copied tokens + a `night` set (navy surfaces) for the incoming/trip screens
  components/   copied kit + SwipeToConfirm, CountdownRing, OnlineToggle, StatTile, BarChart (SVG)
  data/         sample driver, vehicle, documents, hospitals, sample requests, trip history, payouts
  store/        DriverStore: session, profile, vehicle, documents + KYC status, online flag,
                current request, active trip (stage + progress), trips, transactions, settings
  services/     requestSimulator (emits a request after going online), locationService
                (real position + simulated movement), alertService (ringtone + vibration + keep-awake)
  navigation/   onboarding stack → tabs (Home, Trips, Earnings, Profile) + modal Incoming request
  screens/      onboarding, kyc, home, request, trip, trips, earnings, profile, common
```

Key behaviour:
- **One active-trip state machine:** `offered → accepted → to_pickup → arrived → on_board → to_hospital → reached → completed` (plus `declined` and `cancelled_by_user`). Every screen reads the stage, so the backend can later drive the same states.
- **Request offer** is a modal route opened by the simulator (later by a push or socket event). The countdown expires to `declined`.
- **Earnings** derive from completed trips (fare minus commission placeholder), so the numbers always add up.
- **Demo-mode labels** wherever data is simulated, as in the User app.

## 9. Build order and estimate

| Step | Work | Estimate |
|---|---|---|
| 1 | Confirm decisions (section 2) | 15 min |
| 2 | Add 6 driver boards to the canvas, get approval | 1–2 rounds |
| 3 | Scaffold, copy shared files, keystore, icon, baseline release build | 1–2 h |
| 4 | Store, simulators, navigation skeleton | 2 h |
| 5 | Onboarding + KYC screens | 2–3 h |
| 6 | Home, incoming request, active trip, trip complete (core loop) | 4–5 h |
| 7 | Trips, earnings, transactions, payouts | 2–3 h |
| 8 | Profile, vehicle/documents, settings, help, notifications | 2 h |
| 9 | `tsc` / `eslint` / `jest`, release build, emulator walk-through, phone install | 1–2 h |

## 10. Verification

- Static: `npx tsc --noEmit`, `npx eslint src`, `npx jest` (state machine transitions, earnings totals, countdown expiry).
- Build: `subst L:` → `L:\driver-app\android` → `gradlew assembleRelease`, then `apksigner verify --print-certs` must show the driver release key.
- Emulator walk-through with screenshots:
  1. First run → KYC → approved
  2. Go online → request arrives → decline with a reason
  3. Next request → accept → pickup → on board → hospital → complete
  4. The earnings total includes the trip
  5. Go offline
- Real phone: confirm the ringtone, vibration and keep-awake, which an emulator doesn't show properly. Install only with permission, always with `adb -s <serial>`.
- Run it beside the User app: same booking ID format (`LL-A-xxxxx`), same hospitals and driver data, so the two can be demoed together.

## 11. Connecting the two apps later (backend phase)

The demo keeps the apps independent. For production:
- User books → backend creates the ambulance booking → nearest online driver gets an FCM high-priority push + socket event → accept is confirmed by the backend (first to accept wins).
- Driver location streams to the backend every 3–5 seconds; the User app's tracking map subscribes to it.
- Calls go through the call-masking API for both apps.
- KYC approval comes from the Master Admin panel's KYC queue.

## 12. Risks

| Risk | Mitigation |
|---|---|
| Android kills background location on some phones (OPPO/Xiaomi battery savers) | Foreground service with a visible notification + an in-app guide to "allow background activity" |
| Missed requests when the screen is locked | Full-screen intent notification + a loud channel; test on a real phone |
| Play Store review for background location | Clear in-app disclosure, location used only while online, a privacy policy URL |
| Windows path limits | Same `subst` + Metro `watchFolders` fix as the User app |
| Two apps drifting apart visually | Copy the same theme and kit; move them into a shared package before the third app |

## 13. After this: Medicine Vendor + Caretaker app (preview)

The same playbook with role-based access in one app (`partner-app/`, `com.lifeline360.partner`):
- **Shared:** phone + OTP, role choice (Vendor / Caretaker), KYC, verification status.
- **Vendor:** dashboard, orders by status (new / packing / ready / done), accept/reject, prescription review + quote, packing checklist, OTP handover, catalogue + add/edit medicine, categories, pharmacy profile, earnings.
- **Caretaker:** availability toggle + weekly calendar, booking requests (accept/reject), booking detail, check-in with an active-service timer and care checklist, completion summary, services & rates, earnings, ratings.
- The canvas already has the **Vendor · Orders** and **Caretaker · Today** boards. Plan it in its own `docs/PARTNER-APP-PLAN.md` once the Driver app ships, and move the shared theme and kit into a package at that point.
