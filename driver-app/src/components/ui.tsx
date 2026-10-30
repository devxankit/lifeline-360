import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
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
import { colors, radius, shadow } from '../theme';

/* ------------------------------------------------------------------ Button */

type ButtonVariant = 'primary' | 'outline' | 'soft' | 'danger' | 'dark' | 'ghost' | 'success';

const BTN: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.teal, fg: colors.white },
  outline: { bg: colors.white, fg: colors.teal, border: colors.teal },
  soft: { bg: colors.tealTint, fg: colors.tealDark },
  danger: { bg: colors.red, fg: colors.white },
  dark: { bg: colors.navy, fg: colors.white },
  ghost: { bg: colors.white, fg: colors.ink, border: colors.lineStrong },
  success: { bg: colors.green, fg: colors.white },
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
  const h = size === 'lg' ? 52 : size === 'md' ? 44 : 36;
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
          paddingHorizontal: size === 'sm' ? 12 : 20,
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
  dark,
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  border?: boolean;
  transparent?: boolean;
  dark?: boolean;
}) {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const bg = transparent ? 'transparent' : dark ? colors.navy : colors.white;
  const textColor = dark ? colors.white : colors.ink;
  const subColor = dark ? colors.navyMuted : colors.muted;

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: bg,
        borderBottomWidth: border && !transparent ? 1 : 0,
        borderBottomColor: dark ? colors.navyLine : colors.line,
      }}>
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 }}>
        <IconButton label="Back" onPress={onBack ?? (() => nav.goBack())} dark={dark}>
          <ArrowLeft size={22} color={textColor} />
        </IconButton>
        <View style={{ flex: 1, paddingRight: 8 }}>
          {title ? (
            <T w="bold" size={17} color={textColor} numberOfLines={1}>
              {title}
            </T>
          ) : null}
          {subtitle ? (
            <T size={12} color={subColor} numberOfLines={1}>
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
  dark,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        {
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 22,
          opacity: pressed ? 0.6 : 1,
        },
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
  dark,
}: {
  title?: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  dark?: boolean;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: dark ? colors.navyCard : colors.white,
          paddingVertical: 16,
          paddingHorizontal: padded ? 16 : 0,
        },
        style,
      ]}>
      {title ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            paddingHorizontal: padded ? 0 : 16,
          }}>
          <T w="bold" size={16} color={dark ? colors.white : colors.ink}>
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

export function Card({
  children,
  style,
  onPress,
  dark,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  dark?: boolean;
}) {
  const base: ViewStyle = {
    backgroundColor: dark ? colors.navyCard : colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: dark ? colors.navyLine : colors.line,
    padding: 14,
  };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [base, style, pressed && { opacity: 0.85 }]}>
      {children}
    </Pressable>
  );
}

export function Divider({ style, dark }: { style?: StyleProp<ViewStyle>; dark?: boolean }) {
  return <View style={[{ height: 1, backgroundColor: dark ? colors.navyLine : colors.line }, style]} />;
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
  dark,
}: {
  icon?: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
  danger?: boolean;
  dark?: boolean;
}) {
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: dark ? colors.navyLine : colors.line,
      }}>
      {icon ? (
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: radius.md,
            backgroundColor: iconBg ?? (dark ? colors.navySurface : colors.surface2),
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
          {icon}
        </View>
      ) : null}
      <View style={{ flex: 1, marginRight: 8 }}>
        <T w="semibold" size={15} color={danger ? colors.red : dark ? colors.white : colors.ink}>
          {title}
        </T>
        {subtitle ? (
          <T size={12} color={dark ? colors.navyMuted : colors.muted} style={{ marginTop: 2 }}>
            {subtitle}
          </T>
        ) : null}
      </View>
      {right ?? (onPress ? <ChevronRight size={18} color={dark ? colors.navyMuted : colors.faint} /> : null)}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.7 }}>
      {content}
    </Pressable>
  );
}

export function InfoRow({
  label,
  value,
  bold,
  color,
  dark,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
  dark?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
      <T size={13} color={dark ? colors.navyMuted : colors.muted}>
        {label}
      </T>
      <T w={bold ? 'bold' : 'medium'} size={13} color={color ?? (dark ? colors.white : colors.ink)}>
        {value}
      </T>
    </View>
  );
}

/* ------------------------------------------------------- Badges and Chips */

export function Badge({
  label,
  variant = 'neutral',
}: {
  label: string;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}) {
  const map = {
    neutral: { bg: colors.surface2, fg: colors.muted },
    success: { bg: colors.greenSoft, fg: colors.greenText },
    warning: { bg: colors.amberSoft, fg: colors.amberText },
    danger: { bg: colors.redSoft, fg: colors.redText },
    info: { bg: colors.skySoft, fg: colors.skyText },
  }[variant];

  return (
    <View style={{ backgroundColor: map.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill }}>
      <T w="bold" size={11} color={map.fg}>
        {label}
      </T>
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: radius.pill,
        backgroundColor: active ? colors.teal : colors.white,
        borderWidth: 1,
        borderColor: active ? colors.teal : colors.lineStrong,
        marginRight: 8,
      }}>
      <T w={active ? 'bold' : 'medium'} size={13} color={active ? colors.white : colors.ink}>
        {label}
      </T>
    </Pressable>
  );
}

/* ------------------------------------------------------------- Form fields */

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType,
  autoCapitalize,
  maxLength,
  multiline,
  numberOfLines,
  secureTextEntry,
  editable = true,
  right,
  left,
  dark,
}: {
  label?: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  editable?: boolean;
  right?: React.ReactNode;
  left?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? (
        <T w="semibold" size={13} color={dark ? colors.navyMuted : colors.ink2} style={{ marginBottom: 6 }}>
          {label}
        </T>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: dark ? colors.navySurface : colors.white,
          borderWidth: 1,
          borderColor: error ? colors.red : dark ? colors.navyLine : colors.lineStrong,
          borderRadius: radius.md,
          paddingHorizontal: 12,
          gap: 8,
        }}>
        {left}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={dark ? colors.navyMuted : colors.faint}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          editable={editable}
          style={{
            flex: 1,
            height: multiline ? (numberOfLines || 3) * 24 : 48,
            fontSize: 15,
            fontFamily: 'PlusJakartaSans-Medium',
            color: dark ? colors.white : colors.ink,
            textAlignVertical: multiline ? 'top' : 'center',
            paddingVertical: multiline ? 8 : 0,
          }}
        />
        {right}
      </View>
      {error ? (
        <T size={11} color={colors.red} style={{ marginTop: 4 }}>
          {error}
        </T>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------- Avatar */

export function Avatar({
  name = 'Driver',
  size = 48,
  uri,
  source,
}: {
  name?: string;
  size?: number;
  uri?: string;
  source?: ImageSourcePropType;
}) {
  if (uri || source) {
    return <Image source={source ?? { uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.tealSoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <T w="bold" size={size * 0.4} color={colors.tealDark}>
        {initials}
      </T>
    </View>
  );
}

/* ------------------------------------------------------------- BottomBar */

export function BottomBar({
  children,
  dark,
  style,
}: {
  children: React.ReactNode;
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          backgroundColor: dark ? colors.navy : colors.white,
          borderTopWidth: 1,
          borderTopColor: dark ? colors.navyLine : colors.line,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
        },
        shadow.sheet,
        style,
      ]}>
      {children}
    </View>
  );
}

