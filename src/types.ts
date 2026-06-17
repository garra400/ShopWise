export type ProductStatus = 'good' | 'expiring_soon' | 'at_risk' | 'expired';
export type ProductSource = 'receipt_scan' | 'manual' | 'barcode';

/** Diet tags a recipe satisfies */
export type DietTag = 'vegetariano' | 'vegano' | 'sem_gluten' | 'sem_lactose';

/** Allergens a recipe contains */
export type Allergen = 'leite' | 'gluten' | 'ovo' | 'amendoim' | 'frutos_do_mar' | 'soja' | 'castanhas';

export interface Product {
  id: string;
  name: string;
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
  origin?: 'local' | 'api';
  sourceUrl?: string;
  image?: string;
}

export interface Settings {
  themePreference: 'system' | 'light' | 'dark';
  notificationsEnabled: boolean;
  language: 'pt' | 'en';
  defaultUnit: string;
  dietRestrictions: string; // free text
  dietTags: DietTag[];      // structured diet preferences
  allergens: Allergen[];    // allergens to avoid
}
