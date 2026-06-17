import { CanonicalIngredient } from '@/types';

/**
 * Canonical ingredient catalog — the controlled vocabulary of ShopWise.
 *
 * Every product and recipe ingredient resolves to one of these `id`s, so
 * matching is done by id (no ambiguity) instead of fragile substring checks.
 *
 * Granularity rule: functionally different items are distinct canonicals
 * ('leite' vs 'leite-coco' vs 'creme-leite'); mere variants are aliases
 * ('leite integral', 'leite desnatado' → 'leite').
 *
 * `aliases` should be lowercase, unaccented is fine (the resolver normalizes).
 * This list is bundled locally (offline, free); it can later be mirrored to
 * Supabase for admin editing without changing the matching code.
 */
export const INGREDIENTS: CanonicalIngredient[] = [
  // ── Laticínios ──────────────────────────────────────────────────────────
  { id: 'leite', name: 'Leite', category: 'Laticínios', aliases: ['leite integral', 'leite desnatado', 'leite semidesnatado', 'leite de vaca'] },
  { id: 'leite-coco', name: 'Leite de Coco', category: 'Laticínios', aliases: ['leite de coco'] },
  { id: 'leite-po', name: 'Leite em Pó', category: 'Laticínios', aliases: ['leite em po', 'leite ninho'] },
  { id: 'leite-condensado', name: 'Leite Condensado', category: 'Laticínios', aliases: ['leite condensado'] },
  { id: 'creme-leite', name: 'Creme de Leite', category: 'Laticínios', aliases: ['creme de leite', 'nata'] },
  { id: 'iogurte', name: 'Iogurte', category: 'Laticínios', aliases: ['iogurtes', 'yogurt', 'iogurte natural'] },
  { id: 'queijo', name: 'Queijo', category: 'Laticínios', aliases: ['queijos', 'queijo mussarela', 'mussarela', 'queijo prato', 'queijo minas'] },
  { id: 'requeijao', name: 'Requeijão', category: 'Laticínios', aliases: ['requeijao', 'catupiry'] },
  { id: 'cream-cheese', name: 'Cream Cheese', category: 'Laticínios', aliases: ['cream cheese'] },
  { id: 'manteiga', name: 'Manteiga', category: 'Laticínios', aliases: ['manteigas'] },
  { id: 'margarina', name: 'Margarina', category: 'Laticínios', aliases: ['margarinas'] },

  // ── Ovos ────────────────────────────────────────────────────────────────
  { id: 'ovo', name: 'Ovo', category: 'Laticínios', aliases: ['ovos', 'ovo de galinha', 'ovos de galinha'] },

  // ── Carnes / Aves / Peixes ────────────────────────────────────────────────
  { id: 'frango', name: 'Frango', category: 'Carnes', aliases: ['peito de frango', 'coxa de frango', 'sobrecoxa', 'file de frango', 'frangos'] },
  { id: 'carne-bovina', name: 'Carne Bovina', category: 'Carnes', aliases: ['carne', 'carne de boi', 'patinho', 'acem', 'alcatra', 'coxao', 'carne moida', 'bife'] },
  { id: 'carne-suina', name: 'Carne Suína', category: 'Carnes', aliases: ['carne de porco', 'lombo', 'costela suina', 'pernil'] },
  { id: 'linguica', name: 'Linguiça', category: 'Carnes', aliases: ['linguica', 'linguicas', 'calabresa', 'linguica calabresa'] },
  { id: 'bacon', name: 'Bacon', category: 'Carnes', aliases: ['bacons'] },
  { id: 'presunto', name: 'Presunto', category: 'Carnes', aliases: ['presuntos'] },
  { id: 'salsicha', name: 'Salsicha', category: 'Carnes', aliases: ['salsichas'] },
  { id: 'peixe', name: 'Peixe', category: 'Carnes', aliases: ['peixes', 'tilapia', 'merluza', 'file de peixe', 'salmao'] },
  { id: 'atum', name: 'Atum', category: 'Carnes', aliases: ['atum em lata', 'atum enlatado'] },
  { id: 'sardinha', name: 'Sardinha', category: 'Carnes', aliases: ['sardinhas'] },
  { id: 'camarao', name: 'Camarão', category: 'Carnes', aliases: ['camarao', 'camaroes'] },

  // ── Hortifruti: legumes e verduras ────────────────────────────────────────
  { id: 'tomate', name: 'Tomate', category: 'Hortifruti', aliases: ['tomates'] },
  { id: 'cebola', name: 'Cebola', category: 'Hortifruti', aliases: ['cebolas'] },
  { id: 'alho', name: 'Alho', category: 'Hortifruti', aliases: ['dente de alho', 'dentes de alho', 'alhos'] },
  { id: 'batata', name: 'Batata', category: 'Hortifruti', aliases: ['batatas', 'batata inglesa'] },
  { id: 'batata-doce', name: 'Batata Doce', category: 'Hortifruti', aliases: ['batata doce'] },
  { id: 'cenoura', name: 'Cenoura', category: 'Hortifruti', aliases: ['cenouras'] },
  { id: 'abobrinha', name: 'Abobrinha', category: 'Hortifruti', aliases: ['abobrinhas'] },
  { id: 'abobora', name: 'Abóbora', category: 'Hortifruti', aliases: ['abobora', 'moranga'] },
  { id: 'pimentao', name: 'Pimentão', category: 'Hortifruti', aliases: ['pimentao', 'pimentoes'] },
  { id: 'alface', name: 'Alface', category: 'Hortifruti', aliases: ['alfaces'] },
  { id: 'couve', name: 'Couve', category: 'Hortifruti', aliases: ['couves'] },
  { id: 'brocolis', name: 'Brócolis', category: 'Hortifruti', aliases: ['brocolis'] },
  { id: 'couve-flor', name: 'Couve-flor', category: 'Hortifruti', aliases: ['couve flor', 'couve-flor'] },
  { id: 'espinafre', name: 'Espinafre', category: 'Hortifruti', aliases: ['espinafres'] },
  { id: 'pepino', name: 'Pepino', category: 'Hortifruti', aliases: ['pepinos'] },
  { id: 'beterraba', name: 'Beterraba', category: 'Hortifruti', aliases: ['beterrabas'] },
  { id: 'milho-verde', name: 'Milho Verde', category: 'Hortifruti', aliases: ['milho verde', 'milho'] },
  { id: 'ervilha', name: 'Ervilha', category: 'Hortifruti', aliases: ['ervilhas'] },
  { id: 'cogumelo', name: 'Cogumelo', category: 'Hortifruti', aliases: ['cogumelos', 'champignon'] },
  { id: 'gengibre', name: 'Gengibre', category: 'Hortifruti', aliases: [] },

  // ── Hortifruti: ervas frescas ─────────────────────────────────────────────
  { id: 'salsa', name: 'Salsa', category: 'Hortifruti', aliases: ['salsinha', 'cheiro verde'] },
  { id: 'cebolinha', name: 'Cebolinha', category: 'Hortifruti', aliases: [] },
  { id: 'coentro', name: 'Coentro', category: 'Hortifruti', aliases: [] },
  { id: 'manjericao', name: 'Manjericão', category: 'Hortifruti', aliases: ['manjericao'] },

  // ── Hortifruti: frutas ────────────────────────────────────────────────────
  { id: 'banana', name: 'Banana', category: 'Hortifruti', aliases: ['bananas'] },
  { id: 'maca', name: 'Maçã', category: 'Hortifruti', aliases: ['maca', 'macas'] },
  { id: 'laranja', name: 'Laranja', category: 'Hortifruti', aliases: ['laranjas'] },
  { id: 'limao', name: 'Limão', category: 'Hortifruti', aliases: ['limao', 'limoes'] },
  { id: 'mamao', name: 'Mamão', category: 'Hortifruti', aliases: ['mamao', 'mamoes'] },
  { id: 'manga', name: 'Manga', category: 'Hortifruti', aliases: ['mangas'] },
  { id: 'morango', name: 'Morango', category: 'Hortifruti', aliases: ['morangos'] },
  { id: 'uva', name: 'Uva', category: 'Hortifruti', aliases: ['uvas'] },
  { id: 'abacaxi', name: 'Abacaxi', category: 'Hortifruti', aliases: ['abacaxis'] },
  { id: 'abacate', name: 'Abacate', category: 'Hortifruti', aliases: ['abacates'] },
  { id: 'melancia', name: 'Melancia', category: 'Hortifruti', aliases: ['melancias'] },
  { id: 'coco', name: 'Coco', category: 'Hortifruti', aliases: ['coco ralado'] },

  // ── Padaria ───────────────────────────────────────────────────────────────
  { id: 'pao', name: 'Pão', category: 'Padaria', aliases: ['pao', 'paes', 'pao de forma', 'pao frances', 'pao integral'] },
  { id: 'bolo', name: 'Bolo', category: 'Padaria', aliases: ['bolos'] },
  { id: 'biscoito', name: 'Biscoito', category: 'Padaria', aliases: ['biscoitos', 'bolacha', 'bolachas'] },
  { id: 'torrada', name: 'Torrada', category: 'Padaria', aliases: ['torradas'] },

  // ── Mercearia: grãos e massas ─────────────────────────────────────────────
  { id: 'arroz', name: 'Arroz', category: 'Mercearia', aliases: ['arroz branco', 'arroz integral'] },
  { id: 'feijao', name: 'Feijão', category: 'Mercearia', aliases: ['feijao', 'feijao preto', 'feijao carioca'] },
  { id: 'lentilha', name: 'Lentilha', category: 'Mercearia', aliases: ['lentilhas'] },
  { id: 'grao-de-bico', name: 'Grão-de-bico', category: 'Mercearia', aliases: ['grao de bico', 'grao-de-bico'] },
  { id: 'macarrao', name: 'Macarrão', category: 'Mercearia', aliases: ['macarrao', 'massa', 'espaguete', 'penne', 'talharim'] },
  { id: 'aveia', name: 'Aveia', category: 'Mercearia', aliases: ['aveias', 'flocos de aveia'] },

  // ── Mercearia: farináceos ─────────────────────────────────────────────────
  { id: 'farinha-trigo', name: 'Farinha de Trigo', category: 'Mercearia', aliases: ['farinha de trigo', 'farinha', 'trigo'] },
  { id: 'farinha-mandioca', name: 'Farinha de Mandioca', category: 'Mercearia', aliases: ['farinha de mandioca'] },
  { id: 'fuba', name: 'Fubá', category: 'Mercearia', aliases: ['fuba'] },
  { id: 'amido-milho', name: 'Amido de Milho', category: 'Mercearia', aliases: ['amido de milho', 'maisena'] },
  { id: 'fermento', name: 'Fermento', category: 'Mercearia', aliases: ['fermentos', 'fermento em po', 'fermento biologico'] },

  // ── Mercearia: óleos, gorduras, condimentos líquidos ──────────────────────
  { id: 'oleo', name: 'Óleo', category: 'Mercearia', aliases: ['oleo', 'oleo de soja', 'oleo vegetal'] },
  { id: 'azeite', name: 'Azeite', category: 'Mercearia', aliases: ['azeite de oliva', 'azeites'] },
  { id: 'vinagre', name: 'Vinagre', category: 'Mercearia', aliases: ['vinagres'] },
  { id: 'molho-tomate', name: 'Molho de Tomate', category: 'Mercearia', aliases: ['molho de tomate', 'molho pronto'] },
  { id: 'extrato-tomate', name: 'Extrato de Tomate', category: 'Mercearia', aliases: ['extrato de tomate'] },
  { id: 'maionese', name: 'Maionese', category: 'Mercearia', aliases: ['maioneses'] },
  { id: 'mostarda', name: 'Mostarda', category: 'Mercearia', aliases: ['mostardas'] },
  { id: 'ketchup', name: 'Ketchup', category: 'Mercearia', aliases: ['catchup'] },
  { id: 'shoyu', name: 'Shoyu', category: 'Mercearia', aliases: ['molho shoyu', 'molho de soja'] },

  // ── Mercearia: temperos secos ─────────────────────────────────────────────
  { id: 'sal', name: 'Sal', category: 'Mercearia', aliases: ['sais'] },
  { id: 'pimenta', name: 'Pimenta', category: 'Mercearia', aliases: ['pimenta do reino', 'pimentas'] },
  { id: 'oregano', name: 'Orégano', category: 'Mercearia', aliases: ['oregano'] },
  { id: 'canela', name: 'Canela', category: 'Mercearia', aliases: ['canela em po'] },
  { id: 'cominho', name: 'Cominho', category: 'Mercearia', aliases: [] },
  { id: 'colorau', name: 'Colorau', category: 'Mercearia', aliases: ['colorifico', 'paprica'] },
  { id: 'caldo', name: 'Caldo', category: 'Mercearia', aliases: ['caldo de galinha', 'caldo knorr', 'tempero pronto'] },

  // ── Mercearia: açúcar, doces, enlatados, secos ────────────────────────────
  { id: 'acucar', name: 'Açúcar', category: 'Mercearia', aliases: ['acucar', 'acucares', 'acucar refinado', 'acucar mascavo'] },
  { id: 'adocante', name: 'Adoçante', category: 'Mercearia', aliases: ['adocante', 'adocantes'] },
  { id: 'mel', name: 'Mel', category: 'Mercearia', aliases: [] },
  { id: 'chocolate', name: 'Chocolate', category: 'Mercearia', aliases: ['chocolates', 'chocolate em po', 'cacau'] },
  { id: 'achocolatado', name: 'Achocolatado', category: 'Mercearia', aliases: ['nescau', 'toddy'] },
  { id: 'azeitona', name: 'Azeitona', category: 'Mercearia', aliases: ['azeitonas'] },
  { id: 'amendoim', name: 'Amendoim', category: 'Mercearia', aliases: ['amendoins'] },
  { id: 'castanha', name: 'Castanha', category: 'Mercearia', aliases: ['castanhas', 'castanha de caju', 'castanha do para'] },
  { id: 'nozes', name: 'Nozes', category: 'Mercearia', aliases: ['noz'] },
  { id: 'passas', name: 'Uva Passa', category: 'Mercearia', aliases: ['uva passa', 'uvas passas', 'passas'] },

  // ── Bebidas ───────────────────────────────────────────────────────────────
  { id: 'cafe', name: 'Café', category: 'Bebidas', aliases: ['cafe', 'cafe em po'] },
  { id: 'cha', name: 'Chá', category: 'Bebidas', aliases: ['cha', 'chas'] },
  { id: 'agua', name: 'Água', category: 'Bebidas', aliases: ['agua', 'agua mineral'] },
  { id: 'suco', name: 'Suco', category: 'Bebidas', aliases: ['sucos', 'suco de laranja'] },
  { id: 'refrigerante', name: 'Refrigerante', category: 'Bebidas', aliases: ['refrigerantes', 'refri', 'coca cola', 'guarana'] },

  // ── Internacionais / veganos / extras ─────────────────────────────────────
  { id: 'tofu', name: 'Tofu', category: 'Outros', aliases: ['queijo de soja'] },
  { id: 'proteina-soja', name: 'Proteína de Soja', category: 'Outros', aliases: ['pts', 'proteina de soja', 'carne de soja', 'soja texturizada'] },
  { id: 'quinoa', name: 'Quinoa', category: 'Mercearia', aliases: ['quinua'] },
  { id: 'chia', name: 'Chia', category: 'Mercearia', aliases: ['semente de chia', 'sementes de chia'] },
  { id: 'granola', name: 'Granola', category: 'Mercearia', aliases: ['granolas'] },
  { id: 'cuscuz', name: 'Cuscuz', category: 'Mercearia', aliases: ['cuscuz marroquino', 'cuscuz nordestino', 'trigo para quibe'] },
  { id: 'feijao-branco', name: 'Feijão Branco', category: 'Mercearia', aliases: ['feijao branco'] },
  { id: 'tahine', name: 'Tahine', category: 'Mercearia', aliases: ['tahini', 'pasta de gergelim'] },
  { id: 'gergelim', name: 'Gergelim', category: 'Mercearia', aliases: ['semente de gergelim', 'sesamo'] },
  { id: 'curry', name: 'Curry', category: 'Mercearia', aliases: ['caril', 'curry em po'] },
  { id: 'pasta-amendoim', name: 'Pasta de Amendoim', category: 'Mercearia', aliases: ['manteiga de amendoim', 'pasta de amendoim'] },
  { id: 'oleo-coco', name: 'Óleo de Coco', category: 'Mercearia', aliases: ['oleo de coco'] },
  { id: 'leite-vegetal', name: 'Leite Vegetal', category: 'Bebidas', aliases: ['leite de amendoas', 'leite de aveia', 'leite vegetal', 'bebida vegetal', 'leite de soja'] },
  { id: 'tortilla', name: 'Tortilla', category: 'Padaria', aliases: ['tortilha', 'tortillas', 'wrap', 'pao sirio', 'pita'] },
  { id: 'berinjela', name: 'Berinjela', category: 'Hortifruti', aliases: ['berinjelas'] },
  { id: 'repolho', name: 'Repolho', category: 'Hortifruti', aliases: ['repolhos'] },
  { id: 'vagem', name: 'Vagem', category: 'Hortifruti', aliases: ['vagens'] },
  { id: 'mandioca', name: 'Mandioca', category: 'Hortifruti', aliases: ['aipim', 'macaxeira'] },
  { id: 'inhame', name: 'Inhame', category: 'Hortifruti', aliases: ['inhames'] },
  { id: 'palmito', name: 'Palmito', category: 'Mercearia', aliases: ['palmitos'] },
  { id: 'rucula', name: 'Rúcula', category: 'Hortifruti', aliases: ['rucula'] },
];

/** Fast lookup by canonical id. */
export const INGREDIENTS_BY_ID: Map<string, CanonicalIngredient> = new Map(
  INGREDIENTS.map((i) => [i.id, i]),
);
