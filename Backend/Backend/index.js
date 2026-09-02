let express = require("express");
const adminRoutesroutes = require("./App/Routes/adminRoutes");
const dbconnection = require("./App/config/DBconnection");
let cors = require("cors");
const webRoutes = require("./App/Routes/webRoutes");
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { uploadsRoot } = require("./App/config/upload");

let App = express();
App.set("trust proxy", 1);
const normalizeOrigin = (origin) => String(origin || "").trim().replace(/\/$/, "");
const allowedOrigins = new Set(
    [
        process.env.APPURL,
        process.env.ADMINAPPURL,
        ...(process.env.CORS_ORIGINS || "").split(","),
        "http://localhost:3000",
        "http://localhost:5173",
    ]
        .map(normalizeOrigin)
        .filter(Boolean)
);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
            return callback(null, true);
        }
        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with", "Accept", "Origin"]
};

App.use(cors(corsOptions));
App.use(express.json({ limit: "10mb" }));
App.use(express.urlencoded({ extended: true, limit: "10mb" }));
App.use(["/api", "/admin", "/web"], (_req, res, next) => {
    res.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    next();
});

// Linux is case-sensitive. New files always go to the tracked `Uploads` tree;
// the lowercase path remains as a read-only fallback for older deployments.
const uploadFolders = [
    "category",
    "subcategory",
    "subsubcategory",
    "product",
    "slider",
    "whychooseus",
    "user",
    "admin",
];

uploadFolders.forEach((folder) => {
    const canonicalPath = path.join(uploadsRoot, folder);
    const legacyPath = path.join(__dirname, "uploads", folder);
    fs.mkdirSync(canonicalPath, { recursive: true });
    App.use(
        `/uploads/${folder}`,
        express.static(canonicalPath),
        express.static(legacyPath)
    );
});

App.use("/api/admin", adminRoutesroutes);
App.use("/admin", adminRoutesroutes);
App.use("/api/web", webRoutes);
App.use("/web", webRoutes);

App.get(["/", "/api", "/api/"], (req, res) => {
    res.send({ status: 1, message: "JGB Trading Backend API is running successfully!" });
});

App.use((error, _req, res, _next) => {
    const isCorsError = error.message === "Origin is not allowed by CORS";
    const isUploadError = error.name === "MulterError" || error.message === "Only image uploads are allowed";
    const statusCode = isCorsError ? 403 : isUploadError ? 400 : 500;

    if (statusCode === 500) {
        console.error("Unhandled request error:", error.message);
    }

    return res.status(statusCode).send({
        status: 0,
        message: isCorsError
            ? "Origin is not allowed"
            : isUploadError
              ? error.message
              : "Internal server error",
    });
});

const start = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is required");
    }
    if (!process.env.TOKENKEY) {
        throw new Error("TOKENKEY is required");
    }

    await dbconnection();
    const port = process.env.PORT || 8000;
    return App.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

if (require.main === module) {
    start().catch((error) => {
        console.error("Backend startup failed:", error.message);
        process.exit(1);
    });
}

module.exports = { App, start };
