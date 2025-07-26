interface CategorieProps {
  title: string;
  instance: string;
  chatGroupId: string;
  invoiceId: string;
  context: string;
  keywords: string[];
}

function generateSmartAIPrompt(categories: CategorieProps[]) {
  const lines = categories
    .filter((cat) => cat.instance !== "outros-itens")
    .map((cat, index) => {
      const number = index + 1;
      const keywords = cat.keywords.slice(0, 20).join(", ");
      return `${number}. ${cat.title} - ${cat.context} Exemplos: ${keywords}.`;
    });

  // Regra final reforçada
  lines.push(
    `${categories.length}. ❓ Outros Itens - Se não identificar com certeza absoluta, retorne 'outros-itens'. Qualquer dúvida, mesmo mínima, exige esta opção.`
  );

  return lines.join("\n");
}

export const categories: CategorieProps[] = [
  {
    title: "👚 Moda & Beleza",
    instance: "moda-beleza",
    chatGroupId: "120363419865644127",
    invoiceId: "JAvD5UMGtYGHCAxUzEXz2m",
    context:
      "Produtos de vestuário, calçados, acessórios e cuidados pessoais. Inclui roupas femininas, masculinas, infantis, bolsas, sapatos, tênis, bonés, joias, maquiagem, skincare, perfumes e cosméticos.",
    keywords: [
      "roupa",
      "vestido",
      "blusa",
      "calça",
      "camiseta",
      "tênis",
      "sapato",
      "salto",
      "bolsa",
      "mochila",
      "boné",
      "óculos de sol",
      "maquiagem",
      "batom",
      "esmalte",
      "base",
      "delineador",
      "sombra",
      "hidratante",
      "protetor solar",
      "perfume",
      "colônia",
      "barba",
      "barbeador",
      "depilação",
      "creme",
      "loção",
      "skincare",
      "cosmético",
      "joia",
      "acessório",
      "body",
      "macacão",
    ],
  },
  {
    title: "💻 Tecnologia & Informática",
    instance: "tecnologia-informatica",
    chatGroupId: "120363419569951578",
    invoiceId: "He2TE0Vyl4h7gih07vKqYt",
    context:
      "Equipamentos e acessórios de informática e eletrônicos avançados. Inclui computadores, notebooks, monitores, periféricos, HDs, SSDs, roteadores e produtos para trabalho remoto.",
    keywords: [
      "computador",
      "notebook",
      "PC",
      "desktop",
      "monitor",
      "teclado",
      "mouse",
      "impressora",
      "pen drive",
      "HD",
      "SSD",
      "disco rígido",
      "placa de vídeo",
      "placa-mãe",
      "fonte",
      "gabinete",
      "cooler",
      "periférico",
      "USB",
      "HDMI",
      "Wi-Fi",
      "roteador",
      "repetidor",
      "automação",
      "smart home",
      "home office",
      "hub USB",
      "webcam",
      "microfone",
      "câmera",
    ],
  },
  {
    title: "📱 Celulares & Telefonia",
    instance: "celulares-telefonia",
    chatGroupId: "120363401797994011",
    invoiceId: "GVk07NEoqT3AR7bQHDgxvy",
    context:
      "Produtos relacionados a smartphones, telefonia móvel e acessórios. Inclui celulares, capas, fones, carregadores, power banks, smartwatches e chips.",
    keywords: [
      "celular",
      "smartphone",
      "iPhone",
      "Samsung",
      "Xiaomi",
      "Motorola",
      "capa",
      "película",
      "carregador",
      "cabo",
      "power bank",
      "fone de ouvido",
      "fone Bluetooth",
      "caixa de som",
      "caixa de som Bluetooth",
      "smartwatch",
      "relógio inteligente",
      "fones sem fio",
      "chip",
      "plano de dados",
      "5G",
      "Bluetooth",
      "Wi-Fi",
      "tablet",
      "fone sem fio",
    ],
  },
  {
    title: "🛋 Casa & Decoração",
    instance: "casa-decoracao",
    chatGroupId: "120363419396234119",
    invoiceId: "CI6TKtRY1GNJiogzVxywwA",
    context:
      "Itens para decoração, organização e conforto do lar. Inclui móveis, quadros, luminárias, tapetes, cortinas, utensílios de cozinha e produtos para banheiro.",
    keywords: [
      "móvel",
      "mesa",
      "cadeira",
      "sofá",
      "estante",
      "quadro",
      "vaso",
      "luminária",
      "tapete",
      "cortina",
      "almofada",
      "organizador",
      "porta-revistas",
      "porta-trecos",
      "cozinha",
      "panela",
      "talher",
      "copo",
      "jarra",
      "banheiro",
      "toalha",
      "cama",
      "edredom",
      "travesseiro",
      "jardim",
      "planta",
      "decoração",
      "home office",
      "abajur",
      "prateleira",
      "móvel planejado",
    ],
  },
  {
    title: "⚡ Eletrodomésticos",
    instance: "eletrodomesticos",
    chatGroupId: "120363403777938453",
    invoiceId: "F2Bc3KSvAPBIgpBrnaOkqw",
    context:
      "Eletrodomésticos grandes e pequenos para facilitar o dia a dia. Inclui geladeiras, fogões, lavadoras, micro-ondas, fornos, ar-condicionado e aspiradores.",
    keywords: [
      "geladeira",
      "fogão",
      "lavadora",
      "máquina de lavar",
      "micro-ondas",
      "forno elétrico",
      "ar-condicionado",
      "ferro de passar",
      "aspirador",
      "liquidificador",
      "cafeteira",
      "batedeira",
      "torradeira",
      "ventilador",
      "umidificador",
      "depurador",
      "exaustor",
      "eletrodoméstico",
      "eletro",
      "forno",
      "coifa",
      "freezer",
      "maquina de lavar louça",
    ],
  },
  {
    title: "🏃 Esporte & Lazer",
    instance: "esporte-lazer",
    chatGroupId: "120363421678870592",
    invoiceId: "J9l0ExczCqFDdazKbcVwoq",
    context:
      "Produtos para atividades físicas, esportes e momentos de lazer. Inclui roupas esportivas, equipamentos de academia, bicicletas, camping e produtos para praia e piscina.",
    keywords: [
      "academia",
      "musculação",
      "halter",
      "barra",
      "esteira",
      "bicicleta",
      "bike",
      "patins",
      "skate",
      "prancha",
      "piscina",
      "bóia",
      "colchão inflável",
      "praia",
      "óculos de natação",
      "pesca",
      "vara",
      "molinete",
      "caiaque",
      "camping",
      "barraca",
      "lanterna",
      "mochila",
      "trilha",
      "tênis esportivo",
      "roupão esportivo",
      "roupa de academia",
      "kit de camping",
    ],
  },
  {
    title: "👶 Infantil & Gestantes",
    instance: "infantil-gestantes",
    chatGroupId: "120363417121375890",
    invoiceId: "DL2Dh1mrJLE13my5RcZt2l",
    context:
      "Produtos para bebês, crianças e gestantes. Inclui enxoval, fraldas, mamadeiras, carrinhos, cadeirinhas, roupas infantis e brinquedos educativos.",
    keywords: [
      "bebê",
      "criança",
      "gestante",
      "enxoval",
      "fralda",
      "mamadeira",
      "chupeta",
      "carrinho",
      "berço",
      "cadeirinha",
      "roupão",
      "body",
      "macacão",
      "brinquedo",
      "livro infantil",
      "amamentação",
      "bomba de leite",
      "fraldário",
      "banheira",
      "andador",
      "chocalho",
      "mordedor",
      "carrinho de bebê",
      "cadeirinha de carro",
      "berço",
      "babador",
      "mamadeira",
      "berço",
    ],
  },
  {
    title: "🧴 Saúde & Bem-estar",
    instance: "saude-bem-estar",
    chatGroupId: "120363403321030172",
    invoiceId: "BBCB2fRFZLKChG9jCa1pSa",
    context:
      "Produtos focados em saúde, autocuidado e bem-estar físico e mental. Inclui suplementos, vitaminas, cremes, massageadores e itens de aromaterapia.",
    keywords: [
      "suplemento",
      "vitamina",
      "ômega 3",
      "colágeno",
      "termogênico",
      "emagrecimento",
      "multivitamínico",
      "cápsula",
      "comprimido",
      "cuidado bucal",
      "escova de dente",
      "fio dental",
      "creme íntimo",
      "dor nas costas",
      "massageador",
      "massagem",
      "acupuntura",
      "aromaterapia",
      "difusor",
      "óleo essencial",
      "bem-estar",
      "autocuidado",
      "saúde",
      "antiestresse",
      "colágeno",
      "termogênico",
    ],
  },
  {
    title: "🐶 Pets e Animais",
    instance: "pets-animais",
    chatGroupId: "120363420081792695",
    invoiceId: "GcRXI4HEFjc377BuQzHQmc",
    context:
      "Produtos para cães, gatos, aves, roedores e outros animais de estimação. Inclui ração, petiscos, coleiras, caminhas, brinquedos e produtos de higiene.",
    keywords: [
      "pet",
      "cachorro",
      "gato",
      "ração",
      "petisco",
      "coleira",
      "guia",
      "caminha",
      "brinquedo pet",
      "shampoo pet",
      "escova",
      "comedouro",
      "bebedouro",
      "transportadora",
      "gaiola",
      "aquário",
      "roedor",
      "hamster",
      "coelho",
      "peixe",
      "pássaro",
      "pet house",
      "arranhador",
      "vermífugo",
      "antipulgas",
      "coleira antipulgas",
      "casinha",
      "casinha de cachorro",
      "comida de cachorro",
    ],
  },
  {
    title: "❓ Outros Itens",
    instance: "outros-itens",
    chatGroupId: "120363420702331766",
    invoiceId: "E0f5lr2fnNGKDnGechn5fc",
    context:
      "Produtos que não se encaixam claramente em nenhuma das categorias acima, ou mensagens com informações insuficientes. Inclui links genéricos, ofertas sem descrição ou produtos ambíguos.",
    keywords: [
      "promoção",
      "oferta",
      "link",
      "desconto",
      "imperdível",
      "incrível",
      "confira",
      "não perca",
      "algo legal",
      "coisa boa",
      "desconto relâmpago",
      "link bizarro",
      "não sei o que é",
      "produto desconhecido",
      "oferta exclusiva",
      "promo",
      "oferta relâmpago",
    ],
  },
];

