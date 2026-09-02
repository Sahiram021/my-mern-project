const categoryModel = require("../../Models/categoryModel");
const productModel = require("../../Models/productModel");
const subcategoryModel = require("../../Models/subcategoryModel");
const subSubcategoryModel = require("../../Models/subSubcategoryModel");
const { getUploadStaticPath } = require("../../config/controllerUtils");

const getProductImagePath = (req) =>
  getUploadStaticPath(req, "product", process.env.PRODUCTIMAGEPATH);

const getCategoryProducts = async (req, res) => {
  try {
    const slug = String(req.params.slug || "").trim().toLowerCase();

    if (!slug) {
      return res.status(400).json({
        status: false,
        message: "Slug is required",
      });
    }

    const hierarchy = [
      {
        kind: "subsubcategory",
        model: subSubcategoryModel,
        productField: "subsubcategory",
      },
      {
        kind: "subcategory",
        model: subcategoryModel,
        productField: "subcategory",
      },
      {
        kind: "category",
        model: categoryModel,
        productField: "parentCategory",
      },
    ];

    for (const level of hierarchy) {
      const category = await level.model.findOne({ slug, status: true });
      if (!category) continue;

      const products = await productModel
        .find({ [level.productField]: category._id, status: true })
        .sort({ order: 1, createdAt: -1 });

      return res.status(200).json({
        status: true,
        message: "Category products fetched successfully",
        kind: level.kind,
        category: {
          _id: category._id,
          name: category.name,
          slug: category.slug,
        },
        base_url: getProductImagePath(req),
        total: products.length,
        products,
      });
    }

    return res.status(404).json({
      status: false,
      message: "Category not found",
      products: [],
    });
  } catch (_error) {
    return res.status(500).json({
      status: false,
      message: "Failed to fetch category products",
    });
  }
};

module.exports = { getCategoryProducts };
