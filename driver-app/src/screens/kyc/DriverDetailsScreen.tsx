import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { User, Phone, MapPin, Mail, AlertCircle } from 'lucide-react-native';
import { AppBar, Button, Card, Field } from '../../components/ui';
import T from '../../components/T';
import { colors } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function DriverDetailsScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { profile, updateProfile } = useDriverStore();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [exp, setExp] = useState(profile.experienceYears.toString());
  const [address, setAddress] = useState('');

  const handleNext = () => {
    updateProfile({
      name,
      email,
      experienceYears: parseInt(exp, 10) || 5,
    });
    nav.navigate('VehicleDetails');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Personal Details (Step 1/3)" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: safeBottom + 24 }}>
        <T w="extrabold" size={20} style={{ marginBottom: 4 }}>
          Driver Information
        </T>
        <T size={13} color={colors.muted} style={{ marginBottom: 20 }}>
          Enter your registered legal name and paramedic credentials.
        </T>

        <Field label="Full Legal Name" value={name} onChangeText={setName} />
        <Field label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field
          label="Ambulance Driving Experience (Years)"
          value={exp}
          onChangeText={setExp}
          keyboardType="numeric"
        />
        <Field label="Residential City / Base Station" value={address} onChangeText={setAddress} />

        <View style={{ height: 16 }} />
        <Button title="Continue to Vehicle Details" onPress={handleNext} />
      </ScrollView>
    </View>
  );
}

