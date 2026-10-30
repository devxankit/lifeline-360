import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FileText, CheckCircle2, Clock, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { AppBar, Button, Card, Badge } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function DocumentListScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { documents, submitKyc } = useDriverStore();
  const missing = documents.filter((d) => d.status === 'missing' || d.status === 'rejected').length;

  const handleDocPress = (doc: any) => {
    nav.navigate('DocumentUpload', { docId: doc.id, title: doc.title });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="KYC Verification (Step 3/3)" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: safeBottom + 24 }}>
        <T w="extrabold" size={20} style={{ marginBottom: 4 }}>
          Mandatory Fleet Documents
        </T>
        <T size={13} color={colors.muted} style={{ marginBottom: 16 }}>
          All documents must be verified before accepting emergency patient trips.
        </T>

        {documents.map((doc) => {
          const isApproved = doc.status === 'approved';
          const isPending = doc.status === 'pending';

          return (
            <Pressable
              key={doc.id}
              onPress={() => handleDocPress(doc)}
              style={({ pressed }) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: colors.white,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.line,
                  marginBottom: 10,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.md,
                  backgroundColor: isApproved ? colors.greenSoft : colors.tealTint,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}>
                <FileText size={20} color={isApproved ? colors.green : colors.teal} />
              </View>
              <View style={{ flex: 1, marginRight: 8 }}>
                <T w="bold" size={14} numberOfLines={1}>
                  {doc.title}
                </T>
                <T size={12} color={colors.muted} numberOfLines={1} style={{ marginTop: 2 }}>
                  {doc.description}
                </T>
                {doc.expiryDate ? (
                  <T size={11} color={colors.teal} style={{ marginTop: 2 }}>
                    Expires: {doc.expiryDate}
                  </T>
                ) : null}
              </View>
              <Badge
                label={isApproved ? 'Verified' : isPending ? 'Pending' : 'Upload'}
                variant={isApproved ? 'success' : isPending ? 'warning' : 'neutral'}
              />
            </Pressable>
          );
        })}

        <View style={{ height: 16 }} />
        <Button
          title={missing ? `Upload ${missing} more document${missing > 1 ? 's' : ''}` : 'Submit for verification'}
          disabled={missing > 0}
          onPress={() => {
            submitKyc();
            nav.replace('KycPending');
          }}
        />
      </ScrollView>
    </View>
  );
}

