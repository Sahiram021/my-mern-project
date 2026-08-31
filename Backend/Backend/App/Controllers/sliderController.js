const sliderModel = require("../Models/sliderModel");

let sliderCreate = async (req, res) => {
  let { title, link, order } = req.body;
  let obj = {
    title,
    link,
    order,
  };

  try {
    let checkSlider = await sliderModel.findOne({ title });

    if (checkSlider) {
      res.send({
        message: "Error in slider creation",
        status: 0,
        error: {
          title: "Slider title already exist...",
        },
      });
      return;
    }

    if (req.file?.filename) {
      obj.image = req.file.filename;
    }

    let sliderRes = await sliderModel.insertOne(obj);
    res.send({
      message: "Slider created successfully",
      status: 1,
      sliderRes,
    });
  } catch (err) {
    let error = {};
    for (let errorKey in err.errors) {
      error[errorKey] = err.errors[errorKey].message;
    }
    res.send({ message: "Error in slider creation", status: 0, error });
  }
};

let sliderView = async (req, res) => {
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

  let data = await sliderModel.find(filter);
  let staticPath = process.env.SLIDERIMAGEPATH;
  res.send({ message: "Slider View", status: 1, staticPath, data });
};

let sliderDelete = async (req, res) => {
  let { id } = req.params;
  let delRes = await sliderModel.deleteOne({ _id: id });
  res.send({ message: "Slider Delete", status: 1, delRes });
};

let slidermultiDelete = async (req, res) => {
  let { ids } = req.body;
  let delRes = await sliderModel.deleteMany({ _id: ids });
  res.send({ message: "Slider Delete", status: 1, delRes });
};

let sliderEdit = async (req, res) => {
  let { id } = req.params;
  let data = await sliderModel.findOne({ _id: id });
  let staticPath = process.env.SLIDERIMAGEPATH;
  res.send({ message: "Slider Edit", status: 1, staticPath, data });
};

let sliderUpdate = async (req, res) => {
  let { id } = req.params;
  let { title, link, order } = req.body;
  let obj = {
    title,
    link,
    order,
  };

  if (req.file?.filename) {
    obj.image = req.file.filename;
  }

  let sliderRes = await sliderModel.updateOne({ _id: id }, { $set: obj });
  res.send({ message: "Slider Update", status: 1, sliderRes });
};

let changeStatus = async (req, res) => {
  let { ids } = req.body;

  for (let id of ids) {
    let oldSlider = await sliderModel.findOne({ _id: id });
    await sliderModel.updateOne(
      { _id: id },
      { $set: { status: !oldSlider.status } }
    );
  }

  res.send({ message: "Slider status changed successfully", status: 1 });
};

module.exports = {
  sliderCreate,
  sliderView,
  sliderDelete,
  slidermultiDelete,
  sliderEdit,
  sliderUpdate,
  changeStatus,
};
