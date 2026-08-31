const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    name: {
        type: String
    },

    price: {
        type: Number
    },
    productId: {
        type: String
    },

    qty: {
        type: Number
    },

    image: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    }
});

const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;