import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera, UploadCloud, CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { AppBar, Button, Card, Field } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function DocumentUploadScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { docId, title } = route.params || { docId: 'dl', title: 'Driving Licence' };
  const { updateDocumentStatus } = useDriverStore();

  const [docNumber, setDocNumber] = useState('DL-0420210088921');
  const [expiry, setExpiry] = useState('14/10/2029');
  const [uploaded, setUploaded] = useState(true);

  const handleSave = () => {
    updateDocumentStatus(docId, 'pending');
    Alert.alert('Document uploaded', 'Submitted for verification. Our fleet team usually checks documents within 24 hours.', [
      { text: 'OK', onPress: () => nav.goBack() },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title={title} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: safeBottom + 24 }}>
        <T w="extrabold" size={20} style={{ marginBottom: 4 }}>
          Upload Document Photo
        </T>
        <T size={13} color={colors.muted} style={{ marginBottom: 20 }}>
          Make sure document text is clearly visible and within the frame.
        </T>

        <Card
          style={{
            height: 180,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surface2,
            borderStyle: 'dashed',
            borderColor: colors.teal,
            marginBottom: 20,
          }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.tealSoft,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            <Camera size={28} color={colors.teal} />
          </View>
          <T w="bold" size={14} color={colors.ink}>
            Front of {title}
          </T>
          <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
            JPEG, PNG or PDF (Max 5MB)
          </T>
        </Card>

        <Field label="Document Identifier / Serial Number" value={docNumber} onChangeText={setDocNumber} />
        <Field label="Expiry Date (DD/MM/YYYY)" value={expiry} onChangeText={setExpiry} />

        <View style={{ height: 16 }} />
        <Button title="Save & Verify Document" onPress={handleSave} />
      </ScrollView>
    </View>
  );
}

