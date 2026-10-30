# Lifeline 360 — Driver / Ambulance App (React Native CLI)

The commercial ambulance and emergency driver partner app for Lifeline 360: driver registration, KYC document verification, vehicle specifications, online/offline standby, high-priority emergency dispatch alerts (30s countdown), active turn-by-turn navigation (pickup & hospital routing), status transitions (arrived, patient on board, reached hospital), fare calculation, cash collection, and weekly earnings tracking.

- React Native 0.87.1 (New Architecture enabled, Hermes engine), TypeScript
- React Navigation 7 (native stack + custom bottom tab bar)
- `react-native-svg` + `lucide-react-native` for high-contrast vector navigation map, radar pulse, countdown timer, and icons
- AsyncStorage for local persistence of shift sessions, trips, transactions, and vehicle profile
- Application ID `com.lifeline360.driver`
- App Label: "Lifeline Driver" (Navy tile icon to distinguish from User app on device)

## Demo Build Status

Every screen and flow is functional end-to-end on **local sample data** (`src/data/sampleData.ts`).
The following integrations are simulated for standalone testing until production backend APIs are connected:

| Feature | In Demo Build | Production Target |
|---|---|---|
| OTP Authentication | Any 6-digit code accepted | SMS gateway / Firebase Auth |
| KYC Approval | Instant "Demo Activate" button | Master Admin KYC verification queue |
| Incoming Emergency Alert | One-tap dispatch simulation on Home | Socket.IO / FCM high-priority push |
| Emergency Countdown | Animated 30-sec SVG ring with sound & vibration | Foreground intent service |
| Route Navigation | Designed vector map with simulated moving vehicle | Google Maps SDK + live GPS tracking |
| Turn-by-Turn Guidance | Hand off to Google Maps navigation app via deep link | Embedded Navigation SDK / Maps app |
| Patient Calls | In-app secure masked-call UI | Telephony Call-Masking API |
| Earnings & Payouts | Instant simulated IMPS payout to HDFC bank | Bank payout gateway |

## Project Layout

```text
driver-app/
  App.tsx                 Providers: SafeAreaProvider → DriverStoreProvider → RootNavigator
  src/
    theme/index.ts        Teal + white design tokens + high-contrast Night navy palette
    components/
      T.tsx               Text component mapped to Plus Jakarta Sans weights
      ui.tsx              Button, AppBar, IconButton, Section, Card, ListRow, Field, Avatar, Badge
      driver-ui.tsx       SwipeToConfirm, CountdownRing, OnlineToggle, StatTile, BarChart
      brand.tsx           LifelineMark, Wordmark, Fade, DesignedMap (night & day vector navigation)
    data/sampleData.ts    Sample driver, vehicle specs, KYC documents, emergency calls, trips, earnings
    store/DriverStore.tsx State machine: IDLE → ACCEPTED → TO_PICKUP → ARRIVED → TO_HOSPITAL → REACHED → COMPLETED
    navigation/           RootNavigator (Auth stack, KYC stack, 4 bottom tabs, emergency modals)
    screens/
      auth/               SplashScreen, PhoneLoginScreen, OtpScreen
      kyc/                DriverDetailsScreen, VehicleDetailsScreen, DocumentListScreen, DocumentUploadScreen, KycPendingScreen, WelcomeApprovedScreen
      home/               HomeScreen (online toggle, shift stats, standby map, dispatch simulator)
      request/            IncomingRequestModal (30s timer, patient info, swipe to accept), DeclineSheet
      trip/               ActiveTripScreen (turn-by-turn route, live map, call, Google Maps deep link), TripCompleteModal
      trips/              TripsListScreen (filters: All, Today, Week), TripDetailScreen
      earnings/           EarningsScreen (weekly bar chart, incentives, transactions), PayoutsScreen
      profile/            ProfileScreen, VehicleProfileScreen, SettingsScreen, SosControlScreen, MaskedCallModal
  scripts/generate-icons.py   Generates navy tile launcher icons, foregrounds, and Play Store icon
  assets/
    fonts/                Plus Jakarta Sans (Regular, Medium, SemiBold, Bold, ExtraBold)
    brand/                Lifeline 360 brand assets & playstore-icon-512.png
  release/
    Lifeline360-Driver-1.0.0.apk  Release-signed APK for phones (ARM); add x86_64 to run on an emulator
```

## Run in Development

```bash
cd driver-app
npm install
npm start              # Metro bundler
npm run android        # Run on connected USB device or emulator
```

## Build the Signed Release APK (Windows)

Windows limits file paths to 260 characters and OneDrive paths exceed this limit during native C++ builds. Run from the mapped short drive `L:` using `cmd.exe`:

```cmd
subst L: "C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360"
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot"
cd /d L:\driver-app\android
.\gradlew.bat assembleRelease "-PreactNativeArchitectures=arm64-v8a,armeabi-v7a,x86_64"
```

The APK is written to `android/app/build/outputs/apk/release/app-release.apk` and copied to `release/Lifeline360-Driver-1.0.0.apk`.

### Release Signing
Release builds are signed with `android/app/lifeline360-driver-upload.keystore` using credentials from `android/keystore.properties` (kept out of version control).
Certificate details:
- **Alias:** `lifeline360-driver-upload`
- **Owner:** `CN=Lifeline 360 Driver, O=Lifeline 360, C=IN`
- **Guarded:** If `keystore.properties` is missing, release builds immediately halt rather than defaulting to debug keys.

> **CRITICAL:** Back up `android/app/lifeline360-driver-upload.keystore` and `android/keystore.properties` in a secure location. Every future Play Store update must be signed with this exact key.

## Verification

- **TypeScript check:** `npx tsc --noEmit` (0 errors)
- **ESLint:** `npx eslint src App.tsx` (0 errors)
- **Signature verification:** `apksigner verify --print-certs release/Lifeline360-Driver-1.0.0.apk`
- **Badging check:** `aapt2 dump badging release/Lifeline360-Driver-1.0.0.apk` (Package `com.lifeline360.driver`, version 1.0.0, SDK target 36)

## Demo behaviour

- First launch goes through phone login → OTP (any 6 digits) → personal and vehicle details → 6 KYC documents → verification. Approval is simulated after about 6 seconds.
- While online and free, an emergency request arrives on its own after 8–15 seconds ("Send now" on Home sends one immediately). Unanswered requests expire after 30 seconds.
- Accepting starts the drive to pickup with a live ETA; each swipe moves the trip on: arrived → patient on board (drive to hospital) → reached → trip summary.
- Earnings, trips, online time and acceptance rate are calculated from the session; older history is sample data.
- Sample data is set in Bengaluru and matches the User app (driver Imran Pasha, KA 01 AB 4521, Manipal Hospital) so both apps can be demoed together.
- Session, KYC, online status and an in-progress trip survive app restarts.
