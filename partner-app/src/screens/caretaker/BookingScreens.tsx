import React, { useEffect, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StatusBar, Switch, Vibration, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { CalendarDays, ChevronRight, Clock3, HeartPulse, Inbox, MapPin, Navigation, Phone, Star, Tags, UserRound } from 'lucide-react-native';
import { AppBar, Avatar, Badge, BottomBar, Button, CountdownRing, EmptyState, InfoRow, Segmented, T, colors, greeting, radius, rupees, service } from '../../ui';
import { formatDay, formatDayTime, formatTime, isoDate } from '../../ui/utils/format';
import { bookingGross, earningsSummary, useNow, usePartnerStore } from '../../store/PartnerStore';
import { Booking } from '../../store/types';
import { BookingStatusPill, ReasonSheet, TabHeader } from '../../components/partner';
import { REJECT_REASONS } from '../../data/seed';
import { mmss } from '../vendor/OrderScreens';

const lav = service.nursing;
export const PHOTO = require('../../assets/images/ct-sunita.jpg');
/** Travel can start this long before the booking. */
const TRAVEL_WINDOW = 3 * 3600000;

const timeRange = (b: Booking) => `${formatTime(b.startAt)} – ${formatTime(b.startAt + b.hours * 3600000)}`;

/* ------------------------------------------------------------- Booking card */

export function BookingCard({ b, now, onPress }: { b: Booking; now: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: b.status === 'requested' ? '#F4B9BC' : colors.line, padding: 14, opacity: pressed ? 0.85 : 1 })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w="extrabold" size={14} style={{ flex: 1 }} numberOfLines={1}>
          {b.serviceName} · {b.packageLabel}
        </T>
        <BookingStatusPill status={b.status} reason={b.declineReason} />
      </View>
      <T size={12.5} color={colors.muted} style={{ marginTop: 4 }}>
        {b.patientName}, {b.patientAge} · {b.area} · {b.distanceKm} km
      </T>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line, gap: 6 }}>
        <CalendarDays size={14} color={colors.ink2} />
        <T size={12.5} w="semibold" color={colors.ink2} style={{ flex: 1 }}>
          {formatDay(b.startAt, now)}, {timeRange(b)}
        </T>
        {b.status === 'requested' ? (
          <T w="bold" size={12.5} color={colors.redText}>
            Respond in {mmss(b.respondBy - now)}
          </T>
        ) : (
          <T w="extrabold" size={14}>
            {rupees(b.payout)}
          </T>
        )}
      </View>
    </Pressable>
  );
}

/* ---------------------------------------------------------------- Today tab */