const slicedCategegories = categories.map((categorie) => {
  return {
    title: categorie.title,
    instance: categorie.instance,
    chatGroupId: categorie.chatGroupId,
    invoiceId: categorie.invoiceId,
  };
});

export const promptProduct = `INSTRUÇÕES: 

Você é um classificador de produtos altamente especializado e precisa analisar cada mensagem ou link recebido com o objetivo de identificar a categoria correta, extrair o link, identificar o marketplace de origem, identificar o preço atual e preço anterior, descrever o produto, associar um emoji condizente e criar uma pequena copy de venda envolvente para encaminhar ao grupo apropriado.

Sua tarefa é ler a mensagem, extrair palavras-chave, identificar o tipo de produto, extrair o link, identificar o marketplace e associar com 99% de acurácia a uma das categorias listadas abaixo.

${generateSmartAIPrompt(categories)}

# 📌 Instruções Específicas:

- Leia atentamente a mensagem ou link recebido.
- Identifique inicialmente, se a mensagem recebida trata-se de algum tipo de anúncio de venda de produto, caso contrário já descarte a mensagem.
- Extraia palavras-chave e termos técnicos que indiquem o tipo de produto.
- Identifique a categoria mais apropriada com base na lista abaixo.
- Associe com base no significado e contexto, não apenas palavras isoladas.
- Use raciocínio lógico e conhecimento de mercado para identificar categorias implícitas.
- Descreva o produto com todas as características identificadas numa frase curta e clara (product).
- Associe um emoji que represente bem o produto (emoji).
- Extraia o link (URL) presente na mensagem.
- Se houver ambiguidade ou falta de informações, retorne "Outros itens".
- Identifique o marketplace com base no domínio do link.
- Identifique o valor atual do produto (value) .
- Se houver indicação de preço anterior (ex: "De R$ 200,00 por R$ 120,00"), inclua o campo valueBefore.
- Os campos de valores deve estar no formato #.##, completando com zeros a direita quando necessário;
- Nunca force uma associação se a mensagem for imprecisa ou genérica.
- Se houver múltiplas categorias na mesma mensagem, priorize a categoria principal ou retorne "Outros itens" caso não seja possível decidir com segurança.
- Se houver ambiguidade ou falta de informações, retorne "outros-itens" como categoria.
- Crie uma pequena frase de venda (storytelling) com até 100 caracteres, usando gatilhos mentais e linguagem informal, conectada com o dia a dia do brasileiro comum. Pode incluir uma piada ou referência cultural leve. Use emojis que façam sentido à mensagem, deixando o texto mais elegante. Se usar gírias ou ditos populares, estes só podem ser de origem da cultura brasileira e escritos exclusivamente em português. Evite palavras em outros idiomas que não seja português. Se identificar escassez na mensagem original incremente a frase storytelling com a mesma urgência. Seja engraçadao. Não deixe o texto original te influenciar. Use a criatividade e crie seu proprio texto. Pode usar a ideia, mas evite simplesmente copiar e colar a mensagem original. Capriche!
- Na frase, evite comparações que não fazem sentido. Por exemplo, dizer que um produto X ta mais barato que 'pastel', sendo que o produto é 30 reais. Como? Então evite comparações desnecessárias e sem lógica ou fundamento.
- Identifique cupons de descontos nas mensagnes, se encontrar retorne em "coupons". Importante, analise se o cupom encontrado em formato mesmo de cupom em string unica. Evite cupons que dizem: 'Click no link para ativar o cupom', descarte os cupons nestes casos.


# 🔍 Contexto para Identificação de Marketplace
Use os seguintes padrões para identificar o marketplace com base no link:

Marketplaces disponíveis e habilitados para geração de mensagem:

- Amazon : amzn.to ou amazon.com.br - (Retornar instancia: "amazon");
- Mercado Livre : mercadolivre.com.br ou ml.com.br - (Retornar instancia: "mercado-livre");
- Shopee : shopee.com.br ou s.shopee.com.br - (Retornar instancia: "shopee");
- AliExpress : aliexpress.com ou s.click.aliexpress.com - (Retornar instancia: "aliexpress");


# ❌ Caso não seja possível identificar:

Caso 1: Se for idenfitifaco que o texto ou link refere-se a um produto verdadeiramente existente, mas que não se encaixa em nenhuma das categorias existentes, você deve atribuir à categoria de instância "outros-itens"..

# Exemplo 1:
"Link imperdível para compra de um raspador de pelos de ratos essencial para sua beleza..."

Analise do Exemplo 1:
- Claramenten é a venda de algum produto, mas definitivamente, não possui referÊncia a nenhuma das categorias predefinidas. Nesse caso, o produto vai para o grupo de "outros-itens".

# Exemplo 1.2:
"Percarbonato De Sódio 3kg 2kg e 1kg Los Chef Alvejante Tira Machas Roupa Branca e Colorida"

Analise do Exemplo 1.2:
- Nesse caso, não sei porque exemplos em testes, retornou como "eletrodomesticos", mas acho que não seria. Se encaixaria talvez, em "casa-decoracao", mas enfim, tem-se aqui uma dúvida. Então nesse caso, o produto deve impreterivelmente ir para o grupo de "outros-itens".

Agora...

Caso 2: Se a mensagem não tem referÊncia ou não faz alusão a nenhum produto claramente, esta mensagem deve ser definitivamente descartada. Mas atenção, aqui, só deve descartar a mensagem, se e somente se, for constatado com 100% de eficácia, que este texto não refere-se a uma sugestão de algum produto que possa ser comprado.

# Exemplo 2: Mensagem recebida:  
"Link imperdível! Aproveite essa promoção incrível!"

Resposta esperada:  
Descartar imediatamente a mensagem, e informar: "Anuncio invalido".


Enfim, abaixo, segue as categegorias agrupadas em um JSON para aperfeiçoamento das respostas...


# ❌ Caso não seja possível identificar qual o MarketPlace:

- Só é permitido considerar mensagens que contenham links destes marketplaces listados acima;
- IGNORAR COMPLETAMENTE QUALQUER MENSAGEM DE MARKETPLACES DIFERENTES DOS LISTADOS!!!
- Se a mensagem recebida não for de nenhum destes marketplaces: Amazon, Mercado Livre, Shopee, AliExpress : deverá retornar uma mensagem para o usuário informando que o marketplace é inválido. E que só é permitido os marketplaces listados acima;


# 📋 Categorias Disponíveis:

${JSON.stringify(slicedCategegories)}

# ✅ Exemplo de Resposta 1:
Mensagem recebida:
- "Oferta relâmpago! Fone de ouvido Bluetooth com cancelamento de ruído por R$ 89,90. Frete grátis! https://amzn.to/4lz1crS"

- Resposta esperada - um objeto convertido em json:
{
  "instance": "celulares-telefonia",
  "chatGroupId": "120363401797994011",
  "invoiceId": "GVk07NEoqT3AR7bQHDgxvy",
  "url": "https://amzn.to/4lz1crS ",
  "marketplace": "amazon",
  "value": 89.90,
  "product": "Fone de ouvido Bluetooth com cancelamento de ruído",
  "emoji": "🎧",
  "storytelling": "Foge do barulho do vizinho e escuta seu som sem pagar caro!",
  "coupons": null
}

# 🧪 Estrutura de Saída (Obrigatória):

A saída deve seguir sempre o formato:

> ⚠️ O retorno deve conter com todos os atributos pedidos. Isso garante a integração direta com seu sistema de rotas ou envio automático.

> ⚠️ Se o marketplace não for identificado, ou , for de alguma marketplace diferente dos marketplaces disponíveis neste prompt, a mensagem deverá autmaticamente descartada, informando ao usuário que o marketplace identificado é inválido ou não existe e desconsiderar o padrão de retorno atribuido abaixo.

No caso de marketplace inválido, o retorno deverá ser:

"Marketplace inválido"

Mas, se o marketplace for válido e passar no teste acima o resutlado deve seguir o padrão abaixo.

## 🚀 Como usar no seu sistema:

Com base na resposta da IA ('instance'), seu sistema consulta a tabela de categorias e obtém o 'chatGroupId' correspondente.

A saída deve seguir sempre exclusivamente como o formato abaixo:
{
  "instance": "[instance]",
  "chatGroupId": "[chatGroupId]",
  "invoiceId": "[invoiceId]",
  "url": "[url_encontrada]",
  "marketplace": "[marketplace]",
  "value": [valor_atual ou null],
  "valueBefore": [valor_anterior ou null],
  "product": "[product-description]",
  "emoji": "[emoji]",
  "storytelling": "[storytelling]",
  "coupons": "[coupons]"
}
`;
