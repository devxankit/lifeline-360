import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell, ChevronDown, ChevronUp, CircleHelp, FileText, Globe, Info, Lock, LogOut, Mail, MapPin, MessageSquare, Pencil, Phone, Plus, ShieldCheck, Trash2, UserPlus, Users,
} from 'lucide-react-native';
import T from '../components/T';
import { AppBar, Avatar, BottomBar, Button, Chip, Field, IconButton, ListRow, RadioDot, Section, Toggle } from '../components/ui';
import { DuoIcon } from '../components/brand';
import { colors, radius, service } from '../theme';
import { bloodGroups } from '../data/catalog';
import { Address, Contact, Member, useStore } from '../store/AppStore';

/* ------------------------------------------------------------- Profile tab */

export function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, membership, logout } = useStore();
  const confirmLogout = () =>
    Alert.alert('Log out?', 'You can log back in with your mobile number.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => { logout(); navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); } },
    ]);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 32 }}>
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: colors.white, gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Avatar name={user?.name || 'You'} size={64} tint={{ bg: colors.teal, fg: colors.white }} />
            <View style={{ flex: 1 }}>
              <T w="extrabold" size={19}>{user?.name || 'Your profile'}</T>
              <T size={13} color={colors.ink2}>+91 {user?.phone?.slice(0, 5)} {user?.phone?.slice(5)}</T>
            </View>
            <IconButton label="Edit profile" onPress={() => navigation.navigate('EditProfile')}>
              <Pencil size={19} color={colors.teal} />
            </IconButton>
          </View>
          <Pressable onPress={() => navigation.navigate(membership ? 'Membership' : 'MembershipPlans')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, backgroundColor: colors.amberSoft }}>
            <DuoIcon name="membership" size={28} />
            <View style={{ flex: 1 }}>
              <T w="bold" size={14} color={colors.amberText}>{membership ? `${membership.plan === 'annual' ? 'Annual' : 'Monthly'} member` : 'Become a member'}</T>
              <T size={12} color={colors.amberText}>{membership ? `Valid till ${membership.validTill}` : 'Benefits for the whole family'}</T>
            </View>
          </Pressable>
        </View>
        <Section title="Account">
          <ListRow icon={<MapPin size={18} color={colors.teal} />} title="Saved addresses" onPress={() => navigation.navigate('Addresses', {})} />
          <ListRow icon={<Users size={18} color={service.nursing.fg} />} iconBg={service.nursing.bg} title="Family members" onPress={() => navigation.navigate('Family')} />
          <ListRow icon={<Phone size={18} color={colors.red} />} iconBg={colors.redSoft} title="Emergency contacts" subtitle="Alerted when you book an ambulance" last onPress={() => navigation.navigate('EmergencyContacts')} />
        </Section>
        <Section title="Settings">
          <ListRow icon={<Bell size={18} color={colors.teal} />} title="Notifications" onPress={() => navigation.navigate('NotificationPrefs')} />
          <ListRow icon={<Globe size={18} color={colors.teal} />} title="Language" subtitle="English" last onPress={() => navigation.navigate('Language')} />
        </Section>
        <Section title="Support">
          <ListRow icon={<CircleHelp size={18} color={colors.teal} />} title="Help & support" onPress={() => navigation.navigate('Help')} />
          <ListRow icon={<FileText size={18} color={colors.teal} />} title="Terms & conditions" onPress={() => navigation.navigate('Legal', { kind: 'terms' })} />
          <ListRow icon={<Lock size={18} color={colors.teal} />} title="Privacy policy" onPress={() => navigation.navigate('Legal', { kind: 'privacy' })} />
          <ListRow icon={<Info size={18} color={colors.teal} />} title="About Lifeline 360" last onPress={() => navigation.navigate('Legal', { kind: 'about' })} />
        </Section>
        <Section>
          <ListRow icon={<LogOut size={18} color={colors.redText} />} iconBg={colors.redSoft} title="Log out" danger last onPress={confirmLogout} />
        </Section>
        <T size={12} color={colors.faint} center>Lifeline 360 · version 1.0.0 (demo)</T>
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------- Edit profile */

