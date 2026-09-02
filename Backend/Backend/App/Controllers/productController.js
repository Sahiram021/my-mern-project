const { createSlug } = require("../config/helper");
const {
  escapeRegex,
  exactNameQuery,
  getErrorDetails,
  getUploadStaticPath,
  isValidObjectId,
  normalizeId,
  normalizeText,
  toIdArray,
  toNumber,
} = require("../config/controllerUtils");
const { removeUploadedFiles } = require("../config/upload");
const categoryModel = require("../Models/categoryModel");
const colorModel = require("../Models/colorModel");
const materialModel = require("../Models/MaterialModel");
const productModel = require("../Models/productModel");
const subcategoryModel = require("../Models/subcategoryModel");
const subSubcategoryModel = require("../Models/subSubcategoryModel");

const productTypes = ["Featured", "Bestseller", "On Sale", "New"];

const getStaticPath = (req) =>
  getUploadStaticPath(req, "product", process.env.PRODUCTIMAGEPATH);

const mapProductType = (value) => {
  const map = { "1": "Featured", "2": "New", "3": "On Sale", "4": "Bestseller" };
  const normalized = normalizeText(value);
  return map[normalized] || (productTypes.includes(normalized) ? normalized : "New");
};
const normalizeReferences = (value) =>
  [...new Set(toIdArray(value))];

const getProductPayload = (body) => {
  const name = normalizeText(body.name);
  const parentCategory = normalizeId(body.parentCategory);
  const subcategory = normalizeId(body.subcategory);
  const subsubcategory = normalizeId(body.subsubcategory);
  const color = normalizeReferences(body.color || body["color[]"]);
  const material = normalizeReferences(body.material || body["material[]"]);
  const rawPrice = normalizeText(body.price);
  const price = rawPrice === "" ? null : Number(rawPrice);

  return {
    name,
    parentCategory,
    subcategory,
    ...(subsubcategory ? { subsubcategory } : {}),
    productType: mapProductType(body.productType),
    price,
    salePrice: toNumber(body.salePrice, 0),
    color,
    material,
    sortDescription: normalizeText(body.sortDescription),
    longDescription: normalizeText(body.longDescription),
    order: toNumber(body.order, 0),
    slug: normalizeText(body.slug) || createSlug(name),
  };
};

const validateReferences = async (payload) => {
  if (!isValidObjectId(payload.parentCategory)) {
    return "A valid parent category is required";
  }
  if (!isValidObjectId(payload.subcategory)) {
    return "A valid subcategory is required";
  }
  if (payload.subsubcategory && !isValidObjectId(payload.subsubcategory)) {
    return "The selected sub-subcategory is invalid";
  }
  if ([...payload.color, ...payload.material].some((id) => !isValidObjectId(id))) {
    return "One or more color/material selections are invalid";
  }

  const [category, subcategory] = await Promise.all([
    categoryModel.findById(payload.parentCategory).select("_id"),
    subcategoryModel.findOne({
      _id: payload.subcategory,
      parentCategory: payload.parentCategory,
    }).select("_id"),
  ]);
  if (!category || !subcategory) {
    return "The selected category hierarchy is invalid";
  }

  if (payload.subsubcategory) {
    const child = await subSubcategoryModel.findOne({
      _id: payload.subsubcategory,
      parentCategory: payload.parentCategory,
      subcategory: payload.subcategory,
    }).select("_id");
    if (!child) return "The selected sub-subcategory does not belong to this hierarchy";
  }

  const [colorCount, materialCount] = await Promise.all([
    payload.color.length
      ? colorModel.countDocuments({ _id: { $in: payload.color } })
      : 0,
    payload.material.length
      ? materialModel.countDocuments({ _id: { $in: payload.material } })
      : 0,
  ]);
  if (colorCount !== payload.color.length || materialCount !== payload.material.length) {
    return "One or more color/material selections no longer exist";
  }

  return null;
};

const productCreate = async (req, res) => {
  const payload = getProductPayload(req.body);

  try {
    if (!payload.name) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "Product name is required" });
    }
    if (!Number.isFinite(payload.price) || payload.price < 0) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "A valid non-negative price is required" });
    }
    const referenceError = await validateReferences(payload);
    if (referenceError) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: referenceError });
    }
    if (!req.files?.image?.[0]?.filename) {
      return res.status(400).send({ status: 0, message: "Product image is required" });
    }

    const duplicate = await productModel.findOne({
      $or: [exactNameQuery(payload.name), { slug: payload.slug }],
    });
    if (duplicate) {
      removeUploadedFiles(req);
      return res.status(409).send({ status: 0, message: "Product name or slug already exists" });
    }

    payload.image = req.files.image[0].filename;
    payload.gallery = (req.files.gallery || []).map((file) => file.filename);
    const data = await productModel.create(payload);
    return res.status(201).send({ status: 1, message: "Product created successfully", data });
  } catch (error) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Error in product creation", error: getErrorDetails(error) });
  }
};

