export const CART_KEY = "jgb-cart";
export const WISHLIST_KEY = "jgb-wishlist";
export const USER_KEY = "jgb-user";
export const USERS_KEY = "jgb-users";
export const ORDER_KEY = "jgb-last-order";
export const LOGIN_REDIRECT_KEY = "jgb-login-redirect";
export const STORE_EVENT = "jgb-store-updated";

function read(key) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(STORE_EVENT));
}

export function rupeeToNumber(price) {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

export function formatRupees(value) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

export function getCart() {
  return read(CART_KEY);
}

export function getWishlist() {
  return read(WISHLIST_KEY);
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.slug === product.slug);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  write(CART_KEY, cart);
  return cart;
}

export function updateCartQty(slug, qty) {
  const cart = getCart()
    .map((item) => (item.slug === slug ? { ...item, qty: Math.max(1, qty) } : item))
    .filter((item) => item.qty > 0);

  write(CART_KEY, cart);
  return cart;
}

export function removeFromCart(slug) {
  const cart = getCart().filter((item) => item.slug !== slug);
  write(CART_KEY, cart);
  return cart;
}

export function toggleWishlist(product) {
  const wishlist = getWishlist();
  const exists = wishlist.some((item) => item.slug === product.slug);
  const next = exists
    ? wishlist.filter((item) => item.slug !== product.slug)
    : [...wishlist, product];

  write(WISHLIST_KEY, next);
  return next;
}

export function removeFromWishlist(slug) {
  const wishlist = getWishlist().filter((item) => item.slug !== slug);
  write(WISHLIST_KEY, wishlist);
  return wishlist;
}

export function saveUser(user) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(STORE_EVENT));
}

export function registerUser(form) {
  const users = read(USERS_KEY);
  const email = String(form.email || "").trim().toLowerCase();
  const phone = String(form.phone || "").trim();
  const name = String(form.name || "").trim();
  const password = String(form.password || "");

  if (!name || !email || !phone || !password) {
    return { ok: false, message: "Please saari details fill karo." };
  }

  const alreadyExists = users.some((user) => user.email === email || user.phone === phone);

  if (alreadyExists) {
    return { ok: false, message: "Is email ya mobile number se account already registered hai." };
  }

  const user = {
    name,
    email,
    phone,
    password,
    registeredAt: new Date().toISOString(),
  };

  write(USERS_KEY, [...users, user]);
  saveUser({
    name: user.name,
    email: user.email,
    phone: user.phone,
    loggedInAt: new Date().toISOString(),
  });

  return { ok: true, user };
}

export function loginUser(form) {
  const users = read(USERS_KEY);
  const email = String(form.email || "").trim().toLowerCase();
  const password = String(form.password || "");
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return { ok: false, message: "Email ya password galat hai." };
  }

  saveUser({
    name: user.name,
    email: user.email,
    phone: user.phone,
    loggedInAt: new Date().toISOString(),
  });

  return { ok: true, user };
}

export function setLoginRedirect(path) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOGIN_REDIRECT_KEY, path);
}

export function consumeLoginRedirect() {
  if (typeof window === "undefined") {
    return "/my-dashboard";
  }

  const redirect = window.localStorage.getItem(LOGIN_REDIRECT_KEY) || "/my-dashboard";
  window.localStorage.removeItem(LOGIN_REDIRECT_KEY);
  return redirect;
}

export function getUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function saveOrder(order) {
  window.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  window.dispatchEvent(new Event(STORE_EVENT));
}

export function getOrder() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(ORDER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function clearCart() {
  write(CART_KEY, []);
}
