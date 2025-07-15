import { z } from "zod";

const envSchema = z.object({
  ENVIROMENT: z.string().default("PRODUCTION"),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default("localhost"),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  GEMINI_API_KEY: z.string(),
  AUTH_TOKEN: z
    .string()
    .min(10, "AUTH_TOKEN deve ter pelo menos 10 caracteres"),
  URL_ORIGIN: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