const productUpdate = async (req, res) => {
  const { id } = req.params;
  const payload = getProductPayload(req.body);

  if (!isValidObjectId(id)) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Invalid product id" });
  }

  try {
    if (!payload.name || !Number.isFinite(payload.price) || payload.price < 0) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: "Product name and a valid price are required" });
    }
    const referenceError = await validateReferences(payload);
    if (referenceError) {
      removeUploadedFiles(req);
      return res.status(400).send({ status: 0, message: referenceError });
    }

    const duplicate = await productModel.findOne({
      _id: { $ne: id },
      $or: [exactNameQuery(payload.name), { slug: payload.slug }],
    });
    if (duplicate) {
      removeUploadedFiles(req);
      return res.status(409).send({ status: 0, message: "Product name or slug already exists" });
    }

    if (req.files?.image?.[0]?.filename) {
      payload.image = req.files.image[0].filename;
    }
    if (req.files?.gallery?.length) {
      payload.gallery = req.files.gallery.map((file) => file.filename);
    }

    const data = await productModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      removeUploadedFiles(req);
      return res.status(404).send({ status: 0, message: "Product not found" });
    }
    return res.send({ status: 1, message: "Product updated successfully", data });
  } catch (error) {
    removeUploadedFiles(req);
    return res.status(400).send({ status: 0, message: "Unable to update product", error: getErrorDetails(error) });
  }
};

const parentcategory = async (_req, res) => {
  try {
    const data = await categoryModel.find({ status: true }).select("name").sort({ order: 1, name: 1 });
    return res.send({ message: "Parent categories", status: 1, data });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to fetch parent categories", data: [] });
  }
};

const subCategory = async (req, res) => {
  const { parentid } = req.params;
  if (!isValidObjectId(parentid)) {
    return res.status(400).send({ status: 0, message: "Invalid parent category id", data: [] });
  }

  const data = await subcategoryModel
    .find({ parentCategory: parentid, status: true })
    .select("name")
    .sort({ order: 1, name: 1 });
  return res.send({ message: "Subcategories found", status: 1, data });
};

const subSubCategory = async (req, res) => {
  const { subcatid } = req.params;
  if (!isValidObjectId(subcatid)) {
    return res.status(400).send({ status: 0, message: "Invalid subcategory id", data: [] });
  }

  const data = await subSubcategoryModel
    .find({ subcategory: subcatid, status: true })
    .select("name")
    .sort({ order: 1, name: 1 });
  return res.send({ message: "Sub-subcategories found", status: 1, data });
};

const getcolors = async (_req, res) => {
  const data = await colorModel.find({ status: { $ne: false } }).select("name").sort({ name: 1 });
  return res.send({ message: "Colors found", status: 1, data });
};

const getMaterials = async (_req, res) => {
  const data = await materialModel.find({ status: { $ne: false } }).select("name").sort({ name: 1 });
  return res.send({ message: "Materials found", status: 1, data });
};

const productDelete = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ status: 0, message: "Invalid product id" });
  }
  const delRes = await productModel.deleteOne({ _id: id });
  if (!delRes.deletedCount) {
    return res.status(404).send({ status: 0, message: "Product not found" });
  }
  return res.send({ message: "Product deleted successfully", status: 1, delRes });
};

const productmultiDelete = async (req, res) => {
  const ids = toIdArray(req.body.ids);
  if (!ids.length || ids.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ status: 0, message: "Valid product ids are required" });
  }
  const delRes = await productModel.deleteMany({ _id: { $in: ids } });
  return res.send({ message: "Products deleted successfully", status: 1, delRes });
};

const changeStatus = async (req, res) => {
  const ids = toIdArray(req.body.ids);
  if (!ids.length || ids.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ status: 0, message: "Valid product ids are required" });
  }

  const rows = await productModel.find({ _id: { $in: ids } }).select("status");
  await Promise.all(rows.map((row) =>
    productModel.updateOne({ _id: row._id }, { $set: { status: !row.status } })
  ));
  return res.send({ message: "Product status changed successfully", status: 1 });
};

const viewProduct = async (req, res) => {
  try {
    const filter = {};
    const name = normalizeText(req.query.name);
    const slug = normalizeText(req.query.slug);
    if (name) filter.name = new RegExp(escapeRegex(name), "i");
    if (slug) filter.slug = new RegExp(escapeRegex(slug), "i");
    if (req.query.order !== "" && req.query.order !== undefined) {
      filter.order = toNumber(req.query.order, 0);
    }
    if (req.query.price !== "" && req.query.price !== undefined) {
      const price = Number(req.query.price);
      if (Number.isFinite(price)) filter.price = price;
    }

    const data = await productModel
      .find(filter)
      .populate("parentCategory", "name")
      .populate("subcategory", "name")
      .populate("subsubcategory", "name")
      .populate("color", "name")
      .populate("material", "name")
      .sort({ order: 1, date: -1 });

    return res.send({ message: "Product view", status: 1, staticPath: getStaticPath(req), data });
  } catch (_error) {
    return res.status(500).send({ status: 0, message: "Unable to fetch products" });
  }
};

const getProductDetails = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ status: 0, message: "Invalid product id" });
  }

  const data = await productModel
    .findById(id)
    .populate("parentCategory", "name")
    .populate("subcategory", "name")
    .populate("subsubcategory", "name")
    .populate("color", "name")
    .populate("material", "name");

  if (!data) {
    return res.status(404).send({ status: 0, message: "Product not found" });
  }
  return res.send({ message: "Product view", status: 1, staticPath: getStaticPath(req), data });
};

module.exports = {
  getProductDetails,
  viewProduct,
  productCreate,
  productUpdate,
  productDelete,
  productmultiDelete,
  changeStatus,
  parentcategory,
  subCategory,
  subSubCategory,
  getcolors,
  getMaterials,
};
