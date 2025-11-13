import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config, validateConfig } from "./config";

try {
  validateConfig();
} catch (error) {
  console.error("❌ Configuration validation failed:", error);
  process.exit(1);
}

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (config.app.isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan(config.logging.format));
}

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.app.env,
    version: config.app.version,
  });
});

app.get("/api", (_req: Request, res: Response) => {
  res.json({
    name: config.app.name,
    version: config.app.version,
    environment: config.app.env,
    message: "Bob's Corn API is running!",
  });
});

app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({
    message: "Hello from Bob's Corn API!",
    timestamp: new Date().toISOString(),
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource does not exist",
  });
});

app.use(
  (err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
    console.error("Error:", err);

    res.status(500).json({
      error: "Internal Server Error",
      message: config.app.isDevelopment
        ? err.message
        : "An unexpected error occurred",
    });
  }
);

const PORT = config.app.port;

app.listen(PORT, () => {
  console.log("");
  console.log("🚀 ===================================");
  console.log(`🌽 ${config.app.name} is running!`);
  console.log("🚀 ===================================");
  console.log(`   Environment: ${config.app.env}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log("🚀 ===================================");
  console.log("");
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT received, shutting down gracefully...");
  process.exit(0);
});
