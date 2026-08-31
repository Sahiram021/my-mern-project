let express=require("express")
const { enquiryView } = require("../../Controllers/EnquiryController")

let enquiryRoutes=express.Router()

enquiryRoutes.get("/view" ,enquiryView)

module.exports=enquiryRoutes