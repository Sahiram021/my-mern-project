const categoryModel = require("../Models/categoryModel")
const colorModel = require("../Models/colorModel")
const materialModel = require("../Models/MaterialModel")
const subcategoryModel = require("../Models/subcategoryModel")
const subSubcategoryModel = require("../Models/subSubcategoryModel")
const productModel = require("../Models/productModel")
const { createSlug } = require("../config/helper")

let mapProductType = (t) => {
    if (t === '1' || t === 1) return 'Featured';
    if (t === '2' || t === 2) return 'New';
    if (t === '3' || t === 3) return 'On Sale';
    if (['Featured', 'Bestseller', 'On Sale', 'New'].includes(t)) return t;
    return 'New';
};

let getProductObj = (body) => {
    let {
        name,
        parentCategory,
        subcategory,
        subsubcategory,
        productType,
        price,
        sortDescription,
        longDescription,
        order
    } = body

    let color = body.color || body["color[]"]
    let material = body.material || body["material[]"]

    return {
        name,
        parentCategory,
        subcategory,
        subsubcategory,
        productType: mapProductType(productType),
        price,
        color,
        material,
        sortDescription,
        longDescription,
        order,
        slug: createSlug(name)
    }
}

let productCreate = async(req, res) => {
    console.log(req.body);
    let { name } = req.body
    let obj = getProductObj(req.body)

    console.log(req.files?.gallery);

    try {

        let checkProduct = await productModel.findOne({ name });

        if (checkProduct) {
            res.send({
                message: "Error in product creation",
                status: 0,
                error: {
                    name: "product name already exist...",
                },
            });
        } else {
            if (req.files?.image) {
                obj['image'] = req.files.image[0].filename
            }
            if (req.files?.gallery) {
                obj['gallery'] = req.files.gallery.map((obj) => obj.filename)
            }

            // if (req.file) {
            //     if (req.file.filename) {
            //         obj['image'] = req.file.filename
            //     }
            // }

            console.log(obj);

            // let a=10
            let productRes = await productModel.insertOne(obj);
            res.send({
                message: "product created successfully",
                status: 1,
                productRes,
            });
        }
    } catch (err) {
        let error = {};
        for (let errorKey in err.errors) {
            error[errorKey] = err.errors[errorKey].message;
        }
        res.send({ message: "Error in product creation", status: 0, error });
    }

}

let productUpdate = async(req, res) => {
    let { id } = req.params
    let obj = getProductObj(req.body)

    if (req.files?.image) {
        obj['image'] = req.files.image[0].filename
    }
    if (req.files?.gallery) {
        obj['gallery'] = req.files.gallery.map((obj) => obj.filename)
    }

    let productRes = await productModel.updateOne(
        { _id: id },
        { $set: obj }
    )

    res.send({ message: "product Update", status: 1, productRes })
}

let parentcategory = (req, res) => {
    categoryModel.find({ status: true }).select("name")
        .then((data) => {
            res.send({ message: " parent category ", status: 1, data })
        })
        .catch((err) => {
            res.send({ message: " Error ", status: 0 })

        })
}

let subCategory = (req, res) => {
    let { parentid } = req.params
    subcategoryModel.find({ parentCategory: parentid }).select("name")
        .then((data) => {
            res.send({ message: " sub category found", status: 1, data })
        })
        .catch((err) => {
            res.send({ message: " Error ", status: 0 })

        })
}

let subSubCategory = (req, res) => {
    let { subcatid } = req.params
    subSubcategoryModel.find({ subcategory: subcatid }).select("name")
        .then((data) => {
            res.send({ message: " sub Sub category found", status: 1, data })
        })
        .catch((err) => {
            res.send({ message: " Error ", status: 0 })

        })
}

let getcolors = (req, res) => {
    colorModel.find({}).select("name")
        .then((data) => {
            res.send({ message: " color found ", status: 1, data })
        })
        .catch((err) => {
            res.send({ message: " Error ", status: 0 })

        })

}

let getMaterials = (req, res) => {
    materialModel.find({}).select("name")
        .then((data) => {
            res.send({ message: "Materials found ", status: 1, data })
        })
        .catch((err) => {
            res.send({ message: " Error ", status: 0 })

        })

}

let productDelete = async(req, res) => {
    let { id } = req.params
    let delRes = await productModel.deleteOne({ _id: id })
    res.send({ message: "product Delete", status: 1, delRes })
}

let productmultiDelete = async(req, res) => {
    let { ids } = req.body
    let delRes = await productModel.deleteMany({ _id: ids })
    res.send({ message: "product Delete", status: 1, delRes })
}

let changeStatus = async(req, res) => {
    let { ids } = req.body

    for (let id of ids) {
        let oldProduct = await productModel.findOne({ _id: id })
        await productModel.updateOne(
            { _id: id },
            { $set: { status: !oldProduct.status } }
        )
    }

    res.send({ message: "product status changed successfully", status: 1 })
}

let viewProduct=async(req,res)=>{
     let {name,slug,order,price}=req.query
     let orCondition=[]

     if(name){
       orCondition.push({name:new RegExp(name , "i")})
     }

     if(slug){
       orCondition.push({slug:new RegExp(slug , "i")})
     }

     if(order){
       orCondition.push({order})
     }

     if(price){
       orCondition.push({price})
     }

     let filter={}
     if(orCondition.length>=1)
     {
       filter.$or=orCondition
     }

     let data = await productModel
     .find(filter)
     .populate("parentCategory", 'name')
     .populate("subcategory", 'name')
     .populate("subsubcategory", 'name')
     .populate("color",'name')
     .populate("material",'name')
     let staticPath = process.env.PRODUCTIMAGEPATH
     res.send({ message: "product View", status: 1, staticPath, data })

}

let getProductDetails =async(req,res)=>{
    let {id} =req.params
    let data = await productModel
     .findOne({_id:id})
     .populate("parentCategory", 'name')
     .populate("subcategory", 'name')
     .populate("subsubcategory", 'name')
     .populate("color",'name')
     .populate("material",'name')
     let staticPath = process.env.PRODUCTIMAGEPATH
     res.send({ message: "product View", status: 1, staticPath, data })
    
}

module.exports = {getProductDetails,viewProduct, productCreate, productUpdate, productDelete, productmultiDelete, changeStatus, parentcategory, subCategory, subSubCategory, getcolors, getMaterials }
