import { and, asc, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { generateSummary } from "../../services/gemini.ts";

export const getRoomChunksSummary: FastifyPluginCallbackZod = async (app) => {
  app.get(
    "/rooms/:roomId/summary",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;

      const summary = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
        })
        .from(schema.audioChunks)
        .where(and(eq(schema.audioChunks.roomId, roomId)))
        .orderBy(asc(schema.audioChunks.createdAt))
        .limit(3);

      if (summary.length > 0) {
        const transcriptions = summary.map((chunk) => chunk.transcription);

        const result = await generateSummary(transcriptions);

        return reply.status(201).send({ summary: result });
      }

      return reply.status(204).send({ summary: undefined });
    }
  );
};
