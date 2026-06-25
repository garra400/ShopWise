# ShopWise

App mobile (Expo / React Native) que ajuda a **cadastrar a despensa sem esforço**
(carro-chefe: leitura de nota fiscal por OCR + QR Code da NFC-e), **decidir o que
cozinhar** com o que você já tem (priorizando o que está vencendo) e **evitar
desperdício**.

- **Local-first**: funciona 100% offline, sem nenhuma configuração.
- **Opcional**: com Supabase, cada conta tem a própria despensa, com backup e
  sincronização entre aparelhos.

---

## Stack
- Expo SDK 56, React Native, **expo-router** (rotas em `src/app`), TypeScript (strict).
- Armazenamento local: AsyncStorage. Nuvem opcional: Supabase (Auth + Postgres + RLS).
- OCR: Tesseract.js (web) / Google ML Kit (nativo). Fotos: Pexels (opcional).

## Pré-requisitos
- Node 24+ e npm.
- Conta Expo (EAS) para gerar APK.

---

## Instalação
```bash
npm install
cp .env.example .env   # (Windows: copy .env.example .env)
```
Preencha o `.env` se quiser as integrações opcionais (veja abaixo). Sem chaves, o
app roda 100% local.

### Variáveis de ambiente (`.env`, todas opcionais)
| Variável | Para quê |
|---|---|
| `EXPO_PUBLIC_PEXELS_API_KEY` | Fotos das receitas (grátis, sem cartão). |
| `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Contas + sincronização na nuvem. **Use só a chave anon/public, nunca a service_role.** |
| `EXPO_PUBLIC_SPOONACULAR_API_KEY` | Busca de receitas online (opcional). |

> O Expo injeta variáveis `EXPO_PUBLIC_*` em tempo de build. **Após editar o `.env`,
> reinicie o Metro** (use `--clear` se necessário).

---

## Rodar e testar (web)
```bash
# Type check — deve sair 0 antes de concluir qualquer mudança
npx tsc --noEmit

# Servidor de desenvolvimento (web)
npx expo start --web --port 8081
```
Abra http://localhost:8081. A compilação a frio leva ~15–25s.

Dicas:
- Se a porta 8081 ficar presa: descubra o PID com `netstat -ano | findstr :8081`
  e finalize com `Stop-Process -Id <pid> -Force` (PowerShell).
- Verificação automatizada usa **Playwright (chromium)**: scripts `.mjs` temporários
  na raiz, `page.goto(url, { waitUntil: 'commit' })`, espera ~20s, screenshot e leitura.

---

## Gerar APK (EAS)
```bash
eas build -p android --profile preview --non-interactive
```
- O perfil `preview` gera **APK arm64-v8a** (~67 MB) — definido em `eas.json`
  (`ORG_GRADLE_PROJECT_reactNativeArchitectures=arm64-v8a`). O "universal" ficava
  grande demais (~174 MB).
- As chaves no APK vêm das **EAS environment variables** (environment `preview`),
  não do `.env` local.
- O link do build é privado; compartilhe o link direto do `.apk`
  (`expo.dev/artifacts/eas/...apk`).

### O que só dá pra testar no APK (não funciona na web)
- **OCR da nota** (ML Kit) e **QR da NFC-e** em cupom real.
- **Notificações locais** de validade (avisam 1 dia antes, às 9h).
- **Login/cadastro com código (OTP)** e **excluir conta** (precisam de e-mail real
  e da configuração do Supabase abaixo).

---

## Contas e sincronização (Supabase)
O app funciona sem isso (modo convidado). Para habilitar contas:

1. Crie um projeto grátis em https://supabase.com e preencha as chaves no `.env`.
2. No **SQL Editor**, rode nesta ordem (todos idempotentes — pode re-rodar):
   - `supabase_schema.sql` — tabelas, **RLS por usuário** e a função LGPD
     `delete_my_account()`.
   - `supabase_recipes_seed.sql` — catálogo de receitas da comunidade.
   - `supabase_recipes_images.sql` — imagens curadas das receitas.
3. **Confirmação de e-mail por código (OTP) — opcional:**
   - Authentication → Sign In / Providers → **Email**: **Confirm email = ON**.
   - ⚠️ **Editar os templates de e-mail exige SMTP próprio.** O e-mail embutido do
     Supabase só envia ~2/hora e **somente para e-mails da equipe do projeto**, e a
     edição dos templates fica travada até configurar SMTP.
   - Para o código por e-mail funcionar de verdade:
     1. Crie um SMTP grátis (ex.: **Brevo** — 300/dia, valida remetente por e-mail;
        ou **Resend**).
     2. Authentication → **Emails → SMTP Settings** (`.../auth/smtp`) → **Enable custom
        SMTP** e preencha host/port/usuário/senha/remetente. (Brevo: `smtp-relay.brevo.com`,
        porta `587`.)
     3. Com o SMTP salvo, os **Templates destravam** → em **"Confirm signup"** e
        **"Reset password"** troque o link por `{{ .Token }}` (código de 6 dígitos):
        ```html
        <p>Seu código do ShopWise é: <b style="font-size:24px;letter-spacing:3px">{{ .Token }}</b></p>
        ```
   - **Sem nada disso:** deixe **Confirm email = OFF** — o app detecta e **pula a tela de
     código** (cadastro loga direto). Contas, login e recuperação por código exigem o SMTP;
     o resto funciona normalmente.

### Privacidade / LGPD (resumo)
- Consentimento obrigatório no cadastro; guardamos só o **e-mail** e os itens da
  despensa. Sem rastreamento.
- **Isolamento por conta** (RLS): cada usuário só acessa os próprios dados.
- **Direito à exclusão**: "Excluir minha conta e dados" chama `delete_my_account()`.
- Transporte por HTTPS; apenas a chave **anon** no app.

---

## Estrutura (resumo)
```
src/
  app/          rotas (expo-router): despensa, para vencer, receitas, config, add/, recipe/, product/
  components/   UI reutilizável (ProductCard, IngredientPicker, Button, ...)
  context/      Settings, Products (despensa por escopo), Sync (auth/OTP/sync), Favorites
  data/         ingredients.ts (catálogo canônico), recipes.ts (16 locais), seed.ts
  services/     ocr*, nfce, notifications, recipesRepo, storage, supabase
  utils/        recipes (matching/ranking), diet, status, units, ingredients
  i18n/         dicionário PT/EN + useT()
supabase_schema.sql / supabase_recipes_seed.sql / supabase_recipes_images.sql
```

## Convenções
- TypeScript strict; mantenha `npx tsc --noEmit` em 0.
- Módulos nativos puros (ML Kit) só via arquivos `.native`/`.web` (não quebrar o web).
- UI em PT-BR, sentence case, com acentos corretos.
