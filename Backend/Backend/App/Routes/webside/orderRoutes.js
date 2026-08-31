let express=require("express")
const { saveOrder, varifyPayment, viewOrders, getOrderDetails } = require("../../Controllers/website/orderContrller")
let orderRoutes=express.Router()
orderRoutes.post('/save-order',saveOrder)
orderRoutes.post('/verify-order', varifyPayment)
orderRoutes.get("/get-orders", viewOrders);
orderRoutes.get("/get-order/:orderId", getOrderDetails);
module.exports=orderRoutes