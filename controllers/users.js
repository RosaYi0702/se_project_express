const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("./errors/unauthorized-err");
const BadRequestError = require("./errors/bad-request-err");
const ConflictError = require("./errors/conflict-err");
const NotFoundError = require("./errors/not-found-err");

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Bad Request - email or password");
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
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      return res.send(user);
    })
    .catch(next);
};

const updateProfile = async (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError("No user with matching ID found");
      }

      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation Error"));
      }

      return next(err);
    });
};

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Bad Request - email or password");
  }

  try {
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
      return next(new BadRequestError("Validation Error"));
    }
    if (err.code === 11000) {
      return next(new ConflictError("Email already exists"));
    }
    return next(err);
  }
};

module.exports = { getCurrentUser, updateProfile, login, createUser };
