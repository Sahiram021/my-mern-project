let express=require("express")
let subcategoryRoutes=express.Router()


const multer = require("multer")
const { subcategoryCreate, subcategoryView, parentcategory, subcategoryDelete, subcategorymultiDelete, changeStatus, subcategoryUpdate, getSubcategoryDetails } = require("../../Controllers/subcategoryController")


let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads/subcategory')
    },
    filename:(req,file,cb)=>{
        cb(null,  Date.now()+ file.originalname)
    }
})


const upload = multer({storage:storage})


subcategoryRoutes.post('/create', upload.single("image"), subcategoryCreate) 
subcategoryRoutes.get('/view', subcategoryView )
subcategoryRoutes.get('/parent', parentcategory )
subcategoryRoutes.delete('/delete/:id', subcategoryDelete)
subcategoryRoutes.post('/multidelete', subcategorymultiDelete)
subcategoryRoutes.post('/changestatus', changeStatus)
subcategoryRoutes.put('/update/:id', subcategoryUpdate)
subcategoryRoutes.put('/get-detail/:id', getSubcategoryDetails)

module.exports=subcategoryRoutes

