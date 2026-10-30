import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Image, Modal, Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, ChevronDown, LocateFixed, MessageSquare, Phone, Share2, ShieldCheck, Star, XCircle } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, Button, Chip, RadioDot } from '../components/ui';
import { DesignedMap } from '../components/brand';
import { colors, radius, shadow } from '../theme';
import { ambulanceTypes, hospitals } from '../data/catalog';
import { newId, useStore } from '../store/AppStore';

const DRIVER = { name: 'Imran Pasha', photo: require('../assets/images/dr-imran.jpg'), plate: 'KA 01 AB 4521', vehicle: 'Force Traveller · White', rating: '4.9' };

/* ------------------------------------------------------------------ Book */

export function AmbulanceBookScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { addresses, addressId, addBooking, notify } = useStore();
  const addr = addresses.find((a) => a.id === addressId) ?? addresses[0];
  const [type, setType] = useState('bls');
  const [hospital, setHospital] = useState(hospitals[0].id);
  const [condition, setCondition] = useState<string | null>(null);
  const [pickHospital, setPickHospital] = useState(false);
  const h = hospitals.find((x) => x.id === hospital)!;
  const t = ambulanceTypes.find((x) => x.id === type)!;

  const book = () => {
    const id = newId('A');
    addBooking({
      id,
      service: 'ambulance',
      title: `${t.name} ambulance`,
      subtitle: `To ${h.name}`,
      when: 'Now',
      status: 'Emergency',
      amount: null,
      createdAt: Date.now(),
      meta: { typeId: t.id, hospitalId: h.id, condition, pickup: addr ? `${addr.line}, ${addr.area}` : 'Current location', stage: 'searching' },
    });
    notify({ title: 'Ambulance requested', text: `Finding the nearest ${t.short} ambulance`, service: 'ambulance' });
    navigation.replace('AmbulanceSearching', { id });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF0EE' }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ height: 300 }}>
        <DesignedMap showRoute={false} height={300} />
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Back" style={{ position: 'absolute', top: insets.top + 8, left: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadow.raised }}>
          <ArrowLeft size={20} color={colors.ink} />
        </Pressable>
        <View style={{ position: 'absolute', top: insets.top + 12, right: 16, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: 36, borderRadius: 18, backgroundColor: colors.red }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.white }} />
          <T w="bold" size={12} color={colors.white}>Emergency · 24/7</T>
        </View>
      </View>
      <View style={{ flex: 1, marginTop: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: colors.white, ...shadow.sheet }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 20 }}>
          <T w="extrabold" size={20}>Book an ambulance</T>
          <View style={{ borderRadius: radius.md, borderWidth: 1, borderColor: colors.line }}>
            <Pressable onPress={() => navigation.navigate('Addresses', { select: true })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.teal }} />
              <View style={{ flex: 1 }}>
                <T size={11} color={colors.muted}>Pickup</T>
                <T w="semibold" size={14} numberOfLines={1}>{addr ? `${addr.line}, ${addr.area}` : 'Current location'}</T>
              </View>
              <LocateFixed size={18} color={colors.teal} />
            </Pressable>
            <View style={{ height: 1, backgroundColor: colors.line, marginLeft: 34 }} />
            <Pressable onPress={() => setPickHospital(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.ink }} />
              <View style={{ flex: 1 }}>
                <T size={11} color={colors.muted}>Hospital</T>
                <T w="semibold" size={14} numberOfLines={1}>{h.name}, {h.area}</T>
              </View>
              <ChevronDown size={18} color={colors.ink2} />
            </Pressable>
          </View>

          <T w="bold" size={15}>Ambulance type</T>
          {ambulanceTypes.map((x) => {
            const on = x.id === type;
            return (
              <Pressable key={x.id} onPress={() => setType(x.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, borderWidth: on ? 1.5 : 1, borderColor: on ? colors.red : colors.lineStrong, backgroundColor: on ? '#FFF6F6' : colors.white }}>
                <View style={{ width: 52, height: 40, borderRadius: 10, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <T w="extrabold" size={x.short.length > 3 ? 10 : 13} color={colors.redText}>{x.short}</T>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <T w="bold" size={14}>{x.name}</T>
                    <T w="bold" size={13} color={colors.green}>{x.eta}</T>
                  </View>
                  <T size={12} color={colors.muted} numberOfLines={2}>{x.note}</T>
                  <T w="semibold" size={12} color={colors.ink2}>Est. {x.fare}</T>
                </View>
              </Pressable>
            );
          })}

          <T w="bold" size={15}>Patient condition (optional)</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Chest pain', 'Breathing difficulty', 'Accident / injury', 'Unconscious', 'Pregnancy', 'Other'].map((c) => (
              <Chip key={c} label={c} active={condition === c} onPress={() => setCondition(condition === c ? null : c)} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={15} color={colors.teal} />
            <T size={12} color={colors.muted} style={{ flex: 1 }}>Pay after the trip. Calls with the driver use masked numbers.</T>
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: insets.bottom + 14, borderTopWidth: 1, borderTopColor: colors.line }}>
          <Button title={`Book ${t.short} ambulance now`} variant="danger" onPress={book} />
        </View>
      </View>

      <Modal visible={pickHospital} transparent animationType="slide" onRequestClose={() => setPickHospital(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(14,20,38,0.45)' }} onPress={() => setPickHospital(false)} />
        <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: insets.bottom + 16, gap: 4 }}>
          <View style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong, marginBottom: 10 }} />
          <T w="bold" size={17} style={{ marginBottom: 6 }}>Choose hospital</T>
          {hospitals.map((x) => (
            <Pressable key={x.id} onPress={() => { setHospital(x.id); setPickHospital(false); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEF0EF' }}>
              <View style={{ flex: 1 }}>
                <T w="semibold" size={14}>{x.name}</T>
                <T size={12} color={colors.muted}>{x.area} · {x.distance}{x.ayushman ? ' · Ayushman card accepted' : ''}</T>
              </View>
              <RadioDot on={x.id === hospital} />
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

/* ------------------------------------------------------------- Searching */

export function AmbulanceSearchingScreen({ navigation, route }: any) {
  const { updateBooking } = useStore();
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }));
    loop.start();
    const t = setTimeout(() => {
      updateBooking(route.params.id, (b) => ({ meta: { ...b.meta, stage: 'enroute', driver: DRIVER.name }, status: 'On the way' }));
      navigation.replace('AmbulanceTracking', { id: route.params.id });
    }, 3200);
    return () => {
      loop.stop();
      clearTimeout(t);
    };
  }, [navigation, pulse, route.params.id, updateBooking]);

  const ring = (delay: number) => ({
    position: 'absolute' as const,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.red,
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25 - delay, 0] }),
    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.3 + delay, 1.1] }) }],
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <View style={{ width: 240, height: 240, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={ring(0)} />
        <Animated.View style={ring(0.15)} />
        <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
          <T w="extrabold" size={20} color={colors.white}>SOS</T>
        </View>
      </View>
      <T w="extrabold" size={22} center style={{ marginTop: 20 }}>Finding the nearest ambulance</T>
      <T size={14} color={colors.ink2} center style={{ marginTop: 8 }} lh={20}>Alerting ambulances near you. This usually takes under a minute.</T>
      <Button title="Cancel request" variant="ghost" style={{ marginTop: 32, alignSelf: 'stretch' }} onPress={() => { updateBooking(route.params.id, { status: 'Cancelled' }); navigation.goBack(); }} />
    </View>
  );
}

