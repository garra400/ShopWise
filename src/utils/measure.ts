/**
 * Measurement standardization for ingredient quantities.
 *
 * The problem: a recipe asks for "2 xíc. de arroz" while the pantry holds
 * "1 kg de arroz", or "1 cebola" while the pantry holds "500 g de cebola".
 * To deduct correctly we need to know, per ingredient, a BASE unit and how
 * much each culinary unit is worth in that base (culinary approximations).
 *
 *   base 'g'  → solids / powders / meats (grams)
 *   base 'ml' → liquids (milliliters)
 *   base 'un' → countables (eggs, fruit, vegetables)
 *
 * `convertMeasure(qty, from, to, id)` converts between any two units of the
 * SAME ingredient through its base. Returns null when not derivable (the
 * caller then leaves the pantry item untouched — never "consume everything").
 */
import { getIngredient } from '@/utils/ingredients';
import type { IngredientCategory } from '@/types';

export type MeasureBase = 'g' | 'ml' | 'un';

interface Density {
  base: MeasureBase;
  gPerUn?: number;    // average weight of 1 "un" (countables that can be weighed)
  gPerCup?: number;   // grams in 1 "xíc." (solids/powders by cup)
  gPerDente?: number; // grams in 1 garlic "dente"
  gPerFatia?: number; // grams in 1 "fatia" (bread slice)
}

const CUP_ML = 240, TBSP_ML = 15, TSP_ML = 5;

