const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, "Category name minimum length is 2"],
    maxLength: [50, "Category name maximum length is 50"],
    required: [true, "Category name is required"],
    trim: true,
  },

  slug: {
    type: String,
    required: [true, "Category slug is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },

  image: {
    type: String,
    minLength: [2, "Category image minimum length is 2"],
    maxLength: [500, "Category image maximum length is 500"],
    required: [true, "Category image is required"],
  },

  status: {
    type: Boolean,
    default: true,
  },

  order: {
    type: Number,
    default: 0,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;