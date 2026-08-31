let express=require("express")
const { contactRoutes } = require("./webside/contectpageRoutes")
const authRoutes = require("./webside/authRoutes")
const homeRoutes = require("./webside/homeRoutes")
const cartRoutes = require("./webside/cartRoutes")
const orderRoutes = require("./webside/orderRoutes")
const wishlistRoutes = require("./webside/wishlistRoutes")
const { searchProducts, getProductBySlug } = require("../Controllers/website/productController")
const { getMegaMenu } = require("../Controllers/website/megaMenuController")
const { getCategoryProducts } = require("../Controllers/website/CategoryController")
const { getFooterData } = require("../Controllers/website/footerController")
let webRoutes=express.Router()


webRoutes.use("/contact",contactRoutes)
webRoutes.use("/auth",authRoutes)
webRoutes.use("/home",homeRoutes)
webRoutes.use("/cart",cartRoutes)
webRoutes.use("/order",orderRoutes)
webRoutes.use("/wishlist",wishlistRoutes)
webRoutes.get("/products/search", searchProducts);
webRoutes.get("/products/:slug", getProductBySlug);
webRoutes.get("/mega-menu", getMegaMenu);
webRoutes.get("/category-products/:slug", getCategoryProducts);
webRoutes.get("/footer", getFooterData);


module.exports=webRoutes
