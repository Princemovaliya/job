const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "4000",
  MONGO_URI: process.env.MONGO_URI || "",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "8h",
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || "",
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "",
  QUEUE_CONCURRENCY: Number(process.env.QUEUE_CONCURRENCY || 5),
  BATCH_SIZE: Number(process.env.BATCH_SIZE || 500),
  CRON_SCHEDULE: process.env.CRON_SCHEDULE || "0 * * * *",
  ENABLE_CRON: process.env.ENABLE_CRON !== "false",
  IMPORT_ATTEMPTS: Number(process.env.IMPORT_ATTEMPTS || 3),
  IMPORT_BACKOFF_MS: Number(process.env.IMPORT_BACKOFF_MS || 1000),
  MAX_FAILURE_LOGS: Number(process.env.MAX_FAILURE_LOGS || 50),
  REQUEST_TIMEOUT_MS: Number(process.env.REQUEST_TIMEOUT_MS || 30000)
};

module.exports = env;