export function EditProfileScreen({ navigation }: any) {
  const { user, saveProfile } = useStore();
  const [name, setName] = useState(user?.name ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  const [dob, setDob] = useState(user?.dob ?? '');
  const [blood, setBlood] = useState(user?.bloodGroup ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppBar title="Edit profile" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
        <Field label="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
        <Field label="Mobile number" value={`+91 ${user?.phone ?? ''}`} editable={false} hint="To change your number, contact support." />
        <View style={{ gap: 8 }}>
          <T w="semibold" size={13} color={colors.ink2}>Gender</T>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Female', 'Male', 'Other'].map((g) => <Chip key={g} label={g} active={gender === g} onPress={() => setGender(g)} style={{ flex: 1, justifyContent: 'center', height: 44 }} />)}
          </View>
        </View>
        <Field label="Date of birth" value={dob} onChangeText={setDob} placeholder="DD/MM/YYYY" keyboardType="number-pad" />
        <View style={{ gap: 8 }}>
          <T w="semibold" size={13} color={colors.ink2}>Blood group</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {bloodGroups.map((g) => <Chip key={g} label={g} active={blood === g} onPress={() => setBlood(g)} />)}
          </View>
        </View>
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      </ScrollView>
      <BottomBar>
        <Button title="Save changes" style={{ flex: 1 }} disabled={name.trim().length < 2} onPress={() => { saveProfile({ name: name.trim(), gender, dob, bloodGroup: blood, email: email.trim() }); navigation.goBack(); }} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

/* ---------------------------------------------------------------- Addresses */

export function AddressesScreen({ navigation, route }: any) {
  const select = !!route.params?.select;
  const { addresses, addressId, selectAddress, removeAddress } = useStore();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title={select ? 'Choose address' : 'Saved addresses'} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {addresses.map((a) => {
          const on = a.id === addressId;
          return (
            <Pressable key={a.id} onPress={() => { selectAddress(a.id); if (select) navigation.goBack(); }} style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: on ? 1.5 : 1, borderColor: on ? colors.teal : colors.line, padding: 14, flexDirection: 'row', gap: 12 }}>
              <RadioDot on={on} />
              <View style={{ flex: 1, gap: 2 }}>
                <T w="bold" size={15}>{a.label}</T>
                <T size={13} color={colors.ink2} lh={18}>{a.line}, {a.area}, {a.city} {a.pincode}</T>
              </View>
              <IconButton label="Edit address" onPress={() => navigation.navigate('AddressForm', { id: a.id })} style={{ width: 36, height: 36 }}><Pencil size={17} color={colors.muted} /></IconButton>
              <IconButton label="Delete address" onPress={() => Alert.alert('Delete address?', a.label, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => removeAddress(a.id) }])} style={{ width: 36, height: 36 }}><Trash2 size={17} color={colors.muted} /></IconButton>
            </Pressable>
          );
        })}
        <Button title="Add new address" variant="outline" icon={<Plus size={18} color={colors.teal} />} onPress={() => navigation.navigate('AddressForm', {})} />
      </ScrollView>
    </View>
  );
}

