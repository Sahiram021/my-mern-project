let jwt = require("jsonwebtoken");
let mongoose = require("mongoose");
const wishlistModel = require("../../Models/wishlistModel");
const productModel = require("../../Models/productModel");

let getUserIdFromToken = (req) => {
  let authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  let token = authorization.split(" ")[1] || authorization;
  let decoded = jwt.verify(token, process.env.TOKENKEY);

  return decoded.id;
};


// ==========================================
// ADD TO WISHLIST
// ==========================================

let addToWishlist = async (req, res) => {
  try {

    let wishlistObject = { ...req.body };
    let productId = wishlistObject.productId || wishlistObject._id || wishlistObject.id;

    let id = getUserIdFromToken(req);

    if (!id) {
      return res.send({
        status: 0,
        message: "Please login first",
      });
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.send({
        status: 0,
        message: "Valid productId is required",
      });
    }

    wishlistObject["productId"] = productId;
    wishlistObject["userId"] = id;

    if (!wishlistObject.name || !wishlistObject.price || !wishlistObject.image) {
      let productData = await productModel.findOne({ _id: productId });

      if (!productData) {
        return res.send({
          status: 0,
          message: "Product not found",
        });
      }

      wishlistObject["name"] = wishlistObject.name || productData.name;
      wishlistObject["price"] = wishlistObject.price || productData.price;
      wishlistObject["image"] = wishlistObject.image || productData.image;
      wishlistObject["slug"] = wishlistObject.slug || productData.slug;
    }


    // Check product already exists in wishlist
    let alreadyWishlist = await wishlistModel.findOne({
      userId: id,
      productId: productId,
    });


    if (alreadyWishlist) {

      return res.send({
        status: 0,
        message: "Product already exists in wishlist",
        data: alreadyWishlist,
      });

    }


    let result = await wishlistModel.create(
      wishlistObject
    );


    res.send({
      status: 1,
      message: "Product added to wishlist successfully",
      data: result,
    });

  } catch (error) {

    console.log("Add Wishlist Error:", error);

    res.send({
      status: 0,
      message: "Unable to add product to wishlist",
      error: error.message,
    });

  }
};



// ==========================================
// VIEW WISHLIST
// ==========================================

let viewWishlist = async (req, res) => {
  try {

    let id = getUserIdFromToken(req);

    if (!id) {
      return res.send({
        status: 0,
        message: "Please login first",
      });
    }


    let result = await wishlistModel.find({
      userId: id,
    }).sort({ createdAt: -1 });


    res.send({
      status: 1,
      message: "Wishlist items retrieved successfully",
      data: result,
    });

  } catch (error) {

    console.log("View Wishlist Error:", error);

    res.send({
      status: 0,
      message: "Unable to retrieve wishlist",
      error: error.message,
    });

  }
};



// ==========================================
// DELETE FROM WISHLIST
// ==========================================

let deleteWishlist = async (req, res) => {
  try {

    let { id } = req.params;
    let userId = getUserIdFromToken(req);

    if (!userId) {
      return res.send({
        status: 0,
        message: "Please login first",
      });
    }


    let result = await wishlistModel.deleteOne({
      _id: id,
      userId: userId,
    });


    res.send({
      status: 1,
      message: "Product removed from wishlist successfully",
      data: result,
    });

  } catch (error) {

    console.log("Delete Wishlist Error:", error);

    res.send({
      status: 0,
      message: "Unable to remove product from wishlist",
      error: error.message,
    });

  }
};


module.exports = {
  addToWishlist,
  viewWishlist,
  deleteWishlist,
};
