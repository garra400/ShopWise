# 📱 Planejamento - App Lista de Compras Inteligente

## 1. Visão Geral do Projeto

**Nome do App:** ShopWise (Proposta)

**Objetivo:** Criar um aplicativo mobile inteligente que gerencia uma lista de compras dinâmica com reconhecimento automático de produtos via IA, monitoramento de datas de validade e sugestão de receitas baseada em ingredientes disponíveis.

**Stack Tecnológico:**
- React Native
- Expo
- IA/ML para reconhecimento de produtos e datas

---

## 2. Funcionalidades Principais

### 2.1 Gerenciamento de Produtos

#### Adição de Produtos
- **Via Scan de Comprovante:** Usuário fotografa recibo/comprovante → IA reconhece produtos automaticamente
- **Via Inserção Manual:** Usuário digita manualmente os dados do produto
- **Scan de Código de Barras:** (Opcional) Integração com APIs de código de barras

**Dados Capturados:**
- Nome do produto
- Data de compra
- Data de validade (inserida manualmente ou por scan da data no produto)
- Categoria (inferida pela IA ou manual)
- Quantidade (se disponível)

#### Status e Categorização

O sistema categoriza automaticamente os produtos em 4 categorias baseado na data de validade:

| Categoria | Critério | Ícone | Cor | Descrição |
|-----------|----------|-------|-----|-----------|
| **Bom** | Validade > 1 mês | `v` | 🟢 Verde | Produto com prazo de consumo amplo |
| **Para Vencer** | 1 semana < Validade ≤ 1 mês | `x` | 🟡 Amarelo | Alerta para consumir em breve |
| **Em Risco** | Validade < 1 semana | `x` | 🔴 Vermelho | Urgência alta para consumir |
| **Vencido** | Validade < Data Atual | `-` | ⚫ Cinza | Produto não mais seguro |

**Exibição na Interface:**
- Apenas produtos "Bom", "Em Risco" e "Vencido" são mostrados na tela inicial
- Produtos "Para Vencer" podem ser acessados em uma seção específica ou filtro

### 2.2 Sugestão de Receitas

- **Algoritmo Inteligente:** Busca receitas que utilizam produtos disponíveis no armário
- **Priorização:** Receitas que incluem produtos em risco de vencer recebem prioridade
- **Ordenação:** 
  1. Receitas com produtos em risco (vermelho)
  2. Receitas com produtos para vencer (amarelo)
  3. Receitas com produtos bons (verde)

### 2.3 Configurações

- Preferências de dieta/alergias
- Notificações de produtos vencendo
- Idioma do aplicativo
- Temas (claro/escuro)
- Unidades de medida (kg, g, ml, etc.)

---

## 3. Fluxos de Usuário

### 3.1 Fluxo: Adicionar Produtos via Comprovante

```
1. Usuário abre app → Tela inicial
2. Clica em "Adicionar" → Câmera
3. Fotografa comprovante/recibo
4. IA processa e reconhece produtos
5. Usuário revisa/confirma produtos reconhecidos
6. Sistema solicita data de validade para cada produto
7. Usuário insere manualmente ou clica para escanear data no produto
8. Produtos são adicionados à lista
9. Sistema retorna para tela inicial
```

### 3.2 Fluxo: Adicionar Produto Manual

```
1. Usuário abre app → Tela inicial
2. Clica em "Adicionar Manual"
3. Preenche formulário: nome, categoria, data de validade
4. Confirma adição
5. Produto aparece na lista com status correspondente
```

### 3.3 Fluxo: Visualizar Sugestões de Receitas

```
1. Usuário clica em "Receitas" ou "Sugestões"
2. Sistema carrega receitas baseadas em produtos disponíveis
3. Receitas ordenadas por prioridade (produtos vencendo primeiro)
4. Usuário pode clicar em receita para ver detalhes/ingredientes
5. Opção para marcar ingredientes como utilizados
```

### 3.4 Fluxo: Gerenciar Produtos

```
1. Tela inicial exibe lista de produtos com status visual
2. Usuário pode:
   - Deslizar para deletar
   - Clicar para editar dados
   - Marcar como consumido
   - Renovar validade
```

---

## 4. Estrutura de Dados

### 4.1 Schema de Produto

