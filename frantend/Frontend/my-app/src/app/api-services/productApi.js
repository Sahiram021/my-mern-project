import axios from "axios";
import { products as fallbackProducts } from "../data/products";
import { buildProductImageUrl } from "../utils/imageUrl";

const apibaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/web/";

function parsePrice(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const cleaned = String(value)
    .replace(/^Rs\.?\s*/i, "")
    .replace(/^INR\s*/i, "")
    .replace(/₹/g, "")
    .replace(/,/g, "")
    .trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

function calculateDiscount(price, oldPrice) {
  const p = parsePrice(price);
  const op = parsePrice(oldPrice);
  if (op > p && op > 0) {
    return Math.round(((op - p) / op) * 100);
  }
  return 0;
}

export function normalizeProduct(raw, imageBasePath = "") {
  if (!raw) return null;

  const id = raw._id || raw.id || raw.productId || String(raw.slug || Math.random());
  const name = raw.name || raw.title || "Calcium Powder";
  const rawSlug = raw.slug && !String(raw.slug).match(/^[0-9a-fA-F]{24}$/) ? raw.slug : "";
  const slug =
    rawSlug ||
    name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const price = parsePrice(raw.price);
  let oldPrice = parsePrice(raw.oldPrice || raw.mrp || raw.originalPrice);
  if (!oldPrice || oldPrice <= price) {
    oldPrice = Math.round(price * 1.35);
  }

  const discountPercent =
    raw.discount || calculateDiscount(price, oldPrice) || 25;

  const categoryName =
    raw.parentCategory?.name ||
    raw.category?.name ||
    raw.category ||
    raw.categorySlug ||
    "Calcium Powder";

  const categorySlug =
    raw.parentCategory?.slug ||
    raw.category?.slug ||
    raw.categorySlug ||
    categoryName
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  let size = raw.size || raw.packaging || "25 KG Bag";

  const inStock = raw.inStock !== undefined ? Boolean(raw.inStock) : (raw.stock ?? 10) > 0;
  const badge = raw.badge || "All Grades";

  let image = raw.image || "";
  if (image && imageBasePath && !image.startsWith("http") && !image.startsWith("/")) {
    image = `${imageBasePath.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
  } else {
    image = buildProductImageUrl(image);
  }

  return {
    _id: id,
    id,
    name,
    title: name,
    slug,
    price,
    oldPrice,
    discountPercent,
    badge: raw.badge || raw.grade || "Industrial Grade",
    grade: raw.grade || "Industrial Grade",
    category: categoryName,
    categorySlug,
    size: raw.size || raw.packaging || "25 KG Bag",
    inStock,
    image,
    rating: raw.rating || 4.8,
    reviewsCount: raw.reviewsCount || 24,
    shortDescription:
      raw.sortDescription ||
      raw.shortDescription ||
      raw.description ||
      "Premium Calcium Powder & Moisture Powder with certified purity and consistent mesh size.",
    description:
      raw.longDescription ||
      raw.description ||
      "Supplied by JGB TRADING PRIVATE LIMITED, Raipur. High whiteness, minimal moisture, and consistent chemical properties suitable for plastics, rubber, paint, and masterbatches.",
  };
}

export async function fetchAllProducts() {
  let backendProducts = [];
  let imageBasePath = "";

  try {
    const tabsRes = await axios.get(`${apibaseUrl}home/product-tabs`, { timeout: 3000 });
    if (tabsRes.data && tabsRes.data.data && Array.isArray(tabsRes.data.data) && tabsRes.data.data.length > 0) {
      imageBasePath = tabsRes.data.staticPath || "";
      backendProducts = tabsRes.data.data;
    }
  } catch (e) {
  }

  if (!backendProducts.length) {
    try {
      const searchRes = await axios.get(`${apibaseUrl}products/search?search=`, { timeout: 3000 });
      if (searchRes.data?.products && Array.isArray(searchRes.data.products) && searchRes.data.products.length > 0) {
        backendProducts = searchRes.data.products;
      }
    } catch (e) {
    }
  }

  const combined = [];
  const seenSlugs = new Set();

  // 1. Standard verified catalog products first
  if (Array.isArray(fallbackProducts)) {
    fallbackProducts.forEach((item) => {
      const normalized = normalizeProduct(item);
      if (normalized && !seenSlugs.has(normalized.slug)) {
        seenSlugs.add(normalized.slug);
        combined.push(normalized);
      }
    });
  }

  // 2. Any additional custom backend products
  if (Array.isArray(backendProducts) && backendProducts.length > 0) {
    backendProducts.forEach((item) => {
      const normalized = normalizeProduct(item, imageBasePath);
      if (normalized && !seenSlugs.has(normalized.slug)) {
        seenSlugs.add(normalized.slug);
        combined.push(normalized);
      }
    });
  }

  return combined;
}

export async function fetchCategoriesList() {
  try {
    const res = await axios.get(`${apibaseUrl}mega-menu`, { timeout: 4000 });
    if (res.data?.status || res.data?.success) {
      const list = res.data?.data || res.data?.categories || [];
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (e) {
  }

  return [
    { _id: "c1", name: "Calcium Powder", slug: "calcium-powder" },
    { _id: "c2", name: "Anti Moisture Powder", slug: "anti-moisture-powder" },
    { _id: "c3", name: "Calcite Lumps", slug: "calcite-lumps" },
    { _id: "c4", name: "Talc Powder", slug: "talc-powder" },
    { _id: "c5", name: "Dolomite Powder", slug: "dolomite-powder" },
    { _id: "c6", name: "Limestone Powder", slug: "limestone-powder" },
  ];
}

