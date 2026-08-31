let express=require("express")
const { saveEnquiry } = require("../../Controllers/website/contactController")

let contactRoutes=express.Router()

contactRoutes.post("/enquiry-save",saveEnquiry)

module.exports={contactRoutes}