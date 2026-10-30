# Technical Specification & Architecture Mining Report: Lifeline Partner App

**Document Version:** 1.0.0  
**Date:** 2026-10-29  
**Target Application:** Lifeline Partner Native Android App (`partner-app/`)  
**Package Name:** `com.lifeline360.partner`  
**Application Label:** "Lifeline Partner"  
**Authoritative Sources:**
- `docs/NATIVE-APP-PLAYBOOK.md`
- `docs/PARTNER-APP-PLAN.md`
- `.agents/teamwork/ORIGINAL_REQUEST.md`
- Existing implementations in `user-app/` and `driver-app/`

---

## Executive Summary

The **Lifeline Partner app** is the third native mobile application in the Lifeline 360 healthcare ecosystem, succeeding the **User app** (`user-app/`) and the **Driver/Ambulance app** (`driver-app/`). It is engineered as a unified capability showcase serving two distinct partner roles via strict role-based access:
1. **Medicine Vendors (Pharmacies):** Manage shop status, process incoming medicine orders with packing checklists, assemble quotes for user-uploaded prescriptions, manage product catalogue & inventory, and track retail earnings.
2. **Nursing & Caretaker Partners:** Manage weekly slot availability and leave calendars, accept home-care requests, execute on-site care with GPS check-in and shift checklists, conclude shifts with family OTP verification, and track service earnings.

To prevent duplicated UI code across three native mobile apps, this project introduces `packages/mobile-ui` (`@lifeline/mobile-ui`) as a local monorepo package extracted from `user-app/`. The project requires a complete native Android build producing a cryptographically verified signed release APK.

---

## 1. Native Android Project Requirements

### 1.1 Directory Structure (`partner-app/android`)
The native Android project must follow standard React Native CLI conventions (0.87.1):
```text
partner-app/
├── App.tsx                               # Root providers: SafeAreaProvider -> PartnerStoreProvider -> RootNavigator
├── app.json                              # {"name": "Lifeline360Partner", "displayName": "Lifeline Partner"}
├── babel.config.js                       # presets: ['module:@react-native/babel-preset']
├── index.js                              # AppRegistry.registerComponent("Lifeline360Partner", () => App)
├── jest.config.js                        # preset: '@react-native/jest-preset'
├── metro.config.js                       # Custom Metro config watching subst & real root + packages/mobile-ui
├── package.json                          # Dependencies + local package @lifeline/mobile-ui
├── tsconfig.json                         # Extends @react-native/typescript-config
├── .eslintrc.js                          # Extends @react-native, inline-styles off
├── scripts/
│   └── generate-icons.py                 # Pillow script generating mint tile launcher icons
├── assets/
│   ├── fonts/                            # PlusJakartaSans-(Regular|Medium|SemiBold|Bold|ExtraBold).ttf + OFL.txt
│   └── brand/                            # logo-full.png, logo-mark.png, playstore-icon-512.png
├── release/
│   └── Lifeline360-Partner-1.0.0.apk     # Distributable signed release APK
└── android/
    ├── build.gradle                      # Root buildscript (compileSdk 37, targetSdk 36, minSdk 24, Kotlin 2.2.0, NDK 27.1.12297006)
    ├── gradle.properties                 # jvmargs=-Xmx1536m, workers.max=1, parallel=false, newArchEnabled=true, hermesEnabled=true
    ├── settings.gradle                   # rootProject.name = 'com.lifeline360.partner', include ':app'
    ├── keystore.properties               # Release keystore secrets (git-ignored)
    └── app/
        ├── build.gradle                  # App Gradle script with release signing block & Release Guard
        ├── debug.keystore                # Android debug keystore
        ├── lifeline360-partner-upload.keystore # Production upload keystore
        ├── proguard-rules.pro
        └── src/main/
            ├── AndroidManifest.xml       # Package namespace, permissions, MainActivity declaration
            ├── assets/fonts/             # Static Plus Jakarta Sans font files
            ├── java/com/lifeline360/partner/ (or java/com/com.lifeline360.partner/)
            │   ├── MainActivity.kt       # ReactActivity with getMainComponentName() = "Lifeline360Partner"
            │   └── MainApplication.kt   # ReactApplication with DefaultReactHost & TurboModules
            └── res/
                ├── values/
                │   ├── strings.xml       # <string name="app_name">Lifeline Partner</string>
                │   ├── styles.xml        # Theme.AppCompat.Light.NoActionBar (light-only)
                │   └── colors.xml        # Splash & tile colors
                ├── mipmap-anydpi-v26/
                │   └── ic_launcher.xml   # Adaptive icon XML referencing background color & foreground drawable
                ├── mipmap-mdpi/          # 48x48 launcher icons, 108x108 adaptive foreground
                ├── mipmap-hdpi/          # 72x72 launcher icons, 162x162 adaptive foreground
                ├── mipmap-xhdpi/         # 96x96 launcher icons, 216x216 adaptive foreground
                ├── mipmap-xxhdpi/        # 144x144 launcher icons, 324x324 adaptive foreground
                └── mipmap-xxxhdpi/       # 192x192 launcher icons, 432x432 adaptive foreground
```

