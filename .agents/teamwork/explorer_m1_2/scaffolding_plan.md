# Lifeline Partner App: Scaffolding & Native Android Configuration Plan

**Document Version:** 1.0.0  
**Target Milestone:** M1 (Shared Foundations & Mobile UI Package)  
**Author:** `explorer_m1_2`  
**Target Application:** `partner-app/`  
**Android Application ID / Namespace:** `com.lifeline360.partner`  
**Application Label:** "Lifeline Partner"  
**Local UI Package Dependency:** `"@lifeline/mobile-ui": "file:../packages/mobile-ui"`  

---

## 1. Executive Summary & Architectural Overview

The **Lifeline Partner app** (`partner-app/`) is the third standalone mobile application within the Lifeline 360 monorepo, joining `user-app/` (`com.lifeline360.user`) and `driver-app/` (`com.lifeline360.driver`). It provides a unified mobile operational platform for two partner roles:
1. **Medicine Vendors (Pharmacies):** Order fulfillment, packing verification, rider handover OTP, prescription review & quote assembly, and catalogue inventory management.
2. **Nursing & Caretakers:** Weekly availability schedules, leave management, GPS geofenced on-site check-in, active shift checklists with stay-awake timers, and family completion OTP verification.

### Key Architectural Constraints
- **Framework & Engine:** Standalone React Native CLI 0.87.1, React 19.2.3, Hermes enabled, New Architecture enabled (`newArchEnabled=true`), edge-to-edge layout enabled (`edgeToEdgeEnabled=true`).
- **Local Monorepo Dependency:** Reusable design tokens, primitives, brand SVGs, interactive widgets, and utility screens are extracted into `packages/mobile-ui` (`@lifeline/mobile-ui`). `partner-app` consumes this via `"file:../packages/mobile-ui"`.
- **Metro & Windows Path Length Limit Mitigation:** Windows 260-character path limit during CMake/Ninja/C++ codegen is mitigated by mapping the project to virtual drive `L:` (`subst L: "C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360"`). Metro `watchFolders` must monitor both virtual `L:\` paths and physical `C:\` paths to prevent `Failed to get the SHA-1` errors.
- **Dedicated Cryptographic Signing:** Built with a dedicated production upload keystore (`lifeline360-partner-upload.keystore`, `CN=Lifeline 360 Partner, O=Lifeline 360, C=IN`) protected by a strict Gradle Release Guard.

---

## 2. Exact Root Configuration Files

### 2.1 `partner-app/package.json`
Matches React Native 0.87.1, React 19.2.3, `@react-native-async-storage/async-storage`, `react-native-screens`, `react-native-safe-area-context`, `react-native-svg`, `@sayem314/react-native-keep-awake`, and local package `"@lifeline/mobile-ui": "file:../packages/mobile-ui"`.

```json
{
  "name": "lifeline360-partner",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "start": "react-native start",
    "test": "jest"
  },
  "dependencies": {
    "@lifeline/mobile-ui": "file:../packages/mobile-ui",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-navigation/bottom-tabs": "^7.21.0",
    "@react-navigation/native": "^7.5.1",
    "@react-navigation/native-stack": "^7.21.0",
    "@sayem314/react-native-keep-awake": "^2.0.0",
    "lucide-react-native": "^1.64.0",
    "react": "19.2.3",
    "react-native": "0.87.1",
    "react-native-safe-area-context": "^5.5.2",
    "react-native-screens": "^4.30.1",
    "react-native-svg": "^15.16.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@babel/preset-env": "^7.25.3",
    "@babel/runtime": "^7.25.0",
    "@react-native-community/cli": "20.2.0",
    "@react-native-community/cli-platform-android": "20.2.0",
    "@react-native-community/cli-platform-ios": "20.2.0",
    "@react-native/babel-preset": "0.87.1",
    "@react-native/eslint-config": "0.87.1",
    "@react-native/jest-preset": "0.87.1",
    "@react-native/metro-config": "0.87.1",
    "@react-native/typescript-config": "0.87.1",
    "@types/jest": "^29.5.13",
    "@types/react": "^19.2.0",
    "@types/react-test-renderer": "^19.1.0",
    "eslint": "^8.19.0",
    "jest": "^29.6.3",
    "prettier": "2.8.8",
    "react-test-renderer": "19.2.3",
    "typescript": "^6.0.3"
  },
  "engines": {
    "node": ">= 22.11.0"
  }
}
```

### 2.2 `partner-app/tsconfig.json`
Configures path mappings to `packages/mobile-ui/src/index.ts` and includes its source files so `npx tsc --noEmit` validates the entire dependency graph with zero compilation errors.

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
  "exclude": [
    "**/node_modules",
    "**/Pods"
  ]
}
```

