import { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { format, addDays } from 'date-fns';
import { suggestedUnit, suggestedShelfLifeDays } from '@/utils/ingredients';
import { useProducts } from '@/context/ProductsContext';
import { goBack } from '@/utils/nav';
import { useSettings } from '@/context/SettingsContext';
import { DateInput } from '@/components/DateInput';
import { Select } from '@/components/Select';
import { IngredientPicker } from '@/components/IngredientPicker';
import { Button } from '@/components/Button';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

const CATEGORIES = [
  'Laticínios', 'Hortifruti', 'Carnes', 'Padaria',
  'Bebidas', 'Mercearia', 'Limpeza', 'Outros',
].map((c) => ({ label: c, value: c }));

const UNITS = ['un', 'kg', 'g', 'L', 'ml'].map((u) => ({ label: u, value: u }));

interface FormErrors {
  name?: string;
  expiryDate?: string;
}

export default function ManualAddScreen() {
  const theme = useTheme();
  const { addProduct } = useProducts();
  const { settings } = useSettings();

  const today = format(new Date(), 'yyyy-MM-dd');

  const [name, setName] = useState('');
  const [canonicalId, setCanonicalId] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState('Outros');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState(settings.defaultUnit);
  const [purchaseDate, setPurchaseDate] = useState(today);
  const [expiryDate, setExpiryDate] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Nome é obrigatório';
    if (!expiryDate) e.expiryDate = 'Data de validade é obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addProduct({
        name: name.trim(),
        canonicalId,
        category,
        quantity: quantity && !Number.isNaN(Number(quantity)) ? Number(quantity) : undefined,
        unit,
        purchaseDate,
        expiryDate,
        source: 'manual',
        consumed: false,
      });
      goBack();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Nome / Ingrediente */}
      <View style={[styles.field, styles.pickerField]}>
        <ThemedText style={styles.label}>Nome *</ThemedText>
        <IngredientPicker
          name={name}
          canonicalId={canonicalId}
          onChange={(next) => {
            setName(next.name);
            setCanonicalId(next.canonicalId);
            if (next.category) setCategory(next.category);
            // Auto-suggest the natural unit + a typical expiry for recognized items
            if (next.canonicalId) {
              setUnit(suggestedUnit(next.canonicalId));
              setExpiryDate(format(addDays(new Date(), suggestedShelfLifeDays(next.canonicalId)), 'yyyy-MM-dd'));
            }
          }}
          error={errors.name}
        />
      </View>

      {/* Categoria */}
      <View style={styles.field}>
        <ThemedText style={styles.label}>Categoria</ThemedText>
        <Select options={CATEGORIES} value={category} onChange={setCategory} />
      </View>

      {/* Quantidade + Unidade */}
      <View style={styles.row}>
        <View style={[styles.field, { flex: 2 }]}>
          <ThemedText style={styles.label}>Quantidade</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.border }]}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="1"
            placeholderTextColor={theme.textSecondary}
          />
        </View>
        <View style={[styles.field, { flex: 1 }]}>
          <ThemedText style={styles.label}>Unidade</ThemedText>
          <Select options={UNITS} value={unit} onChange={setUnit} />
        </View>
      </View>

      {/* Data de compra */}
      <View style={styles.field}>
        <DateInput
          label="Data de compra"
          value={purchaseDate}
          onChange={setPurchaseDate}
        />
      </View>

      {/* Data de validade */}
      <View style={styles.field}>
        <DateInput
          label="Data de validade *"
          value={expiryDate}
          onChange={setExpiryDate}
          referenceDate={new Date()}
          error={errors.expiryDate}
        />
      </View>

      <Button
        title="Adicionar produto"
        onPress={handleSubmit}
        loading={submitting}
        style={styles.submit}
      />
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
  field: {
    gap: Spacing.one,
  },
  pickerField: {
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 16,
    minHeight: 48,
  },
  errorText: {
    color: '#D64545',
    fontSize: 12,
  },
  submit: {
    marginTop: Spacing.two,
    marginBottom: Spacing.six,
  },
});
