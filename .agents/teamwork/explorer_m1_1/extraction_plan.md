# Milestone M1: Extraction Implementation Plan for `packages/mobile-ui`

**Date**: October 29, 2026  
**Agent**: `explorer_m1_1`  
**Target Package**: `packages/mobile-ui` (`@lifeline/mobile-ui`)  
**Status**: COMPLETE / READY FOR WORKER EXECUTION  

---

## 1. Executive Summary & Zero-Regression Architecture

This document provides the definitive implementation plan for extracting the shared theme tokens, core typography, UI primitives, brand SVG assets, interactive partner widgets, and utility formatters into a standalone local package: **`packages/mobile-ui`** (`@lifeline/mobile-ui`).

### 1.1 Non-Regression Guarantee for Existing Apps
- `user-app/` and `driver-app/` currently compile with **0 TypeScript errors** (`npx tsc --noEmit` verified).
- Both apps have signed release APKs in their respective `release/` directories.
- **Rule**: `user-app/` and `driver-app/` source code and configuration must **NOT be modified or deleted** during Milestone M1.
- All extractions are purely additive: files are created in `packages/mobile-ui/`. The partner application (`partner-app/`) will consume `@lifeline/mobile-ui`. Refactoring `user-app` and `driver-app` to consume the package is scheduled for a future dedicated milestone after the Partner app ships (as mandated by `docs/PARTNER-APP-PLAN.md` Section 7).

---

## 2. Complete Directory and File Tree for `packages/mobile-ui/`

```text
packages/mobile-ui/
├── package.json                         # Package definition, version, peerDependencies
├── tsconfig.json                        # TypeScript compiler options
├── README.md                            # Package documentation and usage examples
├── assets/
│   └── fonts/                           # Plus Jakarta Sans TTF typography files
│       ├── OFL.txt                      # Font Open Font License
│       ├── PlusJakartaSans-Bold.ttf
│       ├── PlusJakartaSans-ExtraBold.ttf
│       ├── PlusJakartaSans-Medium.ttf
│       ├── PlusJakartaSans-Regular.ttf
│       └── PlusJakartaSans-SemiBold.ttf
└── src/
    ├── index.ts                         # Single root barrel export
    ├── theme/
    │   ├── index.ts                     # colors, service, font, radius, shadow tokens
    │   └── types.ts                     # ServiceKey, FontWeight, ServiceInfo, Token types
    ├── components/
    │   ├── T.tsx                        # Foundational Typography component
    │   ├── ui.tsx                       # 23 Core UI primitives (Button, Card, AppBar, Field, etc.)
    │   ├── brand.tsx                    # 6 Vector SVG Brand assets (LifelineMark, DesignedMap, etc.)
    │   └── interactive.tsx              # 5 Partner widgets (SwipeToConfirm, CountdownRing, BarChart, etc.)
    └── utils/
        ├── index.ts                     # Utils barrel
        └── format.ts                    # rupees, greeting, timeAgo, firstName, maskPhone, formatDuration
```

---

## 3. Exact Configuration Files

### 3.1 `packages/mobile-ui/package.json`

```json
{
  "name": "@lifeline/mobile-ui",
  "version": "1.0.0",
  "description": "Shared design system, theme tokens, UI primitives, brand assets, and partner widgets for Lifeline 360 mobile applications",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "files": [
    "src",
    "assets"
  ],
  "peerDependencies": {
    "@react-navigation/native": "^7.5.1",
    "lucide-react-native": ">=1.63.0",
    "react": "19.2.3",
    "react-native": "0.87.1",
    "react-native-safe-area-context": "^5.5.2",
    "react-native-svg": "^15.16.0"
  }
}
```

### 3.2 `packages/mobile-ui/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "lib": [
      "es2019",
      "es2020",
      "es2021",
      "es2022",
      "esnext"
    ],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "bundler",
    "customConditions": ["react-native"],
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@lifeline/mobile-ui": ["./src/index.ts"],
      "@lifeline/mobile-ui/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "**/Pods/**"
  ]
}
```

---

## 4. Detailed File Manifests & Source Implementations

### 4.1 `packages/mobile-ui/src/theme/types.ts`
```typescript
export type ServiceKey =
  | 'doctor'
  | 'medicine'
  | 'nursing'
  | 'ambulance'
  | 'lab'
  | 'blood'
  | 'membership'
  | 'als'
  | 'bls'
  | 'icu';

export type ServiceInfo = {
  bg: string;
  fg: string;
  text: string;
  label: string;
};

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
```

### 4.2 `packages/mobile-ui/src/theme/index.ts`
Unifies tokens from `user-app` and `driver-app`, explicitly including the mint palette for Medicine Vendor (`#E2F5EA`), lavender palette for Nurse/Caretaker (`#ECE9FB`), and dark navy palette for night/alert states:
```typescript
import { FontWeight, ServiceInfo, ServiceKey } from './types';

export * from './types';

/**
 * Lifeline 360 Design Tokens.
 * - Teal + White lead as primary brand palette.
 * - Service pastel tokens: Medicine (#E2F5EA mint) and Nursing (#ECE9FB lavender)
 * - Navy palette for high-contrast driver/partner alert sheets and dark widgets.
 * - Red is strictly reserved for emergency actions and cancellations.
 */
