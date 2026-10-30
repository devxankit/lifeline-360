import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Clock, FileText, MapPin, Minus, Phone, Plus } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, BottomBar, Button, Chip, Field, InfoRow, RadioDot, Section, StatusBadge, Timeline } from '../components/ui';
import { colors, radius, service } from '../theme';
import { bloodBanks, bloodComponents, bloodGroups, hospitals } from '../data/catalog';
import { newId, useStore } from '../store/AppStore';

const S = service.blood;

/* --------------------------------------------------------------- Request */

export function BloodRequestScreen({ navigation }: any) {
  const { user } = useStore();
  const [group, setGroup] = useState<string>(user?.bloodGroup || 'O+');
  const [component, setComponent] = useState(bloodComponents[0]);
  const [units, setUnits] = useState(1);
  const [urgency, setUrgency] = useState<'Critical' | 'Urgent' | 'Planned'>('Urgent');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Find blood" subtitle="Check availability at nearby blood banks" />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section title="Blood group needed">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {bloodGroups.map((g) => {
              const on = g === group;
              return (
                <Pressable key={g} onPress={() => setGroup(g)} accessibilityRole="radio" accessibilityState={{ checked: on }}
                  style={{ width: '22.7%', height: 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? S.fg : colors.white, borderWidth: on ? 0 : 1, borderColor: colors.lineStrong }}>
                  <T w="extrabold" size={20} color={on ? colors.white : S.text}>{g.replace('-', '−')}</T>
                </Pressable>
              );
            })}
          </View>
        </Section>
        <Section title="Component">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {bloodComponents.map((c) => (
              <Chip key={c} label={c} active={c === component} onPress={() => setComponent(c)} />
            ))}
          </View>
        </Section>
        <Section title="Units">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Pressable accessibilityLabel="Fewer units" onPress={() => setUnits((u) => Math.max(1, u - 1))} style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' }}>
              <Minus size={18} color={colors.ink} />
            </Pressable>
            <T w="extrabold" size={24}>{units}</T>
            <Pressable accessibilityLabel="More units" onPress={() => setUnits((u) => Math.min(10, u + 1))} style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={18} color={colors.ink} />
            </Pressable>
            <T size={13} color={colors.muted}>unit{units > 1 ? 's' : ''} of {component.toLowerCase()}</T>
          </View>
        </Section>
        <Section title="How urgent is it?">
          {(['Critical', 'Urgent', 'Planned'] as const).map((u) => (
            <Pressable key={u} onPress={() => setUrgency(u)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
              <RadioDot on={urgency === u} />
              <View style={{ flex: 1 }}>
                <T w="bold" size={14} color={u === 'Critical' ? colors.redText : colors.ink}>{u}</T>
                <T size={12} color={colors.muted}>{u === 'Critical' ? 'Needed within hours' : u === 'Urgent' ? 'Needed today' : 'Scheduled surgery or transfusion'}</T>
              </View>
            </Pressable>
          ))}
        </Section>
      </ScrollView>
      <BottomBar>
        <Button title="Check availability" style={{ flex: 1 }} onPress={() => navigation.navigate('BloodBanks', { group, component, units, urgency })} />
      </BottomBar>
    </View>
  );
}

/* ------------------------------------------------------------ Bank list */

