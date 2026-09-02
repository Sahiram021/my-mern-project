let mongoose=require("mongoose")

let subcategorySchema=mongoose.Schema(
    {
        name:{
            type:String, // metal,plastic,wood
            minLength:[2,"subcategory name minimum length of name is 2"], // minimum length of name is 2
            maxLength:[50," subcategory name maximum length of name is 50"], // maximum length of name is 15
            required:[true,"subcategory name is required"], // name is required,
            trim:true,
        },
        parentCategory:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:"category", 
            required:[true,"parent category is required"],
        },
        subcategory:{
                    type:mongoose.Schema.Types.ObjectId, 
                    ref:"subcategory", 
        },
       
         image:{
            type:String, // metal,plastic,wood
            minLength:[2,"subcategory image minimum length of image is 2"], // minimum length of image is 2
            required:[true,"subcategory image is required"], // name is required,
        },
        
        status:{
            type:Boolean, // true or false
            default:true // default value is true
        },
        slug:{
            type:String, // metal,plastic,wood
            minLength:[2,"subcategory slug minimum length of slug is 2"], 
            required:[true,"subcategory slug is required"],
            lowercase:true,
            trim:true,
        },
        order:{
            type:Number, // 1,2,3,4
            default:0 // default value is 0
        },
        date:{
            type:Date, // date type
            default:Date.now // default value is current date
        }
    }
)

let subcategoryModel=mongoose.model("subcategory",subcategorySchema)
module.exports=subcategoryModel
