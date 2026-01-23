const express = require("express");
const {
  listLogs,
  getLogById
} = require("../controllers/importLogs.controller");

const router = express.Router();

router.get("/", listLogs);
router.get("/:id", getLogById);

module.exports = router;
