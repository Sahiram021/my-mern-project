const mongoose = require("mongoose");

const normalizeText = (value) => String(value ?? "").trim();

const normalizeId = (value) => {
  const id = normalizeText(value);
  return id || undefined;
};

const toNumber = (value, fallback = 0) => {
  if (value === "" || value === null || value === undefined) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const toIdArray = (value) => {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.map(normalizeId).filter(Boolean);
};

const isValidObjectId = (value) =>
  Boolean(value) && mongoose.Types.ObjectId.isValid(String(value));

const escapeRegex = (value) =>
  normalizeText(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const exactNameQuery = (name) => ({
  name: { $regex: new RegExp(`^${escapeRegex(name)}$`, "i") },
});

const getErrorDetails = (error) => {
  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || "name";
    return { [field]: `${field} already exists` };
  }

  if (error?.errors) {
    return Object.fromEntries(
      Object.entries(error.errors).map(([key, value]) => [key, value.message])
    );
  }

  return { message: error?.message || "Unexpected server error" };
};

const getUploadStaticPath = (req, folder, configuredPath) => {
  const host = normalizeText(req?.get?.("host"));
  const isLocalRequest = /^(localhost|127\.0\.0\.1|\[?::1\]?)(:\d+)?$/i.test(host);

  if (host && (isLocalRequest || !normalizeText(configuredPath))) {
    return `${req.protocol}://${host}/uploads/${folder}/`;
  }

  const normalizedConfiguredPath = normalizeText(configuredPath);
  if (normalizedConfiguredPath) {
    return normalizedConfiguredPath.endsWith("/")
      ? normalizedConfiguredPath
      : `${normalizedConfiguredPath}/`;
  }

  return `/uploads/${folder}/`;
};

module.exports = {
  exactNameQuery,
  escapeRegex,
  getErrorDetails,
  getUploadStaticPath,
  isValidObjectId,
  normalizeId,
  normalizeText,
  toIdArray,
  toNumber,
};