export function BloodBanksScreen({ navigation, route }: any) {
  const { group, units } = route.params;
  const list = useMemo(() => [...bloodBanks].sort((a, b) => (b.stock[group] >= units ? 1 : 0) - (a.stock[group] >= units ? 1 : 0)), [group, units]);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title={`${group.replace('-', '−')} blood banks`} subtitle={`${units} unit${units > 1 ? 's' : ''} · ${route.params.component}`} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {list.map((b) => {
          const n = b.stock[group] ?? 0;
          const ok = n >= units;
          const level = n === 0 ? { t: 'Not available', bg: colors.redSoft, fg: colors.redText } : n <= 3 ? { t: `Only ${n} left`, bg: colors.amberSoft, fg: colors.amberText } : { t: `${n} units available`, bg: colors.greenSoft, fg: colors.greenText };
          return (
            <View key={b.id} style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 10, opacity: n === 0 ? 0.7 : 1 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: S.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <T w="extrabold" size={15} color={S.text}>{group.replace('-', '−')}</T>
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <T w="bold" size={15}>{b.name}</T>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} color={colors.muted} />
                    <T size={12} color={colors.muted}>{b.area} · {b.distance}</T>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} color={colors.muted} />
                    <T size={12} color={colors.muted}>{b.open}</T>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6, backgroundColor: level.bg }}><T w="bold" size={12} color={level.fg}>{level.t}</T></View>
                <Button title="Request" size="sm" disabled={!ok} onPress={() => navigation.navigate('BloodRaise', { ...route.params, bankId: b.id })} />
              </View>
            </View>
          );
        })}
        <T size={12} color={colors.muted} center style={{ marginTop: 4 }}>Stock is updated by each blood bank in its Lifeline panel.</T>
      </ScrollView>
    </View>
  );
}

/* --------------------------------------------------------- Raise request */

export function BloodRaiseScreen({ navigation, route }: any) {
  const { group, component, units, urgency, bankId } = route.params;
  const bank = bloodBanks.find((b) => b.id === bankId)!;
  const { user, addBooking, notify } = useStore();
  const [patient, setPatient] = useState('');
  const [hospital, setHospital] = useState(hospitals[0].id);
  const [rx, setRx] = useState(false);
  const [phone, setPhone] = useState(user?.phone ?? '');
  const ok = patient.trim().length > 1 && rx && phone.length === 10;

  const submit = () => {
    const id = newId('B');
    const h = hospitals.find((x) => x.id === hospital)!;
    addBooking({
      id,
      service: 'blood',
      title: `${group.replace('-', '−')} · ${units} unit${units > 1 ? 's' : ''} ${component.toLowerCase()}`,
      subtitle: bank.name,
      when: urgency === 'Critical' ? 'Needed within hours' : urgency === 'Urgent' ? 'Needed today' : 'Planned',
      status: 'Pending',
      amount: null,
      createdAt: Date.now(),
      meta: { group, component, units, urgency, bankId, patient: patient.trim(), hospital: `${h.name}, ${h.area}` },
    });
    notify({ title: 'Blood request sent', text: `${bank.name} will respond shortly`, service: 'blood' });
    navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BloodStatus', params: { id } }] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Raise request" subtitle={bank.name} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }} keyboardShouldPersistTaps="handled">
        <Section>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pill label="Group" value={group.replace('-', '−')} />
            <Pill label="Units" value={String(units)} />
            <Pill label="Urgency" value={urgency} />
          </View>
        </Section>
        <Section title="Patient details">
          <View style={{ gap: 14 }}>
            <Field label="Patient name" value={patient} onChangeText={setPatient} placeholder="Full name" autoCapitalize="words" />
            <Field label="Contact number" value={phone} onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))} keyboardType="number-pad" hint="The blood bank calls through a masked number." />
          </View>
        </Section>
        <Section title="Admitted at">
          {hospitals.slice(0, 4).map((h) => (
            <Pressable key={h.id} onPress={() => setHospital(h.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
              <RadioDot on={hospital === h.id} />
              <View style={{ flex: 1 }}>
                <T w="semibold" size={14}>{h.name}</T>
                <T size={12} color={colors.muted}>{h.area}</T>
              </View>
            </Pressable>
          ))}
        </Section>
        <Section title="Doctor’s requisition">
          <Pressable onPress={() => setRx((v) => !v)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderStyle: rx ? 'solid' : 'dashed', borderColor: rx ? colors.green : '#F2A9BF', backgroundColor: rx ? colors.greenSoft : '#FFF6F9' }}>
            <FileText size={22} color={rx ? colors.green : S.fg} />
            <View style={{ flex: 1 }}>
              <T w="bold" size={14}>{rx ? 'Requisition attached' : 'Upload requisition form'}</T>
              <T size={12} color={colors.muted}>Signed by the treating doctor. Required by blood banks.</T>
            </View>
          </Pressable>
        </Section>
      </ScrollView>
      <BottomBar>
        <Button title="Send request" disabled={!ok} style={{ flex: 1 }} onPress={submit} />
      </BottomBar>
    </View>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, padding: 10, borderRadius: radius.md, backgroundColor: S.bg }}>
      <T size={11} color={S.text}>{label}</T>
      <T w="extrabold" size={15} color={S.text}>{value}</T>
    </View>
  );
}

