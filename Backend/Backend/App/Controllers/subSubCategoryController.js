
const { createSlug } = require("../config/helper");
const subcategoryModel = require("../Models/subcategoryModel");
const categoryModel = require("../Models/categoryModel");
const subSubcategoryModel = require("../Models/subSubcategoryModel");
let subsubcategoryCreate = async (req, res) => {
    let { name, parentCategory, subCategory, order } = req.body
    let obj = {
        name,
        parentCategory,
        subcategory: subCategory,
        order,
        slug: createSlug(name)
    }
    try {

        let checkMysubsubcategory = await subSubcategoryModel.findOne({ name });

        if (checkMysubsubcategory) {
            res.send({
                message: "Error in subcategory creation",
                status: 0,
                error: {
                    name: "subcategory name already exist...",
                },
            });
        } else {

            if (req.file) {
                if (req.file.filename) {
                    obj['image'] = req.file.filename
                }
            }

            console.log(obj);

            // let a=10
            let subsubcategoryRes = await subSubcategoryModel.insertOne(obj);
            res.send({
                message: "subsubcategory created successfully",
                status: 1,
                subsubcategoryRes,
            });
        }
    } catch (err) {
        let error = {};
        for (let errorKey in err.errors) {
            error[errorKey] = err.errors[errorKey].message;
        }
        res.send({ message: "Error in subsubcategory creation", status: 0, error });
    }
}

let subsubcategoryView = async (req, res) => {
    let { name, slug, order } = req.query
    let orCondition = []

    if (name) {
        orCondition.push({ name: new RegExp(name, "i") })
    }

    if (slug) {
        orCondition.push({ slug: new RegExp(slug, "i") })
    }

    if (order) {
        orCondition.push({ order })
    }

    let filter = {}
    if (orCondition.length >= 1) {
        filter.$or = orCondition
    }

    let data = await subSubcategoryModel.find(filter).populate("parentCategory", 'name').populate("subcategory", 'name')
    let staticPath = process.env.SUBSUBCATEGORYIMAGEPATH
    res.send({ message: "Subsubcategory View", status: 1, staticPath, data })
}

let subsubcategoryDelete = async (req, res) => {
    let { id } = req.params;

    let delRes = await subSubcategoryModel.deleteOne({ _id: id });

    res.send({ message: "Subsubcategory Delete", status: 1, delRes });
};

let subsubcategorymultiDelete = async (req, res) => {
    let { ids } = req.body;

    let delRes = await subSubcategoryModel.deleteMany({ _id: ids });

    res.send({ message: "Subsubcategory Delete", status: 1, delRes });
};

let changeStatus = async (req, res) => {
    let { ids } = req.body;

    for (let id of ids) {
        let oldSubcategory = await subSubcategoryModel.findOne({ _id: id });
        await subSubcategoryModel.updateOne(
            { _id: id },
            { $set: { status: !oldSubcategory.status } }
        );
    }

    res.send({ message: "Subsubcategory status changed successfully", status: 1 });
};

let subsubcategoryUpdate = async (req, res) => {
    let { id } = req.params;
    let { name, parentCategory, subCategory, slug, order } = req.body;
    let obj = {
        name,
        parentCategory,
        subcategory: subCategory,
        order,
        slug: slug || createSlug(name),
    };
    if (req.file) {
        if (req.file.filename) {
            obj['image'] = req.file.filename
        }
    }

    let subsubcategoryRes = await subSubcategoryModel.updateOne(
        {
            _id: id,
        },
        {
            $set: obj,
        }
    );
    res.send({ message: "Subsubcategory Update", status: 1, subsubcategoryRes });
};

let getsubSubcategoryDetails = async (req, res) => {
    let { id } = req.params;
    let data = await subSubcategoryModel
        .findOne({ _id: id })
        .select(["name", "parentCategory", "subcategory", "slug", "order"]);
    res.send({ message: "Subsubcategory view", status: 1, data });
};

let parentcategory =  (req, res) => {
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

module.exports = {

    parentcategory,
    subCategory,
    subsubcategoryCreate,
    subsubcategoryView,
    subsubcategoryDelete,
    subsubcategorymultiDelete,
    changeStatus,
    subsubcategoryUpdate,
    getsubSubcategoryDetails,

}

