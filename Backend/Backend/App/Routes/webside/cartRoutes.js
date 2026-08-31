let express=require("express")
const { addTocart, viewCart, deleteCart, changeQty } = require("../../Controllers/website/cartController")
let cartRoutes=express.Router()

cartRoutes.post('/add-to-cart',addTocart)
cartRoutes.get('/view-cart',viewCart)
cartRoutes.delete('/remove-cart/:id',deleteCart)
cartRoutes.put('/change-qty/:id',changeQty)


module.exports=cartRoutes
