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

var _NewsLetter = _interopRequireDefault(require("../../model/NewsLetter"));

var NewsLetterController = /*#__PURE__*/function () {
  function NewsLetterController() {
    (0, _classCallCheck2["default"])(this, NewsLetterController);
  }

  (0, _createClass2["default"])(NewsLetterController, null, [{
    key: "subscribe",
    value: function () {
      var _subscribe = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
        var email, subscribed, subscriber;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                email = req.body.email;
                _context.next = 4;
                return _NewsLetter["default"].findOne({
                  email: email
                });

              case 4:
                subscribed = _context.sent;

                if (subscribed) {
                  res.status(400).json({
                    error: "You've already subscribed"
                  });
                }

                subscriber = new _NewsLetter["default"]({
                  email: email
                });
                _context.next = 9;
                return subscriber.save();

              case 9:
                res.status(201).json({
                  msg: "Subscribed",
                  subscriber: {
                    email: email,
                    createdAt: Date.now
                  }
                });
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](0);
                res.status(400).json({
                  error: "Something went wrong"
                });

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 12]]);
      }));

      function subscribe(_x, _x2) {
        return _subscribe.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: "unsubscribe",
    value: function () {
      var _unsubscribe = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
        var email, subscribed, _unsubscribe2;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                email = req.params.email;
                _context2.next = 4;
                return _NewsLetter["default"].findOne({
                  email: email
                });

              case 4:
                subscribed = _context2.sent;

                if (!subscribed) {
                  res.status(400).json({
                    error: "You've not subscribed"
                  });
                }

                _context2.next = 8;
                return _NewsLetter["default"].deleteOne(subscribed);

              case 8:
                _unsubscribe2 = _context2.sent;
                res.status(201).json({
                  msg: "Unsubscribed successfuly",
                  unsubscriber: subscribed
                });
                _context2.next = 15;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](0);
                res.status(400).json({
                  error: "Something went wrong, try again"
                });

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 12]]);
      }));

      function unsubscribe(_x3, _x4) {
        return _unsubscribe.apply(this, arguments);
      }

      return unsubscribe;
    }()
  }]);
  return NewsLetterController;
}();

var _default = NewsLetterController;
exports["default"] = _default;