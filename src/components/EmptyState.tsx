import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface EmptyStateProps {
  icon?: string;
  message: string;
  subMessage?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ icon = 'cube-outline', message, subMessage, ctaLabel, onCta }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={56} color={theme.textSecondary} />
      <ThemedText style={styles.message}>{message}</ThemedText>
      {subMessage && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.sub}>
          {subMessage}
        </ThemedText>
      )}
      {ctaLabel && onCta && (
        <Button title={ctaLabel} onPress={onCta} style={styles.cta} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.six,
    gap: Spacing.three,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  sub: {
    textAlign: 'center',
  },
  cta: {
    marginTop: Spacing.two,
    minWidth: 200,
  },
});
