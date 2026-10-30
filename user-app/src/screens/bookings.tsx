import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarX, ChevronRight, FileText, Phone } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, Avatar, Button, Chip, EmptyState, InfoRow, Section, Segmented, ServiceBadge, StatusBadge, Timeline } from '../components/ui';
import { DuoIcon } from '../components/brand';
import { colors, radius, service, ServiceKey } from '../theme';
import { caretakers, doctors, labItems, nursingServices } from '../data/catalog';
import { Booking, useStore } from '../store/AppStore';
import { rupees } from '../utils/format';

const DONE = ['Completed', 'Delivered', 'Cancelled', 'Rejected', 'Report ready'];

export function openBooking(nav: any, b: Booking) {
  if (b.service === 'doctor') nav.navigate('AppointmentDetail', { id: b.id });
  else if (b.service === 'medicine') nav.navigate('OrderTracking', { id: b.id });
  else if (b.service === 'blood') nav.navigate('BloodStatus', { id: b.id });
  else if (b.service === 'ambulance') nav.navigate(b.status === 'Completed' || b.status === 'Cancelled' ? 'BookingDetail' : 'AmbulanceTracking', { id: b.id });
  else if (b.service === 'lab' && b.status === 'Report ready') nav.navigate('ReportView', { id: b.id });
  else if (b.service === 'membership') nav.navigate('Membership');
  else nav.navigate('BookingDetail', { id: b.id });
}

export function BookingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { bookings } = useStore();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [filter, setFilter] = useState<ServiceKey | 'all'>('all');
  const list = useMemo(
    () =>
      bookings
        .filter((b) => (tab === 'upcoming' ? !DONE.includes(b.status) : DONE.includes(b.status)))
        .filter((b) => filter === 'all' || b.service === filter)
        .sort((a, b) => b.createdAt - a.createdAt),
    [bookings, tab, filter],
  );
  const filters: (ServiceKey | 'all')[] = ['all', 'doctor', 'medicine', 'lab', 'nursing', 'ambulance', 'blood'];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <View style={{ height: 56, justifyContent: 'center', paddingHorizontal: 16 }}>
          <T w="bold" size={18}>My bookings</T>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 12, gap: 12 }}>
          <Segmented options={[{ key: 'upcoming', label: 'Active' }, { key: 'past', label: 'Past' }]} value={tab} onChange={setTab} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {filters.map((f) => (
              <Chip key={f} label={f === 'all' ? 'All' : service[f].label} active={filter === f} onPress={() => setFilter(f)} />
            ))}
          </ScrollView>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {list.length === 0 ? (
          <EmptyState icon={<CalendarX size={30} color={colors.teal} />} title={tab === 'upcoming' ? 'No active bookings' : 'Nothing here yet'} text="Book a doctor, order medicines or schedule a test, and it will appear here." action="Book a service" onAction={() => navigation.navigate('Home')} />
        ) : null}
        {list.map((b) => (
          <BookingCard key={b.id} b={b} onPress={() => openBooking(navigation, b)} />
        ))}
      </ScrollView>
    </View>
  );
}

export function BookingCard({ b, onPress }: { b: Booking; onPress: () => void }) {
  const s = service[b.service];
  const doc = b.service === 'doctor' ? doctors.find((d) => d.id === b.meta.doctorId) : undefined;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 10, opacity: pressed ? 0.85 : 1 })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ServiceBadge kind={b.service} />
        <StatusBadge status={b.status} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {doc ? (
          <Avatar source={doc.photo} name={doc.name} size={46} rounded="md" />
        ) : (
          <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: s.bg, alignItems: 'center', justifyContent: 'center' }}>
            {b.service === 'ambulance' ? <DuoIcon name="ambulance" size={28} /> : b.service === 'blood' ? <DuoIcon name="blood" size={28} /> : b.service === 'lab' ? <DuoIcon name="report" size={28} /> : b.service === 'membership' ? <DuoIcon name="membership" size={28} /> : <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: s.fg }} />}
          </View>
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <T w="bold" size={15} numberOfLines={1}>{b.title}</T>
          <T size={12} color={colors.muted} numberOfLines={1}>{b.subtitle}</T>
          <T w="semibold" size={12} color={colors.ink2}>{b.when}</T>
        </View>
        <ChevronRight size={18} color={colors.faint} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#EEF0EF', paddingTop: 10 }}>
        <T size={12} color={colors.muted}>{b.id}</T>
        <T w="bold" size={13}>{b.amount == null ? (b.service === 'ambulance' ? 'Pay after trip' : '—') : rupees(b.amount)}</T>
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------- Generic booking detail */

