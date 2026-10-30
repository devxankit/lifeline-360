import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle2, ChevronRight, Clock3, FileText, PhoneCall, ShieldCheck } from 'lucide-react-native';
import { AppBar, Badge, BottomBar, Button, Chip, Field, T, colors, radius } from '../../ui';
import { usePartnerStore } from '../../store/PartnerStore';
import { roleTint } from '../../components/partner';
import { CaptureTile } from '../../components/partner';

/* ------------------------------------------------------------ Basic details */

const LANGS = ['Kannada', 'Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam'];

export function BasicDetailsScreen() {
  const nav = useNavigation<any>();
  const { session, vendorProfile: v, caretakerProfile: c, dispatch } = usePartnerStore();
  const isVendor = session.role === 'vendor';

  const [storeName, setStoreName] = useState(v.storeName);
  const [owner, setOwner] = useState(v.ownerName);
  const [address, setAddress] = useState(v.address);
  const [area, setArea] = useState(v.area);
  const [pincode, setPincode] = useState(v.pincode);
  const [pharmacist, setPharmacist] = useState(v.pharmacistName);

  const [name, setName] = useState(c.fullName);
  const [title, setTitle] = useState(c.title);
  const [exp, setExp] = useState(String(c.experienceYears));
  const [langs, setLangs] = useState<string[]>(c.languages);
  const [cArea, setCArea] = useState(c.area);

  const valid = isVendor
    ? storeName.trim() && owner.trim() && address.trim() && /^\d{6}$/.test(pincode) && pharmacist.trim()
    : name.trim() && title.trim() && Number(exp) >= 0 && langs.length > 0 && cArea.trim();

  const save = () => {
    if (!valid) return;
    if (isVendor) {
      dispatch({ type: 'SAVE_VENDOR_PROFILE', details: true, patch: { storeName: storeName.trim(), ownerName: owner.trim(), address: address.trim(), area: area.trim(), pincode, pharmacistName: pharmacist.trim() } });
    } else {
      dispatch({ type: 'SAVE_CARETAKER_PROFILE', details: true, patch: { fullName: name.trim(), title: title.trim(), experienceYears: Number(exp) || 0, languages: langs, area: cArea.trim() } });
    }
    nav.navigate('KycDocuments');
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title={isVendor ? 'Pharmacy details' : 'Your details'} subtitle="Step 1 of 2" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 14 }}>
        {isVendor ? (
          <>
            <Field label="Pharmacy name" value={storeName} onChangeText={setStoreName} />
            <Field label="Owner name" value={owner} onChangeText={setOwner} />
            <Field label="Registered pharmacist" value={pharmacist} onChangeText={setPharmacist} hint="Name and qualification, as on the council certificate" />
            <Field label="Shop address" value={address} onChangeText={setAddress} multiline />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Field label="Area" value={area} onChangeText={setArea} style={{ flex: 1 }} />
              <Field label="PIN code" value={pincode} onChangeText={(t) => setPincode(t.replace(/\D/g, ''))} keyboardType="number-pad" maxLength={6} style={{ width: 120 }} />
            </View>
          </>
        ) : (
          <>
            <Field label="Full name" value={name} onChangeText={setName} />
            <Field label="Qualification" value={title} onChangeText={setTitle} hint="For example: Registered nurse (GNM), Certified caregiver" />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Field label="Experience (years)" value={exp} onChangeText={(t) => setExp(t.replace(/\D/g, ''))} keyboardType="number-pad" maxLength={2} style={{ width: 150 }} />
              <Field label="Area you live in" value={cArea} onChangeText={setCArea} style={{ flex: 1 }} />
            </View>
            <View style={{ gap: 8 }}>
              <T w="semibold" size={13} color={colors.ink2}>
                Languages you speak
              </T>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {LANGS.map((l) => (
                  <Chip key={l} label={l} active={langs.includes(l)} onPress={() => setLangs((cur) => (cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]))} />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
      <BottomBar>
        <Button title="Continue to documents" onPress={save} disabled={!valid} style={{ flex: 1 }} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

/* ---------------------------------------------------------------- Documents */

export function KycDocumentsScreen() {
  const nav = useNavigation<any>();
  const { session, documents, dispatch } = usePartnerStore();
  const role = session.role ?? 'vendor';
  const docs = documents[role];
  const done = docs.filter((d) => d.status !== 'missing' && d.status !== 'rejected').length;
  const tint = roleTint(role);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Documents" subtitle="Step 2 of 2" onBack={() => nav.navigate('BasicDetails')} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <T w="bold" size={14}>
              {done} of {docs.length} uploaded
            </T>
            <T size={12} color={colors.muted}>
              Reviewed within 24 hours
            </T>
          </View>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.surface2, marginTop: 10, overflow: 'hidden' }}>
            <View style={{ width: `${(done / docs.length) * 100}%`, height: 6, backgroundColor: tint.fg }} />
          </View>
        </View>

        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' }}>
          {docs.map((d, i) => {
            const uploaded = d.status !== 'missing' && d.status !== 'rejected';
            return (
              <Pressable
                key={d.id}
                onPress={() => nav.navigate('DocumentUpload', { docId: d.id })}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line, opacity: pressed ? 0.7 : 1 })}>
                <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: uploaded ? colors.tealTint : colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  {uploaded ? <CheckCircle2 size={19} color={colors.teal} /> : <FileText size={19} color={colors.muted} />}
                </View>
                <View style={{ flex: 1 }}>
                  <T w="bold" size={14}>
                    {d.title}
                  </T>
                  <T size={12} color={colors.muted} numberOfLines={1}>
                    {uploaded && d.docNumber ? `${d.docNumber}${d.expiryDate ? ` · valid till ${d.expiryDate}` : ''}` : d.description}
                  </T>
                </View>
                {uploaded ? <Badge label="Uploaded" variant="info" /> : <ChevronRight size={18} color={colors.faint} />}
              </Pressable>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, paddingHorizontal: 2 }}>
          <ShieldCheck size={15} color={colors.muted} />
          <T size={12} color={colors.muted} lh={17} style={{ flex: 1 }}>
            Documents are only used to verify you and are never shown to customers.
          </T>
        </View>
      </ScrollView>
      <BottomBar>
        <Button
          title={done < docs.length ? `${docs.length - done} more to upload` : 'Submit for verification'}
          disabled={done < docs.length}
          onPress={() => {
            dispatch({ type: 'SUBMIT_KYC' });
            nav.reset({ index: 0, routes: [{ name: 'KycPending' }] });
          }}
          style={{ flex: 1 }}
        />
      </BottomBar>
    </View>
  );
}

