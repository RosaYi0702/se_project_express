const router = require("express").Router();
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
});

module.exports = router;
