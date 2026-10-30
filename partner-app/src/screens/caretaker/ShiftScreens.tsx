import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import Svg, { Circle } from 'react-native-svg';
import { CheckCircle2, LocateFixed, Minus, Phone, Plus, Star } from 'lucide-react-native';
import { AppBar, BottomBar, Button, CheckBox, DesignedMap, T, Toggle, colors, radius, rupees, service } from '../../ui';
import { formatDate, formatElapsed, formatTime, isoDate, startOfDay, weekdayShort } from '../../ui/utils/format';
import { dayKeyOf, nextOpenSlot, useNow, usePartnerStore } from '../../store/PartnerStore';
import { DayKey } from '../../store/types';
import { OtpBoxes, Sheet } from '../../components/partner';
import { SLOTS } from '../../data/seed';
import { formatDayTime } from '../../ui/utils/format';

const lav = service.nursing;
const GEOFENCE_M = 200;

/* ----------------------------------------------------------------- Check-in */

export function CheckInScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { bookings, dispatch } = usePartnerStore();
  const b = bookings.find((x) => x.id === route.params?.id);
  const [distance, setDistance] = useState<number | null>(null);

  // Location check is simulated in this build; the backend geofence verifies it later.
  useEffect(() => {
    const t = setTimeout(() => setDistance(30 + Math.round(Math.random() * 40)), 1800);
    return () => clearTimeout(t);
  }, []);
  if (!b) return null;
  const inside = distance != null && distance <= GEOFENCE_M;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Check in" subtitle={b.patientName} />
      <View style={{ height: 300, overflow: 'hidden' }}>
        <DesignedMap showRoute={false} height={300} />
      </View>
      <View style={{ padding: 20, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: inside ? colors.greenSoft : colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
            {distance == null ? <ActivityIndicator color={colors.teal} /> : inside ? <CheckCircle2 size={22} color={colors.green} /> : <LocateFixed size={22} color={colors.muted} />}
          </View>
          <View style={{ flex: 1 }}>
            <T w="bold" size={16}>
              {distance == null ? 'Checking your location…' : inside ? 'You’re at the address' : 'You seem far from the address'}
            </T>
            <T size={12.5} color={colors.muted}>
              {distance == null ? 'Keep location on' : `${distance} m from ${b.address.split(',')[0]}`}
            </T>
          </View>
        </View>
        <T size={12.5} color={colors.muted} lh={18}>
          Checking in starts your shift timer and lets the family know you’ve arrived. You must be within {GEOFENCE_M} m of the address.
        </T>
      </View>
      <View style={{ flex: 1 }} />
      <BottomBar>
        <Button
          title="Check in & start"
          disabled={!inside}
          onPress={() => {
            dispatch({ type: 'CHECK_IN', id: b.id, distanceM: distance ?? 0, now: Date.now() });
            nav.replace('ActiveService', { id: b.id });
          }}
          style={{ flex: 1 }}
        />
      </BottomBar>
    </View>
  );
}

/* ----------------------------------------------------------- Active service */

function KeepAwake() {
  useKeepAwake();
  return null;
}

function ShiftRing({ progress, label, sub }: { progress: number; label: string; sub: string }) {
  const size = 150;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={lav.bg} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={lav.fg}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - Math.min(1, progress))}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <T w="extrabold" size={24}>
          {label}
        </T>
        <T size={11.5} color={colors.muted}>
          {sub}
        </T>
      </View>
    </View>
  );
}

