import { DietTag, Allergen, Recipe, Settings } from '@/types';

/** Portuguese labels for diet tags */
export const DIET_TAG_LABELS: Record<DietTag, string> = {
  vegetariano: 'Vegetariano',
  vegano: 'Vegano',
  sem_gluten: 'Sem Glúten',
  sem_lactose: 'Sem Lactose',
};

/** Portuguese labels for allergens */
export const ALLERGEN_LABELS: Record<Allergen, string> = {
  leite: 'Leite',
  gluten: 'Glúten',
  ovo: 'Ovo',
  amendoim: 'Amendoim',
  frutos_do_mar: 'Frutos do Mar',
  soja: 'Soja',
  castanhas: 'Castanhas',
};

/**
 * Filter a list of recipes based on the user's diet preferences.
 *
 * Rules:
 *  - Allergen exclusion: if `settings.allergens` is non-empty, any recipe whose
 *    `allergens` list intersects the selected allergens is excluded.
 *    Recipes with undefined/empty `allergens` are NOT excluded by this rule
 *    (we don't assume they're safe, but we can't confirm they're unsafe either;
 *    callers can show a disclaimer if needed).
 *  - Diet-tag inclusion: for each selected `dietTag`, only recipes whose `tags`
 *    array includes that tag are kept (AND semantics across multiple selected tags).
 *    Recipes with undefined/empty `tags` do NOT satisfy any diet tag and are
 *    therefore excluded when any diet tag filter is active.
 *
 * This function is pure — no side effects, no Date/random, deterministic output.
 */
export function filterByDiet(recipes: Recipe[], settings: Settings): Recipe[] {
  const { dietTags, allergens } = settings;

  return recipes.filter((recipe) => {
    // --- Allergen exclusion ---
    if (allergens.length > 0 && recipe.allergens && recipe.allergens.length > 0) {
      const hasAllergen = recipe.allergens.some((a) => allergens.includes(a));
      if (hasAllergen) return false;
    }

    // --- Diet-tag inclusion ---
    if (dietTags.length > 0) {
      // If the recipe has no tags at all, it cannot satisfy any diet requirement
      if (!recipe.tags || recipe.tags.length === 0) return false;
      // Every selected tag must be present (AND semantics)
      for (const tag of dietTags) {
        if (!recipe.tags.includes(tag)) return false;
      }
    }

    return true;
  });
}

/** Build a human-readable summary of active diet filters (pt-BR). */
export function activeDietFilterSummary(settings: Settings): string {
  const parts: string[] = [];
  for (const tag of settings.dietTags) {
    parts.push(DIET_TAG_LABELS[tag]);
  }
  for (const allergen of settings.allergens) {
    parts.push(`Sem ${ALLERGEN_LABELS[allergen]}`);
  }
  return parts.join(' · ');
}
