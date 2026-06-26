/**
 * Pipeline validator (run on the PC, no APK needed):
 *   npx tsx scripts/validate-pipeline.ts
 *
 * 1) Runs the REAL OCR parser on the sample receipts (notas-teste) and shows the
 *    pantry item each line becomes (name + quantity + unit), mirroring the app.
 * 2) Runs the REAL measurement table on recipe→pantry deduction scenarios and
 *    shows how much is used and what remains.
 *
 * Lets us catch unit/quantity mistakes fast, without rebuilding the app.
 */
import { parseReceiptText } from '@/services/ocrParser';
import { convertMeasure } from '@/utils/measure';
import { resolveCanonicalId, getIngredient, suggestedUnit } from '@/utils/ingredients';

const money = (n: number) => n.toFixed(2).replace('.', ',');
const qtd = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(3).replace('.', ','));

type Row = [cod: string, desc: string, q: number, un: string, vu: number];

function receiptText(store: string, items: Row[]): string {
  const lines = [store, 'CNPJ 00.000.000/0000-00', 'DANFE NFC-e'];
  items.forEach(([cod, desc, q, un, vu], i) => {
    lines.push(`${String(i + 1).padStart(3, '0')} ${cod} ${desc}`);
    lines.push(`${qtd(q)} ${un} x ${money(vu)}      ${money(q * vu)}`);
  });
  lines.push('VALOR TOTAL R$ 99,99');
  return lines.join('\n');
}

const RECEIPTS: Record<string, Row[]> = {
  'nota_1 (mercado)': [
    ['7891', 'ARROZ BRANCO TIPO 1 5KG', 1, 'UN', 24.9],
    ['7892', 'FEIJAO CARIOCA 1KG', 2, 'UN', 8.49],
    ['7893', 'LEITE INTEGRAL 1L', 6, 'UN', 4.79],
    ['7894', 'OVOS BRANCOS 12UN', 1, 'UN', 13.9],
    ['7895', 'OLEO DE SOJA 900ML', 1, 'UN', 7.29],
    ['7896', 'ACUCAR REFINADO 1KG', 1, 'UN', 4.59],
    ['7897', 'CAFE TORRADO 500G', 1, 'UN', 15.9],
    ['7898', 'MACARRAO ESPAGUETE 500G', 2, 'UN', 4.19],
  ],
  'nota_2 (açougue, pesados)': [
    ['1010', 'FILE DE PEITO DE FRANGO KG', 1.23, 'KG', 14.9],
    ['1012', 'LINGUICA TOSCANA KG', 0.64, 'KG', 18.9],
    ['1013', 'BACON EM PEDACO 500G', 1, 'UN', 16.49],
    ['1016', 'SAL REFINADO 1KG', 1, 'UN', 2.49],
  ],
  'nota_3 (hortifruti)': [
    ['2002', 'CEBOLA KG', 0.98, 'KG', 3.99],
    ['2003', 'ALHO 200G', 1, 'UN', 5.49],
    ['2006', 'BANANA PRATA KG', 1.34, 'KG', 4.99],
    ['2008', 'ALFACE CRESPA UN', 1, 'UN', 3.49],
  ],
};

console.log('========== 1) OCR → item da despensa ==========');
for (const [name, items] of Object.entries(RECEIPTS)) {
  console.log(`\n### ${name}`);
  for (const it of parseReceiptText(receiptText(name, items))) {
    const cid = resolveCanonicalId(it.name);
    const ing = getIngredient(cid);
    const finalUnit = it.unit !== 'un' ? it.unit : cid ? suggestedUnit(cid) : it.unit;
    const label = ing ? ing.name : it.name;
    const reco = ing ? '' : '  (não reconhecido)';
    console.log(`  ${label.padEnd(16)} ${qtd(it.quantity)} ${finalUnit}${reco}`);
  }
}

console.log('\n========== 2) Baixa receita → despensa ==========');
const scenarios: { id: string; ing: number; ingU: string; pq: number; pu: string }[] = [
  { id: 'arroz', ing: 2, ingU: 'xíc.', pq: 1, pu: 'kg' },
  { id: 'cebola', ing: 1, ingU: 'un', pq: 0.98, pu: 'kg' },
  { id: 'alho', ing: 3, ingU: 'dentes', pq: 200, pu: 'g' },
  { id: 'leite', ing: 200, ingU: 'ml', pq: 6, pu: 'L' },
  { id: 'frango', ing: 500, ingU: 'g', pq: 1.23, pu: 'kg' },
  { id: 'ovo', ing: 2, ingU: 'un', pq: 12, pu: 'un' },
  { id: 'macarrao', ing: 400, ingU: 'g', pq: 1000, pu: 'g' },
  { id: 'acucar', ing: 1, ingU: 'col. (sopa)', pq: 1, pu: 'kg' },
  { id: 'oleo', ing: 2, ingU: 'col. (sopa)', pq: 900, pu: 'ml' },
  { id: 'farinha-trigo', ing: 1, ingU: 'xíc.', pq: 1, pu: 'kg' },
];
for (const s of scenarios) {
  const used = convertMeasure(s.ing, s.ingU, s.pu, s.id);
  const name = getIngredient(s.id)?.name ?? s.id;
  if (used == null) {
    console.log(`  ${name.padEnd(14)} receita ${s.ing} ${s.ingU} | despensa ${s.pq} ${s.pu} → (não converte, deixa como está)`);
  } else {
    const rem = Math.round((s.pq - used) * 1000) / 1000;
    console.log(`  ${name.padEnd(14)} receita ${s.ing} ${s.ingU} = ${Math.round(used * 1000) / 1000} ${s.pu} | despensa ${s.pq} ${s.pu} → sobra ${rem} ${s.pu}`);
  }
}
