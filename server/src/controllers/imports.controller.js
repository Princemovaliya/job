const { enqueueImport, enqueueImports } = require("../queues/job.queue");
const { jobSources, getJobSourceById } = require("../config/jobSources");

const listSources = (req, res) => {
  res.json({ data: jobSources });
};

const runImports = async (req, res, next) => {
  try {
    const { sourceId, sourceUrl } = req.body || {};

    if (sourceId) {
      const source = getJobSourceById(sourceId);
      if (!source) {
        return res.status(404).json({ message: "Source not found" });
      }

      const job = await enqueueImport(source);
      return res.json({ queued: 1, jobId: job.id });
    }

    if (sourceUrl) {
      const job = await enqueueImport({ id: sourceUrl, url: sourceUrl });
      return res.json({ queued: 1, jobId: job.id });
    }

    const jobs = await enqueueImports(jobSources);
    return res.json({ queued: jobs.length });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listSources, runImports };
