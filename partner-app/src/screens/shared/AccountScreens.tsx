import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  BellRing,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  HelpCircle,
  History,
  Landmark,
  LogOut,
  Mail,
  MessageCircle,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings as SettingsIcon,
  ShieldCheck,
  Star,
  Store,
  Tags,
  UserRound,
  Volume2,
} from 'lucide-react-native';
import { AppBar, Avatar, Badge, BarChart, Button, Chip, EmptyState, Field, ListRow, T, Toggle, colors, radius, rupees, timeAgo } from '../../ui';
import { formatDayTime } from '../../ui/utils/format';
import { earningsSummary, useNow, usePartnerStore } from '../../store/PartnerStore';
import { LedgerEntry } from '../../store/types';
import { TabHeader, roleTint } from '../../components/partner';
import { COMMISSION } from '../../data/seed';
import { ProfilePhoto } from '../caretaker/BookingScreens';

const card = { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line } as const;

/* ---------------------------------------------------------------- Earnings */

function LedgerRow({ e, last, now }: { e: LedgerEntry; last?: boolean; now: number }) {
  const payout = e.kind === 'payout';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.line }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: payout ? colors.skySoft : e.kind === 'incentive' ? colors.amberSoft : colors.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
        {payout ? <Landmark size={17} color={colors.sky} /> : e.kind === 'incentive' ? <Star size={17} color={colors.amber} /> : <FileText size={17} color={colors.green} />}
      </View>
      <View style={{ flex: 1 }}>
        <T w="semibold" size={13.5} numberOfLines={1}>
          {e.title}
        </T>
        <T size={11.5} color={colors.muted}>
          {e.ref} · {formatDayTime(e.at, now)}
        </T>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <T w="bold" size={14} color={payout ? colors.ink : colors.greenText}>
          {payout ? rupees(e.net) : `+ ${rupees(e.net)}`}
        </T>
        {e.commission ? (
          <T size={11} color={colors.muted}>
            fee {rupees(e.commission)}
          </T>
        ) : null}
      </View>
    </View>
  );
}

