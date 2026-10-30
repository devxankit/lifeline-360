import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, Image, ImageSourcePropType, Pressable, ScrollView, StatusBar, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Bell, Calendar, ChevronDown, ChevronRight, MapPin, Mic, Search, X } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, Avatar, EmptyState, ServiceBadge } from '../components/ui';
import { DuoIcon, Fade, LifelineMark, ProductThumb } from '../components/brand';
import { colors, radius, service, shadow } from '../theme';
import { doctors, images, labItems, medicines, medTint } from '../data/catalog';
import { useStore } from '../store/AppStore';
import { firstName, greeting, rupees, timeAgo } from '../utils/format';

const { width: W } = Dimensions.get('window');

/* ------------------------------------------------------------------ Home */

export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, addresses, addressId, bookings, notices } = useStore();
  const address = addresses.find((a) => a.id === addressId) ?? addresses[0];
  const unread = notices.filter((n) => !n.read).length;
  const upcoming = bookings.find((b) => b.service === 'doctor' && b.status === 'Confirmed');
  const upcomingDoc = upcoming ? doctors.find((d) => d.id === upcoming.meta.doctorId) : undefined;
  const activeOrder = bookings.find((b) => b.service === 'medicine' && !['Delivered', 'Cancelled'].includes(b.status));
  const readyReport = bookings.find((b) => b.service === 'lab' && b.status === 'Report ready');

  const banners = [
    { key: 'hero', img: images.heroCare, tint: '#CDEBE4', title: 'Care made', accent: 'simple', text: 'Doctors, medicines and lab tests, right at your doorstep.', cta: 'Explore services', go: () => navigation.navigate('FindDoctor', {}) },
    { key: 'member', img: images.bannerFamily, tint: '#FFF0C7', title: 'One membership,', accent: 'whole family', text: 'Consultation, lab and priority benefits together.', cta: 'View plans', go: () => navigation.navigate('MembershipPlans') },
    { key: 'lab', img: images.bannerLab, tint: '#DCEAF8', title: 'Lab tests', accent: 'at home', text: 'Sample pickup from home, digital reports in the app.', cta: 'Book a test', go: () => navigation.navigate('LabHome') },
  ];
  const [slide, setSlide] = useState(0);
  const cardW = W - 36;

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F8F7' }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 360 }}>
          <Fade color="#DDF1EC" to="#F6F8F7" direction="vertical" fromOpacity={1} toOpacity={1} />
        </View>

        <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 18 }}>
          {/* Brand bar */}
          <View style={{ height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <LifelineMark size={30} />
              <View>
                <T w="extrabold" size={17}>
                  Lifeline <T w="extrabold" size={17} color={colors.teal}>360</T>
                </T>
                <T w="bold" size={9} color={colors.ink2} style={{ letterSpacing: 2.2 }}>
                  HEALTHCARE
                </T>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Pressable
                accessibilityLabel={`Notifications, ${unread} unread`}
                onPress={() => navigation.navigate('Notifications')}
                style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadow.card }}>
                <Bell size={20} color={colors.ink} />
                {unread ? <View style={{ position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.red, borderWidth: 2, borderColor: colors.white }} /> : null}
              </Pressable>
              <Pressable onPress={() => navigation.navigate('Profile')} accessibilityLabel="Profile">
                <View style={{ borderWidth: 2, borderColor: colors.white, borderRadius: 22 }}>
                  <Avatar name={user?.name || 'You'} size={40} tint={{ bg: colors.teal, fg: colors.white }} />
                </View>
              </Pressable>
            </View>
          </View>

          {/* Greeting */}
          <T w="extrabold" size={24} style={{ marginTop: 16 }}>
            {greeting()}, {firstName(user?.name)}
          </T>
          <Pressable onPress={() => navigation.navigate('Addresses', { select: true })} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, alignSelf: 'flex-start' }}>
            <MapPin size={15} color={colors.teal} />
            <T w="semibold" size={13} color={colors.ink2}>
              {address ? `${address.area}, ${address.city}` : 'Add your address'}
            </T>
            <ChevronDown size={14} color={colors.ink2} />
          </Pressable>

          {/* Search */}
          <Pressable
            onPress={() => navigation.navigate('Search')}
            style={{ marginTop: 14, height: 50, borderRadius: 14, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 6, gap: 10, ...shadow.raised }}>
            <Search size={19} color={colors.muted} />
            <T size={14} color={colors.faint} style={{ flex: 1 }}>
              Search doctors, medicines or tests
            </T>
            <View style={{ width: 1, height: 22, backgroundColor: colors.line }} />
            <View style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}>
              <Mic size={19} color={colors.teal} />
            </View>
          </Pressable>
        </View>

        {/* Hero carousel */}
        <FlatList
          data={banners}
          horizontal
          snapToInterval={cardW + 10}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 10, marginTop: 16 }}
          keyExtractor={(b) => b.key}
          onMomentumScrollEnd={(e) => setSlide(Math.round(e.nativeEvent.contentOffset.x / (cardW + 10)))}
          renderItem={({ item }) => (
            <Pressable onPress={item.go} style={{ width: cardW, height: 146, borderRadius: 20, overflow: 'hidden', backgroundColor: item.tint }}>
              <Image source={item.img} style={{ position: 'absolute', right: 0, top: 0, width: '64%', height: '100%' }} resizeMode="cover" />
              <Fade color={item.tint} stops={[0.38, 0.74]} />
              <View style={{ position: 'absolute', left: 16, top: 16, bottom: 16, width: 176, justifyContent: 'space-between' }}>
                <View style={{ gap: 5 }}>
                  <T w="extrabold" size={21} color={colors.tealDeep} lh={24}>
                    {item.title} <T w="extrabold" size={21} color={colors.teal}>{item.accent}</T>
                  </T>
                  <T size={12} color="#2F4D4B" lh={17}>
                    {item.text}
                  </T>
                </View>
                <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, height: 34, paddingHorizontal: 12, borderRadius: 10, backgroundColor: colors.teal }}>
                  <T w="bold" size={12} color={colors.white}>
                    {item.cta}
                  </T>
                  <ArrowRight size={13} color={colors.white} strokeWidth={2.6} />
                </View>
              </View>
            </Pressable>
          )}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 8 }}>
          {banners.map((b, k) => (
            <View key={b.key} style={{ width: k === slide ? 16 : 5, height: 5, borderRadius: 3, backgroundColor: k === slide ? colors.teal : '#C5CFCC' }} />
          ))}
        </View>

        <View style={{ paddingHorizontal: 18 }}>
          {/* Main services */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
            <PhotoService title="Consult a doctor" sub="Clinic or video" img={images.svcDoctor} k="doctor" onPress={() => navigation.navigate('FindDoctor', {})} />
            <PhotoService title="Order medicines" sub="Upload prescription" img={images.svcMeds} k="medicine" onPress={() => navigation.navigate('MedicineStore')} />
            <PhotoService title="Lab tests" sub="Sample pickup at home" img={images.svcLab} k="lab" onPress={() => navigation.navigate('LabHome')} />
            <PhotoService title="Nursing care" sub="Caretakers at home" img={images.svcNurse} k="nursing" onPress={() => navigation.navigate('NursingHome')} />
          </View>

          {/* Quick services */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <QuickTile label="Ambulance" icon="ambulance" emergency onPress={() => navigation.navigate('AmbulanceBook')} />
            <QuickTile label="Blood bank" icon="blood" onPress={() => navigation.navigate('BloodRequest')} />
            <QuickTile label="Reports" icon="report" onPress={() => navigation.navigate('Health')} />
            <QuickTile label="Membership" icon="membership" onPress={() => navigation.navigate('Membership')} />
          </View>

          {/* Upcoming */}
          {upcoming && upcomingDoc ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
                <T w="bold" size={16}>
                  Upcoming appointment
                </T>
                <Pressable onPress={() => navigation.navigate('Bookings')}>
                  <T w="bold" size={13} color={colors.teal}>
                    View all
                  </T>
                </Pressable>
              </View>
              <Pressable
                onPress={() => navigation.navigate('AppointmentDetail', { id: upcoming.id })}
                style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E6EBE9' }}>
                <Avatar source={upcomingDoc.photo} name={upcomingDoc.name} size={58} rounded="md" />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Calendar size={13} color={colors.teal} strokeWidth={2.4} />
                    <T w="bold" size={12} color={colors.teal}>
                      {upcoming.when}
                    </T>
                  </View>
                  <T w="bold" size={15} style={{ marginTop: 3 }}>
                    {upcomingDoc.name}
                  </T>
                  <T size={12} color={colors.muted} numberOfLines={1} style={{ marginTop: 2 }}>
                    {upcomingDoc.role} · {upcoming.meta.mode === 'video' ? 'Video consultation' : upcomingDoc.clinic}
                  </T>
                </View>
                <View style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E6EBE9', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={16} color={colors.ink} />
                </View>
              </Pressable>
            </>
          ) : null}

          {/* Activity */}
          {activeOrder || readyReport ? (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              {activeOrder ? (
                <Pressable onPress={() => navigation.navigate('OrderTracking', { id: activeOrder.id })} style={{ flex: 1, borderRadius: 18, backgroundColor: '#EAF7F0', padding: 14, gap: 8 }}>
                  <T w="bold" size={13}>
                    Medicine order
                  </T>
                  <T w="semibold" size={12} color={colors.greenText}>
                    {activeOrder.status}
                  </T>
                  <View style={{ height: 5, borderRadius: 3, backgroundColor: '#CDEBDB' }}>
                    <View style={{ width: `${Math.min(100, ((activeOrder.meta.step ?? 1) / 4) * 100)}%`, height: 5, borderRadius: 3, backgroundColor: colors.green }} />
                  </View>
                </Pressable>
              ) : null}
              {readyReport ? (
                <Pressable onPress={() => navigation.navigate('ReportView', { id: readyReport.id })} style={{ flex: 1, borderRadius: 18, backgroundColor: '#EAF3FC', padding: 14, gap: 8 }}>
                  <T w="bold" size={13}>
                    {readyReport.title}
                  </T>
                  <T w="semibold" size={12} color={colors.skyText}>
                    Report ready
                  </T>
                  <T w="bold" size={12} color={colors.skyText} style={{ textDecorationLine: 'underline' }}>
                    View report
                  </T>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {/* Popular checkups */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
            <T w="bold" size={16}>
              Popular health checkups
            </T>
            <Pressable onPress={() => navigation.navigate('LabHome')}>
              <T w="bold" size={13} color={colors.teal}>
                See all
              </T>
            </Pressable>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18, gap: 10, marginTop: 10 }}>
          {labItems
            .filter((l) => l.kind === 'package')
            .map((p) => (
              <Pressable key={p.id} onPress={() => navigation.navigate('LabTestDetail', { id: p.id })} style={{ width: 200, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E6EBE9', padding: 12, gap: 6 }}>
                <T w="bold" size={14}>
                  {p.name}
                </T>
                <T size={12} color={colors.muted}>
                  {p.tests} tests · {p.tat}
                </T>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                  <T w="extrabold" size={16}>
                    {rupees(p.price)}
                  </T>
                  <T size={12} color={colors.muted} style={{ textDecorationLine: 'line-through' }}>
                    {rupees(p.mrp)}
                  </T>
                </View>
              </Pressable>
            ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function PhotoService({ title, sub, img, k, onPress }: { title: string; sub: string; img: ImageSourcePropType; k: 'doctor' | 'medicine' | 'lab' | 'nursing'; onPress: () => void }) {
  const s = service[k];
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title} style={({ pressed }) => ({ width: (W - 46) / 2, height: 100, borderRadius: 16, overflow: 'hidden', backgroundColor: s.bg, opacity: pressed ? 0.9 : 1 })}>
      <Image source={img} style={{ position: 'absolute', right: 0, top: 0, width: '54%', height: '100%' }} resizeMode="cover" />
      <Fade color={s.bg} stops={[0.42, 0.76]} />
      <View style={{ position: 'absolute', left: 12, top: 12, bottom: 12, width: 96, justifyContent: 'space-between' }}>
        <View style={{ gap: 3 }}>
          <T w="extrabold" size={14} color={s.text} lh={17}>
            {title}
          </T>
          <T w="semibold" size={11} color={s.text} style={{ opacity: 0.8 }} lh={14}>
            {sub}
          </T>
        </View>
        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: s.fg, alignItems: 'center', justifyContent: 'center' }}>
          <ArrowRight size={12} color={colors.white} strokeWidth={3} />
        </View>
      </View>
    </Pressable>
  );
}

function QuickTile({ label, icon, emergency, onPress }: { label: string; icon: 'ambulance' | 'blood' | 'report' | 'membership'; emergency?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flex: 1,
        height: 78,
        borderRadius: 16,
        backgroundColor: emergency ? '#FFF1F1' : colors.white,
        borderWidth: 1,
        borderColor: emergency ? '#F7D0D2' : '#E6EBE9',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        opacity: pressed ? 0.85 : 1,
      })}>
      {emergency ? (
        <View style={{ position: 'absolute', top: -7, right: -3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 99, backgroundColor: colors.red, borderWidth: 2, borderColor: '#F6F8F7' }}>
          <T w="extrabold" size={9.5} color={colors.white}>
            24/7
          </T>
        </View>
      ) : null}
      <DuoIcon name={icon} size={30} />
      <T w={emergency ? 'bold' : 'semibold'} size={11.5} color={emergency ? colors.redText : colors.ink}>
        {label}
      </T>
    </Pressable>
  );
}

/* --------------------------------------------------------- Notifications */

export function NotificationsScreen() {
  const { notices, markNoticesRead } = useStore();
  React.useEffect(() => {
    const t = setTimeout(markNoticesRead, 1200);
    return () => clearTimeout(t);
  }, [markNoticesRead]);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Notifications" />
      {notices.length === 0 ? (
        <EmptyState icon={<Bell size={30} color={colors.teal} />} title="You’re all caught up" text="Booking updates, reports and reminders will show up here." />
      ) : (
        <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
          {notices.map((n) => (
            <View key={n.id} style={{ flexDirection: 'row', gap: 12, padding: 16, backgroundColor: n.read ? colors.white : '#F1FAF8', borderBottomWidth: 1, borderBottomColor: colors.line }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, marginTop: 6, backgroundColor: n.read ? 'transparent' : colors.teal }} />
              <View style={{ flex: 1, gap: 3 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <T w="bold" size={14} style={{ flex: 1 }}>
                    {n.title}
                  </T>
                  <T size={11} color={colors.muted}>
                    {timeAgo(n.at)}
                  </T>
                </View>
                <T size={13} color={colors.ink2} lh={18}>
                  {n.text}
                </T>
                {n.service ? <View style={{ marginTop: 4 }}><ServiceBadge kind={n.service} /></View> : null}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/* ---------------------------------------------------------------- Search */

export function SearchScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return null;
    return {
      doctors: doctors.filter((d) => (d.name + d.role + d.clinic).toLowerCase().includes(s)),
      meds: medicines.filter((m) => (m.name + m.maker).toLowerCase().includes(s)),
      labs: labItems.filter((l) => l.name.toLowerCase().includes(s)),
    };
  }, [q]);
  const total = results ? results.doctors.length + results.meds.length + results.labs.length : 0;
  const suggestions = ['Cardiologist', 'Dolo 650', 'Full body checkup', 'Thyroid', 'Pediatrician', 'Vitamin D'];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 12, paddingBottom: 10, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Back">
          <X size={22} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1, height: 46, borderRadius: radius.md, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
          <Search size={18} color={colors.muted} />
          <TextInput
            autoFocus
            value={q}
            onChangeText={setQ}
            placeholder="Doctors, medicines, lab tests"
            placeholderTextColor={colors.faint}
            style={{ flex: 1, fontFamily: 'PlusJakartaSans-Medium', fontSize: 15, color: colors.ink }}
            returnKeyType="search"
          />
        </View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 18 }}>
        {!results ? (
          <View style={{ gap: 12 }}>
            <T w="bold" size={14} color={colors.ink2}>
              Popular searches
            </T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {suggestions.map((s) => (
                <Pressable key={s} onPress={() => setQ(s)} style={{ paddingHorizontal: 14, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.white, justifyContent: 'center' }}>
                  <T w="semibold" size={13}>
                    {s}
                  </T>
                </Pressable>
              ))}
            </View>
          </View>
        ) : total === 0 ? (
          <EmptyState icon={<Search size={28} color={colors.teal} />} title="No matches" text={`We couldn’t find anything for “${q}”. Try a doctor name, specialty, medicine or test.`} />
        ) : (
          <>
            {results.doctors.length ? (
              <ResultGroup title="Doctors">
                {results.doctors.map((d) => (
                  <Pressable key={d.id} onPress={() => navigation.navigate('DoctorProfile', { id: d.id })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
                    <Avatar source={d.photo} name={d.name} size={44} rounded="md" />
                    <View style={{ flex: 1 }}>
                      <T w="bold" size={14}>{d.name}</T>
                      <T size={12} color={colors.muted}>{d.role} · {d.area}</T>
                    </View>
                    <ChevronRight size={18} color={colors.faint} />
                  </Pressable>
                ))}
              </ResultGroup>
            ) : null}
            {results.meds.length ? (
              <ResultGroup title="Medicines">
                {results.meds.map((m) => (
                  <Pressable key={m.id} onPress={() => navigation.navigate('ProductDetail', { id: m.id })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
                    <ProductThumb tint={medTint(m.category)} size={44} />
                    <View style={{ flex: 1 }}>
                      <T w="bold" size={14}>{m.name}</T>
                      <T size={12} color={colors.muted}>{m.pack}</T>
                    </View>
                    <T w="bold" size={14}>{rupees(m.price)}</T>
                  </Pressable>
                ))}
              </ResultGroup>
            ) : null}
            {results.labs.length ? (
              <ResultGroup title="Lab tests">
                {results.labs.map((l) => (
                  <Pressable key={l.id} onPress={() => navigation.navigate('LabTestDetail', { id: l.id })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: service.lab.bg, alignItems: 'center', justifyContent: 'center' }}>
                      <DuoIcon name="report" size={26} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <T w="bold" size={14}>{l.name}</T>
                      <T size={12} color={colors.muted}>{l.kind === 'package' ? `${l.tests} tests` : l.sample}</T>
                    </View>
                    <T w="bold" size={14}>{rupees(l.price)}</T>
                  </Pressable>
                ))}
              </ResultGroup>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: colors.line }}>
      <T w="bold" size={12} color={colors.muted} style={{ marginTop: 8, marginBottom: 2, letterSpacing: 0.6 }}>
        {title.toUpperCase()}
      </T>
      {children}
    </View>
  );
}