export function ActiveServiceScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const now = useNow();
  const { bookings, settings, dispatch } = usePartnerStore();
  const b = bookings.find((x) => x.id === route.params?.id);
  const [notes, setNotes] = useState(b?.notes ?? '');
  if (!b) return null;
  if (b.status === 'completed') {
    return <CompletedView id={b.id} />;
  }

  const elapsed = now - (b.startedAt ?? now);
  const planned = b.hours * 3600000;
  const done = b.tasks.filter((t) => t.done).length;

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.bg }}>
      {settings.keepAwake ? <KeepAwake /> : null}
      <AppBar
        title={b.patientName}
        subtitle={`${b.serviceName} · started ${formatTime(b.startedAt ?? now)}`}
        right={
          <Pressable accessibilityLabel="Call family" onPress={() => nav.navigate('MaskedCall', { name: b.familyName, label: `${b.familyRelation} of ${b.patientName}` })} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Phone size={20} color={colors.teal} />
          </Pressable>
        }
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <ShiftRing progress={elapsed / planned} label={formatElapsed(elapsed)} sub={`of ${b.hours >= 12 ? `${b.hours}h shift` : '1h visit'}`} />
          <View style={{ flex: 1, gap: 8 }}>
            <View>
              <T size={11.5} color={colors.muted} w="semibold">Ends around</T>
              <T w="bold" size={15}>{formatTime((b.startedAt ?? now) + planned)}</T>
            </View>
            <View>
              <T size={11.5} color={colors.muted} w="semibold">Care tasks</T>
              <T w="bold" size={15}>{done} of {b.tasks.length} done</T>
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line }}>
          <T w="bold" size={14} style={{ padding: 14, paddingBottom: 4 }}>
            Care checklist
          </T>
          {b.tasks.map((t, i) => (
            <Pressable
              key={t.id}
              onPress={() => dispatch({ type: 'TOGGLE_TASK', id: b.id, taskId: t.id, now: Date.now() })}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line, opacity: pressed ? 0.7 : 1 })}>
              <CheckBox on={t.done} />
              <View style={{ flex: 1 }}>
                <T w="semibold" size={14} color={t.done ? colors.muted : colors.ink} style={t.done ? { textDecorationLine: 'line-through' } : undefined}>
                  {t.label}
                </T>
                <T size={11.5} color={colors.muted}>
                  {t.done && t.doneAt ? `Done at ${formatTime(t.doneAt)}` : t.time || 'Any time'}
                </T>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14 }}>
          <T w="bold" size={14}>
            Notes for the family
          </T>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            onBlur={() => dispatch({ type: 'SET_NOTES', id: b.id, notes })}
            placeholder="Vitals, meals, mood, anything they should know"
            placeholderTextColor={colors.faint}
            multiline
            style={{ minHeight: 84, marginTop: 8, textAlignVertical: 'top', fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: colors.ink, padding: 0 }}
          />
        </View>
      </ScrollView>
      <BottomBar>
        <Button
          title="End service"
          onPress={() => {
            dispatch({ type: 'SET_NOTES', id: b.id, notes });
            nav.navigate('CompleteService', { id: b.id });
          }}
          style={{ flex: 1 }}
        />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

/* --------------------------------------------------------- Complete service */

export function CompleteServiceScreen() {
  const route = useRoute<any>();
  const now = useNow();
  const { bookings, dispatch } = usePartnerStore();
  const b = bookings.find((x) => x.id === route.params?.id);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  if (!b) return null;
  if (b.status === 'completed') return <CompletedView id={b.id} />;

  const done = b.tasks.filter((t) => t.done).length;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Complete service" subtitle={b.code} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 6 }}>
          <T w="bold" size={14}>
            Care summary
          </T>
          <T size={13} color={colors.ink2}>
            {b.patientName} · {formatElapsed(now - (b.startedAt ?? now))} · {done} of {b.tasks.length} tasks done
          </T>
          {done < b.tasks.length ? (
            <T size={12.5} color={colors.amberText}>
              {b.tasks.length - done} tasks not ticked. Add a note if they were skipped.
            </T>
          ) : null}
          <T size={13} color={b.notes ? colors.ink : colors.faint} lh={19} style={{ marginTop: 4 }}>
            {b.notes || 'No notes added'}
          </T>
        </View>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 18, gap: 16 }}>
          <View>
            <T w="bold" size={16} center>
              Completion code from the family
            </T>
            <T size={13} color={colors.muted} center lh={19} style={{ marginTop: 4 }}>
              {b.familyName} received a 4-digit code by SMS. Enter it to close the booking.
            </T>
          </View>
          <OtpBoxes
            value={code}
            error={error}
            onChange={(v) => {
              setCode(v);
              setError(false);
              if (v.length === 4) {
                if (v === b.completionOtp) dispatch({ type: 'COMPLETE_BOOKING', id: b.id, now: Date.now() });
                else setError(true);
              }
            }}
          />
          {error ? (
            <T size={12.5} color={colors.redText} center>
              That code doesn’t match. Ask the family to check their SMS.
            </T>
          ) : null}
          <T size={12} color={colors.faint} center>
            Demo completion code: {b.completionOtp}
          </T>
        </View>
      </ScrollView>
    </View>
  );
}

