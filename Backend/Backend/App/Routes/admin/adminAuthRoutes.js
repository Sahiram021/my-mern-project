let express = require('express');
const { login, adforgotPassword, adresetPassword, adgetProfile, adupdateProfile } = require('../../Controllers/adminController');
let adminAuthRoutes = express.Router();
const multer  = require('multer')

let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads/admin')
    },
    filename:(req,file,cb)=>{
        cb(null,  Date.now()+ file.originalname)
    }
})


const upload = multer({storage:storage})



adminAuthRoutes.post("/login",login);
adminAuthRoutes.post("/forgotpassword", adforgotPassword);
adminAuthRoutes.post("/resetpassword/:id", adresetPassword);
adminAuthRoutes.post("/update-profile",upload.single("image"), adupdateProfile);
adminAuthRoutes.get("/get-profile", adgetProfile);
module.exports = adminAuthRoutes;