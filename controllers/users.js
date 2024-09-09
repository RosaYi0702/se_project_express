const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send(ERROR_MESSAGES.BAD_REQUEST);
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODES.NOT_FOUND).send(ERROR_MESSAGES.NOT_FOUND);
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const updateProfile = async (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(ERROR_CODES.NOT_FOUND).send(ERROR_MESSAGES.NOT_FOUND);
      }

      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }

      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  try {
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res
    //     .status(ERROR_CODES.CONFLICT)
    //     .send({ message: ERROR_MESSAGES.CONFLICT });
    // }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(201).send({
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
    if (err.code === 11000) {
      return res
        .status(ERROR_MESSAGES.CONFLICT)
        .send({ message: ERROR_MESSAGES.CONFLICT });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

module.exports = { getCurrentUser, updateProfile, login, createUser };
