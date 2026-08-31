const { createSlug } = require("../config/helper");
const subcategoryModel = require("../Models/subcategoryModel");
const categoryModel = require("../Models/categoryModel");
let subcategoryCreate= async(req,res)=>{
    let {name,parentCategory,order}=req.body
    let obj={
        name,
        parentCategory,
        order,
        slug:createSlug(name)
    }
    try { 
    
    let checkMysubcategory = await subcategoryModel.findOne({ name });

    if (checkMysubcategory) {
      res.send({
        message: "Error in subcategory creation",
        status: 0,
        error: {
          name: "subcategory name already exist...",
        },
      });
    } else {
      
        if(req.file){
            if(req.file.filename){
                obj['image']=req.file.filename
            }
        }

        console.log(obj);
        
    // let a=10
    let subcategoryRes = await subcategoryModel.insertOne(obj);
      res.send({
        message: "subcategory created successfully",
        status: 1,
       subcategoryRes,
      });
    }
  } catch (err) {
    let error = {};
    for (let errorKey in err.errors) {
      error[errorKey] = err.errors[errorKey].message;
    }
    res.send({ message: "Error in subcategory creation", status: 0, error });
  }
}

let subcategoryView= async(req,res)=>{
    let {name,slug,order}=req.query
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

    let filter={}
    if(orCondition.length>=1)
    {
      filter.$or=orCondition
    }

    let data = await subcategoryModel.find(filter).populate("parentCategory",'name')
    let staticPath=process.env.SUBCATEGORYIMAGEPATH
    res.send({ message: "Subcategory View", status: 1,staticPath, data })
}

let subcategoryDelete = async (req, res) => {
  let { id } = req.params;

  let delRes = await subcategoryModel.deleteOne({ _id: id });

  res.send({ message: "Subcategory Delete", status: 1, delRes });
};

let subcategorymultiDelete = async (req, res) => {
  let { ids } = req.body;

  let delRes = await subcategoryModel.deleteMany({ _id: ids });

  res.send({ message: "Subcategory Delete", status: 1, delRes });
};

let changeStatus = async (req, res) => {
  let { ids } = req.body;

  for (let id of ids) {
    let oldSubcategory = await subcategoryModel.findOne({ _id: id });
    await subcategoryModel.updateOne(
      { _id: id },
      { $set: { status: !oldSubcategory.status } }
    );
  }

  res.send({ message: "Subcategory status changed successfully", status: 1 });
};

let subcategoryUpdate = async (req, res) => {
  let { id } = req.params;
  let { name, parentCategory, order, slug } = req.body;
  let obj = {
    name,
    parentCategory,
    order,
    slug: slug || createSlug(name),
  };
  if (req.file?.filename) {
    obj.image = req.file.filename;
  }

  let subcategoryRes = await subcategoryModel.updateOne(
    {
      _id: id,
    },
    {
      $set: obj,
    }
  );
  res.send({ message: "Subcategory Update", status: 1, subcategoryRes });
};

let getSubcategoryDetails = async (req, res) => {
  let { id } = req.params;
  let data = await subcategoryModel
    .findOne({ _id: id })
    .select(["name", "parentCategory", "order"]);
  res.send({ message: "Subcategory view", status: 1, data });
};

let parentcategory= async(req,res)=>{
  categoryModel.find({ status: true }).select("name")
  .then((data)=>{
     res.send({ message: " parent category ", status: 1, data })   
  })
  .catch((err)=>{
     res.send({ message: " Error ", status: 0 })   

  })
}
  
module.exports={
  subcategoryCreate,
  subcategoryView,
  parentcategory,
  subcategoryDelete,
  subcategorymultiDelete,
  changeStatus,
  subcategoryUpdate,
  getSubcategoryDetails,
}

