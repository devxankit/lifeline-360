# Native App Playbook

How to go from a scope document to a designed, working, signed React Native app, as done for the **Lifeline 360 User app** (October 2026). Use it as a checklist for any new mobile app or project.

The process has eight phases. Each one ends with something you can show or test, so mistakes surface early and cheaply.

| # | Phase | Output | Typical time |
|---|---|---|---|
| 0 | Understand the scope | Module and screen map, decision list | 1 session |
| 1 | Make the decisions | Answers to 6–10 multiple-choice questions | 15 minutes |
| 2 | Design direction | Palette, type and rules taken from the logo and references | 1 session |
| 3 | Design canvas | 8–12 key screens approved by the client | 1–3 rounds |
| 4 | Native project setup | Scaffolded app that builds a release APK | 1–2 hours |
| 5 | Architecture | Theme, UI kit, data, store, navigation | 2–3 hours |
| 6 | Screens and flows | Every screen, every flow working on sample data | the bulk |
| 7 | Verify and release | Type, lint and unit checks, emulator run, signed APK on a real phone | 1–2 hours |

---

## Phase 0 — Understand the scope

1. **Read the full scope document** (PDF, brief, quotation). If a PDF won't open directly, extract the text:
   ```bash
   pdftotext -layout "scope.pdf" -      # or: python -c "import fitz; ..."
   ```
2. **List the deliverables** exactly as the scope names them: apps, panels, website, integrations. Note what is **out of scope** (Lifeline excluded the Doctor and Hospital panels).
3. **Turn every feature into screens.** For each module, write the screen list and the flows between screens. Lifeline's User app came to about 65 screens. Group them like this:
   - Onboarding and auth (splash, intro, phone, OTP, profile setup)
   - Home, search, notifications
   - One flow per service (list → detail → choose → checkout → tracking)
   - Tabs (bookings, records, membership, profile)
   - Shared screens (checkout, payment processing, success, masked call)
   - Profile sub-pages (addresses, family, contacts, settings, help, legal)
4. **Inspect the existing code** (if any) for things to reuse: design tokens, components, data, routing conventions.
5. **Note what is unknown** (prices, legal text, API keys, store links). These become placeholders, never invented numbers.

## Phase 1 — Make the decisions up front

Ask every open question at once, as multiple choice with a recommended option first, then build without stopping to check in. These are the questions that changed how Lifeline was built:

| Question | Options (recommended first) |
|---|---|
| Tech for mobile apps | **React Native CLI** · Expo · Flutter · React web wrapped later |
| Data for the first build | **Mock data behind a service layer** · Wire the real backend now |
| Languages | English only (i18n later) · i18n now with English + Hindi |
| Depth of a feature with no partner panel | **Full user-side flow** · Request/callback only · "Coming soon" |
| Theme scope | Apps only · Apps + website |
| Logo | **Redraw as SVG** · Use the PNG as-is |
| Design approval | **Design canvas first** · Build directly |
| Android package name (permanent) | **`com.<brand>.<app>`** · `in.<brand>.<app>` |
| Maps | **Designed vector map now, Google later** · Google Maps now (needs a key) |
| Release output | Signed APK · Signed APK + AAB |

Rules:
- Anything permanent (package name, signing key) needs an explicit answer.
- Anything with a conventional default: pick the default and say so.
- Record the answers in project memory or a decision log.

## Phase 2 — Design direction

### 2.1 Gather references

- **The client's own references** carry the most weight. For Lifeline these were a soft green doctor app and a pastel wellness app.
- **Award-winning sites in the same category.** Look at Awwwards' category pages (e.g. `awwwards.com/websites/health/`) and note the patterns: soft neutral backgrounds, big numbers with plain status labels, floating cards over phone mockups, calm motion.
- **Shipped apps in the same market.** Lifeline used Practo, Apollo 24|7, PharmEasy and Uber. These matter most for how the result *feels*.

### 2.2 Take the colours from the logo, not from guesses

Sample the logo's exact colours with Python and build the palette from them:

```python
from PIL import Image
im = Image.open('logo.png').convert('RGB'); w, h = im.size
for name, (x, y) in {'petal1': (.33, .25), 'wordmark': (.17, .79)}.items():
    print(name, '#%02x%02x%02x' % im.getpixel((int(x*w), int(y*h))))
```

