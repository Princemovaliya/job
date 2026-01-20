const jwt = require("jsonwebtoken");
const env = require("../config/env");

const getTokenFromHeader = (req) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return "";
  }

  return token;
};

const requireAuth = (req, res, next) => {
  if (!env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { requireAuth };
