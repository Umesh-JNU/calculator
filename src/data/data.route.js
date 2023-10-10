const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { validateID } = require('../../middlewares/validate');
const { createData, getData, getKeyMetrics, getReport } = require("./data.controller");

router.post("/", auth, createData);
router.get("/:id", validateID('Data'), auth, getData);

router.put("/:id/key-metrics/", validateID('Data'), auth, getKeyMetrics);
router.get("/:id/report/", validateID('Data'), auth, getReport);

module.exports = router;