export const colors = {
  // Brand Teals
  teal: '#128078',
  tealDark: '#0F6B66',
  tealDeep: '#0B3B3A',
  tealSoft: '#DDF1EC',
  tealTint: '#E6F5F2',
  tealLine: '#9CCFC8',

  // Ink / Typography
  ink: '#1C2340',
  ink2: '#4A5170',
  muted: '#646A88',
  faint: '#9AA0B4',

  // Backgrounds & Surfaces
  bg: '#F4F6F5',
  surface: '#FFFFFF',
  surface2: '#F2F4F3',
  line: '#E6E9E8',
  lineStrong: '#D4D8D7',

  // Alerts & Status Accents
  green: '#1A8A57',
  greenSoft: '#E5F7EE',
  greenText: '#136B45',

  amber: '#C99A12',
  amberSoft: '#FFF6DA',
  amberText: '#7A5A00',

  red: '#D13238',
  redSoft: '#FDECEC',
  redText: '#A3212A',

  sky: '#1D6FAE',
  skySoft: '#E3EFFB',
  skyText: '#11568A',

  white: '#FFFFFF',

  // Driver & Partner Dark / Night Palette
  navy: '#0B1B2B',
  navyCard: '#13263A',
  navySurface: '#182E46',
  navyLine: '#1E3B59',
  navyMuted: '#8E9CAE',
  navyText: '#EBF1F7',
};

/**
 * One Service, One Colour dictionary.
 * Maps service categories to accessible background, accent foreground, and text colors.
 */
export const service: Record<ServiceKey, ServiceInfo> = {
  doctor: { bg: '#DDF1EC', fg: '#128078', text: '#0B3B3A', label: 'Doctor' },
  medicine: { bg: '#E2F5EA', fg: '#1A8A57', text: '#0E4A31', label: 'Medicine' },
  nursing: { bg: '#ECE9FB', fg: '#6F5BC9', text: '#3A2E86', label: 'Nursing' },
  ambulance: { bg: '#FDECEC', fg: '#D13238', text: '#A3212A', label: 'Ambulance' },
  lab: { bg: '#E3EFFB', fg: '#1D6FAE', text: '#0E3F66', label: 'Lab test' },
  blood: { bg: '#FDE8EF', fg: '#C62E57', text: '#9B1C47', label: 'Blood bank' },
  membership: { bg: '#FFF6DA', fg: '#C99A12', text: '#7A5A00', label: 'Membership' },
  als: { bg: '#FDECEC', fg: '#D92D20', text: '#A3212A', label: 'Advanced Life Support (ALS)' },
  bls: { bg: '#E3EFFB', fg: '#0BA5EC', text: '#11568A', label: 'Basic Life Support (BLS)' },
  icu: { bg: '#FDE8EF', fg: '#C62E57', text: '#9B1C47', label: 'ICU on Wheels' },
};

export const font: Record<FontWeight, string> = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extrabold: 'PlusJakartaSans-ExtraBold',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const shadow = {
  card: {
    boxShadow: '0px 1px 3px rgba(28, 35, 64, 0.08)',
    elevation: 2,
  },
  raised: {
    boxShadow: '0px 4px 14px rgba(28, 35, 64, 0.12)',
    elevation: 4,
  },
  sheet: {
    boxShadow: '0px -4px 20px rgba(28, 35, 64, 0.12)',
    elevation: 8,
  },
};
```

---

### 4.3 `packages/mobile-ui/src/components/T.tsx`
```typescript
import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { colors, font, FontWeight } from '../theme';

export type TProps = TextProps & {
  w?: FontWeight;
  size?: number;
  color?: string;
  center?: boolean;
  lh?: number;
  style?: StyleProp<TextStyle>;
};

/**
 * App typography component.
 * Uses Plus Jakarta Sans with explicit weight keys, ensuring Android selects font files directly.
 * Caps `maxFontSizeMultiplier` at 1.3 to protect scannable partner layouts from accessibility overflow.
 */
export function T({
  w = 'regular',
  size = 14,
  color = colors.ink,
  center,
  lh,
  style,
  ...rest
}: TProps) {
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[
        {
          fontFamily: font[w],
          fontSize: size,
          color,
          includeFontPadding: false,
          textAlign: center ? 'center' : undefined,
          lineHeight: lh,
        },
        style,
      ]}
    />
  );
}

export default T;
```

---

### 4.4 `packages/mobile-ui/src/components/ui.tsx`
Contains the complete set of 23 foundational components:
```typescript
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  Switch,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, ChevronRight, Star } from 'lucide-react-native';
import T from './T';
import { colors, radius, service, ServiceKey, shadow } from '../theme';

/* ------------------------------------------------------------------ Button */

export type ButtonVariant = 'primary' | 'outline' | 'soft' | 'danger' | 'dark' | 'ghost';

const BTN: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.teal, fg: colors.white },
  outline: { bg: colors.white, fg: colors.teal, border: colors.teal },
  soft: { bg: colors.tealTint, fg: colors.tealDark },
  danger: { bg: colors.red, fg: colors.white },
  dark: { bg: colors.ink, fg: colors.white },
  ghost: { bg: colors.white, fg: colors.ink, border: colors.lineStrong },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  disabled,
  loading,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const v = BTN[variant];
  const h = size === 'lg' ? 50 : size === 'md' ? 44 : 36;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: h,
          borderRadius: size === 'sm' ? radius.sm : radius.md,
          backgroundColor: v.bg,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          paddingHorizontal: size === 'sm' ? 12 : 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon}
          <T w="bold" size={size === 'sm' ? 13 : 15} color={v.fg}>
            {title}
          </T>
        </>
      )}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ AppBar */

