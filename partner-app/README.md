# Lifeline 360 — Partner App (React Native CLI)

One app for the two partner types in the scope of work, with the role chosen at signup:

- **Medicine vendors (pharmacies):** receive orders, quote prescriptions, pack, hand over to Lifeline riders, manage the catalogue and stock, and track earnings.
- **Nurses / caretakers:** receive home-care booking requests, set weekly availability and rates, check in at the address, work through a care checklist, close the booking with the family's code, and track earnings and ratings.

Tech stack:
- React Native 0.87.1 (New Architecture, Hermes), TypeScript, React Navigation 7 (native stack + bottom tabs)
- `react-native-svg` and `lucide-react-native`, AsyncStorage, `@sayem314/react-native-keep-awake`
- Application ID `com.lifeline360.partner`, app name "Lifeline Partner" (Lifeline mark on a mint tile)

The plan this follows is [docs/PARTNER-APP-PLAN.md](../docs/PARTNER-APP-PLAN.md).

## Demo behaviour

Every screen works on local sample data. The store runs a 1-second tick that drives these demo behaviours:

| Behaviour | Demo build | Production |
|---|---|---|
| OTP | Any 6 digits | SMS gateway |
| KYC approval | Auto-approves 6 s after submitting ("Demo: approve now" link) | Master Admin KYC queue |
| New orders | One arrives every 45–75 s while the store is open; every third carries a prescription | Push + socket from the order router |
| Order alert | Full-screen alert, repeating vibration, accept timer (2/3/5 min, set in Settings); missed orders go to "Rejected · Missed" | FCM high-priority push |
| Prescription quote | Customer "confirms" 8 s after the quote is sent | Round-trip through the backend |
| Rider | Assigned 5 s after the order is packed; pickup code shown on screen | Rider app |
| Booking requests | One every 45–75 s while available, scheduled into the next open slot that isn't a leave day; 5 min to respond | Matching service |
| Check-in | Location check simulated (30–70 m, 200 m geofence) | GPS + backend geofence |
| Completion code | Shown on screen as "Demo completion code" | SMS to the family |
| Rating | Family rates 5 stars 20 s after completion | User app |
| Camera | Document photo capture is simulated | `react-native-image-picker` + cloud storage |

Demo logins: **98765 43210** (pharmacy) and **98450 11223** (caretaker); both are on the login screen. Logging out resets all demo data on the phone.

The seeded data lines up with the User app: order `LL-M-20417` from Sri Sai Medicals, booking `LL-N-07731` (Sunita Rao for K. Raghavan), the same medicine names and nursing services.

## Project layout

```text
partner-app/
  App.tsx                  SafeAreaProvider → PartnerStoreProvider → RootNavigator
  src/
    ui/                    Theme tokens, T, primitives (Button, AppBar, Field, Chip…), brand SVGs, charts
    components/partner.tsx TabHeader, Sheet, ReasonSheet, OtpBoxes, status pills, RxPaper, CaptureTile
    data/seed.ts           Pharmacy, caretaker, catalogue, documents, order/request generators, seed history
    store/
      types.ts             State, order and booking state machines
      PartnerStore.tsx     Pure reducer + tick (all demo timing), persistence, derived earnings
    navigation/            Stack + role tabs, alert watcher, status bar handling, onboarding routing
    screens/
      shared/              Splash, login, OTP, role, details, documents, pending, welcome,
                           earnings, transactions, notifications, masked call, profile, settings, help, legal
      vendor/              Orders dashboard, order alert, order detail, Rx quote, packing, handover,
                           history, catalogue, medicine form, categories
      caretaker/           Today, bookings, request alert, booking detail, check-in, active service,
                           complete, availability, services & rates, ratings
```

State machines:
- Order: `new → packing → ready → completed`, Rx orders `new → quote_sent → packing → …`, plus `rejected` (vendor reject or missed timer).
- Booking: `requested → accepted → on_the_way → in_progress → completed`, plus `declined` (declined or expired).

Earnings come from a ledger that each completed order or booking writes to (amount, Lifeline fee, net), so totals always add up. Packing an order reduces catalogue stock.

## Commands

```bash
npm install
npx tsc --noEmit && npx eslint src && npx jest
```

### Release APK (Windows)

The project path is too long for the Android NDK, so build from a `subst` drive:

```powershell
subst L: "C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360"
cd L:\partner-app\android
.\gradlew.bat assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`, copied to `release/Lifeline360-Partner-1.0.0.apk`. Only phone ABIs (`arm64-v8a`, `armeabi-v7a`) are built.

Signing reads `android/keystore.properties` and `android/app/lifeline360-partner-upload.keystore`. Both are gitignored, so back them up; a release build fails if they are missing rather than falling back to the debug key.
