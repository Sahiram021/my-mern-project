const contactEnquiryModel = require("../Models/contactEnquiryModel")

let enquiryView=async(req,res)=>{
    let data=await contactEnquiryModel.find()
    let apiRes={
        status:true,
        message:"Enquiry view successfully",
        data
    }
    res.send(apiRes)

}
module.exports={enquiryView}