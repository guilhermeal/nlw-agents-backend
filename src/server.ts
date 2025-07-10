import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { createQuestionRoute } from "./http/routes/create-question.ts";
import { createRoomRoute } from "./http/routes/create-room.ts";
import { getRoomQuestions } from "./http/routes/get-room-questions.ts";
import { getRoomAndQuestions, getRoomsRoute } from "./http/routes/get-rooms.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/health", () => {
  return "OK";
});

app.register(getRoomsRoute);
app.register(getRoomAndQuestions);
app.register(createRoomRoute);
app.register(getRoomQuestions);
app.register(createQuestionRoute);

app.listen({ port: env.PORT }).then(() => {
  // Remover este console futuramente
  console.log(`\n🚀 Server is running on http://${env.HOST}:${env.PORT} 💥\n`);
});
