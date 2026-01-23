const express = require("express");
const {
  listSources,
  runImports
} = require("../controllers/imports.controller");

const router = express.Router();

router.get("/sources", listSources);
router.post("/run", runImports);

module.exports = router;
