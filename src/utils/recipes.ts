import { Recipe, Product } from '@/types';
import { getStatus } from '@/utils/status';

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

/** Normalize text for comparison: lowercase, trim, remove accents */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Returns true if ingredient name and product name match (substring either way) */
export function ingredientMatchesProduct(ingredientName: string, productName: string): boolean {
  const normIngr = normalize(ingredientName);
  const normProd = normalize(productName);
  return normIngr.includes(normProd) || normProd.includes(normIngr);
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
      ingredientMatchesProduct(ingredient.name, p.name)
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

/** Get available products (non-consumed, non-expired) */
export function getAvailableProducts(products: Product[]): Product[] {
  return products.filter((p) => {
    if (p.consumed) return false;
    const status = getStatus(p);
    return status !== 'expired';
  });
}
