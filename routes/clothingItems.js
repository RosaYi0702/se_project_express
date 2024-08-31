const router = require("express").Router();
const {
  getClothingItems,
  createClothingItems,
  deleteClothingItems,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", createClothingItems);
router.delete("/:itemId", deleteClothingItems);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", unlikeClothingItem);

module.exports = router;
