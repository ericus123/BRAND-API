"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _users = _interopRequireDefault(require("./routes/users/users"));

var _profile = _interopRequireDefault(require("./routes/profile/profile"));

var _roles = _interopRequireDefault(require("./routes/roles/roles"));

var _auth = _interopRequireDefault(require("./routes/auth/auth"));

var _posts = _interopRequireDefault(require("./routes/blog/posts"));

var _newsLetter = _interopRequireDefault(require("./routes/subscriptions/newsLetter"));

var _videos = _interopRequireDefault(require("./routes/blog/videos"));

var _messages = _interopRequireDefault(require("./routes/queries/messages"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _cloudinary = _interopRequireDefault(require("cloudinary"));

//express app
var app = (0, _express["default"])();
app.use(_bodyParser["default"].json({
  limit: "50mb"
}));
app.use(_bodyParser["default"].urlencoded({
  limit: "50mb",
  extended: true
}));
app.use((0, _cookieParser["default"])()); //cloudinary

_dotenv["default"].config();

_cloudinary["default"].config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}); //connect to db


_mongoose["default"].connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function () {
  return console.log("connected to db!");
}); //Middleware


app.use(_express["default"].json()); //route Middlewares
//CORS middleware

var corsMiddleware = function corsMiddleware(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //replace localhost with actual host

  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};

app.use(corsMiddleware);
app.use("/api/auth", _auth["default"]);
app.use("/api/users", _users["default"]);
app.use("/api/roles", _roles["default"]);
app.use("/api/profile", _profile["default"]);
app.use("/api/subscriptions/newsletter", _newsLetter["default"]);
app.use("/api/posts", _posts["default"]);
app.use("/api/blog", _videos["default"]);
app.use("/api/messages", _messages["default"]);
app.use("/", function (req, res) {
  res.status(200).json({
    message: "Hello ! Welcome on our website "
  });
}); // app.use((req, res, next) => {
//   res.status(404).json({ error: "wrong route" });
//   next();
// });

var _default = app;
exports["default"] = _default;