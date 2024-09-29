const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const router = express.Router();
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

router.post("/signup", async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {

const existingUser = await User.findOne({email});
if(existingUser){
  return res.status(ERROR_CODES.CONFLICT).send({message: "Email already exists"})
}

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });
    res.status(201).send({ data: newUser });
  } catch (err) {
    res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(ERROR_CODES.UNAUTHORIZED)
        .send({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token });
  } catch (err) {
    res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
});
