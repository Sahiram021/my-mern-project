let mongoose=require("mongoose")

let subSubcategorySchema=mongoose.Schema(
    {
        name:{
            type:String, // metal,plastic,wood
            minLength:[2,"subSubcategory name minimum length of name is 2"], // minimum length of name is 2
            maxLength:[50," subSubcategory name maximum length of name is 50"], // maximum length of name is 15
            required:[true,"subSubcategory name is required"], // name is required,
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
            required:[true,"subcategory is required"],
        },
         image:{
            type:String, // metal,plastic,wood
            minLength:[2,"subSubcategory image minimum length of image is 2"], // minimum length of image is 2
            required:[true,"subSubcategory image is required"], // name is required,
        },
        status:{
            type:Boolean, // true or false
            default:true // default value is true
        },
        slug:{
            type:String, // metal,plastic,wood
            minLength:[2,"subSubcategory slug minimum length of slug is 2"], 
            required:[true,"subSubcategory slug is required"],
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

let subSubcategoryModel=mongoose.model("subSubcategory",subSubcategorySchema)
module.exports=subSubcategoryModel
