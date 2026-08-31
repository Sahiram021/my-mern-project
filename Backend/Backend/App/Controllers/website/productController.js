const productModel = require("../../Models/productModel");

const searchProducts = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {
      status: true
    };

    if (search && search.trim() !== "") {
      query.name = {
        $regex: search.trim(),
        $options: "i"
      };
    }

    const products = await productModel.find(query);

    res.status(200).json({
      success: true,
      count: products.length,
      products: products
    });

  } catch (error) {
    console.log("Search Error:", error);

    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message
    });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await productModel
      .findOne({
        slug: slug,
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

    res.status(200).json({
      success: true,
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: error.message,
    });
  }
};
module.exports = {
  searchProducts,getProductBySlug
};