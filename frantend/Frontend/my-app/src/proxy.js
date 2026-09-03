import { NextResponse } from "next/server";
import { products as fallbackProducts } from "./app/data/products";

const protectedRoutes = [
  "/my-dashboard",
  "/change-password",
  "/checkout",
  "/wishlist",
];

const localProductSlugs = new Set(
  fallbackProducts.map((product) => product.slug).filter(Boolean)
);
const localCategorySlugs = new Set(
  fallbackProducts.map((product) => product.categorySlug).filter(Boolean)
);
const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL || "https://jgbmtrading.online/api/web/"
).replace(/\/?$/, "/");

function getSlug(pathname, prefix) {
  if (!pathname.startsWith(prefix)) return null;
  try {
    return decodeURIComponent(pathname.slice(prefix.length)).toLowerCase().trim();
  } catch {
    return "";
  }
}

async function catalogPathExists(path) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function notFoundResponse(request) {
  const notFoundUrl = request.nextUrl.clone();
  notFoundUrl.pathname = "/_not-found";
  return NextResponse.rewrite(notFoundUrl, {
    status: 404,
    headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" },
  });
}

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login-register", request.url));
  }

  const productSlug = getSlug(pathname, "/product-details/");
  if (productSlug && !localProductSlugs.has(productSlug)) {
    const exists = await catalogPathExists(`products/${encodeURIComponent(productSlug)}`);
    if (!exists) return notFoundResponse(request);
  }

  const categorySlug = getSlug(pathname, "/categories/");
  if (categorySlug && !localCategorySlugs.has(categorySlug)) {
    const exists = await catalogPathExists(
      `category-products/${encodeURIComponent(categorySlug)}`
    );
    if (!exists) return notFoundResponse(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/my-dashboard/:path*",
    "/change-password/:path*",
    "/checkout/:path*",
    "/wishlist/:path*",
    "/product-details/:path*",
    "/categories/:path*",
  ],
};
