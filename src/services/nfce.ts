import { ReceiptItem } from '@/services/ocr';

/**
 * NFC-e (nota fiscal de consumidor eletrônica) helpers.
 *
 * The QR code on a Brazilian NFC-e encodes a SEFAZ "consulta" URL whose `p`
 * query param starts with the 44-digit access key (chave de acesso). The public
 * consultation page renders the full item list. We fetch and parse it best-effort.
 *
 * NOTE: the HTML layout varies per state — this targets the common SEFAZ DANFE
 * NFC-e "consultaqrcode" structure (used by Paraná). Needs validation on a real
 * device with a real receipt; falls back gracefully when it cannot parse.
 */

export interface NfceRef {
  chave: string; // 44-digit access key
  url: string;   // the full consulta URL from the QR
}

/** Extract the access key + consulta URL from raw QR data. Returns null if not an NFC-e QR. */
export function parseNfceUrl(data: string): NfceRef | null {
  if (!data) return null;
  const url = data.trim();
  try {
    const pMatch = url.match(/[?&]p=([^&\s]+)/i);
    let chave = '';
    if (pMatch?.[1]) {
      chave = decodeURIComponent(pMatch[1]).split('|')[0].replace(/\D/g, '');
    } else {
      const digits = url.replace(/\D/g, '');
      if (digits.length === 44) chave = digits;
    }
    if (chave.length !== 44) return null;
    return { chave, url: /^https?:\/\//i.test(url) ? url : `https://www.fazenda.pr.gov.br/nfce/qrcode?p=${chave}` };
  } catch {
    return null;
  }
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Parse the SEFAZ NFC-e consultation HTML into receipt items (best-effort).
 * Targets the common structure: each product has a `txtTit` description span,
 * followed by "Qtde.:" and "UN:" fields.
 */
export function parseNfceHtml(html: string): ReceiptItem[] {
  const items: ReceiptItem[] = [];
  try {
    const chunks = html.split(/<span[^>]*class=["']txtTit[^"']*["'][^>]*>/i).slice(1);
    for (const chunk of chunks) {
      const name = stripTags(chunk.split('</span>')[0] ?? '');
      if (!name || name.length < 2) continue;

      const qtyM = chunk.match(/Qtde\.?\s*:?\s*(?:<\/strong>)?\s*([\d.,]+)/i);
      const unitM = chunk.match(/\bUN\s*:?\s*(?:<\/strong>)?\s*([A-Za-zÀ-ú]{1,4})/i);

      const quantity = qtyM?.[1] ? parseFloat(qtyM[1].replace(/\./g, '').replace(',', '.')) || 1 : 1;
      const unit = (unitM?.[1] ?? 'un').toLowerCase();

      items.push({ name, quantity, unit, category: 'Outros' });
      if (items.length >= 60) break;
    }
  } catch {
    // best-effort
  }
  return items;
}

/**
 * Fetch + parse the items of an NFC-e from its consulta URL.
 * Works on native (no CORS); on web it will likely be blocked by CORS.
 * Returns [] on any failure — caller should fall back to manual/OCR.
 */
export async function fetchNfceItems(ref: NfceRef): Promise<ReceiptItem[]> {
  try {
    const res = await fetch(ref.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Android) ShopWise/1.0' },
    });
    if (!res.ok) return [];
    const html = await res.text();
    return parseNfceHtml(html);
  } catch {
    return [];
  }
}
