import { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { parseNfceUrl, fetchNfceItems } from '@/services/nfce';
import { setPendingScan } from '@/services/scanHandoff';
import { useT } from '@/i18n';

export default function QrCodeScreen() {
  const t = useT();
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const handled = useRef(false);
  const [status, setStatus] = useState<'scanning' | 'loading' | 'error'>('scanning');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleScanned(data: string) {
    if (handled.current) return;
    const ref = parseNfceUrl(data);
    if (!ref) return; // not an NFC-e QR — keep scanning
    handled.current = true;
    setStatus('loading');

    const items = await fetchNfceItems(ref);
    if (items.length > 0) {
      setPendingScan(items);
      router.replace('/add/scan');
    } else {
      setErrorMsg(t('qr.error'));
      setStatus('error');
    }
  }

  // Permission gates
  if (!permission) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Ionicons name="camera-outline" size={48} color={theme.textSecondary} />
        <ThemedText style={styles.msg}>{t('qr.permission')}</ThemedText>
        <Button title={t('qr.allow')} onPress={requestPermission} />
        <Button title={t('common.back')} variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  if (status === 'loading') {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText style={styles.msg}>{t('qr.loading')}</ThemedText>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.textSecondary} />
        <ThemedText style={styles.msg}>{errorMsg}</ThemedText>
        <Button title={t('qr.addPhotoManual')} onPress={() => router.replace('/add/scan')} />
        <Button
          title={t('qr.tryAnother')}
          variant="secondary"
          onPress={() => {
            handled.current = false;
            setStatus('scanning');
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => handleScanned(data)}
      />
      <View style={styles.overlay} pointerEvents="none">
        <View style={[styles.frame, { borderColor: '#ffffff' }]} />
        <ThemedText style={styles.hint}>{t('qr.hint')}</ThemedText>
      </View>
      <View style={styles.bottomBar}>
        <Button title={t('common.cancel')} variant="secondary" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.four },
  msg: { textAlign: 'center', fontSize: 15 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  frame: { width: 240, height: 240, borderWidth: 3, borderRadius: Spacing.three, backgroundColor: 'transparent' },
  hint: { color: '#fff', fontSize: 15, fontWeight: '600', textShadowColor: '#000', textShadowRadius: 4 },
  bottomBar: { position: 'absolute', bottom: Spacing.six, left: Spacing.four, right: Spacing.four },
});
