import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Plus } from 'lucide-react-native';
import T from './T';
import { Avatar } from './ui';
import { colors, radius } from '../theme';
import { useStore } from '../store/AppStore';

/** "Who is this for?" chips: the account holder plus saved family members. */
export function PatientPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const { user, family } = useStore();
  const nav = useNavigation<any>();
  const people = [{ id: 'self', name: user?.name || 'You', relation: 'Self' }, ...family];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
      {people.map((p) => {
        const label = p.relation === 'Self' ? 'Self' : p.name;
        const on = value === label;
        return (
          <Pressable
            key={p.id}
            onPress={() => onChange(label)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingLeft: 6,
              paddingRight: 14,
              height: 46,
              borderRadius: radius.pill,
              borderWidth: on ? 1.5 : 1,
              borderColor: on ? colors.teal : colors.lineStrong,
              backgroundColor: on ? colors.tealTint : colors.white,
            }}>
            <Avatar name={p.name} size={32} />
            <View>
              <T w="bold" size={13}>
                {p.relation === 'Self' ? 'Myself' : p.name.split(' ')[0]}
              </T>
              <T size={11} color={colors.muted}>
                {p.relation}
              </T>
            </View>
          </Pressable>
        );
      })}
      <Pressable
        onPress={() => nav.navigate('MemberForm', {})}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 14,
          height: 46,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: colors.lineStrong,
        }}>
        <Plus size={16} color={colors.teal} />
        <T w="bold" size={13} color={colors.teal}>
          Add
        </T>
      </Pressable>
    </ScrollView>
  );
}

/** Selected address with a "Change" link into the address book. */
export function AddressSummary() {
  const { addresses, addressId } = useStore();
  const nav = useNavigation<any>();
  const a = addresses.find((x) => x.id === addressId) ?? addresses[0];
  return (
    <Pressable
      onPress={() => nav.navigate('Addresses', { select: true })}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white }}>
      <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: colors.tealTint, alignItems: 'center', justifyContent: 'center' }}>
        <MapPin size={18} color={colors.teal} />
      </View>
      <View style={{ flex: 1 }}>
        <T w="bold" size={14}>
          {a ? a.label : 'Add an address'}
        </T>
        {a ? (
          <T size={12} color={colors.muted} numberOfLines={1}>
            {a.line}, {a.area}, {a.city}
          </T>
        ) : null}
      </View>
      <T w="bold" size={13} color={colors.teal}>
        Change
      </T>
    </Pressable>
  );
}
