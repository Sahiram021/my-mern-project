const Razorpay = require('razorpay');
let jwt = require('jsonwebtoken');
const orderModel = require('../../Models/orderModel');
const cartModel = require('../../Models/cartModel');
const userModel = require('../../Models/userModel');
const { sendEmailSafe, getOrderConfirmationHtml, getNewOrderAlertHtml } = require('../../config/helper');

var instance = new Razorpay({
    key_id: 'rzp_test_TO8v2KO3H8d2bV',
    key_secret: 'lDlH6hcAyhvtMK5hZzXlVBL9',
});

// Helper function to dispatch order emails
const dispatchOrderEmails = async (orderData, userId) => {
    try {
        let userDetails = {};
        if (userId) {
            userDetails = await userModel.findById(userId).lean() || {};
        }

        const customerEmail = orderData.shippingAddress?.email || userDetails.email;
        const ownerEmail = process.env.OWNER_EMAIL || process.env.ADMINEMAIL || process.env.SMTP_USER;

        // 1. Send Order Confirmation to Customer
        if (customerEmail) {
            sendEmailSafe({
                to: customerEmail,
                subject: `Order Confirmation - JGB Trading #${orderData._id ? orderData._id.toString().slice(-6).toUpperCase() : ''}`,
                html: getOrderConfirmationHtml(orderData, userDetails)
            });
        }

        // 2. Send New Order Alert to Owner
        if (ownerEmail) {
            sendEmailSafe({
                to: ownerEmail,
                subject: `🛒 New Order Placed: ₹${orderData.totalAmount || 0} by ${orderData.shippingAddress?.name || userDetails.name || 'Customer'}`,
                html: getNewOrderAlertHtml(orderData, userDetails)
            });
        }
    } catch (emailErr) {
        console.error("[Order Email Error]:", emailErr.message);
    }
};

let saveOrder = async (req, res) => {
    try {
        let orderObject = { ...req.body };
        let authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.send({ status: 0, message: "Authorization token required" });
        }

        let token = authHeader.split(" ")[1] || authHeader;
        let decoded = jwt.verify(token, process.env.TOKENKEY);
        let { id } = decoded;

        if (orderObject.paymentMethod === "cod") {
            orderObject['userId'] = id;
            orderObject['status'] = "processing";
            orderObject['PaymentStatus'] = "pending";

            let orderData = await orderModel.create(orderObject);
            await cartModel.deleteMany({ userId: id });

            // Send notification emails (asynchronously without blocking)
            dispatchOrderEmails(orderData, id);

            res.send({ status: 1, message: "order saved successfully", orderData });

        } else {
            orderObject['userId'] = id;
            orderObject['status'] = "pending";
            orderObject['PaymentStatus'] = "pending";

            let orderData = await orderModel.create(orderObject);
            const options = {
                amount: Math.round((orderObject.totalAmount || 0) * 100), // Amount in paise
                currency: "INR",
                receipt: orderData._id.toString()
            };

            const order = await instance.orders.create(options);

            await orderModel.updateOne(
                { _id: orderData._id },
                { $set: { razorpayOrderId: order.id } }
            );

            res.send({
                status: 1,
                order
            });
        }
    } catch (err) {
        console.error("Save Order Error:", err);
        res.send({ status: 0, message: "Error processing order", error: err.message });
    }
};

let varifyPayment = async (req, res) => {
    try {
        let { razorpay_order_id, razorpay_payment_id } = req.body;
        let authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.send({ status: 0, message: "Authorization token required" });
        }

        let token = authHeader.split(" ")[1] || authHeader;
        let decoded = jwt.verify(token, process.env.TOKENKEY);
        let { id } = decoded;

        let updatedOrder = await orderModel.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                $set: {
                    PaymentStatus: "success",
                    status: "processing",
                    razorpayPaymentId: razorpay_payment_id
                }
            },
            { new: true }
        );

        await cartModel.deleteMany({ userId: id });

        if (updatedOrder) {
            // Send order confirmation & owner alert for verified online payment
            dispatchOrderEmails(updatedOrder, id);
        }

        res.send({ status: 1, message: "order saved successfully" });
    } catch (err) {
        console.error("Verify Payment Error:", err);
        res.send({ status: 0, message: "Payment verification failed", error: err.message });
    }
};

let viewOrders = async (req, res) => {
    try {
        let authHeader = req.headers.authorization;
        if (!authHeader) return res.send({ status: 0, message: "Authorization token required" });

        let token = authHeader.split(" ")[1] || authHeader;
        let decoded = jwt.verify(token, process.env.TOKENKEY);
        let { id } = decoded;

        let orders = await orderModel.find({ userId: id }).sort({ createdAt: -1 });

        res.send({
            status: 1,
            message: "Orders fetched successfully",
            data: orders
        });

    } catch (error) {
        console.log(error);
        res.send({
            status: 0,
            message: "Unable to fetch orders",
            error: error.message
        });
    }
};

let getOrderDetails = async (req, res) => {
    try {
        let authHeader = req.headers.authorization;
        if (!authHeader) return res.send({ status: 0, message: "Authorization token required" });

        let token = authHeader.split(" ")[1] || authHeader;
        let decoded = jwt.verify(token, process.env.TOKENKEY);
        let { id } = decoded;
        let { orderId } = req.params;

        let order = await orderModel.findOne({
            _id: orderId,
            userId: id
        });

        if (!order) {
            return res.send({
                status: 0,
                message: "Order not found"
            });
        }

        res.send({
            status: 1,
            message: "Order details fetched successfully",
            data: order
        });

    } catch (error) {
        console.log("Get Order Details Error:", error);
        res.send({
            status: 0,
            message: "Unable to fetch order details",
            error: error.message
        });
    }
};

module.exports = { saveOrder, varifyPayment, viewOrders, getOrderDetails };
