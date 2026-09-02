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
  getUploadStaticPath(req, "subcategory", process.env.SUBCATEGORYIMAGEPATH);

const validateParent = async (parentCategory) => {
  if (!isValidObjectId(parentCategory)) return null;
  return categoryModel.findById(parentCategory).select("_id");
};

const subcategoryCreate = async (req, res) => {
  const name = normalizeText(req.body.name);
  const parentCategory = normalizeText(req.body.parentCategory);
  const slug = normalizeText(req.body.slug) || createSlug(name);

  try {
    if (!name) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "Subcategory name is required" });
    }
    if (!(await validateParent(parentCategory))) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "A valid parent category is required" });
    }
    if (!req.file?.filename) {
      return res.status(400).send({ status: 0, message: "Subcategory image is required" });
    }

    const duplicate = await subcategoryModel.findOne({
      $or: [
        { ...exactNameQuery(name), parentCategory },
        { slug },
      ],
    });
    if (duplicate) {
      removeUploadedFiles(req);
      return res.status(409).send({ status: 0, message: "Subcategory name or slug already exists" });
    }

    const data = await subcategoryModel.create({
      name,
      parentCategory,
      slug,
      order: toNumber(req.body.order, 0),
      image: req.file.filename,
    });
    return res.status(201).send({ status: 1, message: "Subcategory created successfully", data });
  } catch (error) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Error in subcategory creation", error: getErrorDetails(error) });
  }
};

const subcategoryView = async (req, res) => {
  try {
    const filter = {};
    const name = normalizeText(req.query.name);
    const slug = normalizeText(req.query.slug);
    if (name) filter.name = new RegExp(escapeRegex(name), "i");
    if (slug) filter.slug = new RegExp(escapeRegex(slug), "i");
    if (req.query.order !== "" && req.query.order !== undefined) {
      filter.order = toNumber(req.query.order, 0);
    }

    const data = await subcategoryModel
      .find(filter)
      .populate("parentCategory", "name")
      .sort({ order: 1, date: -1 });

    return res.send({ message: "Subcategory view", status: 1, staticPath: getStaticPath(req), data });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to fetch subcategories" });
  }
};

const getUsage = async (ids) => {
  const [subSubcategoryCount, productCount] = await Promise.all([
    subSubcategoryModel.countDocuments({ subcategory: { $in: ids } }),
    productModel.countDocuments({ subcategory: { $in: ids } }),
  ]);
  return { subSubcategoryCount, productCount };
};

const subcategoryDelete = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ status: 0, message: "Invalid subcategory id" });
  }

  try {
    const usage = await getUsage([id]);
    if (Object.values(usage).some(Boolean)) {
      return res.status(409).send({ status: 0, message: "Subcategory is in use and cannot be deleted", error: usage });
    }
    const delRes = await subcategoryModel.deleteOne({ _id: id });
    if (!delRes.deletedCount) {
      return res.status(404).send({ status: 0, message: "Subcategory not found" });
    }
    return res.send({ message: "Subcategory deleted successfully", status: 1, delRes });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to delete subcategory" });
  }
};

const subcategorymultiDelete = async (req, res) => {
  const ids = toIdArray(req.body.ids);
  if (!ids.length || ids.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ status: 0, message: "Valid subcategory ids are required" });
  }

  try {
    const usage = await getUsage(ids);
    if (Object.values(usage).some(Boolean)) {
      return res.status(409).send({ status: 0, message: "One or more subcategories are in use and cannot be deleted", error: usage });
    }
    const delRes = await subcategoryModel.deleteMany({ _id: { $in: ids } });
    return res.send({ message: "Subcategories deleted successfully", status: 1, delRes });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to delete subcategories" });
  }
};

const changeStatus = async (req, res) => {
  const ids = toIdArray(req.body.ids);
  if (!ids.length || ids.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ status: 0, message: "Valid subcategory ids are required" });
  }

  try {
    const rows = await subcategoryModel.find({ _id: { $in: ids } }).select("status");
    await Promise.all(rows.map((row) =>
      subcategoryModel.updateOne({ _id: row._id }, { $set: { status: !row.status } })
    ));
    return res.send({ message: "Subcategory status changed successfully", status: 1 });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to change subcategory status" });
  }
};

const subcategoryUpdate = async (req, res) => {
  const { id } = req.params;
  const name = normalizeText(req.body.name);
  const parentCategory = normalizeText(req.body.parentCategory);
  const slug = normalizeText(req.body.slug) || createSlug(name);

  if (!isValidObjectId(id)) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Invalid subcategory id" });
  }

  try {
    if (!name || !(await validateParent(parentCategory))) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "Name and a valid parent category are required" });
    }

    const duplicate = await subcategoryModel.findOne({
      _id: { $ne: id },
      $or: [
        { ...exactNameQuery(name), parentCategory },
        { slug },
      ],
    });
    if (duplicate) {
      removeUploadedFiles(req);
      return res.status(409).send({ status: 0, message: "Subcategory name or slug already exists" });
    }

    const update = {
      name,
      parentCategory,
      slug,
      order: toNumber(req.body.order, 0),
    };
    if (req.file?.filename) update.image = req.file.filename;

    const data = await subcategoryModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      removeUploadedFiles(req);
      return res.status(404).send({ status: 0, message: "Subcategory not found" });
    }
    return res.send({ message: "Subcategory updated successfully", status: 1, data });
  } catch (error) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Unable to update subcategory", error: getErrorDetails(error) });
  }
};

const getSubcategoryDetails = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ status: 0, message: "Invalid subcategory id" });
  }

  const data = await subcategoryModel
    .findById(id)
    .select("name parentCategory slug image order");
  if (!data) {
    return res.status(404).send({ status: 0, message: "Subcategory not found" });
  }
  return res.send({ message: "Subcategory view", status: 1, staticPath: getStaticPath(req), data });
};

const parentcategory = async (_req, res) => {
  try {
    const data = await categoryModel.find({ status: true }).select("name").sort({ order: 1, name: 1 });
    return res.send({ message: "Parent categories", status: 1, data });
  } catch (_error) {
    return res.status(500).send({ message: "Unable to fetch parent categories", status: 0 });
  }
};

module.exports = {
  subcategoryCreate,
  subcategoryView,
  parentcategory,
  subcategoryDelete,
  subcategorymultiDelete,
  changeStatus,
  subcategoryUpdate,
  getSubcategoryDetails,
};
