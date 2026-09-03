import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const accountMenu = readFileSync(
  new URL("../src/app/Components/Common/AccountMenu.jsx", import.meta.url),
  "utf8"
);
const header = readFileSync(
  new URL("../src/app/Components/Common/Header.jsx", import.meta.url),
  "utf8"
);
const proxy = readFileSync(new URL("../src/proxy.js", import.meta.url), "utf8");

const destinations = [
  ["My Profile", "/my-dashboard"],
  ["Change Password", "/change-password"],
  ["Wishlist", "/wishlist"],
  ["Cart", "/cart"],
  ["Checkout", "/checkout"],
  ["Order History", "/order"],
];

test("every account destination uses one shared mobile close handler", () => {
  for (const [label, href] of destinations) {
    assert.match(accountMenu, new RegExp(`href: "${href}", label: "${label}"`));
  }

  assert.match(accountMenu, /onClick=\{mobile \? closeMobileMenu : undefined\}/);
  assert.match(accountMenu, /setMobileMenuOpen\(false\)/);
  assert.match(accountMenu, /document\.body\.style\.removeProperty\("overflow"\)/);
});

test("mobile menu is controlled, reopenable, and collapses on route history changes", () => {
  assert.match(accountMenu, /useState\(false\)/);
  assert.match(accountMenu, /aria-controls="mobile-account-menu"/);
  assert.match(accountMenu, /aria-expanded=\{mobileMenuOpen\}/);
  assert.match(accountMenu, /setMobileMenuOpen\(\(open\) => !open\)/);
  assert.match(accountMenu, /\{mobileMenuOpen && \(/);
  assert.match(accountMenu, /}, \[pathname\]\);/);

  assert.match(accountMenu, /className="min-w-0 lg:hidden"/);
  assert.match(accountMenu, /hidden h-fit[\s\S]*lg:block/);
  assert.doesNotMatch(accountMenu, /fixed inset-0/);

  for (const width of [320, 360, 375, 390, 414]) {
    assert.ok(width < 1024, `${width}px must use the collapsible mobile menu`);
  }
});

test("header handoff and direct-route protection remain correct", () => {
  assert.match(
    header,
    /href="\/my-dashboard"\s+onClick=\{\(\) => setMobileMenuOpen\(false\)\}/
  );

  for (const protectedRoute of [
    "/my-dashboard",
    "/change-password",
    "/wishlist",
    "/checkout",
  ]) {
    assert.match(proxy, new RegExp(`"${protectedRoute}"`));
  }

  assert.doesNotMatch(proxy, /["']\/cart(?:\/:path\*)?["']/);
});
