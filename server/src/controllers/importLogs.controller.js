const ImportLog = require("../models/ImportLog");

const listLogs = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const filter = {};

    if (req.query.source) {
      filter.source = req.query.source;
    }

    if (req.query.sourceUrl) {
      filter.sourceUrl = req.query.sourceUrl;
    }

    const [logs, total] = await Promise.all([
      ImportLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ImportLog.countDocuments(filter)
    ]);

    res.json({
      data: logs,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getLogById = async (req, res, next) => {
  try {
    const log = await ImportLog.findById(req.params.id).lean();

    if (!log) {
      return res.status(404).json({ message: "Import log not found" });
    }

    return res.json({ data: log });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listLogs, getLogById };