/* -------------------------------------------------------------- Tracking */

export function AmbulanceTrackingScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { bookings, updateBooking, notify } = useStore();
  const b = bookings.find((x) => x.id === route.params.id);
  const h = hospitals.find((x) => x.id === b?.meta.hospitalId) ?? hospitals[0];
  const t = ambulanceTypes.find((x) => x.id === b?.meta.typeId) ?? ambulanceTypes[0];
  const [progress, setProgress] = useState(0.05);
  const stage: string = b?.meta.stage ?? 'enroute';

  const live = !!b && stage !== 'done';
  useEffect(() => {
    if (!live) return;
    const timer = setInterval(() => setProgress((p) => Math.min(1, p + 0.02)), 450);
    return () => clearInterval(timer);
  }, [live]);

  // Stage changes follow the vehicle's position along the route.
  useEffect(() => {
    if (!b) return;
    if (stage === 'enroute' && progress >= 0.35) {
      updateBooking(b.id, (x) => ({ meta: { ...x.meta, stage: 'arrived' } }));
      notify({ title: 'Ambulance has arrived', text: `${DRIVER.name} is at your pickup point`, service: 'ambulance' });
    } else if (stage === 'arrived' && progress >= 0.42) {
      updateBooking(b.id, (x) => ({ meta: { ...x.meta, stage: 'tohospital' } }));
    } else if (stage === 'tohospital' && progress >= 1) {
      updateBooking(b.id, (x) => ({ meta: { ...x.meta, stage: 'done' }, status: 'Completed', when: 'Today' }));
      navigation.replace('TripComplete', { id: b.id });
    }
  }, [b, stage, progress, navigation, notify, updateBooking]);

  if (!b) return null;
  const toPickup = stage === 'enroute';
  const eta = toPickup ? Math.max(1, Math.round(6 * (1 - progress / 0.35))) : Math.max(1, Math.round(14 * (1 - (progress - 0.4) / 0.6)));
  const headline = stage === 'arrived' ? 'Ambulance has arrived' : toPickup ? `Arriving in ${eta} min` : `Reaching hospital in ${eta} min`;

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF0EE' }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <DesignedMap progress={progress} destinationLabel={h.name.split(' ').slice(0, 2).join(' ')} height={560} />
      </View>
      <Pressable onPress={() => navigation.navigate('Main')} accessibilityLabel="Back to home" style={{ position: 'absolute', top: insets.top + 8, left: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadow.raised }}>
        <ArrowLeft size={20} color={colors.ink} />
      </Pressable>
      <Pressable onPress={() => Alert.alert('Safety', `Your trip is shared with your emergency contacts.\nLifeline helpline: available 24/7.`)} style={{ position: 'absolute', top: insets.top + 10, right: 16, height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', gap: 6, ...shadow.raised }}>
        <ShieldCheck size={16} color={colors.teal} />
        <T w="bold" size={13}>Safety</T>
      </Pressable>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white, borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingHorizontal: 16, paddingTop: 8, paddingBottom: insets.bottom + 16, gap: 14, ...shadow.sheet }}>
        <View style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <T w="extrabold" size={22}>{headline}</T>
            <T size={13} color={colors.ink2} style={{ marginTop: 2 }}>{toPickup ? `${(1.9 * (1 - progress / 0.35)).toFixed(1)} km away` : `On the way to ${h.name}`}</T>
          </View>
          <View style={{ paddingHorizontal: 9, paddingVertical: 5, borderRadius: 6, backgroundColor: colors.redSoft }}>
            <T w="extrabold" size={11} color={colors.redText}>EMERGENCY</T>
          </View>
        </View>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.line }}>
          <View style={{ width: `${Math.round(progress * 100)}%`, height: 4, borderRadius: 2, backgroundColor: colors.teal }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image source={DRIVER.photo} style={{ width: 52, height: 52, borderRadius: 26 }} />
          <View style={{ flex: 1 }}>
            <T w="bold" size={15}>{DRIVER.name}</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Star size={12} color="#E5A800" fill="#E5A800" />
              <T size={12} color={colors.muted}>{DRIVER.rating} · {t.name}</T>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 3 }}>
            <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1.5, borderColor: colors.ink, borderRadius: 6 }}>
              <T w="extrabold" size={12} style={{ letterSpacing: 0.5 }}>{DRIVER.plate}</T>
            </View>
            <T size={11} color={colors.muted}>{DRIVER.vehicle}</T>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Action label="Call" icon={<Phone size={20} color={colors.teal} />} onPress={() => navigation.navigate('Call', { name: DRIVER.name, role: 'Ambulance driver', photo: DRIVER.photo })} />
          <Action label="Message" icon={<MessageSquare size={20} color={colors.teal} />} onPress={() => Alert.alert('Message', 'Quick messages to the driver go through the masked line.')} />
          <Action label="Share trip" icon={<Share2 size={20} color={colors.teal} />} onPress={() => Alert.alert('Trip shared', 'Live location sent to your emergency contacts.')} />
          <Action
            label="Cancel"
            icon={<XCircle size={20} color={colors.redText} />}
            onPress={() =>
              Alert.alert('Cancel ambulance?', 'Only cancel if help is no longer needed.', [
                { text: 'Keep', style: 'cancel' },
                { text: 'Cancel ambulance', style: 'destructive', onPress: () => { updateBooking(b.id, { status: 'Cancelled', meta: { ...b.meta, stage: 'done' } }); navigation.navigate('Main'); } },
              ])
            }
          />
        </View>
        <T size={12} color={colors.muted}>Calls are connected through a masked number, so neither side sees the other’s phone number.</T>
      </View>
    </View>
  );
}

