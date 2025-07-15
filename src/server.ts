import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import fastify from "fastify";
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
import { uploadAudioRoute } from "./http/routes/upload-audio.ts";
import { getLocalIP } from './utils/network.ts';

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
});

app.register(fastifyMultipart);

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
app.register(uploadAudioRoute);

// Configuração para escutar em todas as interfaces
const start = async () => {
  try {
    const host = '0.0.0.0';
    const port = Number(process.env.PORT) || 3333;
    
    await app.listen({ port, host });
    
    const localIP = getLocalIP();
    console.log(`🚀 Server is running on:`);
    console.log(`   Local:    http://localhost:${port}`);
    console.log(`   Network:  http://${localIP}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
