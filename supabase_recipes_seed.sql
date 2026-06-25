-- =============================================================================
-- ShopWise — seed do catálogo de receitas da COMUNIDADE (compartilhado)
-- =============================================================================
-- Como rodar:
--   1. Rode antes o supabase_schema.sql (cria a tabela public.recipes).
--   2. SQL Editor → New query → cole TODO este arquivo → Run.
-- Idempotente (ON CONFLICT) — pode rodar de novo sem duplicar.
-- `image` fica NULL: o app busca a foto pelo título via Pexels.
-- canonicalId batem com src/data/ingredients.ts (matching por id).
-- =============================================================================

-- Garante a coluna de cozinha mesmo em tabelas criadas antes (seguro re-rodar)
alter table public.recipes add column if not exists cuisine text null;

insert into public.recipes (id, title, ingredients, instructions, prep_time, difficulty, tags, allergens, cuisine, origin)
values
  -- ===== BRASILEIRA =====
  ('comm-1','Strogonoff de Frango',
   '[{"name":"Frango","canonicalId":"frango"},{"name":"Creme de Leite","canonicalId":"creme-leite"},{"name":"Molho de Tomate","canonicalId":"molho-tomate"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Cogumelo","canonicalId":"cogumelo"}]'::jsonb,
   'Doure o frango em cubos com alho e cebola, junte molho de tomate e cogumelos, desligue e misture o creme de leite. Sirva com arroz e batata palha.',
   30,'easy','["sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),

  ('comm-2','Escondidinho de Carne',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina"},{"name":"Batata","canonicalId":"batata"},{"name":"Leite","canonicalId":"leite"},{"name":"Manteiga","canonicalId":"manteiga"},{"name":"Cebola","canonicalId":"cebola"}]'::jsonb,
   'Faça um pure de batata com leite e manteiga. Refogue a carne moida com cebola. Monte carne embaixo e pure por cima, gratine no forno.',
   50,'medium','["sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),

  ('comm-3','Feijoada Simples',
   '[{"name":"Feijão","canonicalId":"feijao"},{"name":"Linguiça","canonicalId":"linguica"},{"name":"Bacon","canonicalId":"bacon"},{"name":"Carne Suína","canonicalId":"carne-suina"},{"name":"Alho","canonicalId":"alho"},{"name":"Cebola","canonicalId":"cebola"}]'::jsonb,
   'Cozinhe o feijao preto. Refogue bacon, linguica e carne suina com alho e cebola, junte ao feijao e cozinhe 30 minutos. Sirva com arroz.',
   90,'hard','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-4','Moqueca de Peixe',
   '[{"name":"Peixe","canonicalId":"peixe"},{"name":"Leite de Coco","canonicalId":"leite-coco"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Coentro","canonicalId":"coentro"}]'::jsonb,
   'Monte camadas de peixe, tomate, cebola e pimentao na panela, regue com leite de coco e azeite. Cozinhe 20 minutos e finalize com coentro.',
   40,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-5','Bobó de Camarão',
   '[{"name":"Camarão","canonicalId":"camarao"},{"name":"Mandioca","canonicalId":"mandioca"},{"name":"Leite de Coco","canonicalId":"leite-coco"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Tomate","canonicalId":"tomate"}]'::jsonb,
   'Cozinhe e bata a mandioca com leite de coco formando um creme. Refogue os camaroes com alho, cebola e tomate e misture ao creme.',
   50,'medium','["sem_gluten","sem_lactose"]'::jsonb,'["frutos_do_mar"]'::jsonb,'brasileira','community'),

  ('comm-6','Baião de Dois',
   '[{"name":"Arroz","canonicalId":"arroz"},{"name":"Feijão","canonicalId":"feijao"},{"name":"Linguiça","canonicalId":"linguica"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Cebola","canonicalId":"cebola"}]'::jsonb,
   'Cozinhe o feijao. Refogue a linguica com cebola, junte o arroz e o feijao com o caldo. Finalize com queijo coalho em cubos.',
   45,'medium','["sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),

  ('comm-7','Galinhada',
   '[{"name":"Frango","canonicalId":"frango"},{"name":"Arroz","canonicalId":"arroz"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Ervilha","canonicalId":"ervilha"}]'::jsonb,
   'Doure o frango com alho e cebola, junte o arroz e refogue. Cubra com agua quente, adicione cenoura e ervilha e cozinhe ate secar.',
   45,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-8','Bife à Parmegiana',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo"},{"name":"Molho de Tomate","canonicalId":"molho-tomate"},{"name":"Queijo","canonicalId":"queijo"}]'::jsonb,
   'Empane os bifes na farinha e no ovo, frite. Cubra com molho de tomate e queijo e gratine. Sirva com arroz e batata frita.',
   45,'medium','[]'::jsonb,'["gluten","ovo","leite"]'::jsonb,'brasileira','community'),

  ('comm-9','Fricassê de Frango',
   '[{"name":"Frango","canonicalId":"frango"},{"name":"Creme de Leite","canonicalId":"creme-leite"},{"name":"Milho Verde","canonicalId":"milho-verde"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Cebola","canonicalId":"cebola"}]'::jsonb,
   'Misture frango desfiado, creme de leite e milho. Coloque num refratario, cubra com queijo e leve ao forno para gratinar.',
   40,'easy','["sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),

  ('comm-10','Bife Acebolado',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Óleo","canonicalId":"oleo"}]'::jsonb,
   'Tempere e sele os bifes em frigideira quente. Reserve e doure a cebola em rodelas no mesmo oleo. Cubra os bifes com a cebola.',
   20,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-11','Polenta Cremosa',
   '[{"name":"Fubá","canonicalId":"fuba"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Manteiga","canonicalId":"manteiga"},{"name":"Leite","canonicalId":"leite"}]'::jsonb,
   'Dissolva o fuba em agua fria, leve ao fogo com leite mexendo por 20 minutos. Finalize com manteiga e queijo.',
   30,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),

  ('comm-12','Caldo Verde',
   '[{"name":"Batata","canonicalId":"batata"},{"name":"Linguiça","canonicalId":"linguica"},{"name":"Couve","canonicalId":"couve"},{"name":"Alho","canonicalId":"alho"},{"name":"Cebola","canonicalId":"cebola"}]'::jsonb,
   'Cozinhe e bata as batatas. Refogue alho, cebola e linguica, junte ao creme de batata e a couve fatiada fininha. Cozinhe 5 minutos.',
   40,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-13','Canja de Galinha',
   '[{"name":"Frango","canonicalId":"frango"},{"name":"Arroz","canonicalId":"arroz"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"}]'::jsonb,
   'Cozinhe o frango com alho e cebola, desfie. Volte a panela com o caldo, junte arroz e cenoura e cozinhe ate o arroz ficar macio.',
   40,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-14','Farofa de Bacon',
   '[{"name":"Farinha de Mandioca","canonicalId":"farinha-mandioca"},{"name":"Bacon","canonicalId":"bacon"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Ovo","canonicalId":"ovo"}]'::jsonb,
   'Frite o bacon, junte a cebola e os ovos mexidos. Adicione a farinha aos poucos mexendo ate dourar.',
   20,'easy','["sem_gluten"]'::jsonb,'["ovo"]'::jsonb,'brasileira','community'),

  ('comm-15','Vinagrete',
   '[{"name":"Tomate","canonicalId":"tomate"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Vinagre","canonicalId":"vinagre"},{"name":"Azeite","canonicalId":"azeite"}]'::jsonb,
   'Pique tomate, cebola e pimentao bem miudos. Tempere com vinagre, azeite e sal. Sirva gelado para acompanhar churrasco.',
   10,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  -- ===== SOBREMESAS (brasileira) =====
  ('comm-16','Brigadeiro',
   '[{"name":"Leite Condensado","canonicalId":"leite-condensado"},{"name":"Achocolatado","canonicalId":"achocolatado"},{"name":"Manteiga","canonicalId":"manteiga"}]'::jsonb,
   'Leve tudo ao fogo baixo mexendo ate desgrudar do fundo. Esfrie, enrole em bolinhas e passe no granulado.',
   25,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),

  ('comm-17','Pudim de Leite',
   '[{"name":"Leite Condensado","canonicalId":"leite-condensado"},{"name":"Leite","canonicalId":"leite"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Açúcar","canonicalId":"acucar"}]'::jsonb,
   'Faca uma calda com o acucar. Bata leite condensado, leite e ovos, despeje e asse em banho-maria por 1 hora. Gele antes de desenformar.',
   80,'medium','["vegetariano","sem_gluten"]'::jsonb,'["leite","ovo"]'::jsonb,'brasileira','community'),

  ('comm-18','Bolo de Cenoura',
   '[{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Açúcar","canonicalId":"acucar"},{"name":"Óleo","canonicalId":"oleo"}]'::jsonb,
   'Bata cenoura, ovos, acucar e oleo no liquidificador. Misture a farinha e o fermento. Asse a 180 graus por 40 minutos.',
   55,'medium','["vegetariano"]'::jsonb,'["ovo","gluten"]'::jsonb,'brasileira','community'),

  ('comm-19','Bolo de Fubá',
   '[{"name":"Fubá","canonicalId":"fuba"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Açúcar","canonicalId":"acucar"},{"name":"Leite","canonicalId":"leite"}]'::jsonb,
   'Bata os ingredientes liquidos, misture fuba, farinha e fermento. Asse a 180 graus por 40 minutos ate dourar.',
   55,'easy','["vegetariano"]'::jsonb,'["ovo","gluten","leite"]'::jsonb,'brasileira','community'),

  ('comm-20','Arroz Doce',
   '[{"name":"Arroz","canonicalId":"arroz"},{"name":"Leite","canonicalId":"leite"},{"name":"Açúcar","canonicalId":"acucar"},{"name":"Canela","canonicalId":"canela"}]'::jsonb,
   'Cozinhe o arroz com agua, adicione leite e acucar e cozinhe mexendo ate encorpar. Polvilhe canela e sirva.',
   40,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),

  ('comm-21','Mousse de Chocolate',
   '[{"name":"Chocolate","canonicalId":"chocolate"},{"name":"Creme de Leite","canonicalId":"creme-leite"},{"name":"Leite Condensado","canonicalId":"leite-condensado"},{"name":"Ovo","canonicalId":"ovo"}]'::jsonb,
   'Derreta o chocolate, misture leite condensado e creme de leite. Incorpore as claras em neve e gele por 4 horas.',
   20,'easy','["vegetariano"]'::jsonb,'["leite","ovo"]'::jsonb,'brasileira','community'),

  ('comm-22','Sorvete de Banana (Nice Cream)',
   '[{"name":"Banana","canonicalId":"banana"},{"name":"Pasta de Amendoim","canonicalId":"pasta-amendoim"}]'::jsonb,
   'Congele as bananas fatiadas, bata no processador com a pasta de amendoim ate virar um creme. Sirva na hora. Vegano.',
   10,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'["amendoim"]'::jsonb,'brasileira','community'),

  ('comm-23','Salada de Frutas',
   '[{"name":"Banana","canonicalId":"banana"},{"name":"Maçã","canonicalId":"maca"},{"name":"Laranja","canonicalId":"laranja"},{"name":"Uva","canonicalId":"uva"},{"name":"Mamão","canonicalId":"mamao"}]'::jsonb,
   'Pique todas as frutas em cubos, misture e regue com suco de laranja. Sirva gelada.',
   15,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  -- ===== ITALIANA =====
  ('comm-24','Macarrão à Carbonara',
   '[{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Bacon","canonicalId":"bacon"},{"name":"Queijo","canonicalId":"queijo"}]'::jsonb,
   'Cozinhe a massa al dente. Frite o bacon. Bata ovos com queijo, misture a massa quente e o bacon fora do fogo para criar o creme.',
   25,'medium','[]'::jsonb,'["gluten","ovo","leite"]'::jsonb,'italiana','community'),

  ('comm-25','Espaguete à Bolonhesa',
   '[{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Carne Bovina","canonicalId":"carne-bovina"},{"name":"Molho de Tomate","canonicalId":"molho-tomate"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"}]'::jsonb,
   'Refogue a carne moida com alho e cebola, junte o molho de tomate e cozinhe 20 minutos. Sirva sobre o espaguete cozido.',
   35,'easy','[]'::jsonb,'["gluten"]'::jsonb,'italiana','community'),

  ('comm-26','Lasanha à Bolonhesa',
   '[{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Carne Bovina","canonicalId":"carne-bovina"},{"name":"Molho de Tomate","canonicalId":"molho-tomate"},{"name":"Presunto","canonicalId":"presunto"},{"name":"Queijo","canonicalId":"queijo"}]'::jsonb,
   'Monte camadas de massa, molho de carne, presunto e queijo. Repita, cubra com queijo e asse por 30 minutos.',
   60,'medium','[]'::jsonb,'["gluten","leite"]'::jsonb,'italiana','community'),

  ('comm-27','Nhoque ao Sugo',
   '[{"name":"Batata","canonicalId":"batata"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Molho de Tomate","canonicalId":"molho-tomate"}]'::jsonb,
   'Amasse a batata cozida, misture farinha e ovo formando uma massa. Faca rolinhos, corte e cozinhe na agua. Sirva com molho.',
   50,'medium','["vegetariano"]'::jsonb,'["gluten","ovo"]'::jsonb,'italiana','community'),

  ('comm-28','Penne ao Molho Branco',
   '[{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Leite","canonicalId":"leite"},{"name":"Manteiga","canonicalId":"manteiga"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo"},{"name":"Queijo","canonicalId":"queijo"}]'::jsonb,
   'Faca um molho branco com manteiga, farinha e leite. Junte queijo e misture ao penne cozido.',
   30,'easy','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'italiana','community'),

  ('comm-29','Risoto de Cogumelos',
   '[{"name":"Arroz","canonicalId":"arroz"},{"name":"Cogumelo","canonicalId":"cogumelo"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Manteiga","canonicalId":"manteiga"}]'::jsonb,
   'Refogue cebola na manteiga, junte arroz e cogumelos. Adicione caldo quente aos poucos mexendo ate cremoso. Finalize com queijo.',
   40,'medium','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'italiana','community'),

  ('comm-30','Risoto de Camarão',
   '[{"name":"Arroz","canonicalId":"arroz"},{"name":"Camarão","canonicalId":"camarao"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Manteiga","canonicalId":"manteiga"}]'::jsonb,
   'Refogue alho e cebola, junte o arroz e adicione caldo aos poucos. Quase no fim, acrescente os camaroes e finalize com manteiga.',
   40,'medium','["sem_gluten"]'::jsonb,'["frutos_do_mar","leite"]'::jsonb,'italiana','community'),

  ('comm-31','Pizza Margherita',
   '[{"name":"Farinha de Trigo","canonicalId":"farinha-trigo"},{"name":"Molho de Tomate","canonicalId":"molho-tomate"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Manjericão","canonicalId":"manjericao"}]'::jsonb,
   'Abra a massa, espalhe molho de tomate e queijo. Asse em forno bem quente e finalize com folhas de manjericao.',
   40,'medium','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'italiana','community'),

  ('comm-32','Pizza Calabresa',
   '[{"name":"Farinha de Trigo","canonicalId":"farinha-trigo"},{"name":"Molho de Tomate","canonicalId":"molho-tomate"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Linguiça","canonicalId":"linguica"},{"name":"Cebola","canonicalId":"cebola"}]'::jsonb,
   'Abra a massa, cubra com molho, queijo, calabresa fatiada e cebola. Asse em forno quente ate dourar.',
   40,'medium','[]'::jsonb,'["gluten","leite"]'::jsonb,'italiana','community'),

  ('comm-33','Bruschetta',
   '[{"name":"Pão","canonicalId":"pao"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Alho","canonicalId":"alho"},{"name":"Manjericão","canonicalId":"manjericao"},{"name":"Azeite","canonicalId":"azeite"}]'::jsonb,
   'Torre fatias de pao, esfregue alho. Cubra com tomate picado temperado com azeite, sal e manjericao.',
   15,'easy','["vegetariano","vegano"]'::jsonb,'["gluten"]'::jsonb,'italiana','community'),

  ('comm-34','Macarrão Alho e Óleo',
   '[{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Alho","canonicalId":"alho"},{"name":"Azeite","canonicalId":"azeite"},{"name":"Salsa","canonicalId":"salsa"}]'::jsonb,
   'Cozinhe o macarrao al dente. Doure o alho fatiado no azeite sem queimar, misture a massa e finalize com salsa.',
   20,'easy','["vegetariano","vegano","sem_lactose"]'::jsonb,'["gluten"]'::jsonb,'italiana','community'),

  ('comm-35','Salada Caprese',
   '[{"name":"Tomate","canonicalId":"tomate"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Manjericão","canonicalId":"manjericao"},{"name":"Azeite","canonicalId":"azeite"}]'::jsonb,
   'Alterne fatias de tomate e mussarela, intercale manjericao e regue com azeite e sal.',
   10,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'italiana','community'),

  -- ===== MEXICANA =====
  ('comm-36','Tacos de Carne',
   '[{"name":"Tortilla","canonicalId":"tortilla"},{"name":"Carne Bovina","canonicalId":"carne-bovina"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alface","canonicalId":"alface"}]'::jsonb,
   'Refogue a carne moida com cebola e temperos. Recheie as tortillas com carne, tomate e alface.',
   25,'easy','[]'::jsonb,'["gluten"]'::jsonb,'mexicana','community'),

  ('comm-37','Burrito de Feijão',
   '[{"name":"Tortilla","canonicalId":"tortilla"},{"name":"Feijão","canonicalId":"feijao"},{"name":"Arroz","canonicalId":"arroz"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Milho Verde","canonicalId":"milho-verde"}]'::jsonb,
   'Recheie a tortilla com arroz, feijao temperado, tomate e milho. Enrole bem firme e aqueca na frigideira.',
   20,'easy','["vegetariano","vegano"]'::jsonb,'["gluten"]'::jsonb,'mexicana','community'),

  ('comm-38','Quesadilla de Queijo',
   '[{"name":"Tortilla","canonicalId":"tortilla"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Cebola","canonicalId":"cebola"}]'::jsonb,
   'Recheie a tortilla com queijo, pimentao e cebola. Dobre e doure dos dois lados ate o queijo derreter.',
   15,'easy','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'mexicana','community'),

  ('comm-39','Guacamole',
   '[{"name":"Abacate","canonicalId":"abacate"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Limão","canonicalId":"limao"},{"name":"Coentro","canonicalId":"coentro"}]'::jsonb,
   'Amasse o abacate, misture tomate e cebola picados, suco de limao, sal e coentro. Sirva com nachos.',
   10,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mexicana','community'),

  ('comm-40','Chili Vegano',
   '[{"name":"Feijão","canonicalId":"feijao"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Milho Verde","canonicalId":"milho-verde"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Cominho","canonicalId":"cominho"}]'::jsonb,
   'Refogue cebola e pimentao, junte feijao, tomate, milho e cominho. Cozinhe 20 minutos ate encorpar. Sirva com arroz.',
   35,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mexicana','community'),

  ('comm-41','Fajitas de Frango',
   '[{"name":"Tortilla","canonicalId":"tortilla"},{"name":"Frango","canonicalId":"frango"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Cebola","canonicalId":"cebola"}]'::jsonb,
   'Grelhe tiras de frango com pimentao e cebola e temperos. Sirva nas tortillas para montar na hora.',
   25,'easy','[]'::jsonb,'["gluten"]'::jsonb,'mexicana','community'),

  -- ===== ASIÁTICA =====
  ('comm-42','Yakisoba',
   '[{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Frango","canonicalId":"frango"},{"name":"Repolho","canonicalId":"repolho"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Shoyu","canonicalId":"shoyu"}]'::jsonb,
   'Refogue o frango em tiras, junte os legumes em fogo alto. Misture o macarrao cozido e tempere com shoyu.',
   30,'easy','[]'::jsonb,'["gluten","soja"]'::jsonb,'asiatica','community'),

  ('comm-43','Arroz Frito',
   '[{"name":"Arroz","canonicalId":"arroz"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Ervilha","canonicalId":"ervilha"},{"name":"Cebolinha","canonicalId":"cebolinha"},{"name":"Shoyu","canonicalId":"shoyu"}]'::jsonb,
   'Em fogo alto, mexa o ovo, junte arroz cozido, cenoura e ervilha. Tempere com shoyu e finalize com cebolinha.',
   20,'easy','[]'::jsonb,'["ovo","soja","gluten"]'::jsonb,'asiatica','community'),

  ('comm-44','Frango Xadrez',
   '[{"name":"Frango","canonicalId":"frango"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Shoyu","canonicalId":"shoyu"},{"name":"Amendoim","canonicalId":"amendoim"}]'::jsonb,
   'Doure o frango em cubos, junte cebola e pimentao. Tempere com shoyu e finalize com amendoim torrado.',
   30,'easy','["sem_lactose"]'::jsonb,'["soja","amendoim","gluten"]'::jsonb,'asiatica','community'),

  ('comm-45','Frango Teriyaki',
   '[{"name":"Frango","canonicalId":"frango"},{"name":"Shoyu","canonicalId":"shoyu"},{"name":"Mel","canonicalId":"mel"},{"name":"Gergelim","canonicalId":"gergelim"},{"name":"Alho","canonicalId":"alho"}]'::jsonb,
   'Grelhe o frango, adicione shoyu, mel e alho ate formar um molho brilhante. Finalize com gergelim. Sirva com arroz.',
   30,'easy','["sem_lactose"]'::jsonb,'["soja","gluten"]'::jsonb,'asiatica','community'),

  ('comm-46','Tofu Grelhado com Legumes',
   '[{"name":"Tofu","canonicalId":"tofu"},{"name":"Brócolis","canonicalId":"brocolis"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Shoyu","canonicalId":"shoyu"},{"name":"Gengibre","canonicalId":"gengibre"}]'::jsonb,
   'Doure o tofu em cubos, reserve. Salteie brocolis e cenoura com gengibre e shoyu, junte o tofu. Vegano.',
   25,'easy','["vegetariano","vegano","sem_lactose"]'::jsonb,'["soja","gluten"]'::jsonb,'asiatica','community'),

  ('comm-47','Curry de Grão-de-bico',
   '[{"name":"Grão-de-bico","canonicalId":"grao-de-bico"},{"name":"Leite de Coco","canonicalId":"leite-coco"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Curry","canonicalId":"curry"}]'::jsonb,
   'Refogue cebola com curry, junte tomate, grao-de-bico e leite de coco. Cozinhe 15 minutos. Sirva com arroz. Vegano.',
   30,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'asiatica','community'),

  ('comm-48','Frango ao Curry com Leite de Coco',
   '[{"name":"Frango","canonicalId":"frango"},{"name":"Leite de Coco","canonicalId":"leite-coco"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Curry","canonicalId":"curry"}]'::jsonb,
   'Doure o frango com alho, cebola e curry. Adicione o leite de coco e cozinhe ate encorpar. Sirva com arroz.',
   35,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'asiatica','community'),

  -- ===== INDIANA =====
  ('comm-49','Dahl de Lentilha',
   '[{"name":"Lentilha","canonicalId":"lentilha"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Curry","canonicalId":"curry"},{"name":"Gengibre","canonicalId":"gengibre"}]'::jsonb,
   'Refogue cebola, alho e gengibre com curry. Junte lentilha e tomate, cubra com agua e cozinhe ate desmanchar. Vegano.',
   40,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'indiana','community'),

  ('comm-50','Frango Tikka',
   '[{"name":"Frango","canonicalId":"frango"},{"name":"Iogurte","canonicalId":"iogurte"},{"name":"Curry","canonicalId":"curry"},{"name":"Alho","canonicalId":"alho"},{"name":"Limão","canonicalId":"limao"}]'::jsonb,
   'Marine o frango com iogurte, curry, alho e limao por 1 hora. Grelhe ate dourar. Sirva com arroz.',
   50,'medium','["sem_gluten"]'::jsonb,'["leite"]'::jsonb,'indiana','community'),

  ('comm-51','Curry de Batata e Ervilha',
   '[{"name":"Batata","canonicalId":"batata"},{"name":"Ervilha","canonicalId":"ervilha"},{"name":"Leite de Coco","canonicalId":"leite-coco"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Curry","canonicalId":"curry"}]'::jsonb,
   'Refogue cebola com curry, junte batata em cubos, ervilha e leite de coco. Cozinhe ate a batata amaciar. Vegano.',
   35,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'indiana','community'),

  -- ===== ÁRABE =====
  ('comm-52','Homus',
   '[{"name":"Grão-de-bico","canonicalId":"grao-de-bico"},{"name":"Tahine","canonicalId":"tahine"},{"name":"Alho","canonicalId":"alho"},{"name":"Limão","canonicalId":"limao"},{"name":"Azeite","canonicalId":"azeite"}]'::jsonb,
   'Bata o grao-de-bico cozido com tahine, alho, limao e azeite ate virar uma pasta lisa. Sirva com pao sirio. Vegano.',
   15,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'arabe','community'),

  ('comm-53','Falafel',
   '[{"name":"Grão-de-bico","canonicalId":"grao-de-bico"},{"name":"Alho","canonicalId":"alho"},{"name":"Coentro","canonicalId":"coentro"},{"name":"Salsa","canonicalId":"salsa"},{"name":"Cominho","canonicalId":"cominho"}]'::jsonb,
   'Processe o grao-de-bico cru hidratado com alho, ervas e cominho. Modele bolinhos e frite ate dourar. Vegano.',
   40,'medium','["vegetariano","vegano","sem_lactose"]'::jsonb,'[]'::jsonb,'arabe','community'),

  ('comm-54','Tabule',
   '[{"name":"Cuscuz","canonicalId":"cuscuz"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Salsa","canonicalId":"salsa"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Limão","canonicalId":"limao"}]'::jsonb,
   'Hidrate o trigo, misture com bastante salsa, tomate e cebola picados. Tempere com limao, azeite e sal. Vegano.',
   20,'easy','["vegetariano","vegano","sem_lactose"]'::jsonb,'["gluten"]'::jsonb,'arabe','community'),

  ('comm-55','Babaganuche',
   '[{"name":"Berinjela","canonicalId":"berinjela"},{"name":"Tahine","canonicalId":"tahine"},{"name":"Alho","canonicalId":"alho"},{"name":"Limão","canonicalId":"limao"},{"name":"Azeite","canonicalId":"azeite"}]'::jsonb,
   'Asse a berinjela ate ficar macia, retire a polpa e bata com tahine, alho e limao. Regue com azeite. Vegano.',
   40,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'arabe','community'),

  ('comm-56','Kafta de Carne',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Salsa","canonicalId":"salsa"},{"name":"Alho","canonicalId":"alho"}]'::jsonb,
   'Misture a carne moida com cebola ralada, salsa e temperos. Modele em espetos e grelhe ate dourar.',
   30,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'arabe','community'),

  -- ===== MEDITERRÂNEA =====
  ('comm-57','Salada Grega',
   '[{"name":"Pepino","canonicalId":"pepino"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Azeitona","canonicalId":"azeitona"},{"name":"Azeite","canonicalId":"azeite"}]'::jsonb,
   'Corte pepino, tomate e cebola, junte queijo em cubos e azeitonas. Tempere com azeite e oregano.',
   15,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'mediterranea','community'),

  ('comm-58','Salada de Quinoa',
   '[{"name":"Quinoa","canonicalId":"quinoa"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Pepino","canonicalId":"pepino"},{"name":"Limão","canonicalId":"limao"},{"name":"Azeite","canonicalId":"azeite"}]'::jsonb,
   'Cozinhe a quinoa e deixe esfriar. Misture com tomate e pepino picados, tempere com limao e azeite. Vegano.',
   25,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mediterranea','community'),

  ('comm-59','Peixe Assado com Limão',
   '[{"name":"Peixe","canonicalId":"peixe"},{"name":"Limão","canonicalId":"limao"},{"name":"Alho","canonicalId":"alho"},{"name":"Azeite","canonicalId":"azeite"},{"name":"Batata","canonicalId":"batata"}]'::jsonb,
   'Tempere o peixe com alho, limao e azeite. Asse com rodelas de batata por 30 minutos.',
   40,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mediterranea','community'),

  ('comm-60','Legumes Assados',
   '[{"name":"Abobrinha","canonicalId":"abobrinha"},{"name":"Berinjela","canonicalId":"berinjela"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Azeite","canonicalId":"azeite"}]'::jsonb,
   'Corte os legumes, tempere com azeite, alho e ervas. Asse a 200 graus por 35 minutos. Vegano.',
   45,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mediterranea','community'),

  ('comm-61','Ratatouille',
   '[{"name":"Berinjela","canonicalId":"berinjela"},{"name":"Abobrinha","canonicalId":"abobrinha"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"}]'::jsonb,
   'Refogue cebola e alho, monte fatias de berinjela, abobrinha e tomate sobre o molho. Asse coberto por 40 minutos. Vegano.',
   55,'medium','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mediterranea','community'),

  -- ===== AMERICANA =====
  ('comm-62','Hambúrguer Caseiro',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina"},{"name":"Pão","canonicalId":"pao"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Alface","canonicalId":"alface"},{"name":"Tomate","canonicalId":"tomate"}]'::jsonb,
   'Modele e grelhe o hamburguer, derreta o queijo por cima. Monte no pao com alface e tomate.',
   25,'easy','[]'::jsonb,'["gluten","leite"]'::jsonb,'americana','community'),

  ('comm-63','Cachorro-quente',
   '[{"name":"Salsicha","canonicalId":"salsicha"},{"name":"Pão","canonicalId":"pao"},{"name":"Molho de Tomate","canonicalId":"molho-tomate"},{"name":"Batata","canonicalId":"batata"},{"name":"Milho Verde","canonicalId":"milho-verde"}]'::jsonb,
   'Cozinhe as salsichas no molho de tomate. Monte no pao com milho e batata palha.',
   20,'easy','[]'::jsonb,'["gluten"]'::jsonb,'americana','community'),

  ('comm-64','Panquecas Americanas',
   '[{"name":"Farinha de Trigo","canonicalId":"farinha-trigo"},{"name":"Leite","canonicalId":"leite"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Fermento","canonicalId":"fermento"},{"name":"Mel","canonicalId":"mel"}]'::jsonb,
   'Misture farinha, leite, ovo e fermento. Faca discos grossos na frigideira. Sirva em pilha com mel.',
   20,'easy','["vegetariano"]'::jsonb,'["gluten","leite","ovo"]'::jsonb,'americana','community'),

  ('comm-65','Mac and Cheese',
   '[{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Leite","canonicalId":"leite"},{"name":"Manteiga","canonicalId":"manteiga"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo"}]'::jsonb,
   'Faca um molho branco, derreta bastante queijo nele e misture ao macarrao cozido. Gratine se quiser.',
   30,'easy','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'americana','community'),

  ('comm-66','Salada Caesar',
   '[{"name":"Alface","canonicalId":"alface"},{"name":"Frango","canonicalId":"frango"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Pão","canonicalId":"pao"},{"name":"Maionese","canonicalId":"maionese"}]'::jsonb,
   'Grelhe o frango em tiras, torre o pao em cubos. Monte com alface, frango e croutons, regue com molho e queijo.',
   20,'easy','[]'::jsonb,'["gluten","leite","ovo"]'::jsonb,'americana','community'),

  ('comm-67','Coleslaw',
   '[{"name":"Repolho","canonicalId":"repolho"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Maionese","canonicalId":"maionese"},{"name":"Limão","canonicalId":"limao"}]'::jsonb,
   'Fatie repolho e cenoura bem fino. Misture com maionese, limao e sal. Sirva gelada.',
   15,'easy','["vegetariano","sem_gluten"]'::jsonb,'["ovo"]'::jsonb,'americana','community'),

  ('comm-68','Cookies de Chocolate',
   '[{"name":"Farinha de Trigo","canonicalId":"farinha-trigo"},{"name":"Chocolate","canonicalId":"chocolate"},{"name":"Manteiga","canonicalId":"manteiga"},{"name":"Açúcar","canonicalId":"acucar"},{"name":"Ovo","canonicalId":"ovo"}]'::jsonb,
   'Misture manteiga, acucar, ovo e farinha, junte gotas de chocolate. Faca bolinhas e asse por 12 minutos.',
   30,'easy','["vegetariano"]'::jsonb,'["gluten","leite","ovo"]'::jsonb,'americana','community'),

  ('comm-69','Smoothie Bowl',
   '[{"name":"Banana","canonicalId":"banana"},{"name":"Morango","canonicalId":"morango"},{"name":"Iogurte","canonicalId":"iogurte"},{"name":"Granola","canonicalId":"granola"},{"name":"Mel","canonicalId":"mel"}]'::jsonb,
   'Bata banana e morango congelados com iogurte ate cremoso. Sirva na tigela com granola e mel por cima.',
   10,'easy','["vegetariano"]'::jsonb,'["leite"]'::jsonb,'americana','community'),

  ('comm-70','Aveia com Banana e Mel',
   '[{"name":"Aveia","canonicalId":"aveia"},{"name":"Banana","canonicalId":"banana"},{"name":"Mel","canonicalId":"mel"},{"name":"Leite Vegetal","canonicalId":"leite-vegetal"}]'::jsonb,
   'Cozinhe a aveia com o leite vegetal ate engrossar. Sirva com banana fatiada e mel.',
   10,'easy','["vegetariano","sem_lactose"]'::jsonb,'[]'::jsonb,'americana','community')
on conflict (id) do update set
  title = excluded.title,
  ingredients = excluded.ingredients,
  instructions = excluded.instructions,
  prep_time = excluded.prep_time,
  difficulty = excluded.difficulty,
  tags = excluded.tags,
  allergens = excluded.allergens,
  cuisine = excluded.cuisine,
  origin = excluded.origin,
  updated_at = now();

-- =============================================================================
-- Lote novo (detalhado + porções) — PT-BR. Inclui a coluna `servings`.
-- Garante as colunas mesmo em tabelas antigas (seguro re-rodar).
-- =============================================================================
alter table public.recipes add column if not exists servings integer null;

insert into public.recipes (id, title, ingredients, instructions, prep_time, servings, difficulty, tags, allergens, cuisine, origin)
values
  -- ===== BRASILEIRA =====
  ('comm-71','Arroz de forno',
   '[{"name":"Arroz","canonicalId":"arroz"},{"name":"Presunto","canonicalId":"presunto"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Milho Verde","canonicalId":"milho-verde"},{"name":"Ovo","canonicalId":"ovo"}]'::jsonb,
   E'1. Use 3 xícaras de arroz já cozido (sobra de arroz funciona muito bem). Pré-aqueça o forno a 200 °C.\n2. Em uma tigela, misture o arroz, o presunto picado, o milho escorrido e metade do queijo ralado. Acerte o sal.\n3. Bata os ovos e incorpore à mistura — eles dão liga ao gratinado.\n4. Transfira para um refratário untado, cubra com o queijo restante e leve ao forno por 20 a 25 minutos, até dourar por cima.\n💡 Dica: um fio de requeijão entre as camadas deixa o arroz de forno bem mais cremoso.',
   45,4,'medium','["sem_gluten"]'::jsonb,'["leite","ovo"]'::jsonb,'brasileira','community'),

  ('comm-72','Cuscuz nordestino',
   '[{"name":"Cuscuz","canonicalId":"cuscuz"},{"name":"Linguiça","canonicalId":"linguica"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Manteiga","canonicalId":"manteiga"}]'::jsonb,
   E'1. Hidrate a flocão de milho (cuscuz) com água e sal: umedeça aos poucos, mexendo com as mãos, até ficar úmido mas solto (descanse 5 minutos).\n2. Frite a linguiça fatiada em fogo médio até dourar e solte a gordura; reserve.\n3. Frite os ovos na manteiga, do jeito que preferir.\n4. Cozinhe o cuscuz na cuscuzeira (ou panela com peneira) por 8 a 10 minutos no vapor, até firmar.\n5. Desenforme, regue com um pouco de manteiga derretida e sirva com a linguiça e o ovo por cima.\n💡 Dica: o ponto da hidratação é quando você aperta o floco e ele se mantém unido sem empapar.',
   30,4,'easy','[]'::jsonb,'["leite","ovo"]'::jsonb,'brasileira','community'),

  ('comm-73','Sopa de legumes',
   '[{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Batata","canonicalId":"batata"},{"name":"Abobrinha","canonicalId":"abobrinha"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Tomate","canonicalId":"tomate"}]'::jsonb,
   E'1. Pique todos os legumes em cubos médios (assim cozinham por igual).\n2. Em uma panela, refogue a cebola em um fio de azeite por 2 minutos, junte o tomate e cozinhe até desmanchar.\n3. Acrescente a cenoura e a batata, cubra com 1,5 litro de água quente e cozinhe em fogo médio por 15 minutos.\n4. Junte a abobrinha (que cozinha mais rápido) e cozinhe mais 8 minutos, até tudo ficar macio. Acerte o sal.\n5. Para uma sopa cremosa, bata metade no liquidificador e volte à panela.\n💡 Dica: finalize com salsinha e um fio de azeite cru — realça o sabor dos legumes.',
   35,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-74','Purê de batata',
   '[{"name":"Batata","canonicalId":"batata"},{"name":"Leite","canonicalId":"leite"},{"name":"Manteiga","canonicalId":"manteiga"}]'::jsonb,
   E'1. Descasque e corte as batatas em pedaços iguais. Cozinhe em água com sal por 15 a 20 minutos, até espetar fácil com o garfo.\n2. Escorra muito bem e amasse ainda quentes (batata fria deixa o purê empelotado).\n3. Volte a panela ao fogo baixo, junte a manteiga e o leite morno aos poucos, mexendo, até ficar liso e cremoso.\n4. Acerte o sal e uma pitada de noz-moscada, se tiver. Sirva quente.\n💡 Dica: não use mixer/liquidificador — a batata vira goma. Amasse com espremedor ou garfo.',
   25,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),

  ('comm-75','Carne de panela',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina"},{"name":"Batata","canonicalId":"batata"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Tomate","canonicalId":"tomate"}]'::jsonb,
   E'1. Tempere a carne em cubos (acém ou músculo) com sal, alho e pimenta. Em fogo alto, doure bem em um fio de óleo, em porções, para selar.\n2. Junte a cebola e o tomate picados e refogue 3 minutos.\n3. Cubra com água quente até a metade da carne, tampe e cozinhe em fogo baixo por 1 hora (ou 25 minutos na pressão), até começar a amaciar.\n4. Adicione a batata e a cenoura em pedaços e cozinhe mais 20 minutos, até a carne desmanchar e o molho encorpar.\n💡 Dica: selar a carne em fogo alto antes de cozinhar é o que dá cor e sabor ao caldo.',
   90,4,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-76','Frango assado com batatas',
   '[{"name":"Frango","canonicalId":"frango"},{"name":"Batata","canonicalId":"batata"},{"name":"Alho","canonicalId":"alho"},{"name":"Limão","canonicalId":"limao"},{"name":"Azeite","canonicalId":"azeite"}]'::jsonb,
   E'1. Tempere os pedaços de frango com alho amassado, suco de limão, sal, pimenta e azeite. Deixe marinar 30 minutos (ou na geladeira de um dia para o outro).\n2. Pré-aqueça o forno a 200 °C. Espalhe o frango e as batatas em cubos numa assadeira, regando tudo com azeite.\n3. Asse por 40 a 50 minutos, virando na metade, até o frango ficar dourado e as batatas macias por dentro e crocantes por fora.\n4. O frango está no ponto quando o suco sai transparente ao furar a parte mais grossa.\n💡 Dica: não amontoe os pedaços na assadeira — com espaço entre eles, tudo doura em vez de cozinhar no vapor.',
   60,4,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-77','Arroz à grega',
   '[{"name":"Arroz","canonicalId":"arroz"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Ervilha","canonicalId":"ervilha"},{"name":"Uva Passa","canonicalId":"passas"},{"name":"Milho Verde","canonicalId":"milho-verde"}]'::jsonb,
   E'1. Refogue 1 xícara de arroz em um fio de azeite com um pouco de cebola por 1 minuto.\n2. Cubra com 2 xícaras de água fervente e sal, e cozinhe tampado em fogo baixo por 15 minutos.\n3. Enquanto isso, cozinhe rapidamente a cenoura em cubinhos e a ervilha (3 a 4 minutos) só para amaciar.\n4. Quando o arroz estiver pronto, misture a cenoura, a ervilha, o milho e as passas, soltando com um garfo.\n💡 Dica: deixe as passas de molho em água morna por 10 minutos — elas incham e ficam mais macias e doces.',
   35,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-78','Picadinho de carne',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Batata","canonicalId":"batata"}]'::jsonb,
   E'1. Corte a carne (patinho ou alcatra) em cubos bem pequenos. Tempere com sal e pimenta.\n2. Em fogo alto, doure a carne em um fio de óleo, em porções, sem amontoar, até pegar cor; reserve.\n3. Na mesma panela, refogue a cebola e o alho, junte o tomate picado e cozinhe até virar um molho.\n4. Volte a carne, adicione a batata em cubos pequenos e um pouco de água, tampe e cozinhe 20 minutos, até a batata amaciar e o molho encorpar.\n💡 Dica: sirva com arroz branco e um ovo frito por cima — vira um prato completo.',
   40,4,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),

  ('comm-79','Salada de batata',
   '[{"name":"Batata","canonicalId":"batata"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Maionese","canonicalId":"maionese"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Cebolinha","canonicalId":"cebolinha"}]'::jsonb,
   E'1. Cozinhe as batatas e a cenoura em cubos em água com sal por 10 a 12 minutos, até ficarem macias mas firmes (não podem desmanchar).\n2. Cozinhe os ovos por 10 minutos a partir da fervura para ficarem bem cozidos; descasque e pique.\n3. Escorra os legumes e deixe esfriar completamente (importante para a maionese não talhar).\n4. Misture tudo com a maionese, a cebolinha picada e sal a gosto. Leve à geladeira por 30 minutos antes de servir.\n💡 Dica: um toque de mostarda e um fio de limão na maionese deixam a salada menos enjoativa.',
   25,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["ovo"]'::jsonb,'brasileira','community'),

  -- ===== ITALIANA =====
  ('comm-80','Sopa de tomate',
   '[{"name":"Tomate","canonicalId":"tomate"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Manjericão","canonicalId":"manjericao"},{"name":"Creme de Leite","canonicalId":"creme-leite"}]'::jsonb,
   E'1. Refogue a cebola e o alho picados em azeite por 2 minutos, até ficarem macios.\n2. Junte os tomates maduros picados (sem pele, se possível), uma pitada de açúcar (corta a acidez) e sal. Cozinhe por 15 minutos.\n3. Acrescente 2 xícaras de água quente e cozinhe mais 5 minutos.\n4. Bata tudo no liquidificador até ficar liso, volte à panela e incorpore o creme de leite em fogo baixo (não deixe ferver depois disso).\n5. Finalize com folhas de manjericão.\n💡 Dica: sirva com cubos de pão tostado no forno com azeite — croutons caseiros.',
   30,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'italiana','community'),

  ('comm-81','Frittata de legumes',
   '[{"name":"Ovo","canonicalId":"ovo"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Abobrinha","canonicalId":"abobrinha"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Pimentão","canonicalId":"pimentao"}]'::jsonb,
   E'1. Pré-aqueça o forno a 180 °C. Refogue a cebola, o pimentão e a abobrinha em cubinhos numa frigideira que possa ir ao forno, por 5 minutos.\n2. Bata 6 ovos com sal, pimenta e o queijo ralado.\n3. Despeje os ovos sobre os legumes, mexa levemente e cozinhe no fogo por 3 minutos, até as bordas firmarem.\n4. Leve a frigideira ao forno por 10 a 12 minutos, até o centro firmar e a superfície dourar.\n5. Solte com uma espátula e sirva em fatias, quente ou fria.\n💡 Dica: a frittata é ótima para aproveitar sobras de legumes — use o que tiver na geladeira.',
   25,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["ovo","leite"]'::jsonb,'italiana','community'),

  ('comm-82','Massa ao pesto',
   '[{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Manjericão","canonicalId":"manjericao"},{"name":"Alho","canonicalId":"alho"},{"name":"Azeite","canonicalId":"azeite"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Nozes","canonicalId":"nozes"}]'::jsonb,
   E'1. Cozinhe o macarrão em água fervente com sal até al dente; reserve 1 concha da água antes de escorrer.\n2. No liquidificador ou pilão, bata o manjericão, o alho, as nozes, o queijo ralado e o azeite até formar uma pasta. Acerte o sal.\n3. Misture o pesto ao macarrão escorrido ainda quente, fora do fogo (calor demais escurece o pesto).\n4. Solte com um pouco da água do cozimento, até o molho envolver bem a massa.\n💡 Dica: nunca cozinhe o pesto — ele é misturado cru à massa para manter a cor verde e o frescor.',
   25,4,'easy','["vegetariano"]'::jsonb,'["gluten","leite","castanhas"]'::jsonb,'italiana','community'),

  ('comm-83','Salada de macarrão',
   '[{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Azeitona","canonicalId":"azeitona"},{"name":"Pepino","canonicalId":"pepino"}]'::jsonb,
   E'1. Cozinhe o macarrão (de preferência parafuso) al dente, escorra e passe rapidamente na água fria para parar o cozimento.\n2. Pique o tomate, o pepino e o queijo em cubinhos e fatie as azeitonas.\n3. Misture tudo com o macarrão, regue com azeite, um toque de vinagre ou limão e sal.\n4. Leve à geladeira por pelo menos 30 minutos antes de servir — fica melhor bem gelada.\n💡 Dica: tempere só na hora de servir; se temperar antes, o macarrão absorve o molho e resseca.',
   30,4,'easy','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'italiana','community'),

  ('comm-84','Minestrone',
   '[{"name":"Feijão","canonicalId":"feijao"},{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Batata","canonicalId":"batata"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Cebola","canonicalId":"cebola"}]'::jsonb,
   E'1. Refogue a cebola em azeite, junte o tomate picado e cozinhe até desmanchar.\n2. Acrescente a cenoura e a batata em cubos pequenos e cubra com 1,5 litro de água quente. Cozinhe por 15 minutos.\n3. Junte o feijão já cozido (com um pouco do caldo) e deixe ferver mais 5 minutos.\n4. Adicione um punhado de macarrão curto e cozinhe até a massa ficar al dente. Acerte o sal.\n💡 Dica: um pedaço de casca de queijo cozido junto à sopa dá um sabor incrível (retire antes de servir).',
   45,6,'easy','["vegetariano","vegano"]'::jsonb,'["gluten"]'::jsonb,'italiana','community'),

  -- ===== MEXICANA =====
  ('comm-85','Nachos',
   '[{"name":"Tortilla","canonicalId":"tortilla"},{"name":"Queijo","canonicalId":"queijo"},{"name":"Feijão","canonicalId":"feijao"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Pimentão","canonicalId":"pimentao"}]'::jsonb,
   E'1. Corte as tortillas em triângulos e leve ao forno a 180 °C por 8 a 10 minutos (ou frite) até ficarem crocantes.\n2. Aqueça o feijão amassado com um pouco de cebola e cominho até virar uma pasta.\n3. Em um refratário, espalhe os chips, cubra com o feijão, o queijo ralado e o pimentão picado.\n4. Leve ao forno por 5 minutos, só até o queijo derreter.\n5. Finalize com tomate picado por cima.\n💡 Dica: monte e gratine só na hora de servir — os chips perdem a crocância se ficarem com o queijo parado.',
   20,4,'easy','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'mexicana','community'),

  ('comm-86','Sopa de feijão',
   '[{"name":"Feijão","canonicalId":"feijao"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Cominho","canonicalId":"cominho"}]'::jsonb,
   E'1. Refogue a cebola, o alho e o pimentão picados em azeite por 3 minutos.\n2. Junte o tomate e o cominho e cozinhe 3 minutos, até formar um molho perfumado.\n3. Acrescente o feijão já cozido com o caldo e deixe ferver por 10 minutos.\n4. Bata metade no liquidificador e volte à panela para uma sopa encorpada. Acerte o sal.\n💡 Dica: sirva com chips de tortilla e um toque de limão — fica entre uma sopa e um chili.',
   40,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mexicana','community'),

  -- ===== ASIÁTICA =====
  ('comm-87','Frango agridoce',
   '[{"name":"Frango","canonicalId":"frango"},{"name":"Abacaxi","canonicalId":"abacaxi"},{"name":"Pimentão","canonicalId":"pimentao"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Ketchup","canonicalId":"ketchup"}]'::jsonb,
   E'1. Corte o frango em cubos, tempere com sal e doure em fogo alto numa frigideira ou wok até ficar dourado; reserve.\n2. Na mesma panela, salteie a cebola e o pimentão em pedaços por 2 minutos (devem ficar crocantes).\n3. Junte o abacaxi em cubos e refogue 1 minuto.\n4. Volte o frango, adicione o ketchup misturado com um pouco de água e vinagre, e mexa em fogo alto por 2 minutos, até criar um molho brilhante.\n💡 Dica: o segredo do agridoce é o fogo alto e rápido — os legumes ficam crocantes e o molho encorpa sem cozinhar demais.',
   30,4,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'asiatica','community'),

  ('comm-88','Salada oriental de pepino',
   '[{"name":"Pepino","canonicalId":"pepino"},{"name":"Shoyu","canonicalId":"shoyu"},{"name":"Gergelim","canonicalId":"gergelim"},{"name":"Vinagre","canonicalId":"vinagre"},{"name":"Alho","canonicalId":"alho"}]'::jsonb,
   E'1. Amasse levemente os pepinos com a lateral da faca e corte em pedaços irregulares (assim absorvem mais o molho).\n2. Polvilhe com sal e deixe descansar 10 minutos; escorra a água que soltar.\n3. Misture shoyu, vinagre, um fio de óleo de gergelim (ou azeite) e o alho amassado.\n4. Regue os pepinos com o molho, polvilhe gergelim torrado e sirva gelado.\n💡 Dica: torre o gergelim numa frigideira seca por 1 minuto — o aroma fica muito mais intenso.',
   10,4,'easy','["vegetariano","vegano","sem_lactose"]'::jsonb,'["soja","gluten"]'::jsonb,'asiatica','community'),

  ('comm-89','Sopa oriental de macarrão',
   '[{"name":"Macarrão","canonicalId":"macarrao"},{"name":"Ovo","canonicalId":"ovo"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Shoyu","canonicalId":"shoyu"},{"name":"Cebolinha","canonicalId":"cebolinha"}]'::jsonb,
   E'1. Ferva 1 litro de água com 2 colheres de shoyu e um pouco de alho e gengibre, se tiver, formando um caldo.\n2. Junte a cenoura em tiras finas e cozinhe 3 minutos.\n3. Adicione o macarrão e cozinhe conforme a embalagem, até ficar al dente.\n4. Cozinhe os ovos à parte (6 a 7 minutos para gema cremosa), descasque e corte ao meio.\n5. Sirva a sopa em tigelas com o ovo por cima e bastante cebolinha picada.\n💡 Dica: não cozinhe o macarrão direto no caldo por muito tempo — ele solta amido e deixa a sopa turva.',
   25,4,'easy','["vegetariano"]'::jsonb,'["gluten","ovo","soja"]'::jsonb,'asiatica','community'),

  -- ===== INDIANA =====
  ('comm-90','Arroz com curry e ervilha',
   '[{"name":"Arroz","canonicalId":"arroz"},{"name":"Curry","canonicalId":"curry"},{"name":"Ervilha","canonicalId":"ervilha"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Leite de Coco","canonicalId":"leite-coco"}]'::jsonb,
   E'1. Refogue a cebola picada em um fio de óleo até dourar. Junte 1 colher de curry e mexa por 30 segundos, até liberar o aroma (não deixe queimar).\n2. Acrescente 1 xícara de arroz e refogue 1 minuto para envolver no tempero.\n3. Cubra com 1 xícara de água e 1 xícara de leite de coco, adicione sal e a ervilha, e cozinhe tampado em fogo baixo por 15 minutos.\n4. Desligue e deixe descansar 5 minutos antes de soltar com um garfo.\n💡 Dica: fritar o curry rapidamente no óleo antes de adicionar o líquido é o que desenvolve todo o sabor das especiarias.',
   30,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'indiana','community'),

  ('comm-91','Sopa de lentilha temperada',
   '[{"name":"Lentilha","canonicalId":"lentilha"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Alho","canonicalId":"alho"},{"name":"Cenoura","canonicalId":"cenoura"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Cominho","canonicalId":"cominho"}]'::jsonb,
   E'1. Refogue a cebola, o alho e o cominho em azeite por 2 minutos, até perfumar.\n2. Junte o tomate e a cenoura picados e refogue mais 3 minutos.\n3. Adicione 1 xícara de lentilha (não precisa de molho) e cubra com 1 litro de água quente.\n4. Cozinhe em fogo médio por 25 a 30 minutos, até a lentilha desmanchar e a sopa encorpar. Acerte o sal.\n💡 Dica: um fio de limão na hora de servir ilumina o sabor terroso da lentilha.',
   45,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'indiana','community'),

  -- ===== ÁRABE =====
  ('comm-92','Mujadara (arroz com lentilha)',
   '[{"name":"Arroz","canonicalId":"arroz"},{"name":"Lentilha","canonicalId":"lentilha"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Cominho","canonicalId":"cominho"}]'::jsonb,
   E'1. Cozinhe a lentilha em água por 15 minutos, até ficar quase macia mas ainda firme; escorra.\n2. Enquanto isso, frite 2 cebolas fatiadas finas em óleo, em fogo médio, por 12 a 15 minutos, mexendo, até ficarem bem douradas e crocantes — elas são a alma do prato.\n3. Em uma panela, refogue um pouco da cebola com cominho, junte o arroz e a lentilha.\n4. Cubra com água na proporção 2 para 1, tempere com sal e cozinhe tampado em fogo baixo por 15 minutos.\n5. Sirva com a cebola caramelizada por cima.\n💡 Dica: tenha paciência com a cebola — ela precisa dourar devagar para ficar doce e crocante, sem queimar.',
   45,4,'medium','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'arabe','community'),

  ('comm-93','Wrap de frango',
   '[{"name":"Tortilla","canonicalId":"tortilla"},{"name":"Frango","canonicalId":"frango"},{"name":"Alface","canonicalId":"alface"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Requeijão","canonicalId":"requeijao"}]'::jsonb,
   E'1. Tempere o frango em tiras com sal, alho e pimenta e grelhe em fogo alto por 4 a 5 minutos, até dourar.\n2. Aqueça rapidamente a tortilla numa frigideira seca, só para ficar maleável.\n3. Espalhe o requeijão sobre a tortilla, distribua o frango, a alface rasgada e o tomate em fatias finas.\n4. Dobre as laterais e enrole apertado. Se quiser, grelhe o wrap fechado por 1 minuto de cada lado para selar.\n💡 Dica: não exagere no recheio — um wrap muito cheio se desfaz na hora de enrolar e comer.',
   15,2,'easy','[]'::jsonb,'["gluten","leite"]'::jsonb,'arabe','community'),

  -- ===== AMERICANA / MEDITERRÂNEA =====
  ('comm-94','Sopa de milho',
   '[{"name":"Milho Verde","canonicalId":"milho-verde"},{"name":"Batata","canonicalId":"batata"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Leite","canonicalId":"leite"},{"name":"Creme de Leite","canonicalId":"creme-leite"}]'::jsonb,
   E'1. Refogue a cebola picada na manteiga ou azeite por 2 minutos.\n2. Junte a batata em cubos e o milho, cubra com 1 litro de água quente e cozinhe por 15 minutos, até a batata amaciar.\n3. Bata tudo no liquidificador com o leite até ficar bem liso e, se quiser, passe por uma peneira.\n4. Volte à panela, incorpore o creme de leite em fogo baixo e aqueça sem ferver. Acerte o sal.\n💡 Dica: reserve algumas colheres de milho inteiro para jogar por cima — dá textura à sopa cremosa.',
   35,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'americana','community'),

  ('comm-95','Salada de grão-de-bico',
   '[{"name":"Grão-de-bico","canonicalId":"grao-de-bico"},{"name":"Tomate","canonicalId":"tomate"},{"name":"Pepino","canonicalId":"pepino"},{"name":"Cebola","canonicalId":"cebola"},{"name":"Azeite","canonicalId":"azeite"}]'::jsonb,
   E'1. Use grão-de-bico já cozido (ou de lata, bem escorrido e lavado).\n2. Pique o tomate, o pepino e a cebola roxa em cubinhos pequenos.\n3. Misture tudo com o grão-de-bico, regue com bastante azeite, suco de limão e sal.\n4. Deixe descansar 15 minutos para os sabores se misturarem antes de servir.\n💡 Dica: deixe a cebola picada de molho em água gelada por 10 minutos — perde o ardido sem perder a crocância.',
   15,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mediterranea','community')
on conflict (id) do update set
  title = excluded.title,
  ingredients = excluded.ingredients,
  instructions = excluded.instructions,
  prep_time = excluded.prep_time,
  servings = excluded.servings,
  difficulty = excluded.difficulty,
  tags = excluded.tags,
  allergens = excluded.allergens,
  cuisine = excluded.cuisine,
  origin = excluded.origin,
  updated_at = now();
