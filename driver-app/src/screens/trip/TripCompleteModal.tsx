import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, Star, Check, DollarSign } from 'lucide-react-native';
import { AppBar, Button, Card } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { driverShareOf, fareBreakdown, useDriverStore } from '../../store/DriverStore';
import { rupees } from '../../utils/format';

export default function TripCompleteModal() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { activeTrip, completeTrip } = useDriverStore();
  const req = activeTrip.request;

  const [cashCollected, setCashCollected] = useState(false);
  const [rating, setRating] = useState(5);

  if (!req) return null;

  const totalFare = req.estimatedFare;
  const driverShare = driverShareOf(totalFare);
  const parts = fareBreakdown(totalFare);

  const handleFinish = () => {
    completeTrip(cashCollected, rating);
    nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Trip Summary" onBack={handleFinish} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: safeBottom + 24 }}>
        {/* Celebration Header */}
        <View style={{ alignItems: 'center', marginVertical: 14 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.greenSoft,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            <CheckCircle2 size={38} color={colors.green} />
          </View>
          <T w="extrabold" size={22}>
            Emergency Trip Completed
          </T>
          <T size={13} color={colors.muted} style={{ marginTop: 2 }}>
            Ref: {req.bookingCode} · Delivered safely to {req.hospitalName}
          </T>
        </View>

        {/* Fare Breakdown Card */}
        <Card style={{ backgroundColor: colors.surface2, marginBottom: 16 }}>
          <T w="bold" size={15} style={{ marginBottom: 12 }}>
            Fare Breakdown
          </T>
          <View style={styles.billRow}>
            <T size={13} color={colors.muted}>
              Base Emergency Dispatch
            </T>
            <T size={13} color={colors.ink}>
              {rupees(parts.base)}
            </T>
          </View>
          <View style={styles.billRow}>
            <T size={13} color={colors.muted}>
              Transit Distance ({req.distanceKm + req.hospitalDistanceKm} km)
            </T>
            <T size={13} color={colors.ink}>
              {rupees(parts.distance)}
            </T>
          </View>
          <View style={styles.billRow}>
            <T size={13} color={colors.muted}>
              ALS Equipment & Paramedic Kit
            </T>
            <T size={13} color={colors.ink}>
              {rupees(parts.equipment)}
            </T>
          </View>
          <View style={{ height: 1, backgroundColor: colors.lineStrong, marginVertical: 8 }} />
          <View style={styles.billRow}>
            <T w="extrabold" size={15}>
              Total Fare
            </T>
            <T w="extrabold" size={16} color={colors.ink}>
              {rupees(totalFare)}
            </T>
          </View>
          <View style={[styles.billRow, { marginTop: 6 }]}>
            <T w="bold" size={14} color={colors.teal}>
              Your Earnings (80%)
            </T>
            <T w="bold" size={16} color={colors.teal}>
              {rupees(driverShare)}
            </T>
          </View>
        </Card>

        {/* Payment Confirmation */}
        <Card style={{ marginBottom: 16 }}>
          <T w="bold" size={14} style={{ marginBottom: 8 }}>
            Payment Method
          </T>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={() => setCashCollected(false)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: radius.md,
                borderWidth: 1.5,
                borderColor: !cashCollected ? colors.teal : colors.lineStrong,
                backgroundColor: !cashCollected ? colors.tealTint : colors.surface2,
                alignItems: 'center',
              }}>
              <T w={!cashCollected ? 'bold' : 'medium'} size={13} color={!cashCollected ? colors.tealDark : colors.ink}>
                Online (App)
              </T>
              <T size={11} color={colors.muted} style={{ marginTop: 2 }}>
                Auto-settled to wallet
              </T>
            </Pressable>

            <Pressable
              onPress={() => setCashCollected(true)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: radius.md,
                borderWidth: 1.5,
                borderColor: cashCollected ? colors.teal : colors.lineStrong,
                backgroundColor: cashCollected ? colors.tealTint : colors.surface2,
                alignItems: 'center',
              }}>
              <T w={cashCollected ? 'bold' : 'medium'} size={13} color={cashCollected ? colors.tealDark : colors.ink}>
                Cash Collected
              </T>
              <T size={11} color={colors.muted} style={{ marginTop: 2 }}>
                Collected at ER
              </T>
            </Pressable>
          </View>
        </Card>

        {/* Rate Patient Attendant */}
        <Card style={{ alignItems: 'center', marginBottom: 24 }}>
          <T w="bold" size={14} style={{ marginBottom: 4 }}>
            Rate Patient Attendant
          </T>
          <T size={12} color={colors.muted} style={{ marginBottom: 12 }}>
            Was the location accessible and patient ready for boarding?
          </T>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Pressable key={s} onPress={() => setRating(s)} hitSlop={6}>
                <Star
                  size={32}
                  color={s <= rating ? colors.amber : colors.faint}
                  fill={s <= rating ? colors.amber : 'transparent'}
                />
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Complete button */}
        <Button
          title="Done & Return to Duty"
          variant="primary"
          onPress={handleFinish}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
});

