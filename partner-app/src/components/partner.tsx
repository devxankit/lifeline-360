import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TextInput, View, ViewStyle, StyleProp } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Camera, CheckCircle2, FileText, X } from 'lucide-react-native';
import { Badge, Button, RadioDot, T, colors, radius, service } from '../ui';
import { usePartnerStore } from '../store/PartnerStore';
import { BookingStatus, OrderStatus, PartnerRole, Prescription } from '../store/types';

/** Accent colours per role: mint for vendors, lavender for caretakers, teal stays the action colour. */
export const roleTint = (role: PartnerRole | null) => (role === 'caretaker' ? service.nursing : service.medicine);

/* ------------------------------------------------------------ Tab header */

export function TabHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { notifications, session } = usePartnerStore();
  const unread = notifications.filter((n) => !n.read && (n.role === 'all' || n.role === session.role)).length;
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line }}>
      <View style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 6, gap: 6 }}>
        <View style={{ flex: 1 }}>
          <T w="extrabold" size={20}>
            {title}
          </T>
          {subtitle ? (
            <T size={12} color={colors.muted} numberOfLines={1}>
              {subtitle}
            </T>
          ) : null}
        </View>
        {right}
        <Pressable accessibilityLabel="Notifications" onPress={() => nav.navigate('Notifications')} hitSlop={6} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={22} color={colors.ink} />
          {unread > 0 ? (
            <View style={{ position: 'absolute', top: 8, right: 8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
              <T w="bold" size={9.5} color={colors.white}>
                {unread > 9 ? '9+' : unread}
              </T>
            </View>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

/* --------------------------------------------------------- Bottom sheet */

export function Sheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(16,22,40,0.45)' }} onPress={onClose} accessibilityLabel="Close" />
        <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: Math.max(insets.bottom, 12) + 8, maxHeight: '88%' }}>
          <View style={{ alignItems: 'center', paddingTop: 8 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingRight: 6, paddingVertical: 6 }}>
            <T w="bold" size={17} style={{ flex: 1 }}>
              {title}
            </T>
            <Pressable onPress={onClose} accessibilityLabel="Close" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} color={colors.muted} />
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 4 }}>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/** Pick a reason (plus free text for "Other") and confirm. */
export function ReasonSheet({
  visible,
  onClose,
  title,
  reasons,
  confirmLabel,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  reasons: string[];
  confirmLabel: string;
  onConfirm: (reason: string) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [other, setOther] = useState('');
  const reason = picked === 'Other' ? other.trim() : picked;
  return (
    <Sheet visible={visible} onClose={onClose} title={title}>
      {reasons.map((r) => (
        <Pressable key={r} onPress={() => setPicked(r)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.line }}>
          <RadioDot on={picked === r} />
          <T w="semibold" size={14}>
            {r}
          </T>
        </Pressable>
      ))}
      {picked === 'Other' ? (
        <TextInput
          value={other}
          onChangeText={setOther}
          placeholder="Tell us the reason"
          placeholderTextColor={colors.faint}
          autoFocus
          style={{ marginTop: 12, borderWidth: 1, borderColor: colors.lineStrong, borderRadius: radius.md, padding: 12, fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: colors.ink }}
        />
      ) : null}
      <Button
        title={confirmLabel}
        variant="danger"
        disabled={!reason}
        onPress={() => {
          if (!reason) return;
          onConfirm(reason);
          setPicked(null);
          setOther('');
        }}
        style={{ marginTop: 16 }}
      />
    </Sheet>
  );
}

/* ------------------------------------------------------------ OTP boxes */