export function AppBar({
  title,
  subtitle,
  right,
  onBack,
  border = true,
  transparent,
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  border?: boolean;
  transparent?: boolean;
}) {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: transparent ? 'transparent' : colors.white,
        borderBottomWidth: border && !transparent ? 1 : 0,
        borderBottomColor: colors.line,
      }}>
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 }}>
        <IconButton label="Back" onPress={onBack ?? (() => nav.goBack())}>
          <ArrowLeft size={22} color={colors.ink} />
        </IconButton>
        <View style={{ flex: 1, paddingRight: 8 }}>
          {title ? (
            <T w="bold" size={17} numberOfLines={1}>
              {title}
            </T>
          ) : null}
          {subtitle ? (
            <T size={12} color={colors.muted} numberOfLines={1}>
              {subtitle}
            </T>
          ) : null}
        </View>
        {right}
      </View>
    </View>
  );
}

export function IconButton({
  children,
  onPress,
  label,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, opacity: pressed ? 0.6 : 1 },
        style,
      ]}>
      {children}
    </Pressable>
  );
}

/* --------------------------------------------------------- Layout helpers */

export function Section({
  title,
  action,
  onAction,
  children,
  style,
  padded = true,
}: {
  title?: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  return (
    <View style={[{ backgroundColor: colors.white, paddingVertical: 16, paddingHorizontal: padded ? 16 : 0 }, style]}>
      {title ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            paddingHorizontal: padded ? 0 : 16,
          }}>
          <T w="bold" size={16}>
            {title}
          </T>
          {action ? (
            <Pressable onPress={onAction} hitSlop={8}>
              <T w="bold" size={13} color={colors.teal}>
                {action}
              </T>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export function Card({ children, style, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const base: ViewStyle = { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14 };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [base, style, pressed && { opacity: 0.85 }]}>
      {children}
    </Pressable>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: 1, backgroundColor: colors.line }, style]} />;
}

export function Gap({ h = 8 }: { h?: number }) {
  return <View style={{ height: h }} />;
}

/* ------------------------------------------------------------- List rows */

export function ListRow({
  icon,
  iconBg,
  title,
  subtitle,
  right,
  onPress,
  last,
  danger,
}: {
  icon?: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: '#EEF0EF',
        opacity: pressed ? 0.6 : 1,
      })}>
      {icon ? (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: iconBg ?? colors.tealTint,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {icon}
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <T w="semibold" size={14} color={danger ? colors.redText : colors.ink}>
          {title}
        </T>
        {subtitle ? (
          <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
            {subtitle}
          </T>
        ) : null}
      </View>
      {right ?? (onPress ? <ChevronRight size={18} color={colors.faint} /> : null)}
    </Pressable>
  );
}

export function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, gap: 16 }}>
      <T size={13} color={colors.ink2}>
        {label}
      </T>
      <T size={13} w={bold ? 'extrabold' : 'semibold'} style={{ flexShrink: 1, textAlign: 'right' }}>
        {value}
      </T>
    </View>
  );
}

/* ------------------------------------------------------------- Chips & Badges */

export function Chip({
  label,
  active,
  onPress,
  icon,
  style,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={[
        {
          height: 34,
          paddingHorizontal: 13,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: active ? colors.teal : colors.lineStrong,
          backgroundColor: active ? colors.tealTint : colors.white,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        },
        style,
      ]}>
      {icon}
      <T w={active ? 'bold' : 'semibold'} size={12.5} color={active ? colors.tealDark : colors.ink}>
        {label}
      </T>
    </Pressable>
  );
}

export function Badge({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: bg, alignSelf: 'flex-start' }}>
      <T w="bold" size={11} color={fg}>
        {label}
      </T>
    </View>
  );
}

const STATUS: Record<string, { bg: string; fg: string }> = {
  Confirmed: { bg: colors.greenSoft, fg: colors.greenText },
  Completed: { bg: colors.greenSoft, fg: colors.greenText },
  Delivered: { bg: colors.greenSoft, fg: colors.greenText },
  Accepted: { bg: colors.greenSoft, fg: colors.greenText },
  Active: { bg: colors.greenSoft, fg: colors.greenText },
  Approved: { bg: colors.greenSoft, fg: colors.greenText },
  'Report ready': { bg: '#ECE9FB', fg: '#5B4BB7' },
  Pending: { bg: colors.amberSoft, fg: colors.amberText },
  Scheduled: { bg: colors.skySoft, fg: colors.skyText },
  'On the way': { bg: colors.skySoft, fg: colors.skyText },
  'Out for delivery': { bg: colors.skySoft, fg: colors.skyText },
  'Sample collected': { bg: colors.skySoft, fg: colors.skyText },
  Preparing: { bg: colors.amberSoft, fg: colors.amberText },
  Packing: { bg: colors.amberSoft, fg: colors.amberText },
  Ready: { bg: colors.skySoft, fg: colors.skyText },
  'Handed over': { bg: colors.skySoft, fg: colors.skyText },
  'Checked in': { bg: colors.tealSoft, fg: colors.tealDark },
  Cancelled: { bg: '#F1EFEA', fg: colors.ink2 },
  Rejected: { bg: colors.redSoft, fg: colors.redText },
  Emergency: { bg: colors.redSoft, fg: colors.redText },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { bg: colors.surface2, fg: colors.ink2 };
  return <Badge label={status} bg={s.bg} fg={s.fg} />;
}

export function ServiceBadge({ kind }: { kind: ServiceKey }) {
  const s = service[kind];
  return <Badge label={s.label} bg={s.bg} fg={s.text} />;
}

export function Rating({ value, reviews }: { value: string | number; reviews?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
          backgroundColor: colors.green,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 6,
        }}>
        <T w="bold" size={12} color={colors.white}>
          {value}
        </T>
        <Star size={11} color={colors.white} fill={colors.white} />
      </View>
      {reviews ? (
        <T size={12} color={colors.muted}>
          {reviews} patient reviews
        </T>
      ) : null}
    </View>
  );
}

