let mongoose = require("mongoose");

let whyChooseUsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      minLength: [2, "whyChooseUs title minimum length is 2"],
      maxLength: [1000, "whyChooseUs title maximum length is 1000"],
      required: [true, "whyChooseUs title is required"],
    },
    image: {
      type: String,
      minLength: [2, "whyChooseUs image minimum length is 2"],
      required: [true, "whyChooseUs image is required"],
    },
    description: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: [0, "whyChooseUs rating minimum value is 0"],
      max: [5, "whyChooseUs rating maximum value is 5"],
      default: 0,
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
  }
);

let whyChooseUsModel = mongoose.model("whyChooseUs", whyChooseUsSchema);
module.exports = whyChooseUsModel;
