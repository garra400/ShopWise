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
import { format, addDays } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { recognizeReceipt, recognizeReceiptFromImage, ReceiptItem } from '@/services/ocr';
import { takePendingScan } from '@/services/scanHandoff';
import { useProducts } from '@/context/ProductsContext';
import { DateInput } from '@/components/DateInput';
import { IngredientPicker } from '@/components/IngredientPicker';
import { Button } from '@/components/Button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { resolveCanonicalId, getIngredient, suggestedShelfLifeDays, suggestedUnit } from '@/utils/ingredients';
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

function buildItem(name: string, quantity: number, unit: string, fallbackCategory?: string, canonicalId?: string): EditableItem {
  const cid = canonicalId ?? resolveCanonicalId(name);
  const ing = getIngredient(cid);
  return {
    name,
    canonicalId: cid,
    quantity,
    unit: cid ? suggestedUnit(cid) : unit,
    category: ing?.category ?? fallbackCategory ?? 'Outros',
    expiryDate: expiryFromDays(suggestedShelfLifeDays(cid)),
  };
}

/** Split raw receipt items into recognized (in catalog, deduped+summed) and ignored. */
function splitItems(receiptItems: ReceiptItem[]): { recognized: EditableItem[]; ignored: EditableItem[] } {
  const recognized: EditableItem[] = [];
  const ignored: EditableItem[] = [];
  for (const r of receiptItems) {
    const it = buildItem(r.name, r.quantity, r.unit, r.category);
    if (it.canonicalId) {
      const i = recognized.findIndex((x) => x.canonicalId === it.canonicalId);
      if (i >= 0) recognized[i] = { ...recognized[i], quantity: recognized[i].quantity + it.quantity };
      else recognized.push(it);
    } else {
      const key = it.name.toLowerCase().trim();
      if (key && !ignored.some((x) => x.name.toLowerCase().trim() === key)) ignored.push(it);
    }
  }
  return { recognized, ignored };
}

