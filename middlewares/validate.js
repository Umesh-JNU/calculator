const { isValidObjectId } = require("mongoose");
const ErrorHandler = require("../utils/errorHandler")

class Validate {
  constructor() { }

  validateID = (IDType) => async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler(`Please send ${IDType} ID`, 400));
    }
    if (!isValidObjectId(id)) {
      return next(new ErrorHandler(`Invalid ${IDType} ID`, 400));
    }
    next();
  }

  warehouse = {
    assign: async (req, res, next) => {
      const misFields = this.warehouseAssign(req);
      if (misFields) return next(new ErrorHandler(misFields, 400));
      next();
    },
    remove: async (req, res, next) => {
      const misFields = this.warehouseRemove(req);
      if (misFields) return next(new ErrorHandler(misFields, 400));
      next();
    }
  }

  order = {
    post: async (req, res, next) => {
      const misFields = this.missingFields(this.orderAttr.create, req);
      if (misFields)
        return next(new ErrorHandler(misFields, 400));
      next();
    },
    put: async (req, res, next) => {
      req.body = Object.fromEntries(
        Object.entries(req.body).filter(([key, value]) =>
          this.orderAttr.update.includes(key)
        )
      );

      console.log({ bodt: req.body });
      if (!req.body || Object.keys(req.body).length === 0) {
        return next(new ErrorHandler(`Please provide at least one of the fields - ${this.orderAttr.update.join(', ')}.`, 400));
      }

      next();
    },
    updateStatus: async (req, res, next) => {
      if (!req.body.status) {
        return next(new ErrorHandler("Please provide the status", 400));
      }

      req.body = Object.fromEntries(
        Object.entries(req.body).filter(([key, value]) =>
          key === 'status'
        )
      );
      next();
    },
    approve: async (req, res, next) => {
      req.body = {};
      req.body.manager_valid = true;
      next();
    },
    item: async (req, res, next) => {
      const { items } = req.body;
      if (!items) {
        return next(new ErrorHandler("Please provide items.", 400));
      }

      if (!items.length || items.length === 0) {
        return next(new ErrorHandler("Please add atleast one item.", 400));
      }

      next();
    },
    itemObj: async (req, res, next) => {
      const { quantity, name } = req.body;
      if (!quantity && !name) {
        return next(new ErrorHandler("Missing fields - quantity and name", 400));
      }
      next();
    }
  }
}

module.exports = new Validate();