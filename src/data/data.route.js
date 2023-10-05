const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { createData, getData } = require("./data.controller");

router.post("/", auth, createData);
router.get("/:id", auth, getData);

module.exports = router;