Then build the system:

- **Core:** one primary colour, 50–900 scale (Lifeline: teal `#128078`), white surfaces, a slightly tinted page background, a dark navy for text.
- **Pastels:** soften each logo colour into a light tint plus a readable dark text shade.
- **One service, one colour:** give each module a colour and use it everywhere: app, admin, badges, charts.
- **Reserve red for emergencies only** (SOS, ambulance, critical alerts), so red always means urgent.
- **Check contrast:** body text at least 4.5:1. Test grey labels against the actual background, not against white.

### 2.3 Type

One UI family with 4–5 static weights (Lifeline: Plus Jakarta Sans 400–800). On Android, ship static font files, one per weight: variable fonts don't map `fontWeight` reliably.

### 2.4 The "doesn't look AI-generated" checklist

The first user-app design was rejected as "too AI-generated" even though the colours were right. What fixed it:

| Avoid | Do instead |
|---|---|
| Decorative serif/italic accent phrases ("stay calm.") | Plain, functional copy |
| Uppercase letter-spaced labels above every heading | Sentence-case section titles with "See all" links |
| Sun-and-hills illustrations and gradient washes everywhere | **Real photos** with a soft fade into a tinted card |
| Initial-letter avatars for doctors and staff | **Real portraits** (crop faces from stock photos you already have) |
| Huge pastel tiles holding thin line icons | **Photo cards** for the main services, **filled two-tone icons** for secondary ones |
| Floating pill tab bar with a big bump in the middle | Flat tab bar with a hairline top border and an active marker |
| 28px corners and shadows on everything | 10–16px corners, hairline borders, grey section bands |
| Sparse cards | Dense, real info: fee, experience, rating with review count, distance, next slot, plate number |
| Schematic block map | A street-style map: roads of varied width, parks, water, labels |

### 2.5 Images

- Reuse licensed photos the project already has (Pexels etc.) and **crop them with PIL** into portraits, service-card photos and banners. Check every crop visually; recentre on faces when needed.
- Never use photos of real brands or people in a way that implies endorsement.
- Product images (medicine packs and so on) stay as placeholders until partners provide them. Say so.

## Phase 3 — Design canvas (approval before code)

Use a **Claude Design canvas** (Artifact type "Design") to get sign-off before building 50+ screens.

1. Board 1 is the **design system**: logo variants, palette, service colours, type scale, components (buttons, inputs, chips, status pills, list rows), 4 design rules.
2. Then **8–12 hero screens** covering every app or panel. Lifeline had five user screens, three partner-app screens and two web panels.
3. Make key controls clickable on the boards (tabs, slots, toggles), so the client feels the flow.
4. Mark sample data as sample, and put `[PRICE]`-style placeholders where facts are missing.
5. Iterate on feedback one board at a time. Lifeline's Home took three rounds, and the last round changed only the services grid.
6. When it's approved, **write the tokens down** (plan file and memory). The code copies them exactly.

## Phase 4 — Native project setup

### 4.1 Check the machine

```bash
node -v                                  # RN 0.87 needs Node >= 22.11
"<JDK>/bin/java" -version                # JDK 17
echo $ANDROID_HOME; ls $ANDROID_HOME/platforms $ANDROID_HOME/build-tools $ANDROID_HOME/ndk
adb devices
```
iOS builds need a Mac. On Windows, ship Android and keep the code iOS-ready.

### 4.2 Pick the React Native version

Run `npm view react-native time --json`. Take the **latest minor that has been out for at least a few weeks**: libraries lag behind brand-new releases. Lifeline used 0.87.1 while 0.88 was two weeks old.

### 4.3 Scaffold

```bash
npx @react-native-community/cli@<cli-version> init <AppName> --version 0.87.1 \
  --package-name com.<brand>.<app> --directory <app-folder> --skip-git-init --pm npm --install-pods false
npm uninstall @react-native/new-app-screen
npm pkg set name=<brand>-<app>
```

### 4.4 Dependencies (minimal, stable)

