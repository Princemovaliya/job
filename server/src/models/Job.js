const { Schema, model } = require("mongoose");

const JobSchema = new Schema(
  {
    source: { type: String, required: true, index: true },
    sourceUrl: { type: String, required: true },
    externalId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    location: { type: String, trim: true },
    description: { type: String },
    url: { type: String },
    categories: [{ type: String }],
    jobType: { type: String },
    postedAt: { type: Date },
    importedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

JobSchema.index({ source: 1, externalId: 1 }, { unique: true });

module.exports = model("Job", JobSchema);
