const { createSlug } = require("../config/helper");
const categoryModel = require("../Models/categoryModel");
let categoryCreate = async (req, res) => {
  let { name, order, slug } = req.body;
  try {
    let obj = {
      name,
      order,
      slug: slug || createSlug(name),
    };
    let checkMycategory = await categoryModel.findOne({ name });

    if (checkMycategory) {
      res.send({
        message: "Error in category creation",
        status: 0,
        error: {
          name: "category name already exist...",
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
    let categoryRes = await categoryModel.insertOne(obj);
      res.send({
        message: "category created successfully",
        status: 1,
       categoryRes,
      });
    }
  } catch (err) {
    let error = {};
    for (let errorKey in err.errors) {
      error[errorKey] = err.errors[errorKey].message;
    }
    res.send({ message: "Error in category creation", status: 0, error });
  }
};

let categoryView = async (req, res) => {
     let {name,order}=req.query
     let orCondition=[]

     if(name){
       orCondition.push({name:new RegExp(name , "i")})
     }

     if(order){
       orCondition.push({order})
     }

     let filter={}
     if(orCondition.length>=1)
     {
       filter.$or=orCondition
     }

     let data = await categoryModel.find(filter);
    
    let staticPath=process.env.CATEGORYIMAGEPATH

    res.send({ message: "category View", status: 1,staticPath, data });

};

let categoryDelete =async (req, res) => {
    let {id}=req.params

  let delRes=await categoryModel.deleteOne({_id:id})
  

  res.send({ message: "category Delete", status: 1 ,delRes});
};

let categorymultiDelete =async (req, res) => {
     let {ids}=req.body //Array ["6a38dfdadaf7faa9e96213e4","6a38dfdfdaf7faa9e96213e5"]

  let delRes=await categoryModel.deleteMany({_id:ids})

 res.send({ message: "category Delete", status: 1 ,delRes});
};

let changeStatus = async (req, res) => {
  let { ids } = req.body;

  for (let id of ids) {
    let oldCategory = await categoryModel.findOne({ _id: id });
    await categoryModel.updateOne(
      { _id: id },
      { $set: { status: !oldCategory.status } }
    );
  }

  res.send({ message: "Category status changed successfully", status: 1 });
};

let categoryUpdate = async (req, res) => {
  let { id } = req.params;
  let { name, order, slug } = req.body;
  let obj = {
    name,
    order,
    slug: slug || createSlug(name),
  };
  if (req.file?.filename) {
    obj.image = req.file.filename;
  }

  let categoryRes = await categoryModel.updateOne(
    { _id: id },
    { $set: obj }
  );
  res.send({ message: "category updated successfully", status: 1, categoryRes });
};

let getCategoryDetails = async (req, res) => {
  let { id } = req.params;
  let data = await categoryModel
    .findOne({ _id: id })
    .select(["name", "order"]);
  res.send({ message: "Category view", status: 1, data });
};

module.exports = {
  categoryCreate,
  categoryView,
  categoryDelete,
  categorymultiDelete,
  changeStatus,
  categoryUpdate,
  getCategoryDetails,
};

