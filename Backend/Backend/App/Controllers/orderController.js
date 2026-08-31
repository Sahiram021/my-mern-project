const orderModel = require("../Models/orderModel")

let viewOrders = async (req, res) => {
    let data = await orderModel.find().sort({ createdAt: -1 })
    res.send({ message: "order View", status: 1, data })
}

module.exports = { viewOrders }
