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
