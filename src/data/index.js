const dataModel = require("./data.model");
const { createData, getData } = require("./data.controller");
const dataRoute = require("./data.route");

module.exports = { dataModel, createData, getData, dataRoute };
