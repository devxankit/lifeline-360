import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Banknote, Check, CreditCard, Landmark, Mic, MicOff, PhoneOff, ShieldCheck, Smartphone, Tag, Volume2 } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, Avatar, BottomBar, Button, Divider, InfoRow, RadioDot, Section, ServiceBadge } from '../components/ui';
import { DuoIcon, ProductThumb } from '../components/brand';
import { colors, radius, service } from '../theme';
import { caretakers, doctors } from '../data/catalog';
import { Booking, newId, useStore } from '../store/AppStore';
import { rupees } from '../utils/format';

export type CheckoutParams = {
  draft: Omit<Booking, 'id' | 'createdAt'>;
  lines: { label: string; amount: number }[];
  /** Null when the price is not set yet (membership before launch). */
  total: number | null;
  allowCash?: boolean;
  idPrefix: string;
};

const METHODS = [
  { id: 'upi', label: 'UPI', note: 'Google Pay, PhonePe, Paytm, BHIM', Icon: Smartphone },
  { id: 'card', label: 'Credit or debit card', note: 'Visa, Mastercard, RuPay', Icon: CreditCard },
  { id: 'netbanking', label: 'Net banking', note: 'All major Indian banks', Icon: Landmark },
  { id: 'cash', label: 'Pay at visit', note: 'Cash or UPI to the provider', Icon: Banknote },
];

/* -------------------------------------------------------------- Checkout */

export function CheckoutScreen({ navigation, route }: any) {
  const p: CheckoutParams = route.params;
  const { membership } = useStore();
  const [method, setMethod] = useState('upi');
  const s = service[p.draft.service];
  const memberDiscount = membership && p.draft.service === 'lab' && p.total ? Math.round(p.total * 0.1) : 0;
  const payable = p.total == null ? null : p.total - memberDiscount;
  const methods = METHODS.filter((m) => m.id !== 'cash' || p.allowCash);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Review & pay" />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <ServiceArt draft={p.draft} bg={s.bg} />
            <View style={{ flex: 1, gap: 3 }}>
              <ServiceBadge kind={p.draft.service} />
              <T w="bold" size={16} style={{ marginTop: 4 }}>
                {p.draft.title}
              </T>
              <T size={13} color={colors.ink2}>
                {p.draft.subtitle}
              </T>
              <T w="semibold" size={13} color={colors.teal}>
                {p.draft.when}
              </T>
            </View>
          </View>
        </Section>

        <Section title="Bill details">
          {p.lines.map((l) => (
            <InfoRow key={l.label} label={l.label} value={rupees(l.amount)} />
          ))}
          {memberDiscount ? <InfoRow label="Member lab discount (10%)" value={'− ' + rupees(memberDiscount)} /> : null}
          <Divider style={{ marginVertical: 8 }} />
          <InfoRow label="To pay" value={payable == null ? 'Price at launch' : rupees(payable)} bold />
          {!membership && p.draft.service !== 'membership' ? (
            <Pressable onPress={() => navigation.navigate('MembershipPlans')} style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: radius.md, backgroundColor: colors.amberSoft }}>
              <Tag size={16} color={colors.amberText} />
              <T w="semibold" size={12} color={colors.amberText} style={{ flex: 1 }}>
                Members get consultation and lab benefits. See plans
              </T>
            </Pressable>
          ) : null}
        </Section>

        {payable != null ? (
          <Section title="Pay with">
            {methods.map((m, i) => (
              <Pressable
                key={m.id}
                onPress={() => setMethod(m.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: method === m.id }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: i === methods.length - 1 ? 0 : 1, borderBottomColor: '#EEF0EF' }}>
                <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <m.Icon size={19} color={colors.ink} />
                </View>
                <View style={{ flex: 1 }}>
                  <T w="semibold" size={14}>
                    {m.label}
                  </T>
                  <T size={12} color={colors.muted}>
                    {m.note}
                  </T>
                </View>
                <RadioDot on={method === m.id} />
              </Pressable>
            ))}
          </Section>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 4 }}>
          <ShieldCheck size={15} color={colors.teal} />
          <T size={12} color={colors.muted} style={{ flex: 1 }}>
            Demo build: no real payment is taken.
          </T>
        </View>
      </ScrollView>
      <BottomBar>
        <View>
          <T size={12} color={colors.muted}>
            Total
          </T>
          <T w="extrabold" size={18}>
            {payable == null ? 'At launch' : rupees(payable)}
          </T>
        </View>
        <Button
          title={payable == null ? 'Activate (demo)' : method === 'cash' ? 'Confirm booking' : `Pay ${rupees(payable)}`}
          style={{ flex: 1 }}
          onPress={() => navigation.replace('PaymentProcessing', { ...p, total: payable, method })}
        />
      </BottomBar>
    </View>
  );
}

