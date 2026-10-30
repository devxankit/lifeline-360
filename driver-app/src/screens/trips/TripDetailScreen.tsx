import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MapPin, Building2, CheckCircle2, Shield, Calendar, DollarSign, Clock } from 'lucide-react-native';
import { AppBar, Card, Button } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { rupees } from '../../utils/format';

export default function TripDetailScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const trip = route.params?.trip;

  if (!trip) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title={`Trip ${trip.bookingCode}`} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: safeBottom + 24 }}>
        {/* Status header */}
        <Card style={{ backgroundColor: colors.greenSoft, borderColor: colors.green, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={20} color={colors.green} />
            <View>
              <T w="bold" size={15} color={colors.greenText}>
                Trip Completed Successfully
              </T>
              <T size={12} color={colors.greenText} style={{ marginTop: 2 }}>
                {trip.date} · Net Payout: {rupees(trip.driverShare)}
              </T>
            </View>
          </View>
        </Card>

        {/* Patient and route */}
        <Card style={{ marginBottom: 16 }}>
          <T w="bold" size={15} style={{ marginBottom: 12 }}>
            Emergency Route Details
          </T>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            <MapPin size={18} color={colors.teal} />
            <View style={{ flex: 1 }}>
              <T size={11} color={colors.muted} w="bold">
                PICKUP POINT
              </T>
              <T size={13} color={colors.ink} style={{ marginTop: 2 }}>
                {trip.pickup}
              </T>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Building2 size={18} color={colors.red} />
            <View style={{ flex: 1 }}>
              <T size={11} color={colors.muted} w="bold">
                DESTINATION HOSPITAL
              </T>
              <T size={13} color={colors.ink} style={{ marginTop: 2 }}>
                {trip.destination}
              </T>
            </View>
          </View>
        </Card>

        {/* Fare & settlement */}
        <Card style={{ marginBottom: 20 }}>
          <T w="bold" size={15} style={{ marginBottom: 12 }}>
            Settlement Summary
          </T>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T size={13} color={colors.muted}>
              Gross Patient Fare
            </T>
            <T size={13} color={colors.ink}>
              {rupees(trip.fare)}
            </T>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T size={13} color={colors.muted}>
              Platform Commission (20%)
            </T>
            <T size={13} color={colors.red}>
              − {rupees(trip.fare - trip.driverShare)}
            </T>
          </View>
          <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T w="extrabold" size={15}>
              Net Driver Earnings
            </T>
            <T w="extrabold" size={16} color={colors.teal}>
              {rupees(trip.driverShare)}
            </T>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T size={12} color={colors.muted}>
              Payment Mode
            </T>
            <T w="bold" size={12} color={colors.ink}>
              {trip.paymentMode} (Settled)
            </T>
          </View>
        </Card>

        <Button
          title="Back to Trip History"
          variant="outline"
          onPress={() => nav.goBack()}
        />
      </ScrollView>
    </View>
  );
}

