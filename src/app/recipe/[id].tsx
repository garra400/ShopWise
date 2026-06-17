import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { goBack } from '@/utils/nav';
import { Ionicons } from '@expo/vector-icons';
import { RECIPES } from '@/data/recipes';
import { apiRecipeCache } from '@/services/recipesApi';
import { useProducts } from '@/context/ProductsContext';
import { matchRecipe, getAvailableProducts, ingredientMatchesProduct } from '@/utils/recipes';
import { DIET_TAG_LABELS, ALLERGEN_LABELS } from '@/utils/diet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { DietTag, Allergen } from '@/types';

function difficultyLabel(d: 'easy' | 'medium' | 'hard') {
  switch (d) {
    case 'easy': return 'Fácil';
    case 'medium': return 'Médio';
    case 'hard': return 'Difícil';
  }
}

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { products } = useProducts();

  // Resolve recipe: local DB first, then API in-memory cache
  const recipe =
    RECIPES.find((r) => r.id === id) ??
    (id ? apiRecipeCache.get(id) : undefined);

  if (!recipe) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ThemedText>Receita não encontrada.</ThemedText>
        <Button title="Voltar" onPress={goBack} variant="secondary" style={{ marginTop: Spacing.three }} />
      </View>
    );
  }

  const available = getAvailableProducts(products);
  const match = matchRecipe(recipe, available);

  const hasDietInfo =
    (recipe.tags && recipe.tags.length > 0) ||
    (recipe.allergens && recipe.allergens.length > 0);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <ThemedView type="backgroundElement" style={styles.header}>
        <View style={styles.titleRow}>
          <ThemedText style={styles.title}>{recipe.title}</ThemedText>
          {recipe.origin === 'api' && (
            <View style={[styles.originBadge, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="cloud-outline" size={12} color={theme.primary} />
              <ThemedText style={[styles.originText, { color: theme.primary }]}>online</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary">{recipe.prepTime} min</ThemedText>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="bar-chart-outline" size={16} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary">{difficultyLabel(recipe.difficulty)}</ThemedText>
          </View>
          <View style={[styles.matchBadge, { backgroundColor: theme.primary + '20' }]}>
            <ThemedText style={[styles.matchText, { color: theme.primary }]}>
              {match.matchPercentage}% disponível
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Diet tags + allergen chips */}
      {hasDietInfo && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Informações dietéticas</ThemedText>
          <View style={styles.chipsRow}>
            {(recipe.tags ?? []).map((tag: DietTag) => (
              <View key={tag} style={[styles.dietChip, { backgroundColor: '#2EAD5B20', borderColor: '#2EAD5B40' }]}>
                <ThemedText style={[styles.dietChipText, { color: '#2EAD5B' }]}>
                  {DIET_TAG_LABELS[tag]}
                </ThemedText>
              </View>
            ))}
            {(recipe.allergens ?? []).map((allergen: Allergen) => (
              <View key={allergen} style={[styles.dietChip, { backgroundColor: '#D6454520', borderColor: '#D6454540' }]}>
                <ThemedText style={[styles.dietChipText, { color: '#D64545' }]}>
                  Contém {ALLERGEN_LABELS[allergen]}
                </ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>
      )}

      {/* Ingredients */}
      <ThemedView type="backgroundElement" style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Ingredientes</ThemedText>
        {recipe.ingredients.map((ing, i) => {
          const have = available.some((p) => ingredientMatchesProduct(ing.name, p.name));
          return (
            <View key={i} style={styles.ingredientRow}>
              <Ionicons
                name={have ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={have ? '#2EAD5B' : theme.textSecondary}
              />
              <ThemedText
                style={[
                  styles.ingredientText,
                  have ? { color: theme.text } : { color: theme.textSecondary },
                ]}
              >
                {ing.name}
                {ing.quantity != null ? ` — ${ing.quantity}${ing.unit ? ` ${ing.unit}` : ''}` : ''}
              </ThemedText>
              {!have && (
                <ThemedText type="small" style={styles.missingTag}>faltando</ThemedText>
              )}
            </View>
          );
        })}
      </ThemedView>

      {/* Instructions */}
      <ThemedView type="backgroundElement" style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Modo de preparo</ThemedText>
        <ThemedText style={styles.instructions}>{recipe.instructions}</ThemedText>
      </ThemedView>

      {/* Source URL for API recipes */}
      {recipe.origin === 'api' && recipe.sourceUrl && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary">
            Fonte: {recipe.sourceUrl}
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: Spacing.six,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  originBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.one + 2,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
    marginTop: 4,
  },
  originText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  matchBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  matchText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: Spacing.one,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  dietChip: {
    paddingVertical: Spacing.half + 1,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  dietChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  ingredientText: {
    fontSize: 15,
    flex: 1,
  },
  missingTag: {
    color: '#D64545',
    fontSize: 11,
    fontStyle: 'italic',
  },
  instructions: {
    fontSize: 15,
    lineHeight: 24,
  },
});
