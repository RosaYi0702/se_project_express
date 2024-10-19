const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const { createClothingItems } = require("../controllers/clothingItems");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imgUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});
module.exports.validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "name" field must be filled in',
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message("Invalid URL format");
        }
        return value;
      })
      .messages({
        "string.empty": 'The "avatar" field must be filled in',
      }),
    email: Joi.string().required().email().messages({
      "string.email": "Invalid Email format",
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": 'The "password" field must be filled in' }),
  }),
});

module.exports.validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Invalid Email format",
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateID = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required().messages({
      "string.length": "ID must be 24 characters long",
      "string.hex": "ID must be a valid hexadecimal",
      "string.empty": 'The "id" field must be filled in',
    }),
  }),
});
