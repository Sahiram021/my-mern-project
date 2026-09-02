const {
  escapeRegex,
  exactNameQuery,
  getErrorDetails,
  getUploadStaticPath,
  isValidObjectId,
  normalizeText,
  toIdArray,
  toNumber,
} = require("../config/controllerUtils");
const { removeUploadedFiles } = require("../config/upload");
const sliderModel = require("../Models/sliderModel");

const getStaticPath = (req) =>
  getUploadStaticPath(req, "slider", process.env.SLIDERIMAGEPATH);

const sliderCreate = async (req, res) => {
  const title = normalizeText(req.body.title);
  const link = normalizeText(req.body.link);

  try {
    if (!title) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "Slider title is required" });
    }
    if (!req.file?.filename) {
      return res.status(400).send({ status: 0, message: "Slider image is required" });
    }

    const duplicate = await sliderModel.findOne(exactNameQuery(title));
    if (duplicate) {
      removeUploadedFiles(req);
      return res.status(409).send({ status: 0, message: "Slider title already exists" });
    }

    const data = await sliderModel.create({
      title,
      link,
      order: toNumber(req.body.order, 0),
      image: req.file.filename,
    });
    return res.status(201).send({ status: 1, message: "Slider created successfully", data });
  } catch (error) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Error in slider creation", error: getErrorDetails(error) });
  }
};
const sliderView = async (req, res) => {
  try {
    const filter = {};
    const title = normalizeText(req.query.title);
    if (title) filter.title = new RegExp(escapeRegex(title), "i");
    if (req.query.order !== "" && req.query.order !== undefined) {
      filter.order = toNumber(req.query.order, 0);
    }

    const data = await sliderModel.find(filter).sort({ order: 1, date: -1 });
    return res.send({ message: "Slider view", status: 1, staticPath: getStaticPath(req), data });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to fetch sliders" });
  }
};

const sliderDelete = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ status: 0, message: "Invalid slider id" });
  }
  const delRes = await sliderModel.deleteOne({ _id: id });
  if (!delRes.deletedCount) {
    return res.status(404).send({ status: 0, message: "Slider not found" });
  }
  return res.send({ message: "Slider deleted successfully", status: 1, delRes });
};

const slidermultiDelete = async (req, res) => {
  const ids = toIdArray(req.body.ids);
  if (!ids.length || ids.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ status: 0, message: "Valid slider ids are required" });
  }
  const delRes = await sliderModel.deleteMany({ _id: { $in: ids } });
  return res.send({ message: "Sliders deleted successfully", status: 1, delRes });
};

const sliderEdit = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ status: 0, message: "Invalid slider id" });
  }
  const data = await sliderModel.findById(id);
  if (!data) {
    return res.status(404).send({ status: 0, message: "Slider not found" });
  }
  return res.send({ message: "Slider edit", status: 1, staticPath: getStaticPath(req), data });
};

const sliderUpdate = async (req, res) => {
  const { id } = req.params;
  const title = normalizeText(req.body.title);

  if (!isValidObjectId(id)) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Invalid slider id" });
  }
  if (!title) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Slider title is required" });
  }

  try {
    const duplicate = await sliderModel.findOne({
      _id: { $ne: id },
      ...exactNameQuery(title),
    });
    if (duplicate) {
      removeUploadedFiles(req);
      return res.status(409).send({ status: 0, message: "Slider title already exists" });
    }

    const update = {
      title,
      link: normalizeText(req.body.link),
      order: toNumber(req.body.order, 0),
    };
    if (req.file?.filename) update.image = req.file.filename;

    const data = await sliderModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      removeUploadedFiles(req);
      return res.status(404).send({ status: 0, message: "Slider not found" });
    }
    return res.send({ message: "Slider updated successfully", status: 1, data });
  } catch (error) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Unable to update slider", error: getErrorDetails(error) });
  }
};

const changeStatus = async (req, res) => {
  const ids = toIdArray(req.body.ids);
  if (!ids.length || ids.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ status: 0, message: "Valid slider ids are required" });
  }

  const rows = await sliderModel.find({ _id: { $in: ids } }).select("status");
  await Promise.all(rows.map((row) =>
    sliderModel.updateOne({ _id: row._id }, { $set: { status: !row.status } })
  ));
  return res.send({ message: "Slider status changed successfully", status: 1 });
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
