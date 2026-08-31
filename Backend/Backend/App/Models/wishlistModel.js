const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
    },

    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index(
  { userId: 1, productId: 1 },
  { unique: true }
);

module.exports = mongoose.model("wishlist", wishlistSchema);