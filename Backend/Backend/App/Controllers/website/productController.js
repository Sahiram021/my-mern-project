const productModel = require("../../Models/productModel");
const { escapeRegex, getUploadStaticPath, normalizeText } = require("../../config/controllerUtils");

const searchProducts = async (req, res) => {
  try {
    const search = normalizeText(req.query.search);

    const query = {
      status: true
    };

    if (search) {
      query.name = {
        $regex: escapeRegex(search),
        $options: "i"
      };
    }

    const products = await productModel.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products: products
    });

  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Search failed"
    });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const slug = normalizeText(req.params.slug).toLowerCase();

    if (!slug) {
      return res.status(400).json({ success: false, message: "Product slug is required" });
    }

    const product = await productModel
      .findOne({
        slug,
        status: true,
      })
      .populate("parentCategory")
      .populate("subcategory")
      .populate("subsubcategory")
      .populate("color")
      .populate("material");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
      staticPath: getUploadStaticPath(req, "product", process.env.PRODUCTIMAGEPATH),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get product"
    });
  }
};
module.exports = { searchProducts, getProductBySlug };
