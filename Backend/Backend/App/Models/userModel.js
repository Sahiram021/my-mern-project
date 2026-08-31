let mongoose = require('mongoose');

let userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLength: [2, "User name minimum length is 2"],
            required: [true, "Name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },
        image: String,
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        }
    },
    { timestamps: true }
);

let userModel = mongoose.model("user", userSchema);
module.exports = userModel;
