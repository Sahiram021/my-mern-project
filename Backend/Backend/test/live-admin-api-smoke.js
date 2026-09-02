const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });

const baseUrl = (process.env.API_SMOKE_BASE_URL || "http://127.0.0.1:8000/api/admin/")
  .replace(/\/?$/, "/");
const allowedPaymentStatuses = new Set(["pending", "success", "cancelled"]);
const allowWrites = process.env.API_SMOKE_ALLOW_WRITES === "1";
let token = "";
let categoryId = "";
let categoryImage = "";
let productId = "";
let productImage = "";
let orderSnapshot = null;
let orderChanged = false;

const parseResponse = async (response) => {
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`API returned non-JSON content (HTTP ${response.status})`);
  }
  if (!response.ok || !body.status) {
    const detail = body.message || Object.values(body.error || {})[0] || `HTTP ${response.status}`;
    throw new Error(String(detail));
  }
  return body;
};

const request = (endpoint, options = {}) =>
  fetch(new URL(endpoint, baseUrl), {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  }).then(parseResponse);

const removeTemporaryImage = () => {
  if (!categoryImage || path.basename(categoryImage) !== categoryImage) return;
  const imagePath = path.resolve(__dirname, "../Uploads/category", categoryImage);
  const categoryUploadRoot = path.resolve(__dirname, "../Uploads/category");
  if (path.dirname(imagePath) === categoryUploadRoot && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

const removeTemporaryProductImage = () => {
  if (!productImage || path.basename(productImage) !== productImage) return;
  const imagePath = path.resolve(__dirname, "../Uploads/product", productImage);
  const productUploadRoot = path.resolve(__dirname, "../Uploads/product");
  if (path.dirname(imagePath) === productUploadRoot && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

const restoreOrder = async () => {
  if (!orderChanged || !orderSnapshot) return;
  const restoreBody = { status: orderSnapshot.status };
  if (allowedPaymentStatuses.has(orderSnapshot.PaymentStatus)) {
    restoreBody.PaymentStatus = orderSnapshot.PaymentStatus;
  }
  const restored = await request(`order/${orderSnapshot._id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(restoreBody),
  });
  assert.equal(restored.data.status, orderSnapshot.status);
  orderChanged = false;
};

const cleanupCategory = async () => {
  if (categoryId) {
    await request(`category/delete/${categoryId}`, { method: "DELETE" });
    categoryId = "";
  }
  removeTemporaryImage();
};

const cleanupProduct = async () => {
  if (productId) {
    await request(`product/delete/${productId}`, { method: "DELETE" });
    productId = "";
  }
  removeTemporaryProductImage();
};

async function run() {
  assert.ok(process.env.ADMINEMAIL, "ADMINEMAIL is required in the backend .env");
  assert.ok(process.env.ADMINPASSWORD, "ADMINPASSWORD is required in the backend .env");

  const login = await request("adminauth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: process.env.ADMINEMAIL, password: process.env.ADMINPASSWORD }),
  });
  token = login.token;
  assert.ok(token, "Admin login did not return a token");

  const baselineCategories = await request("category/view");
  const sliders = await request("slider/view");
  assert.ok(sliders.data.length >= 2, "Expected at least two configured sliders");
  for (const slider of sliders.data) {
    const imageResponse = await fetch(new URL(slider.image, sliders.staticPath));
    assert.ok(imageResponse.ok, `Slider image is unavailable (HTTP ${imageResponse.status})`);
    assert.match(imageResponse.headers.get("content-type") || "", /^image\//);
  }

  const orders = await request("order/view");
  if (!allowWrites) {
    console.log(JSON.stringify({
      login: "passed",
      categoryList: `passed (${baselineCategories.data.length})`,
      sliderImagesChecked: sliders.data.length,
      orderList: `passed (${orders.data.length})`,
      mode: "read-only",
    }, null, 2));
    return;
  }

  const marker = `Codex API Smoke ${Date.now()}`;

  const parents = await request("product/parent");
  let hierarchy = null;
  for (const parent of parents.data) {
    const subcategories = await request(`product/subcategory/${parent._id}`);
    if (subcategories.data.length) {
      const subcategory = subcategories.data[0];
      const children = await request(`product/subsubcategory/${subcategory._id}`);
      hierarchy = {
        parentCategory: parent._id,
        subcategory: subcategory._id,
        subsubcategory: children.data[0]?._id || "",
      };
      break;
    }
  }
  assert.ok(hierarchy, "A category/subcategory hierarchy is required for the product smoke test");

  const productSlug = `codex-api-smoke-${Date.now()}`;
  const productForm = new FormData();
  productForm.append("name", `${marker} Product`);
  productForm.append("slug", productSlug);
  productForm.append("parentCategory", hierarchy.parentCategory);
  productForm.append("subcategory", hierarchy.subcategory);
  if (hierarchy.subsubcategory) {
    productForm.append("subsubcategory", hierarchy.subsubcategory);
  }
  productForm.append("productType", "New");
  productForm.append("price", "1");
  productForm.append("order", "9999");
  productForm.append("sortDescription", "Temporary production deployment verification product");
  productForm.append(
    "image",
    new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64")], { type: "image/png" }),
    "codex-product-smoke.png"
  );
  const createdProduct = await request("product/create", { method: "POST", body: productForm });
  productId = createdProduct.data._id;
  productImage = createdProduct.data.image;

  const productDetail = await request(`product/details/${productId}`);
  assert.equal(productDetail.data.slug, productSlug);
  const products = await request("product/view");
  assert.ok(products.data.some((product) => product._id === productId));
  const productImageResponse = await fetch(new URL(productImage, products.staticPath));
  assert.ok(productImageResponse.ok, `Product image is unavailable (HTTP ${productImageResponse.status})`);
  assert.match(productImageResponse.headers.get("content-type") || "", /^image\//);

  const websiteProductResponse = await fetch(
    new URL(`../web/products/${productSlug}`, baseUrl)
  );
  assert.ok(websiteProductResponse.ok, `Website product API failed (HTTP ${websiteProductResponse.status})`);
  const websiteProduct = await websiteProductResponse.json();
  assert.equal(websiteProduct.product?._id, productId);

  await cleanupProduct();

  const createForm = new FormData();
  createForm.append("name", marker);
  createForm.append("order", "9999");
  createForm.append(
    "image",
    new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64")], { type: "image/png" }),
    "codex-api-smoke.png"
  );
  const created = await request("category/create", { method: "POST", body: createForm });
  categoryId = created.data._id;
  categoryImage = created.data.image;
  assert.equal(created.data.name, marker);

  const detail = await request(`category/get-detail/${categoryId}`);
  assert.equal(detail.data.name, marker);

  const updatedName = `${marker} Updated`;
  const updateForm = new FormData();
  updateForm.append("name", updatedName);
  updateForm.append("order", "9998");
  const updated = await request(`category/update/${categoryId}`, { method: "PUT", body: updateForm });
  assert.equal(updated.data.name, updatedName);

  const categories = await request("category/view");
  assert.ok(categories.data.some((category) => category._id === categoryId && category.name === updatedName));

  if (orders.data.length) {
    orderSnapshot = {
      _id: orders.data[0]._id,
      status: orders.data[0].status || "pending",
      PaymentStatus: orders.data[0].PaymentStatus,
    };
    const temporaryStatus = orderSnapshot.status === "processing" ? "pending" : "processing";
    const changed = await request(`order/${orderSnapshot._id}/status`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: temporaryStatus }),
    });
    orderChanged = true;
    assert.equal(changed.data.status, temporaryStatus);

    const refreshed = await request("order/view");
    const persisted = refreshed.data.find((order) => order._id === orderSnapshot._id);
    assert.equal(persisted.status, temporaryStatus);
    await restoreOrder();
  }

  await cleanupCategory();
  console.log(JSON.stringify({
    login: "passed",
    categoryCreateReadUpdateDelete: "passed",
    productCreateListImageWebsiteReadDelete: "passed",
    sliderImagesChecked: sliders.data.length,
    orderUpdateRefreshRestore: orders.data.length ? "passed" : "skipped (no orders)",
    temporaryDataRemoved: true,
  }, null, 2));
}

run().catch(async (error) => {
  try {
    await restoreOrder();
  } catch (restoreError) {
    console.error(`CRITICAL: order restore failed: ${restoreError.message}`);
  }
  try {
    await cleanupProduct();
  } catch (cleanupError) {
    console.error(`Temporary product cleanup failed: ${cleanupError.message}`);
  }
  try {
    await cleanupCategory();
  } catch (cleanupError) {
    console.error(`Temporary category cleanup failed: ${cleanupError.message}`);
  }
  console.error(`Live API smoke test failed: ${error.message}`);
  process.exitCode = 1;
});
