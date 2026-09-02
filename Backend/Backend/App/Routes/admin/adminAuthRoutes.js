let express = require('express');
const { login, adforgotPassword, adresetPassword, adgetProfile, adupdateProfile } = require('../../Controllers/adminController');
let adminAuthRoutes = express.Router();
const { createImageUpload } = require('../../config/upload')

const upload = createImageUpload("admin", { maxCount: 1 })



adminAuthRoutes.post("/login",login);
adminAuthRoutes.post("/forgotpassword", adforgotPassword);
adminAuthRoutes.post("/resetpassword/:id", adresetPassword);
adminAuthRoutes.post("/update-profile",upload.single("image"), adupdateProfile);
adminAuthRoutes.get("/get-profile", adgetProfile);
module.exports = adminAuthRoutes;
