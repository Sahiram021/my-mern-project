let express = require("express");
const { register, login, changePassword, updateProfile, getProfile, forgotPassword, resetPassword } = require("../../Controllers/website/authController");
let authRoutes = express.Router();
const multer  = require('multer')

let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads/user')
    },
    filename:(req,file,cb)=>{
        cb(null,  Date.now()+ file.originalname)
    }
})


const upload = multer({storage:storage})




authRoutes.post("/register",register);
authRoutes.post("/login",login);
authRoutes.post("/change-password",changePassword);
authRoutes.post("/update-profile",upload.single("image"), updateProfile);
authRoutes.get("/get-profile", getProfile);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password/:id", resetPassword);

module.exports = authRoutes;
