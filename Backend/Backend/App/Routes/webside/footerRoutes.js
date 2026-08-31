const express = require("express");
const { getFooterData } = require("../../Controllers/website/footerController");

const footerRoutes = express.Router();


// Public frontend API
footerRoutes.get("/data", getFooterData);

// Admin API
// footerRoutes.put("/update", updateFooterData);

module.exports = footerRoutes;