const jwt = require("jsonwebtoken");
const { userModel, roleModel } = require("../src/user/user.model");
const ErrorHandler = require("../utils/errorHandler");

exports.auth = async (req, res, next) => {
  console.log(req.headers.authorization)
  try {
    if (!req.headers.authorization) {
      return res.status(401).send({
        error: {
          message: `Unauthorized. Please Send token in request header`,
        },
      });
    }

    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    console.log({ userId });

    req.userId = userId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: { message: `Unauthorized or Token is expired.` } });
  }
};

exports.authRole = (roles) => async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await userModel.findByPk(userId, {
      include: [{
        model: roleModel,
        as: "userRole",
        attributes: ["role"]
      }],
      attributes: {
        exclude: ["roleId"]
      }
    });

    console.log("inside is admin")
    // , userId, user.dataValues);
    if (!user)
      return next(new ErrorHandler("Invalid token. User not found.", 404));

    if (!roles.includes(user.userRole?.role))
      return next(new ErrorHandler("Restricted.", 401));

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorHandler("Unauthorized.", 401));
  }
};
