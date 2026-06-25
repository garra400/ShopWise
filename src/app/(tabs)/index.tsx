import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { useProducts } from '@/context/ProductsContext';
import { useSync } from '@/context/SyncContext';
import { getStatus, statusLabel } from '@/utils/status';
import { useT } from '@/i18n';
import { useSettings } from '@/context/SettingsContext';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { StatusColors } from '@/constants/theme';
import { Product } from '@/types';

function StatusSummaryDot({ color, count, label }: { color: string; count: number; label: string }) {
  return (
    <View style={styles.summaryItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <ThemedText type="small">{count}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
    </View>
  );
}

function Shortcut({
  theme, icon, label, onPress,
}: {
  theme: ReturnType<typeof useTheme>;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.shortcut, { backgroundColor: theme.backgroundElement }]}
    >
      <Ionicons name={icon} size={22} color={theme.primary} />
      <ThemedText type="small" style={styles.shortcutLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const { products, loading } = useProducts();
  const { user, enabled } = useSync();
  const navigation = useNavigation();
  const t = useT();
  const { settings } = useSettings();
  const lang = settings.language === 'en' ? 'en' : 'pt';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push('/add')}
          style={{ marginRight: Spacing.three }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="add-circle" size={28} color={theme.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  if (loading) {
    return (
      <ScreenContainer>
        <EmptyState icon="hourglass-outline" message={t('common.loading')} />
      </ScreenContainer>
    );
  }

  // Exclude consumed and expiring_soon (expiring_soon goes to Para Vencer tab)
  const visible = products.filter((p) => {
    if (p.consumed) return false;
    const s = getStatus(p);
    return s !== 'expiring_soon';
  });

  const expiringCount = products.filter((p) => !p.consumed && getStatus(p) === 'expiring_soon').length;
  const goodCount = visible.filter((p) => getStatus(p) === 'good').length;
  const atRiskCount = visible.filter((p) => getStatus(p) === 'at_risk').length;
  const expiredCount = visible.filter((p) => getStatus(p) === 'expired').length;

  // Sort: expired first, then at_risk, then good; within group by soonest expiry
  const statusOrder: Record<string, number> = { expired: 0, at_risk: 1, good: 2 };
  const sorted = [...visible].sort((a, b) => {
    const sa = getStatus(a);
    const sb = getStatus(b);
    const orderDiff = (statusOrder[sa] ?? 99) - (statusOrder[sb] ?? 99);
    if (orderDiff !== 0) return orderDiff;
    return a.expiryDate.localeCompare(b.expiryDate);
  });

  return (
    <ScreenContainer>
      {/* Dashboard panel: headline + status tiles */}
      <ThemedView type="backgroundElement" style={styles.summary}>
        <ThemedText
          style={[
            styles.panelTitle,
            { color: expiringCount + atRiskCount + expiredCount === 0 ? StatusColors.good : StatusColors.at_risk },
          ]}
        >
          {expiringCount + atRiskCount + expiredCount === 0
            ? t('home.allGood')
            : t('home.summaryLine', { e: expiringCount, r: atRiskCount })}
        </ThemedText>
        <View style={styles.statsRow}>
          <StatusSummaryDot color={StatusColors.good} count={goodCount} label={statusLabel('good', lang)} />
          <StatusSummaryDot color={StatusColors.expiring_soon} count={expiringCount} label={statusLabel('expiring_soon', lang)} />
          <StatusSummaryDot color={StatusColors.at_risk} count={atRiskCount} label={statusLabel('at_risk', lang)} />
          <StatusSummaryDot color={StatusColors.expired} count={expiredCount} label={statusLabel('expired', lang)} />
        </View>
      </ThemedView>

      {/* Quick shortcuts */}
      <View style={styles.shortcutsRow}>
        <Shortcut theme={theme} icon="add-circle-outline" label={t('home.shortcut.add')} onPress={() => router.push('/add')} />
        <Shortcut theme={theme} icon="restaurant-outline" label={t('home.shortcut.recipes')} onPress={() => router.push('/(tabs)/recipes')} />
        <Shortcut theme={theme} icon="time-outline" label={t('home.shortcut.expiring')} onPress={() => router.push('/(tabs)/expiring')} />
      </View>

      {/* Guest-mode hint (only when cloud sync is available and not signed in) */}
      {enabled && !user && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          style={[styles.guestBanner, { backgroundColor: theme.primary + '14', borderColor: theme.primary + '40' }]}
          activeOpacity={0.8}
        >
          <Ionicons name="person-circle-outline" size={20} color={theme.primary} />
          <ThemedText style={[styles.guestText, { color: theme.primary }]} numberOfLines={1}>
            {t('home.guestBanner')}
          </ThemedText>
          <Ionicons name="chevron-forward" size={16} color={theme.primary} />
        </TouchableOpacity>
      )}

      {/* Para Vencer banner */}
      {expiringCount > 0 && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/expiring')}
          style={[styles.banner, { backgroundColor: StatusColors.expiring_soon + '20', borderColor: StatusColors.expiring_soon }]}
          activeOpacity={0.8}
        >
          <Ionicons name="time" size={20} color={StatusColors.expiring_soon} />
          <ThemedText style={[styles.bannerText, { color: StatusColors.expiring_soon }]}>
            {t(expiringCount === 1 ? 'home.banner_one' : 'home.banner_other', { n: expiringCount })}
          </ThemedText>
        </TouchableOpacity>
      )}

      {/* Product list */}
      {sorted.length === 0 ? (
        <EmptyState
          icon="basket-outline"
          message={t('home.empty')}
          subMessage={t('home.empty.sub')}
          ctaLabel={t('route.add')}
          onCta={() => router.push('/add')}
        />
      ) : (
        <View style={styles.list}>
          <ThemedText style={styles.sectionTitle}>{t('home.section')}</ThemedText>
          {sorted.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product/${product.id}`)}
            />
          ))}
        </View>
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push('/add')}
        style={[styles.fab, { backgroundColor: theme.primary }]}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summary: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginBottom: Spacing.three,
    gap: Spacing.three,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  shortcut: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
  },
  shortcutLabel: {
    fontWeight: '600',
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  guestText: {
    flex: 1,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: Spacing.one,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  bannerText: {
    fontWeight: '600',
    fontSize: 15,
  },
  list: {
    gap: Spacing.one,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.five,
    right: Spacing.three,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
