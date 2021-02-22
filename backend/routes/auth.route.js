const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/user.model.js");
const { registrationValidation } = require('../validation');
const { loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

  // validate req.body
  const { error } = registrationValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validate that email isn't already in db
  const emailExists = await User.findOne({email: req.body.email});
  if (emailExists) return res.status(400).send('A user identity with this email address already exists');

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  // save new user
  try {
    const savedUser = await user.save();
    res.send({user: user._id});
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  // validate req.body
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validate that email is associated with a user in db
  const user = await User.findOne({ email: req.body.email});
  if (!user) return res.status(400).send('Email address not associated with a user identity');

  // validate that password is correct
  const isCorrect = await bcrypt.compare(req.body.password, user.password);
  if (!isCorrect) return res.status(400).send('Invalid password');

  // create and assign a token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;
