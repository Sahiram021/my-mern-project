let express=require("express")
let colorRoutes = require("./admin/colorRoutes")
let materialRoutes = require("./admin/materialRoutes")
const faqRoutes = require("./admin/faqRoutes")
const categoryRoutes = require("./admin/categoryRoutes")
const countryRoutes = require("./admin/countryRoutes")
const subcategoryRoutes = require("./admin/subcategoryRoutes")
const subSubcategoryRoutes = require("./admin/subSubcategoryRoutes")
const productRoutes = require("./admin/productRoutes")
const enquiryRoutes = require("./admin/EnquiryRoutes")
const adminAuthRoutes = require("./admin/adminAuthRoutes")
const sliderRoutes = require("./admin/sliderRoutes")
const whyChooseUsRoutes = require("./admin/whyChooseUsRoutes")
const orderRoutes = require("./admin/orderRoutes")


 let adminRoutes=express.Router()

 adminRoutes.use("/color",colorRoutes)
adminRoutes.use("/material",materialRoutes)
adminRoutes.use("/faq",faqRoutes)
adminRoutes.use("/country",countryRoutes)
adminRoutes.use("/category",categoryRoutes)
adminRoutes.use("/category",categoryRoutes)
adminRoutes.use("/subcategory",subcategoryRoutes)
adminRoutes.use("/subsubcategory",subSubcategoryRoutes)
adminRoutes.use("/product",productRoutes)
adminRoutes.use("/enquiry",enquiryRoutes)
adminRoutes.use("/adminauth",adminAuthRoutes)
adminRoutes.use("/slider",sliderRoutes)
adminRoutes.use("/whychooseus",whyChooseUsRoutes)
adminRoutes.use("/order",orderRoutes)


// adminRoutes.post("/login",(req,res)=>{
//     res.send({message: "Login successful", status: 1})
// })

module.exports=adminRoutes


