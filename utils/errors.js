const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  BAD_REQUEST: "Invalid data provided",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Internal server error",
};

module.exports = { ERROR_CODES, ERROR_MESSAGES };
