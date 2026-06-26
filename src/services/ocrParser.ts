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
  'LTDA', 'EPP', '\\bME\\b', '\\bIE\\b', 'INSCRICAO', 'ENDERECO', 'AVENIDA', '\\bAV\\b',
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
  // 1) Weighed items: a DECIMAL weight/volume is the real purchased quantity
  //    (e.g. "1,230 KG", "0,5 L"). Package sizes like "5KG"/"500G" are integers
  //    glued to the product name and must NOT be read as the quantity.
  const dec = line.match(/(\d+[,.]\d+)\s*(kg|g|ml|l)\b/i);
  if (dec) {
    const qty = parseFloat(dec[1].replace(',', '.'));
    const u = dec[2].toLowerCase();
    if (qty > 0) return { quantity: qty, unit: u === 'l' ? 'L' : u };
  }
  // 2) Explicit count: "3 UN" / "2 x ..." — a SPACE is required so pack-size
  //    tokens like "12UN" or "5KG" don't get mistaken for the count.
  const count = line.match(/(\d+)\s+un\b/i) || line.match(/(\d+)\s*[xX]\s/);
  if (count?.[1]) {
    const qty = parseInt(count[1], 10);
    if (qty > 0 && qty < 100) return { quantity: qty, unit: 'un' };
  }
  // 3) Default: one unit (the review screen lets the user adjust).
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

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      if (isNoiseLine(line)) continue;
      // A bare quantity line with no preceding product name → skip (noise).
      if (isQtyLine(line)) continue;

      const cleaned = cleanName(line);
      if (cleaned.length < 3) continue;

      let { quantity, unit } = extractQuantity(line);

      // If the product name line carried no explicit qty, the qty/price is often
      // on the NEXT line — pull it from there and consume that line.
      const next = lines[idx + 1];
      if (quantity === 1 && unit === 'un' && next && isQtyLine(next)) {
        const nq = extractQuantity(next);
        quantity = nq.quantity;
        unit = nq.unit;
        idx++;
      }

      // Refine the unit from a standalone unit token in the name line ("... KG").
      for (const token of line.split(/\s+/)) {
        const detected = detectUnit(token);
        if (detected) { if (unit === 'un') unit = detected; break; }
      }

      const name = toTitleCase(cleaned);
      results.push({ name, quantity, unit, category: guessCategory(name) });

      if (results.length >= 20) break;
    }

    return results;
  } catch {
    // Be defensive — never throw to caller
    return [];
  }
}
