let express = require("express")
const { faqCreate, faqView, faqDelete, faqEdit, faqUpdate, faqmultiDelete, changeStatus, getFaqDetails } = require("../../Controllers/faqController")
let faqRoutes = express.Router()

faqRoutes.post('/create', faqCreate)

faqRoutes.get('/view', faqView)
faqRoutes.delete('/delete/:id', faqDelete)
faqRoutes.post('/multidelete', faqmultiDelete)

faqRoutes.get('/edit/:id', faqEdit)
faqRoutes.put('/update/:id', faqUpdate)
faqRoutes.put('/get-detail/:id', getFaqDetails)
faqRoutes.post('/changestatus', changeStatus)

module.exports = faqRoutes
