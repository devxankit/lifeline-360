import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TrendingUp,
  CreditCard,
  Award,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { Card, Button, Badge } from '../../components/ui';
import { BarChart, StatTile } from '../../components/driver-ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';
import { WEEKLY_CHART_DATA } from '../../data/sampleData';
import { rupees } from '../../utils/format';

export default function EarningsScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { transactions, trips, todayStats } = useDriverStore();

  // Last seven days ending today: earlier days use the sample history, today is live.
  const chart = WEEKLY_CHART_DATA.map((d, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const isToday = i === 6;
    return {
      label: day.toLocaleDateString('en-IN', { weekday: 'short' }),
      amount: isToday ? todayStats.earningsTotal : d.amount,
      active: isToday,
    };
  });
  const cycleStart = new Date();
  cycleStart.setDate(cycleStart.getDate() - 6);
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const weekTrips = 44 + trips.filter((t) => t.date.startsWith('Today')).length;

  const totalWeek = chart.reduce((acc, d) => acc + d.amount, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: colors.white,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
        }}>
        <T size={12} color={colors.muted}>
          Weekly Net Earnings
        </T>
        <T w="extrabold" size={26} color={colors.teal}>
          {rupees(totalWeek)}
        </T>
        <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
          Cycle: {fmt(cycleStart)} – {fmt(new Date())} · {weekTrips} trips
        </T>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Weekly Bar Chart */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <T w="bold" size={15}>
              Earnings Daily Breakdown
            </T>
            <Badge label="Active Week" variant="info" />
          </View>
          <BarChart data={chart} height={140} />
        </Card>

        {/* Payout Bank Card */}
        <Pressable
          onPress={() => nav.navigate('Payouts')}
          style={({ pressed }) => [
            {
              backgroundColor: colors.navy,
              borderRadius: radius.lg,
              padding: 16,
              marginBottom: 16,
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <CreditCard size={18} color={colors.teal} />
              <T w="bold" size={14} color={colors.white}>
                Bank Direct Payout
              </T>
            </View>
            <ChevronRight size={18} color={colors.navyMuted} />
          </View>
          <T size={12} color={colors.navyMuted}>
            Next automatic transfer: Tuesday, 03 Nov 2026
          </T>
          <T w="bold" size={15} color={colors.white} style={{ marginTop: 6 }}>
            HDFC Bank · A/C •••• 4012
          </T>
        </Pressable>

        {/* Incentives */}
        <Card style={{ backgroundColor: colors.amberSoft, borderColor: colors.amber, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Award size={24} color={colors.amber} />
            <View style={{ flex: 1 }}>
              <T w="bold" size={14} color={colors.amberText}>
                Weekly Fleet Incentive Unlocked!
              </T>
              <T size={12} color={colors.amberText} style={{ marginTop: 2 }}>
                Completed 40+ emergency trips this cycle. ₹1,500 bonus added to your wallet.
              </T>
            </View>
          </View>
        </Card>

        {/* Transactions List */}
        <T w="extrabold" size={16} style={{ marginBottom: 12 }}>
          Recent Transactions
        </T>
        {transactions.map((tx) => (
          <View
            key={tx.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.white,
              padding: 14,
              borderRadius: radius.md,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: colors.line,
            }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: tx.amount > 0 ? colors.greenSoft : colors.surface2,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
              {tx.amount > 0 ? (
                <ArrowDownLeft size={18} color={colors.green} />
              ) : (
                <ArrowUpRight size={18} color={colors.muted} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <T w="semibold" size={14} numberOfLines={1}>
                {tx.title}
              </T>
              <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
                {tx.date}
              </T>
            </View>
            <T w="extrabold" size={14} color={tx.amount > 0 ? colors.greenText : colors.ink}>
              {tx.amount > 0 ? `+ ${rupees(tx.amount)}` : rupees(tx.amount)}
            </T>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