/** Per-ingredient measures (culinary approximations). */
const DENSITY: Record<string, Density> = {
  // ── Liquids (base ml) ────────────────────────────────────────────────────
  leite: { base: 'ml' }, 'leite-coco': { base: 'ml' }, 'leite-vegetal': { base: 'ml' },
  agua: { base: 'ml' }, suco: { base: 'ml' }, refrigerante: { base: 'ml' },
  oleo: { base: 'ml' }, azeite: { base: 'ml' }, 'oleo-coco': { base: 'ml' }, vinagre: { base: 'ml' },
  shoyu: { base: 'ml' }, 'creme-leite': { base: 'ml' },

  // ── Grains / powders (base g, with cup density) ──────────────────────────
  arroz: { base: 'g', gPerCup: 185 }, feijao: { base: 'g', gPerCup: 190 },
  'feijao-branco': { base: 'g', gPerCup: 190 }, lentilha: { base: 'g', gPerCup: 190 },
  'grao-de-bico': { base: 'g', gPerCup: 190 }, quinoa: { base: 'g', gPerCup: 170 },
  'farinha-trigo': { base: 'g', gPerCup: 120 }, 'farinha-mandioca': { base: 'g', gPerCup: 150 },
  fuba: { base: 'g', gPerCup: 160 }, 'amido-milho': { base: 'g', gPerCup: 120 },
  acucar: { base: 'g', gPerCup: 200 }, aveia: { base: 'g', gPerCup: 90 },
  granola: { base: 'g', gPerCup: 110 }, cuscuz: { base: 'g', gPerCup: 170 },
  macarrao: { base: 'g', gPerCup: 100 }, chia: { base: 'g', gPerCup: 160 },
  gergelim: { base: 'g', gPerCup: 150 }, 'pasta-amendoim': { base: 'g', gPerCup: 250 },
  mel: { base: 'g', gPerCup: 340 }, 'leite-condensado': { base: 'g', gPerCup: 306 },
  achocolatado: { base: 'g', gPerCup: 120 }, sal: { base: 'g', gPerCup: 280 },
  cafe: { base: 'g', gPerCup: 90 }, cha: { base: 'g', gPerCup: 80 },
  amendoim: { base: 'g', gPerCup: 145 }, castanha: { base: 'g', gPerCup: 130 },
  nozes: { base: 'g', gPerCup: 120 }, passas: { base: 'g', gPerCup: 160 },
  'leite-po': { base: 'g', gPerCup: 130 }, 'proteina-soja': { base: 'g', gPerCup: 80 },

  // ── Spices (base g) — only spoons matter ─────────────────────────────────
  pimenta: { base: 'g', gPerCup: 120 }, oregano: { base: 'g', gPerCup: 50 },
  canela: { base: 'g', gPerCup: 120 }, cominho: { base: 'g', gPerCup: 100 },
  colorau: { base: 'g', gPerCup: 110 }, curry: { base: 'g', gPerCup: 100 },
  caldo: { base: 'g', gPerUn: 10 }, fermento: { base: 'g', gPerCup: 110 },
  adocante: { base: 'g', gPerCup: 200 },

  // ── Dairy (base g) ───────────────────────────────────────────────────────
  queijo: { base: 'g' }, requeijao: { base: 'g', gPerCup: 250 },
  'cream-cheese': { base: 'g', gPerCup: 230 }, manteiga: { base: 'g', gPerCup: 227 },
  margarina: { base: 'g', gPerCup: 227 }, iogurte: { base: 'g', gPerUn: 170, gPerCup: 245 },

  // ── Sauces / cans (base g) ───────────────────────────────────────────────
  'molho-tomate': { base: 'g', gPerCup: 245 }, 'extrato-tomate': { base: 'g', gPerCup: 260 },
  maionese: { base: 'g', gPerCup: 230 }, mostarda: { base: 'g', gPerCup: 250 },
  ketchup: { base: 'g', gPerCup: 245 }, tahine: { base: 'g', gPerCup: 240 },
  azeitona: { base: 'g', gPerCup: 135 },

  // ── Proteins (base g; cans/links carry an avg un weight) ─────────────────
  frango: { base: 'g' }, 'carne-bovina': { base: 'g' }, 'carne-suina': { base: 'g' },
  peixe: { base: 'g' }, camarao: { base: 'g' }, linguica: { base: 'g' },
  bacon: { base: 'g' }, presunto: { base: 'g', gPerFatia: 15 },
  atum: { base: 'g', gPerUn: 170 }, sardinha: { base: 'g', gPerUn: 125 },
  salsicha: { base: 'un', gPerUn: 50 }, ovo: { base: 'un', gPerUn: 50 }, tofu: { base: 'g' },

  // ── Produce: countables that can also be weighed (base un + gPerUn) ──────
  banana: { base: 'un', gPerUn: 120 }, maca: { base: 'un', gPerUn: 180 },
  laranja: { base: 'un', gPerUn: 180 }, limao: { base: 'un', gPerUn: 100 },
  mamao: { base: 'un', gPerUn: 500 }, manga: { base: 'un', gPerUn: 300 },
  morango: { base: 'un', gPerUn: 18, gPerCup: 150 }, abacate: { base: 'un', gPerUn: 200 },
  melancia: { base: 'un', gPerUn: 3000 }, coco: { base: 'un', gPerUn: 400 },
  uva: { base: 'g', gPerCup: 150 }, abacaxi: { base: 'un', gPerUn: 1200 },
  tomate: { base: 'un', gPerUn: 120 }, cebola: { base: 'un', gPerUn: 150 },
  batata: { base: 'un', gPerUn: 150 }, 'batata-doce': { base: 'un', gPerUn: 200 },
  cenoura: { base: 'un', gPerUn: 80 }, abobrinha: { base: 'un', gPerUn: 200 },
  abobora: { base: 'g' }, pimentao: { base: 'un', gPerUn: 160 },
  pepino: { base: 'un', gPerUn: 200 }, beterraba: { base: 'un', gPerUn: 150 },
  berinjela: { base: 'un', gPerUn: 250 }, mandioca: { base: 'g' }, inhame: { base: 'un', gPerUn: 200 },
  gengibre: { base: 'g' }, alho: { base: 'un', gPerUn: 45, gPerDente: 5 },
  'milho-verde': { base: 'g', gPerCup: 165, gPerUn: 150 }, ervilha: { base: 'g', gPerCup: 145 },
  cogumelo: { base: 'g', gPerCup: 70 }, vagem: { base: 'g', gPerCup: 110 },
  alface: { base: 'un', gPerUn: 300 }, couve: { base: 'un', gPerUn: 350 },
  rucula: { base: 'g' }, espinafre: { base: 'g', gPerCup: 30 }, repolho: { base: 'un', gPerUn: 1000 },
  brocolis: { base: 'un', gPerUn: 400 }, 'couve-flor': { base: 'un', gPerUn: 600 },
  // herbs (base g, small amounts)
  salsa: { base: 'g' }, cebolinha: { base: 'g' }, coentro: { base: 'g' }, manjericao: { base: 'g' },

  // ── Bakery (base un, with slice weight) ──────────────────────────────────
  pao: { base: 'un', gPerUn: 500, gPerFatia: 25 }, tortilla: { base: 'un', gPerUn: 45 },
  bolo: { base: 'un', gPerUn: 800 }, biscoito: { base: 'g', gPerCup: 100 },
  torrada: { base: 'un', gPerUn: 10 },
};

