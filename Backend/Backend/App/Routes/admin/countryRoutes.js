let express = require("express");
const {
  countryCreate,
  countryView,
  countryDelete,
  countryEdit,
  countryUpdate,
  countrymultiDelete,
  changeStatus,
  getCountryDetails,
} = require("../../Controllers/countryController");

let countryRoutes = express.Router();

countryRoutes.post("/create", countryCreate);
countryRoutes.get("/view", countryView);
countryRoutes.delete("/delete/:id", countryDelete);
countryRoutes.post("/multidelete", countrymultiDelete);
countryRoutes.get("/edit/:id", countryEdit);
countryRoutes.put("/update/:id", countryUpdate);
countryRoutes.put("/get-detail/:id", getCountryDetails);
countryRoutes.post("/changestatus", changeStatus);

module.exports = countryRoutes;
