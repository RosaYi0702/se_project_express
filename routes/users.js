const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateID } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateID, updateProfile);

module.exports = router;