export function AddressFormScreen({ navigation, route }: any) {
  const { addresses, saveAddress, selectAddress } = useStore();
  const existing = addresses.find((a) => a.id === route.params?.id);
  const [a, setA] = useState<Address>(existing ?? { id: String(Date.now()), label: 'Home', line: '', area: '', city: 'Bengaluru', pincode: '' });
  const set = (k: keyof Address) => (v: string) => setA((x) => ({ ...x, [k]: v }));
  const ok = a.line.trim() && a.area.trim() && a.city.trim() && /^\d{6}$/.test(a.pincode);
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppBar title={existing ? 'Edit address' : 'Add address'} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Home', 'Work', 'Parents', 'Other'].map((l) => <Chip key={l} label={l} active={a.label === l} onPress={() => set('label')(l)} />)}
        </View>
        <Field label="House / flat, street" value={a.line} onChangeText={set('line')} placeholder="12th Main, HAL 2nd Stage" />
        <Field label="Area / locality" value={a.area} onChangeText={set('area')} placeholder="Indiranagar" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field label="City" value={a.city} onChangeText={set('city')} style={{ flex: 1 }} />
          <Field label="Pincode" value={a.pincode} onChangeText={(t) => set('pincode')(t.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" style={{ flex: 1 }} />
        </View>
      </ScrollView>
      <BottomBar>
        <Button title="Save address" style={{ flex: 1 }} disabled={!ok} onPress={() => { saveAddress(a); selectAddress(a.id); navigation.goBack(); }} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

/* ------------------------------------------------------------------- Family */

export function FamilyScreen({ navigation }: any) {
  const { family, user, removeMember } = useStore();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Family members" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar name={user?.name || 'You'} size={46} tint={{ bg: colors.teal, fg: colors.white }} />
          <View style={{ flex: 1 }}>
            <T w="bold" size={15}>{user?.name || 'You'}</T>
            <T size={12} color={colors.muted}>Self · account holder</T>
          </View>
        </View>
        {family.map((m) => (
          <View key={m.id} style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar name={m.name} size={46} />
            <View style={{ flex: 1 }}>
              <T w="bold" size={15}>{m.name}</T>
              <T size={12} color={colors.muted}>{m.relation} · {m.age} yrs · {m.gender}</T>
            </View>
            <IconButton label="Edit" onPress={() => navigation.navigate('MemberForm', { id: m.id })} style={{ width: 36, height: 36 }}><Pencil size={17} color={colors.muted} /></IconButton>
            <IconButton label="Remove" onPress={() => Alert.alert('Remove member?', m.name, [{ text: 'Cancel', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: () => removeMember(m.id) }])} style={{ width: 36, height: 36 }}><Trash2 size={17} color={colors.muted} /></IconButton>
          </View>
        ))}
        <Button title="Add family member" variant="outline" icon={<UserPlus size={18} color={colors.teal} />} onPress={() => navigation.navigate('MemberForm', {})} />
      </ScrollView>
    </View>
  );
}

export function MemberFormScreen({ navigation, route }: any) {
  const { family, saveMember } = useStore();
  const existing = family.find((m) => m.id === route.params?.id);
  const [m, setM] = useState<Member>(existing ?? { id: String(Date.now()), name: '', relation: 'Spouse', age: '', gender: 'Female' });
  const ok = m.name.trim().length > 1 && m.age;
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppBar title={existing ? 'Edit member' : 'Add family member'} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} keyboardShouldPersistTaps="handled">
        <Field label="Full name" value={m.name} onChangeText={(v) => setM({ ...m, name: v })} autoCapitalize="words" />
        <View style={{ gap: 8 }}>
          <T w="semibold" size={13} color={colors.ink2}>Relation</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Other'].map((r) => <Chip key={r} label={r} active={m.relation === r} onPress={() => setM({ ...m, relation: r })} />)}
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field label="Age" value={m.age} onChangeText={(v) => setM({ ...m, age: v.replace(/\D/g, '').slice(0, 3) })} keyboardType="number-pad" style={{ flex: 1 }} />
          <View style={{ flex: 2, gap: 8 }}>
            <T w="semibold" size={13} color={colors.ink2}>Gender</T>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['Female', 'Male'].map((g) => <Chip key={g} label={g} active={m.gender === g} onPress={() => setM({ ...m, gender: g })} style={{ flex: 1, justifyContent: 'center', height: 48 }} />)}
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomBar>
        <Button title="Save member" style={{ flex: 1 }} disabled={!ok} onPress={() => { saveMember({ ...m, name: m.name.trim() }); navigation.goBack(); }} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

/* --------------------------------------------------------- Emergency contacts */

export function EmergencyContactsScreen() {
  const { contacts, saveContact, removeContact } = useStore();
  const [c, setC] = useState<Contact>({ id: '', name: '', relation: '', phone: '' });
  const ok = c.name.trim().length > 1 && c.phone.length === 10;
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppBar title="Emergency contacts" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', gap: 10, padding: 12, borderRadius: radius.md, backgroundColor: colors.redSoft }}>
          <ShieldCheck size={18} color={colors.redText} />
          <T size={12} color={colors.redText} style={{ flex: 1 }} lh={17}>These contacts get an SMS with your live location when you book an ambulance.</T>
        </View>
        {contacts.map((x) => (
          <View key={x.id} style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar name={x.name} size={44} tint={{ bg: colors.redSoft, fg: colors.redText }} />
            <View style={{ flex: 1 }}>
              <T w="bold" size={15}>{x.name}</T>
              <T size={12} color={colors.muted}>{x.relation || 'Contact'} · +91 {x.phone}</T>
            </View>
            <IconButton label="Remove" onPress={() => removeContact(x.id)} style={{ width: 36, height: 36 }}><Trash2 size={17} color={colors.muted} /></IconButton>
          </View>
        ))}
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 12, marginTop: 6 }}>
          <T w="bold" size={15}>Add a contact</T>
          <Field placeholder="Name" value={c.name} onChangeText={(v) => setC({ ...c, name: v })} autoCapitalize="words" />
          <Field placeholder="Relation (e.g. Brother)" value={c.relation} onChangeText={(v) => setC({ ...c, relation: v })} />
          <Field placeholder="Mobile number" value={c.phone} onChangeText={(v) => setC({ ...c, phone: v.replace(/\D/g, '').slice(0, 10) })} keyboardType="number-pad" />
          <Button title="Add contact" disabled={!ok} onPress={() => { saveContact({ ...c, id: String(Date.now()) }); setC({ id: '', name: '', relation: '', phone: '' }); }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ----------------------------------------------------------- Notification prefs */

export function NotificationPrefsScreen() {
  const { prefs, setPref } = useStore();
  const rows: { k: keyof typeof prefs; t: string; s: string }[] = [
    { k: 'bookings', t: 'Booking updates', s: 'Confirmations, assignments and status changes' },
    { k: 'reminders', t: 'Reminders', s: 'Appointments, medicines and renewals' },
    { k: 'reports', t: 'Reports', s: 'When a lab report is ready' },
    { k: 'whatsapp', t: 'WhatsApp updates', s: 'Receive updates on WhatsApp too' },
    { k: 'offers', t: 'Offers & promotions', s: 'Health checkup deals and membership offers' },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Notifications" />
      <Section style={{ marginTop: 8 }}>
        {rows.map((r, i) => <ListRow key={r.k} title={r.t} subtitle={r.s} last={i === rows.length - 1} right={<Toggle label={r.t} value={prefs[r.k]} onChange={(v) => setPref(r.k, v)} />} />)}
      </Section>
      <T size={12} color={colors.muted} style={{ padding: 16 }}>Emergency alerts and OTPs are always sent.</T>
    </View>
  );
}

/* ------------------------------------------------------------------ Language */

export function LanguageScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Language" />
      <Section style={{ marginTop: 8 }}>
        <ListRow title="English" subtitle="Current language" right={<RadioDot on />} />
        <ListRow title="हिन्दी (Hindi)" subtitle="Coming soon" last right={<RadioDot on={false} />} />
      </Section>
    </View>
  );
}

