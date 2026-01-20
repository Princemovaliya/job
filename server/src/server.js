require("dotenv").config();

const app = require("./app");
const env = require("./config/env");
const { connectDB } = require("./config/db");
const { connectRedis } = require("./config/redis");
const { startImportCron } = require("./cron/jobImport.cron");

const port = Number(env.PORT) || 4000;

const startServer = async () => {
  await connectDB();
  await connectRedis();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  if (env.ENABLE_CRON) {
    await startImportCron();
  }
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
