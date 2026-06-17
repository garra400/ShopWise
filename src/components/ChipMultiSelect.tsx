import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export interface ChipOption<T extends string> {
  label: string;
  value: T;
}

interface ChipMultiSelectProps<T extends string> {
  options: ChipOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
}

/**
 * Horizontal wrap of toggle chips for multi-selection.
 * Theme-aware, web-friendly, uses TouchableOpacity (consistent with Segmented).
 */
export function ChipMultiSelect<T extends string>({
  options,
  values,
  onChange,
}: ChipMultiSelectProps<T>) {
  const theme = useTheme();

  function toggle(value: T) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const selected = values.includes(opt.value);
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => toggle(opt.value)}
            activeOpacity={0.75}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? theme.primary : theme.backgroundSelected,
                borderColor: selected ? theme.primary : theme.border,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.label,
                { color: selected ? '#ffffff' : theme.text },
              ]}
            >
              {opt.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
