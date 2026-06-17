import { Recipe } from '@/types';

export const RECIPES: Recipe[] = [
  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r1',
    title: 'Arroz com Frango',
    ingredients: [
      { name: 'Frango', quantity: 500, unit: 'g' },
      { name: 'Arroz', quantity: 2, unit: 'xíc' },
      { name: 'Cebola', quantity: 1, unit: 'un' },
      { name: 'Alho', quantity: 3, unit: 'dentes' },
      { name: 'Tomate', quantity: 1, unit: 'un' },
    ],
    instructions:
      'Refogue o alho e a cebola no azeite. Adicione o frango em pedaços e doure bem. Junte o tomate e refogue mais 2 minutos. Adicione o arroz lavado, tempere com sal e cubra com água fervente. Cozinhe em fogo baixo por 20 minutos.',
    prepTime: 40,
    difficulty: 'easy',
    tags: ['sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r2',
    title: 'Feijão Tropeiro',
    ingredients: [
      { name: 'Feijão', quantity: 2, unit: 'xíc' },
      { name: 'Frango', quantity: 200, unit: 'g' },
      { name: 'Ovos', quantity: 2, unit: 'un' },
      { name: 'Cebola', quantity: 1, unit: 'un' },
      { name: 'Alho', quantity: 2, unit: 'dentes' },
    ],
    instructions:
      'Cozinhe o feijão até ficar macio e escorra. Frite o alho e a cebola, adicione a proteína e refogue. Misture o feijão, adicione os ovos mexidos e mexa bem até incorporar.',
    prepTime: 50,
    difficulty: 'medium',
    tags: ['sem_gluten', 'sem_lactose'],
    allergens: ['ovo'],
    origin: 'local',
  },
  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r3',
    title: 'Macarrão ao Molho de Tomate',
    ingredients: [
      { name: 'Macarrão', quantity: 500, unit: 'g' },
      { name: 'Tomate', quantity: 3, unit: 'un' },
      { name: 'Cebola', quantity: 1, unit: 'un' },
      { name: 'Alho', quantity: 2, unit: 'dentes' },
      { name: 'Azeite', quantity: 2, unit: 'col' },
    ],
    instructions:
      'Cozinhe o macarrão al dente. Refogue alho e cebola no azeite, adicione tomate picado e cozinhe por 15 minutos. Tempere com sal e misture ao macarrão.',
    prepTime: 30,
    difficulty: 'easy',
    tags: ['vegetariano', 'vegano', 'sem_lactose'],
    allergens: ['gluten'],
    origin: 'local',
  },
  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r4',
    title: 'Omelete de Queijo',
    ingredients: [
      { name: 'Ovos', quantity: 3, unit: 'un' },
      { name: 'Queijo', quantity: 50, unit: 'g' },
      { name: 'Manteiga', quantity: 1, unit: 'col' },
      { name: 'Tomate', quantity: 1, unit: 'un' },
    ],
    instructions:
      'Bata os ovos com sal. Derreta a manteiga em frigideira e despeje os ovos. Adicione o queijo e o tomate fatiado. Dobre ao meio quando firmar.',
    prepTime: 10,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite', 'ovo'],
    origin: 'local',
  },
  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r5',
    title: 'Vitamina de Banana',
    ingredients: [
      { name: 'Banana', quantity: 2, unit: 'un' },
      { name: 'Leite', quantity: 200, unit: 'ml' },
      { name: 'Iogurte', quantity: 1, unit: 'un' },
    ],
    instructions:
      'Bata todos os ingredientes no liquidificador até ficar homogêneo. Sirva gelado.',
    prepTime: 5,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite'],
    origin: 'local',
  },
  // ── 6 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r6',
    title: 'Sanduíche Natural',
    ingredients: [
      { name: 'Pão', quantity: 2, unit: 'fatias' },
      { name: 'Queijo', quantity: 30, unit: 'g' },
      { name: 'Tomate', quantity: 1, unit: 'un' },
      { name: 'Manteiga', quantity: 1, unit: 'col' },
    ],
    instructions:
      'Passe manteiga no pão. Monte com queijo e tomate fatiado. Pode grelhar na frigideira por 2 minutos de cada lado.',
    prepTime: 10,
    difficulty: 'easy',
    tags: ['vegetariano'],
    allergens: ['gluten', 'leite'],
    origin: 'local',
  },
  // ── 7 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r7',
    title: 'Frango Grelhado com Arroz',
    ingredients: [
      { name: 'Frango', quantity: 400, unit: 'g' },
      { name: 'Arroz', quantity: 1, unit: 'xíc' },
      { name: 'Azeite', quantity: 2, unit: 'col' },
      { name: 'Alho', quantity: 2, unit: 'dentes' },
    ],
    instructions:
      'Marine o frango com alho, sal e azeite por 15 min. Grelhe em frigideira quente até dourar dos dois lados. Sirva com arroz branco cozido.',
    prepTime: 35,
    difficulty: 'easy',
    tags: ['sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 8 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r8',
    title: 'Canjica de Banana',
    ingredients: [
      { name: 'Banana', quantity: 3, unit: 'un' },
      { name: 'Leite', quantity: 500, unit: 'ml' },
      { name: 'Manteiga', quantity: 1, unit: 'col' },
      { name: 'Iogurte', quantity: 2, unit: 'un' },
    ],
    instructions:
      'Amasse as bananas e misture com o leite. Aqueça com manteiga em fogo baixo por 10 minutos. Sirva com iogurte.',
    prepTime: 15,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite'],
    origin: 'local',
  },
  // ── 9 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r9',
    title: 'Arroz Integral com Legumes',
    ingredients: [
      { name: 'Arroz', quantity: 1, unit: 'xíc' },
      { name: 'Tomate', quantity: 2, unit: 'un' },
      { name: 'Cebola', quantity: 1, unit: 'un' },
      { name: 'Azeite', quantity: 2, unit: 'col' },
    ],
    instructions:
      'Refogue cebola no azeite até dourar. Adicione o tomate picado e refogue por 3 minutos. Junte o arroz e cubra com água. Cozinhe em fogo baixo por 35 minutos até o arroz ficar macio.',
    prepTime: 45,
    difficulty: 'easy',
    tags: ['vegetariano', 'vegano', 'sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 10 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r10',
    title: 'Iogurte com Banana e Aveia',
    ingredients: [
      { name: 'Iogurte', quantity: 1, unit: 'un' },
      { name: 'Banana', quantity: 1, unit: 'un' },
    ],
    instructions:
      'Fatie a banana e misture ao iogurte. Sirva frio. Pode adicionar mel a gosto.',
    prepTime: 5,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite'],
    origin: 'local',
  },
  // ── 11 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r11',
    title: 'Sopa de Frango com Arroz',
    ingredients: [
      { name: 'Frango', quantity: 300, unit: 'g' },
      { name: 'Arroz', quantity: 0.5, unit: 'xíc' },
      { name: 'Cenoura', quantity: 2, unit: 'un' },
      { name: 'Cebola', quantity: 1, unit: 'un' },
      { name: 'Alho', quantity: 2, unit: 'dentes' },
    ],
    instructions:
      'Cozinhe o frango em água com sal, alho e cebola por 20 minutos. Retire e desfie. Volte o frango à panela, adicione cenoura em cubos e o arroz. Cozinhe mais 15 minutos em fogo médio.',
    prepTime: 40,
    difficulty: 'easy',
    tags: ['sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 12 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r12',
    title: 'Feijão Preto Simples',
    ingredients: [
      { name: 'Feijão', quantity: 2, unit: 'xíc' },
      { name: 'Alho', quantity: 3, unit: 'dentes' },
      { name: 'Cebola', quantity: 1, unit: 'un' },
      { name: 'Azeite', quantity: 2, unit: 'col' },
    ],
    instructions:
      'Deixe o feijão de molho por 8 horas. Cozinhe na panela de pressão por 20 minutos. Refogue alho e cebola no azeite e misture ao feijão. Ajuste o sal.',
    prepTime: 35,
    difficulty: 'easy',
    tags: ['vegetariano', 'vegano', 'sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 13 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r13',
    title: 'Ovos Mexidos com Tomate',
    ingredients: [
      { name: 'Ovos', quantity: 3, unit: 'un' },
      { name: 'Tomate', quantity: 1, unit: 'un' },
      { name: 'Manteiga', quantity: 1, unit: 'col' },
    ],
    instructions:
      'Derreta a manteiga em fogo médio. Adicione o tomate picado e refogue por 2 minutos. Bata os ovos com sal e despeje na frigideira. Mexa suavemente até firmar.',
    prepTime: 10,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['ovo', 'leite'],
    origin: 'local',
  },
  // ── 14 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r14',
    title: 'Banana Assada com Canela',
    ingredients: [
      { name: 'Banana', quantity: 3, unit: 'un' },
      { name: 'Manteiga', quantity: 1, unit: 'col' },
    ],
    instructions:
      'Corte as bananas ao meio no sentido do comprimento. Coloque numa forma untada com manteiga. Polvilhe canela e leve ao forno a 180 °C por 15 minutos.',
    prepTime: 20,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite'],
    origin: 'local',
  },
  // ── 15 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r15',
    title: 'Frango ao Molho de Tomate',
    ingredients: [
      { name: 'Frango', quantity: 500, unit: 'g' },
      { name: 'Tomate', quantity: 4, unit: 'un' },
      { name: 'Cebola', quantity: 1, unit: 'un' },
      { name: 'Alho', quantity: 3, unit: 'dentes' },
      { name: 'Azeite', quantity: 2, unit: 'col' },
    ],
    instructions:
      'Tempere o frango com sal, alho e limão. Sele em frigideira quente. Refogue cebola e alho no azeite, adicione os tomates picados. Coloque o frango no molho e cozinhe tampado por 25 minutos.',
    prepTime: 40,
    difficulty: 'medium',
    tags: ['sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 16 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r16',
    title: 'Smoothie de Banana com Iogurte',
    ingredients: [
      { name: 'Banana', quantity: 2, unit: 'un' },
      { name: 'Iogurte', quantity: 1, unit: 'un' },
    ],
    instructions:
      'Congele as bananas fatiadas por pelo menos 2 horas. Bata no liquidificador com 100 ml de água até obter consistência cremosa. Sirva imediatamente.',
    prepTime: 5,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite'],
    origin: 'local',
  },
];