function Action({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ flex: 1, height: 64, borderRadius: radius.md, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', gap: 5, opacity: pressed ? 0.7 : 1 })}>
      {icon}
      <T w="semibold" size={12}>{label}</T>
    </Pressable>
  );
}

/* --------------------------------------------------------- Trip complete */

export function TripCompleteScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { bookings, updateBooking } = useStore();
  const b = bookings.find((x) => x.id === route.params.id);
  const [stars, setStars] = useState(0);
  const [paid, setPaid] = useState(false);
  if (!b) return null;
  const h = hospitals.find((x) => x.id === b.meta.hospitalId) ?? hospitals[0];
  const fare = b.meta.typeId === 'als' ? 2800 : b.meta.typeId === 'icu' ? 5200 : b.meta.typeId === 'mortuary' ? 2100 : 1350;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Trip completed" onBack={() => navigation.navigate('Main')} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 24 }}>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.line }}>
          <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Check size={30} color={colors.green} strokeWidth={3} />
          </View>
          <T w="extrabold" size={20}>Reached {h.name}</T>
          <T size={13} color={colors.muted}>Booking {b.id}</T>
        </View>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.line, gap: 6 }}>
          <T w="bold" size={15} style={{ marginBottom: 4 }}>Fare</T>
          <Row l="Base fare" r={`₹${(fare - 350).toLocaleString('en-IN')}`} />
          <Row l="Distance (8.2 km)" r="₹350" />
          <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 6 }} />
          <Row l={paid ? 'Paid by UPI' : 'Amount due'} r={`₹${fare.toLocaleString('en-IN')}`} bold />
          {!paid ? <Button title={`Pay ₹${fare.toLocaleString('en-IN')} by UPI`} style={{ marginTop: 8 }} onPress={() => { setPaid(true); updateBooking(b.id, { amount: fare, meta: { ...b.meta, method: 'upi' } }); }} /> : null}
        </View>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.line, alignItems: 'center', gap: 10 }}>
          <T w="bold" size={15}>Rate {DRIVER.name}</T>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setStars(n)} accessibilityLabel={`${n} star`}>
                <Star size={34} color={n <= stars ? '#E5A800' : colors.lineStrong} fill={n <= stars ? '#E5A800' : 'transparent'} />
              </Pressable>
            ))}
          </View>
          {stars ? <T size={13} color={colors.green} w="semibold">Thanks for your feedback</T> : null}
        </View>
        <Button title="Done" disabled={!paid} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })} />
      </ScrollView>
    </View>
  );
}

function Row({ l, r, bold }: { l: string; r: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <T size={13} color={colors.ink2}>{l}</T>
      <T size={13} w={bold ? 'extrabold' : 'semibold'}>{r}</T>
    </View>
  );
}