/** The provider's photo when there is one, otherwise the service's two-tone icon. */
function ServiceArt({ draft, bg }: { draft: CheckoutParams['draft']; bg: string }) {
  const doc = draft.meta.doctorId ? doctors.find((d) => d.id === draft.meta.doctorId) : undefined;
  const ct = draft.meta.caretakerId ? caretakers.find((c) => c.id === draft.meta.caretakerId) : undefined;
  const person = doc ?? ct;
  if (person) return <Avatar source={person.photo} name={person.name} size={52} rounded="md" />;
  const icon = draft.service === 'lab' ? 'report' : draft.service === 'membership' ? 'membership' : draft.service === 'blood' ? 'blood' : null;
  return (
    <View style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      {icon ? <DuoIcon name={icon} size={30} /> : <ProductThumb tint={{ bg, fg: colors.green }} size={52} />}
    </View>
  );
}

/* ------------------------------------------------------------ Processing */

export function PaymentProcessingScreen({ navigation, route }: any) {
  const p: CheckoutParams & { method: string } = route.params;
  const { addBooking, notify, activateMembership, clearMedCart, clearLabCart } = useStore();
  const done = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (done.current) return;
      done.current = true;
      const booking: Booking = { ...p.draft, id: newId(p.idPrefix), createdAt: Date.now(), amount: p.total, meta: { ...p.draft.meta, method: p.method } };
      if (p.draft.service === 'membership') activateMembership(p.draft.meta.plan);
      // Carts empty only once the order exists, so backing out of checkout keeps them.
      if (p.draft.service === 'medicine') clearMedCart();
      if (p.draft.service === 'lab') clearLabCart();
      addBooking(booking);
      notify({ title: 'Booking confirmed', text: `${booking.title} · ${booking.when}`, service: booking.service });
      navigation.replace('Success', { id: booking.id });
    }, 1600);
    return () => clearTimeout(t);
  }, [navigation, p, addBooking, notify, activateMembership, clearMedCart, clearLabCart]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32 }}>
      <ActivityIndicator size="large" color={colors.teal} />
      <T w="bold" size={18} center>
        {p.method === 'cash' ? 'Confirming your booking' : 'Processing payment'}
      </T>
      <T size={13} color={colors.muted} center>
        Please don’t close the app.
      </T>
    </View>
  );
}

/* --------------------------------------------------------------- Success */

const NEXT_ROUTE: Record<string, string> = {
  doctor: 'AppointmentDetail',
  medicine: 'OrderTracking',
  nursing: 'BookingDetail',
  lab: 'BookingDetail',
  blood: 'BloodStatus',
};

