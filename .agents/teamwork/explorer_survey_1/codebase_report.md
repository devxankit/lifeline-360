# Lifeline 360: Mobile Codebase Survey & UI Kit Extraction Plan

**Date**: October 29, 2026  
**Author**: `explorer_survey_1`  
**Workspace**: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360`  
**Target Milestone**: Foundation Survey, `packages/mobile-ui` Extraction Plan, and `partner-app` Architecture Specification

---

## 1. Executive Summary

This investigation surveys the mobile codebase of **Lifeline 360** to establish a baseline for scaffolding the third mobile application: **Lifeline Partner** (`partner-app/`), serving **Medicine Vendors** and **Nursing/Caretakers**.

### Key Findings
1. **Existing Applications**: The workspace contains two fully scaffolded and built React Native CLI applications:
   - `user-app/` (package: `com.lifeline360.user`, release APK verified: `Lifeline360-User-1.0.0.apk`, ~56 MB)
   - `driver-app/` (package: `com.lifeline360.driver`, release APK verified: `Lifeline360-Driver-1.0.0.apk`, ~27 MB)
2. **Framework & Engine**: Both apps run on **React Native CLI 0.87.1** with **React 19.2.3**, **Hermes enabled**, **New Architecture enabled** (`newArchEnabled=true`), and **edge-to-edge display** (`edgeToEdgeEnabled=true`). They do **not** use Expo.
3. **TypeScript & Static Quality**: Both existing mobile apps compile cleanly with **0 TypeScript errors** (`npx tsc --noEmit` verified).
4. **Environment**:
   - Node: `v22.13.1` (Playbook requires Node >= 22.11)
   - Java: OpenJDK 17 (`C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot`)
   - Android SDK: `C:\Users\AnkitAhirwar\AppData\Local\Android\Sdk` (Platforms: `android-34`, `android-35`; Build-tools: `34.0.0`, `35.0.0`, `35.0.1`)
   - Windows 260-char path fix: `subst L: "C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360"` is active and verified.
5. **Packages Directory**: `packages/` does **not** currently exist in the repository root. Currently, each app is an independent project.
6. **Code Sharing Strategy**: Moving the shared theme, UI kit, brand SVGs, format utilities, and shared utility screens into a local package `packages/mobile-ui` (`@lifeline/mobile-ui`) will decouple partner app development from `user-app` and prevent duplicating ~2,500 lines of UI code. `partner-app` will consume `@lifeline/mobile-ui` via local file reference (`file:../packages/mobile-ui`) with Metro `watchFolders` and TypeScript `paths` mapping. `user-app` and `driver-app` will remain completely unregressed.

---

## 2. Inventory of Existing Mobile Applications

### 2.1 Workspace Structure
The workspace root at `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360` contains:
```text
lifeline 360/
├── backend/          # Express REST API (ES Modules)
├── frontend/         # Public website (Vite + React 19 + Tailwind v4)
├── user-app/         # Lifeline 360 Customer Mobile App (React Native CLI 0.87.1)
├── driver-app/       # Lifeline 360 Ambulance / Driver App (React Native CLI 0.87.1)
├── docs/             # NATIVE-APP-PLAYBOOK.md, DRIVER-APP-PLAN.md, PARTNER-APP-PLAN.md
├── tools/            # Scope Quotation PDF
└── .agents/          # Teamwork agent metadata
```

### 2.2 `user-app` (Customer Application)
- **Directory**: `user-app/`
- **Application Label**: "Lifeline 360" (`user-app/android/app/src/main/res/values/strings.xml`)
- **Android Application ID / Namespace**: `com.lifeline360.user`
- **Version**: `versionCode 1`, `versionName "1.0.0"`
- **Core Dependencies**:
  ```json
  {
    "dependencies": {
      "@react-native-async-storage/async-storage": "^2.2.0",
      "@react-navigation/bottom-tabs": "^7.21.0",
      "@react-navigation/native": "^7.5.1",
      "@react-navigation/native-stack": "^7.21.0",
      "lucide-react-native": "^1.63.0",
      "react": "19.2.3",
      "react-native": "0.87.1",
      "react-native-safe-area-context": "^5.5.2",
      "react-native-screens": "^4.30.1",
      "react-native-svg": "^15.16.0"
    }
  }
  ```
- **Dev Dependencies**: `@react-native-community/cli: 20.2.0`, `@react-native/metro-config: 0.87.1`, `@react-native/typescript-config: 0.87.1`, `typescript: ^6.0.3`, `eslint: ^8.19.0`, `jest: ^29.6.3`.
- **TypeScript Config**:
  ```json
  {
    "extends": "@react-native/typescript-config",
    "include": ["**/*.ts", "**/*.tsx"],
    "exclude": ["**/node_modules", "**/Pods"]
  }
  ```
  Verified: `npx tsc --noEmit` runs with 0 errors.
- **Metro Configuration**: Handles Windows subst path mapping via:
  ```js
  const realRoot = fs.realpathSync.native(__dirname);
  const config = {
    watchFolders: realRoot.toLowerCase() !== __dirname.toLowerCase() ? [realRoot] : [],
  };
  ```
- **Release Signing**: Configured in `user-app/android/app/build.gradle` reading `user-app/android/keystore.properties` (Keystore: `lifeline360-upload.keystore`, Alias: `lifeline360-upload`). Guard task prevents unsigned or debug-signed release builds.
- **Built Artifact**: Verified release APK exists at `user-app/release/Lifeline360-User-1.0.0.apk` (56,219,491 bytes).

### 2.3 `driver-app` (Ambulance / Driver Application)
- **Directory**: `driver-app/`
- **Application Label**: "Lifeline Driver"
- **Android Application ID / Namespace**: `com.lifeline360.driver`
- **Version**: `versionCode 1`, `versionName "1.0.0"`
- **Additional Dependencies**:
  - `@sayem314/react-native-keep-awake`: `^2.0.0`
  - `lucide-react-native`: `^1.64.0`
- **TypeScript**: Verified `npx tsc --noEmit` runs with 0 errors.
- **Built Artifact**: Verified release APK exists at `driver-app/release/Lifeline360-Driver-1.0.0.apk` (27,488,453 bytes).

---

## 3. Inventory of Shared Theme, Design Tokens & UI Kit

### 3.1 Theme & Design Tokens (`src/theme/index.ts`)

#### Color Palette
- **Teal Primary**:
  - `teal`: `#128078` (Primary brand color for buttons, active accents, headers)
  - `tealDark`: `#0F6B66`
  - `tealDeep`: `#0B3B3A`
  - `tealSoft`: `#DDF1EC`
  - `tealTint`: `#E6F5F2`
  - `tealLine`: `#9CCFC8`
