const countryModel = require("../Models/countryModel");

let countryCreate = async (req, res) => {
  let countryObj = req.body;

  try {
    let checkCountry = await countryModel.findOne({ name: countryObj.name });

    if (checkCountry) {
      res.send({
        message: "Country name already exist",
        status: 0,
        error: "Country name already exist...",
      });
      return;
    } else {
      let countryInsertObj = {
        name: countryObj.name,
        status: countryObj.status,
        order: countryObj.order,
      };

      let data = await countryModel.insertOne(countryInsertObj);
      res.send({ message: "Country successfully created", status: 1, data });
    }
  } catch (err) {
    let errorObj = {};

    for (let errorKey in err.errors) {
      errorObj[errorKey] = err.errors[errorKey].message;
    }

    res.send({
      message: "Error in country creation",
      status: 0,
      error: errorObj,
    });
  }
};

let countryView = async (req, res) => {
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

  let data = await countryModel.find(filter);
  res.send({ message: "country View", status: 1, data });
};

let countryDelete = async (req, res) => {
  let { id } = req.params;
  console.log(id);

  let delRes = await countryModel.deleteOne({ _id: id });

  res.send({ message: "country Delete", status: 1, delRes });
};

let countryEdit = async (req, res) => {
  let { id } = req.params;
  let data = await countryModel.findOne({ _id: id });
  res.send({ message: "country Edit", status: 1, data });
};

let countryUpdate = async (req, res) => {
  let { id } = req.params;
  let countryObj = req.body;

  let countryUpdateobj = {
    name: countryObj.name,
    order: countryObj.order,
    status: countryObj.status,
  };

  let updateRes = await countryModel.updateOne(
    { _id: id },
    { $set: countryUpdateobj }
  );
  res.send({ message: "country Update", status: 1, updateRes });
};

let countrymultiDelete = async (req, res) => {
  let { ids } = req.body;
  let delRes = await countryModel.deleteMany({ _id: ids });
  res.send({ message: "country Delete", status: 1, delRes });
};

let changeStatus = async (req, res) => {
  let { ids } = req.body;

  for (let id of ids) {
    let oldCountry = await countryModel.findOne({ _id: id });
    await countryModel.updateOne(
      { _id: id },
      { $set: { status: !oldCountry.status } }
    );
  }

  res.send({ message: "Country status changed successfully", status: 1 });
};

let getCountryDetails = async (req, res) => {
  let { id } = req.params;
  let data = await countryModel
    .findOne({ _id: id })
    .select(["name", "order"]);
  res.send({ message: "Country view", status: 1, data });
};

module.exports = {
  countryCreate,
  countryView,
  countryDelete,
  countryEdit,
  countryUpdate,
  countrymultiDelete,
  changeStatus,
  getCountryDetails,
};
