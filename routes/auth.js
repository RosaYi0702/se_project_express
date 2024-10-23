const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const ConflictError = require("../controllers/errors/conflict-err");
const BadRequestError = require("../controllers/errors/bad-request-err");
const UnauthorizedError = require("../controllers/errors/unauthorized-err");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("Email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });
    return res.status(201).send({ data: newUser });
  } catch (err) {
    return next(new BadRequestError("Unable to sign up"));
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new UnauthorizedError("email or password is incorrect."));
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.send({ token });
  } catch (err) {
    return next(new Error("Server Error"));
  }
});
