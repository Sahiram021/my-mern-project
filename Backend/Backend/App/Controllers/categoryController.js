const { createSlug } = require("../config/helper");
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
const categoryModel = require("../Models/categoryModel");
const productModel = require("../Models/productModel");
const subcategoryModel = require("../Models/subcategoryModel");
const subSubcategoryModel = require("../Models/subSubcategoryModel");

const getStaticPath = (req) =>
  getUploadStaticPath(req, "category", process.env.CATEGORYIMAGEPATH);

const categoryCreate = async (req, res) => {
  const name = normalizeText(req.body.name);
  const order = toNumber(req.body.order, 0);
  const slug = normalizeText(req.body.slug) || createSlug(name);

  try {
    if (!name) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "Category name is required", error: { name: "Category name is required" } });
    }
    if (!req.file?.filename) {
      return res.status(400).send({ status: 0, message: "Category image is required", error: { image: "Category image is required" } });
    }

    const duplicate = await categoryModel.findOne({
      $or: [exactNameQuery(name), { slug }],
    });
    if (duplicate) {
      removeUploadedFiles(req);
      return res.status(409).send({
        status: 0,
        message: "Category already exists",
        error: { name: "A category with this name or slug already exists" },
      });
    }

    const data = await categoryModel.create({
      name,
      order,
      slug,
      image: req.file.filename,
    });

    return res.status(201).send({
      status: 1,
      message: "Category created successfully",
      data,
    });
  } catch (error) {
    removeUploadedFiles(req);
    return res.status(400).send({
      status: 0,
      message: "Error in category creation",
      error: getErrorDetails(error),
    });
  }
};

const categoryView = async (req, res) => {
  try {
    const filter = {};
    const name = normalizeText(req.query.name);
    if (name) filter.name = new RegExp(escapeRegex(name), "i");
    if (req.query.order !== "" && req.query.order !== undefined) {
      filter.order = toNumber(req.query.order, 0);
    }

    const data = await categoryModel.find(filter).sort({ order: 1, date: -1 });
    return res.send({
      message: "Category view",
      status: 1,
      staticPath: getStaticPath(req),
      data,
    });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to fetch categories" });
  }
};

const getCategoryUsage = async (ids) => {
  const [subcategoryCount, subSubcategoryCount, productCount] = await Promise.all([
    subcategoryModel.countDocuments({ parentCategory: { $in: ids } }),
    subSubcategoryModel.countDocuments({ parentCategory: { $in: ids } }),
    productModel.countDocuments({ parentCategory: { $in: ids } }),
  ]);
  return { subcategoryCount, subSubcategoryCount, productCount };
};

const categoryDelete = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ status: 0, message: "Invalid category id" });
  }

  try {
    const usage = await getCategoryUsage([id]);
    if (Object.values(usage).some(Boolean)) {
      return res.status(409).send({
        status: 0,
        message: "Category is in use and cannot be deleted",
        error: usage,
      });
    }

    const delRes = await categoryModel.deleteOne({ _id: id });
    if (!delRes.deletedCount) {
      return res.status(404).send({ status: 0, message: "Category not found" });
    }
    return res.send({ message: "Category deleted successfully", status: 1, delRes });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to delete category" });
  }
};

const categorymultiDelete = async (req, res) => {
  const ids = toIdArray(req.body.ids);
  if (!ids.length || ids.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ status: 0, message: "Valid category ids are required" });
  }

  try {
    const usage = await getCategoryUsage(ids);
    if (Object.values(usage).some(Boolean)) {
      return res.status(409).send({
        status: 0,
        message: "One or more categories are in use and cannot be deleted",
        error: usage,
      });
    }

    const delRes = await categoryModel.deleteMany({ _id: { $in: ids } });
    return res.send({ message: "Categories deleted successfully", status: 1, delRes });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to delete categories" });
  }
};

const changeStatus = async (req, res) => {
  const ids = toIdArray(req.body.ids);
  if (!ids.length || ids.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ status: 0, message: "Valid category ids are required" });
  }

  try {
    const categories = await categoryModel.find({ _id: { $in: ids } }).select("status");
    await Promise.all(
      categories.map((category) =>
        categoryModel.updateOne({ _id: category._id }, { $set: { status: !category.status } })
      )
    );
    return res.send({ message: "Category status changed successfully", status: 1 });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to change category status" });
  }
};

const categoryUpdate = async (req, res) => {
  const { id } = req.params;
  const name = normalizeText(req.body.name);
  const slug = normalizeText(req.body.slug) || createSlug(name);

  if (!isValidObjectId(id)) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Invalid category id" });
  }
  if (!name) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Category name is required" });
  }

  try {
    const duplicate = await categoryModel.findOne({
      _id: { $ne: id },
      $or: [exactNameQuery(name), { slug }],
    });
    if (duplicate) {
      removeUploadedFiles(req);
      return res.status(409).send({ status: 0, message: "Category name or slug already exists" });
    }

    const update = {
      name,
      slug,
      order: toNumber(req.body.order, 0),
    };
    if (req.file?.filename) update.image = req.file.filename;

    const data = await categoryModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      removeUploadedFiles(req);
      return res.status(404).send({ status: 0, message: "Category not found" });
    }
    return res.send({ message: "Category updated successfully", status: 1, data });
  } catch (error) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Unable to update category", error: getErrorDetails(error) });
  }
};

const getCategoryDetails = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ status: 0, message: "Invalid category id" });
  }

  const data = await categoryModel.findById(id).select("name slug image order");
  if (!data) {
    return res.status(404).send({ status: 0, message: "Category not found" });
  }
  return res.send({
    message: "Category view",
    status: 1,
    staticPath: getStaticPath(req),
    data,
  });
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