function CompletedView({ id }: { id: string }) {
  const nav = useNavigation<any>();
  const { bookings } = usePartnerStore();
  const b = bookings.find((x) => x.id === id)!;
  return (
    <View style={{ flex: 1, backgroundColor: colors.white, padding: 24, justifyContent: 'center' }}>
      <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
        <CheckCircle2 size={40} color={colors.green} />
      </View>
      <T w="extrabold" size={22} center style={{ marginTop: 18 }}>
        Service completed
      </T>
      <T size={14} color={colors.muted} center lh={21} style={{ marginTop: 8 }}>
        {rupees(b.payout)} has been added to your earnings. {b.familyName} will be asked to rate the care.
      </T>
      <Button title="Back to today" onPress={() => nav.navigate('CaretakerTabs', { screen: 'CaretakerToday' })} style={{ marginTop: 28 }} />
    </View>
  );
}

/* ------------------------------------------------------------- Availability */

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

export function AvailabilityScreen() {
  const now = useNow(60000);
  const { schedule, leaveDates, dispatch } = usePartnerStore();
  const next = nextOpenSlot({ schedule, leaveDates }, now);
  const days = Array.from({ length: 14 }, (_, i) => startOfDay(now) + i * 86400000);
  const hoursPerWeek = DAYS.reduce((s, d) => s + schedule[d.key].reduce((h, k) => h + (k === 'night' ? 12 : 6), 0), 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Availability" subtitle={`${hoursPerWeek} hours a week`} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 28 }}>
        <View style={{ backgroundColor: lav.bg, borderRadius: radius.md, padding: 12 }}>
          <T size={13} color={lav.text} w="semibold" lh={19}>
            {next ? `You’ll get requests for open slots. The next one you can be booked for: ${formatDayTime(next, now)}.` : 'No open slots in the next 7 days, so you won’t get requests.'}
          </T>
        </View>

        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 12 }}>
          <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
            <View style={{ width: 48 }} />
            {SLOTS.map((s) => (
              <View key={s.key} style={{ flex: 1, alignItems: 'center' }}>
                <T w="bold" size={12.5}>{s.label}</T>
                <T size={10.5} color={colors.muted}>{s.hours}</T>
              </View>
            ))}
          </View>
          {DAYS.map((d) => (
            <View key={d.key} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
              <T w={dayKeyOf(now) === d.key ? 'extrabold' : 'semibold'} size={13} color={dayKeyOf(now) === d.key ? lav.fg : colors.ink} style={{ width: 48 }}>
                {d.label}
              </T>
              {SLOTS.map((s) => {
                const on = schedule[d.key].includes(s.key);
                return (
                  <Pressable
                    key={s.key}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={`${d.label} ${s.label}`}
                    onPress={() => dispatch({ type: 'TOGGLE_SLOT', day: d.key, slot: s.key })}
                    style={{ flex: 1, height: 40, marginHorizontal: 3, borderRadius: 8, backgroundColor: on ? lav.fg : colors.surface2, borderWidth: on ? 0 : 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
                    <T w="bold" size={11.5} color={on ? colors.white : colors.faint}>
                      {on ? 'Open' : 'Off'}
                    </T>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <View>
          <T w="bold" size={15}>Leave days</T>
          <T size={12.5} color={colors.muted} style={{ marginTop: 2, marginBottom: 10 }}>
            Tap a date to take it off. You won’t get requests for those days.
          </T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {days.map((d) => {
              const iso = isoDate(d);
              const leave = leaveDates.includes(iso);
              const open = schedule[dayKeyOf(d)].length > 0;
              return (
                <Pressable
                  key={iso}
                  onPress={() => dispatch({ type: 'TOGGLE_LEAVE', date: iso })}
                  style={{ width: '13%', minWidth: 42, paddingVertical: 8, borderRadius: 10, alignItems: 'center', backgroundColor: leave ? colors.redSoft : colors.white, borderWidth: 1, borderColor: leave ? '#F4B9BC' : colors.line }}>
                  <T size={10.5} color={leave ? colors.redText : colors.muted} w="semibold">{weekdayShort(d)}</T>
                  <T w="extrabold" size={15} color={leave ? colors.redText : open ? colors.ink : colors.faint}>{new Date(d).getDate()}</T>
                </Pressable>
              );
            })}
          </View>
          {leaveDates.length ? (
            <T size={12.5} color={colors.ink2} style={{ marginTop: 10 }}>
              On leave: {leaveDates.map((d) => formatDate(new Date(`${d}T00:00:00`).getTime()).replace(/ \d{4}$/, '')).join(', ')}
            </T>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

/* --------------------------------------------------------- Services & rates */

export function ServicesRatesScreen() {
  const { services, dispatch } = usePartnerStore();
  const [editing, setEditing] = useState<{ id: string; rate: number } | null>(null);
  const svc = editing ? services.find((s) => s.id === editing.id) : undefined;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Services & rates" subtitle={`${services.filter((s) => s.enabled).length} services offered`} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <T size={12.5} color={colors.muted} lh={18}>
          Rates are what you take home. Lifeline adds its fee on top of this when showing the price to families.
        </T>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line }}>
          {services.map((s, i) => (
            <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line }}>
              <View style={{ flex: 1, opacity: s.enabled ? 1 : 0.55 }}>
                <T w="bold" size={14}>{s.name}</T>
                <Pressable disabled={!s.enabled} onPress={() => setEditing({ id: s.id, rate: s.rate })} style={{ flexDirection: 'row', gap: 6, marginTop: 3 }}>
                  <T size={13} w="semibold" color={colors.ink2}>{rupees(s.rate)} {s.unit}</T>
                  {s.enabled ? <T size={13} w="bold" color={colors.teal}>Edit</T> : null}
                </Pressable>
              </View>
              <Toggle label={s.name} value={s.enabled} onChange={(v) => dispatch({ type: 'UPDATE_SERVICE', id: s.id, enabled: v })} />
            </View>
          ))}
        </View>
      </ScrollView>
      <Sheet visible={!!editing} onClose={() => setEditing(null)} title={svc ? `${svc.name} rate` : ''}>
        {editing && svc ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, paddingVertical: 12 }}>
              <Pressable accessibilityLabel="Lower" onPress={() => setEditing({ ...editing, rate: Math.max(100, editing.rate - 25) })} style={stepBtn}>
                <Minus size={20} color={colors.ink} />
              </Pressable>
              <View style={{ alignItems: 'center', minWidth: 120 }}>
                <T w="extrabold" size={30}>{rupees(editing.rate)}</T>
                <T size={12} color={colors.muted}>{svc.unit}</T>
              </View>
              <Pressable accessibilityLabel="Raise" onPress={() => setEditing({ ...editing, rate: editing.rate + 25 })} style={stepBtn}>
                <Plus size={20} color={colors.ink} />
              </Pressable>
            </View>
            <T size={12} color={colors.muted} center>
              Families in your area usually pay {rupees(Math.round(svc.rate * 1.1))}–{rupees(Math.round(svc.rate * 1.35))}.
            </T>
            <Button
              title="Save rate"
              onPress={() => {
                dispatch({ type: 'UPDATE_SERVICE', id: editing.id, rate: editing.rate });
                setEditing(null);
              }}
              style={{ marginTop: 16 }}
            />
          </>
        ) : null}
      </Sheet>
    </View>
  );
}

const stepBtn = { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' } as const;

/* ---------------------------------------------------------- Ratings & reviews */

export function RatingsScreen() {
  const now = useNow(60000);
  const { reviews } = usePartnerStore();
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0;
  const counts = [5, 4, 3, 2, 1].map((n) => reviews.filter((r) => r.stars === n).length);
  const ago = (at: number) => {
    const d = Math.floor((startOfDay(now) - startOfDay(at)) / 86400000);
    return d <= 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago`;
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Ratings & reviews" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 16, flexDirection: 'row', gap: 20, alignItems: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <T w="extrabold" size={36}>{avg.toFixed(1)}</T>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              {Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} color="#E8A317" fill={i < Math.round(avg) ? '#E8A317' : 'transparent'} />)}
            </View>
            <T size={11.5} color={colors.muted} style={{ marginTop: 4 }}>{reviews.length} reviews</T>
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            {counts.map((c, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <T size={11.5} color={colors.muted} style={{ width: 10 }}>{5 - i}</T>
                <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.surface2, overflow: 'hidden' }}>
                  <View style={{ width: `${reviews.length ? (c / reviews.length) * 100 : 0}%`, height: 6, backgroundColor: '#E8A317' }} />
                </View>
                <T size={11.5} color={colors.muted} style={{ width: 16, textAlign: 'right' }}>{c}</T>
              </View>
            ))}
          </View>
        </View>
        {reviews.map((r) => (
          <View key={r.id} style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <T w="bold" size={14} style={{ flex: 1 }}>{r.name}</T>
              <View style={{ flexDirection: 'row', gap: 1 }}>
                {Array.from({ length: 5 }, (_, i) => <Star key={i} size={12} color="#E8A317" fill={i < r.stars ? '#E8A317' : 'transparent'} />)}
              </View>
            </View>
            <T size={11.5} color={colors.muted} style={{ marginTop: 2 }}>{r.service} · {ago(r.at)}</T>
            <T size={13.5} color={colors.ink2} lh={20} style={{ marginTop: 8 }}>{r.text}</T>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