### 1.2 Package & Identity Specifications
- **Android Package / Namespace:** `com.lifeline360.partner`
- **Application ID:** `com.lifeline360.partner`
- **Application Label:** `Lifeline Partner`
- **Component Registration Name:** `Lifeline360Partner`
- **Orientation:** Fixed portrait (`android:screenOrientation="portrait"`)
- **Theme:** Strict light mode (`Theme.AppCompat.Light.NoActionBar`), `android:windowBackground` white.
- **SDK & NDK Levels:**
  - `compileSdkVersion`: 37
  - `targetSdkVersion`: 36
  - `minSdkVersion`: 24 (Android 7.0+)
  - `buildToolsVersion`: "37.0.0" (or "36.0.0")
  - `ndkVersion`: "27.1.12297006"
  - `kotlinVersion`: "2.2.0"
- **Required Android Permissions (`AndroidManifest.xml`):**
  - `android.permission.INTERNET`
  - `android.permission.CAMERA` (document upload, shop photo, prescription zoom)
  - `android.permission.ACCESS_FINE_LOCATION` (caretaker on-site GPS check-in)
  - `android.permission.ACCESS_COARSE_LOCATION`
  - `android.permission.VIBRATE` (high-urgency order and booking alert vibration)
  - `android.permission.WAKE_LOCK` (keep screen awake during active caretaker shift)

### 1.3 App Icon Generation & Asset Specifications
- **Brand Tile Concept:** The Lifeline 4-petal mark rendered on a **mint tile** (`#E2F5EA` / `colors.service.medicine.bg`) to visually distinguish it on device launchers from the User app (white tile) and Driver app (navy tile).
- **Icon Assets Built by `partner-app/scripts/generate-icons.py`:**
  - `ic_launcher.png`: Legacy rounded square (mask radius ~22%)
  - `ic_launcher_round.png`: Legacy circular launcher icon
  - `ic_launcher_foreground.png`: Adaptive icon foreground (mark scaled to exactly 58% of the 108dp canvas so petal tips stay within the guaranteed safe 66dp circular mask)
  - `playstore-icon-512.png`: 512x512 high-resolution icon on mint tile for Google Play Store
  - `logo-mark.png`: 600x600 mark for splash screen and auth screens
- **Icon Densities:**
  - mdpi (1x): 48px base, 108px foreground
  - hdpi (1.5x): 72px base, 162px foreground
  - xhdpi (2x): 96px base, 216px foreground
  - xxhdpi (3x): 144px base, 324px foreground
  - xxxhdpi (4x): 192px base, 432px foreground

---

## 2. Build and Release Signing Specifications

### 2.1 Dedicated Release Keystore
The partner app must be signed with its own dedicated upload keystore (NOT the debug key, and NOT the user or driver keystores):
- **Keystore File:** `partner-app/android/app/lifeline360-partner-upload.keystore`
- **Key Alias:** `lifeline360-partner-upload`
- **Key Algorithm:** RSA 2048-bit, PKCS12 storetype, 10,000 days validity (~27 years)
- **Distinguished Name (DN):** `CN=Lifeline 360 Partner, O=Lifeline 360, C=IN`
- **Keytool Generation Command:**
  ```powershell
  $PW = "LfPart938Vz2mQ6w2026!" # Example secure passphrase
  & "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot\bin\keytool.exe" -genkeypair -v `
    -storetype PKCS12 `
    -keystore "partner-app/android/app/lifeline360-partner-upload.keystore" `
    -alias lifeline360-partner-upload `
    -keyalg RSA -keysize 2048 -validity 10000 `
    -storepass $PW -keypass $PW `
    -dname "CN=Lifeline 360 Partner, O=Lifeline 360, C=IN"
  ```

### 2.2 Keystore Properties Configuration
- **File:** `partner-app/android/keystore.properties` (git-ignored)
- **Contents:**
  ```properties
  storeFile=lifeline360-partner-upload.keystore
  keyAlias=lifeline360-partner-upload
  storePassword=LfPart938Vz2mQ6w2026!
  keyPassword=LfPart938Vz2mQ6w2026!
  ```
- *Note:* In `app/build.gradle`, `storeFile file(keystoreProps['storeFile'])` resolves relative to the `app/` folder, which is why `storeFile` is specified as `lifeline360-partner-upload.keystore`.