### 2.3 `partner-app/metro.config.js`
Watches `packages/mobile-ui` and handles both virtual subst drive (`L:\`) and physical OneDrive (`C:\`) directory paths. Configures `resolver.nodeModulesPaths` and `resolver.extraNodeModules` so that peer dependencies within `packages/mobile-ui` cleanly resolve to `partner-app/node_modules`.

```javascript
const path = require('path');
const fs = require('fs');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration for Lifeline Partner app.
 * https://reactnative.dev/docs/metro
 *
 * Configured for:
 * 1. Monorepo watchFolders for local package: ../packages/mobile-ui
 * 2. Windows subst drive (L:\) mapping back to real physical OneDrive paths
 *    to prevent "Failed to get the SHA-1 for: C:\..." errors during bundling.
 * 3. nodeModulesPaths & extraNodeModules resolution so peer dependencies
 *    in packages/mobile-ui resolve directly against partner-app/node_modules.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const realRoot = fs.realpathSync.native(__dirname);
const mobileUiRoot = path.resolve(__dirname, '../packages/mobile-ui');
const realMobileUi = fs.existsSync(mobileUiRoot) ? fs.realpathSync.native(mobileUiRoot) : mobileUiRoot;

const watchFolders = Array.from(new Set([
  ...(realRoot.toLowerCase() !== __dirname.toLowerCase() ? [realRoot] : []),
  mobileUiRoot,
  ...(realMobileUi.toLowerCase() !== mobileUiRoot.toLowerCase() ? [realMobileUi] : []),
]));

const config = {
  watchFolders,
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
    ],
    extraNodeModules: {
      '@lifeline/mobile-ui': mobileUiRoot,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### 2.4 `partner-app/babel.config.js`
Standard React Native Babel preset:

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
};
```

### 2.5 `partner-app/index.js`
App registration pointing to registered component name `Lifeline360Partner`:

```javascript
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### 2.6 `partner-app/app.json`
Component registration metadata matching native `MainActivity.kt` and `index.js`:

```json
{
  "name": "Lifeline360Partner",
  "displayName": "Lifeline Partner"
}
```

### 2.7 `partner-app/.eslintrc.js`
Extends `@react-native`, relaxes inline styles for direct design canvas layouts:

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

### 2.8 `partner-app/jest.config.js`
Jest configuration using `@react-native/jest-preset`:

```javascript
module.exports = {
  preset: '@react-native/jest-preset',
};
```

### 2.9 `partner-app/.gitignore`
Ensures keystore credentials and built APKs are protected from version control:

```gitignore
# OSX
.DS_Store

# Xcode
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
**/.xcode.env.local

# Android/IntelliJ
build/
.idea
.gradle
local.properties
*.iml
*.hprof
.cxx/
*.keystore
!debug.keystore
.kotlin/

# node.js
node_modules/
npm-debug.log
yarn-error.log

# fastlane
**/fastlane/report.xml
**/fastlane/Preview.html
**/fastlane/screenshots
**/fastlane/test_output

# Bundle artifact
*.jsbundle

# Ruby / CocoaPods
**/Pods/
/vendor/bundle/

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*

# testing
/coverage

# Release signing secrets (back these up somewhere safe; never commit)
android/keystore.properties

# Built APKs
release/
```

### 2.10 `partner-app/App.tsx` (Baseline Shell)
Shell provider wrapper mounting `SafeAreaProvider`, `StatusBar`, and placeholder root:

```tsx
/**
 * Lifeline 360 — Partner App (Medicine Vendors & Nursing/Caretakers).
 */
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PartnerStoreProvider } from './src/store/PartnerStore';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <PartnerStoreProvider>
        <RootNavigator />
      </PartnerStoreProvider>
    </SafeAreaProvider>
  );
}
```

---

## 3. Native Android Project Structure (`partner-app/android/`)

### 3.1 Overview of Android Directory Layout
```text
partner-app/android/
├── build.gradle                              # Root buildscript (compileSdk 37, targetSdk 36, Kotlin 2.2.0)
├── settings.gradle                           # rootProject.name = 'com.lifeline360.partner', include ':app'
├── gradle.properties                         # Low-memory JVM daemon, newArch, hermes, edgeToEdge
├── keystore.properties                       # Release signing secrets (git-ignored)
├── gradlew                                   # Unix Gradle wrapper shell script
├── gradlew.bat                               # Windows Gradle wrapper batch script
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties         # gradle-9.4.1-bin.zip
└── app/
    ├── build.gradle                          # App buildscript with Release Guard & signingConfigs
    ├── debug.keystore                        # Standard debug keystore
    ├── lifeline360-partner-upload.keystore   # Production upload keystore (RSA 2048-bit)
    ├── proguard-rules.pro
    └── src/
        └── main/
            ├── AndroidManifest.xml           # Namespace com.lifeline360.partner, permissions, label
            ├── assets/
            │   └── fonts/                    # Plus Jakarta Sans TTF font files
            ├── java/
            │   └── com/
            │       └── lifeline360/
            │           └── partner/
            │               ├── MainActivity.kt     # getMainComponentName() = "Lifeline360Partner"
            │               └── MainApplication.kt # DefaultReactHost & package autolinking
            └── res/
                ├── drawable/
                │   └── rn_edit_text_material.xml   # TextInput NPE avoidance drawable
                ├── mipmap-anydpi-v26/
                │   ├── ic_launcher.xml             # Adaptive icon referencing mint background
                │   └── ic_launcher_round.xml
                ├── mipmap-mdpi/                    # Density-specific launcher icons
                ├── mipmap-hdpi/
                ├── mipmap-xhdpi/
                ├── mipmap-xxhdpi/
                ├── mipmap-xxxhdpi/
                └── values/
                    ├── colors.xml                  # ic_launcher_background = #E2F5EA
                    ├── strings.xml                 # app_name = "Lifeline Partner"
                    └── styles.xml                  # Theme.AppCompat.Light.NoActionBar
```

---

### 3.2 Exact Android Configuration Files

#### 3.2.1 `partner-app/android/build.gradle` (Root)
```groovy
buildscript {
    ext {
        buildToolsVersion = "37.0.0"
        minSdkVersion = 24
        compileSdkVersion = 37
        targetSdkVersion = 36
        ndkVersion = "27.1.12297006"
        kotlinVersion = "2.2.0"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
    }
}

apply plugin: "com.facebook.react.rootproject"
```

#### 3.2.2 `partner-app/android/settings.gradle`
```groovy
pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }
plugins { id("com.facebook.react.settings") }
extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
rootProject.name = 'com.lifeline360.partner'
include ':app'
includeBuild('../node_modules/@react-native/gradle-plugin')
```

#### 3.2.3 `partner-app/android/gradle.properties`
Configures low-memory JVM daemon settings (`-Xmx1536m`) to allow concurrent emulator operation, activates Hermes, New Architecture, and Edge-to-Edge:

```properties
# Project-wide Gradle settings.

# Specifies the JVM arguments used for the daemon process.
org.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=512m

android.useAndroidX=true
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
newArchEnabled=true
hermesEnabled=true
edgeToEdgeEnabled=true
android.builtInKotlin=false
android.newDsl=false

# Keep the build within this machine's memory so an emulator can run alongside it.
org.gradle.workers.max=1
org.gradle.parallel=false
```

#### 3.2.4 `partner-app/android/gradle/wrapper/gradle-wrapper.properties`
```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-9.4.1-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

#### 3.2.5 `partner-app/android/app/build.gradle`
Configures `namespace "com.lifeline360.partner"`, `applicationId "com.lifeline360.partner"`, release signing block reading `android/keystore.properties`, and the Release Guard task hook:

```groovy
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

/**
 * This is the configuration block to customize your React Native Android app.
 * By default you don't need to apply any configuration, just uncomment the lines you need.
 */
react {
    /* Autolinking */
    autolinkLibrariesWithApp()
}

/**
 * Set this to true to Run Proguard on Release builds to minify the Java bytecode.
 */
def enableProguardInReleaseBuilds = false

/**
 * The preferred build flavor of JavaScriptCore (JSC)
 */
def jscFlavor = 'io.github.react-native-community:jsc-android:2026004.+'

/**
 * Release signing reads android/keystore.properties, which is kept out of git.
 */
def keystoreProps = new Properties()
def keystorePropsFile = rootProject.file("keystore.properties")
if (keystorePropsFile.exists()) {
    keystorePropsFile.withInputStream { keystoreProps.load(it) }
}

android {
    ndkVersion rootProject.ext.ndkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion
    compileSdk rootProject.ext.compileSdkVersion

    namespace "com.lifeline360.partner"
    defaultConfig {
        applicationId "com.lifeline360.partner"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
    }
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

/*
 * Release Guard: A release build must never quietly fall back to the debug key.
 * If assembleRelease or bundleRelease is invoked without keystore.properties, halt immediately.
 */
gradle.taskGraph.whenReady { graph ->
    def releaseTask = graph.allTasks.any { t ->
        (t.name.startsWith('assemble') || t.name.startsWith('bundle')) && t.name.toLowerCase().contains('release')
    }
    if (releaseTask && !keystorePropsFile.exists()) {
        throw new GradleException("Release signing is not set up: ${keystorePropsFile} is missing. Please create keystore.properties before building a release.")
    }
}

dependencies {
    // The version of react-native is set by the React Native Gradle Plugin
    implementation("com.facebook.react:react-android")

    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}
```

#### 3.2.6 `partner-app/android/app/proguard-rules.pro`
```pro
# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
```

#### 3.2.7 `partner-app/android/app/src/main/AndroidManifest.xml`
Declares permissions required for document upload (`CAMERA`), caretaker GPS check-in (`ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`), urgent alerts (`VIBRATE`), and active shift timer (`WAKE_LOCK`). Configures portrait orientation and application label "Lifeline Partner":

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme"
      android:usesCleartextTraffic="${usesCleartextTraffic}"
      android:supportsRtl="true">
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:screenOrientation="portrait"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>
```

#### 3.2.8 `partner-app/android/app/src/main/java/com/lifeline360/partner/MainActivity.kt`
```kotlin
package com.lifeline360.partner

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Lifeline360Partner"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
```

#### 3.2.9 `partner-app/android/app/src/main/java/com/lifeline360/partner/MainApplication.kt`
```kotlin
package com.lifeline360.partner

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
```

*(Note: In alignment with React Native CLI conventions, if placed in `java/com/com.lifeline360.partner/`, Kotlin resolution remains fully valid since `package com.lifeline360.partner` defines the compilation namespace).*

---

### 3.3 Android Resource & Visual Asset Definitions

#### 3.3.1 `partner-app/android/app/src/main/res/values/strings.xml`
```xml
<resources>
    <string name="app_name">Lifeline Partner</string>
</resources>
```

#### 3.3.2 `partner-app/android/app/src/main/res/values/styles.xml`
```xml
<resources>
    <!-- Base application theme: Light theme with white window background -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
        <item name="android:windowBackground">@color/splash_background</item>
    </style>
</resources>
```

#### 3.3.3 `partner-app/android/app/src/main/res/values/colors.xml`
Adaptive launcher icon background color `#E2F5EA` (the mint brand tile matching medicine vendor domain):

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#E2F5EA</color>
    <color name="splash_background">#FFFFFF</color>
</resources>
```

#### 3.3.4 `partner-app/android/app/src/main/res/drawable/rn_edit_text_material.xml`
TextInput material inset preventing AppCompat NullPointerException:

```xml
<?xml version="1.0" encoding="utf-8"?>
<inset xmlns:android="http://schemas.android.com/apk/res/android"
       android:insetLeft="@dimen/abc_edit_text_inset_horizontal_material"
       android:insetRight="@dimen/abc_edit_text_inset_horizontal_material"
       android:insetTop="@dimen/abc_edit_text_inset_top_material"
       android:insetBottom="@dimen/abc_edit_text_inset_bottom_material"
       >
    <selector>
        <item android:state_enabled="false" android:drawable="@drawable/abc_textfield_default_mtrl_alpha"/>
        <item android:drawable="@drawable/abc_textfield_activated_mtrl_alpha"/>
    </selector>
</inset>
```

#### 3.3.5 `partner-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` and `ic_launcher_round.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

---

## 4. Brand Assets, Fonts, & Mint Tile Icon Generation

### 4.1 Plus Jakarta Sans Fonts
Custom font files must reside in both:
1. `partner-app/assets/fonts/`
2. `partner-app/android/app/src/main/assets/fonts/`

Files to copy from `user-app/assets/fonts/`:
- `PlusJakartaSans-Regular.ttf`
- `PlusJakartaSans-Medium.ttf`
- `PlusJakartaSans-SemiBold.ttf`
- `PlusJakartaSans-Bold.ttf`
- `PlusJakartaSans-ExtraBold.ttf`
- `OFL.txt`

### 4.2 Brand Images
Files to copy from `user-app/assets/brand/`:
- `logo-full.png` (placed in `partner-app/assets/brand/logo-full.png`)

### 4.3 `partner-app/scripts/generate-icons.py`
Generates Android density icons on a **mint tile** (`#E2F5EA` / RGB `(226, 245, 234)`):

```python
"""
Generate every launcher icon and the in-app logo for Lifeline Partner from the brand lockup.

    python scripts/generate-icons.py

Outputs:
  android/app/src/main/res/mipmap-*/ic_launcher.png             mint rounded tile
  android/app/src/main/res/mipmap-*/ic_launcher_round.png       mint circle tile
  android/app/src/main/res/mipmap-*/ic_launcher_foreground.png  adaptive foreground (transparent, 58% scale)
  assets/brand/playstore-icon-512.png                           512x512 Play Store icon on mint tile
  assets/brand/logo-mark.png, src/assets/images/logo-mark.png   mark only, for splash screen
"""

import os
from PIL import Image, ImageChops, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'brand', 'logo-full.png')
RES = os.path.join(ROOT, 'android', 'app', 'src', 'main', 'res')
DENSITIES = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}

# Mint tile brand color for Partner app: #E2F5EA (RGB 226, 245, 234)
MINT_COLOR = (226, 245, 234, 255)


def load_mark():
    im = Image.open(SRC).convert('RGB')
    w, h = im.size
    top = im.crop((0, 0, w, int(h * 0.66)))  # the mark sits above the wordmark
    diff = ImageChops.difference(top, Image.new('RGB', top.size, 'white')).convert('L')
    mark = top.crop(diff.point(lambda p: 255 if p > 18 else 0).getbbox())
    side = max(mark.size)
    square = Image.new('RGBA', (side, side), (255, 255, 255, 0))
    square.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2))
    return square


def tile(mark, size, scale, shape=None, bg_color=MINT_COLOR):
    base = Image.new('RGBA', (size, size), bg_color)
    m = mark.resize((int(size * scale),) * 2, Image.LANCZOS).convert('RGBA')
    base.paste(m, ((size - m.width) // 2, (size - m.height) // 2), m)
    if not shape:
        return base
    big = size * 4  # draw mask large, then downsample for smooth edge
    mask = Image.new('L', (big, big), 0)
    d = ImageDraw.Draw(mask)
    if shape == 'circle':
        d.ellipse((0, 0, big - 1, big - 1), fill=255)
    else:
        d.rounded_rectangle((0, 0, big - 1, big - 1), radius=int(big * 0.22), fill=255)
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    out.paste(base, (0, 0), mask.resize((size, size), Image.LANCZOS))
    return out


def main():
    if not os.path.exists(SRC):
        raise FileNotFoundError(f"Source brand lockup missing: {SRC}")
    mark = load_mark()
    for name, k in DENSITIES.items():
        folder = os.path.join(RES, f'mipmap-{name}')
        os.makedirs(folder, exist_ok=True)
        # Legacy rounded tile (mint)
        tile(mark, int(48 * k), 0.74, 'rounded', MINT_COLOR).save(os.path.join(folder, 'ic_launcher.png'))
        # Legacy round tile (mint)
        tile(mark, int(48 * k), 0.66, 'circle', MINT_COLOR).save(os.path.join(folder, 'ic_launcher_round.png'))
        # Adaptive foreground: transparent canvas, mark centered at 58% scale (within safe 66dp zone)
        tile(mark, int(108 * k), 0.58, None, (0, 0, 0, 0)).save(os.path.join(folder, 'ic_launcher_foreground.png'))

    brand = os.path.join(ROOT, 'assets', 'brand')
    os.makedirs(brand, exist_ok=True)
    tile(mark, 512, 0.74, None, MINT_COLOR).convert('RGB').save(os.path.join(brand, 'playstore-icon-512.png'))

    # Splash logo mark
    small = mark.resize((600, 600), Image.LANCZOS)
    small.save(os.path.join(brand, 'logo-mark.png'))
    images_dir = os.path.join(ROOT, 'src', 'assets', 'images')
    os.makedirs(images_dir, exist_ok=True)
    small.save(os.path.join(images_dir, 'logo-mark.png'))
    print('Partner mint-tile launcher icons generated successfully.')


if __name__ == '__main__':
    main()
```

---

## 5. Dedicated Release Signing Setup

### 5.1 Keystore Generation Command
Generate the dedicated partner upload keystore:
- Keystore file: `partner-app/android/app/lifeline360-partner-upload.keystore`
- Key alias: `lifeline360-partner-upload`
- Distinguished Name: `CN=Lifeline 360 Partner, O=Lifeline 360, C=IN`
- Validity: 10,000 days

```powershell
$KEYTOOL = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot\bin\keytool.exe"
$PW = "LfPart938Vz2mQ6w2026!"

& $KEYTOOL -genkeypair -v `
  -storetype PKCS12 `
  -keystore "partner-app/android/app/lifeline360-partner-upload.keystore" `
  -alias lifeline360-partner-upload `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -storepass $PW -keypass $PW `
  -dname "CN=Lifeline 360 Partner, O=Lifeline 360, C=IN"
```

### 5.2 `partner-app/android/keystore.properties`
Created in `partner-app/android/` (ignored by Git via `.gitignore`):

```properties
storeFile=lifeline360-partner-upload.keystore
keyAlias=lifeline360-partner-upload
storePassword=LfPart938Vz2mQ6w2026!
keyPassword=LfPart938Vz2mQ6w2026!
```

---

## 6. Step-by-Step Instructions for the Worker

Follow these phases sequentially to scaffold `partner-app/` cleanly without errors.

### Phase 1: Verify Prerequisite Package Setup
1. Confirm `packages/mobile-ui` has its `package.json`, `tsconfig.json`, and `src/index.ts` created before proceeding with npm installation in `partner-app`.
   - Path: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\packages\mobile-ui\package.json`

### Phase 2: Create Directory Tree & Configuration Files
1. Create directories:
   ```powershell
   New-Item -ItemType Directory -Force -Path "partner-app"
   New-Item -ItemType Directory -Force -Path "partner-app/assets/fonts"
   New-Item -ItemType Directory -Force -Path "partner-app/assets/brand"
   New-Item -ItemType Directory -Force -Path "partner-app/scripts"
   New-Item -ItemType Directory -Force -Path "partner-app/src/theme"
   New-Item -ItemType Directory -Force -Path "partner-app/src/store"
   New-Item -ItemType Directory -Force -Path "partner-app/src/navigation"
   New-Item -ItemType Directory -Force -Path "partner-app/src/screens"
   New-Item -ItemType Directory -Force -Path "partner-app/__tests__"
   New-Item -ItemType Directory -Force -Path "partner-app/release"
   ```
2. Write root config files:
   - `partner-app/package.json` (from §2.1)
   - `partner-app/tsconfig.json` (from §2.2)
   - `partner-app/metro.config.js` (from §2.3)
   - `partner-app/babel.config.js` (from §2.4)
   - `partner-app/index.js` (from §2.5)
   - `partner-app/app.json` (from §2.6)
   - `partner-app/.eslintrc.js` (from §2.7)
   - `partner-app/jest.config.js` (from §2.8)
   - `partner-app/.gitignore` (from §2.9)
   - `partner-app/App.tsx` (from §2.10)

### Phase 3: Copy Static Fonts and Brand Graphics
1. Copy TTF fonts:
   ```powershell
   Copy-Item "user-app/assets/fonts/*" "partner-app/assets/fonts/" -Force
   ```
2. Copy brand logo source:
   ```powershell
   Copy-Item "user-app/assets/brand/logo-full.png" "partner-app/assets/brand/" -Force
   ```

### Phase 4: Scaffold Native Android Project (`partner-app/android/`)
1. Create Android folder tree:
   ```powershell
   New-Item -ItemType Directory -Force -Path "partner-app/android/gradle/wrapper"
   New-Item -ItemType Directory -Force -Path "partner-app/android/app/src/main/assets/fonts"
   New-Item -ItemType Directory -Force -Path "partner-app/android/app/src/main/java/com/lifeline360/partner"
   New-Item -ItemType Directory -Force -Path "partner-app/android/app/src/main/res/values"
   New-Item -ItemType Directory -Force -Path "partner-app/android/app/src/main/res/drawable"
   New-Item -ItemType Directory -Force -Path "partner-app/android/app/src/main/res/mipmap-anydpi-v26"
   ```
2. Copy Gradle wrapper files from `driver-app/android/`:
   ```powershell
   Copy-Item "driver-app/android/gradlew" "partner-app/android/" -Force
   Copy-Item "driver-app/android/gradlew.bat" "partner-app/android/" -Force
   Copy-Item "driver-app/android/gradle/wrapper/*" "partner-app/android/gradle/wrapper/" -Force
   ```
3. Copy standard debug keystore:
   ```powershell
   Copy-Item "driver-app/android/app/debug.keystore" "partner-app/android/app/debug.keystore" -Force
   ```
4. Copy Android fonts:
   ```powershell
   Copy-Item "partner-app/assets/fonts/*.ttf" "partner-app/android/app/src/main/assets/fonts/" -Force
   ```
5. Write Android build and configuration files:
   - `partner-app/android/build.gradle` (from §3.2.1)
   - `partner-app/android/settings.gradle` (from §3.2.2)
   - `partner-app/android/gradle.properties` (from §3.2.3)
   - `partner-app/android/app/build.gradle` (from §3.2.5)
   - `partner-app/android/app/proguard-rules.pro` (from §3.2.6)
   - `partner-app/android/app/src/main/AndroidManifest.xml` (from §3.2.7)
   - `partner-app/android/app/src/main/java/com/lifeline360/partner/MainActivity.kt` (from §3.2.8)
   - `partner-app/android/app/src/main/java/com/lifeline360/partner/MainApplication.kt` (from §3.2.9)
   - `partner-app/android/app/src/main/res/values/strings.xml` (from §3.3.1)
   - `partner-app/android/app/src/main/res/values/styles.xml` (from §3.3.2)
   - `partner-app/android/app/src/main/res/values/colors.xml` (from §3.3.3)
   - `partner-app/android/app/src/main/res/drawable/rn_edit_text_material.xml` (from §3.3.4)
   - `partner-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` (from §3.3.5)
   - `partner-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml` (from §3.3.5)

### Phase 5: Generate Mint-Tile Launcher Icons
1. Write `partner-app/scripts/generate-icons.py` (from §4.3).
2. Run generator script:
   ```powershell
   python partner-app/scripts/generate-icons.py
   ```
3. Confirm files exist:
   - `partner-app/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`
   - `partner-app/assets/brand/playstore-icon-512.png`

### Phase 6: Generate Dedicated Upload Keystore
1. Execute keytool generation:
   ```powershell
   $KEYTOOL = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot\bin\keytool.exe"
   $PW = "LfPart938Vz2mQ6w2026!"
   & $KEYTOOL -genkeypair -v `
     -storetype PKCS12 `
     -keystore "partner-app/android/app/lifeline360-partner-upload.keystore" `
     -alias lifeline360-partner-upload `
     -keyalg RSA -keysize 2048 -validity 10000 `
     -storepass $PW -keypass $PW `
     -dname "CN=Lifeline 360 Partner, O=Lifeline 360, C=IN"
   ```
2. Create `partner-app/android/keystore.properties`:
   ```properties
   storeFile=lifeline360-partner-upload.keystore
   keyAlias=lifeline360-partner-upload
   storePassword=LfPart938Vz2mQ6w2026!
   keyPassword=LfPart938Vz2mQ6w2026!
   ```

### Phase 7: Install NPM Dependencies & Verify Wiring
1. From `partner-app/` directory:
   ```powershell
   cd "c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\partner-app"
   npm install
   ```
2. Verify TypeScript compilation:
   ```powershell
   npx tsc --noEmit
   ```
   *Expected outcome: Exit code 0, 0 errors.*
3. Verify ESLint:
   ```powershell
   npx eslint .
   ```
   *Expected outcome: Exit code 0, 0 errors.*

### Phase 8: Verify Native Android Release Build & Packaging
1. Switch to virtual drive `L:\` to avoid Windows MAX_PATH (> 260 chars) during C++ codegen/Ninja build:
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot"
   cd L:\partner-app\android
   .\gradlew.bat assembleRelease "-PreactNativeArchitectures=arm64-v8a,armeabi-v7a,x86_64"
   .\gradlew.bat --stop
   ```
2. Copy built release APK to `partner-app/release/`:
   ```powershell
   Copy-Item "L:\partner-app\android\app\build\outputs\apk\release\app-release.apk" "L:\partner-app\release\Lifeline360-Partner-1.0.0.apk" -Force
   ```
3. Verify cryptographic signing:
   ```powershell
   & "C:\Android\build-tools\36.0.0\apksigner.bat" verify --print-certs "L:\partner-app\release\Lifeline360-Partner-1.0.0.apk"
   ```
   *Verification check: Must print `CN=Lifeline 360 Partner, O=Lifeline 360, C=IN`. Must NOT mention `Android Debug`.*
4. Verify package name and application label:
   ```powershell
   & "C:\Android\build-tools\36.0.0\aapt2.exe" dump badging "L:\partner-app\release\Lifeline360-Partner-1.0.0.apk" | Select-String "package|application-label"
   ```
   *Verification check: Must output `package: name='com.lifeline360.partner'` and `application-label:'Lifeline Partner'`.*

---

## 7. Edge Cases & Troubleshooting Guide

| Issue / Failure | Root Cause | Solution |
|---|---|---|
| `Failed to get the SHA-1 for: C:\...` during Metro bundle | Metro bundle initiated from subst drive `L:` resolves symlinks back to physical `C:` drive, but only watched `L:`. | Configured `metro.config.js` with `fs.realpathSync.native(__dirname)` to include both paths in `watchFolders`. |
| `Cannot find module '@lifeline/mobile-ui'` in Metro | Metro does not follow local package symlinks outside project root. | Handled via `watchFolders` and `resolver.extraNodeModules` pointing to `mobileUiRoot`. |
| `Filename longer than 260 characters` during Gradle build | Windows MAX_PATH limit exceeded during CMake/Ninja C++ codegen. | Always run native build commands from `L:\partner-app\android` where `L:` is mapped to repo root. |
| Release build succeeds with debug certificate | Release signing not configured or fell back to debug. | Prevented by Gradle Release Guard hook in `app/build.gradle` which throws `GradleException` if `keystore.properties` is missing. |
| React Native duplicate hook/symbol collision | `packages/mobile-ui` has its own `node_modules` containing duplicate React. | In `packages/mobile-ui/package.json`, React and React Native are strictly declared under `peerDependencies`, never `dependencies`. |
| StatusBar styling props type error in TypeScript | `backgroundColor` and `translucent` props removed in RN 0.87 edge-to-edge. | Use `<StatusBar barStyle="dark-content" />` without deprecated props. |
