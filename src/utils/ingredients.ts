import { CanonicalIngredient, IngredientCategory } from '@/types';
import { INGREDIENTS, INGREDIENTS_BY_ID } from '@/data/ingredients';

// ---------------------------------------------------------------------------
// Typical shelf life (days from purchase) — used to pre-fill expiry on add/scan
// ---------------------------------------------------------------------------

/** Fallback by category when a specific ingredient has no override. */
const SHELF_LIFE_BY_CATEGORY: Record<IngredientCategory, number> = {
  Laticínios: 12,
  Hortifruti: 7,
  Carnes: 4,
  Padaria: 5,
  Bebidas: 120,
  Mercearia: 365,
  Outros: 30,
};

/** Per-ingredient overrides (more accurate than the category default). */
const SHELF_LIFE_BY_ID: Record<string, number> = {
  // Hortifruti
  morango: 3, abacate: 4, mamao: 4, banana: 5, alface: 5, rucula: 4, espinafre: 4,
  couve: 5, brocolis: 5, 'couve-flor': 5, cogumelo: 5, manga: 6, abacaxi: 6, melancia: 6,
  tomate: 7, pepino: 7, uva: 7, mandioca: 8, vagem: 6, pimentao: 10, abobrinha: 10, berinjela: 10,
  maca: 20, laranja: 15, limao: 20, inhame: 20, cenoura: 21, beterraba: 21, gengibre: 21,
  batata: 30, 'batata-doce': 30, abobora: 30, cebola: 30, repolho: 14, alho: 60,
  // Laticínios / ovos
  leite: 7, iogurte: 20, queijo: 20, requeijao: 15, 'cream-cheese': 20, ovo: 21,
  manteiga: 60, margarina: 60, 'creme-leite': 180, 'leite-condensado': 365, 'leite-po': 365,
  // Carnes / peixes
  peixe: 2, camarao: 2, frango: 3, 'carne-bovina': 4, 'carne-suina': 4,
  presunto: 7, linguica: 7, salsicha: 14, bacon: 14, atum: 365, sardinha: 365,
  // Padaria
  pao: 5, bolo: 4, torrada: 120, biscoito: 120, tortilla: 30,
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
