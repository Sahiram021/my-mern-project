let mongoose=require("mongoose")

let orderSchema=new mongoose.Schema({
    userId:{    
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    shippingAddress:{
        type:Object,
    },
    paymentMethod:{
        type:String,
        enum:["cod","online","paypal"],
        default:"cod",
    },
    razorpayPaymentId:{
        type:String,
    },
    razorpayOrderId:{
        type:String,
    },
    items:[],
   
    totalAmount:{
        type:Number,
        default:0,
    },
    status:{
        type:String,
        lowercase: true,
        trim: true,
        enum: [
        "pending",
        "processing",
        "success",
        "placed",
        "shipped",
        "delivered",
        "cancelled"
    ],
        default:"pending",
    },
     PaymentStatus:{
        type:String,
        lowercase: true,
        trim: true,
        enum: [
        "pending",
        "success",
        "cancelled"
    ],
        default:"pending",
    }
},{timestamps:true})

let orderModel=mongoose.model("order",orderSchema)
module.exports=orderModel