export function Segmented<K extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.surface2, borderRadius: radius.md, padding: 4, gap: 4 }}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 9,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: on ? colors.white : 'transparent',
              ...(on ? shadow.card : null),
            }}>
            <T w={on ? 'bold' : 'semibold'} size={13} color={on ? colors.ink : colors.muted}>
              {o.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Switch
      accessibilityLabel={label}
      value={value}
      onValueChange={onChange}
      trackColor={{ true: colors.teal, false: '#C9CECC' }}
      thumbColor={colors.white}
    />
  );
}

export function RadioDot({ on }: { on: boolean }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: on ? 6 : 1.5,
        borderColor: on ? colors.teal : colors.lineStrong,
        backgroundColor: colors.white,
      }}
    />
  );
}

export function CheckBox({ on }: { on: boolean }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: on ? 0 : 1.5,
        borderColor: colors.lineStrong,
        backgroundColor: on ? colors.teal : colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {on ? <Check size={15} color={colors.white} strokeWidth={3} /> : null}
    </View>
  );
}

/* ----------------------------------------------------------------- Input */

export function Field({
  label,
  hint,
  error,
  style,
  left,
  ...rest
}: TextInputProps & { label?: string; hint?: string; error?: string; left?: React.ReactNode }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <View style={[{ gap: 6 }, style as StyleProp<ViewStyle>]}>
      {label ? (
        <T w="semibold" size={13} color={colors.ink2}>
          {label}
        </T>
      ) : null}
      <View
        style={{
          minHeight: 50,
          borderRadius: radius.md,
          borderWidth: focus ? 1.5 : 1,
          borderColor: error ? colors.red : focus ? colors.teal : colors.lineStrong,
          backgroundColor: colors.white,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          gap: 8,
        }}>
        {left}
        <TextInput
          placeholderTextColor={colors.faint}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...rest}
          style={{ flex: 1, fontFamily: 'PlusJakartaSans-Medium', fontSize: 15, color: colors.ink, paddingVertical: 12 }}
        />
      </View>
      {error ? (
        <T size={12} color={colors.redText}>
          {error}
        </T>
      ) : hint ? (
        <T size={12} color={colors.muted}>
          {hint}
        </T>
      ) : null}
    </View>
  );
}

/* --------------------------------------------------------------- Avatars */

export function Avatar({
  source,
  name,
  size = 48,
  rounded = 'full',
  tint,
}: {
  source?: ImageSourcePropType;
  name: string;
  size?: number;
  rounded?: 'full' | 'md';
  tint?: { bg: string; fg: string };
}) {
  const r = rounded === 'full' ? size / 2 : size * 0.22;
  if (source) return <Image source={source} style={{ width: size, height: size, borderRadius: r }} />;
  const initials = name
    .replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s*/i, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: r,
        backgroundColor: tint?.bg ?? colors.tealTint,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <T w="bold" size={size * 0.34} color={tint?.fg ?? colors.tealDark}>
        {initials}
      </T>
    </View>
  );
}

/* ------------------------------------------------------- Sticky bottom bar */

