import { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
  DimensionValue,
} from 'react-native';
import { router } from 'expo-router';
import { format, addMonths } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { recognizeReceipt, recognizeReceiptFromImage, ReceiptItem } from '@/services/ocr';
import { useProducts } from '@/context/ProductsContext';
import { DateInput } from '@/components/DateInput';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

const CATEGORIES = [
  'Laticínios', 'Hortifruti', 'Carnes', 'Padaria',
  'Bebidas', 'Mercearia', 'Limpeza', 'Outros',
].map((c) => ({ label: c, value: c }));

interface EditableItem extends ReceiptItem {
  expiryDate: string;
}

const DEFAULT_EXPIRY = format(addMonths(new Date(), 1), 'yyyy-MM-dd');

export default function ScanScreen() {
  const theme = useTheme();
  const { addProducts } = useProducts();

  // Image state
  const [imageUri, setImageUri] = useState<string | null>(null);

  // OCR progress state
  const [recognizing, setRecognizing] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [usedFallback, setUsedFallback] = useState(false);

  // Mock-scan state (existing demo)
  const [scanning, setScanning] = useState(false);

  // Review list
  const [items, setItems] = useState<EditableItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // -------------------------------------------------------------------------
  // Image acquisition
  // -------------------------------------------------------------------------

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0]?.uri ?? null;
      setImageUri(uri);
      setUsedFallback(false);
      setOcrStatus('');
      setOcrProgress(0);
    }
  }

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0]?.uri ?? null;
      setImageUri(uri);
      setUsedFallback(false);
      setOcrStatus('');
      setOcrProgress(0);
    }
  }

  // -------------------------------------------------------------------------
  // Real OCR
  // -------------------------------------------------------------------------

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
      setItems(recognized.map((r) => ({ ...r, expiryDate: DEFAULT_EXPIRY })));
      setOcrStatus('');
    } finally {
      setRecognizing(false);
    }
  }

  // -------------------------------------------------------------------------
  // Mock demo (existing behavior)
  // -------------------------------------------------------------------------

  async function handleScan() {
    setScanning(true);
    try {
      const result = await recognizeReceipt();
      setItems(result.map((r) => ({ ...r, expiryDate: DEFAULT_EXPIRY })));
      setUsedFallback(false);
    } finally {
      setScanning(false);
    }
  }

  // -------------------------------------------------------------------------
  // Review list helpers
  // -------------------------------------------------------------------------

  function updateItem(index: number, patch: Partial<EditableItem>) {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, ...patch } : item));
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleAdd() {
    if (items.length === 0) return;
    setSubmitting(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    try {
      await addProducts(
        items.map((item) => ({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          purchaseDate: today,
          expiryDate: item.expiryDate || DEFAULT_EXPIRY,
          source: 'receipt_scan' as const,
          consumed: false,
        }))
      );
      router.replace('/(tabs)');
    } finally {
      setSubmitting(false);
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const progressPercent = Math.round(ocrProgress * 100);

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
          O reconhecimento acontece no próprio dispositivo via Tesseract.js (gratuito, sem envio a servidores). Selecione ou fotografe o cupom fiscal e toque em "Reconhecer produtos". O botão "Simular" é uma demonstração rápida.
        </ThemedText>
      </ThemedView>

      {/* Image acquisition buttons */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Button
            title="Selecionar imagem"
            onPress={handlePickImage}
            variant="secondary"
            disabled={recognizing}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Tirar foto"
            onPress={handleTakePhoto}
            variant="secondary"
            disabled={recognizing}
          />
        </View>
      </View>

      {/* Image preview */}
      {imageUri ? (
        <ThemedView type="backgroundElement" style={styles.previewContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.preview}
            resizeMode="contain"
            accessibilityLabel="Pré-visualização da imagem selecionada"
          />
        </ThemedView>
      ) : null}

      {/* Recognize button */}
      <Button
        title={recognizing ? `Reconhecendo… ${progressPercent}%` : 'Reconhecer produtos'}
        onPress={handleRecognize}
        loading={recognizing}
        variant="primary"
        disabled={!imageUri || recognizing}
      />

      {/* OCR progress bar + status */}
      {recognizing && (
        <View style={styles.progressWrapper}>
          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.primary, width: `${progressPercent}%` as DimensionValue },
              ]}
            />
          </View>
          {ocrStatus ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.progressLabel}>
              {ocrStatus}
            </ThemedText>
          ) : null}
        </View>
      )}

      {/* Fallback note */}
      {usedFallback && items.length > 0 && (
        <ThemedView type="backgroundElement" style={styles.fallbackNote}>
          <Ionicons name="warning-outline" size={16} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>
            Não foi possível ler a imagem com clareza — usando exemplo. Ajuste os itens.
          </ThemedText>
        </ThemedView>
      )}

      {/* Mock / demo button */}
      <Button
        title={scanning ? 'Simulando...' : 'Simular escaneamento de comprovante'}
        onPress={handleScan}
        loading={scanning}
        variant="secondary"
        disabled={recognizing}
      />

      {/* Items review */}
      {items.length > 0 && (
        <View style={styles.itemsSection}>
          <ThemedText style={styles.sectionTitle}>
            {items.length} produto{items.length !== 1 ? 's' : ''} reconhecido{items.length !== 1 ? 's' : ''}
          </ThemedText>

          {items.map((item, index) => (
            <ThemedView key={index} type="backgroundElement" style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                <TouchableOpacity onPress={() => removeItem(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
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
                <View style={[styles.field, { flex: 2 }]}>
                  <ThemedText type="small" style={styles.fieldLabel}>Categoria</ThemedText>
                  <Select
                    options={CATEGORIES}
                    value={item.category}
                    onChange={(v) => updateItem(index, { category: v })}
                  />
                </View>
              </View>

              <DateInput
                label="Validade"
                value={item.expiryDate}
                onChange={(d) => updateItem(index, { expiryDate: d })}
              />
            </ThemedView>
          ))}

          <Button
            title={`Adicionar ${items.length} produto${items.length !== 1 ? 's' : ''}`}
            onPress={handleAdd}
            loading={submitting}
            style={styles.addBtn}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  previewContainer: {
    borderRadius: Spacing.two,
    overflow: 'hidden',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 220,
  },
  progressWrapper: {
    gap: Spacing.one,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressLabel: {
    textAlign: 'center',
  },
  fallbackNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Spacing.two,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  itemsSection: {
    gap: Spacing.three,
  },
  itemCard: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontWeight: '600',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  field: {
    gap: Spacing.half,
  },
  fieldLabel: {
    fontWeight: '600',
  },
  smallInput: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one + 2,
    fontSize: 14,
    minHeight: 36,
  },
  addBtn: {
    marginTop: Spacing.two,
    marginBottom: Spacing.six,
  },
});
