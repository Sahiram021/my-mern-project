const whyChooseUsModel = require("../Models/whyChooseUsModel");

let whyChooseUsCreate = async (req, res) => {
  let { title, description, order, rating } = req.body;
  let obj = {
    title,
    description,
    order,
    rating,
  };

  try {
    let checkwhyChooseUs = await whyChooseUsModel.findOne({ title });

    if (checkwhyChooseUs) {
      res.send({
        message: "Error in whyChooseUs creation",
        status: 0,
        error: {
          title: "whyChooseUs title already exist...",
        },
      });
      return;
    }

    if (req.file?.filename) {
      obj.image = req.file.filename;
    }

    let whyChooseUsRes = await whyChooseUsModel.insertOne(obj);
    res.send({
      message: "whyChooseUs created successfully",
      status: 1,
      whyChooseUsRes,
    });
  } catch (err) {
    let error = {};
    for (let errorKey in err.errors) {
      error[errorKey] = err.errors[errorKey].message;
    }
    res.send({ message: "Error in whyChooseUs creation", status: 0, error });
  }
};

let whyChooseUsView = async (req, res) => {
  let { title, order } = req.query;
  let orCondition = [];

  if (title) {
    orCondition.push({ title: new RegExp(title, "i") });
  }

  if (order) {
    orCondition.push({ order });
  }

  let filter = {};
  if (orCondition.length >= 1) {
    filter.$or = orCondition;
  }

  let data = await whyChooseUsModel.find(filter);
  let staticPath = process.env.WHYCHOOSEUSIMAGEPATH;
  res.send({ message: "whyChooseUs View", status: 1, staticPath, data });
};

let whyChooseUsDelete = async (req, res) => {
  let { id } = req.params;
  let delRes = await whyChooseUsModel.deleteOne({ _id: id });
  res.send({ message: "whyChooseUs Delete", status: 1, delRes });
};

let whyChooseUsmultiDelete = async (req, res) => {
  let { ids } = req.body;
  let delRes = await whyChooseUsModel.deleteMany({ _id: ids });
  res.send({ message: "whyChooseUs Delete", status: 1, delRes });
};

let whyChooseUsEdit = async (req, res) => {
  let { id } = req.params;
  let data = await whyChooseUsModel.findOne({ _id: id });
  let staticPath = process.env.WHYCHOOSEUSIMAGEPATH;
  res.send({ message: "whyChooseUs Edit", status: 1, staticPath, data });
};

let whyChooseUsUpdate = async (req, res) => {
  let { id } = req.params;
  let { title, description, order, rating } = req.body;
  let obj = {
    title,
    description,
    order,
    rating,
  };

  if (req.file?.filename) {
    obj.image = req.file.filename;
  }

  let whyChooseUsRes = await whyChooseUsModel.updateOne({ _id: id }, { $set: obj });
  res.send({ message: "whyChooseUs Update", status: 1, whyChooseUsRes });
};

let changeStatus = async (req, res) => {
  let { ids } = req.body;

  for (let id of ids) {
    let oldwhyChooseUs = await whyChooseUsModel.findOne({ _id: id });
    await whyChooseUsModel.updateOne(
      { _id: id },
      { $set: { status: !oldwhyChooseUs.status } }
    );
  }

  res.send({ message: "whyChooseUs status changed successfully", status: 1 });
};

module.exports = {
  whyChooseUsCreate,
  whyChooseUsView,
  whyChooseUsDelete,
  whyChooseUsmultiDelete,
  whyChooseUsEdit,
  whyChooseUsUpdate,
  changeStatus,
};
