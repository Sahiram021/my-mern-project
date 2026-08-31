let express=require("express")
let categoryRoutes=express.Router()
const { categoryCreate, categoryView, categoryDelete, categorymultiDelete, changeStatus, categoryUpdate, getCategoryDetails } = require("../../Controllers/categoryController")
const multer  = require('multer')

let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads/category')
    },
    filename:(req,file,cb)=>{
        cb(null,  Date.now()+ file.originalname)
    }
})


const upload = multer({storage:storage})



categoryRoutes.post('/create', upload.single("image"),   categoryCreate)

//http://localhost:8000/admin/category/create

categoryRoutes.get('/view', categoryView)


categoryRoutes.delete('/delete/:id',categoryDelete)

categoryRoutes.post('/multidelete',categorymultiDelete)

categoryRoutes.post('/changestatus',changeStatus)

categoryRoutes.put('/update/:id', categoryUpdate)
categoryRoutes.put('/get-detail/:id', getCategoryDetails)
module.exports=categoryRoutes