export default function ScanScreen() {
  const theme = useTheme();
  const { addProducts } = useProducts();

  const [step, setStep] = useState<'input' | 'review'>('input');
  const [images, setImages] = useState<string[]>([]);
  const [recognizing, setRecognizing] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [usedFallback, setUsedFallback] = useState(false);

  const [items, setItems] = useState<EditableItem[]>([]);
  const [ignored, setIgnored] = useState<EditableItem[]>([]);
  const [showIgnored, setShowIgnored] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Items handed off from the QR-scan flow (NFC-e) → go straight to review
  useEffect(() => {
    const pending = takePendingScan();
    if (pending && pending.length > 0) {
      const { recognized, ignored: ign } = splitItems(pending);
      setItems(recognized);
      setIgnored(ign);
      setStep('review');
    }
  }, []);

  // ---- Page 1: input -------------------------------------------------------

  async function addFromGallery() {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, quality: 1 });
    if (!r.canceled) setImages((prev) => [...prev, ...r.assets.map((a) => a.uri)]);
  }

  async function addFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
    if (!r.canceled && r.assets[0]?.uri) setImages((prev) => [...prev, r.assets[0].uri]);
  }

  function removeImage(uri: string) {
    setImages((prev) => prev.filter((u) => u !== uri));
  }

  async function handleRecognize() {
    if (images.length === 0) return;
    setRecognizing(true);
    setOcrProgress(0);
    const all: ReceiptItem[] = [];
    let fell = false;
    try {
      for (let i = 0; i < images.length; i++) {
        setOcrStatus(`Lendo nota ${i + 1}/${images.length}…`);
        const { items: rec, usedFallback: f } = await recognizeReceiptFromImage(images[i], (s, p) => {
          setOcrStatus(`Nota ${i + 1}/${images.length}: ${s}`);
          setOcrProgress(p);
        });
        all.push(...rec);
        if (f) fell = true;
      }
      setUsedFallback(fell);
      const { recognized, ignored: ign } = splitItems(all);
      setItems(recognized);
      setIgnored(ign);
      setShowIgnored(false);
      setStep('review');
    } finally {
      setRecognizing(false);
      setOcrStatus('');
    }
  }

  async function handleSimulate() {
    setRecognizing(true);
    try {
      const { recognized, ignored: ign } = splitItems(await recognizeReceipt());
      setItems(recognized);
      setIgnored(ign);
      setUsedFallback(false);
      setStep('review');
    } finally {
      setRecognizing(false);
    }
  }

  // ---- Page 2: review ------------------------------------------------------

  function updateItem(index: number, patch: Partial<EditableItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function changeIngredient(index: number, name: string, canonicalId?: string, category?: IngredientCategory) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              name,
              canonicalId,
              category: category ?? item.category,
              unit: canonicalId ? suggestedUnit(canonicalId) : item.unit,
              expiryDate: canonicalId ? expiryFromDays(suggestedShelfLifeDays(canonicalId)) : item.expiryDate,
            }
          : item,
      ),
    );
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function addManualItem() {
    setItems((prev) => [...prev, buildItem('', 1, 'un')]);
  }

  function promoteIgnored(index: number) {
    setIgnored((prev) => {
      const it = prev[index];
      if (it) setItems((cur) => [...cur, it]);
      return prev.filter((_, i) => i !== index);
    });
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

  // =========================================================================
  // Render
  // =========================================================================

  if (step === 'input') {
    return (
      <ScrollView style={[styles.scroll, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
        <ThemedView type="backgroundElement" style={styles.notice}>
          <Ionicons name="receipt-outline" size={20} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>
            Leia o QR Code da nota fiscal ou envie uma ou mais fotos do cupom. Depois toque em “Reconhecer produtos” para revisar.
          </ThemedText>
        </ThemedView>

        {Platform.OS !== 'web' && (
          <Button title="Ler QR Code da nota fiscal" onPress={() => router.push('/add/qrcode')} variant="primary" disabled={recognizing} />
        )}

        <ThemedText type="small" themeColor="textSecondary" style={styles.orLabel}>
          ou envie fotos do cupom
        </ThemedText>

        <View style={styles.btnRow}>
          <View style={{ flex: 1 }}>
            <Button title="Galeria" onPress={addFromGallery} variant="secondary" disabled={recognizing} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Câmera" onPress={addFromCamera} variant="secondary" disabled={recognizing} />
          </View>
        </View>

        {images.length > 0 && (
          <View style={styles.thumbs}>
            {images.map((uri) => (
              <View key={uri} style={styles.thumbWrap}>
                <Image source={{ uri }} style={styles.thumb} />
                <TouchableOpacity style={styles.thumbRemove} onPress={() => removeImage(uri)} hitSlop={6}>
                  <Ionicons name="close-circle" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {recognizing && (
          <View style={styles.progressWrapper}>
            <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
              <View style={[styles.progressFill, { backgroundColor: theme.primary, width: `${progressPercent}%` as DimensionValue }]} />
            </View>
            {ocrStatus ? <ThemedText type="small" themeColor="textSecondary" style={styles.progressLabel}>{ocrStatus}</ThemedText> : null}
          </View>
        )}

        {images.length > 0 && (
          <Button
            title={recognizing ? `Reconhecendo… ${progressPercent}%` : `Reconhecer produtos (${images.length} ${images.length === 1 ? 'nota' : 'notas'})`}
            onPress={handleRecognize}
            loading={recognizing}
            variant="primary"
            disabled={recognizing}
          />
        )}

        <TouchableOpacity onPress={handleSimulate} disabled={recognizing} style={styles.simulateLink}>
          <ThemedText type="small" themeColor="textSecondary" style={{ textDecorationLine: 'underline' }}>
            Simular leitura (demonstração)
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // step === 'review'
  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.background }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.reviewHeader}>
        <TouchableOpacity onPress={() => setStep('input')} hitSlop={8} style={styles.backLink}>
          <Ionicons name="chevron-back" size={18} color={theme.primary} />
          <ThemedText style={{ color: theme.primary, fontWeight: '600' }}>Notas</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.sectionTitle}>
          {validCount} {validCount === 1 ? 'item' : 'itens'}
        </ThemedText>
      </View>

      {usedFallback && (
        <ThemedView type="backgroundElement" style={styles.fallbackNote}>
          <Ionicons name="warning-outline" size={16} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>
            Não foi possível ler com clareza — usando um exemplo. Ajuste os itens.
          </ThemedText>
        </ThemedView>
      )}

      {items.length === 0 && (
        <ThemedView type="backgroundElement" style={styles.fallbackNote}>
          <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>
            Nenhum item reconhecido. Adicione manualmente abaixo{ignored.length > 0 ? ' ou veja os itens ignorados' : ''}.
          </ThemedText>
        </ThemedView>
      )}

      {items.map((item, index) => {
        const recognized = getIngredient(item.canonicalId);
        return (
          <ThemedView key={index} type="backgroundElement" style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.itemIndex}>{index + 1}.</ThemedText>
              <View style={{ flex: 1 }}>
                <IngredientPicker
                  name={item.name}
                  canonicalId={item.canonicalId}
                  onChange={(next) => changeIngredient(index, next.name, next.canonicalId, next.category)}
                  placeholder="Nome do produto"
                />
              </View>
              <TouchableOpacity onPress={() => removeItem(index)} hitSlop={8}>
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

      {ignored.length > 0 && (
        <View style={styles.ignoredSection}>
          <TouchableOpacity onPress={() => setShowIgnored((v) => !v)} style={styles.ignoredToggle} hitSlop={6}>
            <Ionicons name={showIgnored ? 'chevron-up' : 'chevron-down'} size={16} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary">
              {showIgnored ? 'Ocultar' : 'Mostrar'} {ignored.length} {ignored.length === 1 ? 'item ignorado' : 'itens ignorados'}
            </ThemedText>
          </TouchableOpacity>
          {showIgnored && ignored.map((it, i) => (
            <View key={`${it.name}-${i}`} style={[styles.ignoredRow, { borderColor: theme.border }]}>
              <ThemedText type="small" style={{ flex: 1 }} numberOfLines={1}>{it.name || '(sem nome)'}</ThemedText>
              <TouchableOpacity onPress={() => promoteIgnored(i)} hitSlop={6} style={styles.ignoredAdd}>
                <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
                <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>Adicionar</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Button
        title={`Adicionar ${validCount} ${validCount === 1 ? 'produto' : 'produtos'} à despensa`}
        onPress={handleAdd}
        loading={submitting}
        disabled={validCount === 0}
        style={styles.addBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: Spacing.three, gap: Spacing.three, maxWidth: 600, width: '100%', alignSelf: 'center' },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, padding: Spacing.three, borderRadius: Spacing.two },
  orLabel: { textAlign: 'center' },
  btnRow: { flexDirection: 'row', gap: Spacing.two },
  thumbs: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  thumbWrap: { width: 90, height: 90, borderRadius: Spacing.two, overflow: 'hidden' },
  thumb: { width: '100%', height: '100%' },
  thumbRemove: { position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 12 },
  progressWrapper: { gap: Spacing.one },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { textAlign: 'center' },
  simulateLink: { alignItems: 'center', paddingVertical: Spacing.two },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  sectionTitle: { fontWeight: '700', fontSize: 16 },
  fallbackNote: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, padding: Spacing.two, borderRadius: Spacing.two },
  itemCard: { borderRadius: Spacing.two, padding: Spacing.three, gap: Spacing.two },
  itemHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  itemIndex: { marginTop: Spacing.two + 4, fontWeight: '700' },
  row: { flexDirection: 'row', gap: Spacing.two },
  field: { gap: Spacing.half },
  fieldLabel: { fontWeight: '600' },
  smallInput: { borderWidth: 1, borderRadius: Spacing.one, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one + 2, fontSize: 14, minHeight: 36 },
  recognizedHint: { fontStyle: 'italic' },
  addRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.one, paddingVertical: Spacing.two + 2, borderRadius: Spacing.two, borderWidth: 1, borderStyle: 'dashed' },
  ignoredSection: { gap: Spacing.two },
  ignoredToggle: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, justifyContent: 'center' },
  ignoredRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.one + 2, paddingHorizontal: Spacing.two, borderRadius: Spacing.one, borderWidth: 1 },
  ignoredAdd: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  addBtn: { marginTop: Spacing.one, marginBottom: Spacing.six },
});
