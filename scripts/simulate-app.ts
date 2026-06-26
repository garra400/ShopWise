/**
 * Full-cycle app simulation on the PC (no APK):
 *   npx tsx scripts/simulate-app.ts
 *
 * 1) OCR the sample receipts (real Tesseract) → build the pantry (mirroring the
 *    app's buildItem) → print each item with its STATUS (good/expiring/at_risk),
 *    flagging anything that comes pre-warned on purchase day.
 * 2) "Cook" several local recipes → deduct ingredients and print before→after,
 *    flagging wrong/odd deductions.
 */
import fs from 'fs';
import path from 'path';
import { addDays, format } from 'date-fns';
import { parseReceiptText } from '@/services/ocrParser';
import {
  resolveCanonicalId, getIngredient, suggestedUnit, suggestedShelfLifeDays, sameIngredient,
} from '@/utils/ingredients';
import { convertMeasure } from '@/utils/measure';
import { getStatus, statusLabel } from '@/utils/status';
import { RECIPES } from '@/data/recipes';
import type { Product } from '@/types';

const today = format(new Date(), 'yyyy-MM-dd');
const qf = (n: number) => (Number.isInteger(n) ? String(n) : Number(n.toFixed(3)).toString().replace('.', ','));

function buildProduct(name: string, quantity: number, unit: string, category: string): Product {
  const cid = resolveCanonicalId(name);
  const ing = getIngredient(cid);
  const finalUnit = unit !== 'un' ? unit : cid ? suggestedUnit(cid) : unit;
  return {
    id: 'p-' + (cid ?? name),
    name: ing ? ing.name : name,
    canonicalId: cid,
    category: ing?.category ?? category ?? 'Outros',
    quantity,
    unit: finalUnit,
    purchaseDate: today,
    expiryDate: format(addDays(new Date(), suggestedShelfLifeDays(cid)), 'yyyy-MM-dd'),
    source: 'receipt_scan',
    consumed: false,
    createdAt: today,
    updatedAt: today,
  };
}

async function buildPantry(): Promise<Product[]> {
  const Tesseract = (await import('tesseract.js')).default;
  const dir = 'notas-teste';
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).map((f) => path.join(dir, f));
  const byId = new Map<string, Product>();
  for (const file of files) {
    const { data } = await Tesseract.recognize(file, 'por');
    for (const it of parseReceiptText(data.text ?? '')) {
      const cid = resolveCanonicalId(it.name);
      if (!cid) continue; // only recognized items reach the pantry
      const prod = buildProduct(it.name, it.quantity, it.unit, it.category);
      const existing = byId.get(cid);
      if (existing && existing.unit === prod.unit) existing.quantity = (existing.quantity ?? 0) + (prod.quantity ?? 0);
      else if (!existing) byId.set(cid, prod);
    }
  }
  return [...byId.values()];
}

function daysLeftOf(p: Product): number {
  return Math.round((new Date(p.expiryDate).getTime() - Date.now()) / 86400000);
}

async function main() {
  const pantry = await buildPantry();

  console.log('========== DESPENSA (após escanear todas as notas) ==========');
  let preWarned = 0;
  for (const p of pantry.sort((a, b) => a.category.localeCompare(b.category))) {
    const st = getStatus(p);
    const flag = st === 'good' ? '' : '   ⚠️ JÁ AVISADO NA COMPRA';
    if (st !== 'good') preWarned++;
    console.log(`  ${p.name.padEnd(16)} ${qf(p.quantity ?? 0).padStart(6)} ${p.unit.padEnd(3)} | ${p.category.padEnd(11)} | vence em ${String(daysLeftOf(p)).padStart(3)}d | ${statusLabel(st, 'pt')}${flag}`);
  }
  console.log(`\n  Itens pré-avisados na compra: ${preWarned} (esperado 0)`);

  const cook = (recipeId: string) => {
    const r = RECIPES.find((x) => x.id === recipeId);
    if (!r) return;
    console.log(`\n========== COZINHAR: ${r.title} (serve ${r.servings ?? '?'}) ==========`);
    const taken = new Set<string>();
    for (const ing of r.ingredients) {
      const p = pantry.find((pr) => !pr.consumed && !taken.has(pr.id) && sameIngredient(ing, pr));
      if (!p) { console.log(`  - ${ing.name}: (não tem na despensa)`); continue; }
      taken.add(p.id);
      const before = `${qf(p.quantity ?? 0)} ${p.unit}`;
      if (p.quantity == null) { p.consumed = true; console.log(`  - ${ing.name}: consumido (sem qtd) [${p.name}]`); continue; }
      if (ing.quantity == null) { console.log(`  - ${ing.name}: receita sem qtd → mantém ${before}`); continue; }
      const used = convertMeasure(ing.quantity, ing.unit, p.unit, p.canonicalId ?? ing.canonicalId);
      if (used == null) { console.log(`  - ${ing.name}: ${ing.quantity} ${ing.unit} (não converte p/ ${p.unit}) → mantém ${before}`); continue; }
      const remaining = Math.round((p.quantity - used) * 100) / 100;
      if (remaining > 0.01) { p.quantity = remaining; console.log(`  - ${ing.name}: usa ${qf(Math.round(used * 100) / 100)} ${p.unit} → ${before} vira ${qf(remaining)} ${p.unit}`); }
      else { p.consumed = true; console.log(`  - ${ing.name}: usa ${qf(Math.round(used * 100) / 100)} ${p.unit} → ${before} ACABOU (consumido)`); }
    }
  };

  ['r1', 'r2', 'r9', 'r16'].forEach(cook);

  console.log('\n========== DESPENSA DEPOIS ==========');
  for (const p of pantry.filter((x) => !x.consumed)) console.log(`  ${p.name.padEnd(16)} ${qf(p.quantity ?? 0)} ${p.unit}`);
  console.log('  --- consumidos:', pantry.filter((x) => x.consumed).map((x) => x.name).join(', ') || '(nenhum)');
}

main().catch((e) => { console.error('ERRO:', e); process.exit(1); });
