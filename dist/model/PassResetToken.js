"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var tokenSchema = new _mongoose["default"].Schema({
  _userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    "default": Date.now
  }
});

tokenSchema.methods.hasExpired = function () {
  var now = Date.now();
  return now - Date.parse(createDate) > 1000; // Date is converted to milliseconds to calculate 7 days it > one day = 24 hours * 60 minutes * 60 seconds *1000 milliseconds * 7 days = 604800000
};

var _default = _mongoose["default"].model("PassResetToken", tokenSchema);

exports["default"] = _default;