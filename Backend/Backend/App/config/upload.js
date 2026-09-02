const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadsRoot = path.resolve(__dirname, "../../Uploads");

const sanitizeFilename = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  const basename = path
    .basename(filename, path.extname(filename))
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${basename || "image"}${extension}`;
};

const createImageUpload = (folder, { maxCount, maxSizeMb = 10 } = {}) => {
  const destination = path.join(uploadsRoot, folder);
  fs.mkdirSync(destination, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, destination),
    filename: (_req, file, callback) => {
      const unique = crypto.randomBytes(4).toString("hex");
      callback(null, `${Date.now()}-${unique}-${sanitizeFilename(file.originalname)}`);
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: maxSizeMb * 1024 * 1024,
      ...(maxCount ? { files: maxCount } : {}),
    },
    fileFilter: (_req, file, callback) => {
      if (!file.mimetype?.startsWith("image/")) {
        return callback(new Error("Only image uploads are allowed"));
      }
      return callback(null, true);
    },
  });
};

const removeUploadedFiles = (req) => {
  const files = [
    ...(req.file ? [req.file] : []),
    ...Object.values(req.files || {}).flat(),
  ];

  files.forEach((file) => {
    const resolvedPath = path.resolve(file.path || "");
    if (resolvedPath.startsWith(`${uploadsRoot}${path.sep}`)) {
      fs.unlink(resolvedPath, () => {});
    }
  });
};

module.exports = { createImageUpload, removeUploadedFiles, uploadsRoot };
