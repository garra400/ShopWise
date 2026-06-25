import { useEffect, useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/context/ProductsContext';
import { useSettings } from '@/context/SettingsContext';
import { useFavorites } from '@/context/FavoritesContext';
import { RECIPES } from '@/data/recipes';
import {
  matchRecipe,
  rankRecipeMatches,
  canMakeNow,
  recipeMatchesQuery,
  getAvailableProducts,
  RecipeMatch,
} from '@/utils/recipes';
import { filterByDiet, filterByAvoidIngredients, filterByCuisine, activeDietFilterSummary, cuisineLabel, cuisineEntries } from '@/utils/diet';
import { fetchRecipesByProducts } from '@/services/recipesApi';
import { fetchCommunityRecipes } from '@/services/recipesRepo';
import { hasSpoonacular, hasSupabase } from '@/config/integrations';
import { useT } from '@/i18n';
import { StatusColors, Spacing, MaxContentWidth } from '@/constants/theme';
import { EmptyState } from '@/components/EmptyState';
import { RecipeImage } from '@/components/RecipeImage';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Recipe, CuisineTag } from '@/types';

const PAGE_SIZE = 12;
const FULL_GREEN = '#2EAD5B';

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
  const t = useT();
  const { products, loading: productsLoading } = useProducts();
  const { settings, loading: settingsLoading } = useSettings();
  const lang = settings.language === 'en' ? 'en' : 'pt';
  const CUISINE_FILTERS = useMemo(() => cuisineEntries(lang), [lang]);
  const { isFavorite, toggleFavorite, favorites } = useFavorites();

  const [apiRecipes, setApiRecipes] = useState<Recipe[]>([]);
  const [apiFetching, setApiFetching] = useState(false);
  const [communityRecipes, setCommunityRecipes] = useState<Recipe[]>([]);

  // Ephemeral, in-screen browse filters (not saved to the profile)
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<CuisineTag | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!hasSupabase) return;
    let cancelled = false;
    fetchCommunityRecipes().then((recipes) => { if (!cancelled) setCommunityRecipes(recipes); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (productsLoading || settingsLoading) return;
    if (!hasSpoonacular) return;
    let cancelled = false;
    const productNames = getAvailableProducts(products).map((p) => p.name);
    setApiFetching(true);
    fetchRecipesByProducts(productNames, { dietTags: settings.dietTags, allergens: settings.allergens })
      .then((recipes) => { if (!cancelled) setApiRecipes(recipes); })
      .finally(() => { if (!cancelled) setApiFetching(false); });
    return () => { cancelled = true; };
  }, [products, productsLoading, settings, settingsLoading]);

  const available = useMemo(() => getAvailableProducts(products), [products]);

  const ranked = useMemo(() => {
    const merged = dedupeByTitle([...RECIPES, ...communityRecipes, ...apiRecipes]);
    let list = filterByAvoidIngredients(filterByDiet(merged, settings), settings.avoidIngredients);
    if (onlyFavorites) list = list.filter((r) => favorites.includes(r.id));
    if (cuisineFilter) list = filterByCuisine(list, [cuisineFilter]);
    if (search.trim()) list = list.filter((r) => recipeMatchesQuery(r, search));
    const matches = list.map((r) => matchRecipe(r, available));
    return rankRecipeMatches(matches, settings.cuisines);
  }, [communityRecipes, apiRecipes, settings, available, cuisineFilter, search, onlyFavorites, favorites]);

  const browsing = !!search.trim() || !!cuisineFilter || onlyFavorites;
  const fullCount = useMemo(() => ranked.filter(canMakeNow).length, [ranked]);

  // Reset pagination whenever the result set changes
  useEffect(() => { setPage(1); }, [search, cuisineFilter, onlyFavorites, settings, communityRecipes, apiRecipes]);

  const visible = useMemo(() => ranked.slice(0, page * PAGE_SIZE), [ranked, page]);

  const filterSummary = activeDietFilterSummary(settings, lang);
  const hasHardFilters =
    settings.dietTags.length > 0 || settings.allergens.length > 0 || settings.avoidIngredients.length > 0;

  function renderCard(match: RecipeMatch) {
    const { recipe, matchPercentage, hasAtRisk, hasExpiringSoon, urgentIngredientName } = match;
    const full = canMakeNow(match);
    const cardTitle = lang === 'en' ? recipe.titleEn ?? recipe.title : recipe.title;
    return (
      <TouchableOpacity
        onPress={() => router.push(`/recipe/${recipe.id}`)}
        style={[styles.card, { backgroundColor: theme.backgroundElement }]}
        activeOpacity={0.75}
      >
        <View>
          <RecipeImage image={recipe.image} title={cardTitle} style={styles.cardImage} iconSize={36} />
          <TouchableOpacity
            onPress={() => toggleFavorite(recipe.id)}
            hitSlop={8}
            style={styles.heartOverlay}
            accessibilityLabel={isFavorite(recipe.id) ? t('fav.remove') : t('fav.add')}
          >
            <Ionicons name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'} size={20} color={isFavorite(recipe.id) ? '#E5484D' : '#ffffff'} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.title} numberOfLines={1}>{cardTitle}</ThemedText>
            <View style={styles.badgeRow}>
              {recipe.origin === 'api' && (
                <View style={[styles.onlineBadge, { backgroundColor: theme.primary + '20' }]}>
                  <Ionicons name="cloud-outline" size={11} color={theme.primary} />
                  <ThemedText style={[styles.onlineText, { color: theme.primary }]}>online</ThemedText>
                </View>
              )}
              {full ? (
                <View style={[styles.matchBadge, { backgroundColor: FULL_GREEN }]}>
                  <Ionicons name="checkmark-circle" size={12} color="#fff" />
                  <ThemedText style={[styles.matchText, { color: '#fff' }]}>{t('recipes.hasAll')}</ThemedText>
                </View>
              ) : (
                <View style={[styles.matchBadge, { backgroundColor: matchPercentage >= 50 ? theme.primary + '20' : theme.backgroundSelected }]}>
                  <ThemedText style={[styles.matchText, { color: matchPercentage >= 50 ? theme.primary : theme.textSecondary }]}>{matchPercentage}%</ThemedText>
                </View>
              )}
            </View>
          </View>

          {(hasAtRisk || hasExpiringSoon) && urgentIngredientName && (
            <View style={[styles.urgentHint, { backgroundColor: (hasAtRisk ? StatusColors.at_risk : StatusColors.expiring_soon) + '15' }]}>
              <Ionicons name={hasAtRisk ? 'warning' : 'time'} size={14} color={hasAtRisk ? StatusColors.at_risk : StatusColors.expiring_soon} />
              <ThemedText style={[styles.urgentText, { color: hasAtRisk ? StatusColors.at_risk : StatusColors.expiring_soon }]}>
                {t('recipes.urgent', { name: urgentIngredientName })}
              </ThemedText>
            </View>
          )}

          <View style={styles.cardMeta}>
            <ThemedText type="small" themeColor="textSecondary">
              {recipe.prepTime} {t('common.min')} · {t(`difficulty.${recipe.difficulty}`)}
              {recipe.cuisine ? ` · ${cuisineLabel(recipe.cuisine, lang)}` : ''}
            </ThemedText>
            <Ionicons name="chevron-forward" size={14} color={theme.textSecondary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const ListHeader = (
    <View>
      <View style={[styles.searchBar, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Ionicons name="search" size={16} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          value={search}
          onChangeText={setSearch}
          placeholder={t('recipes.search')}
          placeholderTextColor={theme.textSecondary}
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsRow}>
        <Chip label={t('recipes.favorites')} icon={onlyFavorites ? 'heart' : 'heart-outline'} active={onlyFavorites} activeColor="#E5484D" onPress={() => setOnlyFavorites((v) => !v)} theme={theme} />
        <Chip label={t('recipes.all')} active={!cuisineFilter && !onlyFavorites} onPress={() => { setCuisineFilter(null); setOnlyFavorites(false); }} theme={theme} />
        {CUISINE_FILTERS.map(([value, label]) => (
          <Chip key={value} label={label} active={cuisineFilter === value} onPress={() => setCuisineFilter(cuisineFilter === value ? null : value)} theme={theme} />
        ))}
      </ScrollView>

      {hasHardFilters && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          activeOpacity={0.8}
          style={[styles.filterChip, { backgroundColor: theme.primary + '18', borderColor: theme.primary + '40' }]}
        >
          <Ionicons name="options-outline" size={14} color={theme.primary} />
          <ThemedText style={[styles.filterChipText, { color: theme.primary }]} numberOfLines={1}>{filterSummary}</ThemedText>
          <ThemedText style={[styles.filterChipEdit, { color: theme.primary }]}>{t('common.edit')}</ThemedText>
        </TouchableOpacity>
      )}

      {apiFetching && (
        <View style={styles.fetchingRow}>
          <ActivityIndicator size="small" color={theme.primary} />
          <ThemedText type="small" themeColor="textSecondary">{t('recipes.fetching')}</ThemedText>
        </View>
      )}

      {!browsing && fullCount > 0 && (
        <View style={styles.sectionHeader}>
          <Ionicons name="sparkles" size={15} color={FULL_GREEN} />
          <ThemedText style={[styles.sectionTitle, { color: FULL_GREEN }]}>
            {t(fullCount === 1 ? 'recipes.section_one' : 'recipes.section_other', { n: fullCount })}
          </ThemedText>
        </View>
      )}
    </View>
  );

  if (productsLoading || settingsLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <EmptyState icon="hourglass-outline" message={t('common.loading')} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <FlatList
        data={visible}
        keyExtractor={(m) => m.recipe.id}
        renderItem={({ item }) => renderCard(item)}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.two }} />}
        ListEmptyComponent={
          browsing ? (
            <EmptyState
              icon={onlyFavorites ? 'heart-outline' : 'search-outline'}
              message={onlyFavorites ? t('recipes.empty.favTitle') : t('recipes.empty.searchTitle')}
              subMessage={onlyFavorites ? t('recipes.empty.favSub') : t('recipes.empty.searchSub')}
            />
          ) : hasHardFilters ? (
            <EmptyState
              icon="nutrition-outline"
              message={t('recipes.empty.filterTitle')}
              subMessage={t('recipes.empty.filterSub')}
              ctaLabel={t('recipes.empty.filterCta')}
              onCta={() => router.push('/(tabs)/settings')}
            />
          ) : (
            <EmptyState
              icon="restaurant-outline"
              message={t('recipes.empty.noneTitle')}
              subMessage={t('recipes.empty.noneSub')}
            />
          )
        }
        onEndReached={() => { if (visible.length < ranked.length) setPage((p) => p + 1); }}
        onEndReachedThreshold={0.6}
        ListFooterComponent={visible.length < ranked.length ? <ActivityIndicator style={{ marginVertical: Spacing.three }} color={theme.primary} /> : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
}

function Chip({
  label, active, onPress, theme, icon, activeColor,
}: {
  label: string; active: boolean; onPress: () => void; theme: ReturnType<typeof useTheme>;
  icon?: keyof typeof Ionicons.glyphMap; activeColor?: string;
}) {
  const bg = active ? (activeColor ?? theme.primary) : theme.backgroundSelected;
  const fg = active ? '#ffffff' : theme.text;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={[styles.chip, styles.chipInline, { backgroundColor: bg, borderColor: active ? bg : theme.border }]}>
      {icon && <Ionicons name={icon} size={13} color={fg} />}
      <ThemedText style={[styles.chipLabel, { color: fg }]}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  listContent: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', padding: Spacing.three, paddingBottom: Spacing.six },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.three, minHeight: 44, marginBottom: Spacing.two },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: Spacing.two },
  chipsScroll: { marginBottom: Spacing.two, flexGrow: 0 },
  chipsRow: { gap: Spacing.one + 2, paddingRight: Spacing.three },
  chip: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.three, borderRadius: 20, borderWidth: 1 },
  chipInline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chipLabel: { fontSize: 13, fontWeight: '500' },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one + 1, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start', marginBottom: Spacing.two },
  filterChipText: { fontSize: 13, fontWeight: '500', flexShrink: 1 },
  filterChipEdit: { fontSize: 12, fontWeight: '600', textDecorationLine: 'underline' },
  fetchingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.two },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginBottom: Spacing.two },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  card: { borderRadius: Spacing.two, overflow: 'hidden' },
  cardImage: { width: '100%', height: 130 },
  cardBody: { padding: Spacing.three, gap: Spacing.two },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  title: { fontWeight: '600', fontSize: 16, flex: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: Spacing.one + 2, paddingVertical: Spacing.half, borderRadius: Spacing.two },
  onlineText: { fontSize: 11, fontWeight: '600' },
  matchBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: Spacing.two, paddingVertical: Spacing.half, borderRadius: Spacing.two },
  matchText: { fontSize: 13, fontWeight: '700' },
  urgentHint: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one, borderRadius: Spacing.one },
  urgentText: { fontSize: 12, fontWeight: '500' },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heartOverlay: { position: 'absolute', top: Spacing.two, right: Spacing.two, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
});
