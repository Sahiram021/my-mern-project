let express = require("express")
const { colorCreate, colorView, colorDelete, colorEdit, colorUpdate, colormultiDelete, changeStatus, getColorDetails,  } = require("../../Controllers/colorController")
let colorRoutes = express.Router()

colorRoutes.post('/create', colorCreate)

colorRoutes.get('/view', colorView)
colorRoutes.delete('/delete/:id', colorDelete)
colorRoutes.post('/multidelete', colormultiDelete)

colorRoutes.get('/edit/:id', colorEdit)
colorRoutes.put('/update/:id', colorUpdate)
colorRoutes.put('/get-detail/:id', getColorDetails)

colorRoutes.post("/changestatus", changeStatus);
module.exports = colorRoutes
