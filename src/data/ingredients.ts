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
  { id: 'leite', name: 'Leite', nameEn: 'Milk', category: 'Laticínios', aliases: ['leite integral', 'leite desnatado', 'leite semidesnatado', 'leite de vaca'] },
  { id: 'leite-coco', name: 'Leite de Coco', nameEn: 'Coconut Milk', category: 'Laticínios', aliases: ['leite de coco'] },
  { id: 'leite-po', name: 'Leite em Pó', nameEn: 'Powdered Milk', category: 'Laticínios', aliases: ['leite em po', 'leite ninho'] },
  { id: 'leite-condensado', name: 'Leite Condensado', nameEn: 'Condensed Milk', category: 'Laticínios', aliases: ['leite condensado'] },
  { id: 'creme-leite', name: 'Creme de Leite', nameEn: 'Table Cream', category: 'Laticínios', aliases: ['creme de leite', 'nata'] },
  { id: 'iogurte', name: 'Iogurte', nameEn: 'Yogurt', category: 'Laticínios', aliases: ['iogurtes', 'yogurt', 'iogurte natural'] },
  { id: 'queijo', name: 'Queijo', nameEn: 'Cheese', category: 'Laticínios', aliases: ['queijos', 'queijo mussarela', 'mussarela', 'queijo prato', 'queijo minas'] },
  { id: 'requeijao', name: 'Requeijão', nameEn: 'Cream Cheese Spread', category: 'Laticínios', aliases: ['requeijao', 'catupiry'] },
  { id: 'cream-cheese', name: 'Cream Cheese', nameEn: 'Cream Cheese', category: 'Laticínios', aliases: ['cream cheese'] },
  { id: 'manteiga', name: 'Manteiga', nameEn: 'Butter', category: 'Laticínios', aliases: ['manteigas'] },
  { id: 'margarina', name: 'Margarina', nameEn: 'Margarine', category: 'Laticínios', aliases: ['margarinas'] },

  // ── Ovos ────────────────────────────────────────────────────────────────
  { id: 'ovo', name: 'Ovo', nameEn: 'Egg', category: 'Laticínios', aliases: ['ovos', 'ovo de galinha', 'ovos de galinha'] },

  // ── Carnes / Aves / Peixes ────────────────────────────────────────────────
  { id: 'frango', name: 'Frango', nameEn: 'Chicken', category: 'Carnes', aliases: ['peito de frango', 'coxa de frango', 'sobrecoxa', 'file de frango', 'frangos'] },
  { id: 'carne-bovina', name: 'Carne Bovina', nameEn: 'Beef', category: 'Carnes', aliases: ['carne', 'carne de boi', 'patinho', 'acem', 'alcatra', 'coxao', 'carne moida', 'bife'] },
  { id: 'carne-suina', name: 'Carne Suína', nameEn: 'Pork', category: 'Carnes', aliases: ['carne de porco', 'lombo', 'costela suina', 'pernil'] },
  { id: 'linguica', name: 'Linguiça', nameEn: 'Sausage', category: 'Carnes', aliases: ['linguica', 'linguicas', 'calabresa', 'linguica calabresa'] },
  { id: 'bacon', name: 'Bacon', nameEn: 'Bacon', category: 'Carnes', aliases: ['bacons'] },
  { id: 'presunto', name: 'Presunto', nameEn: 'Ham', category: 'Carnes', aliases: ['presuntos'] },
  { id: 'salsicha', name: 'Salsicha', nameEn: 'Hot Dog Sausage', category: 'Carnes', aliases: ['salsichas'] },
  { id: 'peixe', name: 'Peixe', nameEn: 'Fish', category: 'Carnes', aliases: ['peixes', 'tilapia', 'merluza', 'file de peixe', 'salmao'] },
  { id: 'atum', name: 'Atum', nameEn: 'Tuna', category: 'Carnes', aliases: ['atum em lata', 'atum enlatado'] },
  { id: 'sardinha', name: 'Sardinha', nameEn: 'Sardine', category: 'Carnes', aliases: ['sardinhas'] },
  { id: 'camarao', name: 'Camarão', nameEn: 'Shrimp', category: 'Carnes', aliases: ['camarao', 'camaroes'] },

  // ── Hortifruti: legumes e verduras ────────────────────────────────────────
  { id: 'tomate', name: 'Tomate', nameEn: 'Tomato', category: 'Hortifruti', aliases: ['tomates'] },
  { id: 'cebola', name: 'Cebola', nameEn: 'Onion', category: 'Hortifruti', aliases: ['cebolas'] },
  { id: 'alho', name: 'Alho', nameEn: 'Garlic', category: 'Hortifruti', aliases: ['dente de alho', 'dentes de alho', 'alhos'] },
  { id: 'batata', name: 'Batata', nameEn: 'Potato', category: 'Hortifruti', aliases: ['batatas', 'batata inglesa'] },
  { id: 'batata-doce', name: 'Batata Doce', nameEn: 'Sweet Potato', category: 'Hortifruti', aliases: ['batata doce'] },
  { id: 'cenoura', name: 'Cenoura', nameEn: 'Carrot', category: 'Hortifruti', aliases: ['cenouras'] },
  { id: 'abobrinha', name: 'Abobrinha', nameEn: 'Zucchini', category: 'Hortifruti', aliases: ['abobrinhas'] },
  { id: 'abobora', name: 'Abóbora', nameEn: 'Pumpkin', category: 'Hortifruti', aliases: ['abobora', 'moranga'] },
  { id: 'pimentao', name: 'Pimentão', nameEn: 'Bell Pepper', category: 'Hortifruti', aliases: ['pimentao', 'pimentoes'] },
  { id: 'alface', name: 'Alface', nameEn: 'Lettuce', category: 'Hortifruti', aliases: ['alfaces'] },
  { id: 'couve', name: 'Couve', nameEn: 'Collard Greens', category: 'Hortifruti', aliases: ['couves'] },
  { id: 'brocolis', name: 'Brócolis', nameEn: 'Broccoli', category: 'Hortifruti', aliases: ['brocolis'] },
  { id: 'couve-flor', name: 'Couve-flor', nameEn: 'Cauliflower', category: 'Hortifruti', aliases: ['couve flor', 'couve-flor'] },
  { id: 'espinafre', name: 'Espinafre', nameEn: 'Spinach', category: 'Hortifruti', aliases: ['espinafres'] },
  { id: 'pepino', name: 'Pepino', nameEn: 'Cucumber', category: 'Hortifruti', aliases: ['pepinos'] },
  { id: 'beterraba', name: 'Beterraba', nameEn: 'Beet', category: 'Hortifruti', aliases: ['beterrabas'] },
  { id: 'milho-verde', name: 'Milho Verde', nameEn: 'Corn', category: 'Hortifruti', aliases: ['milho verde', 'milho'] },
  { id: 'ervilha', name: 'Ervilha', nameEn: 'Peas', category: 'Hortifruti', aliases: ['ervilhas'] },
  { id: 'cogumelo', name: 'Cogumelo', nameEn: 'Mushroom', category: 'Hortifruti', aliases: ['cogumelos', 'champignon'] },
  { id: 'gengibre', name: 'Gengibre', nameEn: 'Ginger', category: 'Hortifruti', aliases: [] },

  // ── Hortifruti: ervas frescas ─────────────────────────────────────────────
  { id: 'salsa', name: 'Salsa', nameEn: 'Parsley', category: 'Hortifruti', aliases: ['salsinha', 'cheiro verde'] },
  { id: 'cebolinha', name: 'Cebolinha', nameEn: 'Chives', category: 'Hortifruti', aliases: [] },
  { id: 'coentro', name: 'Coentro', nameEn: 'Cilantro', category: 'Hortifruti', aliases: [] },
  { id: 'manjericao', name: 'Manjericão', nameEn: 'Basil', category: 'Hortifruti', aliases: ['manjericao'] },

  // ── Hortifruti: frutas ────────────────────────────────────────────────────
  { id: 'banana', name: 'Banana', nameEn: 'Banana', category: 'Hortifruti', aliases: ['bananas'] },
  { id: 'maca', name: 'Maçã', nameEn: 'Apple', category: 'Hortifruti', aliases: ['maca', 'macas'] },
  { id: 'laranja', name: 'Laranja', nameEn: 'Orange', category: 'Hortifruti', aliases: ['laranjas'] },
  { id: 'limao', name: 'Limão', nameEn: 'Lime', category: 'Hortifruti', aliases: ['limao', 'limoes'] },
  { id: 'mamao', name: 'Mamão', nameEn: 'Papaya', category: 'Hortifruti', aliases: ['mamao', 'mamoes'] },
  { id: 'manga', name: 'Manga', nameEn: 'Mango', category: 'Hortifruti', aliases: ['mangas'] },
  { id: 'morango', name: 'Morango', nameEn: 'Strawberry', category: 'Hortifruti', aliases: ['morangos'] },
  { id: 'uva', name: 'Uva', nameEn: 'Grape', category: 'Hortifruti', aliases: ['uvas'] },
  { id: 'abacaxi', name: 'Abacaxi', nameEn: 'Pineapple', category: 'Hortifruti', aliases: ['abacaxis'] },
  { id: 'abacate', name: 'Abacate', nameEn: 'Avocado', category: 'Hortifruti', aliases: ['abacates'] },
  { id: 'melancia', name: 'Melancia', nameEn: 'Watermelon', category: 'Hortifruti', aliases: ['melancias'] },
  { id: 'coco', name: 'Coco', nameEn: 'Coconut', category: 'Hortifruti', aliases: ['coco ralado'] },

  // ── Padaria ───────────────────────────────────────────────────────────────
  { id: 'pao', name: 'Pão', nameEn: 'Bread', category: 'Padaria', aliases: ['pao', 'paes', 'pao de forma', 'pao frances', 'pao integral'] },
  { id: 'bolo', name: 'Bolo', nameEn: 'Cake', category: 'Padaria', aliases: ['bolos'] },
  { id: 'biscoito', name: 'Biscoito', nameEn: 'Cookie', category: 'Padaria', aliases: ['biscoitos', 'bolacha', 'bolachas'] },
  { id: 'torrada', name: 'Torrada', nameEn: 'Toast', category: 'Padaria', aliases: ['torradas'] },

  // ── Mercearia: grãos e massas ─────────────────────────────────────────────
  { id: 'arroz', name: 'Arroz', nameEn: 'Rice', category: 'Mercearia', aliases: ['arroz branco', 'arroz integral'] },
  { id: 'feijao', name: 'Feijão', nameEn: 'Beans', category: 'Mercearia', aliases: ['feijao', 'feijao preto', 'feijao carioca'] },
  { id: 'lentilha', name: 'Lentilha', nameEn: 'Lentils', category: 'Mercearia', aliases: ['lentilhas'] },
  { id: 'grao-de-bico', name: 'Grão-de-bico', nameEn: 'Chickpeas', category: 'Mercearia', aliases: ['grao de bico', 'grao-de-bico'] },
  { id: 'macarrao', name: 'Macarrão', nameEn: 'Pasta', category: 'Mercearia', aliases: ['macarrao', 'massa', 'espaguete', 'penne', 'talharim'] },
  { id: 'aveia', name: 'Aveia', nameEn: 'Oats', category: 'Mercearia', aliases: ['aveias', 'flocos de aveia'] },

  // ── Mercearia: farináceos ─────────────────────────────────────────────────
  { id: 'farinha-trigo', name: 'Farinha de Trigo', nameEn: 'Wheat Flour', category: 'Mercearia', aliases: ['farinha de trigo', 'farinha', 'trigo'] },
  { id: 'farinha-mandioca', name: 'Farinha de Mandioca', nameEn: 'Cassava Flour', category: 'Mercearia', aliases: ['farinha de mandioca'] },
  { id: 'fuba', name: 'Fubá', nameEn: 'Cornmeal', category: 'Mercearia', aliases: ['fuba'] },
  { id: 'amido-milho', name: 'Amido de Milho', nameEn: 'Cornstarch', category: 'Mercearia', aliases: ['amido de milho', 'maisena'] },
  { id: 'fermento', name: 'Fermento', nameEn: 'Baking Powder', category: 'Mercearia', aliases: ['fermentos', 'fermento em po', 'fermento biologico'] },

  // ── Mercearia: óleos, gorduras, condimentos líquidos ──────────────────────
  { id: 'oleo', name: 'Óleo', nameEn: 'Oil', category: 'Mercearia', aliases: ['oleo', 'oleo de soja', 'oleo vegetal'] },
  { id: 'azeite', name: 'Azeite', nameEn: 'Olive Oil', category: 'Mercearia', aliases: ['azeite de oliva', 'azeites'] },
  { id: 'vinagre', name: 'Vinagre', nameEn: 'Vinegar', category: 'Mercearia', aliases: ['vinagres'] },
  { id: 'molho-tomate', name: 'Molho de Tomate', nameEn: 'Tomato Sauce', category: 'Mercearia', aliases: ['molho de tomate', 'molho pronto'] },
  { id: 'extrato-tomate', name: 'Extrato de Tomate', nameEn: 'Tomato Paste', category: 'Mercearia', aliases: ['extrato de tomate'] },
  { id: 'maionese', name: 'Maionese', nameEn: 'Mayonnaise', category: 'Mercearia', aliases: ['maioneses'] },
  { id: 'mostarda', name: 'Mostarda', nameEn: 'Mustard', category: 'Mercearia', aliases: ['mostardas'] },
  { id: 'ketchup', name: 'Ketchup', nameEn: 'Ketchup', category: 'Mercearia', aliases: ['catchup'] },
  { id: 'shoyu', name: 'Shoyu', nameEn: 'Soy Sauce', category: 'Mercearia', aliases: ['molho shoyu', 'molho de soja'] },

  // ── Mercearia: temperos secos ─────────────────────────────────────────────
  { id: 'sal', name: 'Sal', nameEn: 'Salt', category: 'Mercearia', aliases: ['sais'] },
  { id: 'pimenta', name: 'Pimenta', nameEn: 'Pepper', category: 'Mercearia', aliases: ['pimenta do reino', 'pimentas'] },
  { id: 'oregano', name: 'Orégano', nameEn: 'Oregano', category: 'Mercearia', aliases: ['oregano'] },
  { id: 'canela', name: 'Canela', nameEn: 'Cinnamon', category: 'Mercearia', aliases: ['canela em po'] },
  { id: 'cominho', name: 'Cominho', nameEn: 'Cumin', category: 'Mercearia', aliases: [] },
  { id: 'colorau', name: 'Colorau', nameEn: 'Annatto', category: 'Mercearia', aliases: ['colorifico', 'paprica'] },
  { id: 'caldo', name: 'Caldo', nameEn: 'Bouillon', category: 'Mercearia', aliases: ['caldo de galinha', 'caldo knorr', 'tempero pronto'] },

  // ── Mercearia: açúcar, doces, enlatados, secos ────────────────────────────
  { id: 'acucar', name: 'Açúcar', nameEn: 'Sugar', category: 'Mercearia', aliases: ['acucar', 'acucares', 'acucar refinado', 'acucar mascavo'] },
  { id: 'adocante', name: 'Adoçante', nameEn: 'Sweetener', category: 'Mercearia', aliases: ['adocante', 'adocantes'] },
  { id: 'mel', name: 'Mel', nameEn: 'Honey', category: 'Mercearia', aliases: [] },
  { id: 'chocolate', name: 'Chocolate', nameEn: 'Chocolate', category: 'Mercearia', aliases: ['chocolates', 'chocolate em po', 'cacau'] },
  { id: 'achocolatado', name: 'Achocolatado', nameEn: 'Chocolate Powder', category: 'Mercearia', aliases: ['nescau', 'toddy'] },
  { id: 'azeitona', name: 'Azeitona', nameEn: 'Olive', category: 'Mercearia', aliases: ['azeitonas'] },
  { id: 'amendoim', name: 'Amendoim', nameEn: 'Peanut', category: 'Mercearia', aliases: ['amendoins'] },
  { id: 'castanha', name: 'Castanha', nameEn: 'Cashew', category: 'Mercearia', aliases: ['castanhas', 'castanha de caju', 'castanha do para'] },
  { id: 'nozes', name: 'Nozes', nameEn: 'Walnuts', category: 'Mercearia', aliases: ['noz'] },
  { id: 'passas', name: 'Uva Passa', nameEn: 'Raisins', category: 'Mercearia', aliases: ['uva passa', 'uvas passas', 'passas'] },

  // ── Bebidas ───────────────────────────────────────────────────────────────
  { id: 'cafe', name: 'Café', nameEn: 'Coffee', category: 'Bebidas', aliases: ['cafe', 'cafe em po'] },
  { id: 'cha', name: 'Chá', nameEn: 'Tea', category: 'Bebidas', aliases: ['cha', 'chas'] },
  { id: 'agua', name: 'Água', nameEn: 'Water', category: 'Bebidas', aliases: ['agua', 'agua mineral'] },
  { id: 'suco', name: 'Suco', nameEn: 'Juice', category: 'Bebidas', aliases: ['sucos', 'suco de laranja'] },
  { id: 'refrigerante', name: 'Refrigerante', nameEn: 'Soda', category: 'Bebidas', aliases: ['refrigerantes', 'refri', 'coca cola', 'guarana'] },

  // ── Internacionais / veganos / extras ─────────────────────────────────────
  { id: 'tofu', name: 'Tofu', nameEn: 'Tofu', category: 'Outros', aliases: ['queijo de soja'] },
  { id: 'proteina-soja', name: 'Proteína de Soja', nameEn: 'Soy Protein', category: 'Outros', aliases: ['pts', 'proteina de soja', 'carne de soja', 'soja texturizada'] },
  { id: 'quinoa', name: 'Quinoa', nameEn: 'Quinoa', category: 'Mercearia', aliases: ['quinua'] },
  { id: 'chia', name: 'Chia', nameEn: 'Chia', category: 'Mercearia', aliases: ['semente de chia', 'sementes de chia'] },
  { id: 'granola', name: 'Granola', nameEn: 'Granola', category: 'Mercearia', aliases: ['granolas'] },
  { id: 'cuscuz', name: 'Cuscuz', nameEn: 'Couscous', category: 'Mercearia', aliases: ['cuscuz marroquino', 'cuscuz nordestino', 'trigo para quibe'] },
  { id: 'feijao-branco', name: 'Feijão Branco', nameEn: 'White Beans', category: 'Mercearia', aliases: ['feijao branco'] },
  { id: 'tahine', name: 'Tahine', nameEn: 'Tahini', category: 'Mercearia', aliases: ['tahini', 'pasta de gergelim'] },
  { id: 'gergelim', name: 'Gergelim', nameEn: 'Sesame', category: 'Mercearia', aliases: ['semente de gergelim', 'sesamo'] },
  { id: 'curry', name: 'Curry', nameEn: 'Curry', category: 'Mercearia', aliases: ['caril', 'curry em po'] },
  { id: 'pasta-amendoim', name: 'Pasta de Amendoim', nameEn: 'Peanut Butter', category: 'Mercearia', aliases: ['manteiga de amendoim', 'pasta de amendoim'] },
  { id: 'oleo-coco', name: 'Óleo de Coco', nameEn: 'Coconut Oil', category: 'Mercearia', aliases: ['oleo de coco'] },
  { id: 'leite-vegetal', name: 'Leite Vegetal', nameEn: 'Plant Milk', category: 'Bebidas', aliases: ['leite de amendoas', 'leite de aveia', 'leite vegetal', 'bebida vegetal', 'leite de soja'] },
  { id: 'tortilla', name: 'Tortilla', nameEn: 'Tortilla', category: 'Padaria', aliases: ['tortilha', 'tortillas', 'wrap', 'pao sirio', 'pita'] },
  { id: 'berinjela', name: 'Berinjela', nameEn: 'Eggplant', category: 'Hortifruti', aliases: ['berinjelas'] },
  { id: 'repolho', name: 'Repolho', nameEn: 'Cabbage', category: 'Hortifruti', aliases: ['repolhos'] },
  { id: 'vagem', name: 'Vagem', nameEn: 'Green Beans', category: 'Hortifruti', aliases: ['vagens'] },
  { id: 'mandioca', name: 'Mandioca', nameEn: 'Cassava', category: 'Hortifruti', aliases: ['aipim', 'macaxeira'] },
  { id: 'inhame', name: 'Inhame', nameEn: 'Yam', category: 'Hortifruti', aliases: ['inhames'] },
  { id: 'palmito', name: 'Palmito', nameEn: 'Heart of Palm', category: 'Mercearia', aliases: ['palmitos'] },
  { id: 'rucula', name: 'Rúcula', nameEn: 'Arugula', category: 'Hortifruti', aliases: ['rucula'] },
];

/** Fast lookup by canonical id. */
export const INGREDIENTS_BY_ID: Map<string, CanonicalIngredient> = new Map(
  INGREDIENTS.map((i) => [i.id, i]),
);
