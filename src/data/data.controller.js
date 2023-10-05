const { isValidObjectId } = require('mongoose');
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncError = require("../../utils/catchAsyncError");
const APIFeatures = require("../../utils/apiFeatures");
const dataModel = require("./data.model");
const evaluate = require("./calculation");

// Create a new document
exports.createData = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const data = await dataModel.create({ ...req.body, user: userId });
  res.status(200).json({ ...evaluate(req.body), data });
});

// Get all documents
exports.getAllData = catchAsyncError(async (req, res, next) => {
  const allData = await dataModel.find();
  res.status(200).json({ allData });
});

// Get a single document by ID
exports.getData = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const data = await dataModel.findById(id);
  if (!data) {
    return next(new ErrorHandler("Data not found.", 404));
  }

  res.status(200).json({ data });
});

// Update a document by ID
exports.updateData = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const data = await dataModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!data) return next(new ErrorHandler('data not found', 404));

  res.status(200).json({ data });
});

// Delete a document by ID
exports.deleteData = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let data = await dataModel.findById(id);

  if (!data)
    return next(new ErrorHandler("data not found", 404));

  await data.deleteOne();

  res.status(200).json({
    message: "data Deleted successfully.",
  });
});
