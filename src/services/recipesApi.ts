/**
 * Spoonacular API adapter — free tier.
 *
 * When EXPO_PUBLIC_SPOONACULAR_API_KEY is absent the function returns [] immediately
 * so the caller falls back to the local recipe database.
 * All errors are swallowed; the function never throws to the UI.
 */

import { Recipe, DietTag, Allergen } from '@/types';
import { SPOONACULAR_API_KEY, hasSpoonacular } from '@/config/integrations';

// ---------------------------------------------------------------------------
// In-memory cache: populated during fetchRecipesByProducts, read by detail screen
// ---------------------------------------------------------------------------
export const apiRecipeCache = new Map<string, Recipe>();

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

/** Map our DietTag values to Spoonacular "diet" query param strings. */
function mapDietTags(tags: DietTag[]): string {
  return tags
    .map((t) => {
      switch (t) {
        case 'vegetariano': return 'vegetarian';
        case 'vegano': return 'vegan';
        case 'sem_gluten': return 'gluten free';
        case 'sem_lactose': return ''; // handled via intolerances
      }
    })
    .filter(Boolean)
    .join(',');
}

/** Map our Allergen values to Spoonacular "intolerances" query param strings. */
function mapAllergens(allergens: Allergen[], dietTags: DietTag[]): string {
  const parts: string[] = [];
  for (const a of allergens) {
    switch (a) {
      case 'leite': parts.push('dairy'); break;
      case 'gluten': parts.push('gluten'); break;
      case 'ovo': parts.push('egg'); break;
      case 'amendoim': parts.push('peanut'); break;
      case 'frutos_do_mar': parts.push('seafood', 'shellfish'); break;
      case 'soja': parts.push('soy'); break;
      case 'castanhas': parts.push('tree nut'); break;
    }
  }
  // sem_lactose diet tag also maps to dairy intolerance
  if (dietTags.includes('sem_lactose') && !parts.includes('dairy')) {
    parts.push('dairy');
  }
  return [...new Set(parts)].join(',');
}

/** Heuristic difficulty from readyInMinutes */
function difficultyFromMinutes(minutes: number): 'easy' | 'medium' | 'hard' {
  if (minutes <= 20) return 'easy';
  if (minutes <= 45) return 'medium';
  return 'hard';
}

/** Strip HTML tags from a string */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Spoonacular response shapes (minimal — only the fields we use)
// ---------------------------------------------------------------------------

interface SpoonacularIngredient {
  name: string;
  amount?: number;
  unit?: string;
}

interface SpoonacularStep {
  step: string;
}

interface SpoonacularInstructionBlock {
  steps: SpoonacularStep[];
}

interface SpoonacularRecipe {
  id: number;
  title: string;
  readyInMinutes: number;
  image?: string;
  sourceUrl?: string;
  summary?: string;
  extendedIngredients?: SpoonacularIngredient[];
  usedIngredients?: SpoonacularIngredient[];
  missedIngredients?: SpoonacularIngredient[];
  analyzedInstructions?: SpoonacularInstructionBlock[];
  diets?: string[];
}

interface SpoonacularSearchResponse {
  results: SpoonacularRecipe[];
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

function toRecipe(
  raw: SpoonacularRecipe,
  requestedDietTags: DietTag[],
  requestedAllergens: Allergen[],
): Recipe {
  // Gather ingredients
  const ingredientSource: SpoonacularIngredient[] =
    raw.extendedIngredients ??
    [
      ...(raw.usedIngredients ?? []),
      ...(raw.missedIngredients ?? []),
    ];

  const ingredients = ingredientSource.map((ing) => ({
    name: ing.name,
    quantity: ing.amount,
    unit: ing.unit || undefined,
  }));

  // Instructions
  let instructions = '';
  if (raw.analyzedInstructions && raw.analyzedInstructions.length > 0) {
    instructions = raw.analyzedInstructions
      .flatMap((block) => block.steps.map((s) => s.step))
      .join(' ');
  } else if (raw.summary) {
    instructions = stripHtml(raw.summary);
  }

  // Tags: best-effort from the diet params we requested + what Spoonacular returns
  const tags: DietTag[] = [...requestedDietTags];

  // Allergens: we requested exclusion, so we assume the recipe is clear of those —
  // but mark allergens that were NOT excluded as potentially present if Spoonacular
  // doesn't report them. Here we just store what we KNOW to be absent as empty.
  // The safest approach: store requestedAllergens as empty (excluded from search),
  // other allergens unknown — leave allergens array empty to not false-positive filter.
  const allergens: Allergen[] = [];

  const recipe: Recipe = {
    id: `api-${raw.id}`,
    title: raw.title,
    ingredients,
    instructions,
    prepTime: raw.readyInMinutes,
    difficulty: difficultyFromMinutes(raw.readyInMinutes),
    tags: [...new Set(tags)],
    allergens,
    origin: 'api',
    sourceUrl: raw.sourceUrl,
    image: raw.image,
  };

  return recipe;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Fetch recipes from Spoonacular that match the given product names and diet opts.
 * Returns [] when no API key is configured or on any error.
 */
export async function fetchRecipesByProducts(
  productNames: string[],
  opts: { dietTags: DietTag[]; allergens: Allergen[] },
): Promise<Recipe[]> {
  if (!hasSpoonacular) return [];

  try {
    const url = new URL('https://api.spoonacular.com/recipes/complexSearch');
    url.searchParams.set('apiKey', SPOONACULAR_API_KEY);

    // Cap to 5 ingredient names to stay within URL/query limits
    const cappedIngredients = productNames.slice(0, 5).join(',');
    if (cappedIngredients) {
      url.searchParams.set('includeIngredients', cappedIngredients);
    }

    const diet = mapDietTags(opts.dietTags);
    if (diet) url.searchParams.set('diet', diet);

    const intolerances = mapAllergens(opts.allergens, opts.dietTags);
    if (intolerances) url.searchParams.set('intolerances', intolerances);

    url.searchParams.set('addRecipeInformation', 'true');
    url.searchParams.set('fillIngredients', 'true');
    url.searchParams.set('number', '12');

    const response = await fetch(url.toString());
    if (!response.ok) return [];

    const data = (await response.json()) as SpoonacularSearchResponse;
    if (!Array.isArray(data.results)) return [];

    const recipes = data.results.map((r) =>
      toRecipe(r, opts.dietTags, opts.allergens),
    );

    // Populate in-memory cache so the detail screen can find them by id
    for (const recipe of recipes) {
      apiRecipeCache.set(recipe.id, recipe);
    }

    return recipes;
  } catch {
    // Never propagate errors to UI
    return [];
  }
}
