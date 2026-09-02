const express = require("express");
const { viewOrders, updateOrderStatus } = require("../../Controllers/orderController");

const orderRoutes = express.Router();

orderRoutes.get("/view", viewOrders);
orderRoutes.patch("/:id/status", updateOrderStatus);
orderRoutes.put("/:id/status", updateOrderStatus);

// Backward-compatible aliases for already-built admin bundles.
orderRoutes.post("/save", updateOrderStatus);
orderRoutes.post("/update-status/:id", updateOrderStatus);
orderRoutes.put("/update-status/:id", updateOrderStatus);
orderRoutes.post("/status/:id", updateOrderStatus);
orderRoutes.put("/status/:id", updateOrderStatus);

module.exports = orderRoutes;
