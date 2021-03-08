"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _User = _interopRequireDefault(require("../../model/User"));

var _PassResetToken = _interopRequireDefault(require("../../model/PassResetToken"));

var _VerificationToken = _interopRequireDefault(require("../../model/VerificationToken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _crypto = _interopRequireDefault(require("crypto"));

var _emailTemplates = require("../../helpers/emailTemplates");

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _require = require("googleapis"),
    google = _require.google;

var OAuth2 = google.auth.OAuth2;

_dotenv["default"].config();

var oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CLIENT_REDIRECT_URI);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_CLIENT_REFRESH_TOKEN
});
var accessToken;

var setAccessToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return oAuth2Client.getAccessToken();

          case 2:
            accessToken = _context.sent;

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function setAccessToken() {
    return _ref.apply(this, arguments);
  };
}();

setAccessToken();

var transport = _nodemailer["default"].createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.Email,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
    accessToken: accessToken
  }
});

var AuthController = /*#__PURE__*/function () {
  function AuthController() {
    (0, _classCallCheck2["default"])(this, AuthController);
  }

  (0, _createClass2["default"])(AuthController, null, [{
    key: "Login",
    value: function () {
      var _Login = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
        var user, validPass, login, token;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _User["default"].findOne({
                  email: req.body.email
                });

              case 2:
                user = _context2.sent;

                if (user) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", res.status(400).json({
                  error: "Incorrect credentials"
                }));

              case 5:
                _context2.next = 7;
                return _bcryptjs["default"].compare(req.body.password, user.password);

              case 7:
                validPass = _context2.sent;

                if (validPass) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", res.status(400).json({
                  error: "Incorrect credentials"
                }));

              case 10:
                _context2.next = 12;
                return _User["default"].findOne({
                  email: req.body.email,
                  password: user.password
                });

              case 12:
                login = _context2.sent;

                if (login) {
                  _context2.next = 15;
                  break;
                }

                return _context2.abrupt("return", res.status(400).json({
                  error: "Incorrect credentials"
                }));

              case 15:
                if (user.isVerified) {
                  _context2.next = 17;
                  break;
                }

                return _context2.abrupt("return", res.status(400).json({
                  error: "Your account has not been verified"
                }));

              case 17:
                //create and assign a token
                token = _jsonwebtoken["default"].sign({
                  role: login.role,
                  id: login._id,
                  username: login.username,
                  email: login.email,
                  firstName: login.firstName,
                  lastName: login.lastName,
                  imageUrl: login.imageUrl
                }, process.env.TOKEN_SECRET, {
                  expiresIn: "1d"
                });
                return _context2.abrupt("return", res.status(200).json({
                  msg: "logged in successfuly",
                  token: token
                }));

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function Login(_x, _x2) {
        return _Login.apply(this, arguments);
      }

      return Login;
    }()
  }, {
    key: "Signup",
    value: function () {
      var _Signup = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
        var _req$body, username, firstName, lastName, email, password, emailExists, salt, hashedPassword, user, token, url, ConfEmailOptions;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(req.body.confPassword != req.body.password)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return", res.status(400).json({
                  error: "Passwords do not match"
                }));

              case 2:
                _context4.prev = 2;
                _req$body = req.body, username = _req$body.username, firstName = _req$body.firstName, lastName = _req$body.lastName, email = _req$body.email, password = _req$body.password;
                _context4.next = 6;
                return _User["default"].findOne({
                  email: req.body.email
                });

              case 6:
                emailExists = _context4.sent;

                if (!emailExists) {
                  _context4.next = 9;
                  break;
                }

                return _context4.abrupt("return", res.status(400).json({
                  error: "Email already exists"
                }));

              case 9:
                _context4.next = 11;
                return _bcryptjs["default"].genSalt(10);

              case 11:
                salt = _context4.sent;
                _context4.next = 14;
                return _bcryptjs["default"].hash(password, salt);

              case 14:
                hashedPassword = _context4.sent;
                user = new _User["default"]({
                  username: username,
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  password: hashedPassword
                });
                _context4.next = 18;
                return user.save();

              case 18:
                token = new _VerificationToken["default"]({
                  _userId: user._id,
                  token: _crypto["default"].randomBytes(16).toString("hex")
                });
                _context4.next = 21;
                return token.save();

              case 21:
                url = "".concat(process.env.FRONTEND_URL, "/account/verify/").concat(user._id, "/").concat(token.token);
                ConfEmailOptions = {
                  from: process.env.Email,
                  to: user.email,
                  subject: "Confirm Email",
                  html: (0, _emailTemplates.confirmEmail)({
                    firstName: firstName,
                    url: url
                  })
                };
                transport.sendMail(ConfEmailOptions, /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err) {
                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!err) {
                              _context3.next = 6;
                              break;
                            }

                            _context3.next = 3;
                            return user["delete"]();

                          case 3:
                            _context3.next = 5;
                            return token["delete"]();

                          case 5:
                            return _context3.abrupt("return", res.status(500).json({
                              msg: err.message,
                              error: "Can't send verification email, try again"
                            }));

                          case 6:
                            res.status(200).json({
                              msg: "Verification email has been sent to ".concat(email),
                              email: email,
                              token: token
                            });

                          case 7:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x5) {
                    return _ref2.apply(this, arguments);
                  };
                }());
                _context4.next = 29;
                break;

              case 26:
                _context4.prev = 26;
                _context4.t0 = _context4["catch"](2);
                res.status(400).json({
                  err: _context4.t0,
                  error: "Error occured"
                });

              case 29:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[2, 26]]);
      }));

      function Signup(_x3, _x4) {
        return _Signup.apply(this, arguments);
      }

      return Signup;
    }()
  }, {
    key: "ConfEmail",
    value: function () {
      var _ConfEmail = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
        var _req$params, id, token, user, _token;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _req$params = req.params, id = _req$params.id, token = _req$params.token;
                _context5.next = 4;
                return _User["default"].findOne({
                  _id: id
                });

              case 4:
                user = _context5.sent;
                _context5.next = 7;
                return _VerificationToken["default"].findOne({
                  token: token,
                  _userId: id
                });

              case 7:
                _token = _context5.sent;

                if (_token) {
                  _context5.next = 10;
                  break;
                }

                return _context5.abrupt("return", res.status(400).json({
                  error: "Invalid token"
                }));

              case 10:
                user.isVerified = true;
                _context5.next = 13;
                return user.save();

              case 13:
                _context5.next = 15;
                return _VerificationToken["default"].deleteMany({
                  where: {
                    _userId: id
                  }
                });

              case 15:
                return _context5.abrupt("return", res.status(201).json({
                  msg: "Your account is verified now, please login!"
                }));

              case 18:
                _context5.prev = 18;
                _context5.t0 = _context5["catch"](0);
                res.status(500).json({
                  error: "Something went wrong, try again",
                  err: _context5.t0
                });

              case 21:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 18]]);
      }));

      function ConfEmail(_x6, _x7) {
        return _ConfEmail.apply(this, arguments);
      }

      return ConfEmail;
    }()
  }, {
    key: "ResendConfEmail",
    value: function () {
      var _ResendConfEmail = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
        var id, user, firstName, email, token, url, ConfEmailOptions;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                id = req.params.id;
                _context7.next = 4;
                return _User["default"].findOne({
                  _id: id
                });

              case 4:
                user = _context7.sent;

                if (user) {
                  _context7.next = 7;
                  break;
                }

                return _context7.abrupt("return", res.status(400).json({
                  error: "Can't find user"
                }));

              case 7:
                firstName = user.firstName, email = user.email;
                token = new _VerificationToken["default"]({
                  _userId: user._id,
                  token: _crypto["default"].randomBytes(16).toString("hex")
                });
                _context7.next = 11;
                return token.save();

              case 11:
                url = "".concat(process.env.FRONTEND_URL, "/account/verify/").concat(user._id, "/").concat(token.token);
                ConfEmailOptions = {
                  from: process.env.Email,
                  to: email,
                  subject: "Confirm Email",
                  html: (0, _emailTemplates.confirmEmail)({
                    firstName: firstName,
                    url: url
                  })
                };
                transport.sendMail(ConfEmailOptions, /*#__PURE__*/function () {
                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(err) {
                    return _regenerator["default"].wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            if (!err) {
                              _context6.next = 4;
                              break;
                            }

                            _context6.next = 3;
                            return user["delete"]();

                          case 3:
                            return _context6.abrupt("return", res.status(500).json({
                              msg: err.message,
                              error: "Can't send verification email , try again"
                            }));

                          case 4:
                            return _context6.abrupt("return", res.status(200).json({
                              msg: "Verification email has been sent to ".concat(email),
                              email: email,
                              token: token.token
                            }));

                          case 5:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }));

                  return function (_x10) {
                    return _ref3.apply(this, arguments);
                  };
                }());
                _context7.next = 20;
                break;

              case 16:
                _context7.prev = 16;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                return _context7.abrupt("return", res.status(500).json({
                  err: _context7.t0,
                  msg: "Something went wrong"
                }));

              case 20:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 16]]);
      }));

      function ResendConfEmail(_x8, _x9) {
        return _ResendConfEmail.apply(this, arguments);
      }

      return ResendConfEmail;
    }()
  }, {
    key: "SendPassResetLink",
    value: function () {
      var _SendPassResetLink = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
        var email, user, Token, firstName, url, PassResetOptions;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                email = req.body.email;
                _context9.next = 4;
                return _User["default"].findOne({
                  email: email
                });

              case 4:
                user = _context9.sent;

                if (user) {
                  _context9.next = 7;
                  break;
                }

                return _context9.abrupt("return", res.status(400).json({
                  error: "Can't find user"
                }));

              case 7:
                if (user.isVerified) {
                  _context9.next = 9;
                  break;
                }

                return _context9.abrupt("return", res.redirect("".concat(process.env.FRONTEND_URL, "/account/confirm/").concat(user._id)));

              case 9:
                Token = new _PassResetToken["default"]({
                  _userId: user._id,
                  token: _crypto["default"].randomBytes(16).toString("hex")
                });
                _context9.next = 12;
                return Token.save();

              case 12:
                firstName = user.firstName;
                url = "".concat(process.env.FRONTEND_URL, "/password/reset/").concat(user._id, "/").concat(Token.token);
                PassResetOptions = {
                  from: process.env.Email,
                  to: email,
                  subject: "Reset Password",
                  html: (0, _emailTemplates.resetPassword)({
                    firstName: firstName,
                    url: url
                  })
                };
                transport.sendMail(PassResetOptions, /*#__PURE__*/function () {
                  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(err) {
                    return _regenerator["default"].wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            if (!err) {
                              _context8.next = 2;
                              break;
                            }

                            return _context8.abrupt("return", res.status(500).json({
                              msg: err.message,
                              error: "Can't send password reset link , try again"
                            }));

                          case 2:
                            return _context8.abrupt("return", res.status(200).json({
                              msg: "Password reset link has been sent to ".concat(email),
                              email: email,
                              token: Token.token
                            }));

                          case 3:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8);
                  }));

                  return function (_x13) {
                    return _ref4.apply(this, arguments);
                  };
                }());
                _context9.next = 21;
                break;

              case 18:
                _context9.prev = 18;
                _context9.t0 = _context9["catch"](0);
                return _context9.abrupt("return", res.status(400).json({
                  error: "Something went wrong",
                  err: _context9.t0
                }));

              case 21:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 18]]);
      }));

      function SendPassResetLink(_x11, _x12) {
        return _SendPassResetLink.apply(this, arguments);
      }

      return SendPassResetLink;
    }()
  }, {
    key: "ResetPassword",
    value: function () {
      var _ResetPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
        var _req$body2, password, passwordConf, _req$params2, id, token, user, _token, salt, hashedPassword;

        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                _req$body2 = req.body, password = _req$body2.password, passwordConf = _req$body2.passwordConf;

                if (!(password !== passwordConf)) {
                  _context10.next = 4;
                  break;
                }

                return _context10.abrupt("return", res.status(400).json({
                  error: "Passwords doesn't match"
                }));

              case 4:
                _req$params2 = req.params, id = _req$params2.id, token = _req$params2.token;
                _context10.next = 7;
                return _User["default"].findOne({
                  _id: id
                });

              case 7:
                user = _context10.sent;
                _context10.next = 10;
                return _PassResetToken["default"].findOne({
                  _userId: id,
                  token: token
                });

              case 10:
                _token = _context10.sent;

                if (_token) {
                  _context10.next = 13;
                  break;
                }

                return _context10.abrupt("return", res.status(400).json({
                  error: "Invalid token"
                }));

              case 13:
                _context10.next = 15;
                return _bcryptjs["default"].genSalt(10);

              case 15:
                salt = _context10.sent;
                _context10.next = 18;
                return _bcryptjs["default"].hash(password, salt);

              case 18:
                hashedPassword = _context10.sent;
                _context10.next = 21;
                return user.updateOne({
                  _id: id
                }, {
                  $set: {
                    password: hashedPassword
                  }
                });

              case 21:
                _context10.next = 23;
                return _PassResetToken["default"].deleteMany({
                  _userId: id
                });

              case 23:
                return _context10.abrupt("return", res.status(201).json({
                  msg: "Password reset successfuly"
                }));

              case 26:
                _context10.prev = 26;
                _context10.t0 = _context10["catch"](0);
                return _context10.abrupt("return", res.status(400).json({
                  error: "Something went wrong",
                  err: _context10.t0
                }));

              case 29:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 26]]);
      }));

      function ResetPassword(_x14, _x15) {
        return _ResetPassword.apply(this, arguments);
      }

      return ResetPassword;
    }()
  }]);
  return AuthController;
}();

var _default = AuthController;
exports["default"] = _default;