import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { generateProductLink } from "../../services/gemini.ts";

function messageToJson(rawMessage: string) {
  const escapedMessage = rawMessage.replace(/\n/g, "\\n");
  return {
    message: escapedMessage,
  };
}

export const createProductLink: FastifyPluginCallbackZod = async (app) => {
  app.post(
    "/product",
    {
      schema: {
        body: z.object({
          message: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { message } = request.body;

      if (!message) {
        return reply.status(401);
      }

      const parsedMessage = JSON.stringify(messageToJson(message), null, 2);

      const answer = await generateProductLink(parsedMessage);

      // const result = await db
      //   .insert(schema.questions)
      //   .values({
      //     roomId,
      //     question,
      //     answer,
      //   })
      //   .returning();

      // const insertedQuestion = result[0];

      // if (!insertedQuestion) {
      //   throw new Error("Failed to create new question.");
      // }

      return reply.status(201).send(answer);
    }
  );
};

export const generateAmazonLink = async (shortLink: string) => {
  const newTag = "guiallan-20";

  try {
    const response = await fetch(shortLink, { redirect: "manual" });

    if (response.status >= 300 && response.status < 400) {
      let finalUrl = response.headers.get("Location");

      // Substitui ou adiciona o tag
      if (finalUrl) {
        if (finalUrl.includes("tag=")) {
          finalUrl = finalUrl.replace(/tag=[^&]+/, `tag=${newTag}`);
        } else {
          finalUrl += `&tag=${newTag}`;
        }
      }

      return finalUrl;
    } else {
      return "Não foi possível extrair o link de destino.";
    }
  } catch (error) {
    console.error("Erro ao seguir o link curto:", error);
    return "Erro ao seguir o link curto.";
  }
};

export const getFinalAmazonProductLink: FastifyPluginCallbackZod = async (
  app
) => {
  app.post(
    "/product/amazon",
    {
      schema: {
        body: z.object({
          url: z.string().min(1),
        }),
      },
    },
    async (request) => {
      const { url } = request.body;

      return generateAmazonLink(url);
    }
  );
};
