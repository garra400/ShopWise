import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Product } from '@/types';
import { getStatus, statusColor, daysLabel } from '@/utils/status';
import { formatQuantity } from '@/utils/units';
import { useSettings } from '@/context/SettingsContext';
import { useT } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const theme = useTheme();
  const t = useT();
  const { settings } = useSettings();
  const lang = settings.language === 'en' ? 'en' : 'pt';
  const status = getStatus(product);
  const color = statusColor(status);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.backgroundElement }]}
      activeOpacity={0.75}
    >
      {/* Status stripe */}
      <View style={[styles.stripe, { backgroundColor: color }]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <ThemedText style={styles.name} numberOfLines={1}>
            {product.name}
          </ThemedText>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </View>

        <ThemedText type="small" themeColor="textSecondary" style={styles.category}>
          {product.category ? t('category.' + product.category) : ''}
          {product.quantity != null ? ` · ${formatQuantity(product.quantity, product.unit, settings.measurementSystem, lang)}` : ''}
        </ThemedText>

        <ThemedText style={[styles.days, { color }]} type="small">
          {daysLabel(product, lang)}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: Spacing.two,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  stripe: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
  },
  category: {
    marginTop: 2,
  },
  days: {
    marginTop: Spacing.one,
    fontWeight: '600',
  },
});