### 2.3 Gradle Release Guard (`app/build.gradle`)
To guarantee that a release APK is never built with the default Android debug certificate or unsigned if credentials are missing:
```groovy
def keystoreProps = new Properties()
def keystorePropsFile = rootProject.file("keystore.properties")
if (keystorePropsFile.exists()) {
    keystorePropsFile.withInputStream { keystoreProps.load(it) }
}

android {
    ...
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        if (keystorePropsFile.exists()) {
            release {
                storeFile file(keystoreProps['storeFile'])
                storePassword keystoreProps['storePassword']
                keyAlias keystoreProps['keyAlias']
                keyPassword keystoreProps['keyPassword']
            }
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig keystorePropsFile.exists() ? signingConfigs.release : signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }
}

// Release Guard: Fail release build immediately if keystore.properties is missing
gradle.taskGraph.whenReady { graph ->
    def releaseTask = graph.allTasks.any { t ->
        (t.name.startsWith('assemble') || t.name.startsWith('bundle')) && t.name.toLowerCase().contains('release')
    }
    if (releaseTask && !keystorePropsFile.exists()) {
        throw new GradleException("Release signing is not set up: ${keystorePropsFile} is missing. Please create keystore.properties before building a release.")
    }
}
```

### 2.4 Windows 260-Character Path Workaround (`subst L:`)
Because native C++ compilation (CMake / Ninja / React Native Codegen) exceeds the Windows 260-character MAX_PATH limit when nested in OneDrive, the workspace must be mounted to a short virtual drive:
```cmd
subst L: "C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360"
```
*(Verified: Drive `L:` is currently active and mapped to `C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360`)*.

### 2.5 Gradle Release Build Command
Build execution must run under JDK 17 (`C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot`) targeting all common ABIs (`arm64-v8a`, `armeabi-v7a`, `x86_64`):
```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot"
cd L:\partner-app\android
.\gradlew.bat assembleRelease "-PreactNativeArchitectures=arm64-v8a,armeabi-v7a,x86_64"
.\gradlew.bat --stop
```

### 2.6 Release Artifact Verification Specifications
1. **Output APK Paths:**
   - Gradle build output: `partner-app/android/app/build/outputs/apk/release/app-release.apk`
   - Shipped release output: `partner-app/release/Lifeline360-Partner-1.0.0.apk`
2. **`apksigner verify --print-certs` Requirement:**
   - Command:
     ```powershell
     & "C:\Android\build-tools\36.0.0\apksigner.bat" verify --print-certs "partner-app/release/Lifeline360-Partner-1.0.0.apk"
     ```
   - Must output:
     ```text
     Signer #1 certificate DN: CN=Lifeline 360 Partner, O=Lifeline 360, C=IN
     ```
   - Rejection condition: Any mention of `CN=Android Debug` or verification failure.
3. **`aapt2 dump badging` Requirement:**
   - Command:
     ```powershell
     & "C:\Android\build-tools\36.0.0\aapt2.exe" dump badging "partner-app/release/Lifeline360-Partner-1.0.0.apk"
     ```
   - Must confirm:
     - `package: name='com.lifeline360.partner' versionCode='1' versionName='1.0.0'`
     - `application-label:'Lifeline Partner'`
     - `targetSdkVersion:'36'`

---

## 3. Shared `packages/mobile-ui` Package Requirements

### 3.1 Motivation & Architectural Role
As specified in `docs/PARTNER-APP-PLAN.md` §7, copying UI and theme files across User, Driver, and Partner apps introduces severe code fragmentation. `packages/mobile-ui` centralizes design tokens, core primitive components, brand graphics, shared screens, and utility formatters into a single reusable workspace package.

### 3.2 Monorepo Layout (`packages/mobile-ui/`)
```text
packages/mobile-ui/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                          # Main barrel re-exporting theme, components, screens, utils
│   ├── theme/
│   │   ├── index.ts                      # colors, service, font, radius, shadow, ServiceKey, FontWeight
│   │   └── tokens.ts
│   ├── components/
│   │   ├── index.ts
│   │   ├── T.tsx                         # Text component with Plus Jakarta Sans weight mapping
│   │   ├── ui.tsx                        # Button, AppBar, IconButton, Section, Card, Divider, Gap,
│   │   │                                 # ListRow, InfoRow, Chip, Badge, StatusBadge, ServiceBadge,
│   │   │                                 # Rating, Segmented, Toggle, RadioDot, CheckBox, Field,
│   │   │                                 # Avatar, BottomBar, Timeline, EmptyState
│   │   └── brand.tsx                     # LifelineMark, Wordmark, Fade, DuoIcon, ProductThumb, DesignedMap
│   ├── screens/
│   │   ├── index.ts
│   │   ├── CallScreen.tsx                # Secure line call screen with timer, mute, speaker, end call
│   │   ├── NotificationsScreen.tsx       # Props-driven notifications list with read status
│   │   ├── HelpScreen.tsx                # FAQs list, contact tiles, complaint launcher
│   │   └── LegalScreen.tsx               # Terms & conditions, privacy policy, about
│   └── utils/
│       ├── index.ts
│       └── format.ts                     # rupees(), greeting(), timeAgo(), firstName(), maskPhone()
└── assets/
    └── fonts/                            # Plus Jakarta Sans static TTF files and OFL licence
```

