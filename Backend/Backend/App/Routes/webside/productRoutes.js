const express = require("express");
const { searchProducts } = require("../../Controllers/website/productController");
const router = express.Router();


router.get("/products/search", searchProducts);
module.exports = router;