export function BottomBar({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.line,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12) + 4,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

/* --------------------------------------------------------- Status timeline */

export function Timeline({ steps, current }: { steps: { title: string; note?: string }[]; current: number }) {
  return (
    <View>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        return (
          <View key={s.title} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ alignItems: 'center', width: 22 }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: done ? colors.teal : colors.white,
                  borderWidth: done ? 0 : 2,
                  borderColor: active ? colors.teal : colors.lineStrong,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {done ? <Check size={13} color={colors.white} strokeWidth={3} /> : active ? <View style={styles.pulse} /> : null}
              </View>
              {!last ? <View style={{ width: 2, flex: 1, minHeight: 22, backgroundColor: done ? colors.teal : colors.line }} /> : null}
            </View>
            <View style={{ flex: 1, paddingBottom: last ? 0 : 18 }}>
              <T w={active || done ? 'bold' : 'semibold'} size={14} color={active || done ? colors.ink : colors.muted}>
                {s.title}
              </T>
              {s.note ? (
                <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
                  {s.note}
                </T>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------ Empty state */

export function EmptyState({
  icon,
  title,
  text,
  action,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32, gap: 10 }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.tealTint, alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </View>
      <T w="bold" size={16} center>
        {title}
      </T>
      <T size={13} color={colors.muted} center lh={19}>
        {text}
      </T>
      {action ? <Button title={action} onPress={onAction} size="md" style={{ marginTop: 6, alignSelf: 'stretch' }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.teal },
});
```

---

### 4.5 `packages/mobile-ui/src/components/brand.tsx`
```typescript
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';
import T from './T';
import { colors } from '../theme';

const PETAL = 'M57 55C46 58 22 56 16 40C10 24 24 10 40 13C54 16 60 34 57 55Z';
const CROSS = 'M49 33H71V49H87V71H71V87H49V71H33V49H49Z';

/** Vector redraw of the Lifeline 360 mark: four gradient petals and a cream cross. */
export function LifelineMark({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityLabel="Lifeline 360">
      <Defs>
        <LinearGradient id="pA" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FF6BF0" />
          <Stop offset="1" stopColor="#E00ED6" />
        </LinearGradient>
        <LinearGradient id="pB" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFB24A" />
          <Stop offset="1" stopColor="#FF2D72" />
        </LinearGradient>
        <LinearGradient id="pC" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#22DCEB" />
          <Stop offset="1" stopColor="#34E38E" />
        </LinearGradient>
        <LinearGradient id="pD" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#2FADFF" />
          <Stop offset="1" stopColor="#C04DFF" />
        </LinearGradient>
        <RadialGradient id="pX" cx="0.5" cy="0.45" r="0.6">
          <Stop offset="0" stopColor="#FFFEFA" />
          <Stop offset="1" stopColor="#FBE3B6" />
        </RadialGradient>
      </Defs>
      <Path d={PETAL} fill="url(#pA)" />
      <Path d={PETAL} fill="url(#pB)" transform="translate(120 0) scale(-1 1)" />
      <Path d={PETAL} fill="url(#pC)" transform="translate(0 120) scale(1 -1)" />
      <Path d={PETAL} fill="url(#pD)" transform="rotate(180 60 60)" />
      <Path d={CROSS} fill="url(#pX)" stroke="#F3D7A2" strokeWidth={2.5} strokeLinejoin="round" />
    </Svg>
  );
}

export function Wordmark({ size = 17, light }: { size?: number; light?: boolean }) {
  return (
    <T w="extrabold" size={size} color={light ? colors.white : colors.ink}>
      Lifeline <T w="extrabold" size={size} color={light ? '#7FD3C7' : colors.teal}>360</T>
    </T>
  );
}

/** Horizontal or vertical fade, drawn with SVG so it works on every architecture. */
export function Fade({
  color,
  to,
  fromOpacity = 1,
  toOpacity = 0,
  direction = 'horizontal',
  stops = [0, 1],
  style,
}: {
  color: string;
  to?: string;
  fromOpacity?: number;
  toOpacity?: number;
  direction?: 'horizontal' | 'vertical';
  stops?: [number, number];
  style?: StyleProp<ViewStyle>;
}) {
  const id = 'g' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, style]}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2={direction === 'horizontal' ? '1' : '0'} y2={direction === 'horizontal' ? '0' : '1'}>
            <Stop offset={stops[0]} stopColor={color} stopOpacity={fromOpacity} />
            <Stop offset={stops[1]} stopColor={to ?? color} stopOpacity={toOpacity} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

/* ---------------------------------------------- Two-tone service icons */

export function DuoIcon({ name, size = 32 }: { name: 'ambulance' | 'blood' | 'report' | 'membership'; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {name === 'ambulance' ? (
        <G>
          <Rect x="2" y="8" width="18" height="15" rx="3" fill="#D13238" />
          <Path d="M20 12h5.4a2 2 0 0 1 1.7 1l2.4 4.2V23H20Z" fill="#F08A8E" />
          <Path d="M11 12.5v7M7.5 16h7" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
          <Rect x="21.5" y="13.5" width="4.2" height="3.6" rx="1" fill="#FFFFFF" opacity={0.9} />
          <Circle cx="8" cy="24" r="3.2" fill="#1C2340" />
          <Circle cx="23.5" cy="24" r="3.2" fill="#1C2340" />
          <Circle cx="8" cy="24" r="1.2" fill="#FFFFFF" />
          <Circle cx="23.5" cy="24" r="1.2" fill="#FFFFFF" />
        </G>
      ) : null}
      {name === 'blood' ? (
        <G>
          <Path d="M16 3c4 6 9 10.5 9 16.2A9 9 0 0 1 7 19.2C7 13.5 12 9 16 3Z" fill="#F27BA2" />
          <Path d="M16 3c4 6 9 10.5 9 16.2A9 9 0 0 1 16 28.2Z" fill="#C62E57" />
          <Path d="M11.5 19.5A4.5 4.5 0 0 0 16 24" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" fill="none" />
        </G>
      ) : null}
      {name === 'report' ? (
        <G>
          <Rect x="6" y="3" width="20" height="26" rx="3.5" fill="#BFDDF6" />
          <Path d="M19 3h3.5A3.5 3.5 0 0 1 26 6.5V10h-4a3 3 0 0 1-3-3Z" fill="#7DB8E8" />
          <Rect x="10" y="11.5" width="11" height="2.2" rx="1.1" fill="#1D6FAE" />
          <Rect x="10" y="16" width="8" height="2.2" rx="1.1" fill="#1D6FAE" />
          <Path d="M10 23.5h2.5l1.6-2.6 2 4 1.6-2.2H22" stroke="#1D6FAE" strokeWidth={1.9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      ) : null}
      {name === 'membership' ? (
        <G>
          <Rect x="2" y="7" width="28" height="19" rx="3.5" fill="#F5CB4E" />
          <Rect x="2" y="11" width="28" height="3.6" fill="#C99A12" />
          <Rect x="5.5" y="19" width="9" height="2.3" rx="1.15" fill="#FFFFFF" />
          <Path d="M24 17.3l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3Z" fill="#FFFFFF" />
        </G>
      ) : null}
    </Svg>
  );
}

/** Medicine pack thumbnail: a tinted tile with a blister strip, coloured per category. */
export function ProductThumb({ tint, size = 64 }: { tint: { bg: string; fg: string }; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: 12, backgroundColor: tint.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size * 0.66} height={size * 0.66} viewBox="0 0 40 40">
        <Rect x="5" y="9" width="30" height="22" rx="4" fill="#FFFFFF" />
        <Rect x="5" y="9" width="30" height="22" rx="4" fill={tint.fg} opacity={0.14} />
        {[0, 1, 2].map((c) =>
          [0, 1].map((r) => <Rect key={`${c}${r}`} x={9 + c * 8.5} y={13 + r * 8} width="6" height="5" rx="2.5" fill={tint.fg} opacity={0.85} />),
        )}
      </Svg>
    </View>
  );
}

/* --------------------------------------------------- Designed street map */

type Pt = [number, number];
const ROUTE: Pt[] = [
  [60, 430],
  [60, 290],
  [160, 290],
  [156, 152],
  [232, 150],
  [268, 70],
];

function along(points: Pt[], t: number): { p: Pt; angle: number } {
  const segs = points.slice(1).map((p, i) => {
    const a = points[i];
    return { a, b: p, len: Math.hypot(p[0] - a[0], p[1] - a[1]) };
  });
  const total = segs.reduce((s, x) => s + x.len, 0);
  let d = Math.min(Math.max(t, 0), 1) * total;
  for (const s of segs) {
    if (d <= s.len) {
      const k = s.len ? d / s.len : 0;
      return {
        p: [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k],
        angle: (Math.atan2(s.b[1] - s.a[1], s.b[0] - s.a[0]) * 180) / Math.PI,
      };
    }
    d -= s.len;
  }
  const last = segs[segs.length - 1];
  return { p: last.b, angle: (Math.atan2(last.b[1] - last.a[1], last.b[0] - last.a[0]) * 180) / Math.PI };
}

export function DesignedMap({
  progress,
  destinationLabel = 'Manipal Hospital',
  showRoute = true,
  height = 540,
}: {
  progress?: number;
  destinationLabel?: string;
  showRoute?: boolean;
  height?: number;
}) {
  const routePath = 'M' + ROUTE.map((p) => p.join(' ')).join('L');
  const vehicle = progress != null ? along(ROUTE, progress) : null;
  return (
    <Svg width="100%" height={height} viewBox="0 0 390 540" preserveAspectRatio="xMidYMid slice">
      <Rect width="390" height="540" fill="#EEF0EE" />
      <Path d="M250 0C262 60 300 90 390 96V0Z" fill="#D7EBDD" />
      <Path d="M0 360C40 352 70 372 92 400C108 420 100 470 60 500L0 520Z" fill="#D7EBDD" />
      <Path d="M300 300C330 290 370 300 390 320V420C360 410 320 400 300 380C285 365 285 310 300 300Z" fill="#CFE3F3" />
      <G stroke="#FFFFFF" fill="none" strokeLinecap="round">
        <Path d="M-10 150C80 140 160 160 230 150S330 120 400 130" strokeWidth={14} />
        <Path d="M150 -10C160 90 140 200 160 300S150 450 170 560" strokeWidth={12} />
        <Path d="M-10 290H400" strokeWidth={9} />
        <Path d="M60 -10V560M270 -10C276 120 268 220 280 560" strokeWidth={7} />
        <Path d="M-10 70H400M-10 220H400M-10 430H400M-10 500H400" strokeWidth={5} />
        <Path d="M110 -10V560M210 -10V560M330 -10V560" strokeWidth={4} />
      </G>
      <Path d="M-10 150C80 140 160 160 230 150S330 120 400 130" stroke="#F3D79B" strokeWidth={6} fill="none" strokeLinecap="round" />
      {showRoute ? (
        <G>
          <Path d={routePath} fill="none" stroke="#1C2340" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={0.2} />
          <Path d={routePath} fill="none" stroke={colors.teal} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          <G transform="translate(268 66)">
            <Rect x="-56" y="-36" width="112" height="24" rx="6" fill="#1C2340" />
            <Circle r="9" fill="#FFFFFF" stroke="#1C2340" strokeWidth={3} />
            <Path d="M-3.5 0H3.5M0 -3.5V3.5" stroke="#D13238" strokeWidth={2.4} strokeLinecap="round" />
          </G>
          <G transform="translate(60 430)">
            <Circle r="16" fill={colors.teal} opacity={0.18} />
            <Circle r="7" fill={colors.teal} stroke="#FFFFFF" strokeWidth={3} />
          </G>
        </G>
      ) : (
        <G transform="translate(195 270)">
          <Circle r="40" fill={colors.teal} opacity={0.12} />
          <Circle r="9" fill={colors.teal} stroke="#FFFFFF" strokeWidth={3} />
        </G>
      )}
      {vehicle ? (
        <G transform={`translate(${vehicle.p[0]} ${vehicle.p[1]}) rotate(${vehicle.angle})`}>
          <Rect x="-15" y="-9" width="30" height="18" rx="5" fill="#FFFFFF" stroke="#D13238" strokeWidth={2} />
          <Rect x="6" y="-7" width="7" height="14" rx="2" fill="#9CC9F0" />
          <Path d="M-8 0H0M-4 -4V4" stroke="#D13238" strokeWidth={2.2} strokeLinecap="round" />
        </G>
      ) : null}
      {showRoute ? <MapLabel x={268} y={48} text={destinationLabel} /> : null}
    </Svg>
  );
}

function MapLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <SvgText x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF" fontFamily="PlusJakartaSans-Bold">
      {text}
    </SvgText>
  );
}
```

---

### 4.6 `packages/mobile-ui/src/components/interactive.tsx`
Contains interactive partner & driver components:
```typescript
import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ChevronRight, Power } from 'lucide-react-native';
import T from './T';
import { colors, radius, shadow } from '../theme';

/* -------------------------------------------------------- SwipeToConfirm */

export function SwipeToConfirm({
  title = 'SWIPE TO ACCEPT',
  onConfirm,
  color = colors.teal,
  textColor = colors.white,
  disabled,
}: {
  title?: string;
  onConfirm: () => void;
  color?: string;
  textColor?: string;
  disabled?: boolean;
}) {
  const [containerWidth, setContainerWidth] = useState(300);
  const pan = useRef(new Animated.Value(0)).current;
  const knobSize = 50;
  const maxDrag = Math.max(0, containerWidth - knobSize - 8);

  const latest = useRef({ onConfirm, maxDrag, disabled });
  latest.current = { onConfirm, maxDrag, disabled };
  const busy = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !latest.current.disabled && !busy.current,
      onMoveShouldSetPanResponder: (_, g) => !latest.current.disabled && !busy.current && Math.abs(g.dx) > 4,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          pan.setValue(Math.min(gestureState.dx, latest.current.maxDrag));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const max = latest.current.maxDrag;
        if (gestureState.dx >= max * 0.75) {
          busy.current = true;
          Animated.timing(pan, {
            toValue: max,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            latest.current.onConfirm();
            setTimeout(() => {
              pan.setValue(0);
              busy.current = false;
            }, 600);
          });
        } else {
          Animated.spring(pan, {
            toValue: 0,
            bounciness: 12,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      style={{
        height: 58,
        backgroundColor: colors.navySurface,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        borderColor: color,
        justifyContent: 'center',
        paddingHorizontal: 4,
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
      }}>
      <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
        <T w="extrabold" size={14} color={textColor} style={{ letterSpacing: 1.2 }}>
          {title}
        </T>
      </View>
      <Animated.View
        style={{
          transform: [{ translateX: pan }],
          width: knobSize,
          height: knobSize,
          borderRadius: knobSize / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadow.raised,
        }}
        {...panResponder.panHandlers}>
        <ChevronRight size={26} color={colors.white} strokeWidth={2.8} />
      </Animated.View>
    </View>
  );
}

/* -------------------------------------------------------- CountdownRing */

export function CountdownRing({
  seconds,
  maxSeconds = 30,
  size = 110,
  stroke = 7,
}: {
  seconds: number;
  maxSeconds?: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(1, seconds / maxSeconds));
  const dashOffset = circ * (1 - progress);
  const ringColor = seconds <= 8 ? colors.red : seconds <= 15 ? colors.amber : colors.teal;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.navySurface}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={ringColor}
          strokeWidth={stroke}
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <T w="extrabold" size={32} color={colors.white}>
          {seconds}
        </T>
        <T size={10} color={colors.navyMuted} w="bold">
          SEC
        </T>
      </View>
    </View>
  );
}

/* -------------------------------------------------------- OnlineToggle */

export function OnlineToggle({
  isOnline,
  onToggle,
  disabled,
}: {
  isOnline: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isOnline ? colors.greenSoft : colors.surface2,
          borderRadius: radius.pill,
          borderWidth: 1.5,
          borderColor: isOnline ? colors.green : colors.lineStrong,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: isOnline ? colors.green : colors.muted,
          }}
        />
        <T w="bold" size={15} color={isOnline ? colors.greenText : colors.ink}>
          {isOnline ? 'ONLINE · READY FOR REQUESTS' : 'OFFLINE · TAP TO GO ONLINE'}
        </T>
      </View>
      <Power size={20} color={isOnline ? colors.green : colors.muted} />
    </Pressable>
  );
}

