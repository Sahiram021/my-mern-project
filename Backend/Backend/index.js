let express = require("express");
const adminRoutesroutes = require("./App/Routes/adminRoutes");
const dbconnection = require("./App/config/DBconnection");
let cors = require("cors");
const webRoutes = require("./App/Routes/webRoutes");
const adminModel = require("./App/Models/adminModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;
require("dotenv").config();

const fs = require("fs");
const path = require("path");

let App = express();
App.use(cors());
App.use(express.json());

// Ensure upload folders exist
const uploadDirs = [
  "uploads/category",
  "uploads/subcategory",
  "uploads/subsubcategory",
  "uploads/product",
  "uploads/slider",
  "uploads/whychooseus",
  "uploads/user",
  "uploads/admin",
  "Uploads/category",
  "Uploads/subcategory",
  "Uploads/subsubcategory",
  "Uploads/product",
  "Uploads/slider",
  "Uploads/whychooseus",
  "Uploads/user",
  "Uploads/admin",
];

uploadDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

App.use("/uploads/category", express.static(path.join(__dirname, "uploads/category")), express.static(path.join(__dirname, "Uploads/category")));
App.use("/uploads/subcategory", express.static(path.join(__dirname, "uploads/subcategory")), express.static(path.join(__dirname, "Uploads/subcategory")));
App.use("/uploads/subsubcategory", express.static(path.join(__dirname, "uploads/subsubcategory")), express.static(path.join(__dirname, "Uploads/subsubcategory")));
App.use("/uploads/product", express.static(path.join(__dirname, "uploads/product")), express.static(path.join(__dirname, "Uploads/product")));
App.use("/uploads/slider", express.static(path.join(__dirname, "uploads/slider")), express.static(path.join(__dirname, "Uploads/slider")));
App.use("/uploads/whychooseus", express.static(path.join(__dirname, "uploads/whychooseus")), express.static(path.join(__dirname, "Uploads/whychooseus")));
App.use("/uploads/user", express.static(path.join(__dirname, "uploads/user")), express.static(path.join(__dirname, "Uploads/user")));
App.use("/uploads/admin", express.static(path.join(__dirname, "uploads/admin")), express.static(path.join(__dirname, "Uploads/admin")));

App.use("/admin", adminRoutesroutes);
App.use("/web", webRoutes);

App.get("/", (req, res) => {
    res.send({ status: 1, message: "JGB Trading Backend API is running successfully!" });
});

App.listen(process.env.PORT || 8000, async () => {
    console.log(` Server is running on port ${process.env.PORT || 8000}`);
    try {
        await dbconnection();
        let targetEmail = process.env.ADMINEMAIL || "jgb635860@gmail.com";
        let targetPassword = process.env.ADMINPASSWORD || "54@54@123";
        let hashPassword = bcrypt.hashSync(targetPassword, saltRounds);

        let checkAdmin = await adminModel.findOne();
        if (!checkAdmin) {
            await adminModel.create({
                name: "Admin",
                email: targetEmail,
                password: hashPassword
            });
            console.log(` Default admin user created successfully (${targetEmail}).`);
        } else {
            await adminModel.updateOne(
                { _id: checkAdmin._id },
                {
                    $set: {
                        email: targetEmail,
                        password: hashPassword
                    }
                }
            );
            console.log(` Admin user credentials synchronized with .env (${targetEmail}).`);
        }
    } catch (err) {
        console.error(" Startup DB/Admin warning:", err.message);
    }
});