/** Returns why a DD/MM/YYYY expiry can't be accepted, or null when it is a real future date. */
export function expiryProblem(value: string, now = Date.now()): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) return 'Use DD/MM/YYYY';
  const [day, month, year] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return 'This date doesn’t exist';
  if (date.getTime() <= now) return 'This document has expired';
  if (year > new Date(now).getFullYear() + 30) return 'Check the year';
  return null;
}

export function DocumentUploadScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { session, documents, dispatch } = usePartnerStore();
  const doc = documents[session.role ?? 'vendor'].find((d) => d.id === route.params?.docId);
  const [captured, setCaptured] = useState(!!doc?.uploadedAt);
  const [num, setNum] = useState(doc?.docNumber ?? '');
  const [expiry, setExpiry] = useState(doc?.expiryDate ?? '');
  if (!doc) return null;

  const expiryError = doc.needsExpiry ? expiryProblem(expiry) : null;
  const valid = captured && (!doc.numberLabel || num.trim().length >= 4) && !expiryError;

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title={doc.title} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 16 }}>
        <T size={13} color={colors.muted} lh={19}>
          {doc.description}. Make sure the text is readable and nothing is cut off.
        </T>
        <CaptureTile captured={captured} onCapture={() => setCaptured(true)} label={doc.id === 'shop' || doc.id === 'photo' ? 'Take photo' : 'Take photo of the document'} />
        {doc.numberLabel ? <Field label={doc.numberLabel} value={num} onChangeText={setNum} autoCapitalize="characters" /> : null}
        {doc.needsExpiry ? (
          <Field
            label="Valid till"
            placeholder="DD/MM/YYYY"
            value={expiry}
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={(t) => {
              const d = t.replace(/\D/g, '').slice(0, 8);
              setExpiry([d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join('/'));
            }}
            error={expiry.length === 10 && expiryError ? expiryError : undefined}
          />
        ) : null}
      </ScrollView>
      <BottomBar>
        <Button
          title="Save document"
          disabled={!valid}
          onPress={() => {
            dispatch({ type: 'UPLOAD_DOC', docId: doc.id, docNumber: num.trim() || undefined, expiryDate: expiry || undefined, now: Date.now() });
            nav.goBack();
          }}
          style={{ flex: 1 }}
        />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

/* ---------------------------------------------------------------- Pending */

export function KycPendingScreen() {
  const nav = useNavigation<any>();
  const { session, dispatch } = usePartnerStore();
  const isVendor = session.role === 'vendor';

  const approve = () => {
    dispatch({ type: 'APPROVE_KYC', now: Date.now() });
    nav.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  // Demo: the operations team "approves" after a few seconds.
  useEffect(() => {
    const t = setTimeout(approve, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = isVendor
    ? ['Documents received', 'Drug licence checked with the State Drug Controller', 'Pharmacy goes live']
    : ['Documents received', 'Nursing council registration and police verification checked', 'Profile goes live'];

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Verification" onBack={() => nav.navigate('KycDocuments')} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.amberSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Clock3 size={30} color={colors.amber} />
        </View>
        <T w="extrabold" size={22} style={{ marginTop: 16 }}>
          We’re checking your documents
        </T>
        <T size={14} color={colors.muted} lh={21} style={{ marginTop: 6 }}>
          This usually takes a few hours. We’ll notify you as soon as your {isVendor ? 'pharmacy' : 'profile'} is approved.
        </T>

        <View style={{ marginTop: 24, gap: 0 }}>
          {steps.map((s, i) => (
            <View key={s} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ alignItems: 'center', width: 22 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: i === 0 ? colors.teal : colors.white, borderWidth: i === 0 ? 0 : 2, borderColor: i === 1 ? colors.amber : colors.lineStrong, alignItems: 'center', justifyContent: 'center' }}>
                  {i === 0 ? <CheckCircle2 size={14} color={colors.white} /> : null}
                </View>
                {i < steps.length - 1 ? <View style={{ width: 2, height: 30, backgroundColor: colors.line }} /> : null}
              </View>
              <T w={i < 2 ? 'bold' : 'semibold'} size={14} color={i < 2 ? colors.ink : colors.muted} style={{ flex: 1, paddingTop: 2 }}>
                {s}
                {i === 1 ? <T size={12} color={colors.amberText}>{'  '}In review</T> : null}
              </T>
            </View>
          ))}
        </View>

        <Pressable onPress={() => Linking.openURL('tel:1800360911')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 28, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface2 }}>
          <PhoneCall size={18} color={colors.teal} />
          <View style={{ flex: 1 }}>
            <T w="bold" size={14}>
              Partner support
            </T>
            <T size={12} color={colors.muted}>
              1800 360 911 · 8 AM to 10 PM
            </T>
          </View>
        </Pressable>

        <T w="bold" size={13} color={colors.teal} center style={{ marginTop: 28 }} onPress={approve}>
          Demo: approve now
        </T>
      </ScrollView>
    </View>
  );
}

/* ---------------------------------------------------------------- Welcome */

export function WelcomeScreen() {
  const nav = useNavigation<any>();
  const { session, vendorProfile, caretakerProfile } = usePartnerStore();
  const isVendor = session.role === 'vendor';
  const tint = roleTint(session.role);
  return (
    <View style={{ flex: 1, backgroundColor: colors.white, padding: 24, justifyContent: 'center' }}>
      <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: tint.bg, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
        <CheckCircle2 size={40} color={tint.fg} />
      </View>
      <T w="extrabold" size={24} center style={{ marginTop: 20 }}>
        You’re approved
      </T>
      <T size={14} color={colors.muted} center lh={21} style={{ marginTop: 8 }}>
        {isVendor
          ? `${vendorProfile.storeName} is now live. Orders from customers within ${vendorProfile.deliveryRadiusKm} km will reach you here.`
          : `Welcome, ${caretakerProfile.fullName.split(' ')[0]}. Booking requests that match your availability will reach you here.`}
      </T>
      <Button
        title={isVendor ? 'Go to orders' : 'Go to today'}
        onPress={() => nav.reset({ index: 0, routes: [{ name: isVendor ? 'VendorTabs' : 'CaretakerTabs' }] })}
        style={{ marginTop: 32 }}
      />
    </View>
  );
}
