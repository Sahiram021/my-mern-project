const colorModel = require("../Models/colorModel");
const { search } = require("../Routes/adminRoutes");



let colorCreate = async (req, res) => {
  let colorObj = req.body;

  try {
    let checkColor = await colorModel.findOne({ name: colorObj.name });

    if (checkColor) {
      res.send({
        message: "Color name already exist",
        status: 0,
        error: "Color name already exist...",
      });
      return;
    } else {
      let colorInsertObj = {
        name: colorObj.name,
        code: colorObj.code,
        status: colorObj.status,
        order: colorObj.order,
      };

      let data = await colorModel.insertOne(colorInsertObj);
      res.send({
        status: true,
        message: "Color added successfully",
        data,
      });
    }
  } catch (err) {
    let errorObj = {};

    for (let errorKey in err.errors) {
      errorObj[errorKey] = err.errors[errorKey].message;
    }

    res.send({
      message: "Error in color creation",
      status: 0,
      error: errorObj,
    });
  }
};


// let {name,code,order}=req.query
// let orCondition=[]

// if(name){
//   orCondition.push({name:new RegExp})
// }

// if(code){
//     orCondition.push({code})

// }

// if(order){
//     orCondition.push({order})

// }
// let filter={}
// if(orCondition.length>=1)
// {
//   filter.$or=orCondition
// }
// console.log(filter);

// let data = await colorModel.find(filter)



let colorView = async (req, res) => {
  
let {name,code,order}=req.query
let orCondition=[]

if(name){
  orCondition.push({name:new RegExp(name , "i")})
}

if(code){
    orCondition.push({code})

}

if(order){
    orCondition.push({order})

}
let filter={}
if(orCondition.length>=1)
{
  filter.$or=orCondition
}
console.log(filter);

let data = await colorModel.find(filter)


  // let data = await colorModel.find();
  res.send({ message: "Color View", status: 1, data });
};

let colorDelete = async(req, res) => {
      let {id}=req.params
      // console.log(id);
      let delRes=await colorModel.deleteOne({_id:id})
  res.send({ message: "Color Delete", status: 1, delRes });
};

let colormultiDelete=async(req,res)=>{
    let {ids}=req.body
    let delRes=await colorModel.deleteMany({_id:ids})
    res.send({ message: "Color Delete", status: 1, delRes });
    
}

let colorEdit = async (req, res) => {
  let { id } = req.params;
  let data = await colorModel.findOne({ _id: id });
  res.send({ message: "Color Edit", status: 1, data });
};

let colorUpdate = async (req, res) => {
  let { id } = req.params;
  let colorObj = req.body;

  let colorUpdateobj = {
    name: colorObj.name,
    code: colorObj.code,
    order: colorObj.order,
    status: colorObj.status,
  };

  let updateRes = await colorModel.updateOne({ _id: id }, { $set: colorUpdateobj });
  res.send({ message: "Color Update", status: 1, updateRes });
};

let changeStatus=async (req, res) =>{
  let { ids }=req.body

  for(let v of ids ){
    console.log(v);
    let getOldStatus=await colorModel.findOne({_id:v})
    await colorModel.updateOne(
    {_id:v},
    {
      $set:{
        status: !getOldStatus.status
      }
    }
  )
    
  }
  res.send({message: "Color Update", status: 1})

}

let getColorDetails= async(req,res)=>{
    let {id} =req.params
    let data = await colorModel.findOne({ _id: id }).select(['name',"code","order"])
  res.send({ message: "Color view", status: 1, data })
}

module.exports = { colorCreate, colorView, colorDelete, colorEdit, colorUpdate, colormultiDelete,changeStatus,getColorDetails };
