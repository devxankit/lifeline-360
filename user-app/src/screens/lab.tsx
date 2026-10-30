import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Check, Clock, Download, Droplet, FileText, FlaskConical, Search, Share2, Trash2, Utensils } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, BottomBar, Button, IconButton, InfoRow, Section, Segmented } from '../components/ui';
import { AddressSummary, PatientPicker } from '../components/pickers';
import { Fade } from '../components/brand';
import { colors, radius, service } from '../theme';
import { images, labItems, labSlots, nextDays } from '../data/catalog';
import { useStore } from '../store/AppStore';
import { rupees } from '../utils/format';

const S = service.lab;

function AddToggle({ id }: { id: string }) {
  const { labCart, toggleLab } = useStore();
  const on = labCart.includes(id);
  return (
    <Pressable onPress={() => toggleLab(id)} style={{ height: 34, paddingHorizontal: 14, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.teal, backgroundColor: on ? colors.teal : colors.white, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {on ? <Check size={14} color={colors.white} strokeWidth={3} /> : null}
      <T w="bold" size={13} color={on ? colors.white : colors.teal}>{on ? 'Added' : 'Add'}</T>
    </Pressable>
  );
}

function useLabCart() {
  const { labCart } = useStore();
  const items = labCart.map((id) => labItems.find((x) => x.id === id)!).filter(Boolean);
  return { items, total: items.reduce((n, x) => n + x.price, 0), mrp: items.reduce((n, x) => n + x.mrp, 0) };
}

/* ------------------------------------------------------------------ Home */

export function LabHomeScreen({ navigation }: any) {
  const [tab, setTab] = useState<'package' | 'test'>('package');
  const [q, setQ] = useState('');
  const { items, total } = useLabCart();
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return labItems.filter((l) => l.kind === tab && (!s || l.name.toLowerCase().includes(s)));
  }, [tab, q]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Lab tests" subtitle="Sample pickup from home" />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <View style={{ backgroundColor: colors.white, padding: 16, gap: 14 }}>
          <View style={{ height: 136, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: S.bg }}>
            <Image source={images.bannerLab} style={{ position: 'absolute', right: 0, width: '60%', height: '100%' }} resizeMode="cover" />
            <Fade color={S.bg} stops={[0.42, 0.76]} />
            <View style={{ position: 'absolute', left: 16, top: 16, width: 180, gap: 6 }}>
              <T w="extrabold" size={19} color={S.text} lh={23}>Tests at home, reports in the app</T>
              <T size={12} color={S.text}>NABL-accredited partner labs</T>
            </View>
          </View>
          <View style={{ height: 46, borderRadius: radius.md, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
            <Search size={18} color={colors.muted} />
            <TextInput value={q} onChangeText={setQ} placeholder="Search tests, e.g. thyroid, CBC" placeholderTextColor={colors.faint} style={{ flex: 1, fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: colors.ink }} />
          </View>
          <Segmented options={[{ key: 'package', label: 'Health packages' }, { key: 'test', label: 'Single tests' }]} value={tab} onChange={setTab} />
        </View>
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {list.map((l) => (
            <Pressable key={l.id} onPress={() => navigation.navigate('LabTestDetail', { id: l.id })} style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                <T w="bold" size={15} style={{ flex: 1 }}>{l.name}</T>
                {l.kind === 'package' ? <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: S.bg }}><T w="bold" size={11} color={S.text}>{l.tests} tests</T></View> : null}
              </View>
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <Meta icon={<Clock size={13} color={colors.muted} />} text={l.tat} />
                <Meta icon={<Utensils size={13} color={colors.muted} />} text={l.prep} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                  <T w="extrabold" size={16}>{rupees(l.price)}</T>
                  <T size={12} color={colors.muted} style={{ textDecorationLine: 'line-through' }}>{rupees(l.mrp)}</T>
                  <T w="bold" size={12} color={colors.green}>{Math.round((1 - l.price / l.mrp) * 100)}% off</T>
                </View>
                <AddToggle id={l.id} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {items.length ? (
        <BottomBar>
          <View>
            <T size={12} color={colors.muted}>{items.length} selected</T>
            <T w="extrabold" size={18}>{rupees(total)}</T>
          </View>
          <Button title="Book home collection" style={{ flex: 1 }} onPress={() => navigation.navigate('LabSchedule')} />
        </BottomBar>
      ) : null}
    </View>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 1 }}>
      {icon}
      <T size={12} color={colors.muted} numberOfLines={1}>{text}</T>
    </View>
  );
}

/* ---------------------------------------------------------------- Detail */

export function LabTestDetailScreen({ navigation, route }: any) {
  const l = labItems.find((x) => x.id === route.params.id)!;
  const { labCart, toggleLab } = useStore();
  const on = labCart.includes(l.id);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title={l.kind === 'package' ? 'Health package' : 'Lab test'} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section>
          <T w="extrabold" size={20}>{l.name}</T>
          <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>{l.kind === 'package' ? `Includes ${l.tests} tests` : 'Single test'}</T>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
            <T w="extrabold" size={22}>{rupees(l.price)}</T>
            <T size={13} color={colors.muted} style={{ textDecorationLine: 'line-through' }}>{rupees(l.mrp)}</T>
            <T w="bold" size={13} color={colors.green}>{Math.round((1 - l.price / l.mrp) * 100)}% off</T>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <Fact icon={<Droplet size={18} color={S.fg} />} label="Sample" value={l.sample} />
            <Fact icon={<Utensils size={18} color={S.fg} />} label="Preparation" value={l.prep} />
            <Fact icon={<FileText size={18} color={S.fg} />} label="Report" value={l.tat.replace('Reports in ', '')} />
          </View>
        </Section>
        <Section title={l.kind === 'package' ? 'What’s included' : 'Parameters'}>
          {l.includes.map((x) => (
            <View key={x} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 7 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: S.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Check size={12} color={S.fg} strokeWidth={3} />
              </View>
              <T size={14}>{x}</T>
            </View>
          ))}
        </Section>
        <Section title="How it works">
          <T size={13} color={colors.ink2} lh={20}>A trained phlebotomist visits at your chosen slot with a sealed, single-use kit. Your report appears in the Health tab, usually {l.tat.toLowerCase().replace('reports ', '')}.</T>
        </Section>
      </ScrollView>
      <BottomBar>
        <Button title={on ? 'Remove' : 'Add to cart'} variant={on ? 'ghost' : 'outline'} style={{ flex: 1 }} onPress={() => toggleLab(l.id)} />
        <Button title="Book now" style={{ flex: 1 }} onPress={() => { if (!on) toggleLab(l.id); navigation.navigate('LabSchedule'); }} />
      </BottomBar>
    </View>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={{ flex: 1, padding: 10, borderRadius: radius.md, backgroundColor: colors.surface2, gap: 4 }}>
      {icon}
      <T size={11} color={colors.muted}>{label}</T>
      <T w="bold" size={12}>{value}</T>
    </View>
  );
}

