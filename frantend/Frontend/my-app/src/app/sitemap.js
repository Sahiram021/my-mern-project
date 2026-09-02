import { products as fallbackProducts } from "./data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jgbmtrading.online";
const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL || `${siteUrl}/api/web/`
).replace(/\/?$/, "/");

export const revalidate = 3600;

function cleanSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function validDate(value, fallback) {
  const date = value ? new Date(value) : fallback;
  return Number.isNaN(date.getTime()) ? fallback : date;
}

async function fetchJson(path) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}

function flattenCategories(categories) {
  const rows = [];
  for (const category of Array.isArray(categories) ? categories : []) {
    rows.push(category);
    for (const subcategory of category.subcategories || []) {
      rows.push(subcategory);
      rows.push(...(subcategory.subSubcategories || []));
    }
  }
  return rows;
}

export default async function sitemap() {
  const generatedAt = new Date();
  const [productResponse, menuResponse] = await Promise.all([
    fetchJson("products/search?search="),
    fetchJson("mega-menu"),
  ]);

  const products = [
    ...fallbackProducts,
    ...(Array.isArray(productResponse?.products)
      ? productResponse.products
      : Array.isArray(productResponse?.data)
        ? productResponse.data
        : []),
  ];
  const categoryRows = [
    ...flattenCategories(menuResponse?.data),
    ...fallbackProducts.map((product) => ({
      slug: product.categorySlug,
      updatedAt: product.updatedAt,
    })),
  ];

  const entries = new Map();
  const addEntry = (path, options) => {
    const url = `${siteUrl}${path}`;
    if (!entries.has(url)) entries.set(url, { url, ...options });
  };

  addEntry("/", {
    lastModified: generatedAt,
    changeFrequency: "daily",
    priority: 1,
  });
  addEntry("/ready-to-ship", {
    lastModified: generatedAt,
    changeFrequency: "daily",
    priority: 0.9,
  });
  for (const path of ["/about-us", "/contact-us", "/frequently-questions"]) {
    addEntry(path, {
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const category of categoryRows) {
    const slug = cleanSlug(category.slug);
    if (!slug) continue;
    addEntry(`/categories/${slug}`, {
      lastModified: validDate(category.updatedAt, generatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const product of products) {
    const slug = cleanSlug(product.slug);
    if (!slug) continue;
    addEntry(`/product-details/${slug}`, {
      lastModified: validDate(product.updatedAt, generatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
      images: product.image
        ? [new URL(product.image, siteUrl).toString()]
        : undefined,
    });
  }

  return [...entries.values()];
}
