import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),

  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // Auth
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Groq AI
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),

  // CORS
  FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:\n");
  parsed.error.issues.forEach((issue) => {
    console.error(`  ${issue.path[0]}: ${issue.message}`);
  });
  process.exit(1);
}

export const config = Object.freeze(parsed.data);