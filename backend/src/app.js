import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";

// Routes
import authRoutes from "./routes/auth.route.js";
import generateRoutes from "./routes/generate.route.js";
import settingsRoutes from "./routes/settings.route.js";

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────

app.use(helmet());

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests, please try again later." },
});

const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: "Generation limit reached. Try again in an hour." },
});

app.use(globalLimiter);

// ─── Body Parser ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: "10kb" }));

// ─── Health Check ────────────────────────────────────────────────────────────

app.get("/health", (req, res) => {
  res.json({ status: "ok", env: config.NODE_ENV });
});

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/generate", generateLimiter, generateRoutes);
app.use("/api/settings", settingsRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

export default app;