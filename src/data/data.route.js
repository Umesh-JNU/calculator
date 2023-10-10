const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { createData, getData, getKeyMetrics } = require("./data.controller");

router.post("/", auth, createData);
router.get("/:id", auth, getData);

router.put("/:id/key-metrics/", auth, getKeyMetrics);

module.exports = router;