- **Ink / Typography**:
  - `ink`: `#1C2340` (Primary body and heading text)
  - `ink2`: `#4A5170` (Secondary text)
  - `muted`: `#646A88` (Muted labels and captions)
  - `faint`: `#9AA0B4` (Placeholders and subtle borders)
- **Surfaces & Backgrounds**:
  - `bg`: `#F4F6F5` (Screen page background)
  - `surface`: `#FFFFFF`
  - `surface2`: `#F2F4F3`
  - `line`: `#E6E9E8`
  - `lineStrong`: `#D4D8D7`
- **Alert & Status Accents**:
  - `green`: `#1A8A57` / `#12B76A` (`greenSoft`: `#E5F7EE`, `greenText`: `#136B45`)
  - `amber`: `#C99A12` / `#F79009` (`amberSoft`: `#FFF6DA`, `amberText`: `#7A5A00`)
  - `red`: `#D13238` / `#D92D20` (`redSoft`: `#FDECEC`, `redText`: `#A3212A`) - **Reserved strictly for emergencies**
  - `sky`: `#1D6FAE` / `#0BA5EC` (`skySoft`: `#E3EFFB`, `skyText`: `#11568A`)
  - `white`: `#FFFFFF`
- **Partner / Driver Dark Palette**:
  - `navy`: `#0B1B2B`, `navyCard`: `#13263A`, `navySurface`: `#182E46`, `navyLine`: `#1E3B59`, `navyMuted`: `#8E9CAE`, `navyText`: `#EBF1F7`.

