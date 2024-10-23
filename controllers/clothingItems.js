const ClothingItems = require("../models/clothingItem");
const BadRequestError = require("./errors/bad-request-err");
const NotFoundError = require("./errors/not-found-err");
const ForbiddenError = require("./errors/forbidden-err");

const getClothingItems = (req, res, next) => {
  ClothingItems.find({})
    .then((items) => res.send({ items }))
    .catch((err) => next(err));
};
const createClothingItems = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItems.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation Error"));
      }
      return next(err);
    });
};
const deleteClothingItems = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  ClothingItems.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== currentUserId.toString()) {
        return next(new ForbiddenError("Forbidden - user not allowed"));
      }

      return ClothingItems.findByIdAndDelete(itemId).then((deletedItem) => {
        res
          .status(200)
          .send({ message: "item deleted successfully", deletedItem });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Document is not found"));
      }
      if (err.name === "CastError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
      }
      return next(err);
    });
};

const likeClothingItem = (req, res, next) => {
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
        return next(new NotFoundError("Document is not found"));
      }
      if (err.name === "CastError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
      }
      return next(err);
    });
};

const unlikeClothingItem = (req, res, next) => {
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
        next(new NotFoundError("Document is not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      }
      return next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItems,
  deleteClothingItems,
  likeClothingItem,
  unlikeClothingItem,
};
