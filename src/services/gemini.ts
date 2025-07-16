import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

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
