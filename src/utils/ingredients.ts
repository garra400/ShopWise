import { CanonicalIngredient, IngredientCategory } from '@/types';
import { INGREDIENTS, INGREDIENTS_BY_ID } from '@/data/ingredients';

// ---------------------------------------------------------------------------
// Typical shelf life (days from purchase) — used to pre-fill expiry on add/scan
// ---------------------------------------------------------------------------

/** Fallback by category when a specific ingredient has no override. */
const SHELF_LIFE_BY_CATEGORY: Record<IngredientCategory, number> = {
  Laticínios: 14,
  Hortifruti: 8,
  Carnes: 5,
  Padaria: 6,
  Bebidas: 120,
  Mercearia: 365,
  Outros: 30,
};

/**
 * Per-ingredient overrides (more accurate than the category default).
 * Values assume PROPER storage (refrigerated/freezer/pantry as appropriate),
 * so a freshly-bought item isn't flagged as urgent right away.
 */
const SHELF_LIFE_BY_ID: Record<string, number> = {
  // Hortifruti
  morango: 4, abacate: 5, mamao: 5, banana: 6, alface: 6, rucula: 5, espinafre: 5,
  couve: 6, brocolis: 6, 'couve-flor': 6, cogumelo: 6, manga: 7, abacaxi: 7, melancia: 7,
  tomate: 8, pepino: 8, uva: 8, mandioca: 8, vagem: 7, pimentao: 12, abobrinha: 12, berinjela: 12,
  maca: 25, laranja: 18, limao: 25, inhame: 25, cenoura: 25, beterraba: 25, gengibre: 30,
  batata: 35, 'batata-doce': 35, abobora: 40, cebola: 35, repolho: 18, alho: 90,
  // Laticínios / ovos
  leite: 10, iogurte: 25, queijo: 25, requeijao: 18, 'cream-cheese': 25, ovo: 30,
  manteiga: 60, margarina: 60, 'creme-leite': 180, 'leite-condensado': 365, 'leite-po': 365,
  // Carnes / peixes (geladeira; congelado dura muito mais, mas assumimos fresco)
  peixe: 3, camarao: 3, frango: 4, 'carne-bovina': 5, 'carne-suina': 5,
  presunto: 8, linguica: 8, salsicha: 15, bacon: 20, atum: 365, sardinha: 365,
  // Padaria
  pao: 6, bolo: 5, torrada: 120, biscoito: 120, tortilla: 30,
  // Bebidas
  suco: 5, 'leite-vegetal': 30, refrigerante: 180, agua: 365, cafe: 365, cha: 365,
  // Mercearia perecível-ish
  'pasta-amendoim': 180,
};

/** Typical shelf life in days for a canonical ingredient (or a safe default). */
export function suggestedShelfLifeDays(id?: string): number {
  const ing = getIngredient(id);
  if (!ing) return 30;
  return SHELF_LIFE_BY_ID[ing.id] ?? SHELF_LIFE_BY_CATEGORY[ing.category] ?? 30;
}

// ---------------------------------------------------------------------------
// Default unit per ingredient (leite → L, arroz → kg, pimenta → un, ...)
// ---------------------------------------------------------------------------

const UNIT_BY_CATEGORY: Record<IngredientCategory, string> = {
  Laticínios: 'un',
  Hortifruti: 'un',
  Carnes: 'kg',
  Padaria: 'un',
  Bebidas: 'L',
  Mercearia: 'un',
  Outros: 'un',
};

const UNIT_BY_ID: Record<string, string> = {
  // Líquidos (L)
  leite: 'L', 'leite-coco': 'L', 'leite-vegetal': 'L', suco: 'L', agua: 'L', refrigerante: 'L', cafe: 'L', cha: 'L',
  // Líquidos (ml)
  azeite: 'ml', oleo: 'ml', 'oleo-coco': 'ml', vinagre: 'ml',
  // Peso (kg)
  arroz: 'kg', feijao: 'kg', 'feijao-branco': 'kg', lentilha: 'kg', 'grao-de-bico': 'kg',
  farinha: 'kg', 'farinha-trigo': 'kg', 'farinha-mandioca': 'kg', fuba: 'kg', acucar: 'kg',
  frango: 'kg', 'carne-bovina': 'kg', 'carne-suina': 'kg', peixe: 'kg', camarao: 'kg',
  quinoa: 'kg', aveia: 'kg', granola: 'kg', cuscuz: 'kg',
  // Peso (g)
  queijo: 'g', manteiga: 'g', margarina: 'g', requeijao: 'g', 'cream-cheese': 'g',
  gergelim: 'g', chia: 'g', amendoim: 'g', castanha: 'g', nozes: 'g', passas: 'g',
  tahine: 'g', 'pasta-amendoim': 'g', linguica: 'g', presunto: 'g', bacon: 'g',
};

/** Suggested default unit for a canonical ingredient (falls back to category / 'un'). */
export function suggestedUnit(id?: string): string {
  const ing = getIngredient(id);
  if (!ing) return 'un';
  return UNIT_BY_ID[ing.id] ?? UNIT_BY_CATEGORY[ing.category] ?? 'un';
}

/** Lowercase, trim, strip accents — the shared normalization for all matching. */
export function normalizeIngredient(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');
}

// ---------------------------------------------------------------------------
// Pre-computed indexes
// ---------------------------------------------------------------------------

