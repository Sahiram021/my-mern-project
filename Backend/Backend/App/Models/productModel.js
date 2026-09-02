let mongoose = require("mongoose")

let productSchema = mongoose.Schema(
    {
        name: {
            type: String, // metal,plastic,wood
            minLength: [2, "product name minimum length of name is 2"], // minimum length of name is 2
            maxLength: [500, " product name maximum length of name is 500"], // maximum length of name is 15
            required: [true, "product name is required"], // name is required,
            trim: true,
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: [true, "parent category is required"],
        },
        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subcategory",
            required: [true, "subcategory is required"],
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
            required: [true, "product price is required"],
            min: [0, "product price cannot be negative"],
        },
        salePrice: {
            type: Number,
            default: 0,
            min: [0, "sale price cannot be negative"],
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
            required: [true, "product image is required"], // name is required,
        },
        gallery: {
            type: [String],
            default: [],
        },

        status: {
            type: Boolean, // true or false
            default: true // default value is true
        },
        slug: {
            type: String, // metal,plastic,wood
            minLength: [2, "product slug minimum length of slug is 2"],
            required: [true, "product slug is required"],
            lowercase: true,
            trim: true,
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
