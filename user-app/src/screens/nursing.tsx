import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, TextInput, View } from 'react-native';
import { BadgeCheck, ChevronRight, ShieldCheck } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, Avatar, BottomBar, Button, RadioDot, Rating, Section } from '../components/ui';
import { AddressSummary, PatientPicker } from '../components/pickers';
import { Fade } from '../components/brand';
import { colors, radius, service } from '../theme';
import { caretakers, images, nextDays, nursingServices } from '../data/catalog';
import { rupees } from '../utils/format';

const S = service.nursing;

export function NursingHomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Nursing & caretakers" />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <View style={{ backgroundColor: colors.white, padding: 16 }}>
          <View style={{ height: 150, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: S.bg }}>
            <Image source={images.bannerNurse} style={{ position: 'absolute', right: 0, width: '62%', height: '100%' }} resizeMode="cover" />
            <Fade color={S.bg} stops={[0.4, 0.75]} />
            <View style={{ position: 'absolute', left: 16, top: 16, width: 180, gap: 6 }}>
              <T w="extrabold" size={20} color={S.text} lh={24}>Trusted care at home</T>
              <T size={12} color={S.text} lh={17}>Verified nurses and caretakers, background-checked and trained.</T>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 14 }}>
            {['ID & police verified', 'Trained staff', 'Replacement on request'].map((t) => (
              <View key={t} style={{ flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <ShieldCheck size={15} color={S.fg} />
                <T w="semibold" size={11} color={colors.ink2} style={{ flex: 1 }}>{t}</T>
              </View>
            ))}
          </View>
        </View>
        <Section title="Choose a service">
          {nursingServices.map((s, i) => (
            <Pressable key={s.id} onPress={() => navigation.navigate('NursingService', { id: s.id })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: i === nursingServices.length - 1 ? 0 : 1, borderBottomColor: '#EEF0EF' }}>
              <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: S.bg, alignItems: 'center', justifyContent: 'center' }}>
                <T w="extrabold" size={16} color={S.fg}>{s.name[0]}</T>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <T w="bold" size={15}>{s.name}</T>
                <T size={12} color={colors.muted}>{s.short}</T>
                <T w="semibold" size={12} color={S.text}>From {rupees(Math.min(...s.packages.map((p) => p.price)))}</T>
              </View>
              <ChevronRight size={18} color={colors.faint} />
            </Pressable>
          ))}
        </Section>
      </ScrollView>
    </View>
  );
}

export function NursingServiceScreen({ navigation, route }: any) {
  const s = nursingServices.find((x) => x.id === route.params.id)!;
  const [pkg, setPkg] = useState(s.packages[0].id);
  const [ct, setCt] = useState(caretakers[0].id);
  const [day, setDay] = useState(1);
  const [time, setTime] = useState('8:00 AM');
  const [patient, setPatient] = useState('Self');
  const [notes, setNotes] = useState('');
  const days = useMemo(() => nextDays(6), []);
  const p = s.packages.find((x) => x.id === pkg)!;
  const c = caretakers.find((x) => x.id === ct)!;

  const book = () =>
    navigation.navigate('Checkout', {
      idPrefix: 'N',
      allowCash: false,
      draft: {
        service: 'nursing',
        title: `${s.name} · ${p.label}`,
        subtitle: `${c.name} · for ${patient === 'Self' ? 'you' : patient}`,
        when: `${days[day].label}, ${time}`,
        status: 'Confirmed',
        amount: p.price,
        meta: { serviceId: s.id, caretakerId: c.id, patient, notes, step: 0 },
      },
      lines: [
        { label: p.label, amount: p.price },
        { label: 'Visit & safety kit', amount: 0 },
      ],
      total: p.price,
    });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title={s.name} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section>
          <T size={13} color={colors.ink2} lh={20}>{s.about}</T>
        </Section>
        <Section title="Choose a plan">
          {s.packages.map((x) => {
            const on = x.id === pkg;
            return (
              <Pressable key={x.id} onPress={() => setPkg(x.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginBottom: 8, borderRadius: radius.md, borderWidth: on ? 1.5 : 1, borderColor: on ? S.fg : colors.lineStrong, backgroundColor: on ? '#F6F4FE' : colors.white }}>
                <RadioDot on={on} />
                <View style={{ flex: 1 }}>
                  <T w="bold" size={14}>{x.label}</T>
                  <T size={12} color={colors.muted}>{x.note}</T>
                </View>
                <T w="extrabold" size={15}>{rupees(x.price)}</T>
              </Pressable>
            );
          })}
        </Section>
        <Section title="Choose a caretaker">
          {caretakers.map((x) => {
            const on = x.id === ct;
            return (
              <Pressable key={x.id} onPress={() => setCt(x.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginBottom: 8, borderRadius: radius.md, borderWidth: on ? 1.5 : 1, borderColor: on ? S.fg : colors.lineStrong }}>
                <Avatar source={x.photo} name={x.name} size={52} rounded="md" />
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <T w="bold" size={14}>{x.name}</T>
                    {x.verified ? <BadgeCheck size={16} color={colors.white} fill={S.fg} /> : null}
                  </View>
                  <T size={12} color={colors.muted}>{x.role} · {x.exp} yrs</T>
                  <Rating value={x.rating} />
                </View>
                <RadioDot on={on} />
              </Pressable>
            );
          })}
        </Section>
        <Section title="Start date & time">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {days.map((d, i) => (
              <Pressable key={d.key} onPress={() => setDay(i)} style={{ paddingHorizontal: 14, height: 44, borderRadius: radius.md, justifyContent: 'center', backgroundColor: i === day ? colors.teal : colors.white, borderWidth: i === day ? 0 : 1, borderColor: colors.lineStrong }}>
                <T w="bold" size={13} color={i === day ? colors.white : colors.ink}>{d.label}</T>
              </Pressable>
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '6:00 PM', '8:00 PM'].map((t) => (
              <Pressable key={t} onPress={() => setTime(t)} style={{ width: '31.5%', height: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: t === time ? colors.teal : colors.white, borderWidth: t === time ? 0 : 1, borderColor: colors.tealLine }}>
                <T w="semibold" size={13} color={t === time ? colors.white : colors.teal}>{t}</T>
              </Pressable>
            ))}
          </View>
        </Section>
        <Section title="Patient">
          <PatientPicker value={patient} onChange={setPatient} />
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Care notes: condition, medicines, mobility, diet (optional)"
            placeholderTextColor={colors.faint}
            multiline
            style={{ marginTop: 12, minHeight: 84, borderRadius: radius.md, borderWidth: 1, borderColor: colors.lineStrong, padding: 12, fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: colors.ink, textAlignVertical: 'top' }}
          />
        </Section>
        <Section title="Service address">
          <AddressSummary />
        </Section>
      </ScrollView>
      <BottomBar>
        <View>
          <T size={12} color={colors.muted}>{p.label}</T>
          <T w="extrabold" size={18}>{rupees(p.price)}</T>
        </View>
        <Button title="Continue" style={{ flex: 1 }} onPress={book} />
      </BottomBar>
    </View>
  );
}
