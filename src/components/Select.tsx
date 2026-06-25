import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useT } from '@/i18n';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Select({ options, value, onChange, placeholder }: SelectProps) {
  const theme = useTheme();
  const t = useT();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={[styles.trigger, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.triggerText}>
          {selected?.label ?? placeholder ?? t('select.placeholder')}
        </ThemedText>
        <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <ScrollView>
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => { onChange(opt.value); setOpen(false); }}
                    style={[
                      styles.option,
                      isSelected && { backgroundColor: theme.backgroundSelected },
                    ]}
                    activeOpacity={0.7}
                  >
                    <ThemedText style={[styles.optionText, isSelected && { color: theme.primary }]}>
                      {opt.label}
                    </ThemedText>
                    {isSelected && <Ionicons name="checkmark" size={16} color={theme.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Spacing.two,
    borderWidth: 1,
    minHeight: 48,
  },
  triggerText: {
    fontSize: 16,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Spacing.three,
    borderWidth: 1,
    maxHeight: 400,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  optionText: {
    fontSize: 16,
  },
});
