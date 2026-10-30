import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Rect } from 'react-native-svg';
import { Check, Clock, FlaskConical, Plus, Stethoscope } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, Avatar, BottomBar, Button, ListRow, RadioDot, Section, Toggle } from '../components/ui';
import { Fade, LifelineMark } from '../components/brand';
import { colors, radius } from '../theme';
import { images, membershipBenefits, membershipPlans } from '../data/catalog';
import { useStore } from '../store/AppStore';

const BENEFIT_ICON: Record<string, { icon: React.ReactNode; bg: string }> = {
  consult: { icon: <Stethoscope size={18} color={colors.teal} />, bg: colors.tealTint },
  lab: { icon: <FlaskConical size={18} color={colors.sky} />, bg: colors.skySoft },
  priority: { icon: <Clock size={18} color={colors.red} />, bg: colors.redSoft },
};

/** Static QR-style mark for the card; the real code is issued by the backend. */
function QrMark({ size = 46 }: { size?: number }) {
  const cells = [
    [8, 0], [10, 1], [9, 3], [12, 4], [8, 6], [0, 8], [3, 8], [8, 8], [13, 8], [16, 8], [18, 8], [1, 10], [5, 10], [10, 10], [15, 11], [19, 10],
    [4, 12], [8, 12], [13, 13], [17, 13], [9, 15], [14, 15], [19, 15], [8, 17], [11, 17], [17, 17], [19, 18], [10, 19], [14, 19],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 21 21">
      {[[0, 0], [14, 0], [0, 14]].map(([x, y]) => (
        <React.Fragment key={`${x}${y}`}>
          <Rect x={x} y={y} width={7} height={7} fill={colors.ink} />
          <Rect x={x + 1} y={y + 1} width={5} height={5} fill={colors.white} />
          <Rect x={x + 2} y={y + 2} width={3} height={3} fill={colors.ink} />
        </React.Fragment>
      ))}
      {cells.map(([x, y]) => (
        <Rect key={`${x}-${y}`} x={x} y={y} width={2} height={1.4} fill={colors.ink} />
      ))}
    </Svg>
  );
}

