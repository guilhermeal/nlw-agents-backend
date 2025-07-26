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
import {
  checkGroupWhatsAppInfoByInviteCode,
  createProductLink,
  getFinalAmazonProductLink,
} from "./http/routes/generate-product-details.ts";
import { getRoomChunksSummary } from "./http/routes/get-room-chunks-summary.ts";
import { getRoomQuestions } from "./http/routes/get-room-questions.ts";
import { getRoomTranscription } from "./http/routes/get-room-transcription.ts";
import { getRoomAndQuestions, getRoomsRoute } from "./http/routes/get-rooms.ts";
import { uploadAudioRoute } from "./http/routes/upload-audio.ts";
import { authenticateToken } from "./middleware/auth.ts";
import { startWhatsapp } from "./services/whatsapp.ts";
import { getLocalIP } from "./utils/network.ts";

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: env.ENVIROMENT === "DEVELOPMENT" ? true : env.URL_ORIGIN,
});

app.register(fastifyMultipart);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/health", () => {
  return "OK";
});

startWhatsapp();

// 📊 Rotas públicas (sem autenticação)
app.register(createProductLink);
app.register(getFinalAmazonProductLink);
app.register(checkGroupWhatsAppInfoByInviteCode);

// 🔐 Rotas protegidas (com token simples)
app.register(async function protectedRoutes(app) {
  // Aplicar middleware a todas as rotas deste grupo
  app.addHook("onRequest", authenticateToken);

  // Registrar rotas protegidas
  app.register(getRoomsRoute);
  app.register(getRoomAndQuestions);
  app.register(getRoomChunksSummary);
  app.register(getRoomTranscription);
  app.register(createRoomRoute);
  app.register(getRoomQuestions);
  app.register(createQuestionRoute);
  app.register(uploadAudioRoute);
});

// Configuração para escutar em todas as interfaces
const start = async () => {
  try {
    const host = "0.0.0.0";
    const port = Number(process.env.PORT) || 3333;

    await app.listen({ port, host });

    const localIP = getLocalIP();
    console.log(`\n 🚀 Server is running on:`);
    console.log(`   Local:    http://localhost:${port}`);
    console.log(`   Network:  http://${localIP}:${port}`);
    console.log(`🔐 Auth Token: ${env.AUTH_TOKEN}\n `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
