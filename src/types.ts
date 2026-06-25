export type ProductStatus = 'good' | 'expiring_soon' | 'at_risk' | 'expired';
export type ProductSource = 'receipt_scan' | 'manual' | 'barcode';

/** Category of a canonical ingredient (aligned with the product categories). */
export type IngredientCategory =
  | 'Laticínios'
  | 'Hortifruti'
  | 'Carnes'
  | 'Padaria'
  | 'Bebidas'
  | 'Mercearia'
  | 'Outros';

/**
 * A canonical ingredient — the controlled vocabulary that ties products,
 * recipes and OCR results together. Matching is done by `id`, not free text.
 */
export interface CanonicalIngredient {
  id: string;                 // stable kebab-case slug, e.g. 'leite'
  name: string;               // display name, e.g. 'Leite'
  category: IngredientCategory;
  aliases: string[];          // synonyms / plurals / variants that resolve to this id
}

/** Diet tags a recipe satisfies */
export type DietTag = 'vegetariano' | 'vegano' | 'sem_gluten' | 'sem_lactose';

/** Allergens a recipe contains */
export type Allergen = 'leite' | 'gluten' | 'ovo' | 'amendoim' | 'frutos_do_mar' | 'soja' | 'castanhas';

/** Cuisine / nationality of a recipe */
export type CuisineTag =
  | 'brasileira'
  | 'italiana'
  | 'mexicana'
  | 'asiatica'
  | 'arabe'
  | 'mediterranea'
  | 'americana'
  | 'indiana';

export interface Product {
  id: string;
  name: string;
  /** Resolved canonical ingredient id (controlled vocabulary). Optional for legacy/unmapped data. */
  canonicalId?: string;
  category: string;
  purchaseDate: string;   // ISO date (yyyy-MM-dd)
  expiryDate: string;     // ISO date (yyyy-MM-dd)
  quantity?: number;
  unit?: string;          // kg, g, L, ml, un
  image?: string;
  source: ProductSource;
  consumed: boolean;
  createdAt: string;      // ISO timestamp
  updatedAt: string;      // ISO timestamp
}

export interface RecipeIngredient {
  name: string;
  /** Resolved canonical ingredient id (controlled vocabulary). Optional — resolved on the fly when absent. */
  canonicalId?: string;
  quantity?: number;
  unit?: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  prepTime: number;       // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: DietTag[];       // diet properties the recipe satisfies
  allergens?: Allergen[]; // allergens the recipe contains
  cuisine?: CuisineTag;   // nationality / cuisine of the recipe
  origin?: 'local' | 'api';
  sourceUrl?: string;
  image?: string;
}

export interface Settings {
  themePreference: 'system' | 'light' | 'dark';
  notificationsEnabled: boolean;
  language: 'pt' | 'en';
  measurementSystem: 'metric' | 'imperial';
  defaultUnit: string;
  dietTags: DietTag[];      // structured diet preferences
  allergens: Allergen[];    // allergens to avoid
  cuisines: CuisineTag[];   // preferred cuisines (empty = show all)
  avoidIngredients: string[]; // canonical ingredient ids the user dislikes (hard-excluded)
}
