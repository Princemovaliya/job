const express = require("express");
const importLogsRoutes = require("./routes/importLogs.routes");
const importsRoutes = require("./routes/imports.routes");
const authRoutes = require("./routes/auth.routes");
const { requireAuth } = require("./middleware/auth");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/import-logs", requireAuth, importLogsRoutes);
app.use("/api/imports", requireAuth, importsRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

module.exports = app;
