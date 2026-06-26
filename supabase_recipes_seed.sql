-- =============================================================================
-- ShopWise — seed do catálogo de receitas da COMUNIDADE (compartilhado)
-- =============================================================================
-- Como rodar: SQL Editor → New query → cole TODO este arquivo → Run.
-- Idempotente (ON CONFLICT) — pode rodar de novo sem duplicar.
-- 95 receitas detalhadas (passo a passo + quantidade/unidade por ingrediente + porções).
-- canonicalId batem com src/data/ingredients.ts. `image` vem do supabase_recipes_images.sql.
-- =============================================================================
alter table public.recipes add column if not exists cuisine text null;
alter table public.recipes add column if not exists servings integer null;

insert into public.recipes (id, title, ingredients, instructions, prep_time, servings, difficulty, tags, allergens, cuisine, origin)
values
  ('comm-1','Strogonoff de Frango',
   '[{"name":"Frango","canonicalId":"frango","quantity":700,"unit":"g"},{"name":"Creme de Leite","canonicalId":"creme-leite","quantity":200,"unit":"ml"},{"name":"Molho de Tomate","canonicalId":"molho-tomate","quantity":4,"unit":"col. (sopa)"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"},{"name":"Cogumelo","canonicalId":"cogumelo","quantity":200,"unit":"g"}]'::jsonb,
   $RX$1. Corte o frango em cubos de aproximadamente 3 cm, tempere com sal e pimenta-do-reino a gosto. Em fogo médio-alto, doure os cubos em 2 col. (sopa) de óleo por 6 a 8 minutos, mexendo aos poucos para criar crosta dourada. Reserve.
2. Na mesma panela em fogo médio, refogue a cebola picada por 3 minutos até ficar translúcida. Adicione o alho picado e mexa por mais 1 minuto até perfumar.
3. Acrescente os cogumelos fatiados e refogue por 4 a 5 minutos até murcharem e dourar levemente.
4. Volte o frango à panela, adicione o molho de tomate e misture bem. Cozinhe em fogo médio por 5 minutos até o molho encorpar ligeiramente.
5. Reduza para fogo baixo, despeje o creme de leite e misture delicadamente. Cozinhe por mais 3 a 4 minutos sem deixar ferver para o creme não talhar. Ajuste o sal e sirva com arroz branco e batata palha.
💡 Dica: Para um Strogonoff de Frango ainda mais cremoso, use creme de leite fresco em vez de caixinha e adicione uma colher de sopa de mostarda dijon ao molho.$RX$,
   30,4,'easy','["sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),
  ('comm-2','Escondidinho de Carne',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina","quantity":500,"unit":"g"},{"name":"Batata","canonicalId":"batata","quantity":800,"unit":"g"},{"name":"Leite","canonicalId":"leite","quantity":100,"unit":"ml"},{"name":"Manteiga","canonicalId":"manteiga","quantity":3,"unit":"col. (sopa)"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Cozinhe as batatas descascadas e cortadas em pedaços em água com sal por 20 a 25 minutos até ficarem bem macias. Escorra e amasse ainda quentes com o leite aquecido e 2 col. (sopa) de manteiga até obter um purê liso. Tempere com sal e reserve.
2. Tempere a carne moída ou desfiada com sal e pimenta. Em fogo médio-alto, doure em 1 col. (sopa) de manteiga por 8 a 10 minutos, quebrando os grumos, até perder a cor rosada e começar a tostar.
3. Adicione a cebola picada à carne e refogue por 3 a 4 minutos até dourar. Ajuste o sal e pimenta. A mistura deve ficar úmida mas não encharcada.
4. Numa travessa refratária untada, espalhe metade do purê como base. Distribua toda a carne por cima de forma uniforme. Cubra com o restante do purê, alisando com uma espátula.
5. Leve ao forno preaquecido a 200 °C por 20 a 25 minutos até a superfície ficar levemente dourada. Para gratinar, ligue o grill nos últimos 5 minutos. Deixe descansar 5 minutos antes de servir.
💡 Dica: Para o Escondidinho de Carne ficar com a superfície bem dourada, pincele o purê com gema de ovo misturada com um fio de leite antes de levar ao forno.$RX$,
   50,4,'medium','["sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),
  ('comm-3','Feijoada Simples',
   '[{"name":"Feijão","canonicalId":"feijao","quantity":500,"unit":"g"},{"name":"Linguiça","canonicalId":"linguica","quantity":300,"unit":"g"},{"name":"Bacon","canonicalId":"bacon","quantity":150,"unit":"g"},{"name":"Carne Suína","canonicalId":"carne-suina","quantity":300,"unit":"g"},{"name":"Alho","canonicalId":"alho","quantity":5,"unit":"dentes"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Deixe o feijão preto de molho por no mínimo 8 horas (ou de véspera). Escorra, cubra com água fresca na pressão e cozinhe por 25 a 30 minutos após pegar pressão. Reserve o caldo.
2. Corte o bacon em cubinhos e frite em fogo médio em panela grande por 5 a 6 minutos até dourar e soltar a gordura. Na mesma gordura, doure a carne suína cortada em pedaços por 8 a 10 minutos. Reserve as carnes.
3. Doure a linguiça cortada em rodelas na mesma panela por 5 minutos. Adicione a cebola picada e refogue 3 minutos. Junte o alho amassado e mexa por 1 minuto até perfumar.
4. Volte todas as carnes à panela. Adicione o feijão cozido com seu caldo, ajustando a quantidade de água para cobrir tudo. Tempere com sal e folha de louro. Cozinhe em fogo baixo, semitampado, por 30 a 40 minutos até o caldo engrossar.
5. Retire uma concha de feijão, amasse bem e devolva à panela para ajudar a engrossar o caldo. Acerte o sal e cozinhe por mais 10 minutos até atingir a consistência desejada. Sirva com arroz, couve refogada e laranja.
💡 Dica: Para a Feijoada Simples ganhar profundidade de sabor, adicione uma folha de louro e uma pimenta dedo-de-moça inteira durante o cozimento — retire antes de servir.$RX$,
   90,6,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-4','Moqueca de Peixe',
   '[{"name":"Peixe","canonicalId":"peixe","quantity":700,"unit":"g"},{"name":"Leite de Coco","canonicalId":"leite-coco","quantity":200,"unit":"ml"},{"name":"Tomate","canonicalId":"tomate","quantity":3,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Pimentão","canonicalId":"pimentao","quantity":1,"unit":"un"},{"name":"Coentro","canonicalId":"coentro","quantity":1,"unit":"a gosto"}]'::jsonb,
   $RX$1. Corte o peixe (robalo ou badejo) em postas de 3 a 4 cm. Tempere com suco de limão, sal e pimenta-do-reino e deixe marinar por 15 minutos enquanto prepara os demais ingredientes.
2. Em uma panela de barro ou panela larga, aqueça 2 col. (sopa) de azeite em fogo médio. Refogue a cebola em rodelas por 3 minutos, adicione o pimentão em tiras e cozinhe por mais 2 minutos.
3. Distribua as rodelas de tomate sobre o refogado. Coloque as postas de peixe por cima e tempere novamente com sal. Não misture — deixe as camadas se formarem.
4. Despeje o leite de coco sobre tudo e tampe a panela. Cozinhe em fogo médio-baixo por 15 a 18 minutos. O peixe está no ponto quando desfia facilmente ao toque do garfo e o caldo estiver levemente espesso.
5. Abra a tampa, verifique o sal e finalize com coentro fresco picado. Sirva diretamente na panela acompanhado de arroz branco e pirão.
💡 Dica: Para a Moqueca de Peixe ter o sabor baiano autêntico, adicione 1 col. (sopa) de azeite de dendê junto com o leite de coco — ele dá cor e aroma característicos ao prato.$RX$,
   40,4,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-5','Bobó de Camarão',
   '[{"name":"Camarão","canonicalId":"camarao","quantity":500,"unit":"g"},{"name":"Mandioca","canonicalId":"mandioca","quantity":600,"unit":"g"},{"name":"Leite de Coco","canonicalId":"leite-coco","quantity":200,"unit":"ml"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":4,"unit":"dentes"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"}]'::jsonb,
   $RX$1. Cozinhe a mandioca descascada e cortada em pedaços em água com sal por 25 a 30 minutos até ficar bem macia. Escorra, retire os fios centrais e bata no liquidificador com 100 ml de leite de coco até obter um creme espesso. Reserve.
2. Tempere os camarões limpos com sal, pimenta e suco de limão. Em fogo alto, refogue-os em 1 col. (sopa) de azeite por 2 a 3 minutos apenas, até ficarem rosados e firmes — não cozinhe demais. Reserve.
3. Na mesma panela em fogo médio, refogue a cebola picada por 3 minutos. Adicione o alho picado e o tomate sem sementes cortado em cubos, cozinhando por 4 a 5 minutos até o tomate desmanchar.
4. Adicione o creme de mandioca ao refogado e mexa bem. Despeje o restante do leite de coco e cozinhe em fogo médio por 5 a 6 minutos, mexendo sempre, até o creme ficar homogêneo e levemente borbulhante.
5. Incorpore os camarões reservados ao creme, misture delicadamente e cozinhe por mais 2 minutos apenas para aquecer. Acerte o sal, finalize com coentro ou salsinha e sirva com arroz branco.
💡 Dica: Para o Bobó de Camarão ter uma textura perfeita, o creme de mandioca não deve ficar nem muito ralo nem muito firme — ajuste com água do cozimento da mandioca até obter a consistência de um mingau encorpado.$RX$,
   45,4,'medium','["sem_gluten","sem_lactose"]'::jsonb,'["frutos_do_mar"]'::jsonb,'brasileira','community'),
  ('comm-6','Baião de Dois',
   '[{"name":"Arroz","canonicalId":"arroz","quantity":2,"unit":"xíc."},{"name":"Feijão","canonicalId":"feijao","quantity":1,"unit":"xíc."},{"name":"Linguiça","canonicalId":"linguica","quantity":200,"unit":"g"},{"name":"Queijo","canonicalId":"queijo","quantity":150,"unit":"g"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Cozinhe o feijão-verde ou feijão-de-corda em água com sal por 20 a 25 minutos (ou use feijão-de-corda enlatado já cozido, escorrido). Reserve com um pouco do caldo.
2. Corte a linguiça em rodelas e frite em fogo médio em panela funda por 5 a 6 minutos até dourar. Retire e deixe parte da gordura na panela.
3. Refogue a cebola picada na gordura da linguiça por 3 minutos. Adicione o arroz lavado e escorrido, refogando por 2 minutos para selar os grãos.
4. Adicione o feijão escorrido e misture. Junte água quente suficiente para cobrir (cerca de 3 xíc.), tampe e cozinhe em fogo médio-baixo por 12 a 15 minutos até o arroz absorver o líquido e ficar soltinho.
5. Desligue o fogo, acrescente a linguiça, o queijo coalho ou queijo meia-cura cortado em cubinhos e misture levemente para o queijo derreter no calor residual. Acerte o sal e sirva imediatamente.
💡 Dica: O Baião de Dois fica mais saboroso quando feito com feijão-de-corda fresco — se usar o seco, deixe de molho por 8 horas para cozinhar por igual junto com o arroz.$RX$,
   40,4,'easy','["sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),
  ('comm-7','Galinhada',
   '[{"name":"Frango","canonicalId":"frango","quantity":1,"unit":"kg"},{"name":"Arroz","canonicalId":"arroz","quantity":2,"unit":"xíc."},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":4,"unit":"dentes"},{"name":"Cenoura","canonicalId":"cenoura","quantity":2,"unit":"un"},{"name":"Ervilha","canonicalId":"ervilha","quantity":1,"unit":"xíc."}]'::jsonb,
   $RX$1. Tempere os pedaços de frango com sal, pimenta-do-reino, alho amassado e açafrão-da-terra (cúrcuma) — use 1 col. (chá) para dar a cor amarela característica. Deixe marinar por 15 minutos.
2. Em fogo médio-alto, doure os pedaços de frango em 2 col. (sopa) de óleo por 8 a 10 minutos de cada lado, até criar crosta dourada. Retire e reserve.
3. Na mesma panela em fogo médio, refogue a cebola picada por 3 minutos. Adicione o alho picado e a cenoura cortada em cubinhos e refogue por mais 3 minutos.
4. Adicione o arroz lavado e mexa por 2 minutos para fritar levemente. Volte o frango para a panela e adicione água quente suficiente para cobrir tudo (cerca de 4 xíc.), temperando com sal.
5. Tampe e cozinhe em fogo médio-baixo por 20 a 25 minutos, até o arroz absorver o líquido e o frango estar cozido e macio. Nos últimos 5 minutos, adicione a ervilha. Solte o arroz com um garfo e sirva com salada.
💡 Dica: Para a Galinhada ficar mais aromática, adicione 1 col. (chá) de colorau (urucum) junto com o açafrão-da-terra — isso intensifica a cor e acrescenta um leve toque defumado.$RX$,
   50,4,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-8','Bife à Parmegiana',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina","quantity":600,"unit":"g"},{"name":"Ovo","canonicalId":"ovo","quantity":2,"unit":"un"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo","quantity":1,"unit":"xíc."},{"name":"Molho de Tomate","canonicalId":"molho-tomate","quantity":200,"unit":"ml"},{"name":"Queijo","canonicalId":"queijo","quantity":200,"unit":"g"}]'::jsonb,
   $RX$1. Corte a carne bovina (patinho ou contrafilé) em bifes de 1,5 cm. Bata com o martelo de carne até afinarem para cerca de 8 mm. Tempere com sal, pimenta-do-reino e alho a gosto dos dois lados.
2. Passe cada bife na farinha de trigo, depois no ovo batido temperado com sal, e por fim em farinha de rosca (ou farinha de trigo novamente). Pressione para empanar bem.
3. Em fogo médio-alto, frite os bifes empanados em óleo abundante quente (180 °C) por 3 a 4 minutos de cada lado até ficarem dourados e crocantes. Escorra em papel-toalha.
4. Disponha os bifes fritos em assadeira. Cubra cada um com 2 col. (sopa) de molho de tomate aquecido e rale generosamente o queijo muçarela ou parmesão por cima.
5. Leve ao forno preaquecido a 200 °C por 8 a 10 minutos, ou até o queijo derreter completamente e começar a dourar nas bordas. Sirva imediatamente com arroz, macarrão ao alho e óleo ou purê de batata.
💡 Dica: Para o Bife à Parmegiana ficar crocante mesmo depois de ir ao forno, frite os bifes bem secos e evite colocar molho em excesso — o segredo é apenas cobrir a superfície, sem encharcar o empanado.$RX$,
   35,4,'medium','[]'::jsonb,'["gluten","ovo","leite"]'::jsonb,'brasileira','community'),
  ('comm-9','Fricassê de Frango',
   '[{"name":"Frango","canonicalId":"frango","quantity":600,"unit":"g"},{"name":"Creme de Leite","canonicalId":"creme-leite","quantity":200,"unit":"ml"},{"name":"Milho Verde","canonicalId":"milho-verde","quantity":1,"unit":"xíc."},{"name":"Queijo","canonicalId":"queijo","quantity":150,"unit":"g"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Cozinhe os filés de frango em água com sal, louro e cebola por 20 a 25 minutos até ficarem macios. Retire, deixe esfriar um pouco e desfie em tiras. Reserve 1 xíc. do caldo do cozimento.
2. Em fogo médio, refogue a cebola picada em 1 col. (sopa) de manteiga ou azeite por 3 a 4 minutos até dourar. Adicione o frango desfiado e misture bem por 2 minutos.
3. Despeje o caldo reservado e o milho verde (se usar milho de lata, escorra bem antes). Cozinhe por 5 minutos em fogo médio até reduzir levemente.
4. Adicione o creme de leite, misture com cuidado e aqueça em fogo baixo por 3 minutos sem deixar ferver. Ajuste o sal.
5. Transfira para uma travessa refratária, espalhe o queijo muçarela ralado por cima e leve ao forno a 200 °C por 10 a 12 minutos até o queijo derreter e dourar. Sirva com arroz branco ou pão de forma.
💡 Dica: Para o Fricassê de Frango ficar mais cremoso e com sabor apurado, adicione 1 col. (sopa) de mostarda e uma pitada de noz-moscada junto com o creme de leite.$RX$,
   35,4,'easy','["sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),
  ('comm-10','Bife Acebolado',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina","quantity":600,"unit":"g"},{"name":"Cebola","canonicalId":"cebola","quantity":3,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"},{"name":"Óleo","canonicalId":"oleo","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Corte os bifes de contrafilé ou alcatra com 1,5 cm de espessura. Tempere com sal grosso e pimenta-do-reino generosamente nos dois lados. Amasse o alho e esfregue nos bifes. Deixe descansar 10 minutos em temperatura ambiente.
2. Aqueça uma frigideira de ferro ou antiaderente grossa em fogo alto até ficar bem quente — quase fumegando. Adicione o óleo e espere 30 segundos.
3. Coloque os bifes na frigideira sem sobrepor. Sele por 3 a 4 minutos sem mexer, até formar crosta escura dourada. Vire e cozinhe por mais 2 a 3 minutos para ponto ao ponto, ou 4 minutos para bem passado.
4. Retire os bifes e reserve em prato aquecido. Na mesma frigideira em fogo médio, adicione a cebola cortada em rodelas grossas. Refogue por 6 a 8 minutos, mexendo, até caramelizar e ficar bem dourada. Tempere com sal.
5. Sirva os bifes cobertos com a cebola caramelizada e acompanhados de arroz, feijão e farofa.
💡 Dica: Para o Bife Acebolado perfeito, jamais use garfo para virar a carne — use uma pinça ou espátula para não perder os sucos internos que garantem a maciez.$RX$,
   20,4,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-11','Polenta Cremosa',
   '[{"name":"Fubá","canonicalId":"fuba","quantity":1,"unit":"xíc."},{"name":"Queijo","canonicalId":"queijo","quantity":100,"unit":"g"},{"name":"Manteiga","canonicalId":"manteiga","quantity":2,"unit":"col. (sopa)"},{"name":"Leite","canonicalId":"leite","quantity":500,"unit":"ml"}]'::jsonb,
   $RX$1. Em uma tigela, dissolva o fubá em 200 ml de leite frio, mexendo com um fouet até não restar grumos. Isso evita que se formem pelotas ao cozinhar.
2. Aqueça os 300 ml restantes de leite com 1 col. (chá) de sal em panela de fundo grosso em fogo médio. Quando começar a ferver, abaixe para fogo médio-baixo.
3. Despeje a mistura de fubá aos poucos sobre o leite quente, mexendo continuamente com o fouet ou colher de pau para não empelotar.
4. Cozinhe por 15 a 18 minutos em fogo baixo, mexendo sempre, até a polenta desprender do fundo da panela e ficar com textura cremosa e encorpada. Ela está no ponto quando cai lentamente da colher.
5. Desligue o fogo, incorpore a manteiga e o queijo parmesão ou queijo meia-cura ralado, misturando vigorosamente até derreter por completo. Acerte o sal e sirva imediatamente — a polenta endurece conforme esfria.
💡 Dica: Para a Polenta Cremosa não endurecer rápido na travessa, sirva em prato aquecido e cubra com o acompanhamento logo em seguida — o calor do molho mantém a textura aveludada por mais tempo.$RX$,
   25,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),
  ('comm-12','Caldo Verde',
   '[{"name":"Batata","canonicalId":"batata","quantity":600,"unit":"g"},{"name":"Linguiça","canonicalId":"linguica","quantity":200,"unit":"g"},{"name":"Couve","canonicalId":"couve","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Descasque as batatas, corte em cubos e cozinhe em 1,5 L de água com sal por 20 a 25 minutos até ficarem bem macias. Bata com mixer diretamente na panela ou transfira para o liquidificador com o caldo para obter um caldo espesso e homogêneo.
2. Frite a linguiça calabresa cortada em rodelas finas em fogo médio, sem óleo, por 5 a 6 minutos até dourar. Reserve.
3. Em fogo médio, refogue a cebola picada em 1 col. (sopa) de azeite por 3 minutos. Adicione o alho amassado e refogue 1 minuto.
4. Adicione o refogado ao caldo de batata na panela. Ajuste a consistência com água quente se necessário. Cozinhe em fogo médio por 5 a 8 minutos, mexendo para não grudar no fundo. Acerte o sal.
5. Corte a couve em tiras bem finas (chiffonade). Adicione ao caldo nos últimos 2 a 3 minutos apenas para murchar e manter a cor verde vibrante. Distribua nas tigelas e finalize com as rodelas de linguiça.
💡 Dica: Para o Caldo Verde ficar com um verde bonito e vivo, não cozinhe a couve por mais de 3 minutos — o calor excessivo escurece as folhas e elimina boa parte dos nutrientes.$RX$,
   40,4,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-13','Canja de Galinha',
   '[{"name":"Frango","canonicalId":"frango","quantity":700,"unit":"g"},{"name":"Arroz","canonicalId":"arroz","quantity":1,"unit":"xíc."},{"name":"Cenoura","canonicalId":"cenoura","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"}]'::jsonb,
   $RX$1. Em panela grande, cubra os pedaços de frango (carcaça, peito e coxa) com 2 L de água fria. Adicione a cebola cortada ao meio, o alho levemente amassado, a cenoura cortada em rodelas, sal e folha de louro. Leve a fogo alto.
2. Quando ferver, reduza para fogo médio-baixo e cozinhe por 35 a 40 minutos, retirando a espuma que se forma nos primeiros minutos com uma escumadeira para obter um caldo limpo.
3. Retire o frango e deixe esfriar um pouco. Separe a carne desfiando em pedaços médios, descartando pele e ossos. Coe o caldo e volte à panela.
4. Leve o caldo ao fogo médio, adicione o arroz lavado e as cenouras cozidas reservadas. Cozinhe por 15 a 18 minutos até o arroz estar macio e a canja ter a consistência de sopa encorpada.
5. Adicione o frango desfiado, acerte o sal e cozinhe por mais 3 minutos. Finalize com salsinha picada e sirva bem quente.
💡 Dica: Para a Canja de Galinha ficar mais nutritiva e com sabor mais profundo, use carcaça de frango junto com os pedaços — ela libera colágeno e dá uma consistência aveludada ao caldo.$RX$,
   50,4,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-14','Farofa de Bacon',
   '[{"name":"Farinha de Mandioca","canonicalId":"farinha-mandioca","quantity":2,"unit":"xíc."},{"name":"Bacon","canonicalId":"bacon","quantity":150,"unit":"g"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Ovo","canonicalId":"ovo","quantity":2,"unit":"un"}]'::jsonb,
   $RX$1. Corte o bacon em cubinhos pequenos. Em fogo médio, frite em frigideira seca (sem óleo) por 5 a 6 minutos, mexendo, até dourar e ficar crocante. Retire com escumadeira e reserve, mantendo a gordura na frigideira.
2. Na gordura do bacon, refogue a cebola picada em fogo médio por 3 a 4 minutos até ficar dourada e levemente caramelizada.
3. Empurre a cebola para as bordas da frigideira, quebre os ovos no centro e mexa rapidamente para fazer um mexido bem soltinho por 1 a 2 minutos. Misture tudo.
4. Adicione a farinha de mandioca torrada (ou crua) de uma vez. Mexa em fogo baixo por 3 a 4 minutos, incorporando bem ao refogado até a farinha tostar levemente e absorver a gordura sem queimar.
5. Acrescente o bacon crocante, misture, acerte o sal e a pimenta. A farofa está pronta quando ficar soltinha, úmida e com cor levemente dourada. Sirva como acompanhamento de churrasco, feijoada ou aves.
💡 Dica: Para a Farofa de Bacon ficar mais saborosa, use farinha de mandioca crua d'água — ela absorve melhor a gordura e fica com textura mais crocante do que a farinha temperada industrializada.$RX$,
   20,4,'easy','["sem_gluten"]'::jsonb,'["ovo"]'::jsonb,'brasileira','community'),
  ('comm-15','Vinagrete',
   '[{"name":"Tomate","canonicalId":"tomate","quantity":4,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Pimentão","canonicalId":"pimentao","quantity":1,"unit":"un"},{"name":"Vinagre","canonicalId":"vinagre","quantity":3,"unit":"col. (sopa)"},{"name":"Azeite","canonicalId":"azeite","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Lave bem os tomates, a cebola e o pimentão. Corte os tomates ao meio, retire as sementes e corte em cubinhos de cerca de 1 cm. Evite sementes para o vinagrete não ficar aguado.
2. Corte a cebola em cubinhos do mesmo tamanho do tomate. Se preferir sabor mais suave, deixe de molho em água gelada por 10 minutos antes de usar.
3. Corte o pimentão (vermelho ou verde) em cubinhos, retirando sementes e parte branca interna.
4. Misture todos os vegetais em uma tigela funda. Adicione o vinagre de álcool ou vinagre de vinho, o azeite, sal e pimenta-do-reino a gosto. Misture bem com colher.
5. Prove e ajuste o equilíbrio entre ácido e gordura. Deixe descansar na geladeira por pelo menos 10 minutos antes de servir para os sabores se integrarem. Finalize com salsinha picada se desejar.
💡 Dica: O Vinagrete fica muito mais saboroso preparado com antecedência — deixe descansar por 30 minutos na geladeira para os legumes absorverem o tempero e os sabores se intensificarem.$RX$,
   15,6,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-16','Brigadeiro',
   '[{"name":"Leite Condensado","canonicalId":"leite-condensado","quantity":1,"unit":"un"},{"name":"Achocolatado","canonicalId":"achocolatado","quantity":4,"unit":"col. (sopa)"},{"name":"Manteiga","canonicalId":"manteiga","quantity":1,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Em panela antiaderente de fundo grosso, misture o leite condensado, o achocolatado em pó e a manteiga com uma espátula ou colher de pau antes de levar ao fogo.
2. Leve ao fogo médio-baixo, mexendo sempre com movimentos circulares do fundo da panela para não grudar e queimar.
3. Cozinhe por 10 a 12 minutos sem parar de mexer. O brigadeiro está no ponto quando a mistura desgruda do fundo da panela formando uma massa que se solta limpa, e ao inclinar a panela ela demora a escorrer.
4. Despeje em prato untado com manteiga e deixe esfriar completamente em temperatura ambiente por 20 a 30 minutos antes de enrolar — não coloque na geladeira quente.
5. Unte as mãos com manteiga e enrole porções de 15 g em bolinhas. Passe no granulado de chocolate e coloque em forminhas de papel. Rende cerca de 25 unidades.
💡 Dica: Para o Brigadeiro ficar com textura ideal para enrolar — nem mole demais, nem ressecado — o ponto certo é quando você consegue ver o fundo da panela por 3 segundos ao raspar com a espátula.$RX$,
   25,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),
  ('comm-17','Pudim de Leite',
   '[{"name":"Leite Condensado","canonicalId":"leite-condensado","quantity":1,"unit":"un"},{"name":"Leite","canonicalId":"leite","quantity":1,"unit":"xíc."},{"name":"Ovo","canonicalId":"ovo","quantity":3,"unit":"un"},{"name":"Açúcar","canonicalId":"acucar","quantity":1,"unit":"xíc."}]'::jsonb,
   $RX$1. Prepare a calda: derreta 1 xíc. de açúcar em fogo médio em panelinha, sem mexer, até caramelizar em cor âmbar escura. Despeje imediatamente na forma de pudim untada, inclinando para cobrir o fundo e as laterais. Cuidado: o caramelo fica extremamente quente.
2. Bata no liquidificador o leite condensado, o leite e os ovos inteiros por 2 a 3 minutos até obter uma mistura completamente lisa e homogênea. Se tiver bolhas, passe por peneira.
3. Despeje a mistura cuidadosamente sobre o caramelo endurecido na forma. Cubra com papel-alumínio.
4. Leve ao forno em banho-maria: coloque a forma dentro de uma assadeira maior com água quente até a metade da altura da forma. Asse a 180 °C por 50 a 60 minutos. O pudim está pronto quando, ao agitar levemente, o centro treme pouco mas as bordas estão firmes.
5. Retire do forno, deixe esfriar em temperatura ambiente e leve à geladeira por no mínimo 4 horas (ou de véspera). Para desenformar, passe uma faca nas bordas, cubra com prato fundo e vire com um movimento rápido e firme.
💡 Dica: Para o Pudim de Leite ficar sem bolhas e com textura de seda, passe a mistura batida por uma peneira fina antes de colocar na forma — isso elimina as bolhas de ar incorporadas durante a batedura.$RX$,
   80,6,'medium','["vegetariano","sem_gluten"]'::jsonb,'["leite","ovo"]'::jsonb,'brasileira','community'),
  ('comm-18','Bolo de Cenoura',
   '[{"name":"Cenoura","canonicalId":"cenoura","quantity":3,"unit":"un"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo","quantity":2,"unit":"xíc."},{"name":"Ovo","canonicalId":"ovo","quantity":3,"unit":"un"},{"name":"Açúcar","canonicalId":"acucar","quantity":2,"unit":"xíc."},{"name":"Óleo","canonicalId":"oleo","quantity":1,"unit":"xíc."}]'::jsonb,
   $RX$1. Preaqueça o forno a 180 °C. Unte e enfarinhe uma forma redonda de 22 cm. Descasque as cenouras e corte em pedaços grosseiros.
2. No liquidificador, bata as cenouras, os ovos e o óleo por 3 a 4 minutos até obter uma mistura completamente lisa e de cor laranja vibrante. Quanto mais lisa, mais uniforme ficará o bolo.
3. Transfira para uma tigela grande. Adicione o açúcar e misture com fouet. Peneire a farinha de trigo e o fermento em pó (1 col. sopa) e incorpore com movimentos delicados de baixo para cima para não perder o ar.
4. Despeje a massa na forma preparada. Leve ao forno por 35 a 40 minutos. Teste com palito: inserido no centro, deve sair limpo e seco. Não abra o forno antes de 30 minutos.
5. Deixe esfriar por 10 minutos na forma, desenforme e finalize com cobertura de chocolate: derreta 1 tablete de chocolate meio amargo com 1 col. (sopa) de manteiga em banho-maria e despeje sobre o bolo ainda morno.
💡 Dica: Para o Bolo de Cenoura não murchar ao sair do forno, abaixe a temperatura para 160 °C nos últimos 10 minutos de forno e evite abrir a porta antes de o palito sair limpo.$RX$,
   50,8,'easy','["vegetariano"]'::jsonb,'["ovo","gluten"]'::jsonb,'brasileira','community'),
  ('comm-19','Bolo de Fubá',
   '[{"name":"Fubá","canonicalId":"fuba","quantity":1,"unit":"xíc."},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo","quantity":1,"unit":"xíc."},{"name":"Ovo","canonicalId":"ovo","quantity":3,"unit":"un"},{"name":"Açúcar","canonicalId":"acucar","quantity":1,"unit":"xíc."},{"name":"Leite","canonicalId":"leite","quantity":1,"unit":"xíc."}]'::jsonb,
   $RX$1. Preaqueça o forno a 180 °C. Unte e enfarinhe uma forma de bolo inglês ou forma redonda de 22 cm. Separe os ovos em claras e gemas.
2. Na batedeira, bata as gemas com o açúcar e o óleo (ou manteiga derretida, 100 ml) até obter um creme claro e fofo, por cerca de 5 minutos em velocidade média-alta.
3. Reduza a velocidade e alterne adicionando o leite morno e a mistura de fubá com a farinha de trigo já peneirados juntos, começando e terminando com os secos. Adicione 1 col. (sopa) de fermento em pó ao final e misture levemente.
4. Em tigela limpa, bata as claras em neve firme. Incorpore à massa em 3 adições, com movimentos delicados de baixo para cima, para não perder o volume e garantir a leveza do bolo.
5. Despeje na forma e leve ao forno por 40 a 45 minutos até dourar bem e o palito sair limpo. Deixe esfriar 15 minutos antes de desenformar. Sirva puro ou polvilhado com açúcar de confeiteiro.
💡 Dica: Para o Bolo de Fubá ficar mais úmido e com aquele sabor caipira autêntico, substitua metade do leite por suco de laranja espremido na hora — a acidez realça o sabor do milho e mantém a massa mais macia.$RX$,
   55,8,'easy','["vegetariano"]'::jsonb,'["ovo","gluten","leite"]'::jsonb,'brasileira','community'),
  ('comm-20','Arroz Doce',
   '[{"name":"Arroz","canonicalId":"arroz","quantity":2,"unit":"xíc."},{"name":"Leite","canonicalId":"leite","quantity":1,"unit":"L"},{"name":"Açúcar","canonicalId":"acucar","quantity":6,"unit":"col. (sopa)"},{"name":"Canela","canonicalId":"canela","quantity":1,"unit":"col. (chá)"}]'::jsonb,
   $RX$1. Lave o arroz em água corrente e escorra. Em uma panela média, coloque o arroz com 500 ml de água e leve ao fogo médio. Cozinhe por cerca de 10 minutos, até a água secar quase completamente.
2. Adicione o leite quente ao arroz, mexa bem e reduza o fogo para baixo. Cozinhe mexendo de vez em quando por 20 a 25 minutos, até o arroz estar bem macio e o creme engrossar.
3. Acrescente o açúcar, misture bem e cozinhe por mais 5 minutos em fogo baixo, mexendo sempre para não grudar no fundo.
4. Distribua em taças ou em um refratário e polvilhe a canela por cima.
5. Sirva morno ou leve à geladeira por pelo menos 1 hora para servir gelado.
💡 Dica: Adicione raspas de limão junto com o açúcar para um aroma extra e menos enjoativo.$RX$,
   40,6,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),
  ('comm-21','Mousse de Chocolate',
   '[{"name":"Chocolate","canonicalId":"chocolate","quantity":200,"unit":"g"},{"name":"Creme de Leite","canonicalId":"creme-leite","quantity":200,"unit":"ml"},{"name":"Leite Condensado","canonicalId":"leite-condensado","quantity":395,"unit":"g"},{"name":"Ovo","canonicalId":"ovo","quantity":3,"unit":"un"}]'::jsonb,
   $RX$1. Derreta o chocolate em banho-maria ou no micro-ondas em intervalos de 30 segundos, mexendo entre cada intervalo, até ficar completamente liso. Reserve e deixe esfriar levemente.
2. Separe as gemas das claras. Bata as claras em neve firme com uma pitada de sal e reserve.
3. Misture o chocolate derretido com o leite condensado e o creme de leite até obter um creme homogêneo. Incorpore as gemas uma a uma, mexendo bem.
4. Adicione as claras em neve ao creme de chocolate em três partes, incorporando com movimentos delicados de baixo para cima para não perder o volume.
5. Distribua em taças individuais ou em uma travessa e leve à geladeira por mínimo 3 horas antes de servir.
💡 Dica: Use chocolate meio amargo 70% cacau para uma mousse menos doce e com sabor mais intenso.$RX$,
   30,6,'medium','["vegetariano"]'::jsonb,'["leite","ovo"]'::jsonb,'brasileira','community'),
  ('comm-22','Sorvete de Banana (Nice Cream)',
   '[{"name":"Banana","canonicalId":"banana","quantity":4,"unit":"un"},{"name":"Pasta de Amendoim","canonicalId":"pasta-amendoim","quantity":2,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Descasque as bananas, corte em rodelas e leve ao freezer em um recipiente fechado por pelo menos 4 horas ou até congelarem completamente.
2. Retire as bananas do freezer e deixe descansar por 2 a 3 minutos na bancada para facilitar o processamento.
3. Coloque as rodelas de banana congeladas no processador ou liquidificador potente e processe, raspando as laterais quando necessário, até obter uma consistência cremosa semelhante a sorvete.
4. Adicione a pasta de amendoim e processe por mais 30 segundos até incorporar completamente.
5. Sirva imediatamente para textura mais cremosa ou leve ao freezer por mais 30 minutos para uma consistência mais firme.
💡 Dica: Finalize com granola crocante ou cacau em pó para uma apresentação especial.$RX$,
   10,2,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'["amendoim"]'::jsonb,'brasileira','community'),
  ('comm-23','Salada de Frutas',
   '[{"name":"Banana","canonicalId":"banana","quantity":2,"unit":"un"},{"name":"Maçã","canonicalId":"maca","quantity":2,"unit":"un"},{"name":"Laranja","canonicalId":"laranja","quantity":2,"unit":"un"},{"name":"Uva","canonicalId":"uva","quantity":200,"unit":"g"},{"name":"Mamão","canonicalId":"mamao","quantity":300,"unit":"g"}]'::jsonb,
   $RX$1. Esprema o suco de 1 laranja e reserve para temperar a salada e evitar oxidação das frutas.
2. Descasque e corte a banana em rodelas, a maçã em cubos (com ou sem casca), a outra laranja em gomos sem a membrana branca e o mamão em cubos.
3. Lave as uvas, retire os cabinhos e, se preferir, corte ao meio para facilitar o consumo.
4. Em uma tigela grande, misture todas as frutas cortadas, regue com o suco de laranja reservado e misture delicadamente.
5. Leve à geladeira por 15 a 20 minutos antes de servir para que os sabores se integrem.
💡 Dica: Adicione hortelã fresca picada na hora de servir para um toque refrescante.$RX$,
   15,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-24','Macarrão à Carbonara',
   '[{"name":"Macarrão","canonicalId":"macarrao","quantity":400,"unit":"g"},{"name":"Ovo","canonicalId":"ovo","quantity":4,"unit":"un"},{"name":"Bacon","canonicalId":"bacon","quantity":200,"unit":"g"},{"name":"Queijo","canonicalId":"queijo","quantity":100,"unit":"g"}]'::jsonb,
   $RX$1. Cozinhe o macarrão em água abundante com sal até ficar al dente. Reserve 1 xíc. da água do cozimento antes de escorrer.
2. Enquanto o macarrão cozinha, corte o bacon em cubinhos ou tirinhas e frite em fogo médio-alto por 5 a 7 minutos sem óleo até dourar e ficar crocante. Reserve com a gordura da frigideira.
3. Em uma tigela, bata as gemas (reserve as claras para outro uso) com o queijo ralado finamente, sal, pimenta-do-reino a gosto e 2 col. (sopa) da água do macarrão. Misture bem até formar um creme.
4. Escorra o macarrão al dente e transfira imediatamente para a frigideira com o bacon ainda quente (fogo desligado). Misture bem para o macarrão absorver a gordura.
5. Adicione o creme de ovos e queijo, misturando rapidamente com a frigideira fora do fogo — o calor residual cozinha as gemas sem scramble. Se necessário, adicione água do cozimento aos poucos para atingir a cremosidade desejada.
💡 Dica: Nunca adicione o creme com a frigideira no fogo para evitar que os ovos coagulem e virem omelete.$RX$,
   30,4,'medium','[]'::jsonb,'["gluten","ovo","leite"]'::jsonb,'italiana','community'),
  ('comm-25','Espaguete à Bolonhesa',
   '[{"name":"Macarrão","canonicalId":"macarrao","quantity":400,"unit":"g"},{"name":"Carne Bovina","canonicalId":"carne-bovina","quantity":500,"unit":"g"},{"name":"Molho de Tomate","canonicalId":"molho-tomate","quantity":400,"unit":"ml"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"}]'::jsonb,
   $RX$1. Pique a cebola em cubos pequenos e o alho finamente. Em fogo médio-alto, refogue a cebola em fio de azeite por 3 minutos até amolecer, adicione o alho e refogue por mais 1 minuto.
2. Adicione a carne moída e cozinhe por 8 a 10 minutos, mexendo e desmanchando os grumos, até dourar bem e perder toda a coloração rosada.
3. Tempere com sal e pimenta a gosto, acrescente o molho de tomate, reduza o fogo para médio-baixo e cozinhe tampado por 20 minutos, mexendo ocasionalmente, até o molho encorpar.
4. Enquanto o molho cozinha, cozinhe o espaguete em água abundante com sal seguindo o tempo indicado na embalagem para al dente.
5. Escorra o macarrão, transfira para o molho e misture bem por 1 minuto no fogo baixo para o macarrão absorver os sabores. Sirva com queijo ralado a gosto.
💡 Dica: Para um molho mais encorpado, adicione 1 col. (sopa) de extrato de tomate junto com o molho.$RX$,
   45,4,'easy','[]'::jsonb,'["gluten"]'::jsonb,'italiana','community'),
  ('comm-26','Lasanha à Bolonhesa',
   '[{"name":"Macarrão","canonicalId":"macarrao","quantity":500,"unit":"g"},{"name":"Carne Bovina","canonicalId":"carne-bovina","quantity":500,"unit":"g"},{"name":"Molho de Tomate","canonicalId":"molho-tomate","quantity":400,"unit":"ml"},{"name":"Presunto","canonicalId":"presunto","quantity":200,"unit":"g"},{"name":"Queijo","canonicalId":"queijo","quantity":300,"unit":"g"}]'::jsonb,
   $RX$1. Prepare o molho bolonhesa: refogue cebola e alho picados em azeite, adicione a carne moída e doure por 10 minutos. Acrescente o molho de tomate, tempere com sal, pimenta e uma pitada de noz-moscada. Cozinhe em fogo baixo por 20 minutos.
2. Prepare um molho branco (bechamel) numa panela à parte: derreta 3 col. (sopa) de manteiga, adicione 3 col. (sopa) de farinha de trigo e mexa por 2 minutos. Acrescente 500 ml de leite morno aos poucos, mexendo sem parar até engrossar. Tempere com sal e noz-moscada.
3. Cozinhe as placas de macarrão para lasanha em água salgada por 5 minutos (ou use as folhas para forno próprias). Escorra e reserve sobre um pano úmido.
4. Em um refratário grande (23x33 cm), monte as camadas: molho branco no fundo, macarrão, molho bolonhesa, presunto fatiado, queijo ralado. Repita as camadas terminando com molho branco e queijo farto.
5. Cubra com papel alumínio e leve ao forno preaquecido a 200 °C por 25 minutos. Retire o alumínio e asse por mais 10 a 15 minutos até gratinar dourado. Deixe descansar 5 minutos antes de cortar.
💡 Dica: Montar a lasanha um dia antes e assar no dia seguinte intensifica o sabor e facilita o corte.$RX$,
   60,6,'hard','[]'::jsonb,'["gluten","leite"]'::jsonb,'italiana','community'),
  ('comm-27','Nhoque ao Sugo',
   '[{"name":"Batata","canonicalId":"batata","quantity":800,"unit":"g"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo","quantity":200,"unit":"g"},{"name":"Ovo","canonicalId":"ovo","quantity":1,"unit":"un"},{"name":"Molho de Tomate","canonicalId":"molho-tomate","quantity":400,"unit":"ml"}]'::jsonb,
   $RX$1. Cozinhe as batatas com casca em água com sal por 25 a 30 minutos até ficarem bem macias. Escorra, descasque ainda quentes e passe pelo espremedor de batatas. Deixe esfriar levemente.
2. Em uma superfície enfarinhada, misture a batata espremida com o ovo, pitada de sal e a farinha aos poucos até obter uma massa que não grude nas mãos — use apenas o necessário de farinha para não endurecer o nhoque.
3. Divida a massa em porções e role cada uma sobre a superfície enfarinhada formando rolinhos de 2 cm de diâmetro. Corte em pedaços de 2 cm e risque com um garfo para criar as estrias que seguram o molho.
4. Cozinhe o nhoque em água abundante com sal em fogo alto. Assim que subirem à superfície, aguarde 30 segundos e retire com escumadeira. Reserve.
5. Aqueça o molho de tomate temperado com sal, azeite e manjericão em fogo médio por 5 minutos. Misture o nhoque cozido ao molho e sirva imediatamente com queijo ralado.
💡 Dica: Quanto menos farinha usar na massa, mais leve e macio ficará o nhoque — trabalhe a massa com delicadeza.$RX$,
   50,4,'medium','["vegetariano"]'::jsonb,'["gluten","ovo"]'::jsonb,'italiana','community'),
  ('comm-28','Penne ao Molho Branco',
   '[{"name":"Macarrão","canonicalId":"macarrao","quantity":400,"unit":"g"},{"name":"Leite","canonicalId":"leite","quantity":500,"unit":"ml"},{"name":"Manteiga","canonicalId":"manteiga","quantity":3,"unit":"col. (sopa)"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo","quantity":3,"unit":"col. (sopa)"},{"name":"Queijo","canonicalId":"queijo","quantity":100,"unit":"g"}]'::jsonb,
   $RX$1. Cozinhe o macarrão penne em água abundante com sal seguindo o tempo da embalagem para al dente. Reserve 1 xíc. da água do cozimento e escorra.
2. Em uma panela média, derreta a manteiga em fogo médio. Adicione a farinha de trigo e mexa continuamente com um fouet por 2 minutos para cozinhar a farinha sem deixar dourar (roux branco).
3. Acrescente o leite morno aos poucos, mexendo sem parar para não empelotar. Cozinhe em fogo médio-baixo por 8 a 10 minutos até o molho branco engrossar e cobrir as costas de uma colher. Tempere com sal, pimenta e noz-moscada a gosto.
4. Retire do fogo, adicione metade do queijo ralado e misture até derreter. Se o molho ficar muito espesso, afine com um pouco da água do macarrão.
5. Misture o penne escorrido ao molho branco, transfira para um refratário, cubra com o restante do queijo e gratine no forno a 220 °C por 10 minutos até dourar.
💡 Dica: Adicione uma pitada generosa de noz-moscada ao molho — ela é o segredo do molho branco clássico.$RX$,
   30,4,'easy','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'italiana','community'),
  ('comm-29','Risoto de Cogumelos',
   '[{"name":"Arroz","canonicalId":"arroz","quantity":2,"unit":"xíc."},{"name":"Cogumelo","canonicalId":"cogumelo","quantity":300,"unit":"g"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Queijo","canonicalId":"queijo","quantity":80,"unit":"g"},{"name":"Manteiga","canonicalId":"manteiga","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Aqueça 1 litro de caldo de legumes (ou água quente) em fogo baixo e mantenha-o aquecido durante todo o preparo. Pique a cebola finamente e fatie os cogumelos.
2. Em uma panela larga, derreta 2 col. (sopa) de manteiga em fogo médio. Refogue a cebola por 3 minutos até amolecer e ficar translúcida. Adicione os cogumelos e refogue por 5 minutos até dourar.
3. Acrescente o arroz arbóreo (ou arroz comum de grão curto) e mexa por 2 minutos para torrar levemente. Adicione uma concha de caldo quente e mexa até absorver. Repita esse processo concha a concha por 18 a 20 minutos até o arroz estar al dente e cremoso.
4. Retire do fogo. Acrescente a manteiga restante e o queijo parmesão ralado. Misture vigorosamente por 1 minuto para criar a cremosidade característica (mantecatura). Tempere com sal e pimenta a gosto.
5. Sirva imediatamente, pois o risoto fica mais espesso à medida que esfria. Se necessário, afine com um pouco mais de caldo quente.
💡 Dica: O segredo do risoto cremoso é o processo de adicionar o caldo aos poucos e mexer constantemente — não pule essa etapa.$RX$,
   45,4,'medium','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'italiana','community'),
  ('comm-30','Risoto de Camarão',
   '[{"name":"Arroz","canonicalId":"arroz","quantity":2,"unit":"xíc."},{"name":"Camarão","canonicalId":"camarao","quantity":500,"unit":"g"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":4,"unit":"dentes"},{"name":"Manteiga","canonicalId":"manteiga","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Tempere os camarões limpos com sal, pimenta e suco de limão. Reserve. Aqueça 1 litro de caldo de camarão ou água com sal em fogo baixo e mantenha-o quente.
2. Em uma panela larga, derreta 1 col. (sopa) de manteiga em fogo alto e salteie os camarões por 2 a 3 minutos até ficarem rosados e cozidos. Retire e reserve — não cozinhe demais para não endurecer.
3. Na mesma panela, acrescente 1 col. (sopa) de manteiga, refogue a cebola picada finamente por 3 minutos, adicione o alho picado e refogue por 1 minuto. Acrescente o arroz e toste por 2 minutos.
4. Adicione o caldo quente concha a concha, mexendo sempre e esperando absorver antes de cada adição. Repita por 18 a 20 minutos até o arroz estar al dente e cremoso.
5. Retire do fogo, incorpore a manteiga restante para cremosidade, recoloque os camarões e misture delicadamente. Acerte o sal e sirva imediatamente com salsinha picada.
💡 Dica: Use as cascas dos camarões para preparar um caldo mais saboroso — cozinhe por 15 minutos com cebola e louro.$RX$,
   40,4,'medium','["sem_gluten"]'::jsonb,'["frutos_do_mar","leite"]'::jsonb,'italiana','community'),
  ('comm-31','Pizza Margherita',
   '[{"name":"Farinha de Trigo","canonicalId":"farinha-trigo","quantity":500,"unit":"g"},{"name":"Molho de Tomate","canonicalId":"molho-tomate","quantity":300,"unit":"ml"},{"name":"Queijo","canonicalId":"queijo","quantity":250,"unit":"g"},{"name":"Manjericão","canonicalId":"manjericao","quantity":1,"unit":"a gosto"}]'::jsonb,
   $RX$1. Prepare a massa: misture a farinha com 1 col. (chá) de sal, 1 col. (chá) de fermento biológico seco, 1 col. (sopa) de azeite e 300 ml de água morna. Sove por 8 a 10 minutos até ficar lisa e elástica. Cubra e deixe descansar por 30 minutos em local aquecido.
2. Preaqueça o forno a 250 °C (temperatura máxima) com a assadeira dentro para aquecê-la — isso garante uma base crocante.
3. Abra a massa com rolo em uma superfície enfarinhada formando um disco de 30 cm e espessura de 3 mm. Transfira com cuidado para a assadeira quente levemente untada.
4. Espalhe o molho de tomate temperado com sal, azeite e uma pitada de orégano deixando 2 cm de borda. Distribua o queijo fatiado ou ralado por cima.
5. Asse no forno bem quente por 12 a 15 minutos até a borda dourar e o queijo borbulhar. Retire do forno, distribua folhas de manjericão fresco e regue com fio de azeite antes de servir.
💡 Dica: Preaquecer a assadeira no forno é o truque para uma base de pizza crocante sem forno a lenha.$RX$,
   50,4,'medium','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'italiana','community'),
  ('comm-32','Pizza Calabresa',
   '[{"name":"Farinha de Trigo","canonicalId":"farinha-trigo","quantity":500,"unit":"g"},{"name":"Molho de Tomate","canonicalId":"molho-tomate","quantity":300,"unit":"ml"},{"name":"Queijo","canonicalId":"queijo","quantity":250,"unit":"g"},{"name":"Linguiça","canonicalId":"linguica","quantity":300,"unit":"g"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Prepare e sove a massa de pizza com 500 g de farinha, sal, fermento biológico, azeite e água morna. Deixe descansar coberta por 30 minutos. Enquanto isso, fatie a linguiça calabresa e a cebola em rodelas finas.
2. Preaqueça o forno a 250 °C com a assadeira dentro. Numa frigideira, refogue rapidamente a linguiça fatiada por 3 minutos para eliminar o excesso de gordura. Escorra em papel absorvente.
3. Abra a massa em disco de 30 cm. Transfira para a assadeira quente. Espalhe o molho de tomate temperado, deixando borda de 2 cm.
4. Distribua o queijo ralado ou fatiado sobre o molho. Disponha as rodelas de linguiça de forma uniforme e finalize com as rodelas de cebola por cima.
5. Asse a 250 °C por 12 a 15 minutos até a borda dourar e o queijo gratinar com pontos dourados. Retire e sirva imediatamente com orégano a gosto.
💡 Dica: Pré-cozinhe levemente a linguiça na frigideira para reduzir o excesso de gordura e evitar que a pizza fique encharcada.$RX$,
   55,4,'medium','[]'::jsonb,'["gluten","leite"]'::jsonb,'italiana','community'),
  ('comm-33','Bruschetta',
   '[{"name":"Pão","canonicalId":"pao","quantity":8,"unit":"fatias"},{"name":"Tomate","canonicalId":"tomate","quantity":3,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":2,"unit":"dentes"},{"name":"Manjericão","canonicalId":"manjericao","quantity":1,"unit":"a gosto"},{"name":"Azeite","canonicalId":"azeite","quantity":4,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Corte os tomates em cubos pequenos, retirando as sementes. Misture com as folhas de manjericão rasgadas, 2 col. (sopa) de azeite, sal e pimenta a gosto. Reserve para marinar enquanto prepara o pão.
2. Toste as fatias de pão italiano (ciabatta ou baguete) em uma grelha, frigideira ou no forno a 200 °C por 5 minutos até ficarem douradas e crocantes por fora.
3. Assim que sair do forno, esfregue os dentes de alho cortados ao meio na superfície de cada fatia de pão quente — o calor extrai o sabor do alho naturalmente.
4. Regue cada fatia com o azeite restante e distribua a mistura de tomates marinados por cima de forma generosa.
5. Finalize com mais folhas de manjericão fresco e sirva imediatamente enquanto o pão ainda está crocante.
💡 Dica: Escolha tomates bem maduros e saborosos — a qualidade do tomate faz toda a diferença na bruschetta.$RX$,
   15,4,'easy','["vegetariano","vegano"]'::jsonb,'["gluten"]'::jsonb,'italiana','community'),
  ('comm-34','Macarrão Alho e Óleo',
   '[{"name":"Macarrão","canonicalId":"macarrao","quantity":400,"unit":"g"},{"name":"Alho","canonicalId":"alho","quantity":6,"unit":"dentes"},{"name":"Azeite","canonicalId":"azeite","quantity":6,"unit":"col. (sopa)"},{"name":"Salsa","canonicalId":"salsa","quantity":1,"unit":"a gosto"}]'::jsonb,
   $RX$1. Cozinhe o macarrão em água abundante com bastante sal até ficar al dente. Reserve 1 xíc. da água do cozimento antes de escorrer.
2. Enquanto o macarrão cozinha, fatie o alho em lâminas finas. Em uma frigideira larga, aqueça o azeite em fogo médio-baixo e adicione o alho.
3. Cozinhe o alho em fogo baixo por 3 a 5 minutos, mexendo sempre, até ficar dourado claro e aromático — cuidado para não queimar, pois alho queimado fica amargo.
4. Escorra o macarrão al dente e transfira imediatamente para a frigideira com o alho e azeite. Adicione 2 a 3 col. (sopa) da água do cozimento e misture bem em fogo médio por 1 minuto para emulsionar o molho.
5. Retire do fogo, adicione a salsinha picada fresca e misture. Acerte o sal e sirva com pimenta calabresa a gosto.
💡 Dica: A água do cozimento do macarrão é rica em amido e é o segredo para criar um molho levemente cremoso e aderente.$RX$,
   20,4,'easy','["vegetariano","vegano","sem_lactose"]'::jsonb,'["gluten"]'::jsonb,'italiana','community'),
  ('comm-35','Salada Caprese',
   '[{"name":"Tomate","canonicalId":"tomate","quantity":4,"unit":"un"},{"name":"Queijo","canonicalId":"queijo","quantity":250,"unit":"g"},{"name":"Manjericão","canonicalId":"manjericao","quantity":1,"unit":"a gosto"},{"name":"Azeite","canonicalId":"azeite","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Lave e seque bem os tomates. Corte-os em fatias de aproximadamente 1 cm de espessura. Corte igualmente o queijo mussarela de búfala (ou mussarela comum) em fatias do mesmo tamanho.
2. Em um prato raso ou travessa, intercale as fatias de tomate e queijo em fileiras sobrepostas levemente, alternando tomate, queijo, tomate, queijo.
3. Distribua as folhas de manjericão fresco entre as fatias ou por cima — não substitua por manjericão seco, pois o sabor fresco é essencial.
4. Tempere com sal grosso, pimenta-do-reino moída na hora e regue generosamente com o azeite de oliva extravirgem.
5. Sirva imediatamente em temperatura ambiente — não leve à geladeira após montar para preservar a textura do queijo e o aroma do manjericão.
💡 Dica: Use mussarela de búfala fresca para uma experiência autêntica — a diferença de sabor e textura é notável.$RX$,
   10,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'italiana','community'),
  ('comm-36','Tacos de Carne',
   '[{"name":"Tortilla","canonicalId":"tortilla","quantity":8,"unit":"un"},{"name":"Carne Bovina","canonicalId":"carne-bovina","quantity":500,"unit":"g"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alface","canonicalId":"alface","quantity":1,"unit":"a gosto"}]'::jsonb,
   $RX$1. Tempere a carne moída (ou cortada em tiras finas) com sal, pimenta, cominho e páprica a gosto. Reserve. Pique o tomate em cubos pequenos sem sementes, fatie a cebola em rodelas finas e rasgue as folhas de alface. Reserve separado.
2. Em uma frigideira em fogo alto, cozinhe a carne temperada por 8 a 10 minutos, mexendo para dourar uniformemente e secar toda a água. Ajuste o tempero.
3. Aqueça as tortillas uma a uma em frigideira seca ou diretamente na chama do fogão por 30 segundos de cada lado até ficarem macias e levemente tostadas.
4. Monte cada taco: coloque uma porção de carne no centro da tortilla, adicione tomate, cebola e alface em sequência.
5. Dobre ou enrole e sirva imediatamente com gotas de limão e pimenta ou molho de pimenta a gosto.
💡 Dica: Não sobrecarregue o taco com recheio — use duas tortillas sobrepostas para maior resistência sem rasgar.$RX$,
   25,4,'easy','[]'::jsonb,'["gluten"]'::jsonb,'mexicana','community'),
  ('comm-37','Burrito de Feijão',
   '[{"name":"Tortilla","canonicalId":"tortilla","quantity":4,"unit":"un"},{"name":"Feijão","canonicalId":"feijao","quantity":400,"unit":"g"},{"name":"Arroz","canonicalId":"arroz","quantity":2,"unit":"xíc."},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Milho Verde","canonicalId":"milho-verde","quantity":200,"unit":"g"}]'::jsonb,
   $RX$1. Cozinhe o arroz em água com sal da forma habitual. Enquanto isso, aqueça o feijão cozido temperado em uma frigideira com fio de azeite, alho picado e sal por 5 minutos até ficar cremoso.
2. Pique o tomate em cubos pequenos, tempere com sal, limão e coentro (ou salsinha). Escorra e aqueça o milho verde.
3. Aqueça as tortillas em frigideira seca por 30 segundos de cada lado até ficarem macias e maleáveis para enrolar.
4. Monte cada burrito no centro da tortilla aquecida: uma porção de arroz, uma porção de feijão, tomate picado e milho verde.
5. Dobre as laterais da tortilla para dentro e enrole firmemente. Sirva de imediato ou sele na frigideira por 2 minutos de cada lado para um burrito mais crocante.
💡 Dica: Espalhe uma fina camada de guacamole ou abacate amassado por dentro da tortilla antes de montar para deixar o burrito mais cremoso.$RX$,
   30,4,'easy','["vegetariano","vegano"]'::jsonb,'["gluten"]'::jsonb,'mexicana','community'),
  ('comm-38','Quesadilla de Queijo',
   '[{"name":"Tortilla","canonicalId":"tortilla","quantity":4,"unit":"un"},{"name":"Queijo","canonicalId":"queijo","quantity":250,"unit":"g"},{"name":"Pimentão","canonicalId":"pimentao","quantity":1,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Fatie o pimentão e a cebola em tiras finas. Em uma frigideira antiaderente em fogo médio-alto, refogue as tiras com fio de azeite e pitada de sal por 5 a 6 minutos até amolecerem e ficarem levemente caramelizadas.
2. Retire os legumes da frigideira e reserve. Limpe levemente a frigideira com papel toalha.
3. Coloque uma tortilla na frigideira em fogo médio-baixo. Distribua metade do queijo ralado sobre toda a superfície, espalhe metade dos legumes refogados e cubra com outra tortilla por cima.
4. Pressione levemente com uma espátula e cozinhe por 2 a 3 minutos até a tortilla de baixo dourar. Vire com cuidado e cozinhe o outro lado por mais 2 minutos até dourar e o queijo derreter completamente.
5. Retire da frigideira, aguarde 1 minuto e corte em 4 triângulos com uma faca ou pizza cutter. Repita com as outras 2 tortillas. Sirva com creme azedo ou guacamole.
💡 Dica: Não use fogo alto — paciência em fogo médio-baixo garante queijo derretido sem queimar a tortilla.$RX$,
   20,4,'easy','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'mexicana','community'),
  ('comm-39','Guacamole',
   '[{"name":"Abacate","canonicalId":"abacate","quantity":2,"unit":"un"},{"name":"Tomate","canonicalId":"tomate","quantity":1,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":0.5,"unit":"un"},{"name":"Limão","canonicalId":"limao","quantity":1,"unit":"un"},{"name":"Coentro","canonicalId":"coentro","quantity":2,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Corte os abacates ao meio, retire o caroço e extraia a polpa com uma colher, colocando em uma tigela.
2. Amasse a polpa com um garfo até obter uma consistência levemente grumosa — não precisa ficar completamente lisa.
3. Pique o tomate em cubinhos pequenos (retire as sementes para não encharcar), a cebola bem fina e o coentro grosseiramente.
4. Adicione os ingredientes picados à tigela, esprema o limão e misture com cuidado. Tempere com sal a gosto.
5. Prove e ajuste o limão ou sal. Sirva imediatamente com tortillas ou nachos para evitar oxidação.
💡 Dica: Deixe o caroço do abacate dentro da tigela coberta com plástico filme para retardar o escurecimento caso não for servir na hora.$RX$,
   10,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mexicana','community'),
  ('comm-40','Chili Vegano',
   '[{"name":"Feijão","canonicalId":"feijao","quantity":400,"unit":"g"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Milho Verde","canonicalId":"milho-verde","quantity":200,"unit":"g"},{"name":"Pimentão","canonicalId":"pimentao","quantity":1,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Cominho","canonicalId":"cominho","quantity":1,"unit":"col. (chá)"}]'::jsonb,
   $RX$1. Pique a cebola e o pimentão em cubos médios. Aqueça um fio de óleo em panela grande em fogo médio e refogue a cebola por 3 minutos, depois junte o pimentão e cozinhe por mais 2 minutos.
2. Acrescente os tomates picados sem sementes e o cominho. Mexa bem e cozinhe em fogo médio por 5 minutos até o tomate desmanchar.
3. Adicione o feijão (já cozido ou de lata escorrido) e o milho verde. Misture tudo e adicione 200 ml de água.
4. Tempere com sal e pimenta-do-reino a gosto. Reduza o fogo para baixo, tampe e cozinhe por 20 minutos mexendo ocasionalmente, até engrossar.
5. Prove, ajuste o tempero e sirva quente acompanhado de arroz ou pão de milho.
💡 Dica: Adicione uma colher de pasta de chipotle ou páprica defumada para um sabor mais intenso e levemente picante.$RX$,
   40,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mexicana','community'),
  ('comm-41','Fajitas de Frango',
   '[{"name":"Tortilla","canonicalId":"tortilla","quantity":8,"unit":"un"},{"name":"Frango","canonicalId":"frango","quantity":500,"unit":"g"},{"name":"Pimentão","canonicalId":"pimentao","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Corte o frango em tiras finas e tempere com sal, pimenta, cominho e páprica a gosto. Reserve por 10 minutos.
2. Fatie a cebola em meias-luas e o pimentão em tiras. Reserve separados.
3. Aqueça uma frigideira grande em fogo alto com um fio de óleo. Sele as tiras de frango por 5 a 7 minutos, mexendo, até dourar e cozinhar completamente. Retire e reserve.
4. Na mesma frigideira, refogue a cebola por 2 minutos, junte o pimentão e salteie em fogo alto por mais 3 minutos — os legumes devem ficar al dente e com marcas de fritura.
5. Devolva o frango à frigideira, misture e aqueça por 1 minuto. Aqueça as tortillas em frigideira seca por 30 segundos de cada lado e sirva o recheio dentro delas.
💡 Dica: Sirva com guacamole, creme de leite e gotas de limão para montar as fajitas na mesa.$RX$,
   30,4,'easy','[]'::jsonb,'["gluten"]'::jsonb,'mexicana','community'),
  ('comm-42','Yakisoba',
   '[{"name":"Macarrão","canonicalId":"macarrao","quantity":300,"unit":"g"},{"name":"Frango","canonicalId":"frango","quantity":400,"unit":"g"},{"name":"Repolho","canonicalId":"repolho","quantity":200,"unit":"g"},{"name":"Cenoura","canonicalId":"cenoura","quantity":1,"unit":"un"},{"name":"Pimentão","canonicalId":"pimentao","quantity":1,"unit":"un"},{"name":"Shoyu","canonicalId":"shoyu","quantity":4,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Cozinhe o macarrão em água fervente com sal por 1 minuto a menos que o indicado na embalagem (deve ficar al dente). Escorra, misture com um fio de óleo e reserve.
2. Corte o frango em tiras finas, tempere levemente com sal e pimenta. Fatie o repolho, cenoura e pimentão em tiras finas.
3. Aqueça bastante óleo em wok ou frigideira grande em fogo bem alto. Salteie o frango por 5 minutos até dourar e cozinhar; retire e reserve.
4. Na mesma frigideira, adicione um pouco mais de óleo e salteie a cenoura por 2 minutos, depois o pimentão por 1 minuto e por último o repolho por 1 minuto — mantenha o fogo bem alto para saltear, não encharcar.
5. Devolva o frango, acrescente o macarrão e regue com o shoyu. Misture em fogo alto por 2 minutos até o macarrão absorver o tempero e ficar levemente tostado.
💡 Dica: Um fio de óleo de gergelim no final realça muito o sabor do yakisoba autêntico.$RX$,
   30,4,'medium','[]'::jsonb,'["gluten","soja"]'::jsonb,'asiatica','community'),
  ('comm-43','Arroz Frito',
   '[{"name":"Arroz","canonicalId":"arroz","quantity":300,"unit":"g"},{"name":"Ovo","canonicalId":"ovo","quantity":3,"unit":"un"},{"name":"Cenoura","canonicalId":"cenoura","quantity":1,"unit":"un"},{"name":"Ervilha","canonicalId":"ervilha","quantity":150,"unit":"g"},{"name":"Cebolinha","canonicalId":"cebolinha","quantity":3,"unit":"col. (sopa)"},{"name":"Shoyu","canonicalId":"shoyu","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Use arroz cozido e frio (de preferência do dia anterior) — isso é essencial para o arroz frito ficar soltinho. Corte a cenoura em cubinhos pequenos.
2. Aqueça uma wok ou frigideira grande em fogo bem alto com 2 col. de sopa de óleo. Frite os cubinhos de cenoura por 2 minutos, depois acrescente a ervilha e mexa por 1 minuto.
3. Empurre os legumes para a borda, coloque mais um fio de óleo no centro e adicione os ovos batidos. Mexendo rapidamente, faça ovos mexidos rústicos sem deixar endurecer demais.
4. Misture o ovo com os legumes, acrescente o arroz e misture bem quebrando qualquer torrão. Salteie em fogo alto por 3 minutos.
5. Regue com o shoyu e salteie por mais 1 a 2 minutos. Finalize com a cebolinha picada, prove e ajuste o sal.
💡 Dica: Não mexa demais após adicionar o shoyu — deixe o arroz tostar um pouco no fundo para obter o sabor defumado característico.$RX$,
   20,4,'easy','[]'::jsonb,'["ovo","soja","gluten"]'::jsonb,'asiatica','community'),
  ('comm-44','Frango Xadrez',
   '[{"name":"Frango","canonicalId":"frango","quantity":500,"unit":"g"},{"name":"Pimentão","canonicalId":"pimentao","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Shoyu","canonicalId":"shoyu","quantity":4,"unit":"col. (sopa)"},{"name":"Amendoim","canonicalId":"amendoim","quantity":60,"unit":"g"}]'::jsonb,
   $RX$1. Corte o frango em cubos de 2 cm. Em uma tigela, misture o shoyu com 1 col. de chá de amido de milho e marine o frango por 10 minutos.
2. Corte a cebola e o pimentão em quadrados de 2 cm aproximadamente, mantendo os pedaços uniformes para cozinhar de forma igual.
3. Aqueça a wok ou frigideira em fogo alto com óleo e sele o frango marinado por 5 a 7 minutos até dourar. Retire e reserve.
4. Na mesma frigideira, salteie a cebola por 2 minutos, depois junte os pimentões e cozinhe por mais 2 minutos em fogo alto — devem ficar crocantes.
5. Devolva o frango, adicione o amendoim torrado e misture rapidamente por 1 minuto. Prove e ajuste o sal com mais shoyu se necessário. Sirva com arroz branco.
💡 Dica: Toste o amendoim previamente em frigideira seca por 3 minutos para intensificar o sabor e garantir a crocância no prato final.$RX$,
   30,4,'medium','["sem_lactose"]'::jsonb,'["soja","amendoim","gluten"]'::jsonb,'asiatica','community'),
  ('comm-45','Frango Teriyaki',
   '[{"name":"Frango","canonicalId":"frango","quantity":600,"unit":"g"},{"name":"Shoyu","canonicalId":"shoyu","quantity":5,"unit":"col. (sopa)"},{"name":"Mel","canonicalId":"mel","quantity":3,"unit":"col. (sopa)"},{"name":"Gergelim","canonicalId":"gergelim","quantity":1,"unit":"col. (sopa)"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"}]'::jsonb,
   $RX$1. Misture o shoyu, mel e alho picado em uma tigela para fazer a marinada teriyaki. Corte o frango em filés ou coxas sem osso e marine por pelo menos 15 minutos (ou até 1 hora na geladeira).
2. Aqueça uma frigideira antiaderente em fogo médio-alto com um fio de óleo. Retire o frango da marinada (reserve o líquido) e sele por 4 a 5 minutos de cada lado até dourar.
3. Quando o frango estiver dourado, despeje a marinada reservada na frigideira. Cozinhe em fogo médio por 5 minutos, virando o frango, até o molho engrossar e caramelizar.
4. Fique atento ao ponto do molho: ele deve brilhar e cobrir o frango com uma camada espessa. Se reduzir demais, acrescente 2 col. de sopa de água.
5. Retire do fogo, fatie o frango em tiras e sirva polvilhado com gergelim. Acompanhe com arroz branco e brócolis cozido.
💡 Dica: Para um molho mais espesso, dissolva 1 col. de chá de amido de milho em 1 col. de sopa de água e adicione à frigideira antes de caramelizar.$RX$,
   25,4,'easy','["sem_lactose"]'::jsonb,'["soja","gluten"]'::jsonb,'asiatica','community'),
  ('comm-46','Tofu Grelhado com Legumes',
   '[{"name":"Tofu","canonicalId":"tofu","quantity":400,"unit":"g"},{"name":"Brócolis","canonicalId":"brocolis","quantity":300,"unit":"g"},{"name":"Cenoura","canonicalId":"cenoura","quantity":2,"unit":"un"},{"name":"Shoyu","canonicalId":"shoyu","quantity":4,"unit":"col. (sopa)"},{"name":"Gengibre","canonicalId":"gengibre","quantity":1,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Pressione o tofu entre panos limpos por 10 minutos para retirar o excesso de água — isso é essencial para grelhar bem. Corte em cubos de 2 cm.
2. Separe o brócolis em floretes pequenos e corte a cenoura em fatias diagonais finas. Rale ou pique finamente o gengibre.
3. Aqueça a frigideira em fogo alto com 2 col. de sopa de óleo. Grelhe os cubos de tofu por 2 a 3 minutos de cada lado até formarem uma crosta dourada. Retire e reserve.
4. Na mesma frigideira, salteie a cenoura por 2 minutos, acrescente o brócolis e o gengibre e cozinhe por mais 3 minutos em fogo alto, mexendo sempre.
5. Devolva o tofu, regue com o shoyu e misture delicadamente por 1 minuto. Prove, ajuste o sal e sirva com arroz ou macarrão.
💡 Dica: Marinar os cubos de tofu no shoyu e gengibre por 20 minutos antes de grelhar deixa o sabor muito mais profundo.$RX$,
   25,4,'easy','["vegetariano","vegano","sem_lactose"]'::jsonb,'["soja","gluten"]'::jsonb,'asiatica','community'),
  ('comm-47','Curry de Grão-de-bico',
   '[{"name":"Grão-de-bico","canonicalId":"grao-de-bico","quantity":400,"unit":"g"},{"name":"Leite de Coco","canonicalId":"leite-coco","quantity":400,"unit":"ml"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Curry","canonicalId":"curry","quantity":2,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Pique a cebola em cubos pequenos. Aqueça 2 col. de sopa de óleo em panela média em fogo médio e refogue a cebola por 5 minutos até ficar transparente e levemente dourada.
2. Adicione o curry em pó e mexa por 1 minuto em fogo médio para tostar as especiarias e liberar o aroma.
3. Acrescente os tomates picados sem sementes e cozinhe por 5 minutos até desmancharem e formarem uma base de molho.
4. Adicione o grão-de-bico (já cozido ou de lata, escorrido e enxaguado) e o leite de coco. Tempere com sal e mexa bem.
5. Cozinhe em fogo médio-baixo por 15 a 20 minutos com a panela semitampada, até o molho engrossar e o curry apurar. Sirva com arroz basmati ou pão naan.
💡 Dica: Finalize com folhas de coentro fresco e um fio de limão para equilibrar a riqueza do leite de coco.$RX$,
   35,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'asiatica','community'),
  ('comm-48','Frango ao Curry com Leite de Coco',
   '[{"name":"Frango","canonicalId":"frango","quantity":600,"unit":"g"},{"name":"Leite de Coco","canonicalId":"leite-coco","quantity":400,"unit":"ml"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":4,"unit":"dentes"},{"name":"Curry","canonicalId":"curry","quantity":2,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Corte o frango em cubos de 3 cm e tempere com sal, pimenta e metade do curry. Pique a cebola e o alho finamente.
2. Aqueça 2 col. de sopa de óleo em panela funda em fogo médio-alto. Sele os cubos de frango em lotes por 5 minutos até dourar. Retire e reserve.
3. Na mesma panela, reduza para fogo médio e refogue a cebola por 4 minutos. Adicione o alho e o restante do curry, mexa por 1 minuto para tostar.
4. Devolva o frango à panela, despeje o leite de coco e misture bem. Ajuste o sal, tampe e cozinhe em fogo baixo por 20 minutos.
5. Retire a tampa e cozinhe por mais 5 minutos em fogo médio para encorpar o molho. O frango deve estar macio e o molho cremoso. Sirva com arroz e coentro fresco.
💡 Dica: Adicione 1 col. de chá de cúrcuma junto com o curry para realçar a cor dourada e acrescentar um leve sabor terroso.$RX$,
   40,4,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'asiatica','community'),
  ('comm-49','Dahl de Lentilha',
   '[{"name":"Lentilha","canonicalId":"lentilha","quantity":300,"unit":"g"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":4,"unit":"dentes"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Curry","canonicalId":"curry","quantity":2,"unit":"col. (sopa)"},{"name":"Gengibre","canonicalId":"gengibre","quantity":1,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Pique a cebola, o alho e rale o gengibre. Aqueça 2 col. de sopa de óleo em panela média em fogo médio. Refogue a cebola por 5 minutos até dourar levemente.
2. Adicione o alho, o gengibre e o curry. Toste as especiarias por 1 a 2 minutos mexendo sem parar até o aroma ser liberado.
3. Acrescente os tomates picados e cozinhe por 5 minutos em fogo médio até desmancharem completamente formando um molho.
4. Adicione a lentilha lavada e 700 ml de água. Misture, tempere com sal, tampe e cozinhe em fogo médio-baixo por 20 a 25 minutos até a lentilha ficar macia e o caldo encorpar.
5. Prove e ajuste o sal e o curry. A consistência deve ser cremosa — se precisar, amasse levemente algumas lentilhas com a colher. Sirva com arroz basmati ou pão naan.
💡 Dica: Um fio de manteiga (ou ghee) no final com algumas folhas de coentro fresco transforma o dahl em um prato muito mais aromático.$RX$,
   40,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'indiana','community'),
  ('comm-50','Frango Tikka',
   '[{"name":"Frango","canonicalId":"frango","quantity":600,"unit":"g"},{"name":"Iogurte","canonicalId":"iogurte","quantity":200,"unit":"g"},{"name":"Curry","canonicalId":"curry","quantity":2,"unit":"col. (sopa)"},{"name":"Alho","canonicalId":"alho","quantity":4,"unit":"dentes"},{"name":"Limão","canonicalId":"limao","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Misture o iogurte, o curry, o alho amassado e o suco do limão em uma tigela para fazer a marinada. Corte o frango em cubos de 3 cm, adicione à marinada e misture bem. Marine por pelo menos 30 minutos (ou até 4 horas na geladeira).
2. Preaqueça o forno a 220 °C ou prepare a grelha em fogo alto. Se usar espetos, ensarte os cubos de frango marinado deixando pequenos espaços entre eles.
3. Asse no forno em grade alta por 15 a 20 minutos, virando na metade do tempo, ou grelhe por 5 a 7 minutos de cada lado — o frango deve ter pontos escuros de caramelização.
4. Verifique o ponto: corte o cubo maior para confirmar que está cozido por completo, sem partes rosadas. A marinada deve estar levemente tostada nas bordas.
5. Sirva os espetos com arroz, pão naan, rodelas de cebola crua e gotas de limão.
💡 Dica: Adicione 1 col. de chá de colorau ou páprica defumada à marinada para a cor avermelhada característica do tikka autêntico.$RX$,
   35,4,'medium','["sem_gluten"]'::jsonb,'["leite"]'::jsonb,'indiana','community'),
  ('comm-51','Curry de Batata e Ervilha',
   '[{"name":"Batata","canonicalId":"batata","quantity":500,"unit":"g"},{"name":"Ervilha","canonicalId":"ervilha","quantity":200,"unit":"g"},{"name":"Leite de Coco","canonicalId":"leite-coco","quantity":400,"unit":"ml"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Curry","canonicalId":"curry","quantity":2,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Descasque e corte as batatas em cubos de 2 cm. Pique a cebola em cubos pequenos.
2. Aqueça 2 col. de sopa de óleo em panela média em fogo médio. Refogue a cebola por 5 minutos. Adicione o curry e toste por 1 minuto mexendo sempre.
3. Acrescente as batatas e misture bem para envolver no curry. Regue com o leite de coco e 200 ml de água. Tempere com sal.
4. Tampe a panela e cozinhe em fogo médio por 15 a 18 minutos, mexendo ocasionalmente, até as batatas ficarem macias ao pegar com um garfo.
5. Adicione a ervilha nos últimos 5 minutos de cozimento para manter a cor verde vibrante. Prove, ajuste o sal e sirva com arroz basmati ou pão naan.
💡 Dica: Amasse alguns cubos de batata com a colher no final para engrossar naturalmente o molho sem precisar adicionar amido.$RX$,
   35,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'indiana','community'),
  ('comm-52','Homus',
   '[{"name":"Grão-de-bico","canonicalId":"grao-de-bico","quantity":400,"unit":"g"},{"name":"Tahine","canonicalId":"tahine","quantity":3,"unit":"col. (sopa)"},{"name":"Alho","canonicalId":"alho","quantity":2,"unit":"dentes"},{"name":"Limão","canonicalId":"limao","quantity":1,"unit":"un"},{"name":"Azeite","canonicalId":"azeite","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Escorra o grão-de-bico (de lata ou cozido) e reserve um pouco do líquido do cozimento. Para uma textura mais sedosa, retire a pele dos grãos pressionando-os levemente entre os dedos.
2. No liquidificador ou processador, bata o tahine com o suco do limão e o alho por 1 minuto — a mistura vai ficar esbranquiçada e cremosa.
3. Adicione o grão-de-bico ao processador e bata, acrescentando o líquido reservado aos poucos, até obter a textura desejada — de 1 a 3 minutos.
4. Tempere com sal a gosto, adicione 2 col. de sopa de azeite e bata por mais 30 segundos. Prove e ajuste o limão ou sal.
5. Transfira para um prato fundo, faça um redemoinho no centro com as costas de uma colher e regue com o azeite restante. Sirva com pão sírio ou vegetais crus.
💡 Dica: Bater o tahine com o limão ANTES do grão-de-bico é o segredo para um homus mais claro e cremoso, diferente do passo a passo convencional.$RX$,
   15,6,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'arabe','community'),
  ('comm-53','Falafel',
   '[{"name":"Grão-de-bico","canonicalId":"grao-de-bico","quantity":400,"unit":"g"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"},{"name":"Coentro","canonicalId":"coentro","quantity":3,"unit":"col. (sopa)"},{"name":"Salsa","canonicalId":"salsa","quantity":3,"unit":"col. (sopa)"},{"name":"Cominho","canonicalId":"cominho","quantity":1,"unit":"col. (chá)"}]'::jsonb,
   $RX$1. Use grão-de-bico seco demolhado por 12 horas (não use de lata — fica muito úmido). Escorra bem e seque com papel toalha.
2. No processador, pulse o grão-de-bico com o alho, coentro, salsa e cominho até obter uma massa grumosa — não processe demais para não virar pasta lisa. Tempere com sal e pimenta a gosto.
3. Modele bolinhas do tamanho de uma noz ou use uma colher de sorvete. Leve à geladeira por 20 minutos para firmar.
4. Aqueça óleo em frigideira funda ou panela pequena (3 a 4 cm de óleo) em fogo médio-alto até atingir cerca de 180 °C. Frite os falafels em lotes por 3 a 4 minutos até ficarem bem dourados e crocantes por fora.
5. Escorra em papel toalha e sirva quentes com homus, pão sírio e salada de tomate.
💡 Dica: Se a massa estiver muito úmida e desmanchar na fritura, adicione 2 col. de sopa de farinha de grão-de-bico ou farinha de trigo para dar mais liga.$RX$,
   30,4,'medium','["vegetariano","vegano","sem_lactose"]'::jsonb,'[]'::jsonb,'arabe','community'),
  ('comm-54','Tabule',
   '[{"name":"Cuscuz","canonicalId":"cuscuz","quantity":200,"unit":"g"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Salsa","canonicalId":"salsa","quantity":1,"unit":"xíc."},{"name":"Cebola","canonicalId":"cebola","quantity":0.5,"unit":"un"},{"name":"Limão","canonicalId":"limao","quantity":2,"unit":"un"}]'::jsonb,
   $RX$1. Hidrate o cuscuz: coloque em uma tigela, regue com 200 ml de água quente, tempere com sal e 1 col. de sopa de azeite. Cubra com prato ou pano e aguarde 5 minutos. Solte os grãos com um garfo.
2. Pique os tomates em cubos pequenos retirando as sementes. Pique a cebola bem fina e a salsa fresca grosseiramente (use bastante — é o ingrediente principal do tabule).
3. Aguarde o cuscuz esfriar completamente em temperatura ambiente ou na geladeira antes de misturar.
4. Em uma tigela grande, combine o cuscuz, tomate, cebola e salsa. Regue com o suco dos limões e 3 col. de sopa de azeite. Misture bem.
5. Prove e ajuste sal, limão e azeite. O tabule deve ser bem temperado e levemente ácido. Sirva gelado como salada ou acompanhamento.
💡 Dica: O tabule tradicional leva trigo-para-quibe; usando cuscuz o preparo é mais rápido e o resultado igualmente saboroso — deixe descansar 15 minutos na geladeira antes de servir para os sabores se integrarem.$RX$,
   20,4,'easy','["vegetariano","vegano","sem_lactose"]'::jsonb,'["gluten"]'::jsonb,'arabe','community'),
  ('comm-55','Babaganuche',
   '[{"name":"Berinjela","canonicalId":"berinjela","quantity":2,"unit":"un"},{"name":"Tahine","canonicalId":"tahine","quantity":3,"unit":"col. (sopa)"},{"name":"Alho","canonicalId":"alho","quantity":2,"unit":"dentes"},{"name":"Limão","canonicalId":"limao","quantity":1,"unit":"un"},{"name":"Azeite","canonicalId":"azeite","quantity":2,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Asse as berinjelas inteiras diretamente na chama do fogão (ou no forno a 250 °C em grade alta) por 15 a 20 minutos, virando com pinça, até a pele ficar completamente carbonizada e a polpa macia — o sabor defumado vem desse processo.
2. Transfira as berinjelas para uma peneira e aguarde esfriar por 10 minutos. Com uma colher, retire toda a polpa, descartando a casca queimada. Se a polpa estiver muito aquosa, escorra por alguns minutos.
3. Pique a polpa grosseiramente com uma faca (não bata no liquidificador — a textura rústica é característica do babaganuche).
4. Misture a polpa com o tahine, o suco do limão, o alho amassado e o azeite. Tempere com sal a gosto e misture bem.
5. Transfira para um prato, faça um redemoinho com a colher e regue com mais azeite. Sirva com pão sírio, vegetais frescos ou como acompanhamento de carnes.
💡 Dica: Queimar bem a casca da berinjela é o que cria o sabor defumado único — não tenha medo de deixar a casca preta por completo.$RX$,
   30,4,'medium','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'arabe','community'),
  ('comm-56','Kafta de Carne',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina","quantity":500,"unit":"g"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Salsa","canonicalId":"salsa","quantity":4,"unit":"col. (sopa)"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"}]'::jsonb,
   $RX$1. No processador, pulse a cebola e o alho até ficarem bem picados. Misture com a carne moída, a salsa picada fina, sal, pimenta-do-reino e pimenta síria (ou páprica) a gosto.
2. Amasse bem a mistura com as mãos por 3 a 5 minutos até ficar homogênea e com boa liga — isso garante que a kafta não quebre no espeto.
3. Divida em 8 porções iguais. Modele cada porção em torno de um espeto metálico (ou de madeira previamente molhado), formando um cilindro alongado de cerca de 12 cm.
4. Grelhe em grelha quente ou frigideira em fogo médio-alto, untada com óleo, por 4 a 5 minutos de cada lado até dourar e cozinhar por completo.
5. Sirva com pão sírio, homus, tabule e rodelas de cebola com salsinha.
💡 Dica: Adicione 1 col. de chá de canela em pó à mistura — parece incomum, mas é o tempero característico da kafta árabe autêntica.$RX$,
   25,4,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'arabe','community'),
  ('comm-57','Salada Grega',
   '[{"name":"Pepino","canonicalId":"pepino","quantity":1,"unit":"un"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":0.5,"unit":"un"},{"name":"Queijo","canonicalId":"queijo","quantity":150,"unit":"g"},{"name":"Azeitona","canonicalId":"azeitona","quantity":80,"unit":"g"},{"name":"Azeite","canonicalId":"azeite","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Corte o pepino em meias-luas, os tomates em cubos médios e a cebola em fatias bem finas. Se preferir sabor mais suave, deixe a cebola de molho em água gelada por 5 minutos e escorra.
2. Corte o queijo feta (ou queijo tipo feta) em cubos de 1 cm ou esfarele grosseiramente.
3. Em uma tigela grande, combine o pepino, tomate, cebola, azeitonas e queijo. Não misture demais para não amolecer os ingredientes.
4. Regue com o azeite, tempere com sal (com moderação — o queijo e a azeitona já são salgados), pimenta-do-reino e orégano seco a gosto.
5. Misture delicadamente e sirva em seguida — a salada não deve ser preparada com muita antecedência para manter a crocância.
💡 Dica: Um fio de suco de limão junto com o azeite na finalização realça todos os sabores e dá frescor à salada.$RX$,
   15,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'mediterranea','community'),
  ('comm-58','Salada de Quinoa',
   '[{"name":"Quinoa","canonicalId":"quinoa","quantity":1,"unit":"xíc."},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Pepino","canonicalId":"pepino","quantity":1,"unit":"un"},{"name":"Limão","canonicalId":"limao","quantity":2,"unit":"un"},{"name":"Azeite","canonicalId":"azeite","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Lave bem a quinoa em água corrente para eliminar o amargor, depois cozinhe em 2 xícaras de água com uma pitada de sal em fogo médio por 15 minutos ou até a água secar e os grãos ficarem translúcidos.
2. Enquanto a quinoa cozinha, corte os tomates em cubos pequenos e o pepino em meias-luas finas; transfira para uma tigela grande.
3. Espreme o suco dos limões e misture com o azeite, sal e pimenta a gosto para formar o molho.
4. Quando a quinoa esfriar por 10 minutos, junte-a à tigela com os legumes, regue com o molho e misture bem.
5. Prove o tempero, ajuste sal e sirva em temperatura ambiente ou levemente gelada.
💡 Dica: Acrescente folhas de hortelã ou salsinha picada para um toque fresco e aromático.$RX$,
   25,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mediterranea','community'),
  ('comm-59','Peixe Assado com Limão',
   '[{"name":"Peixe","canonicalId":"peixe","quantity":800,"unit":"g"},{"name":"Limão","canonicalId":"limao","quantity":2,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":4,"unit":"dentes"},{"name":"Azeite","canonicalId":"azeite","quantity":4,"unit":"col. (sopa)"},{"name":"Batata","canonicalId":"batata","quantity":600,"unit":"g"}]'::jsonb,
   $RX$1. Pré-aqueça o forno a 200 °C. Descasque as batatas, corte em rodelas de 1 cm e distribua em uma assadeira untada com azeite; tempere com sal e pimenta e leve ao forno por 20 minutos.
2. Enquanto isso, prepare o peixe: faça cortes superficiais na pele, tempere com sal, pimenta, o suco dos limões e o alho amassado; deixe marinar 10 minutos.
3. Retire a assadeira do forno, vire as batatas e disponha o peixe por cima; regue tudo com o azeite restante.
4. Volte ao forno por mais 20 a 25 minutos até o peixe soltar facilmente ao toque do garfo e as batatas ficarem douradas.
5. Sirva imediatamente, com fatias de limão ao lado.
💡 Dica: Cubra a assadeira com papel-alumínio nos primeiros 15 minutos para manter o peixe suculento; retire para dourar no final.$RX$,
   45,4,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mediterranea','community'),
  ('comm-60','Legumes Assados',
   '[{"name":"Abobrinha","canonicalId":"abobrinha","quantity":2,"unit":"un"},{"name":"Berinjela","canonicalId":"berinjela","quantity":1,"unit":"un"},{"name":"Pimentão","canonicalId":"pimentao","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":2,"unit":"un"},{"name":"Azeite","canonicalId":"azeite","quantity":4,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Pré-aqueça o forno a 220 °C. Corte a abobrinha e a berinjela em rodelas de 1 cm; fatie os pimentões em tiras largas e a cebola em pétalas.
2. Disponha todos os legumes em uma assadeira grande sem sobrepor, regue com o azeite e tempere generosamente com sal, pimenta e ervas secas (tomilho ou orégano).
3. Leve ao forno por 25 a 30 minutos, virando os legumes na metade do tempo, até ficarem macios e com as bordas levemente caramelizadas.
4. Verifique o ponto: a berinjela deve estar completamente mole e os pimentões com a pele levemente enrugada.
5. Sirva quente como acompanhamento ou em temperatura ambiente como entrada.
💡 Dica: Um fio de balsâmico adicionado nos últimos 5 minutos de forno realça o sabor adocicado dos legumes.$RX$,
   40,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mediterranea','community'),
  ('comm-61','Ratatouille',
   '[{"name":"Berinjela","canonicalId":"berinjela","quantity":1,"unit":"un"},{"name":"Abobrinha","canonicalId":"abobrinha","quantity":2,"unit":"un"},{"name":"Tomate","canonicalId":"tomate","quantity":4,"unit":"un"},{"name":"Pimentão","canonicalId":"pimentao","quantity":1,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":2,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"}]'::jsonb,
   $RX$1. Refogue a cebola e o alho picados em um fio de azeite em fogo médio por 5 minutos até amolecer; adicione o pimentão picado e cozinhe mais 3 minutos.
2. Junte os tomates picados sem sementes, tempere com sal, pimenta e ervas de Provence; cozinhe em fogo baixo por 15 minutos até formar um molho espesso.
3. Enquanto o molho reduz, fatie a berinjela e a abobrinha em rodelas finas (0,5 cm); tempere levemente com sal e deixe descansar 5 minutos para reduzir o excesso de água.
4. Disponha as rodelas de legumes alternadas (berinjela, abobrinha, tomate) sobre o molho em forma espiral ou fileiras; regue com azeite e cubra com papel-alumínio.
5. Asse em forno a 180 °C por 30 minutos tampado, depois retire o papel e asse mais 15 minutos até a superfície gratinar levemente.
💡 Dica: Prepare o ratatouille no dia anterior — reaquecido fica ainda mais saboroso pois os sabores se integram com o descanso.$RX$,
   60,4,'medium','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mediterranea','community'),
  ('comm-62','Hambúrguer Caseiro',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina","quantity":600,"unit":"g"},{"name":"Pão","canonicalId":"pao","quantity":4,"unit":"un"},{"name":"Queijo","canonicalId":"queijo","quantity":4,"unit":"fatias"},{"name":"Alface","canonicalId":"alface","quantity":4,"unit":"un"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"}]'::jsonb,
   $RX$1. Divida a carne moída em 4 porções de 150 g, modele em discos de 1,5 cm de espessura; tempere generosamente com sal e pimenta dos dois lados.
2. Aqueça uma frigideira de ferro ou grill em fogo alto até começar a fumaçar levemente; grelhe os hambúrgueres por 3 a 4 minutos de cada lado para o ponto ao ponto, sem pressionar para não perder o suco.
3. No último minuto, coloque uma fatia de queijo sobre cada hambúrguer, tampe a frigideira por 30 segundos para derreter.
4. Enquanto o queijo derrete, toste os pães cortados ao meio na mesma frigideira até ficarem dourados; fatie o tomate em rodelas.
5. Monte: base do pão, alface, tomate, hambúrguer com queijo e o topo do pão; sirva imediatamente.
💡 Dica: Misture 1 col. (sopa) de molho inglês na carne antes de modelar para um hambúrguer mais suculento e saboroso.$RX$,
   30,4,'medium','[]'::jsonb,'["gluten","leite"]'::jsonb,'americana','community'),
  ('comm-63','Cachorro-quente',
   '[{"name":"Salsicha","canonicalId":"salsicha","quantity":8,"unit":"un"},{"name":"Pão","canonicalId":"pao","quantity":8,"unit":"un"},{"name":"Molho de Tomate","canonicalId":"molho-tomate","quantity":200,"unit":"ml"},{"name":"Batata","canonicalId":"batata","quantity":400,"unit":"g"},{"name":"Milho Verde","canonicalId":"milho-verde","quantity":200,"unit":"g"}]'::jsonb,
   $RX$1. Descasque as batatas, corte em palitos e frite em óleo quente (180 °C) por 5 a 7 minutos até dourar; escorra em papel-toalha e tempere com sal.
2. Aqueça uma frigideira em fogo médio e grelhe as salsichas por 5 a 8 minutos girando para dourar uniformemente por todos os lados.
3. Enquanto as salsichas grelhama, aqueça o molho de tomate em uma panelinha em fogo baixo; adicione o milho verde e misture.
4. Toste levemente os pães no forno ou torradeira por 2 minutos para ficarem crocantes por fora e macios por dentro.
5. Monte o cachorro-quente: coloque a salsicha no pão, cubra com o molho de tomate com milho e finalize com batata palha por cima.
💡 Dica: Acrescente uma colher de maionese temperada e ervilha sobre o molho para um cachorro-quente completo ao estilo brasileiro.$RX$,
   20,4,'easy','[]'::jsonb,'["gluten"]'::jsonb,'americana','community'),
  ('comm-64','Panquecas Americanas',
   '[{"name":"Farinha de Trigo","canonicalId":"farinha-trigo","quantity":200,"unit":"g"},{"name":"Leite","canonicalId":"leite","quantity":250,"unit":"ml"},{"name":"Ovo","canonicalId":"ovo","quantity":2,"unit":"un"},{"name":"Fermento","canonicalId":"fermento","quantity":1,"unit":"col. (sopa)"},{"name":"Mel","canonicalId":"mel","quantity":2,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Em uma tigela, misture a farinha peneirada, o fermento e uma pitada de sal; abra um buraco no centro e adicione os ovos, o leite e o mel.
2. Misture delicadamente com um fouet apenas até incorporar — não bata demais; pequenos grumos são normais e desaparecem ao cozinhar.
3. Aqueça uma frigideira antiaderente em fogo médio-baixo e unte levemente com manteiga ou óleo; despeje uma concha pequena de massa por panqueca.
4. Cozinhe até surgirem bolhas na superfície e as bordas ficarem secas, cerca de 2 a 3 minutos; vire e cozinhe mais 1 minuto até dourar.
5. Empilhe as panquecas e sirva imediatamente com mel, frutas frescas ou calda de maple.
💡 Dica: Deixe a massa descansar 5 minutos antes de usar — o fermento ativa melhor e as panquecas ficam ainda mais fofas.$RX$,
   20,4,'easy','["vegetariano"]'::jsonb,'["gluten","leite","ovo"]'::jsonb,'americana','community'),
  ('comm-65','Mac and Cheese',
   '[{"name":"Macarrão","canonicalId":"macarrao","quantity":400,"unit":"g"},{"name":"Queijo","canonicalId":"queijo","quantity":200,"unit":"g"},{"name":"Leite","canonicalId":"leite","quantity":500,"unit":"ml"},{"name":"Manteiga","canonicalId":"manteiga","quantity":50,"unit":"g"},{"name":"Farinha de Trigo","canonicalId":"farinha-trigo","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Cozinhe o macarrão em água fervente com sal conforme o tempo indicado na embalagem, deixando al dente; escorra e reserve.
2. Em uma panela média, derreta a manteiga em fogo médio; adicione a farinha de uma vez e mexa vigorosamente com um fouet por 2 minutos até formar um roux dourado.
3. Acrescente o leite aos poucos, mexendo sem parar para não empelotar; cozinhe em fogo médio-baixo por 8 a 10 minutos até o molho béchamel engrossar e cobrir as costas de uma colher.
4. Retire do fogo, adicione o queijo ralado grosso e mexa até derreter completamente; tempere com sal, pimenta e noz-moscada a gosto.
5. Misture o macarrão ao molho e sirva imediatamente; opcionalmente leve ao forno a 200 °C por 10 minutos para gratinar.
💡 Dica: Use uma mistura de queijo cheddar e parmesão para um molho mais saboroso e com a cor característica do mac and cheese clássico.$RX$,
   30,4,'medium','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'americana','community'),
  ('comm-66','Salada Caesar',
   '[{"name":"Alface","canonicalId":"alface","quantity":1,"unit":"un"},{"name":"Frango","canonicalId":"frango","quantity":400,"unit":"g"},{"name":"Queijo","canonicalId":"queijo","quantity":80,"unit":"g"},{"name":"Pão","canonicalId":"pao","quantity":2,"unit":"fatias"},{"name":"Maionese","canonicalId":"maionese","quantity":4,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Tempere o frango com sal, pimenta e alho; grelhe em frigideira com um fio de azeite em fogo médio por 6 a 7 minutos de cada lado até dourar e cozinhar por completo; deixe esfriar e fatie em tiras.
2. Corte as fatias de pão em cubos de 2 cm, regue com azeite e leve ao forno a 200 °C por 8 a 10 minutos até ficarem crocantes; reserve os croutons.
3. Em uma tigela pequena, misture a maionese com suco de limão, alho amassado, sal e pimenta para formar o molho caesar simplificado.
4. Rasgue as folhas de alface lavadas e secas em pedaços grandes; coloque em uma saladeira e regue com o molho, misturando delicadamente para cobrir bem as folhas.
5. Disponha as tiras de frango, os croutons e lascas de queijo parmesão sobre a salada; sirva imediatamente.
💡 Dica: Resfrie a saladeira por 15 minutos na geladeira antes de montar — folhas frias e crocantes fazem toda a diferença na textura final.$RX$,
   25,4,'easy','[]'::jsonb,'["gluten","leite","ovo"]'::jsonb,'americana','community'),
  ('comm-67','Coleslaw',
   '[{"name":"Repolho","canonicalId":"repolho","quantity":400,"unit":"g"},{"name":"Cenoura","canonicalId":"cenoura","quantity":2,"unit":"un"},{"name":"Maionese","canonicalId":"maionese","quantity":5,"unit":"col. (sopa)"},{"name":"Limão","canonicalId":"limao","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Corte o repolho ao meio, remova o miolo duro central e fatie bem fino em tiras (julienne); rale as cenouras no ralo grosso.
2. Coloque o repolho fatiado em uma tigela com água gelada por 10 minutos para deixá-lo mais crocante; escorra e seque bem com papel-toalha.
3. Em uma tigela grande, misture a maionese com o suco do limão, uma pitada de sal, pimenta e açúcar a gosto até obter um molho uniforme.
4. Adicione o repolho e a cenoura ao molho e misture bem até todos os legumes ficarem cobertos; prove e ajuste o tempero.
5. Leve à geladeira por pelo menos 30 minutos antes de servir para os sabores se integrarem e o coleslaw ganhar a textura cremosa característica.
💡 Dica: Adicione uma col. (chá) de vinagre de maçã ao molho para equilibrar a cremosidade com uma leve acidez refrescante.$RX$,
   15,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["ovo"]'::jsonb,'americana','community'),
  ('comm-68','Cookies de Chocolate',
   '[{"name":"Farinha de Trigo","canonicalId":"farinha-trigo","quantity":200,"unit":"g"},{"name":"Chocolate","canonicalId":"chocolate","quantity":150,"unit":"g"},{"name":"Manteiga","canonicalId":"manteiga","quantity":100,"unit":"g"},{"name":"Açúcar","canonicalId":"acucar","quantity":150,"unit":"g"},{"name":"Ovo","canonicalId":"ovo","quantity":2,"unit":"un"}]'::jsonb,
   $RX$1. Pré-aqueça o forno a 180 °C. Pique o chocolate grosseiramente e derreta junto com a manteiga em banho-maria ou micro-ondas em intervalos de 30 segundos, mexendo a cada parada; deixe amornar.
2. Em uma tigela grande, bata o açúcar com os ovos com um fouet por 2 minutos até a mistura ficar levemente esbranquiçada e aerada.
3. Incorpore o chocolate derretido (morno) à mistura de ovos; misture até homogeneizar.
4. Adicione a farinha peneirada e uma pitada de sal, dobrando delicadamente com uma espátula até a massa ficar uniforme — não bata em excesso para os cookies não ficarem duros.
5. Disponha colheradas de massa em assadeira forrada com papel-manteiga, espaçadas 5 cm; asse por 10 a 12 minutos — o centro deve parecer levemente cru, ele firma ao esfriar.
💡 Dica: Leve a massa à geladeira por 30 minutos antes de assar para cookies mais altos e menos espalhados com textura perfeita.$RX$,
   35,4,'medium','["vegetariano"]'::jsonb,'["gluten","leite","ovo"]'::jsonb,'americana','community'),
  ('comm-69','Smoothie Bowl',
   '[{"name":"Banana","canonicalId":"banana","quantity":2,"unit":"un"},{"name":"Morango","canonicalId":"morango","quantity":200,"unit":"g"},{"name":"Iogurte","canonicalId":"iogurte","quantity":200,"unit":"ml"},{"name":"Granola","canonicalId":"granola","quantity":4,"unit":"col. (sopa)"},{"name":"Mel","canonicalId":"mel","quantity":2,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Congele previamente as bananas fatiadas (pelo menos 2 horas) e metade dos morangos para o smoothie ficar mais espesso e gelado sem precisar de gelo.
2. Bata no liquidificador as bananas congeladas, os morangos congelados e o iogurte até obter uma mistura muito espessa, quase como sorvete — use o modo pulsar se necessário.
3. Prove e ajuste a doçura: acrescente mel se quiser mais doce; bata mais 10 segundos apenas para incorporar.
4. Despeje imediatamente em tigelas fundas (não em copos) — a consistência deve sustentar uma colher em pé.
5. Finalize com a granola, os morangos frescos restantes fatiados e um fio de mel; sirva na hora.
💡 Dica: Acrescente uma colher de manteiga de amendoim ao liquidificador para um smoothie bowl ainda mais nutritivo e com toque proteico.$RX$,
   10,2,'easy','["vegetariano"]'::jsonb,'["leite"]'::jsonb,'americana','community'),
  ('comm-70','Aveia com Banana e Mel',
   '[{"name":"Aveia","canonicalId":"aveia","quantity":6,"unit":"col. (sopa)"},{"name":"Banana","canonicalId":"banana","quantity":2,"unit":"un"},{"name":"Mel","canonicalId":"mel","quantity":2,"unit":"col. (sopa)"},{"name":"Leite Vegetal","canonicalId":"leite-vegetal","quantity":300,"unit":"ml"}]'::jsonb,
   $RX$1. Em uma panela pequena, coloque a aveia e o leite vegetal; leve ao fogo médio mexendo constantemente.
2. Cozinhe por 5 a 7 minutos, mexendo sem parar para não grudar no fundo, até a mistura engrossar e a aveia ficar cremosa e macia.
3. Enquanto a aveia cozinha, fatie as bananas em rodelas de 1 cm.
4. Retire a panela do fogo, adicione metade das bananas fatiadas e o mel; misture delicadamente para incorporar.
5. Despeje em tigelas, finalize com as rodelas de banana restantes por cima e um fio extra de mel; sirva quente.
💡 Dica: Acrescente uma col. (chá) de canela em pó ao cozinhar a aveia para um café da manhã mais aromático e com um toque anti-inflamatório.$RX$,
   10,2,'easy','["vegetariano","sem_lactose"]'::jsonb,'[]'::jsonb,'americana','community'),
  ('comm-71','Arroz de forno',
   '[{"name":"Arroz","canonicalId":"arroz","quantity":2,"unit":"xíc."},{"name":"Presunto","canonicalId":"presunto","quantity":200,"unit":"g"},{"name":"Queijo","canonicalId":"queijo","quantity":200,"unit":"g"},{"name":"Milho Verde","canonicalId":"milho-verde","quantity":200,"unit":"g"},{"name":"Ovo","canonicalId":"ovo","quantity":3,"unit":"un"}]'::jsonb,
   $RX$1. Cozinhe o arroz normalmente com sal e um fio de óleo; deixe esfriar completamente — o arroz do dia anterior é ideal pois fica mais solto.
2. Pré-aqueça o forno a 200 °C. Unte uma forma refratária média com manteiga ou azeite.
3. Em uma tigela grande, misture o arroz cozido, o presunto picado em cubos, o milho verde escorrido e metade do queijo ralado ou em cubos; bata os ovos à parte, tempere com sal e pimenta e misture ao arroz.
4. Despeje a mistura na forma refratária, pressione levemente com uma colher para nivelar e cubra com o queijo restante.
5. Asse em forno a 200 °C por 20 a 25 minutos até o queijo gratinar e as bordas ficarem borbulhantes e douradas.
💡 Dica: Acrescente ervilhas e cebolinha picada à mistura para mais cor e frescor — fica ainda mais saboroso e visual.$RX$,
   40,6,'medium','["sem_gluten"]'::jsonb,'["leite","ovo"]'::jsonb,'brasileira','community'),
  ('comm-72','Cuscuz nordestino',
   '[{"name":"Cuscuz","canonicalId":"cuscuz","quantity":2,"unit":"xíc."},{"name":"Linguiça","canonicalId":"linguica","quantity":300,"unit":"g"},{"name":"Ovo","canonicalId":"ovo","quantity":4,"unit":"un"},{"name":"Manteiga","canonicalId":"manteiga","quantity":2,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Umedeça o fubá de cuscuz com água salgada (a proporção é cerca de 1 xíc. de fubá para 1/2 xíc. de água): vá adicionando aos poucos e misturando com as mãos até a massa soltar mas ficar úmida ao apertar — não pode ficar empapada.
2. Cozinhe o cuscuz na cuscuzeira sobre água fervente por 10 a 15 minutos em fogo médio; quando o vapor começar a sair pelo topo e a massa firmar, está pronto.
3. Em uma frigideira, frite a linguiça fatiada ou esfarelada em fogo médio-alto por 8 minutos até dourar e liberar gordura; reserve.
4. Na mesma frigideira com um pouco da gordura da linguiça, frite os ovos ao ponto desejado (frito, mexido ou cozido — ao gosto); tempere com sal.
5. Desenforme o cuscuz em um prato, regue com a manteiga derretida e sirva com a linguiça e os ovos ao lado.
💡 Dica: Para um cuscuz mais macio, adicione a manteiga diretamente no fubá antes de umedecer — ela incorpora à massa e deixa a textura mais sedosa.$RX$,
   25,4,'easy','[]'::jsonb,'["leite","ovo"]'::jsonb,'brasileira','community'),
  ('comm-73','Sopa de legumes',
   '[{"name":"Cenoura","canonicalId":"cenoura","quantity":3,"unit":"un"},{"name":"Batata","canonicalId":"batata","quantity":3,"unit":"un"},{"name":"Abobrinha","canonicalId":"abobrinha","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"}]'::jsonb,
   $RX$1. Refogue a cebola picada em fio de azeite em uma panela grande em fogo médio por 5 minutos; adicione o tomate picado sem sementes e cozinhe mais 3 minutos até desmanchar.
2. Adicione as cenouras e batatas descascadas e cortadas em cubos médios; cubra com 1,5 L de água quente e tempere com sal e pimenta.
3. Leve à fervura em fogo alto, depois reduza para médio e cozinhe 15 minutos com a panela semi-tampada.
4. Junte a abobrinha cortada em cubos (ela cozinha mais rápido) e cozinhe mais 10 minutos até todos os legumes ficarem macios ao furar com o garfo.
5. Prove o caldo, ajuste o sal, finalize com cheiro-verde picado e sirva bem quente em prato fundo.
💡 Dica: Para uma sopa mais encorpada, retire uma concha de legumes, amasse-os com um garfo e devolva à panela — engrossa sem precisar de amido.$RX$,
   40,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-74','Purê de batata',
   '[{"name":"Batata","canonicalId":"batata","quantity":800,"unit":"g"},{"name":"Leite","canonicalId":"leite","quantity":150,"unit":"ml"},{"name":"Manteiga","canonicalId":"manteiga","quantity":50,"unit":"g"}]'::jsonb,
   $RX$1. Descasque as batatas, corte em cubos médios e cozinhe em água fervente com sal por 20 a 25 minutos até ficarem bem macias — o garfo deve entrar sem resistência.
2. Escorra toda a água e devolva as batatas à panela em fogo baixo por 1 minuto para secar completamente o excesso de umidade.
3. Amasse as batatas ainda quentes com um espremedor de batatas (nunca no liquidificador para não virar cola) até obter uma massa lisa.
4. Aqueça o leite com a manteiga até quase ferver; despeje aos poucos sobre o purê mexendo com uma colher de pau até atingir a consistência cremosa desejada.
5. Tempere com sal, pimenta e noz-moscada a gosto; sirva imediatamente como acompanhamento.
💡 Dica: Para um purê mais rico e acetinado, substitua parte do leite por creme de leite fresco — a diferença na textura é notável.$RX$,
   30,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'brasileira','community'),
  ('comm-75','Carne de panela',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina","quantity":1,"unit":"kg"},{"name":"Batata","canonicalId":"batata","quantity":4,"unit":"un"},{"name":"Cenoura","canonicalId":"cenoura","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":2,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":4,"unit":"dentes"},{"name":"Tomate","canonicalId":"tomate","quantity":3,"unit":"un"}]'::jsonb,
   $RX$1. Corte a carne em pedaços grandes, tempere com sal, pimenta e alho amassado; aqueça uma panela de pressão em fogo alto com um fio de óleo e sele a carne em lotes até dourar bem por todos os lados — não tampe ainda.
2. Retire a carne e, na mesma panela, refogue a cebola picada em fogo médio por 5 minutos; adicione os tomates picados e cozinhe 3 minutos até soltar o suco.
3. Devolva a carne à panela, cubra com água quente (cerca de 500 ml), tampe e cozinhe em pressão por 30 minutos após pegar pressão em fogo médio.
4. Libere a pressão com cuidado, abra a panela e adicione as batatas e cenouras cortadas em pedaços grandes; tampe novamente e cozinhe em pressão por mais 10 minutos.
5. Abra a panela, verifique o molho — se estiver ralo, cozinhe sem tampa em fogo médio por 5 a 10 minutos até reduzir e encorpar; acerte o sal e sirva com arroz branco.
💡 Dica: Adicione uma col. (sopa) de vinagre no marinado da carne ou durante o cozimento para amaciar as fibras e deixar a carne mais suculenta.$RX$,
   90,6,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-76','Frango assado com batatas',
   '[{"name":"Frango","canonicalId":"frango","quantity":1,"unit":"kg"},{"name":"Batata","canonicalId":"batata","quantity":600,"unit":"g"},{"name":"Alho","canonicalId":"alho","quantity":6,"unit":"dentes"},{"name":"Limão","canonicalId":"limao","quantity":2,"unit":"un"},{"name":"Azeite","canonicalId":"azeite","quantity":4,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Prepare a marinada: misture o suco dos limões, o azeite, o alho amassado, sal, pimenta e temperos a gosto (louro, páprica, alecrim); esfregue bem sobre o frango e deixe marinar pelo menos 30 minutos na geladeira.
2. Pré-aqueça o forno a 200 °C. Descasque as batatas e corte em rodelas ou quartos; tempere com sal, pimenta e um fio de azeite.
3. Distribua as batatas no fundo de uma assadeira grande e disponha os pedaços de frango por cima, despejando toda a marinada sobre eles.
4. Asse em forno a 200 °C por 45 a 50 minutos, regando o frango com o caldo da assadeira na metade do tempo para manter a umidade.
5. Nos últimos 10 minutos, ligue o grill ou aumente para 220 °C para dourar bem a pele do frango até ficar crocante e dourada.
💡 Dica: Cubra a assadeira com papel-alumínio nos primeiros 30 minutos para o frango cozinhar no vapor da marinada; retire para dourar e garantir pele crocante no final.$RX$,
   70,4,'easy','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-77','Arroz à grega',
   '[{"name":"Arroz","canonicalId":"arroz","quantity":2,"unit":"xíc."},{"name":"Cenoura","canonicalId":"cenoura","quantity":1,"unit":"un"},{"name":"Ervilha","canonicalId":"ervilha","quantity":0.5,"unit":"xíc."},{"name":"Uva Passa","canonicalId":"passas","quantity":3,"unit":"col. (sopa)"},{"name":"Milho Verde","canonicalId":"milho-verde","quantity":0.5,"unit":"xíc."}]'::jsonb,
   $RX$1. Lave o arroz em água corrente até a água sair transparente. Em uma panela média, aqueça 1 col. (sopa) de óleo em fogo médio e refogue o arroz por 2 minutos até ficar levemente dourado.
2. Adicione 4 xíc. de água quente e sal a gosto; quando ferver, reduza o fogo ao mínimo, tampe e cozinhe por 15 minutos ou até secar completamente. Desligue e deixe descansar tampado por 5 minutos.
3. Enquanto o arroz cozinha, descasque e corte a cenoura em cubinhos pequenos; cozinhe em água com sal por 5 minutos até ficar macia mas firme. Escorra e reserve.
4. Solte o arroz com um garfo. Incorpore a cenoura, a ervilha, o milho verde e a uva passa; misture delicadamente com uma espátula para não esmagar os grãos.
5. Ajuste o sal, transfira para uma travessa e sirva imediatamente ou em temperatura ambiente.
💡 Dica: Refogue as passas por 1 minuto em manteiga antes de misturar — elas ficam mais suculentas e perfumadas.$RX$,
   30,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-78','Picadinho de carne',
   '[{"name":"Carne Bovina","canonicalId":"carne-bovina","quantity":600,"unit":"g"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Batata","canonicalId":"batata","quantity":2,"unit":"un"}]'::jsonb,
   $RX$1. Corte a carne bovina em cubos de 1,5 cm; tempere com sal e pimenta-do-reino a gosto. Descasque e pique a cebola e o alho; corte os tomates em cubos e a batata em cubos médios.
2. Aqueça 2 col. (sopa) de óleo em fogo alto em uma panela larga. Doure os cubos de carne em lotes (sem lotar a panela) por 3 a 4 minutos até formar crosta; retire e reserve.
3. Na mesma panela, reduza para fogo médio e refogue a cebola por 3 minutos; adicione o alho e refogue mais 1 minuto até dourar.
4. Acrescente o tomate e mexa por 3 minutos até desmanchar e formar um molho. Volte a carne, adicione as batatas e cubra com água quente (aproximadamente 1 xíc.); tampe e cozinhe em fogo médio-baixo por 20 minutos até a batata estar macia.
5. Descubra, aumente o fogo para médio e reduza o molho por 5 minutos até engrossar levemente. Ajuste o sal e sirva com arroz branco.
💡 Dica: Adicione 1 col. (sopa) de molho inglês junto com o tomate para um sabor mais profundo e acastanhado.$RX$,
   40,4,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'brasileira','community'),
  ('comm-79','Salada de batata',
   '[{"name":"Batata","canonicalId":"batata","quantity":4,"unit":"un"},{"name":"Ovo","canonicalId":"ovo","quantity":3,"unit":"un"},{"name":"Maionese","canonicalId":"maionese","quantity":4,"unit":"col. (sopa)"},{"name":"Cenoura","canonicalId":"cenoura","quantity":1,"unit":"un"},{"name":"Cebolinha","canonicalId":"cebolinha","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Cozinhe as batatas com casca em água fervente com sal por 20 a 25 minutos até ficarem macias ao espetar um garfo; escorra e deixe amornar.
2. Na mesma água (ou em outra panela), cozinhe os ovos por 10 minutos para ficarem bem cozidos; resfrie em água gelada, descasque e corte em rodelas. Cozinhe também a cenoura cortada em cubinhos por 5 minutos; escorra.
3. Descasque as batatas ainda mornas e corte em cubos de 2 cm; transfira para uma tigela grande.
4. Adicione a cenoura e misture delicadamente com a maionese até cobrir bem todos os ingredientes; tempere com sal e pimenta-do-reino a gosto.
5. Distribua as rodelas de ovo por cima e finalize com a cebolinha picada; leve à geladeira por pelo menos 20 minutos antes de servir.
💡 Dica: Misture 1 col. (chá) de mostarda à maionese para um toque levemente ácido que equilibra a gordura da salada.$RX$,
   35,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["ovo"]'::jsonb,'brasileira','community'),
  ('comm-80','Sopa de tomate',
   '[{"name":"Tomate","canonicalId":"tomate","quantity":6,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"},{"name":"Manjericão","canonicalId":"manjericao","quantity":2,"unit":"col. (sopa)"},{"name":"Creme de Leite","canonicalId":"creme-leite","quantity":100,"unit":"ml"}]'::jsonb,
   $RX$1. Pique a cebola e o alho. Corte os tomates ao meio. Aqueça 2 col. (sopa) de azeite em fogo médio em uma panela funda e refogue a cebola por 4 minutos até amolecer; adicione o alho e refogue por mais 1 minuto.
2. Acrescente os tomates, sal a gosto e 500 ml de água quente; tampe e cozinhe em fogo médio por 20 minutos até os tomates desmancharem completamente.
3. Desligue o fogo e bata a sopa com mixer (ou liquidificador) até ficar completamente lisa; passe por peneira fina para remover sementes e peles.
4. Volte a sopa peneirada à panela em fogo baixo, adicione o creme de leite e mexa até incorporar; aqueça por 3 minutos sem deixar ferver.
5. Ajuste o sal, distribua em tigelas e finalize com o manjericão fresco rasgado e um fio de azeite.
💡 Dica: Para um sabor mais intenso, asse os tomates cortados ao meio no forno a 200 °C por 20 minutos antes de cozinhá-los na panela.$RX$,
   35,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'italiana','community'),
  ('comm-81','Frittata de legumes',
   '[{"name":"Ovo","canonicalId":"ovo","quantity":6,"unit":"un"},{"name":"Queijo","canonicalId":"queijo","quantity":80,"unit":"g"},{"name":"Abobrinha","canonicalId":"abobrinha","quantity":1,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Pimentão","canonicalId":"pimentao","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Pré-aqueça o forno a 180 °C. Fatie a abobrinha em meia-lua fina, corte a cebola em meias-luas e o pimentão em tiras.
2. Em uma frigideira de 24 cm com cabo que vá ao forno, aqueça 1 col. (sopa) de azeite em fogo médio e refogue a cebola por 3 minutos; adicione o pimentão e a abobrinha e salteie por 4 minutos até macios. Tempere com sal e pimenta a gosto.
3. Bata os ovos em uma tigela com uma pitada de sal; despeje sobre os legumes na frigideira, espalhando uniformemente. Polvilhe o queijo ralado por cima.
4. Cozinhe em fogo baixo por 5 minutos até as bordas firmarem; transfira a frigideira ao forno e asse por 10 a 12 minutos até o centro estar firme e o queijo levemente dourado.
5. Retire do forno, passe uma espátula nas bordas e deixe descansar 2 minutos antes de cortar em fatias e servir.
💡 Dica: Antes de colocar no forno, cubra a frittata com papel-alumínio nos primeiros 5 minutos para assar de forma mais uniforme sem ressecar a superfície.$RX$,
   30,4,'medium','["vegetariano","sem_gluten"]'::jsonb,'["ovo","leite"]'::jsonb,'italiana','community'),
  ('comm-82','Massa ao pesto',
   '[{"name":"Macarrão","canonicalId":"macarrao","quantity":400,"unit":"g"},{"name":"Manjericão","canonicalId":"manjericao","quantity":1,"unit":"xíc."},{"name":"Alho","canonicalId":"alho","quantity":2,"unit":"dentes"},{"name":"Azeite","canonicalId":"azeite","quantity":80,"unit":"ml"},{"name":"Queijo","canonicalId":"queijo","quantity":60,"unit":"g"},{"name":"Nozes","canonicalId":"nozes","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Cozinhe o macarrão em água fervente com sal e 1 fio de azeite pelo tempo indicado na embalagem até al dente; reserve 1 concha da água do cozimento antes de escorrer.
2. Enquanto a massa cozinha, prepare o pesto: no liquidificador ou processador, bata as folhas de manjericão, o alho, as nozes e o queijo ralado por 30 segundos.
3. Com o motor ligado, adicione o azeite em fio contínuo e bata até obter um molho homogêneo; tempere com sal e pimenta-do-reino a gosto.
4. Transfira a massa escorrida para uma tigela grande; adicione o pesto e misture bem, usando a água do cozimento reservada (aos poucos) para deixar o molho cremoso e encorpado.
5. Sirva imediatamente, finalizando com folhas de manjericão fresco e queijo ralado por cima.
💡 Dica: Nunca aqueça o pesto diretamente no fogo — o calor escurece o manjericão e altera o sabor; use apenas o calor residual da massa.$RX$,
   25,4,'easy','["vegetariano"]'::jsonb,'["gluten","leite","castanhas"]'::jsonb,'italiana','community'),
  ('comm-83','Salada de macarrão',
   '[{"name":"Macarrão","canonicalId":"macarrao","quantity":300,"unit":"g"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Queijo","canonicalId":"queijo","quantity":100,"unit":"g"},{"name":"Azeitona","canonicalId":"azeitona","quantity":0.5,"unit":"xíc."},{"name":"Pepino","canonicalId":"pepino","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Cozinhe o macarrão (preferencialmente fusilli ou penne) em água fervente com sal pelo tempo da embalagem até al dente; escorra, resfrie sob água fria corrente e reserve numa tigela grande.
2. Corte os tomates em cubos, o pepino em meias-luas finas e as azeitonas ao meio; corte o queijo em cubinhos.
3. Misture todos os ingredientes ao macarrão frio.
4. Tempere com 3 col. (sopa) de azeite, sal, pimenta-do-reino e orégano seco a gosto; misture bem para envolver todos os ingredientes.
5. Leve à geladeira por pelo menos 15 minutos antes de servir para que os sabores se integrem.
💡 Dica: Adicione 1 col. (sopa) de vinagre balsâmico ao tempero para uma nota levemente adocicada que valoriza o tomate e a azeitona.$RX$,
   30,4,'easy','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'italiana','community'),
  ('comm-84','Minestrone',
   '[{"name":"Feijão","canonicalId":"feijao","quantity":1,"unit":"xíc."},{"name":"Macarrão","canonicalId":"macarrao","quantity":100,"unit":"g"},{"name":"Cenoura","canonicalId":"cenoura","quantity":2,"unit":"un"},{"name":"Batata","canonicalId":"batata","quantity":2,"unit":"un"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Se usar feijão seco, deixe de molho por 8 horas; escorra. Pique a cebola, corte cenoura e batata em cubos de 1,5 cm e os tomates em cubos.
2. Aqueça 2 col. (sopa) de azeite em fogo médio em uma panela grande; refogue a cebola por 3 minutos, adicione o tomate e mexa por 2 minutos até começar a desmanchar.
3. Adicione o feijão, cenoura, batata e 1,5 L de água quente; tempere com sal, pimenta e azeite. Leve à fervura em fogo alto, depois reduza ao mínimo e cozinhe tampado por 25 minutos.
4. Quando o feijão estiver quase macio, acrescente o macarrão quebrado em pedaços menores e cozinhe por mais 10 minutos em fogo médio, mexendo às vezes para não grudar no fundo.
5. Ajuste o sal e a consistência — acrescente água quente se necessário para manter a sopa encorpada mas não grossa demais; sirva quente com pão rústico.
💡 Dica: Adicione 1 col. (chá) de pasta de tomate junto com o tomate fresco para um caldo mais saboroso e de cor vibrante.$RX$,
   45,4,'medium','["vegetariano","vegano"]'::jsonb,'["gluten"]'::jsonb,'italiana','community'),
  ('comm-85','Nachos',
   '[{"name":"Tortilla","canonicalId":"tortilla","quantity":200,"unit":"g"},{"name":"Queijo","canonicalId":"queijo","quantity":150,"unit":"g"},{"name":"Feijão","canonicalId":"feijao","quantity":1,"unit":"xíc."},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Pimentão","canonicalId":"pimentao","quantity":1,"unit":"un"}]'::jsonb,
   $RX$1. Pré-aqueça o forno a 200 °C. Escorra e enxágue o feijão (se enlatado); corte os tomates e o pimentão em cubos pequenos.
2. Misture tomate, pimentão e feijão em uma tigela; tempere com sal, cominho e pimenta a gosto para fazer uma salsa rápida.
3. Distribua os chips de tortilla em uma assadeira grande formando uma camada uniforme.
4. Espalhe a salsa de feijão e vegetais sobre os chips; cubra generosamente com o queijo ralado.
5. Leve ao forno por 10 a 12 minutos até o queijo derreter e borbulhar levemente nas bordas; sirva imediatamente direto da assadeira.
💡 Dica: Para nachos mais crocantes, distribua os chips em camada simples sem sobrepor — a gordura do queijo que acumula em pilhas amolece os chips embaixo.$RX$,
   25,4,'easy','["vegetariano"]'::jsonb,'["gluten","leite"]'::jsonb,'mexicana','community'),
  ('comm-86','Sopa de feijão',
   '[{"name":"Feijão","canonicalId":"feijao","quantity":1.5,"unit":"xíc."},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"},{"name":"Pimentão","canonicalId":"pimentao","quantity":1,"unit":"un"},{"name":"Cominho","canonicalId":"cominho","quantity":1,"unit":"col. (chá)"}]'::jsonb,
   $RX$1. Se usar feijão seco, deixe de molho por 8 horas; escorra. Pique cebola e alho; corte tomate e pimentão em cubos.
2. Aqueça 2 col. (sopa) de óleo em fogo médio em uma panela; refogue a cebola por 3 minutos, adicione o alho e o cominho e refogue por 1 minuto até perfumar.
3. Acrescente o pimentão e o tomate; refogue por 3 minutos. Adicione o feijão e 1 L de água quente; tempere com sal a gosto.
4. Leve à fervura, reduza ao fogo mínimo, tampe e cozinhe por 30 minutos (feijão enlatado já escorrido: pule o cozimento longo e use apenas 500 ml de água, cozinhando por 15 minutos).
5. Com um espremedor ou colher, amasse levemente parte do feijão para engrossar o caldo; ajuste o sal e sirva quente com tortilla ou arroz.
💡 Dica: Adicione 1 col. (chá) de páprica defumada junto ao cominho — ela realça o sabor da sopa e dá uma cor avermelhada muito bonita.$RX$,
   40,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'mexicana','community'),
  ('comm-87','Frango agridoce',
   '[{"name":"Frango","canonicalId":"frango","quantity":600,"unit":"g"},{"name":"Abacaxi","canonicalId":"abacaxi","quantity":200,"unit":"g"},{"name":"Pimentão","canonicalId":"pimentao","quantity":1,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Ketchup","canonicalId":"ketchup","quantity":4,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Corte o frango em cubos de 3 cm; tempere com sal, pimenta e 1 col. (chá) de gengibre em pó. Corte o pimentão e a cebola em quadrados e o abacaxi em cubos.
2. Aqueça 2 col. (sopa) de óleo em fogo alto em uma wok ou frigideira grande; sele os cubos de frango em lotes por 4 a 5 minutos até dourar; retire e reserve.
3. Na mesma panela em fogo médio-alto, salteie a cebola e o pimentão por 3 minutos até ficarem levemente macios mas ainda crocantes.
4. Prepare o molho: misture o ketchup com 2 col. (sopa) de açúcar, 2 col. (sopa) de vinagre e 3 col. (sopa) de água; despeje sobre os legumes, mexa e deixe ferver por 1 minuto.
5. Volte o frango à panela, acrescente o abacaxi e misture bem; cozinhe por mais 3 minutos em fogo médio até o molho encorpar e envolver tudo. Sirva com arroz branco.
💡 Dica: Use abacaxi fresco em vez de enlatado — a acidez natural equilibra melhor o molho e evita que fique excessivamente doce.$RX$,
   35,4,'medium','["sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'asiatica','community'),
  ('comm-88','Salada oriental de pepino',
   '[{"name":"Pepino","canonicalId":"pepino","quantity":2,"unit":"un"},{"name":"Shoyu","canonicalId":"shoyu","quantity":3,"unit":"col. (sopa)"},{"name":"Gergelim","canonicalId":"gergelim","quantity":2,"unit":"col. (sopa)"},{"name":"Vinagre","canonicalId":"vinagre","quantity":2,"unit":"col. (sopa)"},{"name":"Alho","canonicalId":"alho","quantity":1,"unit":"dente"}]'::jsonb,
   $RX$1. Lave os pepinos e corte-os em rodelas finas de 2 mm (com casca para mais crocância e cor); coloque em uma tigela e misture com uma pitada de sal; deixe descansar 10 minutos para soltar água.
2. Escorra o líquido que se formou no fundo da tigela e seque levemente o pepino com papel-toalha.
3. Rale ou pique finamente o dente de alho; misture com shoyu, vinagre e 1 col. (chá) de açúcar até dissolver.
4. Despeje o molho sobre os pepinos e misture bem; deixe marinar por 5 minutos para absorver os sabores.
5. Transfira para pratos, polvilhe o gergelim tostado por cima e sirva em temperatura ambiente como entrada ou acompanhamento.
💡 Dica: Torre o gergelim em frigideira seca em fogo médio por 2 minutos mexendo sempre — o aroma fica muito mais intenso do que o gergelim cru.$RX$,
   15,2,'easy','["vegetariano","vegano","sem_lactose"]'::jsonb,'["soja","gluten"]'::jsonb,'asiatica','community'),
  ('comm-89','Sopa oriental de macarrão',
   '[{"name":"Macarrão","canonicalId":"macarrao","quantity":200,"unit":"g"},{"name":"Ovo","canonicalId":"ovo","quantity":2,"unit":"un"},{"name":"Cenoura","canonicalId":"cenoura","quantity":1,"unit":"un"},{"name":"Shoyu","canonicalId":"shoyu","quantity":3,"unit":"col. (sopa)"},{"name":"Cebolinha","canonicalId":"cebolinha","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Corte a cenoura em palitos ou rodelas finas. Aqueça 800 ml de água com 1 col. (chá) de shoyu e a cenoura em fogo médio-alto; quando ferver, cozinhe a cenoura por 5 minutos.
2. Adicione o macarrão (tipo lamen ou espaguete fino) ao caldo fervente e cozinhe pelo tempo da embalagem até al dente; ajuste o sal com o shoyu restante.
3. Enquanto o macarrão cozinha, cozinhe os ovos à parte em água fervente por 7 minutos para gema ainda levemente molinha (mollet); resfrie em água gelada e descasque cuidadosamente.
4. Distribua o macarrão e o caldo em duas tigelas fundas; posicione o ovo cortado ao meio sobre o macarrão.
5. Finalize com a cebolinha fatiada fina e, se desejar, 1 fio de óleo de gergelim; sirva imediatamente bem quente.
💡 Dica: Para um caldo mais aromático, refogue 1 col. (chá) de gengibre ralado e 1 dente de alho amassado em óleo antes de adicionar a água.$RX$,
   25,2,'easy','["vegetariano"]'::jsonb,'["gluten","ovo","soja"]'::jsonb,'asiatica','community'),
  ('comm-90','Arroz com curry e ervilha',
   '[{"name":"Arroz","canonicalId":"arroz","quantity":2,"unit":"xíc."},{"name":"Curry","canonicalId":"curry","quantity":2,"unit":"col. (chá)"},{"name":"Ervilha","canonicalId":"ervilha","quantity":1,"unit":"xíc."},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Leite de Coco","canonicalId":"leite-coco","quantity":200,"unit":"ml"}]'::jsonb,
   $RX$1. Pique a cebola em cubos pequenos. Aqueça 1 col. (sopa) de óleo em fogo médio em uma panela; refogue a cebola por 3 minutos até amolecer e ficar levemente dourada.
2. Adicione o curry e mexa por 1 minuto em fogo médio até perfumar o óleo — cuidado para não queimar.
3. Acrescente o arroz lavado e mexa por 2 minutos até envolver bem nos temperos.
4. Despeje o leite de coco e 300 ml de água quente; adicione sal a gosto. Leve à fervura em fogo alto, depois reduza ao mínimo, tampe e cozinhe por 15 minutos.
5. Adicione a ervilha, misture delicadamente com um garfo, tampe novamente e deixe descansar por 5 minutos com o fogo desligado antes de servir.
💡 Dica: Use ervilha congelada diretamente (sem descongelar antes) — ela amorna com o vapor residual do arroz e mantém a cor verde vibrante.$RX$,
   30,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'indiana','community'),
  ('comm-91','Sopa de lentilha temperada',
   '[{"name":"Lentilha","canonicalId":"lentilha","quantity":1.5,"unit":"xíc."},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Alho","canonicalId":"alho","quantity":3,"unit":"dentes"},{"name":"Cenoura","canonicalId":"cenoura","quantity":2,"unit":"un"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Cominho","canonicalId":"cominho","quantity":1,"unit":"col. (chá)"}]'::jsonb,
   $RX$1. Lave a lentilha em água corrente e escorra. Pique a cebola e o alho; corte a cenoura em rodelas e os tomates em cubos.
2. Aqueça 2 col. (sopa) de azeite em fogo médio em uma panela funda; refogue a cebola por 3 minutos, adicione o alho e o cominho e refogue por mais 1 minuto até perfumar.
3. Acrescente o tomate e mexa por 2 minutos; adicione a cenoura, a lentilha lavada e 1,2 L de água quente. Tempere com sal e pimenta a gosto.
4. Leve à fervura em fogo alto, reduza ao mínimo, tampe e cozinhe por 25 minutos até a lentilha estar completamente macia.
5. Com um mixer, bata parcialmente a sopa (ou bata metade e volte à panela) para obter textura cremosa mas com pedaços; ajuste o sal e sirva com pão naan ou pita.
💡 Dica: Finalize com um tarka: aqueça 1 col. (sopa) de manteiga clarificada com 0,5 col. (chá) de cominho em sementes e paprica até chiar; despeje sobre a sopa na tigela.$RX$,
   40,4,'easy','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'indiana','community'),
  ('comm-92','Mujadara (arroz com lentilha)',
   '[{"name":"Arroz","canonicalId":"arroz","quantity":1,"unit":"xíc."},{"name":"Lentilha","canonicalId":"lentilha","quantity":1,"unit":"xíc."},{"name":"Cebola","canonicalId":"cebola","quantity":2,"unit":"un"},{"name":"Cominho","canonicalId":"cominho","quantity":1,"unit":"col. (chá)"}]'::jsonb,
   $RX$1. Lave a lentilha e o arroz separadamente em água corrente; deixe a lentilha de molho por 20 minutos e escorra.
2. Cozinhe a lentilha em 600 ml de água com sal e fervura por 10 minutos — ela deve estar quase cozida mas ainda firme; não escorra, reserve com o caldo.
3. Em uma panela larga, aqueça 3 col. (sopa) de azeite em fogo médio-alto; fatie as cebolas em meias-luas finas e frite por 15 a 20 minutos mexendo ocasionalmente até ficarem bem douradas e caramelizadas; retire metade e reserve para decorar.
4. Com a cebola restante na panela, adicione o cominho e refogue 30 segundos; acrescente o arroz e mexa por 2 minutos. Adicione a lentilha com seu caldo e água suficiente para cobrir (total de 500 ml de líquido); tempere com sal.
5. Leve à fervura, reduza ao mínimo, tampe e cozinhe por 15 a 18 minutos até arroz e lentilha absorverem o líquido; desligue e deixe descansar 5 minutos. Sirva coberto com a cebola caramelizada reservada.
💡 Dica: Não mexa o mujadara durante o cozimento — deixar quieto é o segredo para os grãos ficarem soltinhos e não virarem papa.$RX$,
   45,4,'medium','["vegetariano","vegano","sem_gluten","sem_lactose"]'::jsonb,'[]'::jsonb,'arabe','community'),
  ('comm-93','Wrap de frango',
   '[{"name":"Tortilla","canonicalId":"tortilla","quantity":2,"unit":"un"},{"name":"Frango","canonicalId":"frango","quantity":300,"unit":"g"},{"name":"Alface","canonicalId":"alface","quantity":4,"unit":"fatias"},{"name":"Tomate","canonicalId":"tomate","quantity":1,"unit":"un"},{"name":"Requeijão","canonicalId":"requeijao","quantity":4,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Tempere o frango (peito ou filé) com sal, pimenta, 1 col. (chá) de azeite e alho a gosto; grelhe em frigideira antiaderente em fogo médio por 5 a 6 minutos de cada lado até dourar e cozinhar por completo.
2. Deixe o frango descansar 5 minutos antes de fatiar em tiras finas no sentido contrário às fibras.
3. Aqueça as tortillas uma a uma em frigideira seca por 30 segundos de cada lado até ficarem macias e levemente douradas.
4. Sobre cada tortilla aquecida, espalhe 2 col. (sopa) de requeijão; distribua as folhas de alface, o tomate fatiado e as tiras de frango grelhado.
5. Enrole firme, formando o wrap: dobre as laterais primeiro e depois enrole do lado mais recheado para o oposto; corte ao meio na diagonal e sirva imediatamente.
💡 Dica: Adicione 1 col. (chá) de molho sriracha ou tabasco ao requeijão antes de espalhar para um wrap com toque apimentado sem comprometer a cremosidade.$RX$,
   20,2,'easy','[]'::jsonb,'["gluten","leite"]'::jsonb,'arabe','community'),
  ('comm-94','Sopa de milho',
   '[{"name":"Milho Verde","canonicalId":"milho-verde","quantity":2,"unit":"xíc."},{"name":"Batata","canonicalId":"batata","quantity":2,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":1,"unit":"un"},{"name":"Leite","canonicalId":"leite","quantity":300,"unit":"ml"},{"name":"Creme de Leite","canonicalId":"creme-leite","quantity":100,"unit":"ml"}]'::jsonb,
   $RX$1. Pique a cebola em cubos; descasque e corte a batata em cubos médios. Aqueça 1 col. (sopa) de manteiga em fogo médio em uma panela e refogue a cebola por 3 minutos até amolecer.
2. Acrescente a batata, o milho e 500 ml de água quente; tempere com sal a gosto. Leve à fervura, reduza o fogo, tampe e cozinhe por 15 minutos até a batata estar macia.
3. Transfira metade da sopa para o liquidificador, adicione o leite e bata até obter um creme liso; volte à panela e misture com a parte não batida para criar textura ao mesmo tempo cremosa e com pedaços.
4. Aqueça a sopa em fogo baixo por 3 minutos; adicione o creme de leite e mexa delicadamente sem deixar ferver para não talhar.
5. Ajuste o sal, distribua em tigelas e sirva com pimenta-do-reino moída na hora e torradinhas ou croutons.
💡 Dica: Para uma sopa mais encorpada sem creme de leite extra, bata 1 col. (sopa) de amido de milho dissolvida em leite frio antes de adicionar à panela e aqueça mexendo.$RX$,
   35,4,'easy','["vegetariano","sem_gluten"]'::jsonb,'["leite"]'::jsonb,'americana','community'),
  ('comm-95','Salada de grão-de-bico',
   '[{"name":"Grão-de-bico","canonicalId":"grao-de-bico","quantity":400,"unit":"g"},{"name":"Tomate","canonicalId":"tomate","quantity":2,"unit":"un"},{"name":"Pepino","canonicalId":"pepino","quantity":1,"unit":"un"},{"name":"Cebola","canonicalId":"cebola","quantity":0.5,"unit":"un"},{"name":"Azeite","canonicalId":"azeite","quantity":3,"unit":"col. (sopa)"}]'::jsonb,
   $RX$1. Se usar grão-de-bico enlatado, escorra e lave em água corrente; se seco, deixe de molho por 12 horas e cozinhe em água com sal por 40 minutos até macio, depois escorra e deixe esfriar.
2. Corte os tomates em cubos, o pepino em meias-luas finas e a meia cebola em fatias bem finas; transfira tudo para uma tigela grande.
3. Adicione o grão-de-bico à tigela e misture delicadamente.
4. Tempere com o azeite, suco de meio limão, sal e pimenta-do-reino a gosto; misture até incorporar.
5. Deixe descansar 10 minutos na geladeira antes de servir para que os sabores se integrem; finalize com salsa ou hortelã fresca picada a gosto.
💡 Dica: Adicione 0,5 col. (chá) de cominho em pó ao tempero — ele é o toque mediterrâneo que amarra todos os sabores desta salada.$RX$,
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
