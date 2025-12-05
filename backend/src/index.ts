import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config, validateConfig } from "./lib/config";
import routes from "./routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import { connectDatabase, disconnectDatabase } from "./lib/db";
import { startCleanupJobs, stopCleanupJobs } from "./jobs";
import { ConfigService } from "./services/config.service";
import { CommonService } from "./services/common.service";

try {
  validateConfig();
} catch (error) {
  console.error("Configuration validation failed:", error);
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

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.app.port;

const startServer = async () => {
  try {
    await connectDatabase();

    // Initialize default configuration
    await ConfigService.initializeDefaults();

    startCleanupJobs();

    app.listen(PORT, () => {
      console.log(`Backend is running!`);
      console.log("===================================");
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  stopCleanupJobs();
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  stopCleanupJobs();
  await disconnectDatabase();
  process.exit(0);
});
