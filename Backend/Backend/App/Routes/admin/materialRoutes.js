let express = require("express");
const {
  materialCreate,
  materialView,
  materialDelete,
  materialEdit,
  materialUpdate,
  materialmultiDelete,
  changeStatus,
  getMaterialDetails,
} = require("../../Controllers/materialController");

let materialRoutes = express.Router();

materialRoutes.post("/create", materialCreate);
materialRoutes.get("/view", materialView);
materialRoutes.delete("/delete/:id", materialDelete);
materialRoutes.post("/multidelete", materialmultiDelete);
materialRoutes.get("/edit/:id", materialEdit);
materialRoutes.put("/update/:id", materialUpdate);
materialRoutes.put("/get-detail/:id", getMaterialDetails);
materialRoutes.post("/changestatus", changeStatus);

module.exports = materialRoutes;