export function CaretakerTodayScreen() {
  const nav = useNavigation<any>();
  const now = useNow();
  const { caretakerProfile: p, isAvailable, bookings, ledger, reviews, leaveDates, dispatch } = usePartnerStore();
  const week = earningsSummary(ledger.caretaker, now);
  const live = bookings.find((b) => b.status === 'in_progress' || b.status === 'on_the_way');
  const request = bookings.find((b) => b.status === 'requested');
  const upcoming = bookings.filter((b) => b.status === 'accepted').sort((a, b) => a.startAt - b.startAt);
  const next = upcoming[0];
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0;
  const onLeave = leaveDates.includes(isoDate(now));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TabHeader
        title={`${greeting(new Date(now))}, ${p.fullName.split(' ')[0]}`}
        subtitle={isAvailable ? 'Available for new requests' : 'Not taking new requests'}
        right={
          <Switch
            accessibilityLabel="Available for requests"
            value={isAvailable}
            onValueChange={(available) => dispatch({ type: 'SET_AVAILABLE', available, now: Date.now() })}
            trackColor={{ true: lav.fg, false: '#C9CECC' }}
            thumbColor={colors.white}
          />
        }
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}>
        {onLeave ? (
          <View style={{ backgroundColor: colors.amberSoft, borderRadius: radius.md, padding: 12 }}>
            <T size={13} w="semibold" color={colors.amberText}>
              You’ve marked today as leave. New requests are only for your open days.
            </T>
          </View>
        ) : null}

        {request ? (
          <Pressable onPress={() => nav.navigate('BookingDetail', { id: request.id })} style={{ backgroundColor: colors.redSoft, borderRadius: radius.md, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Inbox size={18} color={colors.redText} />
            <View style={{ flex: 1 }}>
              <T w="bold" size={13.5} color={colors.redText}>
                New request · {request.serviceName}
              </T>
              <T size={12} color={colors.redText}>
                {request.area} · respond in {mmss(request.respondBy - now)}
              </T>
            </View>
            <ChevronRight size={18} color={colors.redText} />
          </Pressable>
        ) : null}

        {live ? (
          <Pressable onPress={() => nav.navigate(live.status === 'in_progress' ? 'ActiveService' : 'BookingDetail', { id: live.id })} style={{ backgroundColor: lav.fg, borderRadius: radius.lg, padding: 16 }}>
            <T w="bold" size={12} color="#E4DEFF">
              {live.status === 'in_progress' ? 'SHIFT IN PROGRESS' : 'ON THE WAY'}
            </T>
            <T w="extrabold" size={18} color={colors.white} style={{ marginTop: 4 }}>
              {live.patientName} · {live.serviceName}
            </T>
            <T size={13} color="#E4DEFF" style={{ marginTop: 2 }}>
              {live.status === 'in_progress'
                ? `Started ${formatTime(live.startedAt ?? now)} · ${live.tasks.filter((t) => t.done).length}/${live.tasks.length} tasks done`
                : `${live.address}`}
            </T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}>
              <T w="bold" size={13.5} color={colors.white}>
                {live.status === 'in_progress' ? 'Open care checklist' : 'Check in at the address'}
              </T>
              <ChevronRight size={16} color={colors.white} />
            </View>
          </Pressable>
        ) : next ? (
          <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14 }}>
            <T w="bold" size={12} color={colors.muted}>
              NEXT BOOKING
            </T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 }}>
              <Avatar name={next.patientName} size={46} tint={{ bg: lav.bg, fg: lav.text }} />
              <View style={{ flex: 1 }}>
                <T w="extrabold" size={16}>
                  {next.patientName}, {next.patientAge}
                </T>
                <T size={12.5} color={colors.muted}>
                  {next.serviceName} · {next.packageLabel}
                </T>
              </View>
              <T w="extrabold" size={15}>
                {rupees(next.payout)}
              </T>
            </View>
            <View style={{ gap: 6, marginTop: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <Clock3 size={15} color={colors.ink2} />
                <T size={13} color={colors.ink2}>
                  {formatDay(next.startAt, now)}, {timeRange(next)}
                </T>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <MapPin size={15} color={colors.ink2} />
                <T size={13} color={colors.ink2} style={{ flex: 1 }} numberOfLines={1}>
                  {next.address} · {next.distanceKm} km
                </T>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Button title="Details" variant="ghost" size="md" onPress={() => nav.navigate('BookingDetail', { id: next.id })} style={{ flex: 1 }} />
              <Button
                title="Start travel"
                size="md"
                disabled={next.startAt - now > TRAVEL_WINDOW}
                onPress={() => {
                  dispatch({ type: 'START_TRAVEL', id: next.id });
                  nav.navigate('BookingDetail', { id: next.id });
                }}
                style={{ flex: 1.3 }}
              />
            </View>
            {next.startAt - now > TRAVEL_WINDOW ? (
              <T size={11.5} color={colors.muted} center style={{ marginTop: 8 }}>
                You can start travel 3 hours before the booking.
              </T>
            ) : null}
          </View>
        ) : (
          <EmptyState icon={<HeartPulse size={28} color={lav.fg} />} title="No bookings yet" text={isAvailable ? 'Requests that match your availability will appear here.' : 'Switch on availability to receive requests.'} />
        )}

        <View style={{ flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line }}>
          {[
            { label: 'This week', value: rupees(week.weekNet) },
            { label: 'Upcoming', value: String(upcoming.length) },
            { label: 'Rating', value: avg ? avg.toFixed(1) : '—' },
          ].map((s, i) => (
            <View key={s.label} style={{ flex: 1, padding: 12, borderLeftWidth: i ? 1 : 0, borderLeftColor: colors.line }}>
              <T size={11.5} color={colors.muted} w="semibold">
                {s.label}
              </T>
              <T w="extrabold" size={18} style={{ marginTop: 4 }}>
                {s.value}
              </T>
            </View>
          ))}
        </View>

        {upcoming.length > 1 ? (
          <View style={{ gap: 10 }}>
            <T w="bold" size={15} style={{ marginTop: 4 }}>
              Later
            </T>
            {upcoming.slice(1, 4).map((b) => (
              <BookingCard key={b.id} b={b} now={now} onPress={() => nav.navigate('BookingDetail', { id: b.id })} />
            ))}
          </View>
        ) : null}

        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14 }}>
          {[
            { label: 'Availability', sub: 'Weekly slots and leave days', Icon: CalendarDays, to: 'Availability' },
            { label: 'Services & rates', sub: 'What you offer and what you charge', Icon: Tags, to: 'ServicesRates' },
            { label: 'Ratings & reviews', sub: `${reviews.length} reviews from families`, Icon: Star, to: 'Ratings' },
          ].map((r, i) => (
            <Pressable key={r.to} onPress={() => nav.navigate(r.to)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: lav.bg, alignItems: 'center', justifyContent: 'center' }}>
                <r.Icon size={18} color={lav.fg} />
              </View>
              <View style={{ flex: 1 }}>
                <T w="semibold" size={14}>
                  {r.label}
                </T>
                <T size={12} color={colors.muted}>
                  {r.sub}
                </T>
              </View>
              <ChevronRight size={18} color={colors.faint} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------- Requests tab */

type ReqTab = 'new' | 'upcoming' | 'past';

export function CaretakerRequestsScreen() {
  const nav = useNavigation<any>();
  const now = useNow();
  const { bookings, isAvailable } = usePartnerStore();
  const [tab, setTab] = useState<ReqTab>('new');
  const lists: Record<ReqTab, Booking[]> = {
    new: bookings.filter((b) => b.status === 'requested'),
    upcoming: bookings.filter((b) => ['accepted', 'on_the_way', 'in_progress'].includes(b.status)).sort((a, b) => a.startAt - b.startAt),
    past: bookings.filter((b) => b.status === 'completed' || b.status === 'declined').sort((a, b) => (b.completedAt ?? b.requestedAt) - (a.completedAt ?? a.requestedAt)),
  };
  const list = lists[tab];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TabHeader title="Bookings" subtitle={`${lists.upcoming.length} upcoming`} />
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Segmented<ReqTab>
          value={tab}
          onChange={setTab}
          options={[
            { key: 'new', label: `Requests${lists.new.length ? ` · ${lists.new.length}` : ''}` },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' },
          ]}
        />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 8, gap: 10 }}>
        {list.length ? (
          list.map((b) => <BookingCard key={b.id} b={b} now={now} onPress={() => nav.navigate('BookingDetail', { id: b.id })} />)
        ) : (
          <EmptyState
            icon={<Inbox size={28} color={lav.fg} />}
            title={tab === 'new' ? 'No new requests' : tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            text={tab === 'new' ? (isAvailable ? 'Requests for your open slots arrive here with an alert.' : 'You’re unavailable. Switch on availability from Today.') : 'Accepted bookings show here.'}
          />
        )}
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------ Request alert */

export function RequestAlertScreen() {
  useKeepAwake();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const now = useNow(500);
  const { bookings, settings, dispatch } = usePartnerStore();
  const b = bookings.find((x) => x.id === route.params?.id);
  const live = b?.status === 'requested';

  useEffect(() => {
    if (!live || !settings.alertVibration) return;
    Vibration.vibrate([0, 500, 300, 500, 1500], true);
    return () => Vibration.cancel();
  }, [live, settings.alertVibration]);

  if (!b || !live) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <T w="extrabold" size={20} color={colors.white} center>
          This request is no longer available
        </T>
        <Button title="Back" onPress={() => nav.goBack()} style={{ marginTop: 20, alignSelf: 'stretch' }} />
      </View>
    );
  }

  const total = Math.round((b.respondBy - b.requestedAt) / 1000);
  return (
    <View style={{ flex: 1, backgroundColor: colors.navy, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}>
      <StatusBar barStyle="light-content" />
      <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
        <Badge label="NEW BOOKING REQUEST" bg="#2C2559" fg="#C9BEFF" />
        <T w="extrabold" size={28} color={colors.white} style={{ marginTop: 12 }}>
          {rupees(b.payout)}
        </T>
        <T size={13} color={colors.navyMuted} style={{ marginTop: 4 }}>
          {b.serviceName} · {b.packageLabel}
        </T>
        <View style={{ marginTop: 20 }}>
          <CountdownRing seconds={Math.max(0, Math.ceil((b.respondBy - now) / 1000))} maxSeconds={total} size={116} />
        </View>
      </View>
      <View style={{ margin: 20, backgroundColor: colors.navyCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.navyLine, padding: 16, gap: 10 }}>
        {[
          { Icon: UserRound, text: `${b.patientName}, ${b.patientAge} · ${b.patientGender}` },
          { Icon: CalendarDays, text: `${formatDay(b.startAt, now)}, ${timeRange(b)}` },
          { Icon: MapPin, text: `${b.area} · ${b.distanceKm} km from you` },
          { Icon: HeartPulse, text: b.condition },
        ].map(({ Icon, text }) => (
          <View key={text} style={{ flexDirection: 'row', gap: 10 }}>
            <Icon size={16} color={colors.navyMuted} />
            <T size={13.5} color={colors.navyText} style={{ flex: 1 }} lh={19}>
              {text}
            </T>
          </View>
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        <Button
          title="View request"
          onPress={() => {
            dispatch({ type: 'MARK_SEEN', id: b.id });
            nav.replace('BookingDetail', { id: b.id });
          }}
        />
        <Button
          title="Later"
          variant="ghost"
          onPress={() => {
            dispatch({ type: 'MARK_SEEN', id: b.id });
            nav.goBack();
          }}
          style={{ backgroundColor: 'transparent', borderColor: colors.navyLine }}
        />
      </View>
    </View>
  );
}

/* ----------------------------------------------------------- Booking detail */

export function BookingDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const now = useNow();
  const { bookings, dispatch } = usePartnerStore();
  const b = bookings.find((x) => x.id === route.params?.id);
  const [declining, setDeclining] = useState(false);
  if (!b) return null;

  const accepted = !['requested', 'declined'].includes(b.status);
  const gross = bookingGross(b.payout);
  const directions = () => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${b.address}, Bengaluru`)}`);
  const card = { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14 } as const;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title={b.code} subtitle={`${b.serviceName} · ${b.packageLabel}`} right={<View style={{ paddingRight: 12 }}><BookingStatusPill status={b.status} reason={b.declineReason} /></View>} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}>
        {b.status === 'requested' ? (
          <View style={{ backgroundColor: colors.redSoft, borderRadius: radius.md, padding: 12 }}>
            <T w="bold" size={13} color={colors.redText}>
              Respond within {mmss(b.respondBy - now)}. After that the family is matched with another caretaker.
            </T>
          </View>
        ) : null}
        {b.status === 'declined' ? (
          <View style={{ backgroundColor: colors.surface2, borderRadius: radius.md, padding: 12 }}>
            <T w="bold" size={13} color={colors.ink2}>
              {b.declineReason === 'Request expired' ? 'Expired: not answered in time' : `Declined: ${b.declineReason}`}
            </T>
          </View>
        ) : null}

        <View style={card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar name={b.patientName} size={46} tint={{ bg: lav.bg, fg: lav.text }} />
            <View style={{ flex: 1 }}>
              <T w="extrabold" size={16}>
                {b.patientName}
              </T>
              <T size={12.5} color={colors.muted}>
                {b.patientAge} years · {b.patientGender}
              </T>
            </View>
          </View>
          <T size={13.5} color={colors.ink} lh={20} style={{ marginTop: 12 }}>
            {b.condition}
          </T>
        </View>

        <View style={card}>
          <InfoRow label="When" value={`${formatDay(b.startAt, now)}, ${formatTime(b.startAt)}`} />
          <InfoRow label="Duration" value={b.hours >= 12 ? `${b.hours} hours` : 'About 1 hour'} />
          <InfoRow label="Service" value={`${b.serviceName} · ${b.packageLabel}`} />
          <InfoRow label="You earn" value={rupees(b.payout)} bold />
        </View>

        <View style={card}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <MapPin size={18} color={colors.ink2} />
            <View style={{ flex: 1 }}>
              <T w="semibold" size={14} lh={20}>
                {accepted ? b.address : `${b.area} · exact address after you accept`}
              </T>
              <T size={12} color={colors.muted}>
                {b.distanceKm} km from you
              </T>
            </View>
            {accepted && b.status !== 'completed' ? (
              <Pressable accessibilityLabel="Directions" onPress={directions} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.tealTint, alignItems: 'center', justifyContent: 'center' }}>
                <Navigation size={18} color={colors.teal} />
              </Pressable>
            ) : null}
          </View>
          {accepted ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line }}>
              <UserRound size={18} color={colors.ink2} />
              <View style={{ flex: 1 }}>
                <T w="semibold" size={14}>
                  {b.familyName}
                </T>
                <T size={12} color={colors.muted}>
                  {b.familyRelation} · family contact
                </T>
              </View>
              {b.status !== 'completed' ? (
                <Pressable accessibilityLabel="Call family" onPress={() => nav.navigate('MaskedCall', { name: b.familyName, label: `${b.familyRelation} of ${b.patientName}` })} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.tealTint, alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={18} color={colors.teal} />
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>

        <View style={card}>
          <T w="bold" size={14} style={{ marginBottom: 8 }}>
            Care notes from the family
          </T>
          {b.careNotes.map((n) => (
            <View key={n} style={{ flexDirection: 'row', gap: 8, paddingVertical: 3 }}>
              <T size={13} color={lav.fg}>•</T>
              <T size={13} color={colors.ink2} style={{ flex: 1 }} lh={19}>
                {n}
              </T>
            </View>
          ))}
        </View>

        {b.status === 'completed' ? (
          <View style={card}>
            <T w="bold" size={14} style={{ marginBottom: 4 }}>
              Summary
            </T>
            <InfoRow label="Checked in" value={b.startedAt ? formatDayTime(b.startedAt, now) : '—'} />
            <InfoRow label="Completed" value={b.completedAt ? formatDayTime(b.completedAt, now) : '—'} />
            <InfoRow label="Care tasks" value={`${b.tasks.filter((t) => t.done).length} of ${b.tasks.length} done`} />
            <InfoRow label="Family paid" value={rupees(gross)} />
            <InfoRow label="Lifeline fee" value={`− ${rupees(gross - b.payout)}`} />
            <InfoRow label="You earned" value={rupees(b.payout)} bold />
            {b.notes ? (
              <T size={13} color={colors.ink2} lh={19} style={{ marginTop: 8 }}>
                “{b.notes}”
              </T>
            ) : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
              {b.rating ? (
                Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} color="#E8A317" fill={i < b.rating! ? '#E8A317' : 'transparent'} />)
              ) : (
                <T size={12.5} color={colors.muted}>
                  Waiting for the family’s rating
                </T>
              )}
            </View>
          </View>
        ) : null}
      </ScrollView>

      {b.status === 'requested' ? (
        <BottomBar>
          <Button title="Decline" variant="ghost" onPress={() => setDeclining(true)} style={{ flex: 1 }} />
          <Button title="Accept booking" onPress={() => dispatch({ type: 'ACCEPT_BOOKING', id: b.id })} style={{ flex: 2 }} />
        </BottomBar>
      ) : null}
      {b.status === 'accepted' ? (
        <BottomBar>
          {b.startAt - now > TRAVEL_WINDOW ? (
            <T size={13} color={colors.ink2} style={{ flex: 1 }} lh={18}>
              Starts {formatDayTime(b.startAt, now)}. You can start travel 3 hours before.
            </T>
          ) : (
            <Button title="Start travel" icon={<Navigation size={18} color={colors.white} />} onPress={() => dispatch({ type: 'START_TRAVEL', id: b.id })} style={{ flex: 1 }} />
          )}
        </BottomBar>
      ) : null}
      {b.status === 'on_the_way' ? (
        <BottomBar>
          <Button title="Directions" variant="ghost" onPress={directions} style={{ flex: 1 }} />
          <Button title="I’ve arrived" onPress={() => nav.navigate('CheckIn', { id: b.id })} style={{ flex: 1.5 }} />
        </BottomBar>
      ) : null}
      {b.status === 'in_progress' ? (
        <BottomBar>
          <Button title="Open care checklist" onPress={() => nav.navigate('ActiveService', { id: b.id })} style={{ flex: 1 }} />
        </BottomBar>
      ) : null}

      <ReasonSheet
        visible={declining}
        onClose={() => setDeclining(false)}
        title="Why are you declining?"
        reasons={REJECT_REASONS.caretaker}
        confirmLabel="Decline request"
        onConfirm={(reason) => {
          dispatch({ type: 'DECLINE_BOOKING', id: b.id, reason });
          setDeclining(false);
        }}
      />
    </View>
  );
}

export function ProfilePhoto({ size = 64 }: { size?: number }) {
  return <Image source={PHOTO} style={{ width: size, height: size, borderRadius: size / 2 }} />;
}
