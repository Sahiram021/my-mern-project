const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const express = require("express");

const orderModel = require("../App/Models/orderModel");
const orderRoutes = require("../App/Routes/admin/orderRoutes");

const orderId = "507f1f77bcf86cd799439011";
const originalFindByIdAndUpdate = orderModel.findByIdAndUpdate;
const originalFind = orderModel.find;
let server;
let baseUrl;
let lastUpdate;
let storedOrder;

before(async () => {
  storedOrder = { _id: orderId, status: "pending", PaymentStatus: "pending" };
  orderModel.findByIdAndUpdate = async (id, update, options) => {
    lastUpdate = { id, update, options };
    storedOrder = { ...storedOrder, ...update.$set };
    return storedOrder;
  };
  orderModel.find = () => ({ sort: async () => [storedOrder] });

  const app = express();
  app.use(express.json());
  app.use("/api/admin/order", orderRoutes);

  server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/admin/order`;
});

after(async () => {
  orderModel.findByIdAndUpdate = originalFindByIdAndUpdate;
  orderModel.find = originalFind;
  if (server) await new Promise((resolve) => server.close(resolve));
});

test("canonical order status endpoint updates and returns the persisted order", async () => {
  const response = await fetch(`${baseUrl}/${orderId}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "Processing" }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 1);
  assert.equal(body.data.status, "processing");
  assert.equal(lastUpdate.id, orderId);
  assert.deepEqual(lastUpdate.update, { $set: { status: "processing" } });
  assert.equal(lastUpdate.options.runValidators, true);

  const refreshedResponse = await fetch(`${baseUrl}/view`);
  const refreshedBody = await refreshedResponse.json();
  assert.equal(refreshedBody.status, 1);
  assert.equal(refreshedBody.data[0].status, "processing");
});

test("legacy save endpoint remains compatible with previously built admin assets", async () => {
  const response = await fetch(`${baseUrl}/save`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ orderId, status: "success" }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.status, "success");
  assert.equal(body.data.PaymentStatus, "success");
});

test("invalid status is rejected before a database update", async () => {
  lastUpdate = null;
  const response = await fetch(`${baseUrl}/${orderId}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "unknown" }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.status, 0);
  assert.equal(lastUpdate, null);
});
