let express = require("express")
let subSubcategoryRoutes = express.Router()
const { parentcategory, subCategory, subsubcategoryCreate, subsubcategoryView, subsubcategoryDelete, subsubcategorymultiDelete, changeStatus, subsubcategoryUpdate, getsubSubcategoryDetails } = require("../../Controllers/subSubCategoryController")
const { createImageUpload } = require("../../config/upload")

const upload = createImageUpload("subsubcategory", { maxCount: 1 })


subSubcategoryRoutes.post('/create', upload.single("image"), subsubcategoryCreate)
subSubcategoryRoutes.get('/view', subsubcategoryView)
subSubcategoryRoutes.get('/parent', parentcategory)
subSubcategoryRoutes.get('/subcategory/:parentid', subCategory)
subSubcategoryRoutes.delete('/delete/:id', subsubcategoryDelete)
subSubcategoryRoutes.post('/multidelete', subsubcategorymultiDelete)
subSubcategoryRoutes.post('/changestatus', changeStatus)
subSubcategoryRoutes.put('/update/:id', upload.single("image"), subsubcategoryUpdate)
subSubcategoryRoutes.get('/get-detail/:id', getsubSubcategoryDetails)
subSubcategoryRoutes.put('/get-detail/:id', getsubSubcategoryDetails)

module.exports = subSubcategoryRoutes
