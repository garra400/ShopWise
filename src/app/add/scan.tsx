import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  DimensionValue,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { takePendingScan } from '@/services/scanHandoff';
import { format, addDays } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { recognizeReceipt, recognizeReceiptFromImage, ReceiptItem } from '@/services/ocr';
import { useProducts } from '@/context/ProductsContext';
import { DateInput } from '@/components/DateInput';
import { IngredientPicker } from '@/components/IngredientPicker';
import { Button } from '@/components/Button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { resolveCanonicalId, getIngredient, suggestedShelfLifeDays } from '@/utils/ingredients';
import { IngredientCategory } from '@/types';

interface EditableItem {
  name: string;
  canonicalId?: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: string;
}

function expiryFromDays(days: number): string {
  return format(addDays(new Date(), days), 'yyyy-MM-dd');
}

/** Build a review row from a raw name, auto-mapping canonical + category + typical expiry. */
function buildItem(
  name: string,
  quantity: number,
  unit: string,
  fallbackCategory?: string,
  canonicalId?: string,
): EditableItem {
  const cid = canonicalId ?? resolveCanonicalId(name);
  const ing = getIngredient(cid);
  return {
    name,
    canonicalId: cid,
    quantity,
    unit,
    category: ing?.category ?? fallbackCategory ?? 'Outros',
    expiryDate: expiryFromDays(suggestedShelfLifeDays(cid)),
  };
}

