let express = require("express")
let categoryRoutes = express.Router()
const { categoryCreate, categoryView, categoryDelete, categorymultiDelete, changeStatus, categoryUpdate, getCategoryDetails } = require("../../Controllers/categoryController")
const { createImageUpload } = require("../../config/upload")

const upload = createImageUpload("category", { maxCount: 1 })



categoryRoutes.post('/create', upload.single("image"), categoryCreate)

//http://localhost:8000/admin/category/create

categoryRoutes.get('/view', categoryView)


categoryRoutes.delete('/delete/:id', categoryDelete)

categoryRoutes.post('/multidelete', categorymultiDelete)

categoryRoutes.post('/changestatus', changeStatus)

categoryRoutes.put('/update/:id', upload.single("image"), categoryUpdate)
categoryRoutes.get('/get-detail/:id', getCategoryDetails)
categoryRoutes.put('/get-detail/:id', getCategoryDetails)
module.exports = categoryRoutes
