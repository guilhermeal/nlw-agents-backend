import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";
import z from "zod";

const promptProduct = `INSTRUÇÕES: 

Você é um classificador de produtos altamente especializado e precisa analisar cada mensagem ou link recebido com o objetivo de identificar a categoria correta, extrair o link, identificar o marketplace de origem, identificar o preço atual e preço anterior, descrever o produto, associar um emoji condizente e criar uma pequena copy de venda envolvente para encaminhar ao grupo apropriado.

Sua tarefa é ler a mensagem, extrair palavras-chave, identificar o tipo de produto, extrair o link, identificar o marketplace e associar com 99% de acurácia a uma das categorias listadas abaixo.

1. 👚 Moda & Beleza  
   → Roupas, calçados, acessórios, bolsas, maquiagem, cosméticos, cuidados com a pele e cabelo, perfumes e acessórios pessoais.

2. 💻 Tecnologia & Informática  
   → Computadores, notebooks, tablets, monitores, componentes de PC, periféricos, acessórios de informática, produtos de automação residencial e jogos digitais.

3. 📱 Celulares & Telefonia  
   → Smartphones, celulares, chips, planos, capas, películas, fones de ouvido, caixas de som Bluetooth, roteadores Wi-Fi e acessórios relacionados.

4. 🛋️ Casa & Decoração  
   → Móveis, decoração de interiores e exteriores, iluminação, organizadores, utensílios de cozinha, artigos de banheiro, cama, mesa e banho, itens para jardim.

5. ⚡ Eletrodomésticos  
   → Geladeiras, fogões, lavadoras, micro-ondas, fornos elétricos, ferros de passar, cafeteiras, liquidificadores, aspiradores de pó e produtos de limpeza doméstica.

6. 🏃 Esporte & Lazer  
   → Produtos para academia, corrida, ciclismo, camping, trilhas, praia, piscina, bicicletas, patins, skate, brinquedos ao ar livre e acessórios para pets.

7. 👶 Infantil & Gestantes  
   → Enxoval de bebê, brinquedos infantis, roupas de bebê, acessórios para amamentação, carrinhos, cadeirinhas, fraldas, livros infantis e produtos para gestantes.

8. 🧴 Saúde & Bem-estar  
   → Produtos de cuidados pessoais, bem-estar, suplementos, vitaminas, produtos de emagrecimento, cuidados bucais, produtos de automaquiagem e itens de autocuidado.

9. ❓ Outros itens  
   → Se não for possível associar a nenhuma das categorias acima, retorne esta opção. Caso tenham pelo menos 1% de dúvida, deve-se enviar para esta opção.


# 📌 Instruções Específicas:

- Leia atentamente a mensagem ou link recebido.
- Extraia palavras-chave e termos técnicos que indiquem o tipo de produto.
- Identifique a categoria mais apropriada com base na lista abaixo.
- Associe com base no significado e contexto, não apenas palavras isoladas.
- Use raciocínio lógico e conhecimento de mercado para identificar categorias implícitas.
- Descreva o produto com uma frase curta e clara (product).
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
- Crie uma pequena frase de venda (storytelling) com até 100 caracteres, usando gatilhos mentais e linguagem informal, conectada com o dia a dia do brasileiro comum. Pode incluir uma piada ou referência cultural leve. Use emojis que façam sentido à mensagem, deixando o texto mais elegante. Se usar gírias ou ditos populares, estes só podem ser de origem da cultura brasileira e escritos exclusivamente em português. Evite palavras em outros idiomas que não seja português. Seja engraçadao.
- Identifique cupons de descontos nas mensagnes, se encontrar retorne em "coupons".


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

[
  {
    "title": "👚 Moda & Beleza",
    "instance": "moda-beleza",
    "chatGroupId": "JAvD5UMGtYGHCAxUzEXz2m@g.us"
  },
  {
    "title": "💻 Tecnologia & Informática",
    "instance": "tecnologia-informatica",
    "chatGroupId": "He2TE0Vyl4h7gih07vKqYt@g.us"
  },
  {
    "title": "📱 Celulares & Telefonia",
    "instance": "celulares-telefonia",
    "chatGroupId": "GVk07NEoqT3AR7bQHDgxvy@g.us"
  },
  {
    "title": "🛋 Casa & Decoração",
    "instance": "casa-decoracao",
    "chatGroupId": "CI6TKtRY1GNJiogzVxywwA@g.us"
  },
  {
    "title": "⚡ Eletrodomésticos",
    "instance": "eletrodomesticos",
    "chatGroupId": "F2Bc3KSvAPBIgpBrnaOkqw@g.us"
  },
  {
    "title": "🏃 Esporte & Lazer",
    "instance": "esporte-lazer",
    "chatGroupId": "J9l0ExczCqFDdazKbcVwoq@g.us"
  },
  {
    "title": "👶 Infantil & Gestantes",
    "instance": "infantil-gestantes",
    "chatGroupId": "DL2Dh1mrJLE13my5RcZt2l@g.us"
  },
  {
    "title": "🧴 Saúde & Bem-estar",
    "instance": "saude-bem-estar",
    "chatGroupId": "BBCB2fRFZLKChG9jCa1pSa@g.us"
  },
  {
    "title": "❓ Outros Itens",
    "instance": "outros-itens",
    "chatGroupId": "E0f5lr2fnNGKDnGechn5fc@g.us"
  }
]


# ✅ Exemplo de Resposta 1:
Mensagem recebida:
- "Oferta relâmpago! Fone de ouvido Bluetooth com cancelamento de ruído por R$ 89,90. Frete grátis! https://amzn.to/4lz1crS"

- Resposta esperada - um objeto convertido em json:
{
  "instance": "celulares-telefonia",
  "chatGroupId": "GVk07NEoqT3AR7bQHDgxvy@g.us",
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

Mas.... Se o marketplace for válido e passar no teste acima o resutlado deve seguir o padrão abaixo...


## 🚀 Como usar no seu sistema:

Com base na resposta da IA ('instance'), seu sistema consulta a tabela de categorias e obtém o 'chatGroupId' correspondente.

A saída deve seguir sempre exclusivamente como o formato abaixo:
{
  "instance": "[instance]",
  "chatGroupId": "[chatGroupId]",
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

const ProductAnalysisSchema = z.object({
  instance: z.string(),
  chatGroupId: z.string(),
  url: z.string().url(),
  marketplace: z.enum(["amazon", "mercado-livre", "shopee", "aliexpress"]),
  value: z.number().nullable(),
  valueBefore: z.number().nullable().optional(),
  product: z.string(),
  emoji: z.string(),
  storytelling: z.string(),
  coupons: z.string().nullable(),
});

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash";

export const transcribeAUdio = async (
  audioAsBase64: string,
  mimeType: string
) => {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: "Transcreva o áudio para português do Brasil. Seja preciso e natural na transcrição. Mantenha a pontuação adequada para o padrão brasileiro e divida o texto em parágrafos quando for apropriado. Não transcreva e nem considere mencionar sons externos, como ruídos, barulhos, músicas de fundo. Reconheça na fidelidade da voz da pessoa e considere a transcrição do que o narrador está falando. Evite retornar na transcrição onomatopéias e frases como: 'Não há fala detectada no áudio.' ",
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      },
    ],
  });

  if (!response.text) {
    throw new Error("Não foi possível converter o áudio.");
  }

  return response.text;
};

export const generateEmbeddings = async (text: string) => {
  const response = await gemini.models.embedContent({
    model: "text-embedding-004",
    contents: [{ text }],
    config: {
      taskType: "RETRIEVAL_DOCUMENT",
    },
  });

  if (!response.embeddings?.[0].values) {
    throw new Error("Não foi possível gerar os embeddings.");
  }

  return response.embeddings[0].values;
};

export const generateAnswer = async (
  question: string,
  transcriptions: string[]
) => {
  const context = transcriptions.join("\n\n");

  const prompt = `
    Com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e precisa em português do Brasil, respeitando todas as regras gramaticais e de concordância verbal. 

    CONTEXTO:
    ${context}

    PERGUNTA:
    ${question}

    INSTRUÇÕES:
    - Use apenas informações contidas no contexto enviado;
    - Se a resposta não for encontrada no contexto, apenas responda que não possui informações suficientes para responder a esta pergunta;
    - Seja objetivo e educado;
    - Mantenha um tom educativo e profissional;
    - Cite trechos relevantes do contexto se apropriado;
    - Se for citar o contexto, utilize o termo "conteúdo da aula";
  `.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  if (!response.text) {
    throw new Error("Falha ao gerar responsta pelo Gemini");
  }

  return response.text;
};

export const generateSummary = async (transcriptions: string[]) => {
  const context = transcriptions.join("\n\n");

  const prompt = `
  Com base no texto fornecido abaixo como contexto, gere um resumo lógico e inteligente em português do Brasil, mantendo a conexão dos argumentos, sinergia das palavras e preservando o contexto original das informações apresentadas.

    CONTEXTO:
    ${context}

    INSTRUÇÕES:
    - Crie um resumo estruturado e coerente que mantenha a inteligência e fluidez do conteúdo original;
    - Preserve as conexões lógicas entre os conceitos e argumentos apresentados;
    - Mantenha a sinergia entre as ideias, respeitando o encadeamento natural dos tópicos;
    - Use apenas informações contidas no contexto enviado;
    - Se não houver informações suficientes no contexto, responda que não possui conteúdo adequado para gerar este resumo;
    - Organize as informações de forma didática e progressiva;
    - Mantenha um tom educativo e profissional;
    - Preserve a essência e os pontos-chave do "conteúdo da aula";
    - Conecte os temas de forma natural, demonstrando a relação entre os conceitos;
    - Respeite todas as regras gramaticais e de concordância verbal do português brasileiro;
  `.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  if (!response.text) {
    throw new Error("Falha ao gerar resumo pelo Gemini");
  }

  return response.text;
};

export const generateProductLink = async (message: string) => {
  // const context = message.join("\n\n");

  const prompt = `${promptProduct}
    
    MENSAGEM:
    ${message}

    IMPORTANTE: Retorne APENAS o objeto JSON válido, sem texto adicional, sem markdown, sem explicações.
  `.trim();

  try {
    const response = await gemini.models.generateContent({
      model,
      contents: [
        {
          text: prompt,
        },
      ],
    });

    if (!response.text) {
      throw new Error("Falha ao gerar resposta pelo Gemini");
    }

    // ✅ Limpar possível markdown ou texto extra
    let cleanResponse = response.text.trim();

    // Remover markdown se existir
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse
        .replace(/```json\s*/, "")
        .replace(/```\s*$/, "");
    }

    // Remover outros possíveis prefixos/sufixos
    cleanResponse = cleanResponse.replace(/^[^{]*/, "").replace(/[^}]*$/, "");

    // ✅ Fazer parse do JSON
    const jsonResult = JSON.parse(cleanResponse);

    // ✅ Validar se é "Marketplace inválido" ou "Anuncio invalido"
    if (
      typeof jsonResult === "string" &&
      (jsonResult.includes("Marketplace inválido") ||
        jsonResult.includes("Anuncio invalido"))
    ) {
      return { error: jsonResult };
    }

    // ✅ Validar com Zod
    const validatedResult = ProductAnalysisSchema.parse(jsonResult);

    return validatedResult;
  } catch (error) {
    console.error("Erro ao processar resposta da IA:", error);

    // Se for erro de JSON parse
    if (error instanceof SyntaxError) {
      console.error(error);
      return { error: "Resposta da IA não é um JSON válido" };
    }

    // Se for erro de validação Zod
    if (error instanceof z.ZodError) {
      console.error("Erro de validação:", error.errors);
      return { error: "Formato de resposta inválido da IA" };
    }

    return { error: "Erro interno ao processar análise do produto" };
  }
};
