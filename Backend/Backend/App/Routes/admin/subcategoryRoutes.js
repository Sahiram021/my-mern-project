let express = require("express")
let subcategoryRoutes = express.Router()


const { subcategoryCreate, subcategoryView, parentcategory, subcategoryDelete, subcategorymultiDelete, changeStatus, subcategoryUpdate, getSubcategoryDetails } = require("../../Controllers/subcategoryController")
const { createImageUpload } = require("../../config/upload")

const upload = createImageUpload("subcategory", { maxCount: 1 })


subcategoryRoutes.post('/create', upload.single("image"), subcategoryCreate)
subcategoryRoutes.get('/view', subcategoryView)
subcategoryRoutes.get('/parent', parentcategory)
subcategoryRoutes.delete('/delete/:id', subcategoryDelete)
subcategoryRoutes.post('/multidelete', subcategorymultiDelete)
subcategoryRoutes.post('/changestatus', changeStatus)
subcategoryRoutes.put('/update/:id', upload.single("image"), subcategoryUpdate)
subcategoryRoutes.get('/get-detail/:id', getSubcategoryDetails)
subcategoryRoutes.put('/get-detail/:id', getSubcategoryDetails)

module.exports = subcategoryRoutes
