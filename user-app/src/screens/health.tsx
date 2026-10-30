import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Droplet, FileText, Pill, Upload, Users } from 'lucide-react-native';
import T from '../components/T';
import { Button, EmptyState, Section } from '../components/ui';
import { DuoIcon } from '../components/brand';
import { colors, radius, service } from '../theme';
import { useStore } from '../store/AppStore';
import { openBooking } from './bookings';

export function HealthScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, family, bookings, rxUploaded } = useStore();
  const reports = bookings.filter((b) => b.service === 'lab');
  const consults = bookings.filter((b) => b.service === 'doctor' && b.status === 'Completed');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <T w="bold" size={18}>Health records</T>
          <Button title="Upload" size="sm" variant="soft" icon={<Upload size={15} color={colors.tealDark} />} onPress={() => Alert.alert('Upload record', 'Add PDFs or photos of old reports and prescriptions. File picker connects in the next build.')} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', gap: 10, padding: 16, backgroundColor: colors.white }}>
          <Stat icon={<Droplet size={18} color={service.blood.fg} />} bg={service.blood.bg} label="Blood group" value={user?.bloodGroup || 'Add'} onPress={() => navigation.navigate('EditProfile')} />
          <Stat icon={<FileText size={18} color={service.lab.fg} />} bg={service.lab.bg} label="Reports" value={String(reports.length)} />
          <Stat icon={<Users size={18} color={service.nursing.fg} />} bg={service.nursing.bg} label="Family" value={String(family.length + 1)} onPress={() => navigation.navigate('Family')} />
        </View>

        <Section title="Lab reports">
          {reports.length === 0 ? (
            <EmptyState icon={<FileText size={28} color={colors.teal} />} title="No reports yet" text="Book a lab test and your digital report will appear here." action="Book a test" onAction={() => navigation.navigate('LabHome')} />
          ) : (
            reports.map((b, i) => (
              <Pressable key={b.id} onPress={() => openBooking(navigation, b)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: i === reports.length - 1 ? 0 : 1, borderBottomColor: '#EEF0EF' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: service.lab.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <DuoIcon name="report" size={26} />
                </View>
                <View style={{ flex: 1 }}>
                  <T w="bold" size={14}>{b.title}</T>
                  <T size={12} color={colors.muted}>{b.when}</T>
                </View>
                <T w="bold" size={12} color={b.status === 'Report ready' ? colors.green : colors.amberText}>{b.status === 'Report ready' ? 'View' : 'Awaited'}</T>
                <ChevronRight size={18} color={colors.faint} />
              </Pressable>
            ))
          )}
        </Section>

        <Section title="Prescriptions">
          {rxUploaded || consults.length ? (
            <>
              {rxUploaded ? <Row icon={<Pill size={18} color={colors.green} />} bg={colors.greenSoft} title="Prescription photo" sub="Uploaded with medicine order" /> : null}
              {consults.map((c) => (
                <Row key={c.id} icon={<FileText size={18} color={colors.teal} />} bg={colors.tealTint} title={`Consultation · ${c.title}`} sub={c.when} />
              ))}
            </>
          ) : (
            <T size={13} color={colors.muted}>Prescriptions from your consultations and uploads appear here.</T>
          )}
        </Section>

        <Section title="Family health">
          <Row icon={<Users size={18} color={service.nursing.fg} />} bg={service.nursing.bg} title={`${family.length + 1} profiles`} sub="Book for family and keep their records together" onPress={() => navigation.navigate('Family')} />
        </Section>
      </ScrollView>
    </View>
  );
}

function Stat({ icon, bg, label, value, onPress }: { icon: React.ReactNode; bg: string; label: string; value: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ flex: 1, padding: 12, borderRadius: radius.md, backgroundColor: bg, gap: 6 }}>
      {icon}
      <T w="extrabold" size={18}>{value}</T>
      <T size={11} color={colors.ink2}>{label}</T>
    </Pressable>
  );
}

function Row({ icon, bg, title, sub, onPress }: { icon: React.ReactNode; bg: string; title: string; sub: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
      <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <View style={{ flex: 1 }}>
        <T w="semibold" size={14}>{title}</T>
        <T size={12} color={colors.muted}>{sub}</T>
      </View>
      {onPress ? <ChevronRight size={18} color={colors.faint} /> : null}
    </Pressable>
  );
}
