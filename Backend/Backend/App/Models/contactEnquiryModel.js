let mongoose=require("mongoose")

let contactEnquirySchema=mongoose.Schema(
    {
        name:{
            type:String,
            minLength:[ 2,"Name must be at least 2 characters long"],
            maxLength:[15,"Name must be at most 15 characters long"],   
            required:true
        },
        email:{
            type:String,
            minLength:[ 2,"Name must be at least 2 characters long"],
            required:true
        },
        phone:{
           type:String,
            minLength:[ 2,"Name must be at least 2 characters long"],
            maxLength:[15,"Name must be at most 15 characters long"],   
            required:true
        },
        message:String,
           
       
        date:{
            type:Date,
            default:Date.now

        }

    }
)

let contactEnquiryModel=mongoose.model("enquiry",contactEnquirySchema)
module.exports=contactEnquiryModel