/* ---------------------------------------------------------------------- Help */

const FAQS = [
  { q: 'How do I cancel a booking?', a: 'Open the booking from the Bookings tab and tap Cancel. Refunds reach your original payment method in 5–7 working days.' },
  { q: 'Are calls with drivers and partners private?', a: 'Yes. Calls go through a masked number, so neither side sees the other’s personal number.' },
  { q: 'When will I get my lab report?', a: 'Most reports are ready within 24 hours of sample collection. You’ll get a notification and can view it in the Health tab.' },
  { q: 'Can I book for my family?', a: 'Yes. Add family members under Profile → Family members and choose them while booking.' },
  { q: 'How does the membership work?', a: 'A membership adds consultation benefits, lab discounts and priority handling for you and up to 4 family members.' },
];

export function HelpScreen({ navigation }: any) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Help & support" />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', gap: 10, padding: 16, backgroundColor: colors.white }}>
          <ContactTile icon={<Phone size={20} color={colors.teal} />} label="Call us" onPress={() => navigation.navigate('Call', { name: 'Lifeline Support', role: 'Customer care · 24/7' })} />
          <ContactTile icon={<MessageSquare size={20} color={colors.teal} />} label="Chat" onPress={() => Alert.alert('Chat', 'Live chat connects with the support desk after launch.')} />
          <ContactTile icon={<Mail size={20} color={colors.teal} />} label="Email" onPress={() => Alert.alert('Email', 'support@lifeline360.in (placeholder)')} />
        </View>
        <Section title="Frequently asked">
          {FAQS.map((f, i) => (
            <Pressable key={f.q} onPress={() => setOpen(open === i ? null : i)} style={{ paddingVertical: 14, borderBottomWidth: i === FAQS.length - 1 ? 0 : 1, borderBottomColor: '#EEF0EF', gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <T w="semibold" size={14} style={{ flex: 1 }}>{f.q}</T>
                {open === i ? <ChevronUp size={18} color={colors.muted} /> : <ChevronDown size={18} color={colors.muted} />}
              </View>
              {open === i ? <T size={13} color={colors.ink2} lh={19}>{f.a}</T> : null}
            </Pressable>
          ))}
        </Section>
        <Section title="Still need help?">
          <Button title="Raise a complaint" variant="outline" onPress={() => navigation.navigate('Complaint')} />
        </Section>
      </ScrollView>
    </View>
  );
}