export function SuccessScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { bookings } = useStore();
  const b = bookings.find((x) => x.id === route.params.id);
  const scale = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  }, [scale]);
  if (!b) return null;
  const isMember = b.service === 'membership';

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, paddingTop: insets.top + 40, paddingHorizontal: 24, paddingBottom: insets.bottom + 20 }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ alignItems: 'center', gap: 14 }}>
        <Animated.View style={{ transform: [{ scale }], width: 96, height: 96, borderRadius: 48, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 66, height: 66, borderRadius: 33, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
            <Check size={36} color={colors.white} strokeWidth={3} />
          </View>
        </Animated.View>
        <T w="extrabold" size={24} center>
          {isMember ? 'Membership active' : b.service === 'medicine' ? 'Order placed' : 'Booking confirmed'}
        </T>
        <T size={14} color={colors.ink2} center lh={20}>
          {isMember ? 'Your digital card is ready in the Membership tab.' : 'We’ve sent the details by SMS. You can track everything in Bookings.'}
        </T>
      </View>
      <View style={{ marginTop: 28, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 16, gap: 2 }}>
        <InfoRow label="Booking ID" value={b.id} />
        <InfoRow label="Service" value={service[b.service].label} />
        <InfoRow label="Details" value={b.title} />
        <InfoRow label="When" value={b.when} />
        <InfoRow label="Paid" value={b.amount == null ? '—' : b.meta.method === 'cash' ? `${rupees(b.amount)} at visit` : rupees(b.amount)} bold />
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ gap: 10 }}>
        <Button
          title={isMember ? 'View my card' : b.service === 'medicine' ? 'Track order' : 'View details'}
          onPress={() => {
            if (isMember) navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'Membership' } }] });
            else navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: NEXT_ROUTE[b.service] ?? 'BookingDetail', params: { id: b.id } }] });
          }}
        />
        <Button title="Back to home" variant="ghost" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })} />
      </View>
    </View>
  );
}

/* ------------------------------------------------------ Masked call screen */

export function CallScreen({ navigation, route }: any) {
  const { name, role, photo }: { name: string; role: string; photo?: any } = route.params;
  const insets = useSafeAreaInsets();
  const [secs, setSecs] = useState(0);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  useEffect(() => {
    const c = setTimeout(() => setConnected(true), 2200);
    return () => clearTimeout(c);
  }, []);
  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <View style={{ flex: 1, backgroundColor: colors.tealDeep, paddingTop: insets.top + 48, paddingBottom: insets.bottom + 40, alignItems: 'center' }}>
      <StatusBar barStyle="light-content" />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <ShieldCheck size={14} color="#7FD3C7" />
        <T w="semibold" size={12} color="#AEE3DA">
          Lifeline secure line · numbers hidden
        </T>
      </View>
      <View style={{ marginTop: 48, alignItems: 'center', gap: 12 }}>
        <View style={{ padding: 6, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <Avatar source={photo} name={name} size={116} tint={{ bg: '#1A5A57', fg: colors.white }} />
        </View>
        <T w="extrabold" size={24} color={colors.white}>
          {name}
        </T>
        <T size={14} color="#AEE3DA">
          {role}
        </T>
        <T w="semibold" size={15} color={colors.white} style={{ marginTop: 6 }}>
          {connected ? `${mm}:${ss}` : 'Connecting…'}
        </T>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', gap: 28, alignItems: 'center' }}>
        <CallBtn label={muted ? 'Unmute' : 'Mute'} on={muted} onPress={() => setMuted((m) => !m)}>
          {muted ? <MicOff size={24} color={colors.tealDeep} /> : <Mic size={24} color={colors.white} />}
        </CallBtn>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="End call"
          style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
          <PhoneOff size={28} color={colors.white} />
        </Pressable>
        <CallBtn label="Speaker" on={speaker} onPress={() => setSpeaker((m) => !m)}>
          <Volume2 size={24} color={speaker ? colors.tealDeep : colors.white} />
        </CallBtn>
      </View>
    </View>
  );
}

function CallBtn({ children, label, on, onPress }: { children: React.ReactNode; label: string; on: boolean; onPress: () => void }) {
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <Pressable
        onPress={onPress}
        accessibilityLabel={label}
        style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: on ? colors.white : 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </Pressable>
      <T size={12} color="#AEE3DA">
        {label}
      </T>
    </View>
  );
}
