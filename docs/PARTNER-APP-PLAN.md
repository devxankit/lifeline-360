# Lifeline 360 — Partner App (Medicine Vendor + Nursing/Caretaker): Build Plan

The third native app, planned with [NATIVE-APP-PLAYBOOK.md](NATIVE-APP-PLAYBOOK.md). It comes after the User app (`user-app/`) and the Driver app ([DRIVER-APP-PLAN.md](DRIVER-APP-PLAN.md)).

The scope asks for **one application** serving two partner types with role-based access:
- **Medicine vendors** (pharmacies) receive and fulfil the medicine orders users place.
- **Nursing/caretaker partners** receive and deliver the home-care bookings users make.

Both pair with existing User app flows (medicine orders, nursing bookings), so the three apps can be demoed together.

---

## 1. Scope (from the Scope of Work, sections 4 and 5)

### Medicine Vendor module

| Scope item | Where it lives in the app |
|---|---|
| Vendor registration / login | Phone + OTP → role "Medicine vendor" → pharmacy details |
| KYC / document verification | Drug licence, GST, pharmacist certificate, shop photo, ID → pending → approved |
| Pharmacy profile | Profile: name, address, hours, delivery radius, pharmacist |
| Medicine catalogue | Catalogue list with search and filters |
| Medicine categories | Category management (add, rename, reorder, hide) |
| Pricing and availability | Add/edit medicine: MRP, selling price, stock, in-stock toggle |
| Order management | Orders tab grouped by status |
| Prescription order management | Prescription review: view the Rx, build a quote, send it to the user |
| Accept / reject orders | Order detail actions, reject with a reason |
| Order preparation | Packing checklist per item, substitutions, mark packed |
| Delivery handover | Assign the rider, verify the handover OTP |
| Order history | Past orders with filters |
| Earnings / transactions | Earnings tab: totals, chart, transactions, settlements |

### Nursing/Caretaker module

| Scope item | Where it lives in the app |
|---|---|
| Caretaker registration / login | Phone + OTP → role "Nurse / caretaker" → personal details |
| KYC / document verification | ID, nursing certificate (GNM/ANM/BSc), police verification, photo |
| Profile and service details | Profile: experience, languages, skills, bio |
| Service categories | Services I offer (elderly care, post-surgery, nurse visit, mother & baby, physio) with rates |
| Availability management | Online toggle + weekly calendar + leave days |
| Booking requests | Requests list with accept/reject and a timer |
| Accept / reject booking | Request detail, reject with a reason |
| Patient / service details | Booking detail: patient, condition, care notes, address, family contact |
| Booking status | Upcoming → on the way → checked in → in progress → completed |
| Service completion | Check-out with a care summary, completion OTP from the family |
| Earnings / history | Earnings tab + completed bookings |
| Ratings & reviews | Ratings screen: average, breakdown, review list |