```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-screens react-native-svg lucide-react-native @react-native-async-storage/async-storage@2.2.0
```
- Use AsyncStorage **2.2**. Version 3 adds Kotlin KSP and Room to the Android build, which caused build risk on a new RN version.
- Check icon names against the installed lucide version before using them, because icons get renamed (`Home` → `House`).
- Optional later: `react-native-bootsplash` (native splash), `react-native-image-picker` / `@react-native-documents/picker`, `react-native-permissions`, maps, push notifications.

### 4.5 Android project settings

- `strings.xml`: the real app name ("Lifeline 360").
- `styles.xml`: `Theme.AppCompat.Light.NoActionBar` (light-only app) and `android:windowBackground` set to white.
- `AndroidManifest.xml`: `android:screenOrientation="portrait"`.
- Fonts: copy the `.ttf` files to `android/app/src/main/assets/fonts/`. For iOS, list them under `UIAppFonts` in `Info.plist` and add `react-native.config.js` with `assets: ['./assets/fonts']`.
- `gradle.properties` (keeps memory free for an emulator):
  ```properties
  org.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=512m
  org.gradle.workers.max=1
  org.gradle.parallel=false
  ```

### 4.6 App icon from the logo

Keep a script in the project (`scripts/generate-icons.py`) that builds everything from one source PNG:
- the mark only (the wordmark is unreadable at launcher size), cropped from the logo with a bounding-box check against white
- `mipmap-*/ic_launcher.png` (rounded square), `ic_launcher_round.png` (circle), `ic_launcher_foreground.png` (adaptive, mark at **about 58% of the 108dp canvas** so it survives every launcher mask)
- `mipmap-anydpi-v26/ic_launcher.xml` with a background colour
- a 512 px Play Store icon and a logo PNG for the splash screen

### 4.7 Release signing (do this on day one)

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore app/<brand>-upload.keystore -alias <brand>-upload \
  -keyalg RSA -keysize 2048 -validity 10000 -storepass "$PW" -keypass "$PW" -dname "CN=<Brand>, O=<Brand>, C=IN"
```
- Store the passwords in `android/keystore.properties` and **git-ignore** it (`*.keystore` is ignored by the template, apart from the debug key).
- In `app/build.gradle`, read the properties into a `release` signing config. Then add a **guard that fails release builds when the file is missing**, so a release can never silently fall back to the debug key:
  ```groovy
  gradle.taskGraph.whenReady { graph ->
      def releaseTask = graph.allTasks.any { t ->
          (t.name.startsWith('assemble') || t.name.startsWith('bundle')) && t.name.toLowerCase().contains('release')
      }
      if (releaseTask && !keystorePropsFile.exists()) {
          throw new GradleException("Release signing is not set up: ${keystorePropsFile} is missing.")
      }
  }
  ```
- **Back up the keystore and its password outside the repo.** Every future Play Store update needs the same key.

### 4.8 Windows: the 260-character path limit (important)

A project deep inside OneDrive breaks the native C++ build (`Filename longer than 260 characters`). The fix needs no admin rights:

```powershell
subst L: "C:\Users\<you>\OneDrive\Desktop\<project>"     # lost on reboot; re-run before each build
cd L:\<app-folder>\android
```

Metro then sees some files through the real `C:\` path and fails with `Failed to get the SHA-1`. Make it watch the real folder too, in `metro.config.js`:

```js
const fs = require('fs');
const realRoot = fs.realpathSync.native(__dirname);
const config = { watchFolders: realRoot.toLowerCase() !== __dirname.toLowerCase() ? [realRoot] : [] };
```

Better long term: keep mobile projects outside OneDrive, in a short path like `E:\Projects\app`.

### 4.9 Baseline build early

Run a release build **before writing app code**, in the background, to catch toolchain problems while you write screens:
```bash
JAVA_HOME="<JDK17>" ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

## Phase 5 — Architecture

