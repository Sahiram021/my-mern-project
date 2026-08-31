let express = require("express");
const adminRoutesroutes = require("./App/Routes/adminRoutes");
const dbconnection = require("./App/config/DBconnection");
let cors = require("cors");
const webRoutes = require("./App/Routes/webRoutes");
const adminModel = require("./App/Models/adminModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;
require("dotenv").config();

let App = express();
App.use(cors());
App.use(express.json());

App.use("/uploads/category", express.static("uploads/category"));
App.use("/uploads/subcategory", express.static("uploads/subcategory"));
App.use("/uploads/subsubcategory", express.static("uploads/subsubcategory"));
App.use("/uploads/product", express.static("uploads/product"));
App.use("/uploads/slider", express.static("uploads/slider"));
App.use("/uploads/whychooseus", express.static("uploads/whychooseus"));
App.use("/uploads/user", express.static("uploads/user"));
App.use("/uploads/admin", express.static("uploads/admin"));

App.use("/admin", adminRoutesroutes);
App.use("/web", webRoutes);

App.get("/", (req, res) => {
    res.send({ status: 1, message: "JGB Trading Backend API is running successfully!" });
});

App.listen(process.env.PORT || 8000, async () => {
    console.log(` Server is running on port ${process.env.PORT || 8000}`);
    try {
        await dbconnection();
        let checkAdmin = await adminModel.findOne();
        if (!checkAdmin) {
            let hashPassword = bcrypt.hashSync(process.env.ADMINPASSWORD || "54@54@123", saltRounds);
            await adminModel.create({
                name: "Admin",
                email: process.env.ADMINEMAIL || "jgb635860@gmail.com",
                password: hashPassword
            });
            console.log(" Default admin user created successfully.");
        }
    } catch (err) {
        console.error(" Startup DB/Admin warning:", err.message);
    }
});
