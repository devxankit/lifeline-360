# Lifeline 360 — User app (React Native CLI)

The customer app for Lifeline 360: doctor consultation, medicines, nursing and
caretakers, ambulance, lab tests, blood bank and membership. The UI follows the
approved design canvas (teal + white with the logo's pastels, Plus Jakarta Sans).

- React Native 0.87 (new architecture, Hermes), TypeScript
- React Navigation 7 (native stack + custom bottom tabs)
- `react-native-svg` + `lucide-react-native` for the logo, map and icons
- AsyncStorage keeps the session, bookings, addresses and settings on the device
- App ID `com.lifeline360.user`

## Demo build status

Every flow works end to end on **local sample data** (`src/data/catalog.ts`).
These pieces are simulated until the backend and third-party services are
connected:

| Feature | Now | Later |
|---|---|---|
| OTP login | Any 6-digit code works | SMS gateway |
| Payments | Simulated success | Payment gateway |
| Maps & tracking | Designed vector map with a moving vehicle | Google Maps key + live GPS |
| Calls | In-app masked-call screen | Call-masking API |
| Video consult | In-app call UI | Video provider SDK |
| Prescription / report upload | Attaches a sample file | Camera & file picker |
| Membership prices | "Price at launch" | Set by the client |

## Project layout

```text
src/
  theme/        colour, type and service tokens from the canvas
  components/   T (text), ui (buttons, rows, chips…), brand (logo, map, icons), pickers
  data/         sample catalogue: doctors, medicines, lab tests, nursing, hospitals, blood banks
  store/        AppStore: session, profile, carts, bookings, membership (persisted)
  navigation/   RootNavigator: auth stack, five tabs, every service flow
  screens/      auth, home, doctor, medicine, nursing, ambulance, lab, blood,
                membership, bookings, health, profile, checkout (shared pay/success/call)
```

## Run in development

```bash
npm install
npm start              # Metro
npm run android        # with an emulator or USB device connected
```

## Build the signed release APK (Windows)

Windows limits file paths to 260 characters and this folder sits deep inside
OneDrive, so the native C++ build must run from a short drive letter:

```powershell
subst L: "C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360"
cd L:\user-app\android
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot"
.\gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a,x86_64
```

The APK is written to `android/app/build/outputs/apk/release/app-release.apk`.

**Signing:** release builds use `android/app/lifeline360-upload.keystore` with
the passwords in `android/keystore.properties`. Both are git-ignored. Back them
up somewhere safe: every future update to the Play Store must be signed with
the same key. If `keystore.properties` is missing, a release build stops with
an error rather than signing with the debug key.

## iOS

The code is iOS-ready (fonts are registered in `Info.plist`), but iOS builds
need a Mac with Xcode: `cd ios && pod install`, then archive in Xcode.

## App icon

Launcher icons in `android/app/src/main/res/mipmap-*` are generated from the
Lifeline 360 logo (adaptive icon on white) by `python scripts/generate-icons.py`. `assets/brand/playstore-icon-512.png`
is the store listing icon.
