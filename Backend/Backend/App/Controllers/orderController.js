const mongoose = require("mongoose");
const orderModel = require("../Models/orderModel");

const allowedOrderStatuses = [
    "pending",
    "processing",
    "success",
    "placed",
    "shipped",
    "delivered",
    "cancelled"
];

const allowedPaymentStatuses = ["pending", "success", "cancelled"];

const viewOrders = async (_req, res) => {
    try {
        const data = await orderModel.find().sort({ createdAt: -1 });
        return res.status(200).send({ message: "Order View", status: 1, data });
    } catch (_error) {
        return res.status(500).send({ message: "Unable to fetch orders", status: 0 });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id || req.body.orderId || req.body.id || req.body._id || req.query.id;
        const rawStatus = req.body.status ?? req.query.status;

        if (!id || !mongoose.Types.ObjectId.isValid(id.toString().trim())) {
            return res.status(400).send({
                message: "Invalid Order ID format",
                status: 0
            });
        }

        const cleanId = id.toString().trim();
        const status = (rawStatus || "").toString().toLowerCase().trim();

        if (!status || !allowedOrderStatuses.includes(status)) {
            return res.status(400).send({
                message: "Invalid order status",
                status: 0,
                error: { status: `Status must be one of: ${allowedOrderStatuses.join(", ")}` }
            });
        }

        const updateObj = { status };
        if (req.body.PaymentStatus != null) {
            const paymentStatus = req.body.PaymentStatus.toString().toLowerCase().trim();
            if (!allowedPaymentStatuses.includes(paymentStatus)) {
                return res.status(400).send({
                    message: "Invalid payment status",
                    status: 0,
                    error: {
                        PaymentStatus: `Payment status must be one of: ${allowedPaymentStatuses.join(", ")}`
                    }
                });
            }
            updateObj.PaymentStatus = paymentStatus;
        } else if (status === "success") {
            updateObj.PaymentStatus = "success";
        }

        const order = await orderModel.findByIdAndUpdate(
            cleanId,
            { $set: updateObj },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).send({ message: "Order not found", status: 0 });
        }

        return res.status(200).send({
            message: "Order status updated successfully",
            status: 1,
            data: order
        });
    } catch (_error) {
        return res.status(500).send({
            message: "Unable to update order status",
            status: 0
        });
    }
};

module.exports = { viewOrders, updateOrderStatus, allowedOrderStatuses };
