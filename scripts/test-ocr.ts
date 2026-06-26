/**
 * Real OCR test on the PC (no APK): runs the SAME engine the web app uses
 * (Tesseract.js, 'por') on the sample receipt images, then the real parser.
 *   npx tsx scripts/test-ocr.ts [file1.png file2.png ...]
 * Default: all PNGs in notas-teste/.
 */
import fs from 'fs';
import path from 'path';
import { parseReceiptText } from '@/services/ocrParser';
import { resolveCanonicalId, getIngredient, suggestedUnit } from '@/utils/ingredients';

const qtd = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(3).replace('.', ','));

async function main() {
  const args = process.argv.slice(2);
  const dir = 'notas-teste';
  const files = args.length
    ? args
    : fs.readdirSync(dir).filter((f) => f.endsWith('.png')).map((f) => path.join(dir, f));

  const Tesseract = (await import('tesseract.js')).default;

  for (const file of files) {
    console.log(`\n================= ${file} =================`);
    const { data } = await Tesseract.recognize(file, 'por');
    const text = data.text ?? '';
    console.log('--- TEXTO BRUTO (OCR) ---');
    console.log(text.split('\n').map((l) => l.trim()).filter(Boolean).join('\n'));
    console.log('--- ITENS RECONHECIDOS ---');
    for (const it of parseReceiptText(text)) {
      const cid = resolveCanonicalId(it.name);
      const ing = getIngredient(cid);
      const finalUnit = it.unit !== 'un' ? it.unit : cid ? suggestedUnit(cid) : it.unit;
      const label = ing ? ing.name : it.name;
      console.log(`  ${label.padEnd(18)} ${qtd(it.quantity)} ${finalUnit}${ing ? '' : '   (ignorado)'}`);
    }
  }
}

main().catch((e) => { console.error('ERРО:', e); process.exit(1); });
