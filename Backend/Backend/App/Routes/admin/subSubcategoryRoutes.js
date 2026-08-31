let express=require("express")
let subSubcategoryRoutes=express.Router()
const multer = require("multer")
const { parentcategory, subCategory, subsubcategoryCreate, subsubcategoryView, subsubcategoryDelete, subsubcategorymultiDelete, changeStatus, subsubcategoryUpdate, getsubSubcategoryDetails } = require("../../Controllers/subSubCategoryController")


let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads/subsubcategory')
    },
    filename:(req,file,cb)=>{
        cb(null,  Date.now()+ file.originalname)
    }
})


const upload = multer({storage:storage})


subSubcategoryRoutes.post('/create', upload.single("image"),subsubcategoryCreate) 
subSubcategoryRoutes.get('/view', subsubcategoryView )
subSubcategoryRoutes.get('/parent', parentcategory )
subSubcategoryRoutes.get('/subcategory/:parentid', subCategory )
subSubcategoryRoutes.delete('/delete/:id', subsubcategoryDelete)
subSubcategoryRoutes.post('/multidelete', subsubcategorymultiDelete)
subSubcategoryRoutes.post('/changestatus', changeStatus)
subSubcategoryRoutes.put('/update/:id', upload.single("image"), subsubcategoryUpdate)
subSubcategoryRoutes.put('/get-detail/:id', getsubSubcategoryDetails)

module.exports=subSubcategoryRoutes