#### Service Colors (One Service, One Color)
| Service Key | Background | Foreground Accent | Readable Text | Role / Usage |
|---|---|---|---|---|
| `doctor` | `#DDF1EC` | `#128078` | `#0B3B3A` | Doctor Consultations |
| `medicine` | `#E2F5EA` | `#1A8A57` | `#0E4A31` | **Medicine Vendor** (Mint accent) |
| `nursing` | `#ECE9FB` | `#6F5BC9` | `#3A2E86` | **Nursing / Caretaker** (Lavender accent) |
| `ambulance` | `#FDECEC` | `#D13238` | `#A3212A` | Ambulance Dispatches |
| `lab` | `#E3EFFB` | `#1D6FAE` | `#0E3F66` | Diagnostic Labs |
| `blood` | `#FDE8EF` | `#C62E57` | `#9B1C47` | Blood Bank Requests |
| `membership` | `#FFF6DA` | `#C99A12` | `#7A5A00` | Membership Programs |

#### Typography & Font Mapping
- Font Family: **Plus Jakarta Sans** (TrueType fonts located in `android/app/src/main/assets/fonts/` and `assets/fonts/`):
  - `regular`: `PlusJakartaSans-Regular.ttf`
  - `medium`: `PlusJakartaSans-Medium.ttf`
  - `semibold`: `PlusJakartaSans-SemiBold.ttf`
  - `bold`: `PlusJakartaSans-Bold.ttf`
  - `extrabold`: `PlusJakartaSans-ExtraBold.ttf`
- On Android, `fontFamily` selects the `.ttf` filename directly, eliminating fontWeight ambiguity.

#### Radius Tokens
`radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 }`

#### Shadow Tokens
Supports both React Native 0.87 CSS `boxShadow` and traditional Android `elevation` / iOS `shadowColor`:
- `card`: Elevation 2 / subtle 1px border fallback
- `raised`: Elevation 4
- `sheet`: Elevation 8

---

### 3.2 UI Components Inventory

#### Foundational Text: `T.tsx`
- Component: `T`
- Props: `w?: FontWeight`, `size?: number`, `color?: string`, `center?: boolean`, `lh?: number`, `style?: StyleProp<TextStyle>`, standard `TextProps`.
- Behavior: Enforces `fontFamily` mapping, sets `includeFontPadding: false`, caps `maxFontSizeMultiplier` at `1.3` to prevent UI destruction on large system accessibility fonts.

#### Core Kit: `ui.tsx` (23 components)
1. **`Button`**: Variants (`primary`, `outline`, `soft`, `danger`, `dark`, `ghost`), sizes (`sm`: 36h, `md`: 44h, `lg`: 50h), loading indicator (`ActivityIndicator`), disabled state, icon support.
2. **`AppBar`**: Standard navigation header with safe-area insets, back button (`IconButton`), title, subtitle, right custom action slot, optional bottom border, transparent option.
3. **`IconButton`**: 44x44 dp minimum touch target, accessibility role, hitSlop.
4. **`Section`**: White card container with section title and right action CTA link.
5. **`Card`**: Surface card with 16px corner radius, hairline border, optional pressable behavior.
6. **`Divider`**: 1px hairline horizontal divider.
7. **`Gap`**: Configurable vertical spacer (`h?: number`).
8. **`ListRow`**: Two-line list item with leading icon tile, title, subtitle, trailing chevron or custom slot, border divider.
9. **`InfoRow`**: Key-value summary row with muted label and bold value.
10. **`Chip`**: Interactive pill selection badge with active teal background and border.
11. **`Badge`**: Compact colored status pill (`label`, `bg`, `fg`).
12. **`StatusBadge`**: Pre-mapped status badge for order/booking states (`Confirmed`, `Active`, `Accepted`, `Preparing`, `Scheduled`, `On the way`, `Completed`, `Rejected`, `Emergency`).
13. **`ServiceBadge`**: Pre-mapped badge for service domains using `service[kind]`.
14. **`Rating`**: Green pill with star icon, rating value (e.g. `4.9`), and optional review count.
15. **`Segmented`**: Segmented control tab bar with pill selector.
16. **`Toggle`**: Switch control with teal active track.
17. **`RadioDot`**: Custom 22px radio indicator.
18. **`CheckBox`**: Custom 22px square checkbox with checkmark.
19. **`Field`**: Form input with label, left slot (e.g. `+91`), hint, error state, focused teal border, custom font.
20. **`Avatar`**: Image avatar with fallback to 2-letter uppercase initials on tinted background.
21. **`BottomBar`**: Sticky bottom action container honoring device bottom safe-area insets.
22. **`Timeline`**: Multi-step vertical progress timeline with step circles, connection lines, and pulse indicator.
23. **`EmptyState`**: Centered icon container, bold title, descriptive body copy, and CTA button.

