import { useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { CanonicalIngredient, IngredientCategory } from '@/types';
import { searchIngredients, resolveCanonicalId, getIngredient } from '@/utils/ingredients';

export interface IngredientSelection {
  name: string;
  canonicalId?: string;
  category?: IngredientCategory;
}

interface Props {
  name: string;
  canonicalId?: string;
  onChange: (next: IngredientSelection) => void;
  placeholder?: string;
  error?: string;
}

/**
 * Free-text ingredient input backed by the canonical catalog.
 * Typing filters suggestions; picking one stores its canonical id (and category).
 * Free text still auto-resolves to a canonical id when it matches a known term.
 */
export function IngredientPicker({ name, canonicalId, onChange, placeholder, error }: Props) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo<CanonicalIngredient[]>(
    () => (focused ? searchIngredients(name, 6) : []),
    [focused, name],
  );

  const resolved = getIngredient(canonicalId);
  const showList = focused && suggestions.length > 0;

  function handleText(text: string) {
    onChange({ name: text, canonicalId: resolveCanonicalId(text) });
  }

  function pick(ing: CanonicalIngredient) {
    onChange({ name: ing.name, canonicalId: ing.id, category: ing.category });
    setFocused(false);
  }

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            color: theme.text,
            borderColor: error ? '#D64545' : theme.border,
          },
        ]}
        value={name}
        onChangeText={handleText}
        onFocus={() => setFocused(true)}
        // Delay blur so a suggestion tap registers before the list unmounts.
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={placeholder ?? 'Ex: Leite Integral'}
        placeholderTextColor={theme.textSecondary}
      />

      {showList && (
        <View style={[styles.list, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          {suggestions.map((ing) => (
            <TouchableOpacity
              key={ing.id}
              style={styles.option}
              activeOpacity={0.7}
              onPress={() => pick(ing)}
            >
              <ThemedText style={styles.optionName}>{ing.name}</ThemedText>
              <ThemedText style={[styles.optionCat, { color: theme.textSecondary }]}>
                {ing.category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recognition hint */}
      {!!name.trim() && !showList && (
        resolved ? (
          <View style={styles.hintRow}>
            <Ionicons name="checkmark-circle" size={14} color="#2EAD5B" />
            <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
              Reconhecido como “{resolved.name}” ({resolved.category})
            </ThemedText>
          </View>
        ) : (
          <View style={styles.hintRow}>
            <Ionicons name="alert-circle-outline" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
              Não reconhecido no catálogo — será salvo como texto livre.
            </ThemedText>
          </View>
        )
      )}

      {!!error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
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
  optionCat: {
    fontSize: 12,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.one,
  },
  hint: {
    fontSize: 12,
    flex: 1,
  },
  errorText: {
    color: '#D64545',
    fontSize: 12,
    marginTop: Spacing.one,
  },
});
