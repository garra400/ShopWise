import { ReceiptItem } from '@/services/ocr';

// ---------------------------------------------------------------------------
// Noise-line filters
// ---------------------------------------------------------------------------

/** Lines that are purely numeric/symbol noise or too short (< 3 letters) */
const NOISE_KEYWORDS = [
  'TOTAL', 'SUBTOTAL', 'TROCO', 'CNPJ', 'CPF', 'CUPOM', 'FISCAL',
  'VALOR', 'DINHEIRO', 'CARTAO', 'CREDITO', 'DEBITO', 'PIX', 'ICMS', 'PIS',
  'COFINS', 'TRIBUTOS?', 'IMPOSTO', 'R\\$', '%',
  // store / header / footer noise
  'LTDA', 'EPP', '\\bME\\b', '\\bIE\\b', '\\bS\\.?A\\.?\\b', 'INSCRICAO', 'ENDERECO', 'AVENIDA', '\\bAV\\b',
  '\\bRUA\\b', '\\bTEL\\b', 'FONE', 'EMISSAO', 'PROTOCOLO', 'CHAVE', 'ACESSO',
  'CONSUMIDOR', 'NFC-?E', 'NF-?E', '\\bSAT\\b', 'SERIE', 'CAIXA', 'OPERADOR',
  'OBRIGAD', 'VOLTE SEMPRE', 'DESCONTO', 'ACRESCIMO', 'PAGAMENTO', 'PAGO',
  'QTD', 'QTDE', 'UNIT', 'DESCRICAO', 'ITEM', '\\bVL\\b',
];
const NOISE_REGEX = new RegExp(NOISE_KEYWORDS.join('|'), 'i');

/** ISO-ish date like 01/01/2024, time like 12:30, or mostly digits */
const DATE_TIME_REGEX = /\b\d{2}[\/\-]\d{2}[\/\-]\d{2,4}\b|\b\d{1,2}:\d{2}\b/;

/**
 * A "quantity line" — the qty × unit-price = total line that, on many receipts,
 * sits on the line BELOW the product name (e.g. "1,230 KG x 14,90   17,25").
 * Starts with a number, optional unit, an x, and a price.
 */
const QTY_LINE_REGEX = /^\s*\d+[,.]?\d*\s*(kg|g|ml|l|un)?\s*[xX]\s*\d+[,.]\d{2}/i;
function isQtyLine(line: string): boolean {
  return QTY_LINE_REGEX.test(line);
}

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
// Pack size & quantity
// ---------------------------------------------------------------------------

function normUnit(u: string): string {
  const x = u.toLowerCase();
  return x === 'l' ? 'L' : x; // kg, g, ml stay; l → L
}

/**
 * Package size declared in the product NAME, e.g. "ARROZ 5KG" → 5 kg,
 * "OLEO 900ML" → 900 ml, "OVOS 12UN" → 12 un. This is the real measure the
 * shopper bought (a 5kg bag), so we use it instead of guessing a unit.
 * Returns the LAST size found (sizes sit at the end of the name).
 */
function extractPackSize(name: string): { size: number; unit: string } | null {
  let best: { size: number; unit: string } | null = null;
  const wv = /(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = wv.exec(name))) best = { size: parseFloat(m[1].replace(',', '.')), unit: normUnit(m[2]) };
  if (best) return best;
  // count pack like "12UN" (a dozen) — only if no weight/volume size
  const un = /(\d+)\s*un\b/i.exec(name);
  if (un) return { size: parseInt(un[1], 10), unit: 'un' };
  return null;
}

/** From a "qty × unit-price = total" line, read the count and any decimal weight. */
function parseQtyLine(line: string): { count: number; weight: { v: number; u: string } | null } {
  let count = 1;
  const cm = /(\d+)\s*un\b/i.exec(line) || /^\s*(\d+)\s*[xX]/.exec(line);
  if (cm) { const n = parseInt(cm[1], 10); if (n > 0 && n < 100) count = n; }
  const dec = /(\d+[.,]\d+)\s*(kg|g|ml|l)\b/i.exec(line);
  const weight = dec ? { v: parseFloat(dec[1].replace(',', '.')), u: normUnit(dec[2]) } : null;
  return { count, weight };
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

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      if (isNoiseLine(line)) continue;
      // A bare quantity line with no preceding product name → skip (noise).
      if (isQtyLine(line)) continue;

      const cleaned = cleanName(line);
      if (cleaned.length < 3) continue;

      // The package size in the name ("ARROZ 5KG", "OLEO 900ML", "OVOS 12UN").
      const pack = extractPackSize(line);

      // The qty/price line is usually right BELOW the product name.
      const next = lines[idx + 1];
      const qline = next && isQtyLine(next) ? lines[++idx] : (isQtyLine(line) ? line : null);
      const { count, weight } = qline ? parseQtyLine(qline) : { count: 1, weight: null };

      let quantity: number;
      let unit: string;
      if (pack) {
        // bought `count` packages of `size` → total measure (e.g. 6× 1L = 6 L)
        quantity = Math.round(pack.size * count * 1000) / 1000;
        unit = pack.unit;
      } else if (weight) {
        // weighed item: the decimal weight on the qty line is the amount
        quantity = weight.v;
        unit = weight.u;
      } else {
        quantity = count;
        unit = 'un';
      }

      const name = toTitleCase(cleaned);
      results.push({ name, quantity, unit, category: guessCategory(name) });

      if (results.length >= 30) break;
    }

    return results;
  } catch {
    // Be defensive — never throw to caller
    return [];
  }
}
