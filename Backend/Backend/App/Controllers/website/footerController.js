const footerModel = require("../../Models/footerModel");
const productModel = require("../../Models/productModel");

const getFooterData = async (req, res) => {
  try {
    let footer = await footerModel.findOne();

    // First time default footer create hoga
    if (!footer) {
      footer = await footerModel.create({
        address: "Claritas est etiam processus dynamicus",

        phone: "98745612330",

        email: "furniture@gmail.com",

        socialLinks: [
          {
            platform: "facebook",
            url: "https://facebook.com",
          },
          {
            platform: "instagram",
            url: "https://instagram.com",
          },
          {
            platform: "twitter",
            url: "https://twitter.com",
          },
          {
            platform: "youtube",
            url: "https://youtube.com",
          },
          {
            platform: "telegram",
            url: "https://telegram.org",
          },
        ],

        informationLinks: [
          {
            label: "About Us",
            href: "/about-us",
          },
          {
            label: "Contact Us",
            href: "/contact-us",
          },
          {
            label: "Frequently Questions",
            href: "/frequently-questions",
          },
        ],

        accountLinks: [
          {
            label: "My Account",
            href: "/my-account",
          },
          {
            label: "My Dashboard",
            href: "/my-dashboard",
          },
          {
            label: "Wishlist",
            href: "/wishlist",
          },
          {
            label: "Cart",
            href: "/cart",
          },
          {
            label: "Checkout",
            href: "/checkout",
          },
        ],

        bottomLinks: [
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Online Store",
            href: "/online-store",
          },
          {
            label: "Privacy Policy",
            href: "/privacy-policy",
          },
          {
            label: "Terms Of Use",
            href: "/term-of-use",
          },
        ],

        copyrightText: "All Rights Reserved By Furniture",

        paymentImage:
          "http://wscubetech.co/Assignments/furniture/public/frontend/img/icon/papyel2.png",

        topProductsLimit: 2,
      });
    }

    const topProducts = await productModel
      .find({
        status: true,
      })
      .populate("parentCategory")
      .populate("subcategory")
      .sort({
        rating: -1,
        order: 1,
      })
      .limit(footer.topProductsLimit || 2);

    return res.status(200).json({
      success: true,
      footer,
      topProducts,
    });
  } catch (error) {
    console.log("Get Footer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load footer",
      error: error.message,
    });
  }
};

module.exports = {
  getFooterData,
};