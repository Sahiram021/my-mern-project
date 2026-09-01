const mongoose = require("mongoose");
const orderModel = require("../Models/orderModel");

let viewOrders = async (req, res) => {
    try {
        let data = await orderModel.find().sort({ createdAt: -1 });
        res.send({ message: "Order View", status: 1, data });
    } catch (error) {
        res.send({ message: "Unable to fetch orders", status: 0, error: error.message });
    }
};

let updateOrderStatus = async (req, res) => {
    try {
        let id = req.params.id || req.body.id || req.body._id || req.query.id;
        let rawStatus = req.body.status || req.query.status;

        if (!id || !mongoose.Types.ObjectId.isValid(id.toString().trim())) {
            return res.send({
                message: "Invalid Order ID format",
                status: 0
            });
        }

        let cleanId = id.toString().trim();
        let status = (rawStatus || "").toString().toLowerCase().trim();

        let allowedStatus = [
            "pending",
            "processing",
            "success",
            "placed",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!status || !allowedStatus.includes(status)) {
            return res.send({
                message: "Invalid order status",
                status: 0,
                error: { status: `Status must be one of: ${allowedStatus.join(", ")}` }
            });
        }

        let updateObj = { status };
        if (req.body.PaymentStatus) {
            updateObj.PaymentStatus = req.body.PaymentStatus.toString().toLowerCase().trim();
        } else if (status === "success") {
            updateObj.PaymentStatus = "success";
        }

        let orderRes = await orderModel.findByIdAndUpdate(
            cleanId,
            { $set: updateObj },
            { returnDocument: 'after', new: true }
        );

        if (!orderRes) {
            return res.send({ message: "Order not found", status: 0 });
        }

        res.send({
            message: "Order status updated successfully",
            status: 1,
            data: orderRes
        });
    } catch (error) {
        res.send({
            message: "Unable to update order status",
            status: 0,
            error: error.message
        });
    }
};

module.exports = { viewOrders, updateOrderStatus };