const BASE_BY_CATEGORY: Record<IngredientCategory, MeasureBase> = {
  'Laticínios': 'un', 'Hortifruti': 'un', 'Carnes': 'g',
  'Padaria': 'un', 'Bebidas': 'ml', 'Mercearia': 'g', 'Outros': 'g',
};

function densityFor(canonicalId?: string): Density {
  const explicit = canonicalId ? DENSITY[canonicalId] : undefined;
  if (explicit) return explicit;
  const ing = getIngredient(canonicalId);
  return { base: ing ? BASE_BY_CATEGORY[ing.category] : 'g' };
}

/** Value of `qty unit` expressed in the ingredient's base unit, or null. */
function toBaseValue(qty: number, unit: string | undefined, d: Density): number | null {
  const u = unit || 'un';
  if (u === d.base) return qty;

  if (d.base === 'g') {
    switch (u) {
      case 'kg': return qty * 1000;
      case 'g': return qty;
      case 'ml': return qty;          // density ≈ 1 for the rare liquid-as-weight
      case 'L': return qty * 1000;
      case 'xíc.': return qty * (d.gPerCup ?? 150);
      case 'col. (sopa)': return qty * ((d.gPerCup ?? 150) / 16);
      case 'col. (chá)': return qty * ((d.gPerCup ?? 150) / 48);
      case 'dente': case 'dentes': return d.gPerDente != null ? qty * d.gPerDente : null;
      case 'fatia': case 'fatias': return d.gPerFatia != null ? qty * d.gPerFatia : null;
      case 'un': return d.gPerUn != null ? qty * d.gPerUn : null;
      default: return null;
    }
  }
  if (d.base === 'ml') {
    switch (u) {
      case 'L': return qty * 1000;
      case 'ml': return qty;
      case 'g': return qty;           // density ≈ 1
      case 'kg': return qty * 1000;
      case 'xíc.': return qty * CUP_ML;
      case 'col. (sopa)': return qty * TBSP_ML;
      case 'col. (chá)': return qty * TSP_ML;
      default: return null;
    }
  }
  // base 'un'
  switch (u) {
    case 'un': return qty;
    case 'g': return d.gPerUn ? qty / d.gPerUn : null;
    case 'kg': return d.gPerUn ? (qty * 1000) / d.gPerUn : null;
    case 'dente': case 'dentes': return (d.gPerUn && d.gPerDente) ? (qty * d.gPerDente) / d.gPerUn : null;
    case 'fatia': case 'fatias': return (d.gPerUn && d.gPerFatia) ? (qty * d.gPerFatia) / d.gPerUn : null;
    default: return null;
  }
}

/**
 * Convert `qty` of `fromUnit` to `toUnit` for a given ingredient, through its
 * base unit and culinary densities. Returns null when not derivable.
 */
export function convertMeasure(
  qty: number,
  fromUnit: string | undefined,
  toUnit: string | undefined,
  canonicalId?: string,
): number | null {
  const d = densityFor(canonicalId);
  const fromBase = toBaseValue(qty, fromUnit, d);
  const onePerTo = toBaseValue(1, toUnit, d);
  if (fromBase == null || onePerTo == null || onePerTo === 0) return null;
  return fromBase / onePerTo;
}
