require("dotenv").config();

const cron = require("node-cron");
const env = require("../config/env");
const { enqueueImports } = require("../queues/job.queue");
const { jobSources } = require("../config/jobSources");
const { connectRedis } = require("../config/redis");

const startImportCron = async () => {
  if (!env.ENABLE_CRON) {
    return null;
  }

  await connectRedis();

  return cron.schedule(env.CRON_SCHEDULE, async () => {
    await enqueueImports(jobSources);
  });
};

if (require.main === module) {
  startImportCron().catch((error) => {
    console.error("Cron failed to start", error);
    process.exit(1);
  });
}

module.exports = { startImportCron };