```text
<app>/
  App.tsx                 providers: SafeArea → Store → Navigator
  src/
    theme/index.ts        colours, service colours, fonts, radius, shadow (tokens from the canvas)
    components/
      T.tsx               text component: font family per weight, font scaling capped at 1.3×
      ui.tsx              Button, AppBar, IconButton, Section, Card, ListRow, InfoRow, Chip, Badge,
                          StatusBadge, Rating, Segmented, Toggle, RadioDot, CheckBox, Field, Avatar,
                          BottomBar (sticky CTA), Timeline, EmptyState
      brand.tsx           SVG logo mark, Wordmark, Fade (SVG gradient), DuoIcon, ProductThumb, DesignedMap
      pickers.tsx         PatientPicker (self + family), AddressSummary
    data/catalog.ts       sample catalogue, labelled as sample; images via require()
    store/AppStore.tsx    one context: session, profile, addresses, family, carts, bookings,
                          notifications, membership, settings — saved to AsyncStorage
    navigation/           native stack for every screen + custom bottom tab bar
    screens/              one file per area: auth, home, <service>…, bookings, profile, checkout
    utils/format.ts       currency, greeting, time ago
  scripts/generate-icons.py
  assets/fonts, assets/brand
```

Patterns that keep the code small and consistent:

- **Design tokens only.** Screens use `colors.teal` and `service.lab`, never raw hex.
- **The `T` text component** replaces `Text` everywhere. On Android, choosing a font means choosing a file, so weights map to font files.
- **SVG for gradients and the map** (`react-native-svg`). This works on every architecture with no extra native module.
- **One generic checkout.** Each service builds a `draft` booking plus bill `lines` and passes them to `Checkout` → `PaymentProcessing` → `Success`. Only processing creates the booking (and clears carts), so backing out keeps the user's state.
- **Booking-driven tracking.** Status changes come from timers in the tracking screen. This simulates the backend, and switching to real-time updates later doesn't change the UI.
- **Side effects in effects.** Never call store setters inside a `setState` updater. Watch the progress value in a separate `useEffect`.
- **Demo-mode honesty.** Show "Demo build: any 6-digit code works" and "no real payment is taken". Show "Price at launch" where prices aren't decided.
- **Seed history on first login,** so a demo account doesn't open on empty screens.

## Phase 6 — Screens and flows

Build order:
1. Theme, `T`, the UI kit and brand pieces
2. Data and store
3. Auth (splash routing: onboarded? → logged in? → profile done? → main)
4. Home, built pixel-close to the canvas
5. Each service flow end to end, including checkout and tracking
6. Tabs (bookings, records, membership, profile)
7. Profile sub-pages and forms

For every screen:
- [ ] Real app pattern (app bar with back, sticky bottom CTA, sections on a grey background)
- [ ] Empty state, and disabled states until inputs are valid
- [ ] Insets handled (edge-to-edge: top in the app bar, bottom in `BottomBar` and the tab bar)
- [ ] 44px+ touch targets, `accessibilityRole`/`accessibilityLabel` on icon buttons
- [ ] Destructive actions confirmed (`Alert` with cancel)
- [ ] Data comes from the store or catalogue, never hard-coded inside the screen

RN 0.87 specifics: `StatusBar` no longer accepts `backgroundColor` or `translucent` (edge-to-edge is always on). Type `TextInput` refs as `useRef<React.ComponentRef<typeof TextInput>>`.

## Phase 7 — Verify and release

### 7.1 Static checks

```bash
npx tsc --noEmit          # 0 errors
npx eslint src App.tsx    # 0 errors (inline-style rule turned off on purpose for canvas-driven layouts)
npx jest                  # unit tests for formatters, slot builders, pure logic
```

### 7.2 Build

```bash
cd L:\<app>\android
JAVA_HOME="<JDK17>" ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a,x86_64
./gradlew --stop          # free memory before starting an emulator
```
Include `x86_64` so the APK also runs on an emulator. Drop it for a smaller phone-only APK.

### 7.3 Verify the APK

```bash
apksigner verify --print-certs app-release.apk     # must show YOUR release certificate, not the debug one
aapt2 dump badging app-release.apk | grep -E "package|application-label|native-code|targetSdk"
```

### 7.4 Run it on an emulator and a phone

