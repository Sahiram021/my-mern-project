let express = require("express");
const { createImageUpload } = require("../../config/upload");
const {
  sliderCreate,
  sliderView,
  sliderDelete,
  slidermultiDelete,
  sliderEdit,
  sliderUpdate,
  changeStatus,
} = require("../../Controllers/sliderController");

let sliderRoutes = express.Router();

const upload = createImageUpload("slider", { maxCount: 1 });

sliderRoutes.post("/create", upload.single("image"), sliderCreate);
sliderRoutes.get("/view", sliderView);
sliderRoutes.delete("/delete/:id", sliderDelete);
sliderRoutes.post("/multidelete", slidermultiDelete);
sliderRoutes.get("/edit/:id", sliderEdit);
sliderRoutes.put("/update/:id", upload.single("image"), sliderUpdate);
sliderRoutes.post("/changestatus", changeStatus);

module.exports = sliderRoutes;
