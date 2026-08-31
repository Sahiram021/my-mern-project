const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },

    href: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const socialSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      lowercase: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const footerSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      default: "Claritas est etiam processus dynamicus",
    },

    phone: {
      type: String,
      default: "98745612330",
    },

    email: {
      type: String,
      default: "furniture@gmail.com",
    },

    socialLinks: {
      type: [socialSchema],
      default: [],
    },

    informationLinks: {
      type: [linkSchema],
      default: [],
    },

    accountLinks: {
      type: [linkSchema],
      default: [],
    },

    bottomLinks: {
      type: [linkSchema],
      default: [],
    },

    copyrightText: {
      type: String,
      default: "All Rights Reserved By Furniture",
    },

    paymentImage: {
      type: String,
      default: "",
    },

    topProductsLimit: {
      type: Number,
      default: 2,
    },
  },
  {
    timestamps: true,
  }
);

const footerModel = mongoose.model("footer", footerSchema);

module.exports = footerModel;