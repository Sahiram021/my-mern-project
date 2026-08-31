const express = require("express");
const { megaMenuView } = require("../../Controllers/website/megaMenuController");

const megaMenuRoutes = express.Router();



megaMenuRoutes.get("/view", megaMenuView);


module.exports = megaMenuRoutes;