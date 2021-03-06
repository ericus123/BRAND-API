import User from "../../model/User";
import PassResetToken from "../../model/PassResetToken";
import VerToken from "../../model/VerificationToken";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { confirmEmail, resetPassword } from "../../helpers/emailTemplates";
import nodemailer from "nodemailer";
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CLIENT_REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
});
let accessToken;
const setAccessToken = async () => {
  accessToken = await oAuth2Client.getAccessToken();
};
setAccessToken();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.Email,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
    accessToken: accessToken,
  },
});

class AuthController {
  static async Login(req, res) {
    //Check credentials
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "Incorrect credentials" });
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res.status(400).json({ error: "Incorrect credentials" });

    const login = await User.findOne({
      email: req.body.email,
      password: user.password,
    });

    if (!login) return res.status(400).json({ error: "Incorrect credentials" });
    if (!user.isVerified)
      return res
        .status(400)
        .json({ error: "Your account has not been verified" });
    //create and assign a token
    const token = jwt.sign(
      {
        role: login.role,
        id: login._id,
        username: login.username,
        email: login.email,
        firstName: login.firstName,
        lastName: login.lastName,
        imageUrl: login.imageUrl,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      msg: "logged in successfuly",
      token: token,
    });
  }
  static async Signup(req, res) {
    if (req.body.confPassword != req.body.password)
      return res.status(400).json({ error: "Passwords do not match" });
    try {
      const { username, firstName, lastName, email, password } = req.body;
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists)
        return res.status(400).json({ error: "Email already exists" });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      });

      await user.save();
      const token = new VerToken({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token.save();
      const url = `${process.env.FRONTEND_URL}/account/verify/${user._id}/${token.token}`;
      const ConfEmailOptions = {
        from: process.env.Email,
        to: user.email,
        subject: "Confirm Email",
        html: confirmEmail({
          firstName,
          url,
        }),
      };
      transport.sendMail(ConfEmailOptions, async (err) => {
        if (err) {
          await user.delete();
          await token.delete();
          return res.status(500).json({
            msg: err.message,
            error: "Can't send verification email, try again",
          });
        }
        res.status(200).json({
          msg: `Verification email has been sent to ${email}`,
          email: email,
          token: token,
        });
      });
    } catch (error) {
      res.status(400).json({ err: error, error: "Error occured" });
    }
  }

  static async ConfEmail(req, res) {
    try {
      const { id, token } = req.params;
      const user = await User.findOne({ _id: id });
      const _token = await VerToken.findOne({
        token: token,
        _userId: id,
      });
      if (!_token) return res.status(400).json({ error: "Invalid token" });
      user.isVerified = true;
      await user.save();
      await VerToken.deleteMany({ where: { _userId: id } });
      return res.status(201).json({
        msg: "Your account is verified now, please login!",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Something went wrong, try again", err: error });
    }
  }
  static async ResendConfEmail(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findOne({
        _id: id,
      });

      if (!user) return res.status(400).json({ error: "Can't find user" });
      const { firstName, email } = user;
      const token = new VerToken({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token.save();
      const url = `${process.env.FRONTEND_URL}/account/verify/${user._id}/${token.token}`;
      const ConfEmailOptions = {
        from: process.env.Email,
        to: email,
        subject: "Confirm Email",
        html: confirmEmail({
          firstName,
          url,
        }),
      };
      transport.sendMail(ConfEmailOptions, async (err) => {
        if (err) {
          await user.delete();
          return res.status(500).json({
            msg: err.message,
            error: "Can't send verification email , try again",
          });
        }
        return res.status(200).json({
          msg: `Verification email has been sent to ${email}`,
          email: email,
          token: token.token,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: error, msg: "Something went wrong" });
    }
  }
  static async SendPassResetLink(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ error: "Can't find user" });
      }
      if (!user.isVerified) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/account/confirm/${user._id}`
        );
      }
      const Token = new PassResetToken({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await Token.save();
      const { firstName } = user;
      const url = `${process.env.FRONTEND_URL}/password/reset/${user._id}/${Token.token}`;
      const PassResetOptions = {
        from: process.env.Email,
        to: email,
        subject: "Reset Password",
        html: resetPassword({
          firstName,
          url,
        }),
      };
      transport.sendMail(PassResetOptions, async (err) => {
        if (err) {
          return res.status(500).json({
            msg: err.message,
            error: "Can't send password reset link , try again",
          });
        }
        return res.status(200).json({
          msg: `Password reset link has been sent to ${email}`,
          email: email,
          token: Token.token,
        });
      });
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Something went wrong", err: error });
    }
  }
  static async ResetPassword(req, res) {
    try {
      const { password, passwordConf } = req.body;

      if (password !== passwordConf) {
        return res.status(400).json({ error: "Passwords doesn't match" });
      }

      const { id, token } = req.params;
      const user = await User.findOne({ _id: id });

      const _token = await PassResetToken.findOne({
        _userId: id,
        token: token,
      });
      if (!_token) {
        return res.status(400).json({ error: "Invalid token" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await user.updateOne({ _id: id }, { $set: { password: hashedPassword } });
      await PassResetToken.deleteMany({ _userId: id });
      return res.status(201).json({ msg: "Password reset successfuly" });
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Something went wrong", err: error });
    }
  }
}

export default AuthController;