export function OtpBoxes({ length = 4, value, onChange, error }: { length?: number; value: string; onChange: (v: string) => void; error?: boolean }) {
  const ref = useRef<React.ComponentRef<typeof TextInput>>(null);
  return (
    <Pressable onPress={() => ref.current?.focus()} style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
      {Array.from({ length }, (_, i) => {
        const ch = value[i];
        const active = i === value.length;
        return (
          <View
            key={i}
            style={{
              width: 54,
              height: 60,
              borderRadius: radius.md,
              borderWidth: active ? 2 : 1,
              borderColor: error ? colors.red : active ? colors.teal : colors.lineStrong,
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <T w="extrabold" size={24}>
              {ch ?? ''}
            </T>
          </View>
        );
      })}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
      />
    </Pressable>
  );
}

/* ------------------------------------------------------------ Status pills */

const ORDER_LABEL: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
  new: { label: 'New', bg: colors.redSoft, fg: colors.redText },
  quote_sent: { label: 'Quote sent', bg: colors.amberSoft, fg: colors.amberText },
  packing: { label: 'Packing', bg: colors.amberSoft, fg: colors.amberText },
  ready: { label: 'Ready for pickup', bg: colors.skySoft, fg: colors.skyText },
  completed: { label: 'Handed over', bg: colors.greenSoft, fg: colors.greenText },
  rejected: { label: 'Rejected', bg: '#F1EFEA', fg: colors.ink2 },
};

const BOOKING_LABEL: Record<BookingStatus, { label: string; bg: string; fg: string }> = {
  requested: { label: 'New request', bg: colors.redSoft, fg: colors.redText },
  accepted: { label: 'Upcoming', bg: colors.skySoft, fg: colors.skyText },
  on_the_way: { label: 'On the way', bg: colors.amberSoft, fg: colors.amberText },
  in_progress: { label: 'In progress', bg: service.nursing.bg, fg: service.nursing.text },
  completed: { label: 'Completed', bg: colors.greenSoft, fg: colors.greenText },
  declined: { label: 'Declined', bg: '#F1EFEA', fg: colors.ink2 },
};

export const OrderStatusPill = ({ status, reason }: { status: OrderStatus; reason?: string }) => {
  const s = ORDER_LABEL[status];
  return <Badge label={status === 'rejected' && reason === 'Not accepted in time' ? 'Missed' : s.label} bg={s.bg} fg={s.fg} />;
};

export const BookingStatusPill = ({ status, reason }: { status: BookingStatus; reason?: string }) => {
  const s = BOOKING_LABEL[status];
  return <Badge label={status === 'declined' && reason === 'Request expired' ? 'Expired' : s.label} bg={s.bg} fg={s.fg} />;
};

/* --------------------------------------------------------- Prescription */

/** The uploaded prescription, drawn as a doctor's slip (the real image comes from storage later). */
export function RxPaper({ rx, patient, compact }: { rx: Prescription; patient: string; compact?: boolean }) {
  return (
    <View style={{ backgroundColor: '#FFFDF7', borderRadius: radius.md, borderWidth: 1, borderColor: '#EAE3D2', padding: 16, gap: 10 }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#E7DEC8', paddingBottom: 8 }}>
        <T w="extrabold" size={14} color="#2B3A67">
          {rx.doctor}
        </T>
        <T size={11.5} color="#6B6250">
          {rx.clinic}
        </T>
      </View>
      <T size={12} color="#6B6250">
        Patient: <T w="bold" size={12} color="#3D3524">{patient}</T>
      </T>
      <T w="extrabold" size={22} color="#2B3A67" style={{ fontStyle: 'italic' }}>
        Rx
      </T>
      {rx.lines.map((l) => (
        <T key={l} size={compact ? 13 : 14} color="#1F2C55" w="semibold" style={{ fontStyle: 'italic' }} lh={20}>
          {l}
        </T>
      ))}
      <View style={{ alignItems: 'flex-end', marginTop: 6 }}>
        <T size={14} color="#2B3A67" style={{ fontStyle: 'italic' }}>
          — signed
        </T>
      </View>
    </View>
  );
}

/* --------------------------------------------------------- Photo capture */

/** Document photo tile. The camera is simulated in this build; tapping "captures" the page. */
export function CaptureTile({ captured, onCapture, label = 'Take photo of the document' }: { captured: boolean; onCapture: () => void; label?: string }) {
  return (
    <Pressable
      onPress={onCapture}
      style={({ pressed }) => ({
        height: 150,
        borderRadius: radius.md,
        borderWidth: 1.5,
        borderStyle: captured ? 'solid' : 'dashed',
        borderColor: captured ? colors.teal : colors.lineStrong,
        backgroundColor: captured ? colors.tealTint : colors.surface2,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: pressed ? 0.8 : 1,
      })}>
      {captured ? (
        <>
          <View style={{ width: 92, height: 64, borderRadius: 6, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.tealLine, padding: 8, gap: 5 }}>
            <FileText size={14} color={colors.teal} />
            <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.tealLine, width: '80%' }} />
            <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.tealLine, width: '60%' }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={15} color={colors.teal} />
            <T w="bold" size={13} color={colors.tealDark}>
              Photo added · tap to retake
            </T>
          </View>
        </>
      ) : (
        <>
          <Camera size={28} color={colors.muted} />
          <T w="semibold" size={13} color={colors.ink2}>
            {label}
          </T>
          <T size={11.5} color={colors.muted}>
            JPG or PDF, all four corners visible
          </T>
        </>
      )}
    </Pressable>
  );
}

/* ------------------------------------------------------------- Helpers */

export function Pad({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ paddingHorizontal: 16 }, style]}>{children}</View>;
}

export function Label({ children, style }: { children: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      <T w="bold" size={11.5} color={colors.muted} style={{ letterSpacing: 0.6 }}>
        {children.toUpperCase()}
      </T>
    </View>
  );
}