interface Term {
  norm: string;        // normalized term (name or alias)
  id: string;          // canonical id it points to
  len: number;         // length, for longest-match-first preference
}

/** All searchable terms (every name + every alias), longest first. */
const TERMS: Term[] = (() => {
  const list: Term[] = [];
  for (const ing of INGREDIENTS) {
    list.push({ norm: normalizeIngredient(ing.name), id: ing.id, len: ing.name.length });
    for (const alias of ing.aliases) {
      const norm = normalizeIngredient(alias);
      list.push({ norm, id: ing.id, len: norm.length });
    }
  }
  // Longest terms first so 'leite de coco' wins over 'leite' on substring checks.
  return list.sort((a, b) => b.len - a.len);
})();

/** Exact-term lookup: normalized name/alias → canonical id. */
const EXACT: Map<string, string> = new Map(TERMS.map((t) => [t.norm, t.id]));

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getIngredient(id: string | undefined): CanonicalIngredient | undefined {
  return id ? INGREDIENTS_BY_ID.get(id) : undefined;
}

/** Display label for a canonical id (falls back to the raw id if unknown). */
export function ingredientLabel(id: string | undefined): string | undefined {
  return getIngredient(id)?.name;
}

/**
 * Display name for a recipe/product ingredient in the given language.
 * Resolves through the canonical catalog (so EN names come from `nameEn`);
 * falls back to the ingredient's own free-text name when it maps to nothing.
 */
export function ingredientDisplayName(
  ing: { name: string; canonicalId?: string },
  lang: 'pt' | 'en',
): string {
  const id = ing.canonicalId ?? resolveCanonicalId(ing.name);
  const canon = getIngredient(id);
  if (!canon) return ing.name;
  return lang === 'en' ? canon.nameEn : canon.name;
}

/**
 * Resolve a free-text ingredient/product name to a canonical id.
 *
 * Priority:
 *   1. Exact match on a name or alias (after normalization).
 *   2. Longest term that is a whole-word-ish substring of the text
 *      (handles "leite integral" → leite, "peito de frango" → frango).
 *   3. Longest term that *contains* the text (handles very short inputs).
 *
 * Returns undefined when nothing reasonable matches.
 */
export function resolveCanonicalId(text: string): string | undefined {
  const norm = normalizeIngredient(text);
  if (!norm) return undefined;

  // 1. exact
  const exact = EXACT.get(norm);
  if (exact) return exact;

  // 2. a known term appears inside the text ("leite integral" contains "leite")
  for (const term of TERMS) {
    if (term.norm.length < 3) continue; // avoid trivial matches
    if (containsWord(norm, term.norm)) return term.id;
  }

  // 3. the text appears inside a known term (short input like "frang")
  for (const term of TERMS) {
    if (norm.length < 3) break;
    if (term.norm.includes(norm)) return term.id;
  }

  return undefined;
}

/** True if `needle` occurs in `haystack` bounded by start/end or non-letters. */
function containsWord(haystack: string, needle: string): boolean {
  let from = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const idx = haystack.indexOf(needle, from);
    if (idx === -1) return false;
    const before = idx === 0 ? ' ' : haystack[idx - 1];
    const after = idx + needle.length >= haystack.length ? ' ' : haystack[idx + needle.length];
    const isBoundary = (c: string) => !/[a-z0-9]/.test(c);
    if (isBoundary(before) && isBoundary(after)) return true;
    from = idx + 1;
  }
}

/**
 * Autocomplete search: returns canonical ingredients whose name or any alias
 * matches the query, best matches first (prefix > substring), capped to `limit`.
 * Empty query returns the first `limit` ingredients alphabetically.
 */
export function searchIngredients(query: string, limit = 8): CanonicalIngredient[] {
  const q = normalizeIngredient(query);
  if (!q) {
    return [...INGREDIENTS].sort((a, b) => a.name.localeCompare(b.name, 'pt')).slice(0, limit);
  }

  const scored: { ing: CanonicalIngredient; score: number }[] = [];
  for (const ing of INGREDIENTS) {
    const terms = [ing.name, ...ing.aliases].map(normalizeIngredient);
    let best = Infinity;
    for (const t of terms) {
      if (t === q) best = Math.min(best, 0);
      else if (t.startsWith(q)) best = Math.min(best, 1);
      else if (t.includes(q)) best = Math.min(best, 2);
    }
    if (best !== Infinity) scored.push({ ing, score: best });
  }

  return scored
    .sort((a, b) => a.score - b.score || a.ing.name.localeCompare(b.ing.name, 'pt'))
    .slice(0, limit)
    .map((s) => s.ing);
}

/**
 * Whether a product and a recipe ingredient refer to the same thing.
 * Uses canonical ids when available (exact, unambiguous); otherwise resolves
 * both names on the fly; falls back to a loose substring check as last resort.
 */
export function sameIngredient(
  a: { name: string; canonicalId?: string },
  b: { name: string; canonicalId?: string },
): boolean {
  const aId = a.canonicalId ?? resolveCanonicalId(a.name);
  const bId = b.canonicalId ?? resolveCanonicalId(b.name);
  if (aId && bId) return aId === bId;

  // Last-resort fallback for items that resolve to nothing in the catalog.
  const na = normalizeIngredient(a.name);
  const nb = normalizeIngredient(b.name);
  return na.includes(nb) || nb.includes(na);
}
