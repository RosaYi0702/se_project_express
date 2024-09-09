const ClothingItems = require("../models/clothingItem");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send({ items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};
const createClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItems.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};
const deleteClothingItems = (req, res) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  ClothingItems.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }

      if (item.owner.toString() !== currentUserId.toString()) {
        return res
          .status(ERROR_CODES.FORBIDDEN)
          .send({ message: ERROR_MESSAGES.FORBIDDEN });
      }

      return ClothingItems.findByIdAndDelete(itemId).then((deletedItem) => {
        res
          .status(200)
          .send({ message: "item deleted successfully", deletedItem });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const likeClothingItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItems.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ message: "item liked successfully", item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const unlikeClothingItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItems.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ message: "item unliked successfully", item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

module.exports = {
  getClothingItems,
  createClothingItems,
  deleteClothingItems,
  likeClothingItem,
  unlikeClothingItem,
};
