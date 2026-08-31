let mongoose = require("mongoose")
let adminSchema = new mongoose.Schema({
    name: {
        type: String,   
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
    },  
    address: {
        type: String,
    },
    mapUrl: {
        type: String,
    },
    facebook: {
        type: String,
    },  
    instagram: {
        type: String,
    },
    youtube: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

let adminModel = mongoose.model("admin", adminSchema)
module.exports = adminModel