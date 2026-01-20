const Job = require("../models/Job");
const SourceJob = require("../models/SourceJob");
const ImportLog = require("../models/ImportLog");
const env = require("../config/env");
const { fetchJobs } = require("./jobFetcher.service");
const { parseJobs } = require("./jobParser.service");
const { chunkArray } = require("../utils/array");

const resolveSource = (sourceInput) => {
  if (!sourceInput) {
    return { id: "", url: "" };
  }

  if (typeof sourceInput === "string") {
    return { id: sourceInput, url: sourceInput };
  }

  return {
    id: sourceInput.id || sourceInput.source || sourceInput.url || "unknown",
    url: sourceInput.url || sourceInput.sourceUrl || ""
  };
};

const pushFailure = (log, failure) => {
  if (!failure) {
    return;
  }

  if (!log.failures) {
    log.failures = [];
  }

  if (log.failures.length >= env.MAX_FAILURE_LOGS) {
    return;
  }

  log.failures.push(failure);
};

const extractWriteErrors = (error) => {
  if (!error) {
    return [];
  }

  if (Array.isArray(error.writeErrors)) {
    return error.writeErrors;
  }

  if (error.result?.writeErrors) {
    return error.result.writeErrors;
  }

  if (error.result?.result?.writeErrors) {
    return error.result.result.writeErrors;
  }

  return [];
};

const getBulkStats = (result) => {
  if (!result) {
    return { upserted: 0, modified: 0 };
  }

  return {
    upserted: result.upsertedCount || 0,
    modified: result.modifiedCount || 0
  };
};

const safeBulkWrite = async (model, operations) => {
  if (!operations.length) {
    return { result: null, errorCount: 0, errors: [] };
  }

  try {
    const result = await model.bulkWrite(operations, { ordered: false });
    return { result, errorCount: 0, errors: [] };
  } catch (error) {
    const errors = extractWriteErrors(error);
    return {
      result: error.result || error.result?.result || null,
      errorCount: errors.length,
      errors
    };
  }
};

const processImport = async (sourceInput) => {
  const source = resolveSource(sourceInput);
  if (!source.url) {
    throw new Error("Source URL is required");
  }

  const log = await ImportLog.create({
    source: source.id,
    sourceUrl: source.url,
    fileName: source.url,
    status: "running",
    totals: {
      fetched: 0,
      imported: 0,
      new: 0,
      updated: 0,
      failed: 0
    }
  });

  try {
    const { items } = await fetchJobs(source.url);
    log.totals.fetched = items.length;
    await log.save();

    const { jobs, failures } = parseJobs(items, source.id, source.url);
    failures.forEach((failure) => {
      log.totals.failed += 1;
      pushFailure(log, failure);
    });

    const batches = chunkArray(jobs, env.BATCH_SIZE);

    for (const batch of batches) {
      const sourceOps = batch.map((job) => ({
        updateOne: {
          filter: { source: source.id, externalId: job.externalId },
          update: {
            $set: {
              source: source.id,
              sourceUrl: source.url,
              externalId: job.externalId,
              payload: job.raw,
              fetchedAt: new Date()
            }
          },
          upsert: true
        }
      }));

      const sourceWrite = await safeBulkWrite(SourceJob, sourceOps);
      log.totals.failed += sourceWrite.errorCount;

      sourceWrite.errors.forEach((error) => {
        pushFailure(log, {
          externalId: error?.op?.q?.externalId || null,
          reason: error?.errmsg || "Source job write error"
        });
      });

      const jobOps = batch.map((job) => ({
        updateOne: {
          filter: { source: source.id, externalId: job.externalId },
          update: {
            $set: {
              source: source.id,
              sourceUrl: source.url,
              externalId: job.externalId,
              title: job.title,
              company: job.company,
              location: job.location,
              description: job.description,
              url: job.url,
              categories: job.categories,
              jobType: job.jobType,
              postedAt: job.postedAt,
              importedAt: new Date()
            }
          },
          upsert: true
        }
      }));

      const { result, errorCount, errors } = await safeBulkWrite(Job, jobOps);
      const stats = getBulkStats(result);

      log.totals.new += stats.upserted;
      log.totals.updated += stats.modified;
      log.totals.failed += errorCount;

      errors.forEach((error) => {
        pushFailure(log, {
          externalId: error?.op?.q?.externalId || null,
          reason: error?.errmsg || "Bulk write error"
        });
      });
    }

    log.totals.imported = log.totals.new + log.totals.updated;
    log.status = "completed";
    log.finishedAt = new Date();
    log.durationMs = log.finishedAt - log.startedAt;
    await log.save();

    return { logId: log._id, totals: log.totals };
  } catch (error) {
    log.status = "failed";
    log.finishedAt = new Date();
    log.durationMs = log.finishedAt - log.startedAt;
    log.message = error.message;
    log.totals.failed += 1;
    await log.save();
    throw error;
  }
};

module.exports = { processImport };
