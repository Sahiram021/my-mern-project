let mongoose = require("mongoose")

let productSchema = mongoose.Schema(
    {
        name: {
            type: String, // metal,plastic,wood
            minLength: [2, "product name minimum length of name is 2"], // minimum length of name is 2
            maxLength: [500, " product name maximum length of name is 500"], // maximum length of name is 15
            required: [true, "product name is required"], // name is required,
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
        },
        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subcategory",
        },
        subsubcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subSubcategory",
        },
        productType: {
            type: String,
            enum: ["Featured", "Bestseller", "On Sale", "New"],
            default: "New",


        },
        price: {
            type: Number,
        },
        salePrice: {
            type: Number,
            default: 0,
        },

        // Product rating
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        color: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "color",
            }
        ],
        material: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "material",
            }
        ],
        sortDescription: String,
        longDescription: String,
        image: {
            type: String, // metal,plastic,wood
            minLength: [2, "subcategory image minimum length of image is 2"], // minimum length of image is 2
            required: [true, "subcategory image is required"], // name is required,
        },
        gallery: Array,

        status: {
            type: Boolean, // true or false
            default: true // default value is true
        },
        slug: {
            type: String, // metal,plastic,wood
            minLength: [2, "product slug minimum length of slug is 2"],

        },
        order: {
            type: Number, // 1,2,3,4
            default: 0 // default value is 0
        },
        date: {
            type: Date, // date type
            default: Date.now // default value is current date
        }
    }
)

let productModel = mongoose.model("product", productSchema)
module.exports = productModel