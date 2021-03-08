"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _app = _interopRequireDefault(require("./app"));

//Listen for requests
var port = process.env.PORT || 5000;

_app["default"].listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is listening on port ".concat(port));
  }
});