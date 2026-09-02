const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { after, before, test } = require("node:test");
const express = require("express");
const jwt = require("jsonwebtoken");

const categoryModel = require("../App/Models/categoryModel");
const adminModel = require("../App/Models/adminModel");
const productModel = require("../App/Models/productModel");
const subcategoryModel = require("../App/Models/subcategoryModel");
const subSubcategoryModel = require("../App/Models/subSubcategoryModel");
const verifyAdmin = require("../App/Middleware/adminAuth");
const categoryRoutes = require("../App/Routes/admin/categoryRoutes");

const categoryId = "507f1f77bcf86cd799439011";
const adminId = "507f1f77bcf86cd799439012";
const originals = {};
let category = null;
let uploadedFilename = "";
let server;
let baseUrl;
let token;

before(async () => {
  process.env.TOKENKEY = "category-api-test-secret";
  token = jwt.sign({ id: adminId }, process.env.TOKENKEY);

  for (const [model, methods] of [
    [adminModel, ["findById"]],
    [categoryModel, ["findOne", "create", "findById", "findByIdAndUpdate", "find", "deleteOne"]],
    [productModel, ["countDocuments"]],
    [subcategoryModel, ["countDocuments"]],
    [subSubcategoryModel, ["countDocuments"]],
  ]) {
    for (const method of methods) {
      originals[`${model.modelName}.${method}`] = model[method];
    }
  }

  categoryModel.findOne = async () => null;
  adminModel.findById = () => ({ select: async () => ({ _id: adminId, email: "test@example.com" }) });
  categoryModel.create = async (data) => {
    category = { _id: categoryId, status: true, ...data };
    uploadedFilename = data.image;
    return category;
  };
  categoryModel.findById = () => ({ select: async () => category });
  categoryModel.findByIdAndUpdate = async (_id, update) => {
    if (!category) return null;
    category = { ...category, ...update };
    return category;
  };
  categoryModel.find = () => ({ sort: async () => (category ? [category] : []) });
  categoryModel.deleteOne = async () => {
    const deletedCount = category ? 1 : 0;
    category = null;
    return { acknowledged: true, deletedCount };
  };
  productModel.countDocuments = async () => 0;
  subcategoryModel.countDocuments = async () => 0;
  subSubcategoryModel.countDocuments = async () => 0;

  const app = express();
  app.use(express.json());
  app.use("/api/admin/category", verifyAdmin, categoryRoutes);
  app.use((error, _req, res, _next) => {
    res.status(400).send({ status: 0, message: error.message });
  });
  server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/admin/category`;
});

after(async () => {
  adminModel.findById = originals["admin.findById"];
  categoryModel.findOne = originals["category.findOne"];
  categoryModel.create = originals["category.create"];
  categoryModel.findById = originals["category.findById"];
  categoryModel.findByIdAndUpdate = originals["category.findByIdAndUpdate"];
  categoryModel.find = originals["category.find"];
  categoryModel.deleteOne = originals["category.deleteOne"];
  productModel.countDocuments = originals["product.countDocuments"];
  subcategoryModel.countDocuments = originals["subcategory.countDocuments"];
  subSubcategoryModel.countDocuments = originals["subsubcategory.countDocuments"];

  if (server) await new Promise((resolve) => server.close(resolve));
  if (uploadedFilename && path.basename(uploadedFilename) === uploadedFilename) {
    const uploadedPath = path.resolve(__dirname, "../Uploads/category", uploadedFilename);
    if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
  }
});

const authHeaders = () => ({ Authorization: `Bearer ${token}` });

test("category API rejects an unauthenticated create request", async () => {
  const response = await fetch(`${baseUrl}/create`, { method: "POST" });
  assert.equal(response.status, 401);
});

test("category API creates, reads, updates, lists, and deletes multipart data", async () => {
  const createForm = new FormData();
  createForm.append("name", "Calcium Test Category");
  createForm.append("order", "3");
  createForm.append(
    "image",
    new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64")], { type: "image/png" }),
    "category-test.png"
  );
  const createResponse = await fetch(`${baseUrl}/create`, {
    method: "POST",
    headers: authHeaders(),
    body: createForm,
  });
  const created = await createResponse.json();
  assert.equal(createResponse.status, 201);
  assert.equal(created.status, 1);
  assert.equal(created.data.name, "Calcium Test Category");
  assert.equal(created.data.slug, "calcium-test-category");
  assert.ok(fs.existsSync(path.resolve(__dirname, "../Uploads/category", created.data.image)));

  const detailResponse = await fetch(`${baseUrl}/get-detail/${categoryId}`, { headers: authHeaders() });
  const detail = await detailResponse.json();
  assert.equal(detail.status, 1);
  assert.equal(detail.data._id, categoryId);

  const updateForm = new FormData();
  updateForm.append("name", "Updated Calcium Category");
  updateForm.append("order", "4");
  const updateResponse = await fetch(`${baseUrl}/update/${categoryId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: updateForm,
  });
  const updated = await updateResponse.json();
  assert.equal(updated.status, 1);
  assert.equal(updated.data.name, "Updated Calcium Category");
  assert.equal(updated.data.slug, "updated-calcium-category");

  const listResponse = await fetch(`${baseUrl}/view`, { headers: authHeaders() });
  const list = await listResponse.json();
  assert.equal(list.status, 1);
  assert.equal(list.data[0].name, "Updated Calcium Category");

  const deleteResponse = await fetch(`${baseUrl}/delete/${categoryId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const deleted = await deleteResponse.json();
  assert.equal(deleted.status, 1);
  assert.equal(deleted.delRes.deletedCount, 1);
});
