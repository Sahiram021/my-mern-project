let express=require("express")
const { productTabs, slider, review, subscribe } = require("../../Controllers/website/homeController")
let homeRoutes=express.Router()

homeRoutes.get('/product-tabs',productTabs)
homeRoutes.get('/slider',slider)
homeRoutes.get('/whychooseus',review)
homeRoutes.post("/subscribe", subscribe);
module.exports=homeRoutes
