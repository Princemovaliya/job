const { Schema, model } = require("mongoose");

const ImportLogSchema = new Schema(
  {
    source: { type: String, required: true, index: true },
    sourceUrl: { type: String, required: true },
    fileName: { type: String },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    durationMs: { type: Number },
    status: { type: String, default: "running" },
    totals: {
      fetched: { type: Number, default: 0 },
      imported: { type: Number, default: 0 },
      new: { type: Number, default: 0 },
      updated: { type: Number, default: 0 },
      failed: { type: Number, default: 0 }
    },
    failures: [
      {
        externalId: { type: String },
        reason: { type: String }
      }
    ],
    message: { type: String }
  },
  { timestamps: true, collection: "import_logs" }
);

ImportLogSchema.index({ createdAt: -1 });

module.exports = model("ImportLog", ImportLogSchema);
