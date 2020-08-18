const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const { registerValidation, loginValidation } = require("../validation");
router.post("/register", async (req, res) => {
  //VALIDATE THE DATA BEFORE WE MAKE A USER
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if a user is already in the database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  //Hash the passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //Check if email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found");

  //password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");
  //create and assign a token
  const token = jwt.sign(
    {
      email: user.email,
    },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token);

  res.sendFile(path.resolve("views/index.html"));
});
module.exports = router;
