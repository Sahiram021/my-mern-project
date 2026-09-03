import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const storage = new Map();
const cookieJar = new Map();

globalThis.window = {
  location: { protocol: "https:" },
  localStorage: {
    getItem(key) {
      return storage.get(key) ?? null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    },
  },
};

globalThis.document = {};
Object.defineProperty(globalThis.document, "cookie", {
  configurable: true,
  get() {
    return [...cookieJar.entries()]
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");
  },
  set(value) {
    const [pair] = String(value).split(";");
    const separator = pair.indexOf("=");
    const key = pair.slice(0, separator);
    const nextValue = pair.slice(separator + 1);
    if (nextValue) cookieJar.set(key, nextValue);
    else cookieJar.delete(key);
  },
});

const axios = (await import("axios")).default;
const { configureStore } = await import("@reduxjs/toolkit");
const { clearAuthToken, getAuthToken, setAuthToken } = await import(
  "../src/app/utils/authToken.js"
);
const {
  default: cartReducer,
  deleteCartItem,
  fetchCartById,
  updateCartQuantity,
} = await import("../src/app/slice/cartSLise.js");

test("auth token is shared by localStorage, API calls, and server-readable cookie", () => {
  clearAuthToken();
  storage.set("token", "legacy-local-token");

  assert.equal(getAuthToken(), "legacy-local-token");
  assert.match(document.cookie, /token=legacy-local-token/);

  setAuthToken("current-token");
  assert.equal(storage.get("token"), "current-token");
  assert.equal(getAuthToken(), "current-token");
});

test("cart fetch is deduplicated, survives failure, updates totals, and removes items", async () => {
  setAuthToken("cart-test-token");

  const store = configureStore({
    reducer: { cartStore: cartReducer },
  });
  const initialItems = [
    {
      _id: "cart-1",
      productId: "product-1",
      name: "Calcium Powder",
      image: "calcium.jpg",
      price: 1850,
      qty: 2,
    },
  ];

  let fetchCalls = 0;
  let releaseFetch;
  let requestedUrl = "";
  axios.get = async (url) => {
    fetchCalls += 1;
    requestedUrl = url;
    await new Promise((resolve) => {
      releaseFetch = resolve;
    });
    return { data: { status: 1, data: initialItems } };
  };

  const firstFetch = store.dispatch(fetchCartById());
  const duplicateFetch = store.dispatch(fetchCartById());
  await duplicateFetch;
  releaseFetch();
  await firstFetch;

  assert.equal(fetchCalls, 1);
  assert.match(requestedUrl, /\/api\/web\/cart\/view-cart$/);
  assert.equal(store.getState().cartStore.cart.length, 1);
  assert.equal(store.getState().cartStore.status, "succeeded");

  axios.get = async () => ({
    data: {
      status: 1,
      data: [
        ...initialItems,
        {
          _id: "cart-2",
          productId: "product-2",
          name: "Anti Moisture Powder",
          image: "anti-moisture.jpg",
          price: 500,
          qty: 1,
        },
      ],
    },
  });
  await store.dispatch(fetchCartById());
  assert.equal(store.getState().cartStore.cart.length, 2);

  axios.get = async () => ({
    data: { status: 0, message: "Temporary cart service failure" },
  });
  await store.dispatch(fetchCartById());

  assert.equal(store.getState().cartStore.status, "failed");
  assert.equal(store.getState().cartStore.cart.length, 2);

  axios.put = async (_url, body) => ({
    data: { status: 1, message: `Quantity changed to ${body.qty}` },
  });
  await store.dispatch(updateCartQuantity({ id: "cart-1", qty: 3 }));

  const updatedCart = store.getState().cartStore.cart;
  const updatedTotal = updatedCart.reduce(
    (total, item) => total + Number(item.price) * Number(item.qty),
    0
  );
  assert.equal(updatedCart[0].qty, 3);
  assert.equal(updatedTotal, 6050);
  assert.equal(store.getState().cartStore.error, null);

  axios.delete = async () => ({
    data: { status: 1, message: "Item removed" },
  });
  await store.dispatch(deleteCartItem("cart-1"));
  assert.equal(store.getState().cartStore.cart.length, 1);
  await store.dispatch(deleteCartItem("cart-2"));
  assert.deepEqual(store.getState().cartStore.cart, []);
});

test("cart route and responsive layout invariants cover phone through desktop", () => {
  const cartPage = readFileSync(
    new URL("../src/app/cart/page.js", import.meta.url),
    "utf8"
  );
  const proxy = readFileSync(
    new URL("../src/proxy.js", import.meta.url),
    "utf8"
  );

  for (const width of [320, 360, 375, 390, 414]) {
    assert.ok(width < 1024, `${width}px must use the mobile card layout`);
  }

  assert.match(
    cartPage,
    /className="hidden 2xl:block">\s*<AccountMenu \/>/,
    "The expanded account navigation must not consume space on mobile or standard desktop widths"
  );
  assert.match(cartPage, /space-y-3 p-3 sm:p-4 lg:hidden/);
  assert.match(cartPage, /hidden lg:block/);
  assert.match(cartPage, /xl:grid-cols-\[minmax\(0,1fr\)_300px\]/);
  assert.match(cartPage, /min-h-12 w-full/);
  assert.doesNotMatch(cartPage, /overflow-x-auto/);
  assert.doesNotMatch(proxy, /["']\/cart(?:\/:path\*)?["']/);
});
