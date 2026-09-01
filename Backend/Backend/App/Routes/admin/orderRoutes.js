let express = require("express")
const { viewOrders, updateOrderStatus } = require("../../Controllers/orderController")

let orderRoutes = express.Router()

orderRoutes.get("/view", viewOrders)
orderRoutes.post("/update-status/:id", updateOrderStatus)
orderRoutes.put("/update-status/:id", updateOrderStatus)
orderRoutes.post("/status/:id", updateOrderStatus)
orderRoutes.put("/status/:id", updateOrderStatus)

module.exports = orderRoutes
