let express=require("express")
let productRoutes=express.Router()
const multer = require("multer")
const {productCreate, productUpdate, productDelete, productmultiDelete, changeStatus, subSubCategory, parentcategory, subCategory, getcolors, getMaterials, viewProduct, getProductDetails } = require("../../Controllers/productController")


let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads/product')
    },
    filename:(req,file,cb)=>{
        cb(null,  Date.now()+ file.originalname)
    }
})


const upload = multer({storage:storage})


productRoutes.post('/create', upload.fields([
    {
        name:"image",
        maxCount:1
    },
    {
       name:"gallery",
       maxCount:20 
    }
]),productCreate) 
productRoutes.get('/view',viewProduct  )
productRoutes.get('/details/:id',getProductDetails  )
productRoutes.get('/parent', parentcategory )
productRoutes.get('/subcategory/:parentid', subCategory )
productRoutes.get('/subsubcategory/:subcatid',subSubCategory  )
productRoutes.get('/colors',getcolors  )
productRoutes.get('/materials',getMaterials  )
productRoutes.delete('/delete/:id', productDelete)
productRoutes.post('/multidelete', productmultiDelete)
productRoutes.post('/changestatus', changeStatus)
productRoutes.post('/update/:id', upload.fields([
    {
        name:"image",
        maxCount:1
    },
    {
       name:"gallery",
       maxCount:20 
    }
]),productUpdate)
productRoutes.put('/update/:id', upload.fields([
    {
        name:"image",
        maxCount:1
    },
    {
       name:"gallery",
       maxCount:20 
    }
]),productUpdate)
// productRoutes.put('/get-detail/:id', )

module.exports=productRoutes