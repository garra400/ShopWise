import { useState } from 'react';
import { View, TextInput, ScrollView, Alert, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useProducts } from '@/context/ProductsContext';
import { goBack } from '@/utils/nav';
import { getStatus, statusLabel, statusColor, daysLabel, formatDate } from '@/utils/status';
import { StatusBadge } from '@/components/StatusBadge';
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

const UNITS = ['un', 'kg', 'g', 'L', 'ml'].map((u) => ({ label: u, value: u }));

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { products, updateProduct, removeProduct, markConsumed, renewExpiry } = useProducts();

  const product = products.find((p) => p.id === id);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [renewDate, setRenewDate] = useState('');
  const [showRenew, setShowRenew] = useState(false);

  if (!product) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ThemedText>Produto não encontrado.</ThemedText>
        <Button title="Voltar" onPress={goBack} variant="secondary" style={{ marginTop: Spacing.three }} />
      </View>
    );
  }

  const status = getStatus(product);
  const color = statusColor(status);

  function startEdit() {
    setEditName(product!.name);
    setEditCategory(product!.category);
    setEditQuantity(product!.quantity != null ? String(product!.quantity) : '');
    setEditUnit(product!.unit ?? 'un');
    setEditExpiry(product!.expiryDate);
    setEditing(true);
  }

  async function saveEdit() {
    await updateProduct(product!.id, {
      name: editName.trim() || product!.name,
      category: editCategory,
      quantity: editQuantity && !Number.isNaN(Number(editQuantity)) ? Number(editQuantity) : undefined,
      unit: editUnit,
      expiryDate: editExpiry || product!.expiryDate,
    });
    setEditing(false);
  }

  async function doDelete() {
    await removeProduct(product!.id);
    goBack();
  }

  function handleDelete() {
    const message = `Tem certeza que deseja excluir "${product!.name}"?`;
    if (Platform.OS === 'web') {
      // Alert.alert with buttons is not supported on web — use window.confirm
      if (typeof window !== 'undefined' && window.confirm(message)) {
        doDelete();
      }
      return;
    }
    Alert.alert(
      'Excluir produto',
      message,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: doDelete,
        },
      ]
    );
  }

  async function handleConsume() {
    await markConsumed(product!.id);
    goBack();
  }

  async function handleRenew() {
    if (!renewDate) return;
    await renewExpiry(product!.id, renewDate);
    setShowRenew(false);
    setRenewDate('');
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header card */}
      <ThemedView type="backgroundElement" style={styles.headerCard}>
        <View style={[styles.statusStripe, { backgroundColor: color }]} />
        <View style={styles.headerContent}>
          <ThemedText style={styles.productName}>{product.name}</ThemedText>
          <StatusBadge status={status} />
          <ThemedText style={[styles.daysText, { color }]}>{daysLabel(product)}</ThemedText>
        </View>
      </ThemedView>

      {/* Details */}
      {!editing ? (
        <ThemedView type="backgroundElement" style={styles.section}>
          <DetailRow label="Categoria" value={product.category} />
          {product.quantity != null && (
            <DetailRow label="Quantidade" value={`${product.quantity} ${product.unit ?? ''}`} />
          )}
          <DetailRow label="Comprado em" value={formatDate(product.purchaseDate)} />
          <DetailRow label="Validade" value={formatDate(product.expiryDate)} />
          <DetailRow label="Origem" value={
            product.source === 'manual' ? 'Manual'
            : product.source === 'receipt_scan' ? 'Comprovante escaneado'
            : 'Código de barras'
          } />
          {product.consumed && (
            <DetailRow label="Status" value="Consumido" />
          )}
        </ThemedView>
      ) : (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Editar produto</ThemedText>
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>Nome</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              value={editName}
              onChangeText={setEditName}
            />
          </View>
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>Categoria</ThemedText>
            <Select options={CATEGORIES} value={editCategory} onChange={setEditCategory} />
          </View>
          <View style={styles.row}>
            <View style={[styles.field, { flex: 2 }]}>
              <ThemedText style={styles.fieldLabel}>Quantidade</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                value={editQuantity}
                onChangeText={setEditQuantity}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <ThemedText style={styles.fieldLabel}>Unidade</ThemedText>
              <Select options={UNITS} value={editUnit} onChange={setEditUnit} />
            </View>
          </View>
          <DateInput
            label="Nova validade"
            value={editExpiry}
            onChange={setEditExpiry}
          />
          <View style={styles.editActions}>
            <Button title="Salvar" onPress={saveEdit} style={{ flex: 1 }} />
            <Button title="Cancelar" onPress={() => setEditing(false)} variant="secondary" style={{ flex: 1 }} />
          </View>
        </ThemedView>
      )}

      {/* Renew expiry */}
      {showRenew && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Renovar validade</ThemedText>
          <DateInput
            label="Nova data de validade"
            value={renewDate}
            onChange={setRenewDate}
          />
          <View style={styles.editActions}>
            <Button title="Salvar" onPress={handleRenew} disabled={!renewDate} style={{ flex: 1 }} />
            <Button title="Cancelar" onPress={() => setShowRenew(false)} variant="secondary" style={{ flex: 1 }} />
          </View>
        </ThemedView>
      )}

      {/* Actions */}
      {!editing && !product.consumed && (
        <View style={styles.actions}>
          <Button title="Editar" onPress={startEdit} variant="secondary" />
          <Button title="Marcar como consumido" onPress={handleConsume} variant="secondary" />
          <Button
            title="Renovar validade"
            onPress={() => { setShowRenew(true); setRenewDate(product.expiryDate); }}
            variant="secondary"
          />
          <Button title="Excluir produto" onPress={handleDelete} variant="danger" />
        </View>
      )}

      {product.consumed && !editing && (
        <View style={styles.actions}>
          <Button title="Excluir produto" onPress={handleDelete} variant="danger" />
        </View>
      )}
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={detailStyles.row}>
      <ThemedText style={detailStyles.label} themeColor="textSecondary">{label}</ThemedText>
      <ThemedText style={detailStyles.value}>{value}</ThemedText>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.two,
  },
});

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: Spacing.six,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCard: {
    borderRadius: Spacing.two,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  statusStripe: {
    width: 6,
  },
  headerContent: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
  },
  daysText: {
    fontWeight: '600',
    fontSize: 15,
  },
  section: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: Spacing.one,
  },
  field: {
    gap: Spacing.one,
  },
  fieldLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 16,
    minHeight: 48,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
  },
});
