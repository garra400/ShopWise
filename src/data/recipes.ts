import { Recipe } from '@/types';

const LOCAL_RECIPES: Recipe[] = [
  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r1',
    title: 'Arroz com frango',
    titleEn: 'Chicken and rice',
    ingredients: [
      { name: 'Frango', canonicalId: 'frango', quantity: 500, unit: 'g' },
      { name: 'Arroz', canonicalId: 'arroz', quantity: 2, unit: 'xíc.' },
      { name: 'Cebola', canonicalId: 'cebola', quantity: 1, unit: 'un' },
      { name: 'Alho', canonicalId: 'alho', quantity: 3, unit: 'dentes' },
      { name: 'Tomate', canonicalId: 'tomate', quantity: 1, unit: 'un' },
    ],
    instructions:
      '1. Corte o frango em cubos e tempere com sal e pimenta. Aqueça 2 col. (sopa) de azeite em fogo médio-alto e doure os cubos por 5 a 6 minutos, sem mexer muito, até criar uma crosta dourada. Reserve.\n' +
      '2. Na mesma panela, refogue a cebola picada e o alho amassado por 2 minutos, até ficarem translúcidos e perfumados.\n' +
      '3. Junte o tomate picado e cozinhe por 2 a 3 minutos, amassando, até formar um molho rústico.\n' +
      '4. Volte o frango, adicione o arroz lavado e escorrido e refogue 1 minuto para o grão pegar o tempero.\n' +
      '5. Cubra com 4 xíc. de água fervente, acerte o sal e cozinhe em fogo baixo, tampado, por cerca de 18 minutos, até secar a água e o arroz ficar macio — o ponto é quando aparecem furinhos na superfície.\n' +
      '6. Desligue e deixe descansar 5 minutos tampado antes de soltar com um garfo.\n' +
      '💡 Dica: usar água fervente em vez de fria mantém o cozimento por igual e o grão soltinho.',
    instructionsEn:
      '1. Cut the chicken into cubes and season with salt and pepper. Heat 2 tbsp of oil over medium-high heat and brown the cubes for 5 to 6 minutes, without stirring much, until a golden crust forms. Set aside.\n' +
      '2. In the same pan, sauté the chopped onion and crushed garlic for 2 minutes, until translucent and fragrant.\n' +
      '3. Add the chopped tomato and cook for 2 to 3 minutes, mashing it, until it turns into a rustic sauce.\n' +
      '4. Return the chicken, add the rinsed, drained rice and toast for 1 minute so the grains absorb the seasoning.\n' +
      '5. Cover with 4 cups of boiling water, adjust the salt and cook over low heat, covered, for about 18 minutes, until the water is gone and the rice is tender — it is ready when small holes appear on the surface.\n' +
      '6. Turn off the heat and let it rest, covered, for 5 minutes before fluffing with a fork.\n' +
      '💡 Tip: using boiling water instead of cold keeps the cooking even and the grains loose.',
    prepTime: 40,
    servings: 4,
    difficulty: 'easy',
    tags: ['sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r2',
    title: 'Feijão tropeiro',
    titleEn: 'Feijão tropeiro (beans with eggs)',
    ingredients: [
      { name: 'Feijão', canonicalId: 'feijao', quantity: 2, unit: 'xíc.' },
      { name: 'Frango', canonicalId: 'frango', quantity: 200, unit: 'g' },
      { name: 'Ovos', canonicalId: 'ovo', quantity: 2, unit: 'un' },
      { name: 'Cebola', canonicalId: 'cebola', quantity: 1, unit: 'un' },
      { name: 'Alho', canonicalId: 'alho', quantity: 2, unit: 'dentes' },
    ],
    instructions:
      '1. Cozinhe o feijão até ficar macio mas firme (sem desmanchar) e escorra bem — o feijão precisa estar sequinho para o prato não empapar.\n' +
      '2. Corte o frango em pedaços pequenos, tempere com sal e frite em fogo médio-alto até dourar; reserve.\n' +
      '3. Na mesma panela, refogue a cebola e o alho por 2 minutos. Empurre para o lado, quebre os ovos e mexa até ficarem firmes.\n' +
      '4. Volte o frango e o feijão escorrido, misture e refogue por 3 a 4 minutos em fogo médio para incorporar os sabores.\n' +
      '5. Se tiver, acrescente farinha de mandioca aos poucos, mexendo, até dar liga sem ficar seco. Acerte o sal.\n' +
      '💡 Dica: o ponto certo é úmido e soltinho — adicione a farinha fora do fogo para controlar melhor.',
    instructionsEn:
      '1. Cook the beans until tender but firm (not falling apart) and drain well — the beans must be dry so the dish does not turn mushy.\n' +
      '2. Cut the chicken into small pieces, season with salt and fry over medium-high heat until golden; set aside.\n' +
      '3. In the same pan, sauté the onion and garlic for 2 minutes. Push them aside, crack in the eggs and scramble until set.\n' +
      '4. Return the chicken and the drained beans, mix and sauté for 3 to 4 minutes over medium heat to blend the flavors.\n' +
      '5. If available, stir in cassava flour little by little until it binds without drying out. Adjust the salt.\n' +
      '💡 Tip: the right texture is moist and loose — add the flour off the heat for better control.',
    prepTime: 50,
    servings: 4,
    difficulty: 'medium',
    tags: ['sem_gluten', 'sem_lactose'],
    allergens: ['ovo'],
    origin: 'local',
  },
  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r3',
    title: 'Macarrão ao molho de tomate',
    titleEn: 'Pasta with tomato sauce',
    ingredients: [
      { name: 'Macarrão', canonicalId: 'macarrao', quantity: 500, unit: 'g' },
      { name: 'Tomate', canonicalId: 'tomate', quantity: 3, unit: 'un' },
      { name: 'Cebola', canonicalId: 'cebola', quantity: 1, unit: 'un' },
      { name: 'Alho', canonicalId: 'alho', quantity: 2, unit: 'dentes' },
      { name: 'Azeite', canonicalId: 'azeite', quantity: 2, unit: 'col. (sopa)' },
    ],
    instructions:
      '1. Ferva bastante água com sal (use 1 col. de sopa de sal por litro). Cozinhe o macarrão até al dente, conforme o tempo da embalagem; reserve 1 concha da água do cozimento antes de escorrer.\n' +
      '2. Enquanto isso, aqueça o azeite em fogo médio e refogue a cebola picada e o alho por 2 minutos, sem deixar queimar o alho (fica amargo).\n' +
      '3. Junte os tomates picados sem pele, tempere com sal e cozinhe em fogo baixo por 12 a 15 minutos, amassando, até virar um molho encorpado.\n' +
      '4. Adicione o macarrão escorrido ao molho e misture por 1 minuto; se precisar, use um pouco da água reservada para soltar.\n' +
      '💡 Dica: finalize com folhas de manjericão e um fio de azeite cru — perfuma o prato inteiro.',
    instructionsEn:
      '1. Bring plenty of salted water to a boil (about 1 tbsp of salt per liter). Cook the pasta until al dente, following the package time; reserve a ladle of the cooking water before draining.\n' +
      '2. Meanwhile, heat the olive oil over medium heat and sauté the chopped onion and garlic for 2 minutes, without letting the garlic burn (it turns bitter).\n' +
      '3. Add the peeled, chopped tomatoes, season with salt and cook over low heat for 12 to 15 minutes, mashing, until it becomes a thick sauce.\n' +
      '4. Add the drained pasta to the sauce and toss for 1 minute; if needed, use some of the reserved water to loosen it.\n' +
      '💡 Tip: finish with fresh basil leaves and a drizzle of raw olive oil — it perfumes the whole dish.',
    prepTime: 30,
    servings: 4,
    difficulty: 'easy',
    tags: ['vegetariano', 'vegano', 'sem_lactose'],
    allergens: ['gluten'],
    origin: 'local',
  },
  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r4',
    title: 'Omelete de queijo',
    titleEn: 'Cheese omelette',
    ingredients: [
      { name: 'Ovos', canonicalId: 'ovo', quantity: 3, unit: 'un' },
      { name: 'Queijo', canonicalId: 'queijo', quantity: 50, unit: 'g' },
      { name: 'Manteiga', canonicalId: 'manteiga', quantity: 1, unit: 'col. (sopa)' },
      { name: 'Tomate', canonicalId: 'tomate', quantity: 1, unit: 'un' },
    ],
    instructions:
      '1. Bata os ovos com uma pitada de sal por cerca de 30 segundos, até a clara e a gema se unirem por completo (isso deixa a omelete fofa).\n' +
      '2. Derreta a manteiga em uma frigideira antiaderente em fogo médio-baixo, espalhando por toda a superfície.\n' +
      '3. Despeje os ovos e, com a frigideira inclinada, traga as bordas para o centro nos primeiros segundos para cozinhar por igual.\n' +
      '4. Quando a superfície ainda estiver levemente úmida, distribua o queijo e o tomate fatiado sobre metade da omelete.\n' +
      '5. Dobre ao meio com a ajuda de uma espátula e deixe mais 30 segundos para o queijo derreter. Sirva imediatamente.\n' +
      '💡 Dica: não cozinhe em fogo alto — a omelete fica macia quando sai da frigideira ainda cremosa por dentro.',
    instructionsEn:
      '1. Beat the eggs with a pinch of salt for about 30 seconds, until the white and yolk are fully combined (this makes the omelette fluffy).\n' +
      '2. Melt the butter in a non-stick pan over medium-low heat, spreading it across the surface.\n' +
      '3. Pour in the eggs and, tilting the pan, pull the edges toward the center in the first few seconds so it cooks evenly.\n' +
      '4. While the surface is still slightly moist, spread the cheese and sliced tomato over half of the omelette.\n' +
      '5. Fold it in half with a spatula and leave for another 30 seconds for the cheese to melt. Serve immediately.\n' +
      '💡 Tip: do not use high heat — the omelette stays soft when it leaves the pan still creamy inside.',
    prepTime: 10,
    servings: 1,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite', 'ovo'],
    origin: 'local',
  },
  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r5',
    title: 'Vitamina de banana',
    titleEn: 'Banana smoothie',
    ingredients: [
      { name: 'Banana', canonicalId: 'banana', quantity: 2, unit: 'un' },
      { name: 'Leite', canonicalId: 'leite', quantity: 200, unit: 'ml' },
      { name: 'Iogurte', canonicalId: 'iogurte', quantity: 1, unit: 'un' },
    ],
    instructions:
      '1. Descasque as bananas e corte em rodelas (de preferência bem maduras, são mais doces e cremosas).\n' +
      '2. No liquidificador, junte a banana, o leite gelado e o iogurte.\n' +
      '3. Bata por 30 a 40 segundos, até ficar homogêneo e sem pedaços. Adoce a gosto, se quiser.\n' +
      '4. Sirva na hora, bem gelado.\n' +
      '💡 Dica: use bananas congeladas em rodelas no lugar do gelo — a vitamina fica grossa como um milkshake.',
    instructionsEn:
      '1. Peel the bananas and slice them (ideally very ripe — they are sweeter and creamier).\n' +
      '2. In the blender, add the banana, the cold milk and the yogurt.\n' +
      '3. Blend for 30 to 40 seconds, until smooth and lump-free. Sweeten to taste if you like.\n' +
      '4. Serve right away, well chilled.\n' +
      '💡 Tip: use frozen banana slices instead of ice — the smoothie turns thick like a milkshake.',
    prepTime: 5,
    servings: 2,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite'],
    origin: 'local',
  },
  // ── 6 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r6',
    title: 'Sanduíche natural',
    titleEn: 'Toasted cheese sandwich',
    ingredients: [
      { name: 'Pão', canonicalId: 'pao', quantity: 2, unit: 'fatias' },
      { name: 'Queijo', canonicalId: 'queijo', quantity: 30, unit: 'g' },
      { name: 'Tomate', canonicalId: 'tomate', quantity: 1, unit: 'un' },
      { name: 'Manteiga', canonicalId: 'manteiga', quantity: 1, unit: 'col. (chá)' },
    ],
    instructions:
      '1. Passe uma camada fina de manteiga no lado de fora de cada fatia de pão (é isso que cria a casquinha dourada).\n' +
      '2. Monte o sanduíche com o queijo e o tomate fatiado fino, com o lado amanteigado para fora.\n' +
      '3. Aqueça uma frigideira em fogo médio-baixo e grelhe o sanduíche por 2 a 3 minutos de cada lado, pressionando levemente, até dourar e o queijo derreter.\n' +
      '4. Corte na diagonal e sirva quente.\n' +
      '💡 Dica: fogo baixo é o segredo — dá tempo do queijo derreter antes do pão queimar.',
    instructionsEn:
      '1. Spread a thin layer of butter on the outer side of each bread slice (that is what creates the golden crust).\n' +
      '2. Assemble the sandwich with the cheese and thinly sliced tomato, buttered side facing out.\n' +
      '3. Heat a pan over medium-low heat and grill the sandwich for 2 to 3 minutes per side, pressing lightly, until golden and the cheese melts.\n' +
      '4. Cut diagonally and serve hot.\n' +
      '💡 Tip: low heat is the secret — it gives the cheese time to melt before the bread burns.',
    prepTime: 10,
    servings: 1,
    difficulty: 'easy',
    tags: ['vegetariano'],
    allergens: ['gluten', 'leite'],
    origin: 'local',
  },
  // ── 7 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r7',
    title: 'Frango grelhado com arroz',
    titleEn: 'Grilled chicken with rice',
    ingredients: [
      { name: 'Frango', canonicalId: 'frango', quantity: 400, unit: 'g' },
      { name: 'Arroz', canonicalId: 'arroz', quantity: 1, unit: 'xíc.' },
      { name: 'Azeite', canonicalId: 'azeite', quantity: 2, unit: 'col. (sopa)' },
      { name: 'Alho', canonicalId: 'alho', quantity: 2, unit: 'dentes' },
    ],
    instructions:
      '1. Se os filés forem grossos, abra-os ao meio para grelharem por igual. Tempere com alho amassado, sal, pimenta e o azeite; deixe marinar 15 minutos.\n' +
      '2. Cozinhe o arroz: refogue rapidamente em um fio de azeite, cubra com 2 xíc. de água fervente e sal, e cozinhe tampado em fogo baixo por 15 minutos.\n' +
      '3. Aqueça uma frigideira ou grelha em fogo médio-alto até ficar bem quente. Grelhe o frango por 4 a 5 minutos de cada lado, sem mexer, até marcar e dourar.\n' +
      '4. Verifique o ponto: o suco deve sair transparente, não rosado. Deixe descansar 3 minutos antes de cortar (mantém suculento).\n' +
      '5. Sirva o frango sobre o arroz.\n' +
      '💡 Dica: não vire o frango cedo demais — ele solta sozinho da frigideira quando está bem selado.',
    instructionsEn:
      '1. If the fillets are thick, butterfly them so they grill evenly. Season with crushed garlic, salt, pepper and the olive oil; marinate for 15 minutes.\n' +
      '2. Cook the rice: toast it briefly in a little oil, cover with 2 cups of boiling water and salt, and cook covered over low heat for 15 minutes.\n' +
      '3. Heat a pan or grill over medium-high heat until very hot. Grill the chicken for 4 to 5 minutes per side, without moving it, until marked and golden.\n' +
      '4. Check doneness: the juices should run clear, not pink. Let it rest for 3 minutes before slicing (keeps it juicy).\n' +
      '5. Serve the chicken over the rice.\n' +
      '💡 Tip: do not flip the chicken too soon — it releases from the pan on its own once well seared.',
    prepTime: 35,
    servings: 2,
    difficulty: 'easy',
    tags: ['sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 8 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r8',
    title: 'Mingau de banana',
    titleEn: 'Banana porridge',
    ingredients: [
      { name: 'Banana', canonicalId: 'banana', quantity: 3, unit: 'un' },
      { name: 'Leite', canonicalId: 'leite', quantity: 500, unit: 'ml' },
      { name: 'Manteiga', canonicalId: 'manteiga', quantity: 1, unit: 'col. (chá)' },
      { name: 'Iogurte', canonicalId: 'iogurte', quantity: 2, unit: 'un' },
    ],
    instructions:
      '1. Amasse 2 bananas com um garfo até formar um purê e fatie a terceira em rodelas (para finalizar).\n' +
      '2. Em uma panela, derreta a manteiga em fogo médio-baixo e junte a banana amassada, mexendo por 1 minuto.\n' +
      '3. Acrescente o leite aos poucos, sempre mexendo, e cozinhe por 8 a 10 minutos até engrossar — o ponto é quando a colher deixa um rastro no fundo.\n' +
      '4. Desligue e deixe amornar (engrossa mais ao esfriar). Sirva com o iogurte e as rodelas de banana por cima.\n' +
      '💡 Dica: uma pitada de canela realça o doce natural da banana sem precisar de açúcar.',
    instructionsEn:
      '1. Mash 2 bananas with a fork into a purée and slice the third one into rounds (to finish).\n' +
      '2. In a pot, melt the butter over medium-low heat and add the mashed banana, stirring for 1 minute.\n' +
      '3. Add the milk gradually, stirring constantly, and cook for 8 to 10 minutes until it thickens — it is ready when the spoon leaves a trail at the bottom.\n' +
      '4. Turn off the heat and let it warm down (it thickens more as it cools). Serve with the yogurt and banana rounds on top.\n' +
      '💡 Tip: a pinch of cinnamon brings out the banana\'s natural sweetness without needing sugar.',
    prepTime: 15,
    servings: 3,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite'],
    origin: 'local',
  },
  // ── 9 ──────────────────────────────────────────────────────────────────────
  {
    id: 'r9',
    title: 'Arroz com legumes',
    titleEn: 'Rice with vegetables',
    ingredients: [
      { name: 'Arroz', canonicalId: 'arroz', quantity: 1, unit: 'xíc.' },
      { name: 'Tomate', canonicalId: 'tomate', quantity: 2, unit: 'un' },
      { name: 'Cebola', canonicalId: 'cebola', quantity: 1, unit: 'un' },
      { name: 'Azeite', canonicalId: 'azeite', quantity: 2, unit: 'col. (sopa)' },
    ],
    instructions:
      '1. Aqueça o azeite em fogo médio e refogue a cebola picada por 2 a 3 minutos, até ficar dourada e perfumada.\n' +
      '2. Junte o tomate picado e refogue por mais 3 minutos, até soltar o caldo.\n' +
      '3. Adicione o arroz lavado e escorrido e mexa por 1 minuto para envolver no tempero.\n' +
      '4. Cubra com 2 xíc. de água fervente, acerte o sal e cozinhe tampado em fogo baixo por cerca de 18 minutos, até secar a água.\n' +
      '5. Desligue, deixe descansar 5 minutos e solte com um garfo.\n' +
      '💡 Dica: acrescente cenoura ou ervilha junto com o tomate para um prato único mais completo.',
    instructionsEn:
      '1. Heat the olive oil over medium heat and sauté the chopped onion for 2 to 3 minutes, until golden and fragrant.\n' +
      '2. Add the chopped tomato and sauté for another 3 minutes, until it releases its juices.\n' +
      '3. Add the rinsed, drained rice and stir for 1 minute to coat it in the seasoning.\n' +
      '4. Cover with 2 cups of boiling water, adjust the salt and cook covered over low heat for about 18 minutes, until the water is gone.\n' +
      '5. Turn off the heat, let it rest for 5 minutes and fluff with a fork.\n' +
      '💡 Tip: add carrot or peas along with the tomato for a more complete one-pot meal.',
    prepTime: 30,
    servings: 3,
    difficulty: 'easy',
    tags: ['vegetariano', 'vegano', 'sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 10 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r10',
    title: 'Iogurte com banana e aveia',
    titleEn: 'Yogurt with banana and oats',
    ingredients: [
      { name: 'Iogurte', canonicalId: 'iogurte', quantity: 1, unit: 'un' },
      { name: 'Banana', canonicalId: 'banana', quantity: 1, unit: 'un' },
      { name: 'Aveia', canonicalId: 'aveia', quantity: 2, unit: 'col. (sopa)' },
    ],
    instructions:
      '1. Coloque o iogurte no fundo de uma tigela ou copo.\n' +
      '2. Fatie a banana em rodelas e distribua sobre o iogurte.\n' +
      '3. Polvilhe a aveia por cima e, se quiser, regue com um fio de mel.\n' +
      '4. Sirva imediatamente para a aveia ficar crocante, ou deixe na geladeira por 1 hora se preferir mais cremoso.\n' +
      '💡 Dica: monte em camadas em um pote com tampa na noite anterior — vira um café da manhã pronto para levar.',
    instructionsEn:
      '1. Spoon the yogurt into the bottom of a bowl or glass.\n' +
      '2. Slice the banana into rounds and arrange them over the yogurt.\n' +
      '3. Sprinkle the oats on top and, if you like, drizzle with a little honey.\n' +
      '4. Serve immediately for crunchy oats, or chill for 1 hour if you prefer it creamier.\n' +
      '💡 Tip: layer it in a lidded jar the night before — it becomes a grab-and-go breakfast.',
    prepTime: 5,
    servings: 1,
    difficulty: 'easy',
    tags: ['vegetariano'],
    allergens: ['leite', 'gluten'],
    origin: 'local',
  },
  // ── 11 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r11',
    title: 'Sopa de frango com arroz',
    titleEn: 'Chicken and rice soup',
    ingredients: [
      { name: 'Frango', canonicalId: 'frango', quantity: 300, unit: 'g' },
      { name: 'Arroz', canonicalId: 'arroz', quantity: 0.5, unit: 'xíc.' },
      { name: 'Cenoura', canonicalId: 'cenoura', quantity: 2, unit: 'un' },
      { name: 'Cebola', canonicalId: 'cebola', quantity: 1, unit: 'un' },
      { name: 'Alho', canonicalId: 'alho', quantity: 2, unit: 'dentes' },
    ],
    instructions:
      '1. Em uma panela, refogue a cebola e o alho picados em um fio de azeite por 2 minutos.\n' +
      '2. Junte o frango em pedaços, sele rapidamente, cubra com 1,5 litro de água quente e cozinhe em fogo médio por 20 minutos.\n' +
      '3. Retire o frango, desfie e devolva à panela. Adicione a cenoura em cubos e o arroz.\n' +
      '4. Cozinhe por mais 15 minutos em fogo médio, até a cenoura e o arroz ficarem macios. Acerte o sal.\n' +
      '5. Finalize com cheiro-verde picado, se tiver.\n' +
      '💡 Dica: o arroz continua absorvendo líquido depois de pronto — se for guardar, deixe a sopa mais rala.',
    instructionsEn:
      '1. In a pot, sauté the chopped onion and garlic in a little oil for 2 minutes.\n' +
      '2. Add the chicken pieces, sear quickly, cover with 1.5 liters of hot water and cook over medium heat for 20 minutes.\n' +
      '3. Remove the chicken, shred it and return it to the pot. Add the diced carrot and the rice.\n' +
      '4. Cook for another 15 minutes over medium heat, until the carrot and rice are tender. Adjust the salt.\n' +
      '5. Finish with chopped parsley and chives, if available.\n' +
      '💡 Tip: rice keeps absorbing liquid after it is done — if storing, leave the soup a bit thinner.',
    prepTime: 40,
    servings: 4,
    difficulty: 'easy',
    tags: ['sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 12 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r12',
    title: 'Feijão preto simples',
    titleEn: 'Simple black beans',
    ingredients: [
      { name: 'Feijão', canonicalId: 'feijao', quantity: 2, unit: 'xíc.' },
      { name: 'Alho', canonicalId: 'alho', quantity: 3, unit: 'dentes' },
      { name: 'Cebola', canonicalId: 'cebola', quantity: 1, unit: 'un' },
      { name: 'Azeite', canonicalId: 'azeite', quantity: 2, unit: 'col. (sopa)' },
    ],
    instructions:
      '1. Deixe o feijão de molho em água por pelo menos 8 horas (ou de um dia para o outro) — reduz o tempo de cozimento e melhora a digestão.\n' +
      '2. Escorra, cubra com água nova e cozinhe na panela de pressão por cerca de 20 minutos após pegar pressão, até ficar bem macio.\n' +
      '3. Em uma frigideira, aqueça o azeite e doure o alho amassado e a cebola picada até ficarem dourados e perfumados.\n' +
      '4. Pegue 1 concha de feijão com caldo, amasse e junte ao refogado; despeje tudo de volta na panela do feijão. Isso engrossa o caldo.\n' +
      '5. Cozinhe sem tampa por mais 5 a 10 minutos em fogo baixo, até o caldo encorpar. Acerte o sal.\n' +
      '💡 Dica: amassar um pouco do feijão é o truque para um caldo grosso e cremoso sem usar farinha.',
    instructionsEn:
      '1. Soak the beans in water for at least 8 hours (or overnight) — it cuts cooking time and improves digestion.\n' +
      '2. Drain, cover with fresh water and cook in a pressure cooker for about 20 minutes after it reaches pressure, until very tender.\n' +
      '3. In a skillet, heat the olive oil and brown the crushed garlic and chopped onion until golden and fragrant.\n' +
      '4. Take a ladle of beans with broth, mash it and add it to the sautéed mix; pour everything back into the bean pot. This thickens the broth.\n' +
      '5. Simmer uncovered for another 5 to 10 minutes over low heat, until the broth thickens. Adjust the salt.\n' +
      '💡 Tip: mashing some of the beans is the trick for a thick, creamy broth without using flour.',
    prepTime: 35,
    servings: 4,
    difficulty: 'easy',
    tags: ['vegetariano', 'vegano', 'sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 13 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r13',
    title: 'Ovos mexidos com tomate',
    titleEn: 'Scrambled eggs with tomato',
    ingredients: [
      { name: 'Ovos', canonicalId: 'ovo', quantity: 3, unit: 'un' },
      { name: 'Tomate', canonicalId: 'tomate', quantity: 1, unit: 'un' },
      { name: 'Manteiga', canonicalId: 'manteiga', quantity: 1, unit: 'col. (sopa)' },
    ],
    instructions:
      '1. Pique o tomate em cubos pequenos e retire o excesso de sementes para não soltar muita água.\n' +
      '2. Derreta a manteiga em fogo médio e refogue o tomate por 2 minutos, com uma pitada de sal.\n' +
      '3. Bata os ovos com sal e despeje na frigideira. Espere 10 segundos e comece a mexer devagar, trazendo do fundo para cima.\n' +
      '4. Desligue o fogo quando os ovos ainda estiverem levemente cremosos — eles terminam de cozinhar no calor da panela.\n' +
      '💡 Dica: tirar do fogo um pouco antes do ponto é o que deixa os ovos macios, e não borrachudos.',
    instructionsEn:
      '1. Dice the tomato small and remove the excess seeds so it does not release too much water.\n' +
      '2. Melt the butter over medium heat and sauté the tomato for 2 minutes, with a pinch of salt.\n' +
      '3. Beat the eggs with salt and pour them into the pan. Wait 10 seconds, then stir slowly, lifting from the bottom up.\n' +
      '4. Turn off the heat while the eggs are still slightly creamy — they finish cooking from the pan\'s residual heat.\n' +
      '💡 Tip: taking them off the heat just before they look done is what keeps the eggs soft, not rubbery.',
    prepTime: 10,
    servings: 2,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['ovo', 'leite'],
    origin: 'local',
  },
  // ── 14 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r14',
    title: 'Banana assada com canela',
    titleEn: 'Baked banana with cinnamon',
    ingredients: [
      { name: 'Banana', canonicalId: 'banana', quantity: 3, unit: 'un' },
      { name: 'Manteiga', canonicalId: 'manteiga', quantity: 1, unit: 'col. (sopa)' },
    ],
    instructions:
      '1. Pré-aqueça o forno a 180 °C. Corte as bananas ao meio no sentido do comprimento.\n' +
      '2. Unte uma forma com a manteiga e disponha as bananas com o corte para cima.\n' +
      '3. Pincele um pouco de manteiga derretida sobre as bananas e polvilhe canela (e açúcar, se quiser caramelizar).\n' +
      '4. Asse por 15 a 20 minutos, até ficarem macias e levemente douradas nas bordas.\n' +
      '5. Sirva morna, pura ou com uma bola de sorvete ou iogurte.\n' +
      '💡 Dica: bananas mais firmes seguram melhor o formato no forno; as bem maduras ficam mais doces e cremosas.',
    instructionsEn:
      '1. Preheat the oven to 180 °C (350 °F). Cut the bananas in half lengthwise.\n' +
      '2. Grease a baking dish with the butter and lay the bananas cut-side up.\n' +
      '3. Brush a little melted butter over the bananas and sprinkle with cinnamon (and sugar, if you want them to caramelize).\n' +
      '4. Bake for 15 to 20 minutes, until soft and lightly golden at the edges.\n' +
      '5. Serve warm, plain or with a scoop of ice cream or yogurt.\n' +
      '💡 Tip: firmer bananas hold their shape better in the oven; very ripe ones turn sweeter and creamier.',
    prepTime: 25,
    servings: 3,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite'],
    origin: 'local',
  },
  // ── 15 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r15',
    title: 'Frango ao molho de tomate',
    titleEn: 'Chicken in tomato sauce',
    ingredients: [
      { name: 'Frango', canonicalId: 'frango', quantity: 500, unit: 'g' },
      { name: 'Tomate', canonicalId: 'tomate', quantity: 4, unit: 'un' },
      { name: 'Cebola', canonicalId: 'cebola', quantity: 1, unit: 'un' },
      { name: 'Alho', canonicalId: 'alho', quantity: 3, unit: 'dentes' },
      { name: 'Azeite', canonicalId: 'azeite', quantity: 2, unit: 'col. (sopa)' },
    ],
    instructions:
      '1. Tempere o frango (filés ou pedaços) com sal, alho amassado e um pouco de suco de limão; deixe pegar gosto por 10 minutos.\n' +
      '2. Aqueça o azeite em fogo médio-alto e sele o frango por 3 a 4 minutos de cada lado, até dourar; reserve.\n' +
      '3. Na mesma panela, refogue a cebola e o alho restante por 2 minutos. Junte os tomates picados e cozinhe por 5 minutos, até começar a desmanchar.\n' +
      '4. Volte o frango ao molho, tampe e cozinhe em fogo baixo por 20 a 25 minutos, virando na metade, até o frango ficar macio e o molho encorpar.\n' +
      '5. Acerte o sal e finalize com manjericão ou salsinha. Sirva com arroz ou massa.\n' +
      '💡 Dica: selar o frango antes de cozinhar no molho concentra o sabor e deixa a carne mais bonita.',
    instructionsEn:
      '1. Season the chicken (fillets or pieces) with salt, crushed garlic and a little lime juice; let it sit for 10 minutes.\n' +
      '2. Heat the olive oil over medium-high heat and sear the chicken for 3 to 4 minutes per side, until golden; set aside.\n' +
      '3. In the same pan, sauté the onion and remaining garlic for 2 minutes. Add the chopped tomatoes and cook for 5 minutes, until they start to break down.\n' +
      '4. Return the chicken to the sauce, cover and cook over low heat for 20 to 25 minutes, turning halfway, until the chicken is tender and the sauce thickens.\n' +
      '5. Adjust the salt and finish with basil or parsley. Serve with rice or pasta.\n' +
      '💡 Tip: searing the chicken before simmering it in the sauce concentrates the flavor and makes the meat look better.',
    prepTime: 40,
    servings: 4,
    difficulty: 'medium',
    tags: ['sem_gluten', 'sem_lactose'],
    allergens: [],
    origin: 'local',
  },
  // ── 16 ─────────────────────────────────────────────────────────────────────
  {
    id: 'r16',
    title: 'Smoothie de banana com iogurte',
    titleEn: 'Banana yogurt smoothie',
    ingredients: [
      { name: 'Banana', canonicalId: 'banana', quantity: 2, unit: 'un' },
      { name: 'Iogurte', canonicalId: 'iogurte', quantity: 1, unit: 'un' },
    ],
    instructions:
      '1. Fatie as bananas e congele por pelo menos 2 horas — é o congelado que dá a textura cremosa de smoothie.\n' +
      '2. No liquidificador, junte a banana congelada, o iogurte e 100 ml de água (ou leite, para ficar mais encorpado).\n' +
      '3. Bata por 40 a 60 segundos, parando para raspar as laterais, até ficar liso e cremoso.\n' +
      '4. Sirva imediatamente, enquanto está gelado e grosso.\n' +
      '💡 Dica: comece com pouco líquido e vá ajustando — é mais fácil afinar do que engrossar um smoothie.',
    instructionsEn:
      '1. Slice the bananas and freeze them for at least 2 hours — the frozen fruit is what gives the creamy smoothie texture.\n' +
      '2. In the blender, add the frozen banana, the yogurt and 100 ml of water (or milk, for a thicker result).\n' +
      '3. Blend for 40 to 60 seconds, stopping to scrape the sides, until smooth and creamy.\n' +
      '4. Serve immediately, while cold and thick.\n' +
      '💡 Tip: start with a little liquid and adjust — it is easier to thin a smoothie than to thicken it.',
    prepTime: 5,
    servings: 2,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem_gluten'],
    allergens: ['leite'],
    origin: 'local',
  },
];

