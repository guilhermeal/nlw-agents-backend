import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { desc, count, eq } from "drizzle-orm";
import { z } from "zod/v4";

export const getRoomsRoute: FastifyPluginCallbackZod = async (app) => {
  app.get("/rooms", async () => {
    const results = await db
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name,
        createdAt: schema.rooms.createdAt,
        questionsCount: count(schema.questions.id),
      })
      .from(schema.rooms)
      .leftJoin(schema.questions, eq(schema.questions.roomId, schema.rooms.id))
      .groupBy(schema.rooms.id)
      .orderBy(desc(schema.rooms.createdAt));

    return results;
  });
};

export const getRoomAndQuestions: FastifyPluginCallbackZod = async (app) => {
  app.get(
    "/rooms/:roomId",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request) => {
      const { roomId } = request.params;

      const room = await db
        .select({
          id: schema.rooms.id,
          name: schema.rooms.name,
          createdAt: schema.rooms.createdAt,
          questionsCount: count(schema.questions.id),
        })
        .from(schema.rooms)
        .leftJoin(
          schema.questions,
          eq(schema.questions.roomId, schema.rooms.id)
        )
        .where(eq(schema.rooms.id, roomId))
        .groupBy(schema.rooms.id);

      if (room.length === 0) {
        throw new Error("Room not found");
      }
      console.log("rrom", room);

      const questions = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, roomId))
        .orderBy(schema.questions.createdAt);

      return {
        ...room[0],
        questions: questions,
      };
    }
  );
};
