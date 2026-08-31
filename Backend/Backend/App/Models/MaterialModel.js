let mongoose=require("mongoose")

let materialSchema=mongoose.Schema(
    {
        name:{
            type:String,
            minLength:[ 2,"Name must be at least 2 characters long"],
            maxLength:[15,"Name must be at most 15 characters long"],   
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

let materialModel=mongoose.model("material",materialSchema)
module.exports=materialModel
