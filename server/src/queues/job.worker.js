require("dotenv").config();

const { QueueScheduler, Worker } = require("bullmq");
const { queueName } = require("./job.queue");
const { connection, connectRedis } = require("../config/redis");
const { connectDB } = require("../config/db");
const env = require("../config/env");
const { processImport } = require("../services/jobProcessor.service");

const startWorker = async () => {
  await connectDB();
  await connectRedis();

  const scheduler = new QueueScheduler(queueName, { connection });
  await scheduler.waitUntilReady();

  const worker = new Worker(
    queueName,
    async (job) => {
      return processImport(job.data);
    },
    {
      connection,
      concurrency: env.QUEUE_CONCURRENCY
    }
  );

  worker.on("completed", (job) => {
    console.log(`Import completed: ${job.id}`);
  });

  worker.on("failed", (job, error) => {
    console.error(`Import failed: ${job?.id}`, error);
  });

  return { worker, scheduler };
};

if (require.main === module) {
  startWorker().catch((error) => {
    console.error("Worker failed to start", error);
    process.exit(1);
  });
}

module.exports = { startWorker };
