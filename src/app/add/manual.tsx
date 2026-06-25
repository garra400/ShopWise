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
import { useT } from '@/i18n';
import { unitOptions } from '@/utils/units';

const CATEGORIES = [
  'Laticínios', 'Hortifruti', 'Carnes', 'Padaria',
  'Bebidas', 'Mercearia', 'Limpeza', 'Outros',
];

interface FormErrors {
  name?: string;
  expiryDate?: string;
}

export default function ManualAddScreen() {
  const theme = useTheme();
  const t = useT();
  const { addProduct } = useProducts();
  const { settings } = useSettings();
  const lang = settings.language === 'en' ? 'en' : 'pt';
  const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: t('category.' + c) }));
  const unitOpts = unitOptions(settings.measurementSystem, lang);

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
    if (!name.trim()) e.name = t('manual.nameRequired');
    if (!expiryDate) e.expiryDate = t('manual.expiryRequired');
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
        <ThemedText style={styles.label}>{t('manual.name')}</ThemedText>
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
        <ThemedText style={styles.label}>{t('manual.category')}</ThemedText>
        <Select options={categoryOptions} value={category} onChange={setCategory} />
      </View>

      {/* Quantidade + Unidade */}
      <View style={styles.row}>
        <View style={[styles.field, { flex: 2 }]}>
          <ThemedText style={styles.label}>{t('manual.quantity')}</ThemedText>
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
          <ThemedText style={styles.label}>{t('manual.unit')}</ThemedText>
          <Select options={unitOpts} value={unit} onChange={setUnit} />
        </View>
      </View>

      {/* Data de compra */}
      <View style={styles.field}>
        <DateInput
          label={t('manual.purchaseDate')}
          value={purchaseDate}
          onChange={setPurchaseDate}
        />
      </View>

      {/* Data de validade */}
      <View style={styles.field}>
        <DateInput
          label={t('manual.expiryDate')}
          value={expiryDate}
          onChange={setExpiryDate}
          referenceDate={new Date()}
          error={errors.expiryDate}
        />
      </View>

      <Button
        title={t('manual.submit')}
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
