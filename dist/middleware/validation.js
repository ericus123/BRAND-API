"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messageValidation = exports.categoryValidation = exports.BlogVideosUpdateValidation = exports.BlogVideosValidation = exports.postValidation = exports.postCommentReplyValidation = exports.postCommentValidation = exports.PassResetValidation = exports.PassResetEmailValidation = exports.loginValidation = exports.roleValidation = exports.profileUpdateValidation = exports.completeProfileValidation = exports.userValidation = void 0;

var Joi = require("@hapi/joi");

var userValidation = function userValidation(req, res, next) {
  var schema = Joi.object({
    username: Joi.string().min(3).max(12).regex(/[a-zA-Z]/).required().messages({
      "string.base": "Username must contain letters only ",
      "string.empty": "Please fill in your username",
      "string.min": "Username must be at least {#limit} characters long",
      "string.max": "Username must be below {#limit} characters long",
      "any.required": "Username is required"
    }),
    email: Joi.string().min(8).email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Invalid email",
      "string.empty": "Please fill in your email",
      "string.min": "Email must be at least {#limit} characters long",
      "any.required": "Email is required"
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": "Password must be string",
      "string.empty": "Please fill in your password",
      "string.min": "Password must be at least {#limit} characters long",
      "any.required": "Password is required"
    }),
    confPassword: Joi.string().min(8).required().messages({
      "string.base": "Password Confirmation must be string",
      "string.empty": "Please confirm your password",
      "string.min": "Password confirmation must be at least {#limit} characters long",
      "any.required": "Password confirmation is required"
    }),
    firstName: Joi.string().min(3).max(12).regex(/[a-zA-Z]/).required().messages({
      "string.base": "First name must contain letters only ",
      "string.empty": "Please fill in your first name",
      "string.min": "Fisrt name must be at least {#limit} characters long",
      "string.max": "First name must be below {#limit} characters long",
      "any.required": "First name is required"
    }),
    lastName: Joi.string().min(3).max(12).regex(/[a-zA-Z]/).required().messages({
      "string.base": "Last name must contain letters only ",
      "string.empty": "Please fill in your last name",
      "string.min": "Last name must be at least {#limit} characters long",
      "string.max": "Last name must be below {#limit} characters long",
      "any.required": "Last name is required"
    }),
    subscribedNewsLetter: Joi["boolean"]()
  });

  var _schema$validate = schema.validate(req.body),
      error = _schema$validate.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.userValidation = userValidation;

var completeProfileValidation = function completeProfileValidation(req, res, next) {
  var schema = Joi.object({
    img: Joi.any().required().messages({
      "any.empty": "Profile image is required",
      "any.required": "Profile image is required"
    }),
    bio: Joi.string().min(10).max(40).regex(/[a-zA-Z]/).required().messages({
      "string.base": "Bio must contain letters only ",
      "string.empty": "Please fill in your bio",
      "string.min": "Bio must be at least {#limit} characters long",
      "string.max": "Bio must be below {#limit} characters long",
      "any.required": "Bio is required"
    })
  });

  var _schema$validate2 = schema.validate(req.body),
      error = _schema$validate2.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.completeProfileValidation = completeProfileValidation;

var profileUpdateValidation = function profileUpdateValidation(req, res, next) {
  var schema = Joi.object({
    username: Joi.string().min(3).max(12).regex(/[a-zA-Z]/).messages({
      "string.base": "Username must contain letters only ",
      "string.empty": "Please fill in your username",
      "string.min": "Username must be at least {#limit} characters long",
      "string.max": "Username must be below {#limit} characters long"
    }),
    bio: Joi.string().min(10).max(40).regex(/[a-zA-Z]/).messages({
      "string.base": "Bio must contain letters only ",
      "string.empty": "Please fill in your bio",
      "string.min": "Bio must be at least {#limit} characters long",
      "string.max": "Bio must be below {#limit} characters long"
    }),
    firstName: Joi.string().min(3).max(12).regex(/[a-zA-Z]/).messages({
      "string.base": "First name must contain letters only ",
      "string.empty": "Please fill in your first name",
      "string.min": "Fisrt name must be at least {#limit} characters long",
      "string.max": "First name must be below {#limit} characters long"
    }),
    lastName: Joi.string().min(3).max(12).regex(/[a-zA-Z]/).messages({
      "string.base": "Last name must contain letters only ",
      "string.empty": "Please fill in your last name",
      "string.min": "Last name must be at least {#limit} characters long",
      "string.max": "Last name must be below {#limit} characters long"
    }),
    imageUrl: Joi.string().uri().messages({
      "string.base": "Url must be a link",
      "string.empty": "Image url is required"
    })
  });

  var _schema$validate3 = schema.validate(req.body),
      error = _schema$validate3.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.profileUpdateValidation = profileUpdateValidation;

var roleValidation = function roleValidation(req, res, next) {
  var schema = Joi.object({
    email: Joi.string().min(8).email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Invalid email",
      "string.empty": "Please fill in your email",
      "string.min": "Email must be at least {#limit} characters long",
      "any.required": "Email is required"
    }),
    role: Joi.string().valid("basic", "admin", "superAdmin").required().messages({
      "string.base": "Role name must contain letters only",
      "string.empty": "Please fill in the role name",
      "any.required": "Role name is required"
    })
  });

  var _schema$validate4 = schema.validate(req.body),
      error = _schema$validate4.error;

  if (error) return res.status(400).send({
    error: error.details[0].message
  });
  return next();
};

