const productModel = require("../../Models/productModel");
const subcategoryModel = require("../../Models/subcategoryModel");
const subSubcategoryModel = require("../../Models/subSubcategoryModel");

// ======================================================
// GET PRODUCTS BY CATEGORY / SUBCATEGORY / SUBSUBCATEGORY
// ======================================================

const getCategoryProducts = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        status: false,
        message: "Slug is required",
      });
    }

    console.log("Category slug:", slug);

    // ==================================================
    // 1. FIRST CHECK SUB-SUB-CATEGORY
    // Example:
    // sliding-wardrobes
    // ==================================================

    const subSubcategory = await subSubcategoryModel.findOne({
      slug: slug,
      status: true,
    });

    if (subSubcategory) {
      console.log(
        "SubSubcategory Found:",
        subSubcategory.name,
        subSubcategory._id
      );

      const products = await productModel
        .find({
          subsubcategory: subSubcategory._id,
          status: true,
        })
        .sort({ order: 1, _id: -1 });

      let staticPath = process.env.PRODUCTIMAGEPATH  

      return res.status(200).json({
        status: true,
        message: "Sub-subcategory products fetched successfully",

        category: {
          _id: subSubcategory._id,
          name: subSubcategory.name,
          slug: subSubcategory.slug,
        },
        base_url :staticPath ,

        total: products.length,
        products,
      });
    }

    // ==================================================
    // 2. CHECK SUBCATEGORY
    // Example:
    // bedroom-wardrobes
    // ==================================================

    const subcategory = await subcategoryModel.findOne({
      slug: slug,
      status: true,
    });

    if (subcategory) {
      console.log(
        "Subcategory Found:",
        subcategory.name,
        subcategory._id
      );

      const products = await productModel
        .find({
          subcategory: subcategory._id,
          status: true,
        })
        .sort({ order: 1, _id: -1 });

              let staticPath = process.env.PRODUCTIMAGEPATH  

      return res.status(200).json({
        status: true,
        message: "Subcategory products fetched successfully",

        category: {
          _id: subcategory._id,
          name: subcategory.name,
          slug: subcategory.slug,
        },
        base_url :staticPath ,

        total: products.length,
        products,
      });
    }

    // ==================================================
    // 3. CATEGORY
    // Parent category me slug nahi hai
    // isliye name se check karenge
    // ==================================================

    return res.status(404).json({
      status: false,
      message: `Category not found for slug: ${slug}`,
      products: [],
    });

  } catch (error) {
    console.error("Get Category Products Error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to fetch category products",
      error: error.message,
    });
  }
};

module.exports = {
  getCategoryProducts,
};