```bash
# create once
avdmanager create avd -n AppTest -k "system-images;android-34;default;x86_64" -d pixel_6
# start headless (ANDROID_SDK_ROOT must be a clean Windows path)
emulator -avd AppTest -no-window -no-audio -no-boot-anim -no-snapshot -memory 1536 -gpu swiftshader_indirect
adb -s emulator-5554 install -r app-release.apk
adb -s emulator-5554 shell am start -n com.<brand>.<app>/.MainActivity
adb -s emulator-5554 exec-out screencap -p > shot.png
adb -s emulator-5554 shell input tap X Y          # drive the flows; input text 9876543210 for fields
```
- Walk the main flows (auth → home → each service end to end) and screenshot every step. Downscale the screenshots before viewing them.
- **If more than one device is connected, always pass `-s <serial>`.** Never install on someone's phone without asking.
- Fix what the screenshots reveal (Lifeline: a plain dot in the checkout header was replaced with the doctor's photo or a service icon), rebuild, reinstall.

### 7.5 Hand-off

- Copy the APK to `<app>/release/<App>-<version>.apk` and git-ignore `release/`.
- README: stack, demo-mode table (what's simulated now, what replaces it), folder layout, dev run, Windows release steps, signing and backup, iOS notes, icon script.
- Tell the client: where the APK is, what was verified, what's simulated, and that they **must back up the keystore**.
- For the Play Store later: `./gradlew bundleRelease` (AAB) with the same key, store icon 512 px, screenshots, privacy policy URL.

---

## Problems we hit and their fixes

| Symptom | Cause | Fix |
|---|---|---|
| `Filename longer than 260 characters` in a CMake/ninja task | Windows path limit, deep OneDrive folder | `subst` a short drive letter and build from it |
| `createBundleReleaseJsAndAssets` fails: `Failed to get the SHA-1` | Metro sees real `C:\` paths outside its `L:\` root | `watchFolders: [fs.realpathSync.native(__dirname)]` |
| Bundle step fails on a fresh scaffold | Template `App.tsx` imports the removed `@react-native/new-app-screen` | Replace `App.tsx` with your own |
| Emulator: `Insufficient RAM free` | Gradle daemon using the memory | `./gradlew --stop`, `-memory 1536`, lower Gradle `jvmargs`/workers |
| Emulator: `Broken AVD system path` | Mixed `/` and `\` in `ANDROID_SDK_ROOT` | Use a clean Windows path, `C:\Users\...\Android\Sdk` |
| `adb: more than one device/emulator` | Phone and emulator both connected | Always use `adb -s <serial>` |
| `apksigner`: JAVA_HOME not set | Tool needs a JDK | Export `JAVA_HOME` to JDK 17 first |
| TS errors on `StatusBar backgroundColor/translucent` | Removed in edge-to-edge RN | Remove the props |
| `npm EBUSY` while installing | The shell's working directory is inside the package folder | `cd` out and retry |
| Lucide icon "missing" | Renamed in newer versions | Check names against the installed `.d.ts` export list |
| Design rejected as "AI-generated" | Decorative styling, no real photos, initial-letter avatars | Apply the checklist in 2.4 |

## Prompt to start the next app

> Read the scope in `<path>`. Map every module to screens and flows, inspect the existing code for reuse, and ask me the open decisions as multiple choice with a recommended option first (tech, data, languages, theme scope, logo, design approval, package name, maps, release output). Then: take the palette from my logo, find references (Awwwards category plus top apps in this market), and build a Claude Design canvas with the design system and 8–12 hero screens. It must look like a shipped production app, not AI-generated: real photos, dense real information, flat tab bar, 10–16px corners. After I approve, scaffold a React Native CLI app following `docs/NATIVE-APP-PLAYBOOK.md`, build every screen and flow on sample data, verify on an emulator, and give me a signed APK.

## Final checklist

- [ ] Scope read, screen map written, out-of-scope noted
- [ ] Decisions asked once, answers recorded
- [ ] Palette sampled from the logo, contrast checked, one colour per service, red only for emergencies
- [ ] Canvas approved (design system + hero screens), tokens written down
- [ ] RN version a few weeks old, minimal dependencies, icon names checked
- [ ] App name, light theme, portrait, fonts, icons from the script
- [ ] Release keystore created, properties git-ignored, release guard added, **backed up**
- [ ] Baseline release build passes (short path on Windows, Metro `watchFolders`)
- [ ] Theme → kit → data → store → navigation → screens
- [ ] Every flow works end to end, demo simulations clearly labelled
- [ ] `tsc`, `eslint` and `jest` clean
- [ ] Signed APK verified, tested on an emulator with screenshots, installed on a real phone (with permission)
- [ ] README, APK in `release/`, client told about simulations and the keystore backup
