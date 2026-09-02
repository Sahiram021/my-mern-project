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
  getUploadStaticPath(req, "subsubcategory", process.env.SUBSUBCATEGORYIMAGEPATH);

const validateHierarchy = async (parentCategory, subcategory) => {
  if (!isValidObjectId(parentCategory) || !isValidObjectId(subcategory)) {
    return false;
  }
  const child = await subcategoryModel.findOne({
    _id: subcategory,
    parentCategory,
  }).select("_id");
  return Boolean(child);
};

const subsubcategoryCreate = async (req, res) => {
  const name = normalizeText(req.body.name);
  const parentCategory = normalizeText(req.body.parentCategory);
  const subcategory = normalizeText(req.body.subCategory || req.body.subcategory);
  const slug = normalizeText(req.body.slug) || createSlug(name);

  try {
    if (!name) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "Sub-subcategory name is required" });
    }
    if (!(await validateHierarchy(parentCategory, subcategory))) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "The selected category hierarchy is invalid" });
    }
    if (!req.file?.filename) {
      return res.status(400).send({ status: 0, message: "Sub-subcategory image is required" });
    }

    const duplicate = await subSubcategoryModel.findOne({
      $or: [
        { ...exactNameQuery(name), subcategory },
        { slug },
      ],
    });
    if (duplicate) {
      removeUploadedFiles(req);
      return res.status(409).send({ status: 0, message: "Sub-subcategory name or slug already exists" });
    }

    const data = await subSubcategoryModel.create({
      name,
      parentCategory,
      subcategory,
      slug,
      order: toNumber(req.body.order, 0),
      image: req.file.filename,
    });
    return res.status(201).send({ status: 1, message: "Sub-subcategory created successfully", data });
  } catch (error) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Error in sub-subcategory creation", error: getErrorDetails(error) });
  }
};

const subsubcategoryView = async (req, res) => {
  try {
    const filter = {};
    const name = normalizeText(req.query.name);
    const slug = normalizeText(req.query.slug);
    if (name) filter.name = new RegExp(escapeRegex(name), "i");
    if (slug) filter.slug = new RegExp(escapeRegex(slug), "i");
    if (req.query.order !== "" && req.query.order !== undefined) {
      filter.order = toNumber(req.query.order, 0);
    }

    const data = await subSubcategoryModel
      .find(filter)
      .populate("parentCategory", "name")
      .populate("subcategory", "name")
      .sort({ order: 1, date: -1 });

    return res.send({ message: "Sub-subcategory view", status: 1, staticPath: getStaticPath(req), data });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to fetch sub-subcategories" });
  }
};

const subsubcategoryDelete = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ status: 0, message: "Invalid sub-subcategory id" });
  }

  try {
    const productCount = await productModel.countDocuments({ subsubcategory: id });
    if (productCount) {
      return res.status(409).send({ status: 0, message: "Sub-subcategory is in use and cannot be deleted", error: { productCount } });
    }
    const delRes = await subSubcategoryModel.deleteOne({ _id: id });
    if (!delRes.deletedCount) {
      return res.status(404).send({ status: 0, message: "Sub-subcategory not found" });
    }
    return res.send({ message: "Sub-subcategory deleted successfully", status: 1, delRes });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to delete sub-subcategory" });
  }
};

const subsubcategorymultiDelete = async (req, res) => {
  const ids = toIdArray(req.body.ids);
  if (!ids.length || ids.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ status: 0, message: "Valid sub-subcategory ids are required" });
  }

  try {
    const productCount = await productModel.countDocuments({ subsubcategory: { $in: ids } });
    if (productCount) {
      return res.status(409).send({ status: 0, message: "One or more sub-subcategories are in use and cannot be deleted", error: { productCount } });
    }
    const delRes = await subSubcategoryModel.deleteMany({ _id: { $in: ids } });
    return res.send({ message: "Sub-subcategories deleted successfully", status: 1, delRes });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to delete sub-subcategories" });
  }
};

const changeStatus = async (req, res) => {
  const ids = toIdArray(req.body.ids);
  if (!ids.length || ids.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ status: 0, message: "Valid sub-subcategory ids are required" });
  }

  try {
    const rows = await subSubcategoryModel.find({ _id: { $in: ids } }).select("status");
    await Promise.all(rows.map((row) =>
      subSubcategoryModel.updateOne({ _id: row._id }, { $set: { status: !row.status } })
    ));
    return res.send({ message: "Sub-subcategory status changed successfully", status: 1 });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to change sub-subcategory status" });
  }
};

const subsubcategoryUpdate = async (req, res) => {
  const { id } = req.params;
  const name = normalizeText(req.body.name);
  const parentCategory = normalizeText(req.body.parentCategory);
  const subcategory = normalizeText(req.body.subCategory || req.body.subcategory);
  const slug = normalizeText(req.body.slug) || createSlug(name);

  if (!isValidObjectId(id)) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Invalid sub-subcategory id" });
  }

  try {
    if (!name || !(await validateHierarchy(parentCategory, subcategory))) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "Name and a valid category hierarchy are required" });
    }

    const duplicate = await subSubcategoryModel.findOne({
      _id: { $ne: id },
      $or: [
        { ...exactNameQuery(name), subcategory },
        { slug },
      ],
    });
    if (duplicate) {
      removeUploadedFiles(req);
      return res.status(409).send({ status: 0, message: "Sub-subcategory name or slug already exists" });
    }

    const update = {
      name,
      parentCategory,
      subcategory,
      slug,
      order: toNumber(req.body.order, 0),
    };
    if (req.file?.filename) update.image = req.file.filename;

    const data = await subSubcategoryModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      removeUploadedFiles(req);
      return res.status(404).send({ status: 0, message: "Sub-subcategory not found" });
    }
    return res.send({ message: "Sub-subcategory updated successfully", status: 1, data });
  } catch (error) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Unable to update sub-subcategory", error: getErrorDetails(error) });
  }
};

const getsubSubcategoryDetails = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ status: 0, message: "Invalid sub-subcategory id" });
  }

  const data = await subSubcategoryModel
    .findById(id)
    .select("name parentCategory subcategory slug image order");
  if (!data) {
    return res.status(404).send({ status: 0, message: "Sub-subcategory not found" });
  }
  return res.send({ message: "Sub-subcategory view", status: 1, staticPath: getStaticPath(req), data });
};

const parentcategory = async (_req, res) => {
  try {
    const data = await categoryModel.find({ status: true }).select("name").sort({ order: 1, name: 1 });
    return res.send({ message: "Parent categories", status: 1, data });
  } catch (_error) {
    return res.status(500).send({ message: "Unable to fetch parent categories", status: 0 });
  }
};

const subCategory = async (req, res) => {
  const { parentid } = req.params;
  if (!isValidObjectId(parentid)) {
    return res.status(400).send({ status: 0, message: "Invalid parent category id", data: [] });
  }

  try {
    const data = await subcategoryModel
      .find({ parentCategory: parentid, status: true })
      .select("name")
      .sort({ order: 1, name: 1 });
    return res.send({ message: "Subcategories found", status: 1, data });
  } catch (_error) {
    return res.status(500).send({ message: "Unable to fetch subcategories", status: 0, data: [] });
  }
};

module.exports = {
  parentcategory,
  subCategory,
  subsubcategoryCreate,
  subsubcategoryView,
  subsubcategoryDelete,
  subsubcategorymultiDelete,
  changeStatus,
  subsubcategoryUpdate,
  getsubSubcategoryDetails,
};