export function EarningsScreen() {
  const nav = useNavigation<any>();
  const now = useNow(30000);
  const { session, ledger, vendorProfile, caretakerProfile, dispatch } = usePartnerStore();
  const role = session.role ?? 'vendor';
  const list = ledger[role];
  const s = earningsSummary(list, now);
  const bank = role === 'vendor' ? vendorProfile.bank : caretakerProfile.bank;
  const tint = roleTint(role);
  const recent = [...list].sort((a, b) => b.at - a.at).slice(0, 6);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TabHeader title="Earnings" subtitle={`Settled every Monday to ${bank.bank} ••${bank.last4}`} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}>
        <View style={[card, { padding: 16 }]}>
          <T size={12} color={colors.muted} w="semibold">
            Last 7 days, after Lifeline fee
          </T>
          <T w="extrabold" size={28} style={{ marginTop: 2 }}>
            {rupees(s.weekNet)}
          </T>
          <BarChart data={s.days} height={150} />
        </View>

        <View style={[card, { flexDirection: 'row' }]}>
          {[
            { label: 'Today', value: rupees(s.todayNet), sub: `${s.todayJobs} ${role === 'vendor' ? 'orders' : 'bookings'}` },
            { label: role === 'vendor' ? 'Week sales' : 'Families paid', value: rupees(s.weekGross), sub: 'last 7 days' },
            { label: `Fee (${COMMISSION[role] * 100}%)`, value: rupees(s.weekCommission), sub: 'last 7 days' },
          ].map((x, i) => (
            <View key={x.label} style={{ flex: 1, padding: 12, borderLeftWidth: i ? 1 : 0, borderLeftColor: colors.line }}>
              <T size={11.5} color={colors.muted} w="semibold">
                {x.label}
              </T>
              <T w="extrabold" size={16} style={{ marginTop: 4 }}>
                {x.value}
              </T>
              <T size={11} color={colors.faint}>
                {x.sub}
              </T>
            </View>
          ))}
        </View>

        <View style={[card, { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
          <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: tint.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Landmark size={19} color={tint.fg} />
          </View>
          <View style={{ flex: 1 }}>
            <T size={12} color={colors.muted} w="semibold">
              Balance to be settled
            </T>
            <T w="extrabold" size={18}>
              {rupees(Math.max(0, s.balance))}
            </T>
          </View>
          <Button
            title="Withdraw"
            size="sm"
            disabled={s.balance <= 0}
            onPress={() =>
              Alert.alert('Withdraw now?', `${rupees(s.balance)} will be sent to ${bank.bank} ••${bank.last4}. Early withdrawals are free twice a month.`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Withdraw', onPress: () => dispatch({ type: 'REQUEST_PAYOUT', now: Date.now() }) },
              ])
            }
          />
        </View>

        <View style={[card, { paddingHorizontal: 14, paddingTop: 12 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <T w="bold" size={15}>
              Transactions
            </T>
            <T w="bold" size={13} color={colors.teal} onPress={() => nav.navigate('Transactions')}>
              See all
            </T>
          </View>
          {recent.map((e, i) => (
            <LedgerRow key={e.id} e={e} now={now} last={i === recent.length - 1} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export function TransactionsScreen() {
  const now = useNow(30000);
  const { session, ledger } = usePartnerStore();
  const [filter, setFilter] = useState<'all' | 'credits' | 'payouts'>('all');
  const list = [...ledger[session.role ?? 'vendor']]
    .filter((e) => (filter === 'all' ? true : filter === 'payouts' ? e.kind === 'payout' : e.kind !== 'payout'))
    .sort((a, b) => b.at - a.at);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Transactions" />
      <View style={{ flexDirection: 'row', gap: 8, padding: 16, paddingBottom: 4 }}>
        <Chip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
        <Chip label="Earnings" active={filter === 'credits'} onPress={() => setFilter('credits')} />
        <Chip label="Payouts" active={filter === 'payouts'} onPress={() => setFilter('payouts')} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[card, { paddingHorizontal: 14 }]}>
          {list.map((e, i) => (
            <LedgerRow key={e.id} e={e} now={now} last={i === list.length - 1} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ----------------------------------------------------------- Notifications */

export function NotificationsScreen() {
  const nav = useNavigation<any>();
  const { notifications, session, dispatch } = usePartnerStore();
  const list = notifications.filter((n) => n.role === 'all' || n.role === session.role);

  // Opening the list marks everything read, after this render has shown which items were new.
  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'READ_NOTIFICATIONS' }), 1500);
    return () => clearTimeout(t);
  }, [dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Notifications" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {list.length ? (
          <View style={[card, { paddingHorizontal: 14 }]}>
            {list.map((n, i) => (
              <View key={n.id} style={{ flexDirection: 'row', gap: 12, paddingVertical: 13, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, marginTop: 6, backgroundColor: n.read ? 'transparent' : colors.teal }} />
                <View style={{ flex: 1 }}>
                  <T w="bold" size={14}>
                    {n.title}
                  </T>
                  <T size={13} color={colors.ink2} lh={19} style={{ marginTop: 2 }}>
                    {n.text}
                  </T>
                  <T size={11.5} color={colors.muted} style={{ marginTop: 4 }}>
                    {timeAgo(n.at)}
                  </T>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState icon={<Bell size={28} color={colors.teal} />} title="No notifications" text="Orders, requests, payouts and approvals show up here." action="Go back" onAction={() => nav.goBack()} />
        )}
      </ScrollView>
    </View>
  );
}

/* --------------------------------------------------------------- Masked call */

export function MaskedCallScreen({ route }: { route: { params?: { name?: string; label?: string } } }) {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const name = route.params?.name ?? 'Customer';
  const [connected, setConnected] = useState(false);
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2200);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.navy, paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32, alignItems: 'center' }}>
      <StatusBar barStyle="light-content" />
      <Avatar name={name} size={96} tint={{ bg: colors.navySurface, fg: colors.white }} />
      <T w="extrabold" size={24} color={colors.white} style={{ marginTop: 18 }}>
        {name}
      </T>
      <T size={13} color={colors.navyMuted} style={{ marginTop: 4 }}>
        {route.params?.label ?? ''}
      </T>
      <T w="semibold" size={15} color={connected ? '#7EE0B0' : colors.navyMuted} style={{ marginTop: 16 }}>
        {connected ? `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}` : 'Calling…'}
      </T>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.navyCard }}>
        <ShieldCheck size={14} color={colors.navyMuted} />
        <T size={12} color={colors.navyMuted}>
          Secure line · numbers are hidden on both sides
        </T>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', gap: 28 }}>
        {[
          { label: muted ? 'Unmute' : 'Mute', on: muted, Icon: muted ? MicOff : Mic, onPress: () => setMuted((m) => !m) },
          { label: 'Speaker', on: speaker, Icon: Volume2, onPress: () => setSpeaker((s) => !s) },
        ].map((b) => (
          <Pressable key={b.label} accessibilityLabel={b.label} onPress={b.onPress} style={{ alignItems: 'center', gap: 6 }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: b.on ? colors.white : colors.navySurface, alignItems: 'center', justifyContent: 'center' }}>
              <b.Icon size={24} color={b.on ? colors.navy : colors.white} />
            </View>
            <T size={12} color={colors.navyMuted}>
              {b.label}
            </T>
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityLabel="End call" onPress={() => nav.goBack()} style={{ marginTop: 32, width: 70, height: 70, borderRadius: 35, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
        <PhoneOff size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

/* ------------------------------------------------------------------ Profile */

export function ProfileScreen() {
  const nav = useNavigation<any>();
  const { session, vendorProfile: v, caretakerProfile: c, reviews, dispatch } = usePartnerStore();
  const isVendor = session.role === 'vendor';
  const tint = roleTint(session.role);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : '—';

  const rows: { label: string; sub?: string; Icon: typeof Store; to: string }[] = isVendor
    ? [
        { label: 'Pharmacy profile', sub: 'Hours, delivery radius, pharmacist', Icon: Store, to: 'PharmacyProfile' },
        { label: 'Order history', Icon: History, to: 'OrderHistory' },
        { label: 'Categories', Icon: Tags, to: 'Categories' },
      ]
    : [
        { label: 'Edit profile', sub: 'Experience, languages, skills', Icon: UserRound, to: 'EditCaretakerProfile' },
        { label: 'Availability', Icon: CalendarDays, to: 'Availability' },
        { label: 'Services & rates', Icon: Tags, to: 'ServicesRates' },
        { label: 'Ratings & reviews', sub: `${avg} average · ${reviews.length} reviews`, Icon: Star, to: 'Ratings' },
      ];
  const common: typeof rows = [
    { label: 'Documents', sub: 'All verified', Icon: FileCheck2, to: 'DocumentsStatus' },
    { label: 'Payout account', sub: `${(isVendor ? v : c).bank.bank} ••${(isVendor ? v : c).bank.last4}`, Icon: Landmark, to: 'PayoutAccount' },
    { label: 'Settings', Icon: SettingsIcon, to: 'Settings' },
    { label: 'Help & support', Icon: HelpCircle, to: 'Help' },
    { label: 'Terms & privacy', Icon: ShieldCheck, to: 'Legal' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TabHeader title="Profile" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}>
        <View style={[card, { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
          {isVendor ? (
            <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: tint.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Store size={30} color={tint.fg} />
            </View>
          ) : (
            <ProfilePhoto size={64} />
          )}
          <View style={{ flex: 1 }}>
            <T w="extrabold" size={17}>
              {isVendor ? v.storeName : c.fullName}
            </T>
            <T size={12.5} color={colors.muted}>
              {isVendor ? `${v.area}, ${v.city}` : `${c.title} · ${c.experienceYears} yrs`}
            </T>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
              <Badge label="Verified" variant="success" />
              <Badge label={`★ ${isVendor ? v.rating : avg}`} bg={colors.amberSoft} fg={colors.amberText} />
            </View>
          </View>
        </View>
        <T size={12} color={colors.muted} style={{ paddingHorizontal: 4 }}>
          +91 {session.phone.slice(0, 5)} {session.phone.slice(5)}
        </T>

        <View style={[card, { paddingHorizontal: 14 }]}>
          {rows.map((r, i) => (
            <ListRow key={r.to} icon={<r.Icon size={18} color={tint.fg} />} iconBg={tint.bg} title={r.label} subtitle={r.sub} onPress={() => nav.navigate(r.to)} last={i === rows.length - 1} />
          ))}
        </View>
        <View style={[card, { paddingHorizontal: 14 }]}>
          {common.map((r, i) => (
            <ListRow key={r.to} icon={<r.Icon size={18} color={colors.ink2} />} iconBg={colors.surface2} title={r.label} subtitle={r.sub} onPress={() => nav.navigate(r.to)} last={i === common.length - 1} />
          ))}
        </View>
        <View style={[card, { paddingHorizontal: 14 }]}>
          <ListRow
            icon={<LogOut size={18} color={colors.redText} />}
            iconBg={colors.redSoft}
            title="Log out"
            danger
            last
            onPress={() =>
              Alert.alert('Log out?', 'Demo data on this phone is reset when you log out.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Log out',
                  style: 'destructive',
                  onPress: () => {
                    dispatch({ type: 'LOGOUT', now: Date.now() });
                    nav.reset({ index: 0, routes: [{ name: 'Login' }] });
                  },
                },
              ])
            }
          />
        </View>
        <T size={11.5} color={colors.faint} center>
          Lifeline 360 Partner · version 1.0.0
        </T>
      </ScrollView>
    </View>
  );
}

export function PharmacyProfileScreen() {
  const nav = useNavigation<any>();
  const { vendorProfile: v, dispatch } = usePartnerStore();
  const [opensAt, setOpensAt] = useState(v.opensAt);
  const [closesAt, setClosesAt] = useState(v.closesAt);
  const [radiusKm, setRadiusKm] = useState(v.deliveryRadiusKm);
  const [pharmacist, setPharmacist] = useState(v.pharmacistName);
  const [address, setAddress] = useState(v.address);
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Pharmacy profile" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Field label="Opens at" value={opensAt} onChangeText={setOpensAt} style={{ flex: 1 }} />
          <Field label="Closes at" value={closesAt} onChangeText={setClosesAt} style={{ flex: 1 }} />
        </View>
        <View style={{ gap: 8 }}>
          <T w="semibold" size={13} color={colors.ink2}>
            Delivery radius
          </T>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[2, 3, 5, 8].map((k) => (
              <Chip key={k} label={`${k} km`} active={radiusKm === k} onPress={() => setRadiusKm(k)} />
            ))}
          </View>
          <T size={12} color={colors.muted}>
            Orders come from customers within this distance of your shop.
          </T>
        </View>
        <Field label="Registered pharmacist" value={pharmacist} onChangeText={setPharmacist} />
        <Field label="Shop address" value={address} onChangeText={setAddress} multiline />
        <View style={{ backgroundColor: colors.surface2, borderRadius: radius.md, padding: 14, gap: 6 }}>
          <T w="bold" size={13}>
            Licence details
          </T>
          <T size={12.5} color={colors.ink2}>Drug licence: {v.drugLicence}</T>
          <T size={12.5} color={colors.ink2}>GSTIN: {v.gstin}</T>
          <T size={12.5} color={colors.ink2}>Pharmacist reg.: {v.pharmacistReg}</T>
          <T size={11.5} color={colors.muted} style={{ marginTop: 2 }}>
            To change licence details, contact partner support. They are re-verified.
          </T>
        </View>
        <Button
          title="Save changes"
          onPress={() => {
            dispatch({ type: 'SAVE_VENDOR_PROFILE', patch: { opensAt, closesAt, deliveryRadiusKm: radiusKm, pharmacistName: pharmacist, address } });
            nav.goBack();
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const SKILLS = ['Vitals monitoring', 'Wound dressing', 'IV & injections', 'Catheter care', 'Elderly mobility', 'Diabetic care', 'Physiotherapy', 'Newborn care', 'Dementia care', 'Tracheostomy care'];

export function EditCaretakerProfileScreen() {
  const nav = useNavigation<any>();
  const { caretakerProfile: c, dispatch } = usePartnerStore();
  const [bio, setBio] = useState(c.bio);
  const [exp, setExp] = useState(String(c.experienceYears));
  const [skills, setSkills] = useState(c.skills);
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Edit profile" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 14 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <ProfilePhoto size={84} />
          <T size={12} color={colors.muted}>
            Photo verified with your documents
          </T>
        </View>
        <Field label="About you" value={bio} onChangeText={setBio} multiline hint="Families read this before booking you" />
        <Field label="Experience (years)" value={exp} onChangeText={(t) => setExp(t.replace(/\D/g, ''))} keyboardType="number-pad" maxLength={2} />
        <View style={{ gap: 8 }}>
          <T w="semibold" size={13} color={colors.ink2}>
            Skills
          </T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SKILLS.map((s) => (
              <Chip key={s} label={s} active={skills.includes(s)} onPress={() => setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))} />
            ))}
          </View>
        </View>
        <Button
          title="Save changes"
          onPress={() => {
            dispatch({ type: 'SAVE_CARETAKER_PROFILE', patch: { bio: bio.trim(), experienceYears: Number(exp) || 0, skills } });
            nav.goBack();
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function DocumentsStatusScreen() {
  const { session, documents } = usePartnerStore();
  const docs = documents[session.role ?? 'vendor'];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Documents" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[card, { paddingHorizontal: 14 }]}>
          {docs.map((d, i) => (
            <View key={d.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line }}>
              <FileCheck2 size={20} color={d.status === 'approved' ? colors.green : colors.amber} />
              <View style={{ flex: 1 }}>
                <T w="semibold" size={14}>
                  {d.title}
                </T>
                <T size={12} color={colors.muted}>
                  {d.docNumber ?? d.description}
                  {d.expiryDate ? ` · valid till ${d.expiryDate}` : ''}
                </T>
              </View>
              <Badge label={d.status === 'approved' ? 'Verified' : 'In review'} variant={d.status === 'approved' ? 'success' : 'warning'} />
            </View>
          ))}
        </View>
        <T size={12} color={colors.muted} lh={18} style={{ marginTop: 12, paddingHorizontal: 4 }}>
          We remind you 30 days before a document expires so your account stays active.
        </T>
      </ScrollView>
    </View>
  );
}

export function PayoutAccountScreen() {
  const { session, vendorProfile, caretakerProfile } = usePartnerStore();
  const bank = session.role === 'vendor' ? vendorProfile.bank : caretakerProfile.bank;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Payout account" />
      <View style={{ padding: 16, gap: 12 }}>
        <View style={[card, { padding: 16, gap: 10 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.skySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} color={colors.sky} />
            </View>
            <View style={{ flex: 1 }}>
              <T w="bold" size={15}>
                {bank.bank}
              </T>
              <T size={12.5} color={colors.muted}>
                Savings ••••{bank.last4}
              </T>
            </View>
            <Badge label="Verified" variant="success" />
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, gap: 4 }}>
            <T size={12.5} color={colors.ink2}>Account holder: {bank.holder}</T>
            <T size={12.5} color={colors.ink2}>IFSC: {bank.ifsc}</T>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 4 }}>
          <Clock3 size={15} color={colors.muted} />
          <T size={12.5} color={colors.muted} lh={18} style={{ flex: 1 }}>
            Earnings are settled every Monday. To change the account, contact partner support; the new account is verified with a ₹1 deposit.
          </T>
        </View>
      </View>
    </View>
  );
}

/* ----------------------------------------------------------------- Settings */

export function SettingsScreen() {
  const { session, settings, dispatch } = usePartnerStore();
  const isVendor = session.role === 'vendor';
  const row = (title: string, sub: string, value: boolean, onChange: (v: boolean) => void, last?: boolean) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.line }}>
      <View style={{ flex: 1 }}>
        <T w="semibold" size={14}>
          {title}
        </T>
        <T size={12} color={colors.muted} lh={17}>
          {sub}
        </T>
      </View>
      <Toggle label={title} value={value} onChange={onChange} />
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Settings" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={[card, { paddingHorizontal: 14 }]}>
          {row(isVendor ? 'Vibrate for new orders' : 'Vibrate for new requests', 'Keeps vibrating until you open the alert', settings.alertVibration, (v) => dispatch({ type: 'UPDATE_SETTINGS', patch: { alertVibration: v } }))}
          {row(isVendor ? 'Keep screen on for alerts' : 'Keep screen on during a shift', 'Stops the phone from sleeping while you work', settings.keepAwake, (v) => dispatch({ type: 'UPDATE_SETTINGS', patch: { keepAwake: v } }), true)}
        </View>
        {isVendor ? (
          <View style={[card, { padding: 14, gap: 8 }]}>
            <T w="semibold" size={14}>
              Time to accept an order
            </T>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[2, 3, 5].map((m) => (
                <Chip key={m} label={`${m} min`} active={settings.orderAcceptMinutes === m} onPress={() => dispatch({ type: 'UPDATE_SETTINGS', patch: { orderAcceptMinutes: m } })} />
              ))}
            </View>
            <T size={12} color={colors.muted}>
              Orders not accepted in time go to the next pharmacy.
            </T>
          </View>
        ) : null}
        <View style={[card, { paddingHorizontal: 14 }]}>
          <ListRow icon={<BellRing size={18} color={colors.ink2} />} iconBg={colors.surface2} title="Language" subtitle="English · Hindi and Kannada coming soon" last />
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------- Help & legal */

const FAQ = {
  vendor: [
    ['When do I get paid?', 'Sales are settled every Monday to your bank account, after the Lifeline fee. You can also withdraw early from Earnings.'],
    ['What if a medicine is out of stock?', 'Mark it “Not available” while packing and suggest a substitute. The customer is refunded for removed items.'],
    ['How does handover work?', 'When you mark an order packed, a Lifeline rider is assigned. Check the rider’s 4-digit pickup code before giving the bag.'],
  ],
  caretaker: [
    ['When do I get paid?', 'Completed bookings are settled every Monday. The amount you see on a request is what you take home.'],
    ['What if I can’t make it to a booking?', 'Call support at least 6 hours before. Frequent late cancellations lower your ranking.'],
    ['Why do I need the family’s code?', 'It confirms the service was completed and protects you in case of a dispute.'],
  ],
};

export function HelpScreen() {
  const { session } = usePartnerStore();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Help & support" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { label: 'Call', sub: '1800 360 911', Icon: Phone, onPress: () => Linking.openURL('tel:1800360911') },
            { label: 'Chat', sub: 'WhatsApp', Icon: MessageCircle, onPress: () => Linking.openURL('https://wa.me/918045670911') },
            { label: 'Email', sub: 'partners@', Icon: Mail, onPress: () => Linking.openURL('mailto:partners@lifeline360.in') },
          ].map((c) => (
            <Pressable key={c.label} onPress={c.onPress} style={({ pressed }) => [card, { flex: 1, padding: 12, alignItems: 'center', gap: 6, opacity: pressed ? 0.8 : 1 }]}>
              <c.Icon size={20} color={colors.teal} />
              <T w="bold" size={13}>
                {c.label}
              </T>
              <T size={11} color={colors.muted}>
                {c.sub}
              </T>
            </Pressable>
          ))}
        </View>
        <T w="bold" size={15} style={{ marginTop: 4 }}>
          Common questions
        </T>
        <View style={[card, { paddingHorizontal: 14 }]}>
          {FAQ[session.role ?? 'vendor'].map(([q, a], i) => (
            <Pressable key={q} onPress={() => setOpen(open === i ? null : i)} style={{ paddingVertical: 13, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <T w="semibold" size={14} style={{ flex: 1 }}>
                  {q}
                </T>
                <ChevronRight size={16} color={colors.faint} style={{ transform: [{ rotate: open === i ? '90deg' : '0deg' }] }} />
              </View>
              {open === i ? (
                <T size={13} color={colors.ink2} lh={19} style={{ marginTop: 6 }}>
                  {a}
                </T>
              ) : null}
            </Pressable>
          ))}
        </View>
        <T size={12} color={colors.muted} center>
          Support is open 8 AM to 10 PM, every day.
        </T>
      </ScrollView>
    </View>
  );
}

export function LegalScreen() {
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');
  const text =
    tab === 'terms'
      ? [
          ['Partner agreement', 'By joining Lifeline 360 you agree to serve customers professionally, keep your licences valid and follow the service standards shared at onboarding.'],
          ['Fees', `Lifeline keeps a platform fee on each order or booking (currently ${COMMISSION.vendor * 100}% for pharmacies and ${COMMISSION.caretaker * 100}% for caretakers). Fees can change with 30 days’ notice.`],
          ['Cancellations', 'Repeated rejections or missed orders and bookings can lower your ranking or pause your account.'],
        ]
      : [
          ['What we collect', 'Your contact details, documents, location while working and transaction history.'],
          ['How we use it', 'To verify you, match you with customers, settle payments and resolve disputes. Customer and partner numbers are always masked.'],
          ['Your rights', 'You can download or delete your data by writing to privacy@lifeline360.in.'],
        ];
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Terms & privacy" />
      <View style={{ flexDirection: 'row', gap: 8, padding: 16, paddingBottom: 0 }}>
        <Chip label="Partner terms" active={tab === 'terms'} onPress={() => setTab('terms')} />
        <Chip label="Privacy policy" active={tab === 'privacy'} onPress={() => setTab('privacy')} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {text.map(([h, p]) => (
          <View key={h} style={{ gap: 4 }}>
            <T w="bold" size={15}>
              {h}
            </T>
            <T size={13.5} color={colors.ink2} lh={21}>
              {p}
            </T>
          </View>
        ))}
        <T size={11.5} color={colors.muted}>
          Last updated 1 October 2026
        </T>
      </ScrollView>
    </View>
  );
}

