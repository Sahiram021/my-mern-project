let express = require("express");
const multer = require("multer");
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

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/whychooseus");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

whyChooseUsRoutes.post("/create", upload.single("image"), whyChooseUsCreate);
whyChooseUsRoutes.get("/view", whyChooseUsView);
whyChooseUsRoutes.delete("/delete/:id", whyChooseUsDelete);
whyChooseUsRoutes.post("/multidelete", whyChooseUsmultiDelete);
whyChooseUsRoutes.get("/edit/:id", whyChooseUsEdit);
whyChooseUsRoutes.put("/update/:id", upload.single("image"), whyChooseUsUpdate);
whyChooseUsRoutes.post("/changestatus", changeStatus);

module.exports = whyChooseUsRoutes;
