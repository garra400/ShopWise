/**
 * Community recipe repository — reads the shared `recipes` table from Supabase.
 *
 * This is the multi-user catalog: every user reads the same library. When
 * Supabase is not configured (hasSupabase === false) it returns [] and the app
 * falls back to the bundled local recipes. Never throws to the UI.
 */

import { Recipe, DietTag, Allergen, CuisineTag, RecipeIngredient } from '@/types';
import { getSupabase } from '@/services/supabase';

const CUISINES: CuisineTag[] = [
  'brasileira', 'italiana', 'mexicana', 'asiatica', 'arabe', 'mediterranea', 'americana', 'indiana',
];

/** In-memory cache so the detail screen can resolve a recipe by id. */
export const communityRecipeCache = new Map<string, Recipe>();

interface RecipeRow {
  id: string;
  title: string;
  title_en: string | null;
  ingredients: unknown;
  instructions: string | null;
  instructions_en: string | null;
  prep_time: number | null;
  servings: number | null;
  difficulty: string | null;
  tags: unknown;
  allergens: unknown;
  cuisine: string | null;
  image: string | null;
  source_url: string | null;
  origin: string | null;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function rowToRecipe(row: RecipeRow): Recipe {
  const ingredients: RecipeIngredient[] = asArray<Record<string, unknown>>(row.ingredients).map((i) => ({
    name: String(i.name ?? ''),
    canonicalId: i.canonicalId != null ? String(i.canonicalId) : undefined,
    quantity: typeof i.quantity === 'number' ? i.quantity : undefined,
    unit: i.unit != null ? String(i.unit) : undefined,
  }));

  const difficulty =
    row.difficulty === 'medium' || row.difficulty === 'hard' ? row.difficulty : 'easy';

  return {
    id: row.id,
    title: row.title,
    titleEn: row.title_en ?? undefined,
    ingredients,
    instructions: row.instructions ?? '',
    instructionsEn: row.instructions_en ?? undefined,
    prepTime: row.prep_time ?? 0,
    servings: typeof row.servings === 'number' ? row.servings : undefined,
    difficulty,
    tags: asArray<DietTag>(row.tags),
    allergens: asArray<Allergen>(row.allergens),
    cuisine: row.cuisine && (CUISINES as string[]).includes(row.cuisine)
      ? (row.cuisine as CuisineTag)
      : undefined,
    image: row.image ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    origin: 'api',
  };
}

/**
 * Fetch the shared community recipe catalog from Supabase.
 * Returns [] when Supabase is not configured or on any error.
 */
export async function fetchCommunityRecipes(): Promise<Recipe[]> {
  const sb = getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from('recipes')
      .select('*')
      .order('title', { ascending: true });

    if (error || !Array.isArray(data)) return [];

    const recipes = (data as RecipeRow[]).map(rowToRecipe);
    for (const r of recipes) communityRecipeCache.set(r.id, r);
    return recipes;
  } catch {
    return [];
  }
}
