const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.put("/me", updateProfile);

module.exports = router;
