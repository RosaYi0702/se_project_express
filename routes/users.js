const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUser } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUser, updateProfile);

module.exports = router;
