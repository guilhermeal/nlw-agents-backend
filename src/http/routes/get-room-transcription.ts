import { and, asc, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const getRoomTranscription: FastifyPluginCallbackZod = async (app) => {
  app.get(
    "/rooms/:roomId/transcription",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;

      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
        })
        .from(schema.audioChunks)
        .where(and(eq(schema.audioChunks.roomId, roomId)))
        .orderBy(asc(schema.audioChunks.createdAt));

      if (chunks.length > 0) {
        const result = chunks.map((chunk) => chunk.transcription).join("\n");

        return reply.status(201).send({
          transcription: result,
          chunksCount: chunks.length,
        });
      }

      return reply.status(204).send({ transcription: undefined });
    }
  );
};