Shared across both roles: calling through masked numbers (the scope's calling section), notifications, help and support.

## 2. Decisions to confirm before building

Recommended answers first. Ask them all together.

| # | Question | Recommended | Alternatives |
|---|---|---|---|
| 1 | Package name (permanent) | **`com.lifeline360.partner`** | `in.lifeline360.partner` |
| 2 | Role model | **Choose the role at signup; one account = one role** | One account can hold both roles with a switcher |
| 3 | App name on the phone | **"Lifeline Partner"** | "Lifeline Vendor & Care" |
| 4 | Data for this build | **Sample data + simulated incoming orders/bookings** | Connect the backend now |
| 5 | Prescription quoting | **Vendor builds the cart from the Rx, the user confirms and pays** | Vendor only accepts or rejects |
| 6 | Delivery | **Lifeline rider picks up (handover OTP)** | Vendor's own delivery staff |
| 7 | Caretaker check-in | **GPS check-in at the address + start timer** | Manual check-in |
| 8 | Completion proof | **OTP from the family + care summary** | Summary only |
| 9 | Code sharing | **Move the theme and UI kit into a shared package now** (third app) | Keep copying files |
| 10 | Release output | **Signed APK** | APK + AAB |

Facts we need from the client (placeholders until then): commission per role, settlement cycle, required documents per state, caretaker rate rules, the order acceptance time limit.

## 3. Design (Phase 2–3 of the playbook)

The design system is approved (teal + white, the logo's pastels, navy text, Plus Jakarta Sans). Role identity uses the existing service colours:
- **Vendor screens use mint** (the Medicine colour) for highlights and empty states.
- **Caretaker screens use lavender** (the Nursing colour).
- Teal stays the primary action colour in both, so the app still feels like one product.

The canvas (https://claude.ai/artifact/QXz5GWX29PhDZfPbX7wC2k) already has **Vendor · Orders** and **Caretaker · Today**. Add these boards and get approval before coding:

1. **Role choice + KYC document list** (shared look, role-specific documents)
2. **Vendor dashboard:** open/closed toggle, today's sales, orders by status, low-stock alert
3. **Vendor order detail:** items, Rx badge, customer area, accept/reject, packing checklist
4. **Prescription review:** Rx image on top, medicine search, quote builder, send quote
5. **Vendor catalogue + add/edit medicine form**
6. **Caretaker requests:** a request card with patient, service, schedule, distance, earning, timer
7. **Caretaker active service:** check-in status, shift timer ring, care checklist, family call
8. **Availability calendar** (week view with slots and leave)
9. **Earnings** (shared layout, role-coloured chart)

"Real app" rules carried over: real partner and patient photos where they make sense, dense working information (order IDs, quantities, times, amounts), flat tab bars, 10–16px corners, no decorative illustrations. Vendors often work at a counter on a shared phone or tablet, so make lists scannable and the primary actions large.

## 4. Screens

### Shared (both roles), about 12
1. Splash
2. Phone login
3. OTP
4. Role choice (Medicine vendor / Nurse or caretaker)
5. Basic details (role-specific form)
6. Documents list (role-specific)
7. Document upload (photo, expiry, number)
8. Verification pending
9. Approved / welcome
10. Notifications
11. Masked call
12. Help & support, Legal

### Vendor, about 16 · tabs: **Orders · Catalogue · Earnings · Profile**
13. Dashboard (open/closed toggle, today's sales, orders by status, low stock)
14. Orders list (New · Packing · Ready · Completed · Rejected)
15. New order alert (sound + banner, accept-within timer)
16. Order detail (items, Rx, customer area, amount, accept/reject)
17. Reject reason sheet
18. Prescription review + quote builder
19. Packing checklist (tick items, mark unavailable, suggest a substitute)
20. Ready for pickup / handover (rider details, handover OTP)
21. Order history + order detail (read-only)
22. Catalogue (search, category filter, stock badges)
23. Add / edit medicine (name, maker, pack, MRP, price, stock, Rx required, category, in stock)
24. Categories management
25. Earnings (week chart, sales, commission, net)
26. Transactions + settlements (bank account)
27. Pharmacy profile (hours, delivery radius, pharmacist, licence details)
28. Settings (order sound, auto-accept off/on, language)

### Caretaker, about 15 · tabs: **Today · Requests · Earnings · Profile**
29. Today (availability toggle, current/next booking, care plan)
30. Booking requests list
31. Request detail (patient, condition, service, schedule, address, earning, accept/reject)
32. Reject reason sheet
33. Upcoming bookings list
34. Booking detail (patient, care notes, family contact, address, directions)
35. On my way → check-in (location check, start timer)
36. Active service (timer ring, care checklist with times, notes, family call)
37. Complete service (care summary, family OTP)
38. Availability calendar (weekly slots, leave days)
39. Services & rates (services offered, rate per shift/visit)
40. Earnings + transactions + payouts
41. Ratings & reviews
42. Profile (photo, experience, languages, skills, documents)
43. Settings

About 43 screens in total (the shared screens are built once).

## 5. Main flows

**Signup (both roles):** Splash → Phone → OTP → Role → Details → Documents → Pending. For the demo, this turns to approved after a few seconds; later the Master Admin KYC queue approves it.

**Vendor, normal order:**
1. Shop open → a simulated order arrives (sound, banner, 3-minute accept timer)
2. Accept → Packing checklist → mark packed
3. Ready → rider assigned → enter the handover OTP → Completed
4. The sale appears in Earnings

**Vendor, prescription order:** a new Rx order → open the prescription → search and add medicines with quantities → send the quote → (demo: the user "confirms" after a few seconds) → pack → hand over.

**Vendor, catalogue:** add a medicine → it appears in the list → toggle out of stock → low-stock alert on the dashboard when stock falls under the threshold.

**Caretaker booking:**
1. Available → a simulated request (patient, service, schedule, earning, 5-minute timer)
2. Accept → appears in Upcoming → "On my way" → check-in at the address (GPS distance check)
3. Active service: timer, tick care tasks, add notes
4. Complete: summary + family OTP → Completed → earnings + rating prompt to the family (demo: a rating arrives later)

**Caretaker availability:** set weekly slots and leave days → requests only arrive inside available slots (the simulator respects them).

Simulated in this build (labelled "Demo"): OTP, incoming orders and requests, user quote confirmation, rider assignment, GPS check-in, ratings, payouts, document approval.

## 6. Native features

| Need | Package (demo build) | Later (production) |
|---|---|---|
| New order / request alert | Bundled sound + `Vibration` + in-app banner | FCM high-priority push + notification channel with sound |
| Camera / gallery (documents, shop photo, Rx zoom) | `react-native-image-picker` | Upload to cloud storage |
| Image zoom for prescriptions | Pinch-zoom viewer (`react-native-gesture-handler` + `react-native-reanimated`, or a ready image viewer) | same |
| Location for caretaker check-in | `@react-native-community/geolocation` | same + backend geofence check |
| Keep the screen on during a shift | `@sayem314/react-native-keep-awake` | same |
| Date/time for availability and expiry dates | `@react-native-community/datetimepicker` | same |
| Permissions | `react-native-permissions` | same |
| Native splash | `react-native-bootsplash` | same |
| Push | — | `@react-native-firebase/messaging` |

Android permissions: `CAMERA`, `ACCESS_FINE_LOCATION`, `VIBRATE`, `WAKE_LOCK`; later `POST_NOTIFICATIONS`. Explain each one in-app before asking.

## 7. Shared package (new with this app)

> **Decision, 29 Oct 2026: not used.** The first attempt linked `packages/mobile-ui` into the app with a `file:` dependency plus a junction back to the app's `node_modules`. That created a folder loop, so Metro, Gradle autolinking, VS Code and OneDrive all walked it endlessly, and builds hung. The kit now lives inside the app at `partner-app/src/ui`, the same way `user-app` and `driver-app` keep their own copies. Revisit a shared package only with a proper workspace tool (npm workspaces with Metro's `watchFolders`), never with hand-made junctions.

With three native apps, copying the theme and UI kit becomes a maintenance risk. Before building this app, move the shared code into a local package:

```text
packages/mobile-ui/
  package.json            name: @lifeline/mobile-ui (private, "main": "src/index.ts")
  src/theme/              colours, service colours, fonts, radius, shadow
  src/components/         T, ui (Button, AppBar, ListRow, Chip, Field, BottomBar, Timeline…),
                          brand (LifelineMark, Fade, DuoIcon, DesignedMap, ProductThumb)
  src/screens/            CallScreen, NotificationsScreen, Help, Legal (props-driven)
  src/utils/format.ts
  assets/fonts/           Plus Jakarta Sans + OFL licence
```

- Each app adds `"@lifeline/mobile-ui": "file:../packages/mobile-ui"` and points Metro at it with `watchFolders` (combined with the existing subst fix).
- Move the User and Driver apps over to the package in a separate, small step after this app ships, checked with a release build of each.

## 8. Project setup

Folder: `partner-app/` at the repo root.

```bash
npx @react-native-community/cli@20.2.0 init Lifeline360Partner --version 0.87.1 \
  --package-name com.lifeline360.partner --directory partner-app --skip-git-init --pm npm --install-pods false
npm uninstall @react-native/new-app-screen && npm pkg set name=lifeline360-partner
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-screens react-native-svg lucide-react-native @react-native-async-storage/async-storage@2.2.0 \
  react-native-image-picker react-native-permissions @react-native-community/geolocation \
  @react-native-community/datetimepicker @sayem314/react-native-keep-awake ../packages/mobile-ui
```

Copy from `user-app/`: `metro.config.js` (add the package folder to `watchFolders`), `.eslintrc.js`, `gradle.properties` memory settings, the signing block + release guard (new keystore `lifeline360-partner-upload.keystore`), `scripts/generate-icons.py`, the fonts in `android/app/src/main/assets/fonts`.

App icon: the Lifeline mark on a **mint tile**, so partners can tell it apart from the User (white) and Driver (navy) apps.

## 9. Architecture

```text
partner-app/src/
  data/          sample pharmacy, catalogue (reuse the User app's medicine list), sample orders,
                 caretaker profile, sample patients, bookings, reviews, payouts
  store/         PartnerStore: session, role, profile, KYC status, open/available flag,
                 vendor (orders, catalogue, categories), caretaker (requests, bookings, availability),
                 transactions, ratings, settings — saved to AsyncStorage
  services/      orderSimulator (vendor), requestSimulator (caretaker, respects availability),
                 alertService (sound + vibration), locationService (check-in distance)
  navigation/    auth + KYC stack → role switch → VendorTabs | CaretakerTabs (+ modals for alerts)
  screens/
    shared/      splash, auth, role, kyc, pending, notifications, help, legal
    vendor/      dashboard, orders, order-detail, rx-review, packing, handover, catalogue,
                 medicine-form, categories, earnings, profile, settings
    caretaker/   today, requests, request-detail, bookings, booking-detail, check-in,
                 active-service, complete, availability, services, earnings, ratings, profile
```

Key behaviour:
- **Role decides navigation:** after approval, the root navigator mounts `VendorTabs` or `CaretakerTabs`. The two share nothing role-specific.
- **Two state machines:**
  - Order: `new → accepted → packing → ready → handed_over → delivered` (+ `rejected`, `quote_sent → quote_confirmed` for Rx).
  - Booking: `requested → accepted → on_the_way → checked_in → in_progress → completed` (+ `rejected`, `cancelled_by_user`).
- **Earnings derive from completed orders and bookings** (amount minus a commission placeholder), so totals always reconcile.
- **Catalogue stock is live in the store:** packing an order reduces stock; low-stock thresholds drive the dashboard alert.
- **Booking IDs match the User app** (`LL-M-xxxxx` for medicine, `LL-N-xxxxx` for nursing), and so do medicine names and service names, so the three apps can be shown side by side.

## 10. Build order and estimate

| Step | Work | Estimate |
|---|---|---|
| 1 | Confirm decisions (section 2) | 15 min |
| 2 | Add 9 boards to the canvas, get approval | 1–3 rounds |
| 3 | Create `packages/mobile-ui` from the User app's theme and kit | 1–2 h |
| 4 | Scaffold, keystore, mint icon, baseline release build | 1–2 h |
| 5 | Store, both simulators, navigation with the role switch | 2–3 h |
| 6 | Shared screens: auth, role, KYC, pending | 2–3 h |
| 7 | Vendor: dashboard, orders, order detail, packing, handover | 4–5 h |
| 8 | Vendor: Rx review + quote, catalogue, medicine form, categories | 3–4 h |
| 9 | Caretaker: today, requests, bookings, check-in, active service, complete | 4–5 h |
| 10 | Caretaker: availability calendar, services & rates, ratings | 2–3 h |
| 11 | Earnings/transactions (both), profiles, settings, help | 2–3 h |
| 12 | `tsc` / `eslint` / `jest`, release build, emulator walk-through of both roles, phone install | 2 h |

## 11. Verification

- Static: `npx tsc --noEmit`, `npx eslint src`, `npx jest`. Unit-test the order and booking state machines, earnings totals, stock changes after packing, and the simulator respecting availability.
- Build: `subst L:` → `L:\partner-app\android` → `gradlew assembleRelease`, then `apksigner verify --print-certs` must show the partner release key.
- Emulator walk-through with screenshots:
  1. Vendor: signup → approved → order arrives → accept → pack → handover OTP → earnings
  2. Vendor: Rx order → quote → confirmed → completed
  3. Vendor: add a medicine → toggle out of stock
  4. Log out → Caretaker: signup → set availability → request → accept → check-in → active service → complete with OTP → rating
- Real phone: alert sound and vibration, camera for documents, location permission. Install only with permission, always with `adb -s <serial>`.
- Three-app demo: place a medicine order and a nursing booking in the User app, then show the matching IDs and items in the Partner app.

## 12. Connecting to the backend later

- **Orders:** the user's checkout creates an order → routed to the nearest open vendor holding stock → push + socket event → accept within the time limit, otherwise reassigned. The Rx quote round-trips through the backend for the user to confirm and pay.
- **Bookings:** matched by service, skills, availability and distance → push to the caretaker → accept → the user sees the assigned caretaker.
- **Check-in:** a backend geofence verifies the location; completion requires the OTP sent to the family.
- **Settlements:** calculated from completed jobs using the admin's commission rules (Master Admin → Commission management).
- **KYC:** documents go to cloud storage; approval comes from the Master Admin KYC queue.

## 13. Risks

| Risk | Mitigation |
|---|---|
| Two roles make one app confusing | Role chosen once at signup; each role sees only its own tabs and colour accent |
| Vendors miss orders on a busy counter | Loud repeating alert until acknowledged + a visible acceptance timer |
| Prescription images hard to read | Pinch-zoom viewer, rotate, request a clearer photo from the user |
| Caretaker check-in spoofing | Backend geofence + family completion OTP |
| Shared package breaks the other apps | Move them over in a separate step, with a release build of each app before merging |
| Windows path limits | Same `subst` + Metro `watchFolders` fix |

## 14. After this

With the three mobile apps done, the remaining scope is web-first:
- **Blood Bank panel**, **Laboratory panel** and **Master Admin panel** (web). The canvas already has the Admin dashboard and Blood Bank boards.
- **Backend & APIs** connecting all apps: auth/OTP, bookings and orders, sockets for live status and location, payments, call masking, push notifications, cloud storage.

Plan them next in `docs/WEB-PANELS-PLAN.md` and `docs/BACKEND-PLAN.md`.
