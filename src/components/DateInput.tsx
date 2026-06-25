/**
 * DateInput: A web-friendly date input component.
 * Uses a text field accepting dd/MM/yyyy with quick-pick chips.
 * Returns value as ISO yyyy-MM-dd string.
 */
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { parse, format, isValid, addWeeks, addMonths, addYears } from 'date-fns';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useT } from '@/i18n';

interface QuickOption {
  labelKey: string;
  getDate: (from: Date) => Date;
}

const QUICK_OPTIONS: QuickOption[] = [
  { labelKey: 'date.week1', getDate: (d) => addWeeks(d, 1) },
  { labelKey: 'date.month1', getDate: (d) => addMonths(d, 1) },
  { labelKey: 'date.month3', getDate: (d) => addMonths(d, 3) },
  { labelKey: 'date.month6', getDate: (d) => addMonths(d, 6) },
  { labelKey: 'date.year1', getDate: (d) => addYears(d, 1) },
];

interface DateInputProps {
  /** ISO date string (yyyy-MM-dd) or empty */
  value: string;
  /** Called with ISO date string on valid change */
  onChange: (iso: string) => void;
  /** Reference date for quick-pick relative offsets; defaults to today */
  referenceDate?: Date;
  label?: string;
  error?: string;
}

export function DateInput({ value, onChange, referenceDate, label, error }: DateInputProps) {
  const theme = useTheme();
  const t = useT();
  const ref = referenceDate ?? new Date();

  // Display value in dd/MM/yyyy
  const [text, setText] = useState(() => {
    if (value) {
      try {
        return format(parse(value, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
      } catch {
        return '';
      }
    }
    return '';
  });

  // Keep text in sync when value changes externally
  useEffect(() => {
    if (value) {
      try {
        const formatted = format(parse(value, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
        setText(formatted);
      } catch {
        // ignore
      }
    } else {
      // value cleared externally -> clear the text field too
      setText('');
    }
  }, [value]);

  function handleTextChange(raw: string) {
    setText(raw);
    if (raw.length === 10) {
      try {
        const parsed = parse(raw, 'dd/MM/yyyy', new Date());
        if (isValid(parsed)) {
          onChange(format(parsed, 'yyyy-MM-dd'));
        }
      } catch {
        // ignore invalid
      }
    }
  }

  function applyQuick(opt: QuickOption) {
    const date = opt.getDate(ref);
    const iso = format(date, 'yyyy-MM-dd');
    onChange(iso);
    setText(format(date, 'dd/MM/yyyy'));
  }

  return (
    <View style={styles.wrapper}>
      {label && (
        <ThemedText type="small" style={styles.label}>
          {label}
        </ThemedText>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            color: theme.text,
            borderColor: error ? '#D64545' : theme.border,
          },
        ]}
        value={text}
        onChangeText={handleTextChange}
        placeholder={t('date.placeholder')}
        placeholderTextColor={theme.textSecondary}
        maxLength={10}
        keyboardType="numeric"
      />
      {error && (
        <ThemedText style={styles.error}>{error}</ThemedText>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {QUICK_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.labelKey}
            onPress={() => applyQuick(opt)}
            style={[styles.chip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
            activeOpacity={0.7}
          >
            <ThemedText type="small" themeColor="textSecondary">{t(opt.labelKey)}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.one,
  },
  label: {
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 16,
    minHeight: 48,
  },
  error: {
    color: '#D64545',
    fontSize: 12,
  },
  chips: {
    flexDirection: 'row',
    marginTop: Spacing.one,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    marginRight: Spacing.two,
  },
});
