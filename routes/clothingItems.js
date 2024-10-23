const router = require("express").Router();
const { validateCardBody, validateID } = require("../middlewares/validation");
const {
  createClothingItems,
  deleteClothingItems,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

router.post("/", validateCardBody, createClothingItems);
router.delete("/:itemId", validateID, deleteClothingItems);
router.put("/:itemId/likes", validateID, likeClothingItem);
router.delete("/:itemId/likes", validateID, unlikeClothingItem);

module.exports = router;