exports.roleValidation = roleValidation;

var loginValidation = function loginValidation(req, res, next) {
  var schema = Joi.object({
    email: Joi.string().min(8).email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Invalid email",
      "string.empty": "Please fill in your email",
      "string.min": "Email must be at least {#limit} characters long",
      "any.required": "Email is required"
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": "Password must be string",
      "string.empty": "Please fill in your password",
      "string.min": "Password must be at least {#limit} characters long",
      "any.required": "Password is required"
    })
  });

  var _schema$validate5 = schema.validate(req.body),
      error = _schema$validate5.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.loginValidation = loginValidation;

var PassResetEmailValidation = function PassResetEmailValidation(req, res, next) {
  var schema = Joi.object({
    email: Joi.string().min(8).email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Invalid email",
      "string.empty": "Please fill in your email",
      "string.min": "Email must be at least {#limit} characters long",
      "any.required": "Email is required"
    })
  });

  var _schema$validate6 = schema.validate(req.body),
      error = _schema$validate6.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.PassResetEmailValidation = PassResetEmailValidation;

var PassResetValidation = function PassResetValidation(req, res, next) {
  var schema = Joi.object({
    password: Joi.string().min(8).required().messages({
      "string.base": "Password must be string",
      "string.empty": "Please fill in your password",
      "string.min": "Password must be at least {#limit} characters long",
      "any.required": "Password is required"
    }),
    passwordConf: Joi.string().min(8).required().messages({
      "string.base": "Password Confirmation must be string",
      "string.empty": "Please confirm your password",
      "string.min": "Password confirmation must be at least {#limit} characters long",
      "any.required": "Password confirmation is required"
    })
  });

  var _schema$validate7 = schema.validate(req.body),
      error = _schema$validate7.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.PassResetValidation = PassResetValidation;

var postCommentValidation = function postCommentValidation(req, res, next) {
  var schema = Joi.object({
    description: Joi.string().required().messages({
      "string.base": "Comment must contain words",
      "string.empty": "Comment can't be empty ",
      "any.required": "Comment is required"
    })
  });

  var _schema$validate8 = schema.validate(req.body),
      error = _schema$validate8.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.postCommentValidation = postCommentValidation;

var postCommentReplyValidation = function postCommentReplyValidation(req, res, next) {
  var schema = Joi.object({
    description: Joi.string().required().messages({
      "string.base": "Reply must contain words",
      "string.empty": "Reply can't be empty ",
      "any.required": "Reply is required"
    })
  });

  var _schema$validate9 = schema.validate(req.body),
      error = _schema$validate9.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.postCommentReplyValidation = postCommentReplyValidation;

var postValidation = function postValidation(req, res, next) {
  var schema = Joi.object({
    title: Joi.string().min(15).max(300).regex(/[a-zA-Z0-9]/).required().messages({
      "string.base": "Title must contain letters and numbers only",
      "string.empty": "Please fill in the title",
      "string.min": "Title must be at least {#limit} characters long",
      "string.max": "Title must be below {#limit} characters long",
      "any.required": "Title is required"
    }),
    description: Joi.string().min(500).required().messages({
      "string.base": "Post body must contain words",
      "string.empty": "Please fill in the post body",
      "string.min": "Post body must be at least {#limit} characters long",
      "any.required": "Post body is required",
      "string.max": "Post body must be less than  {#limit} characters long"
    }),
    category: Joi.string().min(4).max(20).regex(/[a-zA-Z]/).required().messages({
      "string.base": "Post category must contain letters only ",
      "string.empty": "Please fill in the post category",
      "string.min": "Category must be at least {#limit} characters long",
      "string.max": "Category must be below {#limit} characters long",
      "any.required": "Category is required"
    }),
    imageUrl: Joi.string().uri().messages({
      "string.base": "Url must be a link",
      "string.empty": "Image url is required"
    }),
    img: Joi.any()
  });

  var _schema$validate10 = schema.validate(req.body),
      error = _schema$validate10.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.postValidation = postValidation;

var BlogVideosValidation = function BlogVideosValidation(req, res, next) {
  var schema = Joi.object({
    // author: Joi.string().messages({
    //   "string.base": "Author's name must a string",
    //   "string.empty": "Author's name is required",
    //   "string.pattern.base": "Author's name is not meaningful",
    // }),
    author: Joi.any(),
    link: Joi.string().uri().required().messages({
      "string.base": "Please provide a valid url",
      "string.empty": "Provide a video link",
      "string.uri": "Please provide a valid url",
      "any.required": "Video link is required"
    }),
    description: Joi.string().regex(/[a-zA-Z0-9]/).required().min(20).max(50).messages({
      "string.base": "Provide a meaningful description",
      "string.empty": "Provide a description",
      "any.required": "Description is required",
      "string.min": "Description must at least have {#limit} characters",
      "string.max": "Description must not exceed {#limit} characters",
      "string.pattern.base": "Please provide a meaningful description"
    })
  });

  var _schema$validate11 = schema.validate(req.body),
      error = _schema$validate11.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.BlogVideosValidation = BlogVideosValidation;

var BlogVideosUpdateValidation = function BlogVideosUpdateValidation(req, res, next) {
  var schema = Joi.object({
    author: Joi.any(),
    link: Joi.string().uri().messages({
      "string.base": "Please provide a valid url",
      "string.empty": "Provide a video link",
      "string.uri": "Please provide a valid url"
    }),
    description: Joi.string().regex(/[a-zA-Z0-9]/).min(20).max(50).messages({
      "string.base": "Provide a meaningful description",
      "string.empty": "Provide a description",
      "string.min": "Description must at least have {#limit} characters",
      "string.max": "Description must not exceed {#limit} characters",
      "string.pattern.base": "Please provide a meaningful description"
    })
  });

  var _schema$validate12 = schema.validate(req.body),
      error = _schema$validate12.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.BlogVideosUpdateValidation = BlogVideosUpdateValidation;

var categoryValidation = function categoryValidation(req, res, next) {
  var schema = Joi.object({
    name: Joi.string().min(2).max(30).regex(/[a-zA-Z0-9]/).required().messages({
      "string.base": "Name must contain letters and numbers only",
      "string.empty": "Please fill in the name",
      "string.min": "Name must be at least {#limit} characters long",
      "string.max": "Name must be below {#limit} characters long",
      "any.required": "Name is required"
    }),
    description: Joi.string().min(20).max(200).required().messages({
      "string.base": "Description must contain words",
      "string.empty": "Please fill in the description",
      "string.min": "Description must be at least {#limit} characters long",
      "any.required": "Description is required",
      "string.max": "Description must be less than  {#limit} characters long"
    })
  });

  var _schema$validate13 = schema.validate(req.body),
      error = _schema$validate13.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.categoryValidation = categoryValidation;

var messageValidation = function messageValidation(req, res, next) {
  var schema = Joi.object({
    name: Joi.string().min(3).max(12).regex(/[a-zA-Z]/).messages({
      "string.base": "Name must contain letters only ",
      "string.empty": "Please fill in your name",
      "string.min": "Name must be at least {#limit} characters long",
      "string.max": "Name must be below {#limit} characters long"
    }),
    email: Joi.string().min(8).email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Invalid email",
      "string.empty": "Please fill in your email",
      "string.min": "Email must be at least {#limit} characters long",
      "any.required": "Email is required"
    }),
    message: Joi.string().regex(/[a-zA-Z0-9]/).max(300).required().messages({
      "string.base": "Message must contain words",
      "string.empty": "Message can't be empty",
      "string.min": "Message must be at least {#limit} characters long",
      "any.required": "Message is required",
      "string.pattern.base": "Please provide a meaningful message"
    })
  });

  var _schema$validate14 = schema.validate(req.body),
      error = _schema$validate14.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

exports.messageValidation = messageValidation;