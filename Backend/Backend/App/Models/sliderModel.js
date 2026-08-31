let mongoose = require("mongoose");

let sliderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      minLength: [2, "Slider title minimum length is 2"],
      maxLength: [100, "Slider title maximum length is 100"],
      required: [true, "Slider title is required"],
    },
    image: {
      type: String,
      minLength: [2, "Slider image minimum length is 2"],
      required: [true, "Slider image is required"],
    },
    link: {
      type: String,
      default: "",
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

let sliderModel = mongoose.model("slider", sliderSchema);
module.exports = sliderModel;
