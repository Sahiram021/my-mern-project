let express = require("express")
const { viewOrders } = require("../../Controllers/orderController")

let orderRoutes = express.Router()

orderRoutes.get("/view", viewOrders)

module.exports = orderRoutes
