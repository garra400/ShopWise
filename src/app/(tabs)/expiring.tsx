import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useProducts } from '@/context/ProductsContext';
import { getStatus } from '@/utils/status';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Spacing } from '@/constants/theme';

export default function ExpiringScreen() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <ScreenContainer>
        <EmptyState icon="hourglass-outline" message="Carregando..." />
      </ScreenContainer>
    );
  }

  const expiring = products
    .filter((p) => !p.consumed && getStatus(p) === 'expiring_soon')
    .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));

  if (expiring.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="checkmark-circle-outline"
          message="Nenhum produto para vencer"
          subMessage="Produtos que vencem em 7–30 dias aparecerão aqui"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.list}>
        {expiring.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => router.push(`/product/${product.id}`)}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.one,
  },
});