/* ---------------------------------------------------------------- Status */

export function BloodStatusScreen({ navigation, route }: any) {
  const { bookings, updateBooking, notify } = useStore();
  const b = bookings.find((x) => x.id === route.params.id);
  const bank = bloodBanks.find((x) => x.id === b?.meta.bankId) ?? bloodBanks[0];

  useEffect(() => {
    if (!b || b.status !== 'Pending') return;
    const t = setTimeout(() => {
      updateBooking(b.id, { status: 'Accepted' });
      notify({ title: 'Blood request accepted', text: `${bank.name} has reserved your units`, service: 'blood' });
    }, 5000);
    return () => clearTimeout(t);
  }, [b, bank.name, notify, updateBooking]);

  if (!b) return null;
  const step = b.status === 'Pending' ? 1 : b.status === 'Accepted' ? 2 : b.status === 'Completed' ? 4 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Blood request" subtitle={b.id} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <T w="extrabold" size={20}>{b.status === 'Pending' ? 'Waiting for the blood bank' : b.status === 'Accepted' ? 'Units reserved for you' : b.status}</T>
              <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>{b.title}</T>
            </View>
            <StatusBadge status={b.status} />
          </View>
          {b.status === 'Accepted' ? (
            <View style={{ marginTop: 12, padding: 12, borderRadius: radius.md, backgroundColor: colors.greenSoft }}>
              <T w="semibold" size={13} color={colors.greenText} lh={19}>Collect within 6 hours with the requisition form and a donor card or replacement donor, as required by the bank.</T>
            </View>
          ) : null}
        </Section>
        <Section title="Progress">
          <Timeline current={step} steps={[{ title: 'Request sent', note: 'Shared with the blood bank' }, { title: 'Blood bank reviewing', note: 'Checking stock and requisition' }, { title: 'Accepted', note: 'Units reserved' }, { title: 'Collected', note: 'Picked up from the bank' }]} />
        </Section>
        <Section title="Blood bank">
          <T w="bold" size={15}>{bank.name}</T>
          <T size={13} color={colors.muted} style={{ marginTop: 2 }}>{bank.area} · {bank.distance} · {bank.open}</T>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <Button title="Call bank" size="md" icon={<Phone size={16} color={colors.white} />} style={{ flex: 1 }} onPress={() => navigation.navigate('Call', { name: bank.name, role: 'Blood bank' })} />
            <Button title="Directions" size="md" variant="outline" style={{ flex: 1 }} onPress={() => Alert.alert('Directions', 'Opens Google Maps once the Maps key is configured.')} />
          </View>
        </Section>
        <Section title="Request details">
          <InfoRow label="Patient" value={b.meta.patient} />
          <InfoRow label="Hospital" value={b.meta.hospital} />
          <InfoRow label="Urgency" value={b.meta.urgency} />
        </Section>
        {b.status === 'Accepted' ? (
          <Section>
            <Button title="Mark as collected" variant="ghost" onPress={() => updateBooking(b.id, { status: 'Completed' })} />
          </Section>
        ) : null}
      </ScrollView>
    </View>
  );
}
