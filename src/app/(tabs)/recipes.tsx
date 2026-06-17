import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/context/ProductsContext';
import { useSettings } from '@/context/SettingsContext';
import { RECIPES } from '@/data/recipes';
import { matchRecipe, sortedRecipeMatches, getAvailableProducts } from '@/utils/recipes';
import { filterByDiet, activeDietFilterSummary } from '@/utils/diet';
import { fetchRecipesByProducts } from '@/services/recipesApi';
import { hasSpoonacular } from '@/config/integrations';
import { StatusColors, Spacing } from '@/constants/theme';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Recipe } from '@/types';

function difficultyLabel(d: 'easy' | 'medium' | 'hard') {
  switch (d) {
    case 'easy': return 'Fácil';
    case 'medium': return 'Médio';
    case 'hard': return 'Difícil';
  }
}

/** De-duplicate by (normalised) title — local recipes take precedence over API ones. */
function dedupeByTitle(recipes: Recipe[]): Recipe[] {
  const seen = new Set<string>();
  return recipes.filter((r) => {
    const key = r.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function RecipesScreen() {
  const theme = useTheme();
  const { products, loading: productsLoading } = useProducts();
  const { settings, loading: settingsLoading } = useSettings();

  const [apiRecipes, setApiRecipes] = useState<Recipe[]>([]);
  const [apiFetching, setApiFetching] = useState(false);

  // Fetch from Spoonacular whenever available products or settings change
  useEffect(() => {
    if (productsLoading || settingsLoading) return;
    if (!hasSpoonacular) return;

    let cancelled = false;
    const available = getAvailableProducts(products);
    const productNames = available.map((p) => p.name);

    setApiFetching(true);
    fetchRecipesByProducts(productNames, {
      dietTags: settings.dietTags,
      allergens: settings.allergens,
    })
      .then((recipes) => {
        if (!cancelled) setApiRecipes(recipes);
      })
      .finally(() => {
        if (!cancelled) setApiFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [products, productsLoading, settings, settingsLoading]);

  if (productsLoading || settingsLoading) {
    return (
      <ScreenContainer>
        <EmptyState icon="hourglass-outline" message="Carregando..." />
      </ScreenContainer>
    );
  }

  const available = getAvailableProducts(products);

  // Merge: local recipes first (so they take precedence in de-dup), then API
  const merged = dedupeByTitle([...RECIPES, ...apiRecipes]);

  // Apply diet/allergen filter 100% locally
  const filtered = filterByDiet(merged, settings);

  // Rank by urgency + match%
  const matches = filtered.map((r) => matchRecipe(r, available));
  const sorted = sortedRecipeMatches(matches);

  const filterSummary = activeDietFilterSummary(settings);
  const hasActiveFilters = settings.dietTags.length > 0 || settings.allergens.length > 0;

  return (
    <ScreenContainer>
      {/* ── Active filter chip ────────────────────────────────────────── */}
      {hasActiveFilters && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          activeOpacity={0.8}
          style={[styles.filterChip, { backgroundColor: theme.primary + '18', borderColor: theme.primary + '40' }]}
        >
          <Ionicons name="options-outline" size={14} color={theme.primary} />
          <ThemedText style={[styles.filterChipText, { color: theme.primary }]} numberOfLines={1}>
            {filterSummary}
          </ThemedText>
          <ThemedText style={[styles.filterChipEdit, { color: theme.primary }]}>Editar</ThemedText>
        </TouchableOpacity>
      )}

      {/* ── API fetch loading indicator (non-blocking) ───────────────── */}
      {apiFetching && (
        <View style={styles.fetchingRow}>
          <ActivityIndicator size="small" color={theme.primary} />
          <ThemedText type="small" themeColor="textSecondary">Buscando receitas online…</ThemedText>
        </View>
      )}

      {/* ── Empty state when diet filter removes everything ───────────── */}
      {sorted.length === 0 && hasActiveFilters && (
        <EmptyState
          icon="nutrition-outline"
          message="Nenhuma receita encontrada"
          subMessage="Os filtros de dieta/alérgenos ativos estão ocultando todas as receitas. Ajuste suas preferências em Configurações."
          ctaLabel="Ir para Configurações"
          onCta={() => router.push('/(tabs)/settings')}
        />
      )}

      {sorted.length === 0 && !hasActiveFilters && (
        <EmptyState
          icon="restaurant-outline"
          message="Nenhuma receita disponível"
          subMessage="Adicione produtos ao estoque para ver sugestões de receitas."
        />
      )}

      {/* ── Recipe list ──────────────────────────────────────────────── */}
      {sorted.length > 0 && (
        <View style={styles.list}>
          {sorted.map(({ recipe, matchPercentage, hasAtRisk, hasExpiringSoon, urgentIngredientName }) => (
            <TouchableOpacity
              key={recipe.id}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
              style={[styles.card, { backgroundColor: theme.backgroundElement }]}
              activeOpacity={0.75}
            >
              <View style={styles.cardHeader}>
                <ThemedText style={styles.title} numberOfLines={1}>{recipe.title}</ThemedText>
                <View style={styles.badgeRow}>
                  {/* Online badge for API-sourced recipes */}
                  {recipe.origin === 'api' && (
                    <View style={[styles.onlineBadge, { backgroundColor: theme.primary + '20' }]}>
                      <Ionicons name="cloud-outline" size={11} color={theme.primary} />
                      <ThemedText style={[styles.onlineText, { color: theme.primary }]}>online</ThemedText>
                    </View>
                  )}
                  <View style={[
                    styles.matchBadge,
                    { backgroundColor: matchPercentage >= 50 ? theme.primary + '20' : theme.backgroundSelected }
                  ]}>
                    <ThemedText style={[styles.matchText, { color: matchPercentage >= 50 ? theme.primary : theme.textSecondary }]}>
                      {matchPercentage}%
                    </ThemedText>
                  </View>
                </View>
              </View>

              {(hasAtRisk || hasExpiringSoon) && urgentIngredientName && (
                <View style={[styles.urgentHint, { backgroundColor: (hasAtRisk ? StatusColors.at_risk : StatusColors.expiring_soon) + '15' }]}>
                  <Ionicons
                    name={hasAtRisk ? 'warning' : 'time'}
                    size={14}
                    color={hasAtRisk ? StatusColors.at_risk : StatusColors.expiring_soon}
                  />
                  <ThemedText
                    style={[styles.urgentText, { color: hasAtRisk ? StatusColors.at_risk : StatusColors.expiring_soon }]}
                  >
                    Usa {urgentIngredientName} que vence em breve
                  </ThemedText>
                </View>
              )}

              <View style={styles.cardMeta}>
                <ThemedText type="small" themeColor="textSecondary">
                  {recipe.prepTime} min · {difficultyLabel(recipe.difficulty)}
                </ThemedText>
                <Ionicons name="chevron-forward" size={14} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one + 1,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: Spacing.two,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  filterChipEdit: {
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  fetchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.one + 2,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
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
  urgentHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
