import { ReceiptItem } from '@/services/ocr';

// ---------------------------------------------------------------------------
// Noise-line filters
// ---------------------------------------------------------------------------

/** Lines that are purely numeric/symbol noise or too short (< 3 letters) */
const NOISE_KEYWORDS = [
  'TOTAL', 'SUBTOTAL', 'TROCO', 'CNPJ', 'CPF', 'CUPOM', 'FISCAL',
  'VALOR', 'DINHEIRO', 'CARTAO', 'ICMS', 'R\\$', '%',
];
const NOISE_REGEX = new RegExp(NOISE_KEYWORDS.join('|'), 'i');

/** ISO-ish date like 01/01/2024, time like 12:30, or mostly digits */
const DATE_TIME_REGEX = /\b\d{2}[\/\-]\d{2}[\/\-]\d{2,4}\b|\b\d{1,2}:\d{2}\b/;

function isNoiseLine(line: string): boolean {
  // Has fewer than 3 letters → noise
  const letterCount = (line.match(/[a-zA-ZÀ-úÃã]/g) ?? []).length;
  if (letterCount < 3) return true;
  // Contains a known receipt keyword
  if (NOISE_REGEX.test(line)) return true;
  // Looks like a date or time
  if (DATE_TIME_REGEX.test(line)) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Category guessing
// ---------------------------------------------------------------------------

const CATEGORY_MAP: Array<{ pattern: RegExp; category: string }> = [
  { pattern: /leite|iogurte|queijo|manteiga|requeij|creme\s+de\s+leite|ovos?/i, category: 'Laticínios' },
  { pattern: /tomate|banana|ma[çc]a|laranja|fruta|verdura|alface|cenoura|alho|cebola|br[oó]coli|espinafre|repolho|beterraba|batata|inhame/i, category: 'Hortifruti' },
  { pattern: /frango|carne|bife|peixe|salm[aã]o|costela|picanha|file|fil[eé]|linguiça|presunto|bacon/i, category: 'Carnes' },
  { pattern: /p[aã]o|bolo|biscoito|bolacha|torrada|croissant|pão/i, category: 'Padaria' },
  { pattern: /arroz|feij[aã]o|macarr[aã]o|a[çc][uú]car|farinha|sal\b|[oó]leo|azeite|vinagre|molho|extrato|polpa/i, category: 'Mercearia' },
  { pattern: /refri|suco|[aá]gua|cerveja|vinho|leite\s+vegetal|energetic|ch[aá]\b|caf[eé]/i, category: 'Bebidas' },
  { pattern: /sabonete|shampoo|condicionador|detergente|desengordurante|limpeza|alvejante|amaciante|esponja|vassoura/i, category: 'Limpeza' },
];

function guessCategory(name: string): string {
  for (const { pattern, category } of CATEGORY_MAP) {
    if (pattern.test(name)) return category;
  }
  return 'Outros';
}

// ---------------------------------------------------------------------------
// Unit detection
// ---------------------------------------------------------------------------

const UNIT_MAP: Array<{ pattern: RegExp; unit: string }> = [
  { pattern: /\bkg\b/i, unit: 'kg' },
  { pattern: /\b(\d+)?\s*g\b/i, unit: 'g' },
  { pattern: /\b(\d+)?\s*ml\b/i, unit: 'ml' },
  { pattern: /\b(\d+)?\s*l\b/i, unit: 'L' },
];

function detectUnit(token: string): string | null {
  for (const { pattern, unit } of UNIT_MAP) {
    if (pattern.test(token)) return unit;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Name cleaning
// ---------------------------------------------------------------------------

/**
 * Strip trailing price tokens (e.g. "1,99", "2x", "R$ 3,50", barcodes, codes)
 * and return the cleaned product name fragment.
 */
function cleanName(raw: string): string {
  let s = raw;
  // Remove leading/trailing codes that look like SKU/barcode (all digits, > 3 chars)
  s = s.replace(/^\s*\d{4,}\s*/, '');
  s = s.replace(/\s*\d{4,}\s*$/, '');
  // Remove price patterns like "1,99" "R$3,50" "12.90"
  s = s.replace(/R?\$?\s*\d+[,\.]\d{2}\s*$/gi, '');
  // Remove multiplier suffix like "2x" or "x2"
  s = s.replace(/\s+\d+\s*[xX]\s*$/, '');
  s = s.replace(/\s*[xX]\s*\d+\s*$/, '');
  // Remove stray special characters (keep letters, digits, spaces, hyphens)
  s = s.replace(/[^a-zA-ZÀ-ú0-9\s\-]/g, ' ');
  // Collapse multiple spaces
  s = s.replace(/\s{2,}/g, ' ').trim();
  return s;
}

/** Convert a string to Title Case, preserving accented chars */
function toTitleCase(s: string): string {
  // Match the first non-space char of each word. `\b\w` is avoided because
  // `\w` excludes accented letters, which corrupts words like "feijão"/"óleo".
  return s.replace(/(^|\s)(\S)/g, (_, sp, c) => sp + c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Quantity extraction
// ---------------------------------------------------------------------------

function extractQuantity(line: string): { quantity: number; unit: string } {
  // Pattern: "2 kg", "500g", "1,5 L", "3 un", "2x"
  const patterns: Array<{ re: RegExp; unit: string }> = [
    { re: /(\d+(?:[,\.]\d+)?)\s*kg/i, unit: 'kg' },
    { re: /(\d+(?:[,\.]\d+)?)\s*g\b/i, unit: 'g' },
    { re: /(\d+(?:[,\.]\d+)?)\s*ml/i, unit: 'ml' },
    { re: /(\d+(?:[,\.]\d+)?)\s*l\b/i, unit: 'L' },
    { re: /(\d+)\s*[xX]\s/, unit: 'un' },
  ];
  for (const { re, unit } of patterns) {
    const m = line.match(re);
    if (m?.[1]) {
      const qty = parseFloat(m[1].replace(',', '.'));
      if (!isNaN(qty) && qty > 0) return { quantity: qty, unit };
    }
  }
  return { quantity: 1, unit: 'un' };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse arbitrary receipt OCR text into a list of ReceiptItem objects.
 * Pure function — never throws.
 */
export function parseReceiptText(text: string): ReceiptItem[] {
  try {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const results: ReceiptItem[] = [];

    for (const line of lines) {
      if (isNoiseLine(line)) continue;

      const { quantity, unit } = extractQuantity(line);

      // Detect if a unit token appears in the line to refine unit choice
      let finalUnit = unit;
      const unitTokens = line.split(/\s+/);
      for (const token of unitTokens) {
        const detected = detectUnit(token);
        if (detected) { finalUnit = detected; break; }
      }

      const cleaned = cleanName(line);
      if (cleaned.length < 3) continue;

      const name = toTitleCase(cleaned);
      const category = guessCategory(name);

      results.push({ name, quantity, unit: finalUnit, category });

      if (results.length >= 20) break;
    }

    return results;
  } catch {
    // Be defensive — never throw to caller
    return [];
  }
}
