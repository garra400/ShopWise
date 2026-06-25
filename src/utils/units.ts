import type { Lang } from '@/i18n';

/**
 * Unit formatting & conversion for ingredient/product quantities.
 *
 * Two concerns:
 *  1. Localize the unit token to the language (e.g. 'col. (sopa)' ↔ 'tbsp').
 *  2. Convert metric ↔ imperial when the user's `measurementSystem` differs
 *     from the stored unit (weight and liquid volume only — cooking units like
 *     cups/spoons/cloves/slices are conceptual and only get translated).
 */

type System = 'metric' | 'imperial';

/** Localized display token for each known unit. */
const UNIT_TOKEN: Record<string, Record<Lang, string>> = {
  un: { pt: 'un', en: 'pc' },
  kg: { pt: 'kg', en: 'kg' },
  g: { pt: 'g', en: 'g' },
  L: { pt: 'L', en: 'L' },
  ml: { pt: 'ml', en: 'ml' },
  lb: { pt: 'lb', en: 'lb' },
  oz: { pt: 'oz', en: 'oz' },
  gal: { pt: 'gal', en: 'gal' },
  'fl oz': { pt: 'fl oz', en: 'fl oz' },
  cup: { pt: 'copo', en: 'cup' },
  'xíc.': { pt: 'xíc.', en: 'cup' },
  'col. (sopa)': { pt: 'col. (sopa)', en: 'tbsp' },
  'col. (chá)': { pt: 'col. (chá)', en: 'tsp' },
  dente: { pt: 'dente', en: 'clove' },
  dentes: { pt: 'dentes', en: 'cloves' },
  fatia: { pt: 'fatia', en: 'slice' },
  fatias: { pt: 'fatias', en: 'slices' },
};

const METRIC_UNITS = new Set(['g', 'kg', 'ml', 'L']);
const IMPERIAL_UNITS = new Set(['oz', 'lb', 'fl oz', 'gal', 'cup']);

/** Round to at most 1 decimal and drop a trailing ".0". */
function tidy(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Singular/plural handling for count tokens that have both forms. */
function tokenFor(unit: string, qty: number, lang: Lang): string {
  // Normalize PT singular/plural pairs to the right form for the quantity.
  if (unit === 'dente' || unit === 'dentes') unit = qty === 1 ? 'dente' : 'dentes';
  if (unit === 'fatia' || unit === 'fatias') unit = qty === 1 ? 'fatia' : 'fatias';
  return UNIT_TOKEN[unit]?.[lang] ?? unit;
}

/** Convert a metric weight/volume quantity to the imperial equivalent. */
function metricToImperial(qty: number, unit: string): { qty: number; unit: string } {
  switch (unit) {
    case 'g': return { qty: tidy(qty / 28.3495), unit: 'oz' };
    case 'kg': return { qty: tidy(qty * 2.20462), unit: 'lb' };
    case 'ml': return { qty: tidy(qty / 29.5735), unit: 'fl oz' };
    case 'L': return { qty: tidy(qty * 4.16667), unit: 'cup' }; // 1 cup = 240 ml
    default: return { qty, unit };
  }
}

/** Convert an imperial weight/volume quantity to the metric equivalent. */
function imperialToMetric(qty: number, unit: string): { qty: number; unit: string } {
  switch (unit) {
    case 'oz': return { qty: tidy(qty * 28.3495), unit: 'g' };
    case 'lb': return { qty: tidy(qty * 453.592), unit: 'g' };
    case 'fl oz': return { qty: tidy(qty * 29.5735), unit: 'ml' };
    case 'gal': return { qty: tidy(qty * 3.78541), unit: 'L' };
    case 'cup': return { qty: tidy(qty * 240), unit: 'ml' };
    default: return { qty, unit };
  }
}

/**
 * Format "quantity unit" for display, converting and localizing as needed.
 * Returns '' when there is no quantity. Unit-less quantities return just the number.
 */
export function formatQuantity(
  quantity: number | undefined,
  unit: string | undefined,
  system: System,
  lang: Lang,
): string {
  if (quantity == null) return '';
  let qty = quantity;
  let u = unit;

  if (u) {
    if (system === 'imperial' && METRIC_UNITS.has(u)) {
      ({ qty, unit: u } = metricToImperial(qty, u));
    } else if (system === 'metric' && IMPERIAL_UNITS.has(u)) {
      ({ qty, unit: u } = imperialToMetric(qty, u));
    }
  }

  const num = String(tidy(qty));
  if (!u) return num;
  return `${num} ${tokenFor(u, qty, lang)}`;
}

/**
 * Convert a quantity between units of the SAME dimension (weight or volume).
 * Returns null when not inter-convertible — different dimensions, or count/
 * cooking units like 'un', 'xíc.', 'dentes' (only an exact same-unit match works).
 */
export function convertQuantity(qty: number, from: string | undefined, to: string | undefined): number | null {
  if (from === to) return qty;
  if (!from || !to) return null;
  const WEIGHT: Record<string, number> = { g: 1, kg: 1000 };  // in grams
  const VOLUME: Record<string, number> = { ml: 1, L: 1000 };  // in ml
  if (from in WEIGHT && to in WEIGHT) return (qty * WEIGHT[from]) / WEIGHT[to];
  if (from in VOLUME && to in VOLUME) return (qty * VOLUME[from]) / VOLUME[to];
  return null;
}

/** Localized unit options for the manual add / edit selectors. */
export function unitOptions(system: System, lang: Lang): { label: string; value: string }[] {
  const values = system === 'imperial'
    ? ['un', 'lb', 'oz', 'gal', 'fl oz', 'cup']
    : ['un', 'kg', 'g', 'L', 'ml'];
  return values.map((v) => ({ label: tokenFor(v, 2, lang), value: v }));
}