```json
{
  "id": "uuid",
  "name": "string",
  "category": "string",
  "purchaseDate": "ISO-8601 date",
  "expiryDate": "ISO-8601 date",
  "status": "good | expiring_soon | at_risk | expired",
  "quantity": "number (opcional)",
  "unit": "string (kg, g, ml, etc.)",
  "image": "string (URI da foto)",
  "source": "receipt_scan | manual | barcode",
  "consumed": "boolean",
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp"
}
```

### 4.2 Schema de Receita

```json
{
  "id": "uuid",
  "title": "string",
  "ingredients": [
    {
      "name": "string",
      "quantity": "number",
      "unit": "string"
    }
  ],
  "instructions": "string",
  "prepTime": "number (minutos)",
  "difficulty": "easy | medium | hard",
  "matchingProducts": ["product_id"],
  "matchPercentage": "number (0-100)"
}
```

---

## 5. Componentes/Telas Principais

### 5.1 Telas Identificadas

- **Dashboard/Home:** Exibe lista de produtos com status visual
- **Adicionar Produto:** Menu com opções (scan comprovante, inserção manual)
- **Câmera/Scanner:** Captura de comprovantes e datas de validade
- **Confirmação de Produtos:** Revisão dos produtos reconhecidos
- **Receitas:** Sugestões de receitas ordenadas por prioridade
- **Detalhes de Receita:** Ingredientes, modo de preparo, etc.
- **Configurações:** Preferências do usuário
- **Histórico:** (Opcional) Histórico de produtos consumidos

---

## 6. Arquitetura Técnica

### 6.1 Estrutura Sugerida

```
TrabalhoReact/
├── src/
│   ├── screens/           # Telas do app
│   ├── components/        # Componentes reutilizáveis
│   ├── services/          # Serviços (API, IA, banco de dados)
│   ├── context/           # Context API para estado global
│   ├── utils/             # Funções auxiliares
│   ├── constants/         # Constantes
│   └── App.js
├── assets/                # Imagens, ícones
├── app.json              # Configuração Expo
└── package.json
```

### 6.2 Bibliotecas Necessárias (Potenciais)

- **Câmera:** `expo-camera`
- **Armazenamento:** `AsyncStorage` ou Realm
- **Reconhecimento de Texto (OCR):** `react-native-ml-kit` ou API externa
- **Navegação:** `@react-navigation/native`
- **Ícones:** `react-native-vector-icons`
- **Datas:** `date-fns` ou `moment`

---

## 7. Plano de Implementação

### Fase 1: MVP (Mínimo Viável) - ~2 semanas
- [ ] Setup do projeto React Native + Expo
- [ ] Tela de Home com lista de produtos
- [ ] Tela de Adicionar Produto Manual
- [ ] Armazenamento local (AsyncStorage)
- [ ] Lógica de cálculo de status de produtos
- [ ] Interface básica com ícones de status

### Fase 2: Reconhecimento de Comprovante - ~2 semanas
- [ ] Integração com câmera para scan de comprovante
- [ ] Integração com IA/OCR para reconhecimento de produtos
- [ ] Tela de confirmação de produtos reconhecidos
- [ ] Inserção de datas de validade

### Fase 3: Sugestão de Receitas - ~2 semanas
- [ ] API de receitas (local ou externa)
- [ ] Algoritmo de matching de receitas
- [ ] Tela de sugestões ordenadas por prioridade
- [ ] Detalhes de receita

### Fase 4: Polimento e Extras - ~1 semana
- [ ] Tela de Configurações
- [ ] Notificações de produtos vencendo
- [ ] Tratamento de erros e edge cases
- [ ] Testes e otimização

---

## 8. Considerações Técnicas

### 8.1 Desafios Identificados

- **OCR Preciso:** Reconhecimento confiável de comprovantes em diferentes formatos
- **IA para Receitas:** Necessário API ou modelo local de receitas
- **Performance:** Processamento eficiente de imagens
- **Armazenamento:** Estratégia de sincronização em nuvem (opcional)

### 8.2 Próximas Decisões

- Qual API/modelo para reconhecimento de produtos?
- Banco de dados em nuvem ou apenas local?
- Fonte de receitas (API, banco de dados local, etc.)?
- Suporte offline?

---

## 9. Métricas de Sucesso

- Tempo de scan e reconhecimento < 5 segundos
- Taxa de reconhecimento correto > 85%
- Sugestões de receitas relevantes ao acervo de produtos
- Usabilidade intuitiva (teste com usuários)

---

**Versão:** 1.0  
**Última Atualização:** Maio 2026  
**Status:** Planejamento Inicial