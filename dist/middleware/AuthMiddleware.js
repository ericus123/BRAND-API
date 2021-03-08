"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _User = _interopRequireDefault(require("../model/User"));

var AuthMiddleware = /*#__PURE__*/function () {
  function AuthMiddleware() {
    (0, _classCallCheck2["default"])(this, AuthMiddleware);
  }

  (0, _createClass2["default"])(AuthMiddleware, null, [{
    key: "checkToken",
    value: function () {
      var _checkToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var token, verified;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                token = req.header("auth-token");

                if (token) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", res.status(401).send({
                  error: "Please login!"
                }));

              case 3:
                try {
                  verified = _jsonwebtoken["default"].verify(token, process.env.TOKEN_SECRET);
                  req.user = verified;
                  next();
                } catch (err) {
                  res.status(400).send({
                    error: "Invalid Token"
                  });
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function checkToken(_x, _x2, _x3) {
        return _checkToken.apply(this, arguments);
      }

      return checkToken;
    }()
  }, {
    key: "checkAdmin",
    value: function () {
      var _checkAdmin = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(req.user.role === "admin" || req.user.role === "superAdmin")) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return", next());

              case 4:
                return _context2.abrupt("return", res.status(401).json({
                  error: "Access denied"
                }));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function checkAdmin(_x4, _x5, _x6) {
        return _checkAdmin.apply(this, arguments);
      }

      return checkAdmin;
    }()
  }, {
    key: "checkSuperAdmin",
    value: function () {
      var _checkSuperAdmin = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(req.user.role != "superAdmin")) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return", res.status(401).json({
                  error: "Access denied"
                }));

              case 2:
                next();

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function checkSuperAdmin(_x7, _x8, _x9) {
        return _checkSuperAdmin.apply(this, arguments);
      }

      return checkSuperAdmin;
    }()
  }, {
    key: "isNotVerified",
    value: function () {
      var _isNotVerified = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var id, user;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                id = req.params.id;
                _context4.next = 3;
                return _User["default"].findOne({
                  _id: id
                });

              case 3:
                user = _context4.sent;

                if (!user.isVerified) {
                  _context4.next = 6;
                  break;
                }

                return _context4.abrupt("return", res.status(400).json({
                  error: "Your account is already verified, please login!"
                }));

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function isNotVerified(_x10, _x11, _x12) {
        return _isNotVerified.apply(this, arguments);
      }

      return isNotVerified;
    }()
  }]);
  return AuthMiddleware;
}();

var _default = AuthMiddleware;
exports["default"] = _default;