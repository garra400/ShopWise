import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { useProducts } from '@/context/ProductsContext';
import { getStatus } from '@/utils/status';
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

export default function HomeScreen() {
  const theme = useTheme();
  const { products, loading } = useProducts();
  const navigation = useNavigation();

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
        <EmptyState icon="hourglass-outline" message="Carregando..." />
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
      {/* Summary header */}
      <ThemedView type="backgroundElement" style={styles.summary}>
        <StatusSummaryDot color={StatusColors.good} count={goodCount} label="Bom" />
        <StatusSummaryDot color={StatusColors.expiring_soon} count={expiringCount} label="P. Vencer" />
        <StatusSummaryDot color={StatusColors.at_risk} count={atRiskCount} label="Em Risco" />
        <StatusSummaryDot color={StatusColors.expired} count={expiredCount} label="Vencido" />
      </ThemedView>

      {/* Para Vencer banner */}
      {expiringCount > 0 && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/expiring')}
          style={[styles.banner, { backgroundColor: StatusColors.expiring_soon + '20', borderColor: StatusColors.expiring_soon }]}
          activeOpacity={0.8}
        >
          <Ionicons name="time" size={20} color={StatusColors.expiring_soon} />
          <ThemedText style={[styles.bannerText, { color: StatusColors.expiring_soon }]}>
            Você tem {expiringCount} produto{expiringCount !== 1 ? 's' : ''} para vencer →
          </ThemedText>
        </TouchableOpacity>
      )}

      {/* Product list */}
      {sorted.length === 0 ? (
        <EmptyState
          icon="basket-outline"
          message="Sua despensa está vazia"
          subMessage="Adicione produtos para começar a monitorar a validade"
          ctaLabel="Adicionar produto"
          onCta={() => router.push('/add')}
        />
      ) : (
        <View style={styles.list}>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginBottom: Spacing.three,
  },
  summaryItem: {
    alignItems: 'center',
    gap: Spacing.one,
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