/** Curated relevant photos (Pexels) for the local recipes. */
const LOCAL_IMAGES: Record<string, string> = {
  r1: 'https://images.pexels.com/photos/36982101/pexels-photo-36982101.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r2: 'https://images.pexels.com/photos/32655177/pexels-photo-32655177.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r3: 'https://images.pexels.com/photos/769969/pexels-photo-769969.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r4: 'https://images.pexels.com/photos/5840304/pexels-photo-5840304.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r5: 'https://images.pexels.com/photos/3908198/pexels-photo-3908198.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r6: 'https://images.pexels.com/photos/16266737/pexels-photo-16266737.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r7: 'https://images.pexels.com/photos/19938618/pexels-photo-19938618.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r8: 'https://images.pexels.com/photos/28792769/pexels-photo-28792769.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r9: 'https://images.pexels.com/photos/6978234/pexels-photo-6978234.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r10: 'https://images.pexels.com/photos/7535151/pexels-photo-7535151.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r11: 'https://images.pexels.com/photos/31872339/pexels-photo-31872339.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r12: 'https://images.pexels.com/photos/37099771/pexels-photo-37099771.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r13: 'https://images.pexels.com/photos/20044229/pexels-photo-20044229.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r14: 'https://images.pexels.com/photos/24504064/pexels-photo-24504064.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r15: 'https://images.pexels.com/photos/34463131/pexels-photo-34463131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  r16: 'https://images.pexels.com/photos/5946795/pexels-photo-5946795.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
};

/** All local recipes default to Brazilian cuisine, with curated photos. */
export const RECIPES: Recipe[] = LOCAL_RECIPES.map((r) => ({ cuisine: 'brasileira', ...r, image: LOCAL_IMAGES[r.id] ?? r.image }));
