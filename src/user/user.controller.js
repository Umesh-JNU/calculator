const fs = require('fs');
const crypto = require("node:crypto");
const path = require('path');
const { isValidObjectId } = require('mongoose');

const sendEmail = require("../../utils/sendEmail");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncError = require("../../utils/catchAsyncError");
const APIFeatures = require("../../utils/apiFeatures");
const userModel = require("./user.model");

// Create a new document
exports.createUser = catchAsyncError(async (req, res, next) => {
  const user = await userModel.create(req.body);
  const token = await user.getJWTToken();
  res.status(200).json({ user, token });
});

// login
exports.login = catchAsyncError(async (req, res, next) => {
  console.log("user login", req.body);
  // const { email, password, googleLogin } = req.body;
  const { email, password } = req.body;

  // if (googleLogin) {
  //   return await loginWithGoogle(req, res, next);
  // }

  if (!email || !password)
    return next(new ErrorHandler("Please enter your email and password", 400));

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Credentials.", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid password!", 401));

  const token = await user.getJWTToken();
  res.status(200).json({ user, token });
});

// forget password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  console.log("forgot password", req.body)
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please provide the email.", 400));
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  // get resetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  console.log(req);
  // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  console.log({ h: req.get("origin") })
  const resetPasswordUrl = `${req.get("origin")}/password/reset/${resetToken}`;
  console.log({ resetPasswordUrl })
  try {
    const template = fs.readFileSync(path.join(__dirname, "passwordReset.html"), "utf-8");

    // /{{(\w+)}}/g - match {{Word}} globally
    const renderedTemplate = template.replace(/{{(\w+)}}/g, (match, key) => {
      console.log({ match, key })
      return { resetPasswordUrl, fullname: user.fullname }[key] || match;
    });

    await sendEmail({
      email: user.email,
      subject: `Password Reset`,
      message: renderedTemplate
    });

    res.status(200).json({
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  console.log("reset password", req.body);
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Please provide password and confirm password.", 400));
  }
  // creating hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log({ resetPasswordToken })
  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has been expired.", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Please confirm your password", 400));
  }
  user.password = password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save({ validateBeforeSave: false });

  const token = await user.getJWTToken();
  res.status(200).json({ user, token });
});

// Update a document by ID
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  if (!isValidObjectId(userId)) {
    return next(new ErrorHandler("Invalid User ID", 400));
  }

  delete req.body.password;
  delete req.body.role;
  
  console.log("update profile", { body: req.body })
  const user = await userModel.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) return next(new ErrorHandler('User not found', 404));

  res.status(200).json({ user });
});

// update password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  if (!isValidObjectId(userId)) {
    console.log({ userId }, 2)
    return next(new ErrorHandler("Invalid User ID", 400));
  }

  const { curPassword, newPassword, confirmPassword } = req.body;
  if (!curPassword)
    return next(new ErrorHandler("Current Password is required.", 400));

  if (!newPassword || !confirmPassword)
    return next(new ErrorHandler("Password or Confirm Password is required.", 400));

  if (newPassword !== confirmPassword)
    return next(new ErrorHandler("Please confirm your password,", 400));

  const user = await userModel.findOne({ _id: userId }).select("+password");
  if (!user) return new ErrorHandler("User Not Found.", 404);

  const isPasswordMatched = await user.comparePassword(curPassword);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Current Password is invalid.", 400));

  user.password = newPassword;
  await user.save();
  res.status(200).json({ message: "Password Updated Successfully." });
});

// ------------------------------------ ADMIN ----------------------------
// Get all documents
exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({ users });
});

// Get a single document by ID
exports.getUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  const user = await userModel.findById(userId || id);
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({ user });
});

// Update a document by ID
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) return next(new ErrorHandler('User not found', 404));

  res.status(200).json({ user });
});

// Delete a document by ID
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let user = await userModel.findById(id);

  if (!user)
    return next(new ErrorHandler("User not found", 404));

  await user.deleteOne();

  res.status(200).json({
    message: "User Deleted successfully.",
  });
});
