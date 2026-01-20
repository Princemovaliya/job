const { Queue } = require("bullmq");
const env = require("../config/env");
const { connection } = require("../config/redis");

const queueName = "job-import";

const importQueue = new Queue(queueName, {
  connection,
  defaultJobOptions: {
    attempts: env.IMPORT_ATTEMPTS,
    backoff: {
      type: "exponential",
      delay: env.IMPORT_BACKOFF_MS
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});


const enqueueImport = async (source) => {
  return importQueue.add("import-feed", source);
};

const enqueueImports = async (sources) => {
  if (!Array.isArray(sources) || sources.length === 0) {
    return [];
  }

  return importQueue.addBulk(
    sources.map((source) => ({
      name: "import-feed",
      data: source
    }))
  );
};

module.exports = { queueName, importQueue, enqueueImport, enqueueImports };
