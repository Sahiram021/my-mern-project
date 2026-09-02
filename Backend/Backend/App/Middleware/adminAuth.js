const jwt = require("jsonwebtoken");
const adminModel = require("../Models/adminModel");

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).send({
      status: 0,
      message: "Authorization token required",
    });
  }

  if (!process.env.TOKENKEY) {
    return res.status(500).send({
      status: 0,
      message: "Server authentication is not configured",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKENKEY);
    const admin = await adminModel.findById(decoded.id).select("_id email");

    if (!admin) {
      return res.status(401).send({ status: 0, message: "Admin account not found" });
    }

    req.admin = admin;
    return next();
  } catch (_error) {
    return res.status(401).send({ status: 0, message: "Invalid or expired token" });
  }
};

module.exports = verifyAdmin;