function ContactTile({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1, height: 76, borderRadius: radius.md, backgroundColor: colors.tealTint, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      {icon}
      <T w="semibold" size={13} color={colors.tealDeep}>{label}</T>
    </Pressable>
  );
}

export function ComplaintScreen({ navigation }: any) {
  const { bookings, notify } = useStore();
  const [topic, setTopic] = useState('Booking issue');
  const [booking, setBooking] = useState<string | null>(bookings[0]?.id ?? null);
  const [text, setText] = useState('');
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppBar title="Raise a complaint" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
        <View style={{ gap: 8 }}>
          <T w="semibold" size={13} color={colors.ink2}>Topic</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Booking issue', 'Payment / refund', 'Partner behaviour', 'App problem', 'Other'].map((t) => <Chip key={t} label={t} active={topic === t} onPress={() => setTopic(t)} />)}
          </View>
        </View>
        {bookings.length ? (
          <View style={{ gap: 8 }}>
            <T w="semibold" size={13} color={colors.ink2}>Related booking</T>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {bookings.slice(0, 6).map((b) => <Chip key={b.id} label={b.id} active={booking === b.id} onPress={() => setBooking(b.id)} />)}
            </ScrollView>
          </View>
        ) : null}
        <View style={{ gap: 8 }}>
          <T w="semibold" size={13} color={colors.ink2}>Tell us what happened</T>
          <TextInput value={text} onChangeText={setText} multiline placeholder="Describe the issue" placeholderTextColor={colors.faint} style={{ minHeight: 120, borderRadius: radius.md, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.white, padding: 12, fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: colors.ink, textAlignVertical: 'top' }} />
        </View>
      </ScrollView>
      <BottomBar>
        <Button
          title="Submit"
          style={{ flex: 1 }}
          disabled={text.trim().length < 10}
          onPress={() => {
            const ticket = 'TK-' + String(Math.floor(10000 + Math.random() * 89999));
            notify({ title: 'Complaint received', text: `Ticket ${ticket} · we’ll respond within 24 hours` });
            Alert.alert('Complaint submitted', `Ticket ${ticket}. Our team will get back to you within 24 hours.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
          }}
        />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

/* --------------------------------------------------------------------- Legal */

const LEGAL: Record<string, { title: string; body: string }> = {
  terms: { title: 'Terms & conditions', body: 'Draft terms for the demo build. Lifeline 360 connects you with independent healthcare providers such as doctors, pharmacies, laboratories, caretakers, ambulance operators and blood banks. Providers are responsible for the services they deliver. Bookings, cancellations and refunds follow the policy shown at checkout. The final terms will be published after legal review.' },
  privacy: { title: 'Privacy policy', body: 'Draft policy for the demo build. We collect the details you give us (name, contact, addresses, health records you upload) to provide services. Health information is shared only with the provider you book. Calls use masked numbers. You can request deletion of your data from Help & support. The final policy will be published after legal review.' },
  about: { title: 'About Lifeline 360', body: 'Lifeline 360 brings doctor consultation, medicines, nursing and caretakers, ambulance, lab tests and blood bank services together in one app, with membership, calling support and live tracking. Since 2026.' },
};

export function LegalScreen({ route }: any) {
  const l = LEGAL[route.params.kind] ?? LEGAL.about;
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title={l.title} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <T size={14} color={colors.ink2} lh={22}>{l.body}</T>
      </ScrollView>
    </View>
  );
}