export function MembershipScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { membership, user, family, updateMembership } = useStore();

  if (!membership)
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={{ height: 300 + insets.top, backgroundColor: '#FFF0C7' }}>
            <Image source={images.bannerFamily} style={{ position: 'absolute', right: 0, top: 0, width: '100%', height: '100%' }} resizeMode="cover" />
            <Fade color="#FFF6DA" direction="vertical" fromOpacity={0} toOpacity={1} stops={[0.35, 0.95]} />
            <View style={{ position: 'absolute', left: 18, right: 18, bottom: 18, gap: 6 }}>
              <T w="extrabold" size={26} color={colors.tealDeep} lh={31}>One membership for the whole family</T>
              <T size={14} color={colors.ink2} lh={20}>Consultation benefits, lab discounts and priority care across Lifeline 360.</T>
            </View>
          </View>
          <Section title="What you get">
            {membershipBenefits.map((b, i) => (
              <ListRow key={b.id} icon={BENEFIT_ICON[b.id].icon} iconBg={BENEFIT_ICON[b.id].bg} title={b.title} subtitle={b.text} last={i === membershipBenefits.length - 1} right={<Check size={18} color={colors.green} />} />
            ))}
            <ListRow icon={<Plus size={18} color={colors.amberText} />} iconBg={colors.amberSoft} title="Add up to 4 family members" subtitle="Everyone shares the same benefits" last right={<Check size={18} color={colors.green} />} />
          </Section>
          <View style={{ padding: 16 }}>
            <Button title="See plans" onPress={() => navigation.navigate('MembershipPlans')} />
            <T size={12} color={colors.muted} center style={{ marginTop: 10 }}>Final benefit list and prices are announced at launch.</T>
          </View>
        </ScrollView>
      </View>
    );

  const covered = [{ id: 'self', name: user?.name || 'You', relation: 'You' }, ...family];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <View style={{ height: 56, justifyContent: 'center', paddingHorizontal: 16 }}>
          <T w="bold" size={18}>Membership</T>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 24 }}>
        <View style={{ backgroundColor: colors.white, padding: 16, gap: 14 }}>
          <View style={{ height: 208, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.tealDeep, padding: 18, justifyContent: 'space-between' }}>
            <Fade color="#128078" to="#0B3B3A" fromOpacity={1} toOpacity={1} />
            <View style={{ position: 'absolute', right: -60, top: -80 }}>
              <Svg width={240} height={240}><Circle cx={120} cy={120} r={120} fill="#FFFFFF" opacity={0.06} /></Svg>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <LifelineMark size={26} />
                <T w="bold" size={14} color={colors.white}>Lifeline 360</T>
              </View>
              <T w="bold" size={12} color="#F5CB4E">{membership.plan === 'annual' ? 'ANNUAL PLAN' : 'MONTHLY PLAN'}</T>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View style={{ gap: 12 }}>
                <View>
                  <T size={11} color="#AEE3DA">Member</T>
                  <T w="bold" size={18} color={colors.white}>{user?.name || 'Member'}</T>
                </View>
                <View style={{ flexDirection: 'row', gap: 22 }}>
                  <View>
                    <T size={11} color="#AEE3DA">Member ID</T>
                    <T w="bold" size={13} color={colors.white} style={{ letterSpacing: 0.8 }}>{membership.memberId}</T>
                  </View>
                  <View>
                    <T size={11} color="#AEE3DA">Valid till</T>
                    <T w="bold" size={13} color={colors.white}>{membership.validTill}</T>
                  </View>
                </View>
              </View>
              <View style={{ width: 58, height: 58, borderRadius: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
                <QrMark />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: radius.md, backgroundColor: colors.greenSoft }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green }} />
            <T w="bold" size={13} color="#0E4A31">Active</T>
            <T size={12} color={colors.greenText} style={{ marginLeft: 'auto' }}>Show this card at partner counters</T>
          </View>
        </View>

        <Section title="Members covered" action="+ Add member" onAction={() => navigation.navigate('MemberForm', {})}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {covered.map((m) => (
              <View key={m.id} style={{ alignItems: 'center', gap: 4, width: 60 }}>
                <Avatar name={m.name} size={46} />
                <T size={11} color={colors.ink2} numberOfLines={1}>{m.relation}</T>
              </View>
            ))}
          </ScrollView>
        </Section>

        <Section>
          {membershipBenefits.map((b) => (
            <ListRow key={b.id} icon={BENEFIT_ICON[b.id].icon} iconBg={BENEFIT_ICON[b.id].bg} title={b.title} subtitle={b.text} />
          ))}
          <ListRow title="Auto-renew" subtitle={membership.autoRenew ? `Renews on ${membership.validTill}` : `Expires on ${membership.validTill}. We’ll remind you first.`} last right={<Toggle label="Auto-renew" value={membership.autoRenew} onChange={(v) => updateMembership({ autoRenew: v })} />} />
        </Section>

        <Section>
          <ListRow title="Compare plans" onPress={() => navigation.navigate('MembershipPlans')} />
          <ListRow title="Membership history" subtitle={`Started ${new Date(membership.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`} last onPress={() => navigation.navigate('Bookings')} />
        </Section>
      </ScrollView>
    </View>
  );
}

export function MembershipPlansScreen({ navigation }: any) {
  const { membership } = useStore();
  const [plan, setPlan] = useState<'monthly' | 'annual'>(membership?.plan ?? 'annual');
  const p = membershipPlans.find((x) => x.id === plan)!;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Choose a plan" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {membershipPlans.map((x) => {
          const on = x.id === plan;
          return (
            <Pressable key={x.id} onPress={() => setPlan(x.id as 'monthly' | 'annual')} style={{ borderRadius: radius.lg, borderWidth: on ? 2 : 1, borderColor: on ? colors.amber : colors.lineStrong, backgroundColor: on ? colors.amberSoft : colors.white, padding: 16, gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <RadioDot on={on} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <T w="extrabold" size={17}>{x.name}</T>
                    {x.featured ? <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: colors.teal }}><T w="bold" size={10} color={colors.white}>BEST VALUE</T></View> : null}
                  </View>
                  <T size={12} color={colors.ink2}>{x.note}</T>
                </View>
                <T w="bold" size={13} color={colors.amberText}>Price at launch</T>
              </View>
            </Pressable>
          );
        })}
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 16, gap: 10 }}>
          <T w="bold" size={15}>Every plan includes</T>
          {['Digital membership card', ...membershipBenefits.map((b) => b.title), 'Up to 4 family members', 'Renewal reminders before expiry'].map((t) => (
            <View key={t} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Check size={16} color={colors.green} strokeWidth={3} />
              <T size={14}>{t}</T>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomBar>
        <Button
          title={membership ? 'Switch plan' : `Continue with ${p.name.toLowerCase()}`}
          style={{ flex: 1 }}
          onPress={() =>
            navigation.navigate('Checkout', {
              idPrefix: 'MB',
              draft: { service: 'membership', title: `Lifeline ${p.name} membership`, subtitle: 'Digital card · family benefits', when: 'Starts today', status: 'Active', amount: null, meta: { plan } },
              lines: [],
              total: null,
            })
          }
        />
      </BottomBar>
    </View>
  );
}
