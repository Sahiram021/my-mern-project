const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const mongoose = require("mongoose");

const categoryModel = require("../App/Models/categoryModel");
const productModel = require("../App/Models/productModel");
const subcategoryModel = require("../App/Models/subcategoryModel");
const subSubcategoryModel = require("../App/Models/subSubcategoryModel");
const {
  exactNameQuery,
  isValidObjectId,
  normalizeText,
  toIdArray,
  toNumber,
} = require("../App/config/controllerUtils");
const { uploadsRoot } = require("../App/config/upload");

test("controller utilities normalize form values safely", () => {
  assert.equal(normalizeText("  Calcium Powder  "), "Calcium Powder");
  assert.equal(toNumber("125.50"), 125.5);
  assert.equal(toNumber("invalid", 7), 7);
  assert.deepEqual(toIdArray([" id-1 ", "", null]), ["id-1"]);
  assert.equal(isValidObjectId(new mongoose.Types.ObjectId().toString()), true);
  assert.equal(isValidObjectId("not-an-object-id"), false);
  assert.equal(exactNameQuery("Calcium (Fine)").name.$regex.test("calcium (fine)"), true);
});

test("uploads use the Linux-safe canonical Uploads directory", () => {
  assert.equal(path.basename(uploadsRoot), "Uploads");
  assert.equal(path.basename(path.dirname(uploadsRoot)), "Backend");
});

test("category hierarchy and product schemas enforce required relationships", async () => {
  const objectId = new mongoose.Types.ObjectId();
  const validationError = async (document) => {
    try {
      await document.validate();
      return null;
    } catch (error) {
      return error;
    }
  };

  const categoryError = await validationError(
    new categoryModel({ slug: "test", image: "test.jpg" })
  );
  assert.ok(categoryError.errors.name);

  const subcategoryError = await validationError(
    new subcategoryModel({
      name: "Test Subcategory",
      slug: "test-subcategory",
      image: "test.jpg",
    })
  );
  assert.ok(subcategoryError.errors.parentCategory);

  const subSubcategoryError = await validationError(
    new subSubcategoryModel({
      name: "Test Grade",
      slug: "test-grade",
      image: "test.jpg",
      parentCategory: objectId,
    })
  );
  assert.ok(subSubcategoryError.errors.subcategory);

  const productError = await validationError(
    new productModel({
      name: "Test Product",
      slug: "test-product",
      image: "test.jpg",
      price: -1,
      parentCategory: objectId,
      subcategory: objectId,
    })
  );
  assert.ok(productError.errors.price);

  const validProduct = new productModel({
    name: "Test Product",
    slug: "test-product",
    image: "test.jpg",
    price: 0,
    parentCategory: objectId,
    subcategory: objectId,
  });
  await assert.doesNotReject(validProduct.validate());
});