/* ------------------------------------------------------------ StatTile */

export function StatTile({
  label,
  value,
  sublabel,
  icon,
  dark,
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: dark ? colors.navySurface : colors.surface2,
        borderRadius: radius.md,
        padding: 12,
        borderWidth: 1,
        borderColor: dark ? colors.navyLine : colors.line,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <T size={11} color={dark ? colors.navyMuted : colors.muted} w="semibold">
          {label.toUpperCase()}
        </T>
        {icon}
      </View>
      <T w="extrabold" size={18} color={dark ? colors.white : colors.ink}>
        {value}
      </T>
      {sublabel ? (
        <T size={10} color={dark ? colors.navyMuted : colors.faint} style={{ marginTop: 2 }}>
          {sublabel}
        </T>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------ BarChart */

export function BarChart({
  data,
  height = 140,
}: {
  data: { label: string; amount: number; active?: boolean }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  return (
    <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 10 }}>
      {data.map((item, idx) => {
        const barHeight = Math.max(12, (item.amount / max) * (height - 36));
        return (
          <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
            <T size={10} color={item.active ? colors.teal : colors.faint} w={item.active ? 'bold' : 'regular'} style={{ marginBottom: 4 }}>
              {item.amount > 0 ? `₹${Math.round(item.amount / 100) * 100}` : '0'}
            </T>
            <View
              style={{
                width: 22,
                height: barHeight,
                backgroundColor: item.active ? colors.teal : colors.surface2,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                borderWidth: item.active ? 0 : 1,
                borderColor: colors.lineStrong,
              }}
            />
            <T size={11} color={item.active ? colors.teal : colors.muted} w={item.active ? 'bold' : 'semibold'} style={{ marginTop: 6 }}>
              {item.label}
            </T>
          </View>
        );
      })}
    </View>
  );
}
```

---

### 4.7 `packages/mobile-ui/src/utils/format.ts`
```typescript
/**
 * Formats a number to Indian Rupee notation (e.g. ₹1,250 or − ₹500).
 */
export const rupees = (n: number | null | undefined): string =>
  n == null ? '—' : (n < 0 ? '− ₹' : '₹') + Math.round(Math.abs(n)).toLocaleString('en-IN');

/**
 * Returns contextual greeting string.
 */
export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Converts a millisecond timestamp to human-readable relative time string.
 */
export function timeAgo(at: number | Date | string): string {
  const timeMs = typeof at === 'number' ? at : new Date(at).getTime();
  const m = Math.round((Date.now() - timeMs) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

/**
 * Extracts first name from a full name string, with a fallback.
 */
export const firstName = (name?: string, fallback = 'there'): string =>
  (name || '').trim().split(' ')[0] || fallback;

/**
 * Formats and masks phone number for privacy (+91 98••• ••210).
 */
export const maskPhone = (p: string): string =>
  p.length >= 10 ? `+91 ${p.slice(0, 2)}••• ••${p.slice(-3)}` : p;

/**
 * Formats seconds into mm:ss format.
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
```

### 4.8 `packages/mobile-ui/src/utils/index.ts`
```typescript
export * from './format';
```

---

### 4.9 `packages/mobile-ui/src/index.ts` (Barrel Export Structure)
```typescript
/**
 * @lifeline/mobile-ui
 * Unified design system, tokens, UI primitives, brand SVGs, and partner widgets for Lifeline 360.
 */

// Theme Tokens & Types
export * from './theme';

// Foundational Typography
export { default as T } from './components/T';
export * from './components/T';

// Core UI Primitives
export * from './components/ui';

// Brand SVG Assets
export * from './components/brand';

// Interactive & Partner Widgets
export * from './components/interactive';

// Utility Formatters
export * from './utils';
```

---

### 4.10 `packages/mobile-ui/README.md`
```markdown
# @lifeline/mobile-ui

Shared design tokens, UI components, typography, brand assets, and partner widgets for the Lifeline 360 mobile ecosystem.

## Features
- **Theme Tokens**: Standardized colors (teal, mint, lavender, navy), Plus Jakarta Sans typography, border radius, and elevation shadows.
- **Core Primitives**: Button, AppBar, Card, Field, Chip, Badge, Toggle, Timeline, Avatar, EmptyState, etc.
- **Brand SVG Assets**: Vector-drawn LifelineMark, Wordmark, DuoIcon, ProductThumb, and DesignedMap.
- **Partner Widgets**: SwipeToConfirm, CountdownRing, OnlineToggle, StatTile, BarChart.
- **Format Utilities**: Indian Rupee currency notation, timeAgo, maskPhone, greeting, and formatDuration.

## Local Linking
In `partner-app/package.json`:
```json
{
  "dependencies": {
    "@lifeline/mobile-ui": "file:../packages/mobile-ui"
  }
}
```
```

---

## 5. Step-by-Step Instructions for the Worker

The implementing Worker agent should execute these steps strictly in order:

### Step 1: Create Directories
Create the target directory tree under `packages/mobile-ui/`:
```powershell
New-Item -ItemType Directory -Path "packages/mobile-ui/assets/fonts" -Force
New-Item -ItemType Directory -Path "packages/mobile-ui/src/theme" -Force
New-Item -ItemType Directory -Path "packages/mobile-ui/src/components" -Force
New-Item -ItemType Directory -Path "packages/mobile-ui/src/utils" -Force
```

### Step 2: Copy Font Assets
Copy the 5 Plus Jakarta Sans TTF files and license from `user-app/assets/fonts/` into `packages/mobile-ui/assets/fonts/`:
```powershell
Copy-Item "user-app/assets/fonts/*" -Destination "packages/mobile-ui/assets/fonts/" -Force
```

### Step 3: Write Package Definition & TypeScript Config
1. Write `packages/mobile-ui/package.json` with the exact specification in Section 3.1.
2. Write `packages/mobile-ui/tsconfig.json` with the exact specification in Section 3.2.
3. Write `packages/mobile-ui/README.md` with Section 4.10.

### Step 4: Write Source Modules
Write each file using the complete code blocks provided above:
1. `packages/mobile-ui/src/theme/types.ts`
2. `packages/mobile-ui/src/theme/index.ts`
3. `packages/mobile-ui/src/components/T.tsx`
4. `packages/mobile-ui/src/components/ui.tsx`
5. `packages/mobile-ui/src/components/brand.tsx`
6. `packages/mobile-ui/src/components/interactive.tsx`
7. `packages/mobile-ui/src/utils/format.ts`
8. `packages/mobile-ui/src/utils/index.ts`
9. `packages/mobile-ui/src/index.ts`

### Step 5: Verify Zero-Regression on Existing Mobile Apps
Confirm that existing mobile apps remain 100% clean and untouched:
```powershell
cd user-app; npx tsc --noEmit; cd ..
cd driver-app; npx tsc --noEmit; cd ..
```
Both commands must exit with code 0.

### Step 6: How `partner-app` Wires to `@lifeline/mobile-ui`
When `partner-app` is scaffolded:
1. **`partner-app/package.json`**:
   Add to dependencies:
   ```json
   "@lifeline/mobile-ui": "file:../packages/mobile-ui"
   ```
2. **`partner-app/metro.config.js`**:
   Configure watchFolders and nodeModulesPaths:
   ```javascript
   const path = require('path');
   const fs = require('fs');
   const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

   const realRoot = fs.realpathSync.native(__dirname);
   const packagesDir = path.resolve(__dirname, '../packages/mobile-ui');
   const realPackages = fs.existsSync(packagesDir) ? fs.realpathSync.native(packagesDir) : packagesDir;

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
3. **`partner-app/tsconfig.json`**:
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

## 6. Summary Checklist for Worker

- [ ] Directory `packages/mobile-ui` created with `assets/fonts`, `src/theme`, `src/components`, `src/utils`
- [ ] Font files copied to `packages/mobile-ui/assets/fonts/`
- [ ] `package.json` with `@lifeline/mobile-ui` and peerDependencies created
- [ ] `tsconfig.json` created
- [ ] `src/theme/types.ts` & `src/theme/index.ts` created
- [ ] `src/components/T.tsx` created
- [ ] `src/components/ui.tsx` created
- [ ] `src/components/brand.tsx` created
- [ ] `src/components/interactive.tsx` created
- [ ] `src/utils/format.ts` & `src/utils/index.ts` created
- [ ] `src/index.ts` barrel export created
- [ ] `README.md` created
- [ ] `user-app` verified with `npx tsc --noEmit` (0 errors)
- [ ] `driver-app` verified with `npx tsc --noEmit` (0 errors)
