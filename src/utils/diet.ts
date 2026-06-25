import { DietTag, Allergen, CuisineTag, Recipe, Settings } from '@/types';
import { resolveCanonicalId, getIngredient } from '@/utils/ingredients';
import type { Lang } from '@/i18n';

/** Bilingual labels for diet tags (sentence case). */
const DIET_TAG_LABELS_I18N: Record<Lang, Record<DietTag, string>> = {
  pt: { vegetariano: 'Vegetariano', vegano: 'Vegano', sem_gluten: 'Sem glúten', sem_lactose: 'Sem lactose' },
  en: { vegetariano: 'Vegetarian', vegano: 'Vegan', sem_gluten: 'Gluten-free', sem_lactose: 'Lactose-free' },
};

/** Bilingual labels for allergens. */
const ALLERGEN_LABELS_I18N: Record<Lang, Record<Allergen, string>> = {
  pt: { leite: 'Leite', gluten: 'Glúten', ovo: 'Ovo', amendoim: 'Amendoim', frutos_do_mar: 'Frutos do mar', soja: 'Soja', castanhas: 'Castanhas' },
  en: { leite: 'Milk', gluten: 'Gluten', ovo: 'Egg', amendoim: 'Peanut', frutos_do_mar: 'Seafood', soja: 'Soy', castanhas: 'Tree nuts' },
};

/** Bilingual labels for cuisines. */
const CUISINE_LABELS_I18N: Record<Lang, Record<CuisineTag, string>> = {
  pt: { brasileira: 'Brasileira', italiana: 'Italiana', mexicana: 'Mexicana', asiatica: 'Asiática', arabe: 'Árabe', mediterranea: 'Mediterrânea', americana: 'Americana', indiana: 'Indiana' },
  en: { brasileira: 'Brazilian', italiana: 'Italian', mexicana: 'Mexican', asiatica: 'Asian', arabe: 'Arabic', mediterranea: 'Mediterranean', americana: 'American', indiana: 'Indian' },
};

export function dietTagLabel(tag: DietTag, lang: Lang): string {
  return DIET_TAG_LABELS_I18N[lang][tag];
}
export function allergenLabel(allergen: Allergen, lang: Lang): string {
  return ALLERGEN_LABELS_I18N[lang][allergen];
}
export function cuisineLabel(cuisine: CuisineTag, lang: Lang): string {
  return CUISINE_LABELS_I18N[lang][cuisine];
}

/** Ordered cuisine entries for filter chips / pickers, localized. */
export function cuisineEntries(lang: Lang): [CuisineTag, string][] {
  return (Object.keys(CUISINE_LABELS_I18N[lang]) as CuisineTag[]).map((c) => [c, CUISINE_LABELS_I18N[lang][c]]);
}

/** Ordered diet-tag entries for chips / pickers, localized. */
export function dietTagEntries(lang: Lang): [DietTag, string][] {
  return (Object.keys(DIET_TAG_LABELS_I18N[lang]) as DietTag[]).map((d) => [d, DIET_TAG_LABELS_I18N[lang][d]]);
}

/** Ordered allergen entries for chips / pickers, localized. */
export function allergenEntries(lang: Lang): [Allergen, string][] {
  return (Object.keys(ALLERGEN_LABELS_I18N[lang]) as Allergen[]).map((a) => [a, ALLERGEN_LABELS_I18N[lang][a]]);
}

/**
 * Filter recipes by preferred cuisines.
 * - Empty `cuisines` → no filtering (show all).
 * - Otherwise keep recipes whose `cuisine` is in the set. Recipes with an
 *   UNKNOWN cuisine (e.g. from an external API) are kept so we never hide
 *   results we simply couldn't classify.
 */
export function filterByCuisine(recipes: Recipe[], cuisines: CuisineTag[]): Recipe[] {
  if (cuisines.length === 0) return recipes;
  return recipes.filter((r) => !r.cuisine || cuisines.includes(r.cuisine));
}

/**
 * Remove recipes that contain any of the user's avoided ingredients.
 * Each recipe ingredient is resolved to a canonical id (stored or on the fly)
 * and compared against the avoid set.
 */
export function filterByAvoidIngredients(recipes: Recipe[], avoidIds: string[]): Recipe[] {
  if (avoidIds.length === 0) return recipes;
  const avoid = new Set(avoidIds);
  return recipes.filter((recipe) => {
    for (const ing of recipe.ingredients) {
      const id = ing.canonicalId ?? resolveCanonicalId(ing.name);
      if (id && avoid.has(id)) return false;
    }
    return true;
  });
}

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

/** Build a human-readable summary of active diet filters in the given language. */
export function activeDietFilterSummary(settings: Settings, lang: Lang): string {
  const without = lang === 'en' ? 'No' : 'Sem';
  const parts: string[] = [];
  for (const tag of settings.dietTags) {
    parts.push(dietTagLabel(tag, lang));
  }
  for (const allergen of settings.allergens) {
    parts.push(`${without} ${allergenLabel(allergen, lang).toLowerCase()}`);
  }
  // Cuisines are a SOFT preference (they re-rank, not hide) — not listed here.
  for (const id of settings.avoidIngredients) {
    const ing = getIngredient(id);
    const label = ing ? (lang === 'en' ? ing.nameEn : ing.name) : id;
    parts.push(`${without} ${label.toLowerCase()}`);
  }
  return parts.join(' · ');
}