/* --------------------------------------------------------------- Schedule */

export function LabScheduleScreen({ navigation }: any) {
  const { items, total, mrp } = useLabCart();
  const { toggleLab } = useStore();
  const days = useMemo(() => nextDays(5).slice(1), []);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [patient, setPatient] = useState('Self');
  const fee = total >= 999 ? 0 : 99;

  if (!items.length)
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <AppBar title="Book home collection" />
        <View style={{ padding: 32, alignItems: 'center', gap: 12 }}>
          <FlaskConical size={34} color={S.fg} />
          <T w="bold" size={16}>No tests selected</T>
          <Button title="Browse tests" onPress={() => navigation.navigate('LabHome')} />
        </View>
      </View>
    );

  const book = () => {
    navigation.navigate('Checkout', {
      idPrefix: 'L',
      allowCash: false,
      draft: {
        service: 'lab',
        title: items.length === 1 ? items[0].name : `${items[0].name} + ${items.length - 1} more`,
        subtitle: 'Home sample collection',
        when: `${days[day].label}, ${slot}`,
        status: 'Scheduled',
        amount: total + fee,
        meta: { items: items.map((x) => x.id), patient, step: 0 },
      },
      lines: [
        { label: 'Tests (MRP)', amount: mrp },
        { label: 'Discount', amount: -(mrp - total) },
        { label: 'Home collection fee', amount: fee },
      ],
      total: total + fee,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Book home collection" />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section title="Selected tests">
          {items.map((x) => (
            <View key={x.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
              <T w="semibold" size={14} style={{ flex: 1 }}>{x.name}</T>
              <T w="bold" size={14}>{rupees(x.price)}</T>
              <IconButton label="Remove" onPress={() => toggleLab(x.id)} style={{ width: 34, height: 34 }}>
                <Trash2 size={16} color={colors.muted} />
              </IconButton>
            </View>
          ))}
          <Pressable onPress={() => navigation.navigate('LabHome')}><T w="bold" size={13} color={colors.teal} style={{ marginTop: 4 }}>+ Add more tests</T></Pressable>
        </Section>
        <Section title="Patient">
          <PatientPicker value={patient} onChange={setPatient} />
        </Section>
        <Section title="Collection slot">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {days.map((d, i) => (
              <Pressable key={d.key} onPress={() => setDay(i)} style={{ paddingHorizontal: 14, height: 44, borderRadius: radius.md, justifyContent: 'center', backgroundColor: i === day ? colors.teal : colors.white, borderWidth: i === day ? 0 : 1, borderColor: colors.lineStrong }}>
                <T w="bold" size={13} color={i === day ? colors.white : colors.ink}>{d.label}</T>
              </Pressable>
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {labSlots.map((s) => (
              <Pressable key={s} onPress={() => setSlot(s)} style={{ width: '48.6%', height: 42, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: s === slot ? colors.teal : colors.white, borderWidth: s === slot ? 0 : 1, borderColor: colors.tealLine }}>
                <T w="semibold" size={13} color={s === slot ? colors.white : colors.teal}>{s}</T>
              </Pressable>
            ))}
          </View>
          <T size={12} color={colors.muted} style={{ marginTop: 10 }}>Morning slots are best for fasting tests.</T>
        </Section>
        <Section title="Collection address">
          <AddressSummary />
        </Section>
        <Section title="Bill summary">
          <InfoRow label="Tests (MRP)" value={rupees(mrp)} />
          <InfoRow label="Discount" value={rupees(-(mrp - total))} />
          <InfoRow label="Home collection" value={fee ? rupees(fee) : 'Free'} />
        </Section>
      </ScrollView>
      <BottomBar>
        <View>
          <T size={12} color={colors.muted}>{slot ? `${days[day].label}, ${slot}` : 'Choose a slot'}</T>
          <T w="extrabold" size={18}>{rupees(total + fee)}</T>
        </View>
        <Button title="Continue" disabled={!slot} style={{ flex: 1 }} onPress={book} />
      </BottomBar>
    </View>
  );
}

/* ---------------------------------------------------------------- Report */

const SAMPLE_RESULTS = [
  { name: 'Haemoglobin', value: '13.4', unit: 'g/dL', range: '12.0 – 15.5', flag: 'Normal' },
  { name: 'Total cholesterol', value: '212', unit: 'mg/dL', range: '< 200', flag: 'High' },
  { name: 'HDL cholesterol', value: '48', unit: 'mg/dL', range: '> 40', flag: 'Normal' },
  { name: 'HbA1c', value: '5.6', unit: '%', range: '< 5.7', flag: 'Normal' },
  { name: 'TSH', value: '2.1', unit: 'µIU/mL', range: '0.4 – 4.0', flag: 'Normal' },
  { name: 'Vitamin D (25-OH)', value: '18', unit: 'ng/mL', range: '30 – 100', flag: 'Low' },
];

export function ReportViewScreen({ route }: any) {
  const { bookings, user } = useStore();
  const b = bookings.find((x) => x.id === route.params.id);
  if (!b) return null;
  const flagColor = (f: string) => (f === 'Normal' ? { bg: colors.greenSoft, fg: colors.greenText } : f === 'High' ? { bg: colors.redSoft, fg: colors.redText } : { bg: colors.amberSoft, fg: colors.amberText });
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar
        title="Lab report"
        subtitle={b.id}
        right={
          <View style={{ flexDirection: 'row' }}>
            <IconButton label="Share" onPress={() => Alert.alert('Share report', 'Share the PDF with your doctor or family.')}><Share2 size={20} color={colors.ink} /></IconButton>
            <IconButton label="Download" onPress={() => Alert.alert('Downloaded', 'Report saved to your phone (demo).')}><Download size={20} color={colors.ink} /></IconButton>
          </View>
        }
      />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section>
          <T w="extrabold" size={18}>{b.title}</T>
          <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>{b.meta.patient === 'Self' || !b.meta.patient ? user?.name || 'You' : b.meta.patient} · Collected {b.when.split(',')[0]}</T>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Summary n={SAMPLE_RESULTS.filter((r) => r.flag === 'Normal').length} label="Normal" c={colors.greenText} bg={colors.greenSoft} />
            <Summary n={SAMPLE_RESULTS.filter((r) => r.flag !== 'Normal').length} label="Need attention" c={colors.redText} bg={colors.redSoft} />
          </View>
        </Section>
        <Section title="Results">
          {SAMPLE_RESULTS.map((r, i) => {
            const fc = flagColor(r.flag);
            return (
              <View key={r.name} style={{ paddingVertical: 12, borderBottomWidth: i === SAMPLE_RESULTS.length - 1 ? 0 : 1, borderBottomColor: '#EEF0EF', gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <T w="semibold" size={14}>{r.name}</T>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: fc.bg }}><T w="bold" size={11} color={fc.fg}>{r.flag}</T></View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <T w="extrabold" size={16}>{r.value} <T size={12} color={colors.muted}>{r.unit}</T></T>
                  <T size={12} color={colors.muted}>Range {r.range}</T>
                </View>
              </View>
            );
          })}
        </Section>
        <Section>
          <T size={12} color={colors.muted} lh={18}>Sample report for the demo. Discuss results with your doctor before making any changes to treatment.</T>
        </Section>
      </ScrollView>
    </View>
  );
}

function Summary({ n, label, c, bg }: { n: number; label: string; c: string; bg: string }) {
  return (
    <View style={{ flex: 1, padding: 12, borderRadius: radius.md, backgroundColor: bg }}>
      <T w="extrabold" size={20} color={c}>{n}</T>
      <T w="semibold" size={12} color={c}>{label}</T>
    </View>
  );
}
