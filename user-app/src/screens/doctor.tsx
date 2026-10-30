import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BadgeCheck, Calendar, Clock, Heart, MapPin, MessageSquare, Mic, MicOff, PhoneOff, Search, Share2, SwitchCamera, Video, VideoOff, Wallet } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, Avatar, BottomBar, Button, Chip, IconButton, InfoRow, Rating, Section, StatusBadge } from '../components/ui';
import { PatientPicker } from '../components/pickers';
import { colors, radius } from '../theme';
import { doctors, nextDays, slotsFor, specialties } from '../data/catalog';
import { useStore } from '../store/AppStore';
import { rupees } from '../utils/format';

/* ---------------------------------------------------------- Doctor list */

export function FindDoctorScreen({ navigation, route }: any) {
  const [spec, setSpec] = useState<string>(route.params?.specialty ?? 'all');
  const [today, setToday] = useState(false);
  const [video, setVideo] = useState(false);
  const [sort, setSort] = useState<'relevance' | 'fee' | 'exp'>('relevance');

  const list = useMemo(() => {
    let l = doctors.filter((d) => spec === 'all' || d.specialty === spec);
    if (today) l = l.filter((d) => d.next.startsWith('Available today'));
    if (sort === 'fee') l = [...l].sort((a, b) => (video ? a.feeVideo - b.feeVideo : a.feeClinic - b.feeClinic));
    if (sort === 'exp') l = [...l].sort((a, b) => b.exp - a.exp);
    return l;
  }, [spec, today, sort, video]);

  const tabs = [{ id: 'all', label: 'All' }, ...specialties];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar
        title={spec === 'all' ? 'Find doctors' : specialties.find((s) => s.id === spec)?.label}
        subtitle={`Bengaluru · ${list.length} doctors`}
        border={false}
        right={
          <IconButton label="Search" onPress={() => navigation.navigate('Search')}>
            <Search size={21} color={colors.ink} />
          </IconButton>
        }
      />
      <View style={{ backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 22 }}>
          {tabs.map((t) => {
            const on = t.id === spec;
            return (
              <Pressable key={t.id} onPress={() => setSpec(t.id)} style={{ height: 42, justifyContent: 'center', borderBottomWidth: 3, borderBottomColor: on ? colors.teal : 'transparent' }}>
                <T w={on ? 'bold' : 'semibold'} size={14} color={on ? colors.teal : colors.muted}>
                  {t.label}
                </T>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <View style={{ backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
          <Chip label={sort === 'relevance' ? 'Sort: Relevance' : sort === 'fee' ? 'Sort: Lowest fee' : 'Sort: Experience'} onPress={() => setSort(sort === 'relevance' ? 'fee' : sort === 'fee' ? 'exp' : 'relevance')} />
          <Chip label="Available today" active={today} onPress={() => setToday((v) => !v)} />
          <Chip label="Video consult" active={video} onPress={() => setVideo((v) => !v)} />
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ gap: 8, paddingVertical: 8 }}>
        {list.length === 0 ? (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <T w="bold" size={15}>No doctors match these filters</T>
            <T size={13} color={colors.muted} style={{ marginTop: 6 }}>Try turning off “Available today”.</T>
          </View>
        ) : null}
        {list.map((d) => (
          <View key={d.id} style={{ backgroundColor: colors.white, padding: 16, gap: 14 }}>
            <Pressable onPress={() => navigation.navigate('DoctorProfile', { id: d.id, mode: video ? 'video' : 'clinic' })} style={{ flexDirection: 'row', gap: 14 }}>
              <View>
                <Avatar source={d.photo} name={d.name} size={76} rounded="md" />
                <View style={{ position: 'absolute', right: -4, bottom: -4, backgroundColor: colors.white, borderRadius: 12, padding: 1 }}>
                  <BadgeCheck size={20} color={colors.white} fill={colors.teal} />
                </View>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <T w="bold" size={16}>{d.name}</T>
                <T size={13} color={colors.ink2}>{d.role} · {d.degree.split(' (')[0]}</T>
                <T size={13} color={colors.ink2}>{d.exp} years experience</T>
                <View style={{ marginTop: 3 }}>
                  <Rating value={d.rating} reviews={d.reviews} />
                </View>
              </View>
            </Pressable>
            <View style={{ gap: 6 }}>
              <IconLine icon={<MapPin size={15} color={colors.muted} />} text={`${d.clinic}, ${d.area} · ${d.distance}`} />
              <IconLine icon={<Wallet size={15} color={colors.muted} />} text={`${rupees(video ? d.feeVideo : d.feeClinic)} ${video ? 'video' : 'clinic'} consultation fee`} />
              <IconLine icon={<Clock size={15} color={colors.green} />} text={d.next} color={colors.green} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Video consult" variant="outline" size="md" style={{ flex: 1 }} onPress={() => navigation.navigate('DoctorProfile', { id: d.id, mode: 'video' })} />
              <Button title="Book clinic visit" size="md" style={{ flex: 1 }} onPress={() => navigation.navigate('DoctorProfile', { id: d.id, mode: 'clinic' })} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function IconLine({ icon, text, color }: { icon: React.ReactNode; text: string; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {icon}
      <T w={color ? 'semibold' : 'regular'} size={13} color={color ?? colors.ink2} style={{ flex: 1 }} numberOfLines={1}>
        {text}
      </T>
    </View>
  );
}

/* -------------------------------------------------------- Doctor profile */

export function DoctorProfileScreen({ navigation, route }: any) {
  const d = doctors.find((x) => x.id === route.params.id)!;
  const [mode, setMode] = useState<'clinic' | 'video'>(route.params.mode ?? 'clinic');
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [patient, setPatient] = useState('Self');
  const [saved, setSaved] = useState(false);
  const days = useMemo(() => nextDays(7), []);
  const groups = useMemo(() => slotsFor(day), [day]);
  const free = groups.reduce((n, g) => n + g.slots.filter((s) => !s.taken).length, 0);
  const fee = mode === 'video' ? d.feeVideo : d.feeClinic;

  useEffect(() => setSlot(null), [day]);

  const book = () => {
    const when = `${days[day].label}, ${slot}`;
    navigation.navigate('Checkout', {
      idPrefix: 'D',
      allowCash: mode === 'clinic',
      draft: {
        service: 'doctor',
        title: d.name,
        subtitle: `${d.role} · ${mode === 'video' ? 'Video consultation' : d.clinic}`,
        when,
        status: 'Confirmed',
        amount: fee,
        meta: { doctorId: d.id, mode, slot, day: days[day].key, patient },
      },
      lines: [
        { label: `${mode === 'video' ? 'Video' : 'Clinic'} consultation fee`, amount: fee },
        { label: 'Platform fee', amount: 0 },
      ],
      total: fee,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar
        border={false}
        right={
          <View style={{ flexDirection: 'row' }}>
            <IconButton label="Share" onPress={() => Alert.alert('Share', `Share ${d.name}'s profile link (available after launch).`)}>
              <Share2 size={20} color={colors.ink} />
            </IconButton>
            <IconButton label={saved ? 'Remove from saved' : 'Save doctor'} onPress={() => setSaved((v) => !v)}>
              <Heart size={20} color={saved ? colors.red : colors.ink} fill={saved ? colors.red : 'transparent'} />
            </IconButton>
          </View>
        }
      />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <View style={{ backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 16, gap: 14 }}>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <Avatar source={d.photo} name={d.name} size={84} rounded="md" />
            <View style={{ flex: 1, gap: 3 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <T w="bold" size={19}>{d.name}</T>
                <BadgeCheck size={18} color={colors.white} fill={colors.teal} />
              </View>
              <T size={13} color={colors.ink2}>{d.role} · {d.degree}</T>
              <T size={13} color={colors.ink2}>Speaks {d.languages}</T>
            </View>
          </View>
          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }}>
            <Stat value={`${d.exp} yrs`} label="Experience" />
            <Stat value={`${d.rating} ★`} label={`${d.reviews} reviews`} border />
            <Stat value={d.exp > 15 ? '8,000+' : '5,000+'} label="Consultations" border />
          </View>
          <T size={13} color={colors.ink2} lh={19}>{d.about}</T>
        </View>

        <Section title="Book appointment">
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {(['clinic', 'video'] as const).map((m) => {
              const on = m === mode;
              return (
                <Pressable key={m} onPress={() => setMode(m)} accessibilityRole="radio" accessibilityState={{ checked: on }}
                  style={{ flex: 1, height: 60, borderRadius: radius.md, paddingHorizontal: 14, justifyContent: 'center', gap: 2, borderWidth: on ? 1.5 : 1, borderColor: on ? colors.teal : colors.lineStrong, backgroundColor: on ? colors.tealTint : colors.white }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {m === 'video' ? <Video size={16} color={on ? colors.tealDark : colors.ink} /> : <MapPin size={16} color={on ? colors.tealDark : colors.ink} />}
                    <T w="bold" size={14} color={on ? colors.tealDeep : colors.ink}>{m === 'video' ? 'Video consult' : 'Clinic visit'}</T>
                  </View>
                  <T w="semibold" size={12} color={colors.ink2}>{rupees(m === 'video' ? d.feeVideo : d.feeClinic)} fee</T>
                </Pressable>
              );
            })}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 14 }}>
            {days.map((dd, i) => {
              const on = i === day;
              const count = slotsFor(i).reduce((n, g) => n + g.slots.filter((s) => !s.taken).length, 0);
              return (
                <Pressable key={dd.key} onPress={() => setDay(i)} style={{ width: 124, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: on ? colors.teal : colors.white, borderWidth: on ? 0 : 1, borderColor: colors.lineStrong }}>
                  <T w="bold" size={13} color={on ? colors.white : colors.ink}>{dd.label}</T>
                  <T w="semibold" size={11} color={on ? '#D6F1EC' : colors.green}>{count} slots available</T>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={{ gap: 14, marginTop: 16 }}>
            {groups.map((g) => {
              const open = g.slots.filter((s) => !s.taken).length;
              return (
                <View key={g.name} style={{ gap: 10 }}>
                  <T w="bold" size={13} color={colors.ink2}>
                    {g.name} <T size={13} color={colors.muted}>{open} slots</T>
                  </T>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {g.slots.map((s) => {
                      const on = s.label === slot;
                      return (
                        <Pressable key={s.label} disabled={s.taken} onPress={() => setSlot(s.label)}
                          accessibilityState={{ disabled: s.taken, selected: on }}
                          style={{ width: '23.3%', height: 38, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: s.taken ? colors.surface2 : on ? colors.teal : colors.white, borderWidth: s.taken || on ? 0 : 1, borderColor: colors.tealLine }}>
                          <T w="semibold" size={12} color={s.taken ? colors.faint : on ? colors.white : colors.teal} style={s.taken ? { textDecorationLine: 'line-through' } : undefined}>{s.label}</T>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
            {free === 0 ? <T size={13} color={colors.muted}>No slots left on this day. Try another day.</T> : null}
          </View>
        </Section>

        <Section title="Who is this appointment for?">
          <PatientPicker value={patient} onChange={setPatient} />
        </Section>

        {mode === 'clinic' ? (
          <Section title="Clinic">
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <View style={{ width: 52, height: 52, borderRadius: 10, backgroundColor: colors.tealTint, alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={22} color={colors.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <T w="bold" size={14}>{d.clinic}</T>
                <T size={12} color={colors.muted}>{d.area}, Bengaluru · {d.distance}</T>
                <T size={12} color={colors.muted}>Mon–Sat · 9:00 AM – 7:00 PM</T>
              </View>
            </View>
          </Section>
        ) : null}
      </ScrollView>
      <BottomBar>
        <View style={{ flexShrink: 1 }}>
          <T size={12} color={colors.muted} numberOfLines={1}>{slot ? `${days[day].label}, ${slot}` : 'Select a time slot'}</T>
          <T w="extrabold" size={18}>{rupees(fee)}</T>
        </View>
        <Button title="Book appointment" disabled={!slot} onPress={book} style={{ flex: 1 }} />
      </BottomBar>
    </View>
  );
}

function Stat({ value, label, border }: { value: string; label: string; border?: boolean }) {
  return (
    <View style={{ flex: 1, paddingVertical: 10, alignItems: 'center', gap: 2, borderLeftWidth: border ? 1 : 0, borderLeftColor: colors.line }}>
      <T w="extrabold" size={15}>{value}</T>
      <T size={11} color={colors.muted}>{label}</T>
    </View>
  );
}

/* ---------------------------------------------------- Appointment detail */

export function AppointmentDetailScreen({ navigation, route }: any) {
  const { bookings, updateBooking, notify } = useStore();
  const b = bookings.find((x) => x.id === route.params.id);
  if (!b) return null;
  const d = doctors.find((x) => x.id === b.meta.doctorId)!;
  const video = b.meta.mode === 'video';
  const active = b.status === 'Confirmed';

  const cancel = () =>
    Alert.alert('Cancel appointment?', 'Your payment will be refunded to the original method in 5–7 days.', [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Cancel appointment',
        style: 'destructive',
        onPress: () => {
          updateBooking(b.id, { status: 'Cancelled' });
          notify({ title: 'Appointment cancelled', text: `${d.name} · ${b.when}`, service: 'doctor' });
        },
      },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Appointment" subtitle={b.id} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <Avatar source={d.photo} name={d.name} size={64} rounded="md" />
            <View style={{ flex: 1, gap: 2 }}>
              <T w="bold" size={17}>{d.name}</T>
              <T size={13} color={colors.ink2}>{d.role}</T>
              <View style={{ marginTop: 4 }}><StatusBadge status={b.status} /></View>
            </View>
          </View>
          <View style={{ marginTop: 14, padding: 12, borderRadius: radius.md, backgroundColor: colors.tealTint, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Calendar size={18} color={colors.tealDark} />
            <View style={{ flex: 1 }}>
              <T w="bold" size={14} color={colors.tealDeep}>{b.when}</T>
              <T size={12} color={colors.tealDark}>{video ? 'Video consultation in the app' : `${d.clinic}, ${d.area}`}</T>
            </View>
          </View>
          {active ? (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              {video ? (
                <Button title="Join video call" icon={<Video size={18} color={colors.white} />} style={{ flex: 1 }} onPress={() => navigation.navigate('VideoCall', { id: b.id })} />
              ) : (
                <Button title="Get directions" icon={<MapPin size={18} color={colors.white} />} style={{ flex: 1 }} onPress={() => Alert.alert('Directions', 'Opens Google Maps once the Maps key is configured.')} />
              )}
              <Button title="Call" variant="outline" onPress={() => navigation.navigate('Call', { name: d.name, role: d.role, photo: d.photo })} />
            </View>
          ) : null}
        </Section>
        <Section title="Details">
          <InfoRow label="Patient" value={b.meta.patient ?? 'Self'} />
          <InfoRow label="Consultation" value={video ? 'Video' : 'Clinic visit'} />
          <InfoRow label="Amount" value={b.meta.method === 'cash' ? `${rupees(b.amount)} at clinic` : `${rupees(b.amount)} paid`} />
          <InfoRow label="Booking ID" value={b.id} />
        </Section>
        <Section title="Before your visit">
          <T size={13} color={colors.ink2} lh={20}>
            • Keep previous prescriptions and reports handy.{'\n'}• {video ? 'Join from a quiet place with a stable internet connection.' : 'Reach 10 minutes early for registration.'}{'\n'}• You can upload reports from the Health tab.
          </T>
        </Section>
        {active ? (
          <Section>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Reschedule" variant="ghost" style={{ flex: 1 }} onPress={() => { updateBooking(b.id, { status: 'Cancelled' }); navigation.replace('DoctorProfile', { id: d.id, mode: b.meta.mode }); }} />
              <Button title="Cancel" variant="ghost" style={{ flex: 1 }} onPress={cancel} />
            </View>
          </Section>
        ) : null}
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------ Video call */

export function VideoCallScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { bookings, updateBooking } = useStore();
  const b = bookings.find((x) => x.id === route.params.id)!;
  const d = doctors.find((x) => x.id === b.meta.doctorId)!;
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [secs, setSecs] = useState(0);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const j = setTimeout(() => setJoined(true), 2500);
    return () => clearTimeout(j);
  }, []);
  useEffect(() => {
    if (!joined) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [joined]);

  const end = () => {
    if (joined) updateBooking(b.id, { status: 'Completed' });
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0E1426' }}>
      <StatusBar barStyle="light-content" />
      {d.photo ? <Image source={d.photo} style={{ position: 'absolute', width: '100%', height: '100%', opacity: joined ? 0.95 : 0.25 }} resizeMode="cover" blurRadius={joined ? 0 : 12} /> : null}
      <View style={{ position: 'absolute', top: insets.top + 12, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flex: 1, padding: 10, borderRadius: radius.md, backgroundColor: 'rgba(14,20,38,0.6)' }}>
          <T w="bold" size={15} color={colors.white}>{d.name}</T>
          <T size={12} color="#C9CCDA">{joined ? `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')} · End-to-end encrypted` : 'Waiting for the doctor to join…'}</T>
        </View>
      </View>
      <View style={{ position: 'absolute', right: 16, top: insets.top + 90, width: 104, height: 148, borderRadius: radius.md, backgroundColor: cam ? '#2B3557' : '#1A2036', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }}>
        {cam ? <T w="bold" size={13} color="#C9CCDA">You</T> : <VideoOff size={22} color="#C9CCDA" />}
      </View>
      <View style={{ position: 'absolute', bottom: insets.bottom + 28, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 18 }}>
        <RoundBtn label={mic ? 'Mute' : 'Unmute'} onPress={() => setMic((v) => !v)} light={!mic}>{mic ? <Mic size={22} color={colors.white} /> : <MicOff size={22} color={colors.ink} />}</RoundBtn>
        <RoundBtn label={cam ? 'Camera off' : 'Camera on'} onPress={() => setCam((v) => !v)} light={!cam}>{cam ? <Video size={22} color={colors.white} /> : <VideoOff size={22} color={colors.ink} />}</RoundBtn>
        <RoundBtn label="Flip camera" onPress={() => {}}><SwitchCamera size={22} color={colors.white} /></RoundBtn>
        <RoundBtn label="Chat" onPress={() => Alert.alert('Chat', 'In-call chat will connect with the video provider.')}><MessageSquare size={22} color={colors.white} /></RoundBtn>
        <Pressable onPress={end} accessibilityLabel="End call" style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
          <PhoneOff size={24} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

function RoundBtn({ children, label, onPress, light }: { children: React.ReactNode; label: string; onPress: () => void; light?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: light ? colors.white : 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
      {children}
    </Pressable>
  );
}

