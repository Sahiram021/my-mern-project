let mongoose=require("mongoose")

let faqSchema=mongoose.Schema(
    {
        q:{
            type:String,
            minLength:[ 2,"Question must be at least 2 characters long"],
            maxLength:[1000,"Question must be at most 1000 characters long"],   
            required:true
        },
        answer:{
            type:String,
            minLength:[ 2,"Answer must be at least 2 characters long"],
            maxLength:[1000,"Answer must be at most 1000 characters long"],   
            required:true

        },
        status:{
            type:Boolean,
            default:true
        },
        order:{
            type:Number,
            default:0
        },
        date:{
            type:Date,
            default:Date.now

        }

    }
)
let faqModel=mongoose.model("faq",faqSchema)
module.exports=faqModel
