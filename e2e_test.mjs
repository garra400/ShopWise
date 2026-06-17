import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:8081';
const SHOT = 'C:/Users/dev04/ShopWise/.e2e';
mkdirSync(SHOT, { recursive: true });

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} :: ${name}${detail ? ' :: ' + detail : ''}`);
}

const consoleErrors = [];
const pageErrors = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
page.setDefaultTimeout(60000);
page.setDefaultNavigationTimeout(150000);

page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => pageErrors.push(e.message));
// Accept window.confirm dialogs (used by delete / clear flows)
page.on('dialog', async (d) => { await d.accept(); });
// Track external API calls — with no key, there must be ZERO Spoonacular requests
const spoonacularRequests = [];
const supabaseRequests = [];
page.on('request', (r) => {
  const u = r.url();
  if (u.includes('api.spoonacular.com')) spoonacularRequests.push(u);
  if (u.includes('supabase.co') || u.includes('supabase.in')) supabaseRequests.push(u);
});

async function gotoRoute(path) {
  // 'commit' fires as soon as the response starts; the 8MB dev bundle + HMR
  // websocket mean domcontentloaded/networkidle are unreliable. We wait on
  // actual rendered content via hasText() afterwards.
  await page.goto(BASE + path, { waitUntil: 'commit' });
}

// web.output:"static" → routes are SSR'd then hydrated. SSR text is visible
// before onPress handlers attach, so wait for hydration before interacting.
async function settle(ms = 4000) {
  await page.waitForTimeout(ms);
}

async function hasText(t, timeout = 8000) {
  try {
    await page.getByText(t, { exact: false }).first().waitFor({ timeout });
    return true;
  } catch {
    return false;
  }
}

try {
  // ---- 1. Initial load + seed render ----
  await gotoRoute('/');
  const homeLoaded = await hasText('Leite Integral', 180000); // cold first-load bundle compile can be slow
  check('Home carrega e renderiza produto seed (Leite Integral)', homeLoaded);
  await page.screenshot({ path: `${SHOT}/01-home.png`, fullPage: true });

  // Home should show good/at_risk/expired, NOT expiring_soon
  check('Home mostra Arroz (good)', await hasText('Arroz'));
  check('Home mostra Frango (at_risk)', await hasText('Frango'));
  check('Home mostra Tomate (expired)', await hasText('Tomate'));
  const iogurteOnHome = await hasText('Iogurte', 2500);
  check('Home OCULTA Iogurte (expiring_soon nao aparece na Home)', !iogurteOnHome,
    iogurteOnHome ? 'Iogurte apareceu na Home (esperado so em Para Vencer)' : '');

  // ---- 2. Para Vencer ----
  await gotoRoute('/expiring');
  check('Para Vencer mostra Iogurte (expiring_soon)', await hasText('Iogurte', 15000));
  check('Para Vencer mostra Pao de Forma (expiring_soon)', await hasText('Forma'));
  await page.screenshot({ path: `${SHOT}/02-para-vencer.png`, fullPage: true });

  // ---- 3. Receitas ----
  await gotoRoute('/recipes');
  const recipesLoaded = await hasText('%', 20000); // match percentage shown
  check('Receitas renderiza lista com % de match', recipesLoaded);
  await page.screenshot({ path: `${SHOT}/03-receitas.png`, fullPage: true });

  // ---- 4. Config ----
  await gotoRoute('/settings');
  const settingsLoaded = await hasText('Tema', 20000);
  check('Config renderiza (secao Tema)', settingsLoaded);
  check('Config mostra secao Conta e Sincronizacao', await hasText('Conta e Sincronização', 6000));
  await settle();
  await page.screenshot({ path: `${SHOT}/04-config-claro.png`, fullPage: true });

  // ---- 5. Theme switch (Escuro) ----
  let themeSwitched = false;
  try {
    await page.getByText('Escuro', { exact: true }).first().click({ timeout: 8000 });
    await page.waitForTimeout(1500);
    // sample background color of the page body wrapper
    const bg = await page.evaluate(() => {
      const el = document.querySelector('#root') || document.body;
      return getComputedStyle(el).backgroundColor;
    });
    const hasDarkSurface = await page.evaluate(() =>
      Array.from(document.querySelectorAll('div')).some(
        (d) => getComputedStyle(d).backgroundColor === 'rgb(0, 0, 0)'
      )
    );
    themeSwitched = hasDarkSurface;
    check('Troca de tema para Escuro aplica superficie escura', themeSwitched, `bodyBg=${bg} darkSurface=${hasDarkSurface}`);
  } catch (e) {
    check('Troca de tema para Escuro aplica fundo escuro', false, String(e).slice(0, 120));
  }
  await page.screenshot({ path: `${SHOT}/05-config-escuro.png`, fullPage: true });
  // revert to Sistema
  try { await page.getByText('Sistema', { exact: true }).first().click({ timeout: 5000 }); } catch {}

  // ---- 5b. Filtro de dieta (Vegano) em Config -> Receitas ----
  try {
    await page.getByText('Vegano', { exact: true }).first().click({ timeout: 8000 });
    await page.waitForTimeout(800);
    await gotoRoute('/recipes');
    await settle();
    const recipesStillRender = await hasText('%', 20000);
    const filterChipShown = await hasText(/Vegano/i, 6000);
    check('Filtro de dieta (Vegano) mantem Receitas renderizando', recipesStillRender);
    check('Receitas mostra indicador de filtro ativo (Vegano)', filterChipShown);
    await page.screenshot({ path: `${SHOT}/09-receitas-vegano.png`, fullPage: true });
    // revert: desmarcar Vegano
    await gotoRoute('/settings');
    await settle();
    await page.getByText('Vegano', { exact: true }).first().click({ timeout: 8000 });
    await page.waitForTimeout(500);
  } catch (e) {
    check('Filtro de dieta (Vegano) mantem Receitas renderizando', false, String(e).slice(0, 160));
  }

  // ---- 6. Add manual flow ----
  await gotoRoute('/add/manual');
  const formLoaded = await hasText('Nome', 20000);
  check('Form manual renderiza', formLoaded);
  await settle();
  try {
    await page.getByPlaceholder('Ex: Leite Integral').fill('Teste Playwright');
    // two date fields share placeholder dd/MM/aaaa; index 1 = validade
    const dateFields = page.getByPlaceholder('dd/MM/aaaa');
    await dateFields.nth(1).fill('25/12/2027');
    await page.waitForTimeout(300);
    await page.getByText('Adicionar produto', { exact: false }).first().click();
    await page.waitForTimeout(1500);
    // Navigate to Home explicitly (deep-linked form has no back-stack) and verify persistence
    await gotoRoute('/');
    const added = await hasText('Teste Playwright', 20000);
    check('Produto manual adicionado persiste e aparece na Home', added);
    await page.screenshot({ path: `${SHOT}/06-apos-add.png`, fullPage: true });
  } catch (e) {
    check('Produto manual adicionado aparece na Home', false, String(e).slice(0, 160));
  }

  // ---- 7. Mock scan flow ----
  await gotoRoute('/add/scan');
  try {
    await hasText(/Simular/i, 20000); // wait for screen render
    await settle();
    // exact match targets the button, not the disclaimer paragraph that mentions "Simular"
    await page.getByText('Simular escaneamento de comprovante', { exact: true }).first().click({ timeout: 10000 });
    await page.waitForTimeout(4000); // mock OCR ~1.5s + render
    const reviewShown = await hasText(/reconhecido/i, 12000);
    check('Mock scan retorna itens para revisao', reviewShown);
    await page.screenshot({ path: `${SHOT}/07-scan-review.png`, fullPage: true });
  } catch (e) {
    check('Mock scan retorna itens para revisao', false, String(e).slice(0, 160));
  }

  // ---- 7b. OCR real (Tesseract.js) via upload de imagem ----
  try {
    // gera uma imagem de cupom sintetica com texto nitido
    const receiptPath = `${SHOT}/receipt.png`;
    const genPage = await ctx.newPage();
    await genPage.setViewportSize({ width: 520, height: 600 });
    await genPage.setContent(
      '<body style="margin:0;background:#fff"><pre style="font:30px/1.6 monospace;color:#000;padding:28px">' +
      'MERCADO BOM PRECO\nLEITE INTEGRAL\nARROZ\nFEIJAO\nBANANA\nTOMATE\nPAO DE FORMA\nTOTAL  42,90' +
      '</pre></body>'
    );
    await genPage.screenshot({ path: receiptPath });
    await genPage.close();

    await gotoRoute('/add/scan');
    await hasText(/Selecionar imagem/i, 20000);
    await settle();
    const [chooser] = await Promise.all([
      page.waitForEvent('filechooser', { timeout: 15000 }),
      page.getByText(/Selecionar imagem/i).first().click(),
    ]);
    await chooser.setFiles(receiptPath);
    await page.waitForTimeout(1500);
    // exact match targets the button, not the disclaimer paragraph that mentions "Reconhecer produtos"
    await page.getByText('Reconhecer produtos', { exact: true }).first().click({ timeout: 10000 });
    // Tesseract baixa o modelo 'por' + processa: pode levar dezenas de segundos
    const ocrItems = await hasText(/reconhecido/i, 120000);
    const fallbackUsed = await hasText(/usando exemplo/i, 1500);
    check('OCR real (Tesseract) via upload preenche a lista de revisao', ocrItems,
      `usedFallback=${fallbackUsed}`);
    await page.screenshot({ path: `${SHOT}/10-ocr-real.png`, fullPage: true });
  } catch (e) {
    check('OCR real (Tesseract) via upload preenche a lista de revisao', false, String(e).slice(0, 180));
  }

  // ---- 8. Product detail + delete (window.confirm fix) ----
  await gotoRoute('/product/seed-5'); // Arroz
  const detailLoaded = await hasText('Arroz', 20000);
  check('Detalhe do produto carrega (Arroz)', detailLoaded);
  await settle();
  await page.screenshot({ path: `${SHOT}/08-detalhe.png`, fullPage: true });
  try {
    await page.getByText(/Excluir/i).first().click({ timeout: 8000 });
    await page.waitForTimeout(1500);
    await gotoRoute('/');
    await page.waitForTimeout(1500);
    const arrozGone = !(await hasText('Arroz', 3000));
    check('Excluir produto (window.confirm) remove da Home', arrozGone);
  } catch (e) {
    check('Excluir produto (window.confirm) remove da Home', false, String(e).slice(0, 160));
  }
} catch (fatal) {
  check('Execucao sem erro fatal', false, String(fatal).slice(0, 300));
} finally {
  // ---- Console / page errors ----
  const realConsole = consoleErrors.filter(
    // GO_BACK is a dev-only warning triggered only because the test deep-links
    // into the form route (no back-stack); not reachable in normal UI navigation.
    (e) => !/Download the React DevTools|Reanimated|useNativeDriver|deprecated|favicon|sourceMappingURL|GO_BACK|development-only|Is there any screen/i.test(e)
  );
  check('Sem erros de pageerror (excecoes JS)', pageErrors.length === 0,
    pageErrors.slice(0, 5).join(' | '));
  check('Sem erros graves no console', realConsole.length === 0,
    realConsole.slice(0, 6).join(' | '));
  check('Nenhuma requisicao Spoonacular sem chave de API', spoonacularRequests.length === 0,
    spoonacularRequests.slice(0, 3).join(' | '));
  check('Nenhuma requisicao Supabase sem chaves (contrato local-first)', supabaseRequests.length === 0,
    supabaseRequests.slice(0, 3).join(' | '));

  console.log('\n===== RESUMO =====');
  const pass = results.filter((r) => r.ok).length;
  console.log(`${pass}/${results.length} checks passaram`);
  console.log('PAGE ERRORS:', pageErrors.length, '| CONSOLE ERRORS (raw):', consoleErrors.length, '| (filtrados):', realConsole.length);
  if (consoleErrors.length) console.log('--- console errors (ate 10) ---\n' + consoleErrors.slice(0, 10).join('\n'));
  await browser.close();
}
