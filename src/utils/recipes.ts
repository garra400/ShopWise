import { Recipe, Product, CuisineTag } from '@/types';
import { getStatus } from '@/utils/status';
import { sameIngredient, normalizeIngredient } from '@/utils/ingredients';

export interface RecipeMatch {
  recipe: Recipe;
  matchedCount: number;
  totalCount: number;
  matchPercentage: number;
  hasAtRisk: boolean;
  hasExpiringSoon: boolean;
  matchedProductNames: string[];
  urgentIngredientName?: string;
}

/**
 * Returns true if an ingredient and a product refer to the same thing.
 *
 * Prefers canonical-id equality (controlled vocabulary, unambiguous), resolves
 * names on the fly when ids are missing, and only falls back to substring as a
 * last resort. Overloaded to accept either bare names (legacy callers) or full
 * objects carrying `canonicalId`.
 */
export function ingredientMatchesProduct(
  ingredient: string | { name: string; canonicalId?: string },
  product: string | { name: string; canonicalId?: string },
): boolean {
  const ing = typeof ingredient === 'string' ? { name: ingredient } : ingredient;
  const prod = typeof product === 'string' ? { name: product } : product;
  return sameIngredient(ing, prod);
}

/** Compute match info for a single recipe against available products */
export function matchRecipe(recipe: Recipe, availableProducts: Product[]): RecipeMatch {
  let matchedCount = 0;
  let hasAtRisk = false;
  let hasExpiringSoon = false;
  const matchedProductNames: string[] = [];
  let urgentIngredientName: string | undefined;

  for (const ingredient of recipe.ingredients) {
    const matchedProduct = availableProducts.find((p) =>
      ingredientMatchesProduct(ingredient, p)
    );
    if (matchedProduct) {
      matchedCount++;
      matchedProductNames.push(matchedProduct.name);
      const status = getStatus(matchedProduct);
      if (status === 'at_risk') {
        hasAtRisk = true;
        urgentIngredientName = urgentIngredientName ?? matchedProduct.name;
      } else if (status === 'expiring_soon') {
        hasExpiringSoon = true;
        urgentIngredientName = urgentIngredientName ?? matchedProduct.name;
      }
    }
  }

  const totalCount = recipe.ingredients.length;
  const matchPercentage = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;

  return {
    recipe,
    matchedCount,
    totalCount,
    matchPercentage,
    hasAtRisk,
    hasExpiringSoon,
    matchedProductNames,
    urgentIngredientName,
  };
}

/** Sort recipes: at_risk first, then expiring_soon, then by matchPercentage desc */
export function sortedRecipeMatches(matches: RecipeMatch[]): RecipeMatch[] {
  return [...matches].sort((a, b) => {
    if (a.hasAtRisk && !b.hasAtRisk) return -1;
    if (!a.hasAtRisk && b.hasAtRisk) return 1;
    if (a.hasExpiringSoon && !b.hasExpiringSoon) return -1;
    if (!a.hasExpiringSoon && b.hasExpiringSoon) return 1;
    return b.matchPercentage - a.matchPercentage;
  });
}

/**
 * Soft-ranking score for a recipe given the user's taste profile.
 * Higher = more relevant. Urgency (expiry) dominates, then preferred cuisine,
 * then how much of the recipe the user already has at home.
 */
export function recipeScore(match: RecipeMatch, preferredCuisines: CuisineTag[]): number {
  let score = 0;
  if (match.hasAtRisk) score += 1000;
  if (match.hasExpiringSoon) score += 500;
  if (match.recipe.cuisine && preferredCuisines.includes(match.recipe.cuisine)) score += 200;
  score += match.matchPercentage; // 0..100
  return score;
}

/** Rank matches by `recipeScore` (descending) — the personalized order. */
export function rankRecipeMatches(
  matches: RecipeMatch[],
  preferredCuisines: CuisineTag[],
): RecipeMatch[] {
  return [...matches].sort(
    (a, b) => recipeScore(b, preferredCuisines) - recipeScore(a, preferredCuisines),
  );
}

/**
 * Whether a recipe should surface in the "Pra você" (for you) section:
 * it uses something expiring, matches a preferred cuisine, or the user
 * already has at least half of its ingredients.
 */
export function isPreferredMatch(match: RecipeMatch, preferredCuisines: CuisineTag[]): boolean {
  return (
    match.hasAtRisk ||
    match.hasExpiringSoon ||
    (!!match.recipe.cuisine && preferredCuisines.includes(match.recipe.cuisine)) ||
    match.matchPercentage >= 50
  );
}

/** Free-text search over a recipe's title and ingredient names (accent-insensitive). */
export function recipeMatchesQuery(recipe: Recipe, query: string): boolean {
  const q = normalizeIngredient(query);
  if (!q) return true;
  if (normalizeIngredient(recipe.title).includes(q)) return true;
  return recipe.ingredients.some((i) => normalizeIngredient(i.name).includes(q));
}

/** Get available products (non-consumed, non-expired) */
export function getAvailableProducts(products: Product[]): Product[] {
  return products.filter((p) => {
    if (p.consumed) return false;
    const status = getStatus(p);
    return status !== 'expired';
  });
}
