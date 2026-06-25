import { useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { CanonicalIngredient } from '@/types';
import { searchIngredients, getIngredient } from '@/utils/ingredients';
import { useT } from '@/i18n';
import { useSettings } from '@/context/SettingsContext';

interface Props {
  /** Selected canonical ingredient ids. */
  values: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

/**
 * Search the canonical catalog and add multiple ingredients as removable chips.
 * Stores canonical ids — used e.g. for the "ingredients to avoid" preference.
 */
export function IngredientMultiSelect({ values, onChange, placeholder }: Props) {
  const theme = useTheme();
  const t = useT();
  const { settings } = useSettings();
  const lang = settings.language === 'en' ? 'en' : 'pt';
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo<CanonicalIngredient[]>(() => {
    if (!focused || !query.trim()) return [];
    return searchIngredients(query, 6).filter((i) => !values.includes(i.id));
  }, [focused, query, values]);

  function add(id: string) {
    if (!values.includes(id)) onChange([...values, id]);
    setQuery('');
  }

  function remove(id: string) {
    onChange(values.filter((v) => v !== id));
  }

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.border },
        ]}
        value={query}
        onChangeText={setQuery}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={placeholder ?? t('multiselect.searchAvoid')}
        placeholderTextColor={theme.textSecondary}
      />

      {suggestions.length > 0 && (
        <View style={[styles.list, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          {suggestions.map((ing) => (
            <TouchableOpacity key={ing.id} style={styles.option} activeOpacity={0.7} onPress={() => add(ing.id)}>
              <ThemedText style={styles.optionName}>{lang === 'en' ? ing.nameEn : ing.name}</ThemedText>
              <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {values.length > 0 && (
        <View style={styles.chips}>
          {values.map((id) => {
            const ing = getIngredient(id);
            const label = (ing ? (lang === 'en' ? ing.nameEn : ing.name) : undefined) ?? id;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.chip, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}
                activeOpacity={0.7}
                onPress={() => remove(id)}
              >
                <ThemedText style={styles.chipText}>{label}</ThemedText>
                <Ionicons name="close" size={14} color={theme.textSecondary} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 16,
    minHeight: 48,
  },
  list: {
    marginTop: Spacing.one,
    borderWidth: 1,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
  },
  optionName: {
    fontSize: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
});
