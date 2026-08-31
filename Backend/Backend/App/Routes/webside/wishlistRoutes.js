const express = require("express");

const {
  addToWishlist,
  viewWishlist,
  deleteWishlist,
} = require("../../Controllers/website/wishlistController");

const wishlistRoutes = express.Router();

wishlistRoutes.post("/add-to-wishlist", addToWishlist);

wishlistRoutes.get("/get-wishlist", viewWishlist);

wishlistRoutes.delete(
  "/remove-wishlist/:id",
  deleteWishlist
);

module.exports = wishlistRoutes;