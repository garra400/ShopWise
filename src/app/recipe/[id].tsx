import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { goBack } from '@/utils/nav';
import { Ionicons } from '@expo/vector-icons';
import { RECIPES } from '@/data/recipes';
import { apiRecipeCache } from '@/services/recipesApi';
import { communityRecipeCache } from '@/services/recipesRepo';
import { useProducts } from '@/context/ProductsContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useSettings } from '@/context/SettingsContext';
import { useT } from '@/i18n';
import { matchRecipe, getAvailableProducts, ingredientMatchesProduct } from '@/utils/recipes';
import { ingredientDisplayName } from '@/utils/ingredients';
import { formatQuantity } from '@/utils/units';
import { convertMeasure } from '@/utils/measure';
import { dietTagLabel, allergenLabel, cuisineLabel } from '@/utils/diet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RecipeImage } from '@/components/RecipeImage';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { DietTag, Allergen } from '@/types';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const t = useT();
  const { settings } = useSettings();
  const lang = settings.language === 'en' ? 'en' : 'pt';
  const { products, consumeForRecipe } = useProducts();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Resolve recipe: local DB first, then API in-memory cache
  const recipe =
    RECIPES.find((r) => r.id === id) ??
    (id ? apiRecipeCache.get(id) ?? communityRecipeCache.get(id) : undefined);

  if (!recipe) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ThemedText>{t('recipe.notFound')}</ThemedText>
        <Button title={t('common.back')} onPress={goBack} variant="secondary" style={{ marginTop: Spacing.three }} />
      </View>
    );
  }

  const title = lang === 'en' ? recipe.titleEn ?? recipe.title : recipe.title;
  const instructions = lang === 'en' ? recipe.instructionsEn ?? recipe.instructions : recipe.instructions;
  const available = getAvailableProducts(products);
  const match = matchRecipe(recipe, available);

  // Pantry products that match this recipe (for showing the button at all).
  const usableProducts = available.filter((p) =>
    recipe.ingredients.some((ing) => ingredientMatchesProduct(ing, p)),
  );

  // Map each recipe INGREDIENT to one pantry product and deduct its amount via
  // the measurement table (xíc./col./dente/un → the product's unit). If we
  // can't compute a real amount, LEAVE the item untouched — never nuke it.
  const recipeDeductions: { id: string; consume: boolean; quantity?: number }[] = [];
  const deductedProducts: typeof available = [];
  const takenIds = new Set<string>();
  for (const ing of recipe.ingredients) {
    const p = available.find((pr) => !takenIds.has(pr.id) && ingredientMatchesProduct(ing, pr));
    if (!p) continue;
    takenIds.add(p.id);
    const canonical = p.canonicalId ?? ing.canonicalId;

    if (p.quantity == null) {
      // No tracked amount → we know it was used, so mark it consumed.
      deductedProducts.push(p);
      recipeDeductions.push({ id: p.id, consume: true });
      continue;
    }
    if (ing.quantity == null) continue; // recipe didn't say how much → leave as is

    const used = convertMeasure(ing.quantity, ing.unit, p.unit, canonical);
    if (used == null) continue; // units don't reconcile → leave as is (don't nuke)

    const remaining = Math.round((p.quantity - used) * 100) / 100;
    deductedProducts.push(p);
    recipeDeductions.push(remaining > 0.01 ? { id: p.id, consume: false, quantity: remaining } : { id: p.id, consume: true });
  }

  function handleMadeIt() {
    if (usableProducts.length === 0) {
      if (Platform.OS === 'web') window.alert(t('recipe.markDone.none'));
      else Alert.alert(t('recipe.markDone'), t('recipe.markDone.none'));
      return;
    }
    const list = deductedProducts.map((p) => `• ${p.name}`).join('\n');
    const apply = () => {
      consumeForRecipe(recipeDeductions);
      const doneMsg = t(
        deductedProducts.length === 1 ? 'recipe.markDone.done' : 'recipe.markDone.done_other',
        { n: deductedProducts.length },
      );
      if (Platform.OS === 'web') window.alert(doneMsg);
      else Alert.alert(t('recipe.markDone'), doneMsg);
    };
    const confirmMsg = t('recipe.markDone.confirm', { list });
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(confirmMsg)) apply();
      return;
    }
    Alert.alert(t('recipe.markDone'), confirmMsg, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('recipe.markDone.cta'), onPress: apply },
    ]);
  }

  const hasDietInfo =
    (recipe.tags && recipe.tags.length > 0) ||
    (recipe.allergens && recipe.allergens.length > 0);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Hero image */}
      <RecipeImage
        image={recipe.image}
        title={title}
        style={styles.hero}
        iconSize={48}
      />

      {/* Header */}
      <ThemedView type="backgroundElement" style={styles.header}>
        <View style={styles.titleRow}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {recipe.origin === 'api' && (
            <View style={[styles.originBadge, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="cloud-outline" size={12} color={theme.primary} />
              <ThemedText style={[styles.originText, { color: theme.primary }]}>online</ThemedText>
            </View>
          )}
          <TouchableOpacity
            onPress={() => toggleFavorite(recipe.id)}
            hitSlop={10}
            accessibilityLabel={isFavorite(recipe.id) ? t('fav.remove') : t('fav.add')}
          >
            <Ionicons
              name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'}
              size={26}
              color={isFavorite(recipe.id) ? '#E5484D' : theme.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary">{recipe.prepTime} {t('common.min')}</ThemedText>
          </View>
          {recipe.servings != null && (
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={16} color={theme.textSecondary} />
              <ThemedText type="small" themeColor="textSecondary">
                {t(recipe.servings === 1 ? 'recipe.serving' : 'recipe.servings', { n: recipe.servings })}
              </ThemedText>
            </View>
          )}
          <View style={styles.metaItem}>
            <Ionicons name="bar-chart-outline" size={16} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary">{t(`difficulty.${recipe.difficulty}`)}</ThemedText>
          </View>
          {recipe.cuisine && (
            <View style={styles.metaItem}>
              <Ionicons name="globe-outline" size={16} color={theme.textSecondary} />
              <ThemedText type="small" themeColor="textSecondary">{cuisineLabel(recipe.cuisine, lang)}</ThemedText>
            </View>
          )}
          <View style={[styles.matchBadge, { backgroundColor: theme.primary + '20' }]}>
            <ThemedText style={[styles.matchText, { color: theme.primary }]}>
              {t('recipe.available', { p: match.matchPercentage })}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Diet tags + allergen chips */}
      {hasDietInfo && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('recipe.dietInfo')}</ThemedText>
          <View style={styles.chipsRow}>
            {(recipe.tags ?? []).map((tag: DietTag) => (
              <View key={tag} style={[styles.dietChip, { backgroundColor: '#2EAD5B20', borderColor: '#2EAD5B40' }]}>
                <ThemedText style={[styles.dietChipText, { color: '#2EAD5B' }]}>
                  {dietTagLabel(tag, lang)}
                </ThemedText>
              </View>
            ))}
            {(recipe.allergens ?? []).map((allergen: Allergen) => (
              <View key={allergen} style={[styles.dietChip, { backgroundColor: '#D6454520', borderColor: '#D6454540' }]}>
                <ThemedText style={[styles.dietChipText, { color: '#D64545' }]}>
                  {t('recipe.contains', { a: allergenLabel(allergen, lang) })}
                </ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>
      )}

      {/* Ingredients */}
      <ThemedView type="backgroundElement" style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{t('recipe.ingredients')}</ThemedText>
        {recipe.ingredients.map((ing, i) => {
          const have = available.some((p) => ingredientMatchesProduct(ing, p));
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
                {ingredientDisplayName(ing, lang)}
                {ing.quantity != null ? ` — ${formatQuantity(ing.quantity, ing.unit, settings.measurementSystem, lang)}` : ''}
              </ThemedText>
              {!have && (
                <ThemedText type="small" style={styles.missingTag}>{t('recipe.missing')}</ThemedText>
              )}
            </View>
          );
        })}
      </ThemedView>

      {/* Instructions */}
      <ThemedView type="backgroundElement" style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{t('recipe.instructions')}</ThemedText>
        <ThemedText style={styles.instructions}>{instructions}</ThemedText>
      </ThemedView>

      {/* Mark as cooked → use up matching pantry items */}
      {usableProducts.length > 0 && (
        <Button
          title={`✓ ${t('recipe.markDone')}`}
          onPress={handleMadeIt}
        />
      )}

      {/* Source URL for API recipes */}
      {recipe.origin === 'api' && recipe.sourceUrl && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary">
            {t('recipe.source', { url: recipe.sourceUrl })}
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  hero: {
    width: '100%',
    height: 200,
    borderRadius: Spacing.two,
  },
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