const STEPS: Partial<Record<ServiceKey, { title: string; note?: string }[]>> = {
  nursing: [{ title: 'Booking confirmed' }, { title: 'Caretaker assigned', note: 'Profile shared by SMS' }, { title: 'Service started', note: 'Caretaker checks in on arrival' }, { title: 'Service completed' }],
  lab: [{ title: 'Booking confirmed' }, { title: 'Phlebotomist assigned' }, { title: 'Sample collected' }, { title: 'Processing at lab' }, { title: 'Report ready' }],
  ambulance: [{ title: 'Requested' }, { title: 'Driver assigned' }, { title: 'Picked up' }, { title: 'Reached hospital' }],
};

export function BookingDetailScreen({ navigation, route }: any) {
  const { bookings, updateBooking } = useStore();
  const b = bookings.find((x) => x.id === route.params.id);
  if (!b) return null;
  const steps = STEPS[b.service] ?? [{ title: 'Confirmed' }, { title: 'Completed' }];
  const done = ['Completed', 'Report ready', 'Delivered'].includes(b.status);
  const current = b.status === 'Cancelled' ? -1 : done ? steps.length : Math.max(1, b.meta.step ?? 1);
  const ct = b.service === 'nursing' ? caretakers.find((c) => c.id === b.meta.caretakerId) : undefined;
  const ns = b.service === 'nursing' ? nursingServices.find((s) => s.id === b.meta.serviceId) : undefined;
  const tests = b.service === 'lab' ? (b.meta.items as string[]).map((id) => labItems.find((l) => l.id === id)?.name).filter(Boolean) : [];
  const cancellable = !done && b.status !== 'Cancelled' && b.service !== 'ambulance';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title={service[b.service].label} subtitle={b.id} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <T w="extrabold" size={18}>{b.title}</T>
              <T size={13} color={colors.ink2} style={{ marginTop: 3 }}>{b.subtitle}</T>
              <T w="semibold" size={13} color={colors.teal} style={{ marginTop: 3 }}>{b.when}</T>
            </View>
            <StatusBadge status={b.status} />
          </View>
        </Section>
        {ct ? (
          <Section title="Your caretaker">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar source={ct.photo} name={ct.name} size={52} rounded="md" />
              <View style={{ flex: 1 }}>
                <T w="bold" size={15}>{ct.name}</T>
                <T size={12} color={colors.muted}>{ct.role} · {ct.exp} yrs · {ct.languages}</T>
              </View>
              {!done && b.status !== 'Cancelled' ? <Button title="Call" size="sm" icon={<Phone size={14} color={colors.white} />} onPress={() => navigation.navigate('Call', { name: ct.name, role: ns?.name ?? 'Caretaker', photo: ct.photo })} /> : null}
            </View>
          </Section>
        ) : null}
        {b.status !== 'Cancelled' ? (
          <Section title="Status">
            <Timeline steps={steps} current={current} />
          </Section>
        ) : null}
        <Section title="Details">
          {b.meta.patient ? <InfoRow label="Patient" value={b.meta.patient} /> : null}
          {tests.length ? <InfoRow label="Tests" value={tests.join(', ')} /> : null}
          {b.meta.notes ? <InfoRow label="Care notes" value={b.meta.notes} /> : null}
          {b.meta.pickup ? <InfoRow label="Pickup" value={b.meta.pickup} /> : null}
          <InfoRow label="Amount" value={b.amount == null ? '—' : rupees(b.amount)} bold />
        </Section>
        {b.service === 'lab' && b.status === 'Report ready' ? (
          <Section>
            <Button title="View report" icon={<FileText size={18} color={colors.white} />} onPress={() => navigation.navigate('ReportView', { id: b.id })} />
          </Section>
        ) : null}
        {cancellable ? (
          <Section>
            <Button
              title="Cancel booking"
              variant="ghost"
              onPress={() =>
                Alert.alert('Cancel booking?', 'A full refund goes back to your payment method in 5–7 days.', [
                  { text: 'Keep', style: 'cancel' },
                  { text: 'Cancel booking', style: 'destructive', onPress: () => updateBooking(b.id, { status: 'Cancelled' }) },
                ])
              }
            />
          </Section>
        ) : null}
      </ScrollView>
    </View>
  );
}