#### Brand & SVG Components: `brand.tsx` (6 components)
1. **`LifelineMark`**: Exact vector redraw of the Lifeline 360 four-petal brand mark with linear gradients and cream cross.
2. **`Wordmark`**: "Lifeline 360" brand typography with teal/white accent.
3. **`Fade`**: SVG LinearGradient overlay (horizontal or vertical) for photo fades without native gradient libraries.
4. **`DuoIcon`**: Two-tone service icons (`ambulance`, `blood`, `report`, `membership`).
5. **`ProductThumb`**: Medicine pack thumbnail with blister strip illustration, tinted by category.
6. **`DesignedMap`**: Street map drawn purely with React Native SVG; supports route paths, location pins, and moving vehicle markers with zero Google Maps API key requirement.

#### Specialized Interactive Components (from `driver-ui.tsx`)
1. **`SwipeToConfirm`**: PanResponder-driven swipe action slider for high-stakes acceptance (e.g. accepting emergency trips or vendor orders).
2. **`CountdownRing`**: Animated SVG circle countdown ring (30s / 60s / 300s) for incoming order/booking acceptance timers.
3. **`OnlineToggle`**: Standby toggle button switching between Online and Offline.
4. **`StatTile`**: Metric card displaying statistics (e.g. today's revenue, active orders, rating).
5. **`BarChart`**: Pure React Native SVG/view bar chart for weekly earnings visualization with highlighted active day.

#### Shared Utilities: `format.ts`
- `rupees(n)`: Formats number to Indian Rupee notation (`₹1,250`).
- `greeting(d)`: Returns "Good morning", "Good afternoon", or "Good evening".
- `timeAgo(at)`: Converts millisecond timestamp to human-readable relative time ("Just now", "5 min ago", "2 h ago", "3 d ago").
- `firstName(name)`: Extracts the first name.
- `maskPhone(p)`: Formats and masks 10-digit phone number (`+91 98••• ••210`).
- `formatDuration(seconds)`: Formats seconds into `mm:ss`.

#### Shared Utility Screens
- **`MaskedCallModal` / `CallScreen`**: Secure phone call interface with timer, mute/speaker toggles, and privacy badge.
- **`NotificationsScreen`**: List of system and booking notifications with unread indicators and service badges.
- **`HelpScreen`**: FAQ accordion, call/chat/email contact tiles, link to complaint submission.
- **`LegalScreen`**: Reusable legal text viewer (Terms & Conditions, Privacy Policy, About Us).
- **`ComplaintScreen`**: Form to submit tickets with topic selection, linked booking, and description.

---

## 4. Packages Directory Structure & Monorepo Assessment

### 4.1 Current Repository Status
- The workspace root has **no** `package.json`, **no** `lerna.json`, **no** `pnpm-workspace.yaml`, and **no** `packages/` directory.
- `user-app` and `driver-app` are self-contained projects located directly at repository root.
- In `driver-app`, UI components were copied from `user-app` as planned in `docs/DRIVER-APP-PLAN.md` line 45 (*"Copy the theme and UI kit now, shared package later"*).
- `docs/PARTNER-APP-PLAN.md` Section 7 and `ORIGINAL_REQUEST.md` mandate that for the third mobile application (`partner-app`), the shared theme and UI kit must now be cleanly extracted into **`packages/mobile-ui`**.

### 4.2 Packaging Strategy: Local NPM Package with Metro Watch
In React Native CLI, linking an in-repo package without a full Yarn/Pnpm monorepo requires careful attention to:
1. **Metro Bundler Resolution**: Metro does not automatically follow symlinks or search outside the project root unless configured.
2. **Duplicate React / Native Modules**: If `packages/mobile-ui` has its own `node_modules` containing `react` or `react-native`, Metro will bundle two copies, causing runtime crashes (`Invalid hook call` or symbol collisions).
3. **TypeScript Source Compilation**: Building from raw TypeScript (`"main": "src/index.ts"`) avoids complex build steps during UI development and keeps development instant.

#### The Proven Wiring Solution:
- `packages/mobile-ui/package.json`:
  - `name`: `@lifeline/mobile-ui`
  - `version`: `1.0.0`
  - `private`: `true`
  - `main`: `src/index.ts`
  - `types`: `src/index.ts`
  - All React and React Native dependencies marked as `peerDependencies`.
- `partner-app/package.json`:
  ```json
  "dependencies": {
    "@lifeline/mobile-ui": "file:../packages/mobile-ui",
    ...
  }
  ```
- `partner-app/metro.config.js`:
  ```javascript
  const path = require('path');
  const fs = require('fs');
  const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

  const realRoot = fs.realpathSync.native(__dirname);
  const packagesDir = path.resolve(__dirname, '../packages/mobile-ui');
  const realPackages = fs.realpathSync.native(packagesDir);

  const config = {
    watchFolders: Array.from(new Set([
      ...(realRoot.toLowerCase() !== __dirname.toLowerCase() ? [realRoot] : []),
      packagesDir,
      ...(realPackages.toLowerCase() !== packagesDir.toLowerCase() ? [realPackages] : []),
    ])),
    resolver: {
      nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
    },
  };

  module.exports = mergeConfig(getDefaultConfig(__dirname), config);
  ```
- `partner-app/tsconfig.json`:
  ```json
  {
    "extends": "@react-native/typescript-config",
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@lifeline/mobile-ui": ["../packages/mobile-ui/src/index.ts"],
        "@lifeline/mobile-ui/*": ["../packages/mobile-ui/src/*"]
      }
    },
    "include": [
      "**/*.ts",
      "**/*.tsx",
      "../packages/mobile-ui/src/**/*.ts",
      "../packages/mobile-ui/src/**/*.tsx"
    ],
    "exclude": ["**/node_modules", "**/Pods"]
  }
  ```

---

## 5. Proposed Extraction Plan: `packages/mobile-ui`

### 5.1 Proposed Package Directory Layout
```text
packages/mobile-ui/
├── package.json
├── tsconfig.json
├── README.md
├── assets/
│   └── fonts/
│       ├── OFL.txt
│       ├── PlusJakartaSans-Regular.ttf
│       ├── PlusJakartaSans-Medium.ttf
│       ├── PlusJakartaSans-SemiBold.ttf
│       ├── PlusJakartaSans-Bold.ttf
│       └── PlusJakartaSans-ExtraBold.ttf
└── src/
    ├── index.ts                     # Single barrel export
    ├── theme/
    │   ├── index.ts                 # Colors, service tokens, typography, radius, shadow
    │   └── types.ts
    ├── components/
    │   ├── T.tsx                    # Standard typography component
    │   ├── ui.tsx                   # Button, AppBar, Card, ListRow, Field, Chips, etc.
    │   ├── brand.tsx                # LifelineMark, Wordmark, Fade, DuoIcon, ProductThumb, DesignedMap
    │   └── interactive.tsx          # SwipeToConfirm, CountdownRing, OnlineToggle, StatTile, BarChart
    ├── utils/
    │   └── format.ts                # rupees, greeting, timeAgo, firstName, maskPhone, formatDuration
    └── screens/
        ├── MaskedCallModal.tsx      # Shared masked calling screen
        ├── NotificationsScreen.tsx  # Shared notification list UI
        ├── HelpScreen.tsx           # Shared FAQ and support UI
        ├── LegalScreen.tsx          # Shared Terms & Privacy UI
        └── ComplaintScreen.tsx      # Shared complaint submission UI
```

### 5.2 Content Breakdown for `packages/mobile-ui`

#### `src/theme/index.ts`
Unifies the color systems from `user-app` and `driver-app`, explicitly including:
- Core brand teals (`teal`, `tealDark`, `tealDeep`, `tealSoft`, `tealTint`, `tealLine`)
- Neutrals (`ink`, `ink2`, `muted`, `faint`, `white`, `line`, `lineStrong`, `surface`, `surface2`, `bg`)
- Status colors (`green`, `greenSoft`, `greenText`, `amber`, `amberSoft`, `amberText`, `red`, `redSoft`, `redText`, `sky`, `skySoft`, `skyText`)
- Driver & Partner night palette (`navy`, `navyCard`, `navySurface`, `navyLine`, `navyMuted`, `navyText`)
- Complete `service` dictionary (`doctor`, `medicine`, `nursing`, `ambulance`, `lab`, `blood`, `membership`)
- Font dictionary mapping weight strings to PlusJakartaSans font files
- `radius` and dual `shadow` definitions (boxShadow + Android elevation)

#### `src/components/interactive.tsx`
Migrates high-value partner UI components:
- `SwipeToConfirm`: PanResponder gesture slider
- `CountdownRing`: Circular SVG timer for incoming order/request countdowns
- `OnlineToggle`: Online/Offline pill switch
- `StatTile`: Metric summary tile
- `BarChart`: Weekly earnings bar chart with highlighted active day

#### `src/screens/`
Decouples utility screens by making them receive store actions and navigation via clean props:
- `MaskedCallModal`: Accepts `name`, `role`, `photo`, `onClose`
- `NotificationsScreen`: Accepts `notices`, `onMarkRead`, `onBack`
- `HelpScreen`: Accepts `faqs`, `onCallPress`, `onChatPress`, `onComplaintPress`, `onBack`
- `LegalScreen`: Accepts `kind` ('terms' | 'privacy' | 'about'), `onBack`

### 5.3 Zero-Regression Guarantee for Existing Apps
As emphasized in `docs/PARTNER-APP-PLAN.md` line 201:
> *"Move the User and Driver apps over to the package in a separate, small step after this app ships, checked with a release build of each."*

To protect `user-app` and `driver-app` from regressions:
1. `user-app` and `driver-app` will continue running on their existing internal paths during the initial build of `packages/mobile-ui` and `partner-app`.
2. Existing signed release APKs in `user-app/release/` and `driver-app/release/` remain valid and intact.
3. Once `partner-app` is scaffolded and building, `user-app/src/components/ui.tsx` can either remain as-is or re-export from `@lifeline/mobile-ui` without changing any import signatures in its 65+ screens.

---

## 6. Directory Structure & Architecture for `partner-app`

### 6.1 Core Project Specifications
- **Project Directory**: `partner-app/` (at repository root)
- **Application Package / Namespace**: `com.lifeline360.partner`
- **Application Label**: `Lifeline Partner`
- **App Icon**: Lifeline mark on a **mint tile** (`#E2F5EA` background, `#128078` mark/border) to visually distinguish it from the User app (white) and Driver app (navy).
- **React Native Version**: `0.87.1` (React `19.2.3`, Hermes, New Architecture enabled)
- **Target SDK**: Android 34 / 35 (compileSdk 35, minSdk 24)

### 6.2 Target Directory Layout
```text
partner-app/
├── package.json
├── tsconfig.json
├── metro.config.js
├── babel.config.js
├── .eslintrc.js
├── app.json
├── App.tsx
├── index.js
├── scripts/
│   └── generate-icons.py         # Generates mint-tile partner icons
├── assets/
│   ├── brand/
│   │   ├── logo-full.png
│   │   ├── logo-mark.png
│   │   └── playstore-icon-512.png
│   └── fonts/                    # PlusJakartaSans .ttf files
├── release/                      # Lifeline360-Partner-1.0.0.apk
├── android/
│   ├── keystore.properties       # Release keystore credentials (git-ignored)
│   ├── app/
│   │   ├── build.gradle          # com.lifeline360.partner + Release Guard
│   │   ├── lifeline360-partner-upload.keystore
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── res/
│   │       │   ├── values/strings.xml ("Lifeline Partner")
│   │       │   ├── values/styles.xml
│   │       │   └── mipmap-*/ (ic_launcher, ic_launcher_round, ic_launcher_foreground)
│   │       └── assets/fonts/
│   ├── gradle.properties         # Low-memory daemon settings (org.gradle.jvmargs)
│   └── build.gradle
└── src/
    ├── data/
    │   ├── samplePharmacy.ts     # Sample pharmacy profile & details
    │   ├── sampleCatalogue.ts    # Reused & expanded medicine catalogue
    │   ├── sampleOrders.ts       # Sample regular and Rx orders
    │   ├── sampleCaretaker.ts    # Caretaker profile, services, rates
    │   ├── sampleBookings.ts     # Sample upcoming/active home-care bookings
    │   ├── sampleEarnings.ts     # Weekly earnings, payouts, transaction ledger
    │   └── sampleReviews.ts      # Patient ratings and feedback
    ├── store/
    │   └── PartnerStore.tsx      # Unified React Context + AsyncStorage persistence:
    │                             # session, role (vendor vs caretaker), kycStatus,
    │                             # storeOpen / caretakerOnline, orders, catalogue,
    │                             # requests, activeService, earnings, settings
    ├── services/
    │   ├── orderSimulator.ts     # Vendor: simulates incoming orders, timer, rider OTP
    │   ├── requestSimulator.ts   # Caretaker: generates requests matching slot calendar
    │   ├── alertService.ts       # Audio alert + vibration loop for incoming calls
    │   └── locationService.ts    # GPS distance check for caretaker check-in
    ├── navigation/
    │   ├── RootNavigator.tsx     # Auth/KYC Stack -> Role Switch -> VendorTabs | CaretakerTabs
    │   ├── VendorTabs.tsx        # Orders, Catalogue, Earnings, Profile
    │   └── CaretakerTabs.tsx     # Today, Requests, Earnings, Profile
    ├── screens/
    │   ├── shared/               # Shared across both partner types:
    │   │   ├── SplashScreen.tsx
    │   │   ├── PhoneLoginScreen.tsx
    │   │   ├── OtpScreen.tsx
    │   │   ├── RoleChoiceScreen.tsx         # Single choice: Vendor vs Caretaker
    │   │   ├── BasicDetailsScreen.tsx       # Pharmacy details OR Caretaker details
    │   │   ├── KycDocumentListScreen.tsx    # Role-specific document checklist
    │   │   ├── KycDocumentUploadScreen.tsx  # Document photo / cert capture
    │   │   ├── KycPendingScreen.tsx         # "Verification in Progress"
    │   │   ├── WelcomeApprovedScreen.tsx    # Transition into operational dashboard
    │   │   ├── NotificationsScreen.tsx
    │   │   ├── MaskedCallModal.tsx
    │   │   ├── HelpScreen.tsx
    │   │   └── LegalScreen.tsx
    │   ├── vendor/               # Medicine Vendor Module (Mint Accent):
    │   │   ├── VendorDashboardScreen.tsx    # Store status toggle, metrics, low-stock alert
    │   │   ├── OrdersListScreen.tsx         # New, Packing, Ready, Completed, Rejected
    │   │   ├── NewOrderAlertModal.tsx       # Fullscreen / loud alert with 3-min countdown
    │   │   ├── OrderDetailScreen.tsx        # Item list, Rx badge, customer area, accept/reject
    │   │   ├── RejectReasonSheet.tsx        # Decline reason selector
    │   │   ├── PrescriptionReviewScreen.tsx # Rx photo viewer + quote builder
    │   │   ├── PackingChecklistScreen.tsx   # Item verification checklist & substitution
    │   │   ├── ReadyHandoverScreen.tsx      # Rider arrival & handover OTP verification
    │   │   ├── OrderHistoryScreen.tsx       # Past orders with date/status filter
    │   │   ├── CatalogueScreen.tsx          # Stock list with search, category chips, in-stock toggle
    │   │   ├── MedicineFormScreen.tsx       # Add / edit medicine item
    │   │   ├── CategoriesScreen.tsx         # Category reordering & visibility
    │   │   ├── VendorEarningsScreen.tsx     # Sales, commission deductions, net payout chart
    │   │   ├── TransactionsScreen.tsx       # Bank settlement history
    │   │   ├── PharmacyProfileScreen.tsx    # Store hours, delivery radius, drug licence
    │   │   └── VendorSettingsScreen.tsx     # Notification sounds, auto-accept, language
    │   └── caretaker/            # Nursing & Caretaker Module (Lavender Accent):
    │       ├── TodayScreen.tsx              # Online toggle, current/next booking, care plan
    │       ├── BookingRequestsScreen.tsx    # Incoming requests with 5-min timer
    │       ├── RequestDetailScreen.tsx      # Patient condition, address, distance, payout
    │       ├── UpcomingBookingsScreen.tsx   # Schedule of confirmed bookings
    │       ├── BookingDetailScreen.tsx      # Patient notes, family contact, directions
    │       ├── OnMyWayScreen.tsx            # Travel status & navigation launch
    │       ├── CheckInScreen.tsx            # GPS address verification & check-in
    │       ├── ActiveServiceScreen.tsx      # Active shift timer ring, care checklist
    │       ├── CompleteServiceScreen.tsx    # Care summary notes & family OTP completion
    │       ├── AvailabilityCalendarScreen.tsx # Weekly shift slots & leave day calendar
    │       ├── ServicesRatesScreen.tsx      # Offered care types & hourly/daily rates
    │       ├── CaretakerEarningsScreen.tsx  # Shift payouts, tip tracking, weekly chart
    │       ├── RatingsReviewsScreen.tsx     # Patient family reviews & star breakdown
    │       ├── CaretakerProfileScreen.tsx   # Certifications, languages, years experience
    │       └── CaretakerSettingsScreen.tsx  # Availability alerts, emergency contact
    └── __tests__/
        ├── orderStateMachine.test.ts        # Order lifecycle transitions
        ├── bookingStateMachine.test.ts      # Caretaker booking lifecycle transitions
        ├── availabilityFilter.test.ts       # Simulator respects leave & schedule slots
        └── earningsCalculator.test.ts       # Commission deductions & reconciliations
```

### 6.3 State & Navigation Architecture
- **Single Account = Single Role Principle**: The role chosen at signup (`medicine_vendor` or `nurse_caretaker`) is permanently stored in `PartnerStore`.
- **Dynamic Root Navigation**:
  - Unauthenticated / Incomplete KYC: mounts `AuthStack` (Splash → Phone → OTP → RoleChoice → BasicDetails → KycDocuments → KycPending → WelcomeApproved).
  - Role `medicine_vendor`: mounts `VendorTabs` (Orders, Catalogue, Earnings, Profile) with mint accent theme.
  - Role `nurse_caretaker`: mounts `CaretakerTabs` (Today, Requests, Earnings, Profile) with lavender accent theme.
- **Order State Machine**:
  `new` → `accepted` → `packing` → `ready` → `handed_over` → `delivered` (+ `rejected`, `quote_sent` → `quote_confirmed` for Rx orders).
- **Booking State Machine**:
  `requested` → `accepted` → `on_the_way` → `checked_in` → `in_progress` → `completed` (+ `rejected`, `cancelled`).
- **Simulators**:
  - `orderSimulator.ts`: Listens to `storeOpen` state; triggers simulated orders with realistic medicines and 3-minute timers.
  - `requestSimulator.ts`: Inspects `availabilitySchedule` and `leaveDates`; only dispatches requests when current/target time slot is enabled.

---

## 7. Next Steps & Recommended Execution Plan

1. **Step 1: Scaffold `packages/mobile-ui`**:
   - Create `packages/mobile-ui/package.json` with `@lifeline/mobile-ui` identity and peerDependencies.
   - Extract and consolidate `theme`, `T.tsx`, `ui.tsx`, `brand.tsx`, `interactive.tsx`, and `format.ts`.
   - Copy `assets/fonts/` (PlusJakartaSans TTF files) and create barrel export in `src/index.ts`.
2. **Step 2: Scaffold `partner-app` Native Shell**:
   - Initialize React Native CLI 0.87.1 project structure in `partner-app/` with package `com.lifeline360.partner`.
   - Configure Android signing with dedicated partner keystore (`lifeline360-partner-upload.keystore`) and release guard.
   - Generate custom mint-tile app icon via `scripts/generate-icons.py`.
   - Verify baseline release build via `JAVA_HOME="C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot" ./gradlew assembleRelease`.
3. **Step 3: Implement Store, Simulators & Navigation**:
   - Wire `@lifeline/mobile-ui` in `partner-app/package.json`, `metro.config.js`, and `tsconfig.json`.
   - Create `PartnerStore.tsx` and state machines.
   - Implement `orderSimulator.ts` and `requestSimulator.ts`.
4. **Step 4: Build Screens & Workflows**:
   - Shared Auth & KYC flow.
   - Medicine Vendor Module (Dashboard, Orders, Rx quote builder, Catalogue).
   - Nursing & Caretaker Module (Today, Requests, Check-in, Active Shift, Availability Calendar).
5. **Step 5: Verify & Release**:
   - Run `npx tsc --noEmit` (0 errors), `npx eslint src` (0 errors), and `npx jest` (unit tests passing).
   - Build signed release APK and verify with `apksigner` and `aapt2`.
