let express = require("express");
const multer = require("multer");
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

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/slider");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

sliderRoutes.post("/create", upload.single("image"), sliderCreate);
sliderRoutes.get("/view", sliderView);
sliderRoutes.delete("/delete/:id", sliderDelete);
sliderRoutes.post("/multidelete", slidermultiDelete);
sliderRoutes.get("/edit/:id", sliderEdit);
sliderRoutes.put("/update/:id", upload.single("image"), sliderUpdate);
sliderRoutes.post("/changestatus", changeStatus);

module.exports = sliderRoutes;
