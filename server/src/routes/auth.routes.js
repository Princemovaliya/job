const express = require("express");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const router = express.Router();

router.post("/token", (req, res) => {
  const { apiKey } = req.body || {};

  if (!env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  if (!env.ADMIN_API_KEY) {
    return res.status(500).json({ message: "Admin API key not configured" });
  }

  if (!apiKey || apiKey !== env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  const token = jwt.sign(
    { role: "admin" },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return res.json({ token });
});

module.exports = router;
