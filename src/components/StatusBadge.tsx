import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ProductStatus } from '@/types';
import { statusColor, statusLabel, statusIcon } from '@/utils/status';
import { Spacing } from '@/constants/theme';

interface StatusBadgeProps {
  status: ProductStatus;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const color = statusColor(status);
  const label = statusLabel(status);
  const icon = statusIcon(status);

  return (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}>
      {showIcon && (
        <Ionicons name={icon as any} size={14} color={color} style={styles.icon} />
      )}
      <ThemedText style={[styles.text, { color }]}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: Spacing.one,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
