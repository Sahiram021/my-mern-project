const materialModel = require("../Models/MaterialModel");

let materialCreate = async (req, res) => {
  let materialObj = req.body;

  try {
    let checkMaterial = await materialModel.findOne({
      name: materialObj.name,
    });

    if (checkMaterial) {
      res.send({
        message: "Material name already exist",
        status: 0,
        error: "Material name already exist...",
      });
      return;
    } else {
      let materialInsertObj = {
        name: materialObj.name,
        status: materialObj.status,
        order: materialObj.order,
      };

      let data = await materialModel.insertOne(materialInsertObj);
      res.send({ message: "Material successfully created", status: 1, data });
    }
  } catch (err) {
    let errorObj = {};

    for (let errorKey in err.errors) {
      errorObj[errorKey] = err.errors[errorKey].message;
    }

    res.send({
      message: "Error in material creation",
      status: 0,
      error: errorObj,
    });
  }
};

let materialView = async (req, res) => {
  let { name, order } = req.query;
  let orCondition = [];

  if (name) {
    orCondition.push({ name: new RegExp(name, "i") });
  }

  if (order) {
    orCondition.push({ order });
  }

  let filter = {};
  if (orCondition.length >= 1) {
    filter.$or = orCondition;
  }

  let data = await materialModel.find(filter);
  res.send({ message: "Material View", status: 1, data });
};

let materialDelete = async (req, res) => {
  let { id } = req.params;
  console.log(id);

  let delRes = await materialModel.deleteOne({ _id: id });

  res.send({ message: "Material Delete", status: 1, delRes });
};

let materialEdit = async (req, res) => {
  let { id } = req.params;
  let data = await materialModel.findOne({ _id: id });
  res.send({ message: "Material Edit", status: 1, data });
};

let materialUpdate = async (req, res) => {
  let { id } = req.params;
  let materialObj = req.body;

  let materialUpdateobj = {
    name: materialObj.name,
    order: materialObj.order,
    status: materialObj.status,
  };

  let updateRes = await materialModel.updateOne(
    { _id: id },
    { $set: materialUpdateobj }
  );
  res.send({ message: "Material Update", status: 1, updateRes });
};

let materialmultiDelete = async (req, res) => {
  let { ids } = req.body;
  let delRes = await materialModel.deleteMany({ _id: ids });
  res.send({ message: "Material Delete", status: 1, delRes });
};

let changeStatus = async (req, res) => {
  let { ids } = req.body;

  for (let v of ids) {
    console.log(v);
    let getOldStatus = await materialModel.findOne({ _id: v });
    await materialModel.updateOne(
      { _id: v },
      {
        $set: {
          status: !getOldStatus.status,
        },
      }
    );
  }
  res.send({ message: "Material Update", status: 1 });
};

let getMaterialDetails = async (req, res) => {
  let { id } = req.params;
  let data = await materialModel
    .findOne({ _id: id })
    .select(["name", "order"]);
  res.send({ message: "Material view", status: 1, data });
};

module.exports = {
  materialCreate,
  materialView,
  materialDelete,
  materialEdit,
  materialUpdate,
  materialmultiDelete,
  changeStatus,
  getMaterialDetails,
};
