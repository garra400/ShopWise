import { useEffect, useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/context/ProductsContext';
import { useSettings } from '@/context/SettingsContext';
import { useFavorites } from '@/context/FavoritesContext';
import { RECIPES } from '@/data/recipes';
import {
  matchRecipe,
  rankRecipeMatches,
  isPreferredMatch,
  recipeMatchesQuery,
  getAvailableProducts,
  RecipeMatch,
} from '@/utils/recipes';
import { filterByDiet, filterByAvoidIngredients, filterByCuisine, activeDietFilterSummary, CUISINE_LABELS } from '@/utils/diet';
import { fetchRecipesByProducts } from '@/services/recipesApi';
import { fetchCommunityRecipes } from '@/services/recipesRepo';
import { hasSpoonacular, hasSupabase } from '@/config/integrations';
import { StatusColors, Spacing } from '@/constants/theme';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { RecipeImage } from '@/components/RecipeImage';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Recipe, CuisineTag } from '@/types';

const CUISINE_FILTERS = Object.entries(CUISINE_LABELS) as [CuisineTag, string][];

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
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const [apiRecipes, setApiRecipes] = useState<Recipe[]>([]);
  const [apiFetching, setApiFetching] = useState(false);
  const [communityRecipes, setCommunityRecipes] = useState<Recipe[]>([]);

  // Ephemeral, in-screen browse filters (not saved to the profile)
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<CuisineTag | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Load the shared community catalog once (independent of the user's stock).
  useEffect(() => {
    if (!hasSupabase) return;
    let cancelled = false;
    fetchCommunityRecipes().then((recipes) => {
      if (!cancelled) setCommunityRecipes(recipes);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const available = useMemo(() => getAvailableProducts(products), [products]);

  // Build the ranked list. Hard filters (diet/allergen/avoid) hide; cuisine
  // preference only re-ranks. The chip and search are ephemeral browse filters.
  const { ranked, forYou, others } = useMemo(() => {
    const merged = dedupeByTitle([...RECIPES, ...communityRecipes, ...apiRecipes]);

    // Hard filters (safety / non-negotiable)
    let list = filterByAvoidIngredients(filterByDiet(merged, settings), settings.avoidIngredients);

    // Ephemeral browse filters
    if (onlyFavorites) list = list.filter((r) => favorites.includes(r.id));
    if (cuisineFilter) list = filterByCuisine(list, [cuisineFilter]);
    if (search.trim()) list = list.filter((r) => recipeMatchesQuery(r, search));

    const matches = list.map((r) => matchRecipe(r, available));
    const rankedMatches = rankRecipeMatches(matches, settings.cuisines);

    const browsing = !!search.trim() || !!cuisineFilter || onlyFavorites;
    if (browsing) {
      return { ranked: rankedMatches, forYou: [] as RecipeMatch[], others: [] as RecipeMatch[] };
    }
    const fy: RecipeMatch[] = [];
    const ot: RecipeMatch[] = [];
    for (const m of rankedMatches) {
      (isPreferredMatch(m, settings.cuisines) ? fy : ot).push(m);
    }
    return { ranked: rankedMatches, forYou: fy, others: ot };
  }, [communityRecipes, apiRecipes, settings, available, cuisineFilter, search, onlyFavorites, favorites]);

  if (productsLoading || settingsLoading) {
    return (
      <ScreenContainer>
        <EmptyState icon="hourglass-outline" message="Carregando..." />
      </ScreenContainer>
    );
  }

  const browsing = !!search.trim() || !!cuisineFilter || onlyFavorites;
  const showSections = !browsing && forYou.length > 0 && others.length > 0;

  const filterSummary = activeDietFilterSummary(settings);
  const hasHardFilters =
    settings.dietTags.length > 0 ||
    settings.allergens.length > 0 ||
    settings.avoidIngredients.length > 0;

  function renderCard(match: RecipeMatch) {
    const { recipe, matchPercentage, hasAtRisk, hasExpiringSoon, urgentIngredientName } = match;
    return (
      <TouchableOpacity
        key={recipe.id}
        onPress={() => router.push(`/recipe/${recipe.id}`)}
        style={[styles.card, { backgroundColor: theme.backgroundElement }]}
        activeOpacity={0.75}
      >
        <View>
          <RecipeImage image={recipe.image} title={recipe.title} style={styles.cardImage} iconSize={36} />
          <TouchableOpacity
            onPress={() => toggleFavorite(recipe.id)}
            hitSlop={8}
            style={styles.heartOverlay}
            accessibilityLabel={isFavorite(recipe.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Ionicons
              name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite(recipe.id) ? '#E5484D' : '#ffffff'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.title} numberOfLines={1}>{recipe.title}</ThemedText>
            <View style={styles.badgeRow}>
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
              {recipe.cuisine ? ` · ${CUISINE_LABELS[recipe.cuisine]}` : ''}
            </ThemedText>
            <Ionicons name="chevron-forward" size={14} color={theme.textSecondary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <ScreenContainer>
      {/* ── Search ──────────────────────────────────────────────────────── */}
      <View style={[styles.searchBar, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Ionicons name="search" size={16} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar receita ou ingrediente..."
          placeholderTextColor={theme.textSecondary}
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Cuisine quick chips (horizontal scroll) ─────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsRow}
      >
        <Chip
          label="Favoritos"
          icon={onlyFavorites ? 'heart' : 'heart-outline'}
          active={onlyFavorites}
          activeColor="#E5484D"
          onPress={() => setOnlyFavorites((v) => !v)}
          theme={theme}
        />
        <Chip label="Tudo" active={!cuisineFilter && !onlyFavorites} onPress={() => { setCuisineFilter(null); setOnlyFavorites(false); }} theme={theme} />
        {CUISINE_FILTERS.map(([value, label]) => (
          <Chip
            key={value}
            label={label}
            active={cuisineFilter === value}
            onPress={() => setCuisineFilter(cuisineFilter === value ? null : value)}
            theme={theme}
          />
        ))}
      </ScrollView>

      {/* ── Active hard-filter indicator ────────────────────────────────── */}
      {hasHardFilters && (
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

      {/* ── API fetch loading indicator (non-blocking) ──────────────────── */}
      {apiFetching && (
        <View style={styles.fetchingRow}>
          <ActivityIndicator size="small" color={theme.primary} />
          <ThemedText type="small" themeColor="textSecondary">Buscando receitas online…</ThemedText>
        </View>
      )}

      {/* ── Empty states ────────────────────────────────────────────────── */}
      {ranked.length === 0 && onlyFavorites && (
        <EmptyState
          icon="heart-outline"
          message="Sem favoritos ainda"
          subMessage="Toque no coração de uma receita para salvá-la aqui."
        />
      )}

      {ranked.length === 0 && browsing && !onlyFavorites && (
        <EmptyState
          icon="search-outline"
          message="Nada encontrado"
          subMessage="Nenhuma receita para esta busca ou cozinha. Tente outro termo ou toque em “Tudo”."
        />
      )}

      {ranked.length === 0 && !browsing && hasHardFilters && (
        <EmptyState
          icon="nutrition-outline"
          message="Nenhuma receita encontrada"
          subMessage="Os filtros de dieta, alérgenos ou ingredientes evitados estão ocultando todas as receitas. Ajuste em Configurações."
          ctaLabel="Ir para Configurações"
          onCta={() => router.push('/(tabs)/settings')}
        />
      )}

      {ranked.length === 0 && !browsing && !hasHardFilters && (
        <EmptyState
          icon="restaurant-outline"
          message="Nenhuma receita disponível"
          subMessage="Adicione produtos ao estoque para ver sugestões de receitas."
        />
      )}

      {/* ── Lists ───────────────────────────────────────────────────────── */}
      {ranked.length > 0 && showSections && (
        <>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={15} color={theme.primary} />
            <ThemedText style={[styles.sectionTitle, { color: theme.primary }]}>Pra você</ThemedText>
          </View>
          <View style={styles.list}>{forYou.map(renderCard)}</View>

          <View style={[styles.sectionHeader, { marginTop: Spacing.three }]}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>Outras receitas</ThemedText>
          </View>
          <View style={styles.list}>{others.map(renderCard)}</View>
        </>
      )}

      {ranked.length > 0 && !showSections && (
        <View style={styles.list}>{ranked.map(renderCard)}</View>
      )}
    </ScreenContainer>
  );
}

function Chip({
  label,
  active,
  onPress,
  theme,
  icon,
  activeColor,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
  icon?: keyof typeof Ionicons.glyphMap;
  activeColor?: string;
}) {
  const bg = active ? (activeColor ?? theme.primary) : theme.backgroundSelected;
  const fg = active ? '#ffffff' : theme.text;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.chip, styles.chipInline, { backgroundColor: bg, borderColor: active ? bg : theme.border }]}
    >
      {icon && <Ionicons name={icon} size={13} color={fg} />}
      <ThemedText style={[styles.chipLabel, { color: fg }]}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    minHeight: 44,
    marginBottom: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.two,
  },
  chipsScroll: {
    marginBottom: Spacing.two,
    flexGrow: 0,
  },
  chipsRow: {
    gap: Spacing.one + 2,
    paddingRight: Spacing.three,
  },
  chip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartOverlay: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
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
    flexShrink: 1,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 130,
  },
  cardBody: {
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
