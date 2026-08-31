let jwt = require("jsonwebtoken");
const cartModel = require("../../Models/cartModel");

let addTocart = async (req, res) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.send({ status: 0, message: "Authorization token required" });
        let decoded = jwt.verify(token, process.env.TOKENKEY || "12345");
        let { id } = decoded;
        let cartObject = { ...req.body };
        cartObject['userId'] = id;
        let result = await cartModel.create(cartObject);
        res.send({ status: 1, message: "Product added to cart successfully", data: result });
    } catch (err) {
        res.send({ status: 0, message: "Error adding to cart", error: err.message });
    }
};

let viewCart = async (req, res) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.send({ status: 0, message: "Authorization token required" });
        let decoded = jwt.verify(token, process.env.TOKENKEY || "12345");
        let { id } = decoded;
        let result = await cartModel.find({ userId: id });
        res.send({ status: 1, message: "Cart items retrieved successfully", data: result });
    } catch (err) {
        res.send({ status: 0, message: "Error fetching cart", error: err.message });
    }
};

let deleteCart = async (req, res) => {
    try {
        let { id } = req.params;
        let result = await cartModel.deleteOne({ _id: id });
        res.send({ status: 1, message: "Cart item removed successfully", data: result });
    } catch (err) {
        res.send({ status: 0, message: "Error removing cart item", error: err.message });
    }
};

let changeQty = async (req, res) => {
    try {
        let { id } = req.params;
        let { qty } = req.body;
        let result = await cartModel.updateOne({ _id: id }, { $set: { qty } });
        res.send({ status: 1, message: "Cart item quantity updated successfully", data: result });
    } catch (err) {
        res.send({ status: 0, message: "Error updating quantity", error: err.message });
    }
};

module.exports = { addTocart, viewCart, deleteCart, changeQty };