### 3.3 `package.json` for `packages/mobile-ui`
```json
{
  "name": "@lifeline/mobile-ui",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "@react-navigation/native": "^7.5.1",
    "lucide-react-native": "^1.63.0",
    "react": "19.2.3",
    "react-native": "0.87.1",
    "react-native-safe-area-context": "^5.5.2",
    "react-native-screens": "^4.30.1",
    "react-native-svg": "^15.16.0"
  }
}
```

### 3.4 Integration in `partner-app/package.json`
`partner-app` declares the local package dependency via `file:` protocol:
```json
"dependencies": {
  "@lifeline/mobile-ui": "file:../packages/mobile-ui",
  ...
}
```

### 3.5 Metro Bundler Configuration (`partner-app/metro.config.js`)
When using `file:../packages/mobile-ui` combined with Windows drive substitution (`subst L:`), Metro must be configured to watch the physical directory paths as well as the virtual drive paths to avoid `Failed to get the SHA-1` errors:
```javascript
const path = require('path');
const fs = require('fs');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const realRoot = fs.realpathSync.native(__dirname);
const mobileUiRoot = path.resolve(__dirname, '../packages/mobile-ui');
const realMobileUi = fs.existsSync(mobileUiRoot) ? fs.realpathSync.native(mobileUiRoot) : mobileUiRoot;

const watchFolders = [
  ...(realRoot.toLowerCase() !== __dirname.toLowerCase() ? [realRoot] : []),
  mobileUiRoot,
  ...(realMobileUi.toLowerCase() !== mobileUiRoot.toLowerCase() ? [realMobileUi] : []),
];

const config = {
  watchFolders,
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(mobileUiRoot, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

---

## 4. Static Checks, Quality & Testing Specifications

### 4.1 TypeScript Compilation
- **Command:** `npx tsc --noEmit`
- **Pass Criteria:** Zero errors (`Exit code 0`).
- **Configuration:** `tsconfig.json` extends `@react-native/typescript-config`.
- **Known Pitfalls:**
  - `StatusBar` props `backgroundColor` and `translucent` were removed in edge-to-edge React Native 0.87.
  - `TextInput` refs must be typed as `useRef<React.ComponentRef<typeof TextInput>>(null)`.
  - Icon names in `lucide-react-native` must match installed export types (e.g. `House` instead of `Home`, `CircleHelp` instead of `HelpCircle`).

### 4.2 ESLint
- **Command:** `npx eslint src` (and `npx eslint src App.tsx`)
- **Pass Criteria:** Zero errors (`Exit code 0`).
- **Configuration (`.eslintrc.js`):**
  ```javascript
  module.exports = {
    root: true,
    extends: '@react-native',
    rules: {
      'react-native/no-inline-styles': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  };
  ```

### 4.3 Jest Automated Unit Testing
- **Command:** `npx jest`
- **Preset:** `@react-native/jest-preset`
- **AsyncStorage Mocking:** Must configure `@react-native-async-storage/async-storage/jest/async-storage-mock`
- **Required Test Suites & Logic:**
  1. **Order State Machine Transitions:**
     - `new -> accepted -> packing -> ready -> handed_over -> completed`
     - Reject transitions: `new -> rejected`
     - Prescription quote transitions: `new -> quote_sent -> quote_confirmed -> packing ...`
  2. **Booking State Machine Transitions:**
     - `requested -> accepted -> on_the_way -> checked_in -> in_progress -> completed`
     - Rejection: `requested -> rejected`
     - Cancellation: `requested -> cancelled_by_user`
  3. **Earnings Calculations:**
     - Vendor order gross total, platform commission deduction (e.g. 15%), net vendor payout.
     - Caretaker shift gross rate, platform commission deduction (e.g. 20%), net caretaker payout.
     - Transaction summary ledger balance updates accurately.
  4. **Simulator Availability Filtering:**
     - Caretaker request simulator must verify scheduled weekly availability slots and leave dates.
     - Requests must NOT generate when caretaker is marked "offline" or during leave dates.
  5. **Catalogue Stock Updates:**
     - Deducting item quantity on packing confirmation.
     - Threshold evaluation triggering low-stock alert when quantity <= 5.

---

## 5. Development Integrity Mode & Constraints

### 5.1 Integrity Mode: `development`
Per `ORIGINAL_REQUEST.md` line 8, the app operates in `development` integrity mode:
- **Transparent Honesty:** Any simulated service is explicitly flagged in the UI:
  - Phone OTP: "Demo build: any 6-digit code works"
  - KYC Document Approval: "Demo build: instant approval button"
  - Simulated Orders/Requests: Distinct "Simulate Order" / "Simulate Booking" controls or realistic auto-generation timers
  - Payment & Bank Payouts: "Demo IMPS payout (no real funds transferred)"
- **Realistic Seed Data:** On first launch, the local store seeds realistic sample pharmacy products, active bookings, recent earnings history, and reviews so screens are immediately demonstrable.

### 5.2 Environment & Build Constraints
- **OS Platform:** Windows 11 with PowerShell / CMD.
- **Node.js:** v22.13.1 (must be >= 22.11.0).
- **JDK:** OpenJDK 17.0.13 (`C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot`).
- **Android SDK:** `C:\Android` with Build Tools 36.0.0 / 37.0.0 and Platform Android 36 / 37.
- **Android NDK:** `27.1.12297006`.
- **Gradle JVM Daemon Memory:** Restricted to `jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=512m` with `workers.max=1` to prevent memory thrashing.

---

## 6. Functional Architecture & Screen Specifications

### 6.1 Role Isolation & Navigation
A single partner account has exactly one role (`Medicine Vendor` or `Nurse/Caretaker`) selected at signup. The root navigator renders:
- **Unauthenticated / Onboarding Stack:**
  - `Splash` -> `PhoneLogin` -> `Otp` -> `RoleSelection` -> `ProfileSetup` -> `KycDocumentList` -> `KycDocumentUpload` -> `KycPending` -> `WelcomeApproved`
- **Authenticated Vendor Stack (Mint Accent `#1A8A57` / `#E2F5EA`):**
  - Tab 1: **Orders** (Dashboard, Order Alerts, Order Detail, Packing Checklist, Rider Handover OTP, Rx Quote Builder)
  - Tab 2: **Catalogue** (Product Search, Category Filter, Add/Edit Medicine, Stock Toggles)
  - Tab 3: **Earnings** (Daily/Weekly Metrics, Bar Chart, Transaction History, Bank Settlement)
  - Tab 4: **Profile** (Pharmacy Details, Operating Hours, Licence Info, Settings, Help & Support)
- **Authenticated Caretaker Stack (Lavender Accent `#6F5BC9` / `#ECE9FB`):**
  - Tab 1: **Today** (Online Toggle, Next Booking Card, Quick Shift Status, Active Service Launcher)
  - Tab 2: **Requests** (Incoming Request Alerts, Countdown Timer, Request Detail, Reject Sheet, Upcoming Shifts)
  - Tab 3: **Earnings** (Shift Earnings, Weekly Summary, IMPS Payouts, Transaction History)
  - Tab 4: **Profile** (Caretaker Bio, Qualifications, Availability Calendar, Services & Rates, Reviews)

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Auth & Onboarding | Phone Number Login | Input 10-digit mobile number with +91 country prefix | Mobile number string (10 digits) | Advances to OTP verification screen | Validates 10-digit format; blocks invalid input | `PARTNER-APP-PLAN.md` §4 |
| 2 | Auth & Onboarding | OTP Verification | Verification of 6-digit one-time password | 6-digit OTP code | Authenticates user into session | In demo mode, any 6 digits pass; empty fails | `PARTNER-APP-PLAN.md` §5 |
| 3 | Auth & Onboarding | Role Selection | Choice between Medicine Vendor and Nurse/Caretaker | Role selection ('vendor' \| 'caretaker') | Permanently sets account role in store | Cannot proceed without role selection | `ORIGINAL_REQUEST.md` R1 |
| 4 | KYC Verification | Vendor Document Checklist | Displays status of Drug Licence, GST, Pharmacist Cert, Shop Photo, ID | Document items array with status | Navigates to individual document uploader | Highlights missing/expired documents | `PARTNER-APP-PLAN.md` §1 |
| 5 | KYC Verification | Caretaker Document Checklist | Displays status of Govt ID, Nursing Cert (GNM/ANM/BSc), Police Verification, Photo | Document items array with status | Navigates to document uploader | Highlights unuploaded documents | `PARTNER-APP-PLAN.md` §1 |
| 6 | KYC Verification | Document Capture / Upload | Upload document image with document number and expiry | Image URI, document number, expiry date | Stores document record in KYC state | Requires valid document number and non-empty image | `PARTNER-APP-PLAN.md` §4 |
| 7 | KYC Verification | Verification Pending Screen | Status screen explaining verification queue with demo instant approve | "Demo Activate" button press | Transitions KYC status to `approved` | N/A | `PARTNER-APP-PLAN.md` §5 |
| 8 | Medicine Vendor | Store Status Toggle | Open/Closed switch on vendor dashboard | Boolean toggle | Sets store online/offline for orders | If offline, simulated incoming orders pause | `ORIGINAL_REQUEST.md` R2 |
| 9 | Medicine Vendor | Incoming Order Alert | Sound + vibration modal with 3-minute acceptance countdown | Simulated order object | Plays alert; displays timer and items preview | Auto-rejects / expires after 3 minutes | `PARTNER-APP-PLAN.md` §5 |
| 10 | Medicine Vendor | Order Acceptance & Rejection | Accept order into packing or reject with reason | Action ('accept' \| 'reject'), reason code | Advances state to `packing` or `rejected` | Requires reason string if rejected | `PARTNER-APP-PLAN.md` §4 |
| 11 | Medicine Vendor | Packing Checklist | Tick off each prescribed medicine item and quantity | Item IDs ticked | Enables "Mark Packed" button | Blocks packing until all items ticked/substituted | `PARTNER-APP-PLAN.md` §4 |
| 12 | Medicine Vendor | Item Substitution | Suggest alternative medicine for out-of-stock items | Original item ID, substitute item details | Updates order line item | Requires substitute medicine selection | `PARTNER-APP-PLAN.md` §4 |
| 13 | Medicine Vendor | Rider Handover OTP | Rider verification code entry to confirm medicine dispatch | 4-digit handover OTP code | Transitions order to `handed_over` / `completed` | Incorrect OTP shows error and halts handover | `ORIGINAL_REQUEST.md` R2 |
| 14 | Medicine Vendor | Prescription Review | High-resolution viewer with pinch-zoom for user prescriptions | Prescription image asset | Displays image with zoom & pan controls | Fallback if image fails to load | `PARTNER-APP-PLAN.md` §6 |
| 15 | Medicine Vendor | Prescription Quote Builder | Search catalogue, add items & quantities, calculate total | Selected medicine items, quantities | Builds itemized bill & sends quote to user | Requires at least 1 item before sending | `ORIGINAL_REQUEST.md` R2 |
| 16 | Medicine Vendor | Simulated Quote Acceptance | Simulates user reviewing and accepting vendor quote | Quote ID | Advances Rx order to `confirmed` -> `packing` | N/A | `PARTNER-APP-PLAN.md` §5 |
| 17 | Medicine Vendor | Catalogue Management | Browse, search, filter medicines by category | Query string, category filter | Filtered list of medicine items | Displays empty state if no matches | `ORIGINAL_REQUEST.md` R2 |
| 18 | Medicine Vendor | Add/Edit Medicine Item | Form to add or modify medicine name, MRP, price, stock | Name, maker, pack, MRP, price, stock, Rx flag | Saves item to inventory store | Validates non-empty name, price > 0 | `PARTNER-APP-PLAN.md` §4 |
| 19 | Medicine Vendor | Stock Availability Toggle | Quick toggle to mark medicine in-stock or out-of-stock | Item ID, boolean stock status | Updates availability in catalogue immediately | N/A | `ORIGINAL_REQUEST.md` R2 |
| 20 | Medicine Vendor | Low-Stock Alerts | Dashboard banner alerting vendor when item inventory is low | Inventory count <= threshold (5) | Renders warning banner on dashboard | Re-evaluates on stock change / packing | `ORIGINAL_REQUEST.md` R2 |
| 21 | Caretaker | Availability Calendar | Set weekly recurring slots (Morning, Afternoon, Night) | Day of week, slot checkboxes | Saves availability pattern to store | Cannot uncheck all slots without going offline | `ORIGINAL_REQUEST.md` R3 |
| 22 | Caretaker | Leave Calendar | Mark specific calendar dates as unavailable/leave | Date selection | Stores leave dates array | Simulator ignores leave days | `ORIGINAL_REQUEST.md` R3 |
| 23 | Caretaker | Incoming Booking Alert | Sound + vibration modal with 5-minute acceptance timer | Simulated booking object | Displays patient condition, timing, earnings | Auto-declines after 5 minutes | `PARTNER-APP-PLAN.md` §5 |
| 24 | Caretaker | Booking Acceptance / Decline | Accept booking into upcoming or decline with reason | Action, decline reason | Advances booking to `accepted` or `rejected` | Requires reason if declined | `PARTNER-APP-PLAN.md` §4 |
| 25 | Caretaker | "On My Way" Transition | Caretaker signals departure to patient home | Booking ID | Status becomes `on_the_way`, reveals address | Can only start on scheduled shift day | `PARTNER-APP-PLAN.md` §5 |
| 26 | Caretaker | GPS Check-in | On-site location verification at patient home address | Geolocation coordinates | Transitions booking to `checked_in`, starts timer | Prompts if distance > 200m; demo bypass | `ORIGINAL_REQUEST.md` R3 |
| 27 | Caretaker | Active Shift Care Checklist | Interactive list of scheduled tasks (vitals, meds, hygiene) | Task checkboxes, notes string | Updates care execution logs | None | `ORIGINAL_REQUEST.md` R3 |
| 28 | Caretaker | Active Shift Timer & Keep-Awake | Real-time shift duration stopwatch keeping display active | Timer start timestamp | Active duration display (`HH:MM:SS`) | Graceful timer recovery on app background | `PARTNER-APP-PLAN.md` §6 |
| 29 | Caretaker | Family Completion OTP | 4-digit code entered from patient's family to close shift | 4-digit OTP code | Marks booking `completed`, unlocks payout | Rejects invalid OTP | `ORIGINAL_REQUEST.md` R3 |
| 30 | Caretaker | Care Summary Report | Post-shift summary notes on patient vitals and activities | Summary text, vitals values | Attaches summary report to completed booking | Requires non-empty summary | `PARTNER-APP-PLAN.md` §5 |
| 31 | Caretaker | Ratings & Reviews | Displays aggregate star rating and individual family feedback | Review objects in store | Renders average rating, distribution, review cards | Displays empty state if no reviews | `ORIGINAL_REQUEST.md` R3 |
| 32 | Caretaker | Services & Rates Management | Configure offered care categories and hourly/daily rates | Service IDs, custom hourly/shift rates | Updates services catalog for caretaker | Validates rates > 0 | `PARTNER-APP-PLAN.md` §4 |
| 33 | Shared Foundation | Earnings Overview | Summary cards for today's, weekly, and monthly earnings | Completed orders/bookings in store | Total sales, commissions, net payable | Totals reconcile with completed jobs | `ORIGINAL_REQUEST.md` R1 |
| 34 | Shared Foundation | Transaction History | Filterable ledger of credits, commissions, and payouts | Ledger filter ('all' \| 'credit' \| 'payout') | List of transaction entries | Displays empty state if none | `PARTNER-APP-PLAN.md` §4 |
| 35 | Shared Foundation | Masked Telephony Call | In-app secure call screen hiding real phone numbers | Call participant name, role, avatar | Full-screen call UI with timer & audio controls | Ends call and navigates back | `PARTNER-APP-PLAN.md` §4 |
| 36 | Shared Foundation | Notifications Screen | In-app notification feed with read markers | Notification items array | Displays unread indicators and timestamps | Auto-marks read after delay | `docs/NATIVE-APP-PLAYBOOK.md` §5 |
| 37 | Shared Foundation | Help & Support FAQ | Collapsible FAQs and contact options | Tap on FAQ item | Toggles question accordion | None | `docs/NATIVE-APP-PLAYBOOK.md` §5 |
| 38 | Shared Foundation | Legal Documents Viewer | Viewer for Terms of Service, Privacy Policy, About Us | Document route parameter ('terms' \| 'privacy') | Formatted legal content with version info | Fallback to default document | `docs/NATIVE-APP-PLAYBOOK.md` §5 |
| 39 | Native Integration | Custom App Icon Generator | Python PIL script generating density-specific mipmap icons | `assets/brand/logo-full.png` | `mipmap-*/ic_launcher*.png` on mint tile | Fails if PIL or source image is missing | `docs/NATIVE-APP-PLAYBOOK.md` §4.6 |
| 40 | Native Integration | Release Guard in Gradle | Gradle task execution hook enforcing release keystore presence | Gradle task graph containing 'release' | Halts build if `keystore.properties` is missing | Throws GradleException | `docs/NATIVE-APP-PLAYBOOK.md` §4.7 |
| 41 | Native Integration | Windows Subst Drive Support | Metro watcher and project layout accommodating drive `L:` | Root directory path | Watches both subst and real Windows paths | Fails SHA-1 hash if real paths unwatched | `docs/NATIVE-APP-PLAYBOOK.md` §4.8 |
| 42 | Shared Package | `@lifeline/mobile-ui` Setup | Monorepo package extraction of theme, T, ui, brand, utils | Local package in `packages/mobile-ui` | Shared module consumed by partner-app | Packaging error if paths misconfigured | `PARTNER-APP-PLAN.md` §7 |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Release Build Signing | `assembleRelease` executed without `keystore.properties` | Release Guard intercepts task graph: throws `GradleException: Release signing is not set up: keystore.properties is missing.` Build terminates immediately without using debug key. |
| 2 | Release Build Signing | `assembleRelease` executed with `keystore.properties` present | Gradle loads keystore credentials, signs APK with `lifeline360-partner-upload.keystore`, and outputs verified APK. |
| 3 | Certificate Verification | `apksigner verify --print-certs app-release.apk` | Verifies certificate chain. Displays `CN=Lifeline 360 Partner, O=Lifeline 360, C=IN`. Rejects if debug certificate detected. |
| 4 | Badging Verification | `aapt2 dump badging app-release.apk` | Confirms `package: name='com.lifeline360.partner'`, `application-label:'Lifeline Partner'`, and `targetSdkVersion:'36'`. |
| 5 | Order Acceptance Timer | Vendor does not respond within 3 minutes (180s) | Timer expires: order automatically dismisses, transitions to `rejected` (reason: "Vendor timeout"), and removes alert banner. |
| 6 | Caretaker Request Timer | Caretaker does not respond within 5 minutes (300s) | Timer expires: booking dismissed, transitions to `rejected` (reason: "Request timed out"), and removes alert. |
| 7 | Rider Handover OTP | Vendor enters incorrect 4-digit OTP | Input shows red error state ("Invalid handover OTP. Please verify with rider."); order status remains in `ready`. |
| 8 | Rider Handover OTP | Vendor enters correct 4-digit OTP | Status advances to `handed_over` / `completed`; sale amount credit posted to vendor earnings ledger. |
| 9 | Family Completion OTP | Caretaker enters incorrect 4-digit OTP | Input shows error state ("Incorrect completion code."); booking status remains `in_progress`. |
| 10 | Family Completion OTP | Caretaker enters correct 4-digit OTP + care notes | Booking marked `completed`; shift timer stops; earnings balance credited; rating prompt generated. |
| 11 | Caretaker Availability Filter | Caretaker sets Tuesday as Leave Day or unchecks Morning slot | Request simulator evaluates schedule: requests for Tuesday morning are never generated. |
| 12 | Caretaker Online Toggle | Caretaker toggles status to "Offline" | Simulator stops generating new booking requests until caretaker toggles status back to "Online". |
| 13 | Store Status Toggle | Vendor toggles shop status to "Closed" | Incoming simulated order generation is paused; dashboard shows "Store is currently closed". |
| 14 | Low-Stock Threshold Trigger | Item inventory count reduced to 4 after order packing | Item flagged with `lowStock: true`; dashboard displays amber warning banner: "1 item is low in stock". |
| 15 | Prescription Quote Submission | Vendor attempts to submit quote with 0 items selected | "Send Quote" button remains disabled; prompts vendor to add at least one medicine item. |
| 16 | Prescription Quote Acceptance | Quote sent to simulated user | Simulated user automatically accepts after 3-second delay; order advances to `packing`. |
| 17 | Role Choice Lock-in | User logs in and selects "Medicine Vendor" | Store permanently records role; navigation mounts `VendorTabs`; Caretaker screens are completely unmounted. |
| 18 | KYC Document State | User submits Drug Licence photo and license number | Document state transitions from `not_uploaded` to `submitted`; pending screen displays document status chips. |
| 19 | Windows Path Limit (> 260 chars)| Building Android native C++ code directly inside OneDrive path | Native build fails with `Filename longer than 260 characters` during CMake/Ninja task. Resolved by building via `L:\`. |
| 20 | Metro Cache with `subst L:` | Running Metro without watching real `C:\` directory | Metro bundler fails with `Failed to get the SHA-1 for: C:\...`. Resolved by `fs.realpathSync.native(__dirname)` in `watchFolders`. |
| 21 | Edge-to-Edge RN 0.87 Props | Passing `backgroundColor` or `translucent` to `<StatusBar />` | TypeScript compiler reports type error as properties are obsolete in RN 0.87 edge-to-edge mode. |
| 22 | Packing Item Substitution | Item marked unavailable; substitute medicine selected | Checklist updates item with substitute details; pricing line adjusts in order summary. |
| 23 | Caretaker GPS Check-in Distance | GPS distance > 200m from patient address | Check-in card indicates "You are 1.2 km away"; provides option to "Check In Anyway (Demo Bypass)". |
| 24 | Text Scaling Multiplier | Device system font size set to maximum accessibility scaling | Text component (`T`) enforces `maxFontSizeMultiplier={1.3}` so typography does not break layouts. |
| 25 | Shared UI Package Missing Export | Consuming unexported component from `@lifeline/mobile-ui` | TypeScript compilation fails (`npx tsc --noEmit`). Prevented by comprehensive index barrel exports. |
