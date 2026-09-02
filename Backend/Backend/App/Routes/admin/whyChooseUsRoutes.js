let express = require("express");
const { createImageUpload } = require("../../config/upload");
const {
  whyChooseUsCreate,
  whyChooseUsView,
  whyChooseUsDelete,
  whyChooseUsmultiDelete,
  whyChooseUsEdit,
  whyChooseUsUpdate,
  changeStatus,
} = require("../../Controllers/whyChooseUsController");

let whyChooseUsRoutes = express.Router();

const upload = createImageUpload("whychooseus", { maxCount: 1 });

whyChooseUsRoutes.post("/create", upload.single("image"), whyChooseUsCreate);
whyChooseUsRoutes.get("/view", whyChooseUsView);
whyChooseUsRoutes.delete("/delete/:id", whyChooseUsDelete);
whyChooseUsRoutes.post("/multidelete", whyChooseUsmultiDelete);
whyChooseUsRoutes.get("/edit/:id", whyChooseUsEdit);
whyChooseUsRoutes.put("/update/:id", upload.single("image"), whyChooseUsUpdate);
whyChooseUsRoutes.post("/changestatus", changeStatus);

module.exports = whyChooseUsRoutes;
