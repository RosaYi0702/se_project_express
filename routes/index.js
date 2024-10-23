const router = require("express").Router();
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { getClothingItems } = require("../controllers/clothingItems");
const { validateSignIn, validateSignUp } = require("../middlewares/validation");
const NotFoundError = require("../controllers/errors/not-found-err");

router.post("/signin", validateSignIn, login);
router.post("/signup", validateSignUp, createUser);
router.get("/items", getClothingItems);

router.use(authMiddleware);
router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.use(() => {
  throw new NotFoundError("Not Found Page");
});

module.exports = router;
