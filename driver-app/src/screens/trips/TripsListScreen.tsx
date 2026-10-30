import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ambulance, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { AppBar, Card, Chip, Badge } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';
import { rupees } from '../../utils/format';

export default function TripsListScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { trips } = useDriverStore();
  const [filter, setFilter] = useState<'All' | 'Today' | 'Week'>('All');

  const filteredTrips = trips.filter((t) => {
    if (filter === 'Today') return t.date.includes('Today');
    if (filter === 'Week') return true;
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: colors.white,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
        }}>
        <T w="extrabold" size={20}>
          Trip History
        </T>
        <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
          {trips.length} Emergency dispatches recorded
        </T>

        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          {(['All', 'Today', 'Week'] as const).map((f) => (
            <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {filteredTrips.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => nav.navigate('TripDetail', { trip: item })}
            style={({ pressed }) => [
              {
                backgroundColor: colors.white,
                borderRadius: radius.lg,
                padding: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.line,
                opacity: pressed ? 0.75 : 1,
              },
            ]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ambulance size={16} color={colors.teal} />
                <T w="bold" size={14}>
                  {item.bookingCode}
                </T>
              </View>
              <T w="extrabold" size={15} color={colors.teal}>
                {rupees(item.driverShare)}
              </T>
            </View>

            <T w="semibold" size={14} color={colors.ink}>
              {item.patientName}
            </T>
            <T size={12} color={colors.muted} numberOfLines={1} style={{ marginTop: 2 }}>
              To: {item.destination}
            </T>

            <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 10 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <T size={11} color={colors.muted}>
                {item.date} · {item.distanceKm} km · {item.paymentMode}
              </T>
              <Badge label="Completed" variant="success" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