export default function ScanScreen() {
  const theme = useTheme();
  const { addProducts } = useProducts();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [recognizing, setRecognizing] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [usedFallback, setUsedFallback] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [items, setItems] = useState<EditableItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Items handed off from the QR-scan flow (NFC-e)
  useEffect(() => {
    const pending = takePendingScan();
    if (pending && pending.length > 0) ingest(pending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  // Image acquisition
  // -------------------------------------------------------------------------

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0]?.uri ?? null);
      setUsedFallback(false);
      setOcrStatus('');
      setOcrProgress(0);
    }
  }

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0]?.uri ?? null);
      setUsedFallback(false);
      setOcrStatus('');
      setOcrProgress(0);
    }
  }

  function ingest(recognized: ReceiptItem[]) {
    setItems(recognized.map((r) => buildItem(r.name, r.quantity, r.unit, r.category)));
  }

  async function handleRecognize() {
    if (!imageUri) return;
    setRecognizing(true);
    setOcrStatus('Iniciando...');
    setOcrProgress(0);
    setUsedFallback(false);
    try {
      const { items: recognized, usedFallback: fell } = await recognizeReceiptFromImage(
        imageUri,
        (status, progress) => {
          setOcrStatus(status);
          setOcrProgress(progress);
        },
      );
      setUsedFallback(fell);
      ingest(recognized);
      setOcrStatus('');
    } finally {
      setRecognizing(false);
    }
  }

  async function handleScan() {
    setScanning(true);
    try {
      ingest(await recognizeReceipt());
      setUsedFallback(false);
    } finally {
      setScanning(false);
    }
  }

  // -------------------------------------------------------------------------
  // Review list helpers
  // -------------------------------------------------------------------------

  function updateItem(index: number, patch: Partial<EditableItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  /** When the ingredient changes, re-map category + typical expiry automatically. */
  function changeIngredient(index: number, name: string, canonicalId?: string, category?: IngredientCategory) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          name,
          canonicalId,
          category: category ?? item.category,
          expiryDate: canonicalId ? expiryFromDays(suggestedShelfLifeDays(canonicalId)) : item.expiryDate,
        };
      }),
    );
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function addManualItem() {
    setItems((prev) => [...prev, buildItem('', 1, 'un')]);
  }

  async function handleAdd() {
    const valid = items.filter((it) => it.name.trim());
    if (valid.length === 0) return;
    setSubmitting(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    try {
      await addProducts(
        valid.map((item) => ({
          name: item.name.trim(),
          canonicalId: item.canonicalId,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          purchaseDate: today,
          expiryDate: item.expiryDate || expiryFromDays(30),
          source: 'receipt_scan' as const,
          consumed: false,
        })),
      );
      router.replace('/(tabs)');
    } finally {
      setSubmitting(false);
    }
  }

  const progressPercent = Math.round(ocrProgress * 100);
  const validCount = items.filter((it) => it.name.trim()).length;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Disclaimer */}
      <ThemedView type="backgroundElement" style={styles.notice}>
        <Ionicons name="information-circle-outline" size={20} color={theme.textSecondary} />
        <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>
          Fotografe ou selecione o cupom fiscal e toque em “Reconhecer produtos”. O reconhecimento roda no próprio aparelho. Cada item vem com uma validade típica já sugerida — revise e ajuste rapidinho se quiser.
        </ThemedText>
      </ThemedView>

      {/* QR Code da NFC-e (carro-chefe — mais preciso; só no app nativo) */}
      {Platform.OS !== 'web' && (
        <Button
          title="Ler QR Code da nota fiscal"
          onPress={() => router.push('/add/qrcode')}
          variant="primary"
          disabled={recognizing}
        />
      )}

      {/* Image acquisition */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Button title="Selecionar imagem" onPress={handlePickImage} variant="secondary" disabled={recognizing} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Tirar foto" onPress={handleTakePhoto} variant="secondary" disabled={recognizing} />
        </View>
      </View>

      {imageUri ? (
        <ThemedView type="backgroundElement" style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" accessibilityLabel="Pré-visualização do cupom" />
        </ThemedView>
      ) : null}

      <Button
        title={recognizing ? `Reconhecendo… ${progressPercent}%` : 'Reconhecer produtos'}
        onPress={handleRecognize}
        loading={recognizing}
        variant="primary"
        disabled={!imageUri || recognizing}
      />

      {recognizing && (
        <View style={styles.progressWrapper}>
          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { backgroundColor: theme.primary, width: `${progressPercent}%` as DimensionValue }]} />
          </View>
          {ocrStatus ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.progressLabel}>{ocrStatus}</ThemedText>
          ) : null}
        </View>
      )}

      {usedFallback && items.length > 0 && (
        <ThemedView type="backgroundElement" style={styles.fallbackNote}>
          <Ionicons name="warning-outline" size={16} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>
            Não foi possível ler a imagem com clareza — usando um exemplo. Ajuste os itens.
          </ThemedText>
        </ThemedView>
      )}

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Button title={scanning ? 'Simulando...' : 'Simular leitura'} onPress={handleScan} loading={scanning} variant="secondary" disabled={recognizing} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Adicionar item" onPress={addManualItem} variant="secondary" disabled={recognizing} />
        </View>
      </View>

      {/* Items review */}
      {items.length > 0 && (
        <View style={styles.itemsSection}>
          <ThemedText style={styles.sectionTitle}>
            {validCount} {validCount === 1 ? 'item' : 'itens'} para revisar
          </ThemedText>

          {items.map((item, index) => {
            const recognized = getIngredient(item.canonicalId);
            return (
              <ThemedView key={index} type="backgroundElement" style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.itemIndex}>
                    {index + 1}.
                  </ThemedText>
                  <View style={{ flex: 1 }}>
                    <IngredientPicker
                      name={item.name}
                      canonicalId={item.canonicalId}
                      onChange={(next) => changeIngredient(index, next.name, next.canonicalId, next.category)}
                      placeholder="Nome do produto"
                    />
                  </View>
                  <TouchableOpacity onPress={() => removeItem(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="trash-outline" size={20} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <View style={[styles.field, { flex: 1 }]}>
                    <ThemedText type="small" style={styles.fieldLabel}>Qtd</ThemedText>
                    <TextInput
                      style={[styles.smallInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                      value={String(item.quantity)}
                      onChangeText={(v) => updateItem(index, { quantity: Number(v) || 1 })}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.field, { flex: 1 }]}>
                    <ThemedText type="small" style={styles.fieldLabel}>Unidade</ThemedText>
                    <TextInput
                      style={[styles.smallInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                      value={item.unit}
                      onChangeText={(v) => updateItem(index, { unit: v })}
                    />
                  </View>
                </View>

                <DateInput label="Validade" value={item.expiryDate} onChange={(d) => updateItem(index, { expiryDate: d })} />

                {recognized && (
                  <ThemedText type="small" themeColor="textSecondary" style={styles.recognizedHint}>
                    ✓ {recognized.name} · {recognized.category} · validade típica {suggestedShelfLifeDays(item.canonicalId)} dias
                  </ThemedText>
                )}
              </ThemedView>
            );
          })}

          <TouchableOpacity onPress={addManualItem} style={[styles.addRow, { borderColor: theme.border }]} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
            <ThemedText style={{ color: theme.primary, fontWeight: '600' }}>Adicionar outro item</ThemedText>
          </TouchableOpacity>

          <Button
            title={`Adicionar ${validCount} ${validCount === 1 ? 'produto' : 'produtos'} à despensa`}
            onPress={handleAdd}
            loading={submitting}
            disabled={validCount === 0}
            style={styles.addBtn}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: Spacing.three, gap: Spacing.three, maxWidth: 600, width: '100%', alignSelf: 'center' },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, padding: Spacing.three, borderRadius: Spacing.two },
  previewContainer: { borderRadius: Spacing.two, overflow: 'hidden', alignItems: 'center' },
  preview: { width: '100%', height: 220 },
  progressWrapper: { gap: Spacing.one },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { textAlign: 'center' },
  fallbackNote: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, padding: Spacing.two, borderRadius: Spacing.two },
  sectionTitle: { fontWeight: '700', fontSize: 16 },
  itemsSection: { gap: Spacing.three },
  itemCard: { borderRadius: Spacing.two, padding: Spacing.three, gap: Spacing.two },
  itemHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  itemIndex: { marginTop: Spacing.two + 4, fontWeight: '700' },
  row: { flexDirection: 'row', gap: Spacing.two },
  field: { gap: Spacing.half },
  fieldLabel: { fontWeight: '600' },
  smallInput: { borderWidth: 1, borderRadius: Spacing.one, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one + 2, fontSize: 14, minHeight: 36 },
  recognizedHint: { fontStyle: 'italic' },
  addRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.one, paddingVertical: Spacing.two + 2, borderRadius: Spacing.two, borderWidth: 1, borderStyle: 'dashed' },
  addBtn: { marginTop: Spacing.one, marginBottom: Spacing.six },
});
