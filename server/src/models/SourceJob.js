const { Schema, model } = require("mongoose");

const SourceJobSchema = new Schema(
  {
    source: { type: String, required: true, index: true },
    sourceUrl: { type: String, required: true },
    externalId: { type: String, required: true },
    payload: { type: Schema.Types.Mixed },
    fetchedAt: { type: Date, default: Date.now },
    status: { type: String, default: "fetched" }
  },
  { timestamps: true }
);

SourceJobSchema.index({ source: 1, externalId: 1 }, { unique: true });

module.exports = model("SourceJob", SourceJobSchema);
