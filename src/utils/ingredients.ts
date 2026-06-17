import { CanonicalIngredient } from '@/types';
import { INGREDIENTS, INGREDIENTS_BY_ID } from '@/data/ingredients';

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
