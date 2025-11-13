import { config as loadEnv } from "dotenv";

loadEnv();

export const config = {
  app: {
    name: process.env.APP_NAME || "bobs-corn-api",
    version: process.env.API_VERSION || "v1",
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "5000", 10),
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
  },

  database: {
    url: process.env.DATABASE_URL || "",
  },

  security: {
    sessionSecret: process.env.SESSION_SECRET || "default-session-secret",
  },

  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: process.env.CORS_CREDENTIALS === "true",
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "combined",
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
    uploadDir: process.env.UPLOAD_DIR || "./uploads",
  },
} as const;

export function validateConfig() {
  const required = ["DATABASE_URL", "SESSION_SECRET"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please check your .env file or environment configuration."
    );
  }

  if (config.app.isProduction) {
    const insecureDefaults = [
      { key: "SESSION_SECRET", value: "default-session-secret" },
    ];

    insecureDefaults.forEach(({ key, value }) => {
      if (process.env[key] === value) {
        console.warn(
          `⚠️  WARNING: Using insecure default for ${key} in production!`
        );
      }
    });
  }
}

if (config.app.isDevelopment) {
  console.log("📝 Configuration loaded:");
  console.log(`   Environment: ${config.app.env}`);
  console.log(`   Port: ${config.app.port}`);
  console.log(
    `   Database: ${config.database.url.replace(/:[^:]*@/, ":***@")}`
  );
  console.log(`   CORS Origins: ${config.cors.origin.join(", ")}`);
}
