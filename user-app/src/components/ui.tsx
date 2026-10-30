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

type ButtonVariant = 'primary' | 'outline' | 'soft' | 'danger' | 'dark' | 'ghost';

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
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
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

/* ------------------------------------------------------------- Chips etc */

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
  'Report ready': { bg: '#ECE9FB', fg: '#5B4BB7' },
  Pending: { bg: colors.amberSoft, fg: colors.amberText },
  Scheduled: { bg: colors.skySoft, fg: colors.skyText },
  'On the way': { bg: colors.skySoft, fg: colors.skyText },
  'Out for delivery': { bg: colors.skySoft, fg: colors.skyText },
  'Sample collected': { bg: colors.skySoft, fg: colors.skyText },
  Preparing: { bg: colors.amberSoft, fg: colors.amberText },
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

export function EmptyState({ icon, title, text, action, onAction }: { icon: React.ReactNode; title: string; text: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32, gap: 10 }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.tealTint, alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
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
