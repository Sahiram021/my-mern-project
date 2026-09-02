import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "../../Components/Product-Components/ProductGrid";
import { buildProductImageUrl } from "../../utils/imageUrl";
import { products as fallbackProducts } from "../../data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jgbmtrading.online";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/?$/, "/");

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return [
    ...new Set(fallbackProducts.map((product) => product.categorySlug).filter(Boolean)),
  ].map((slug) => ({ slug }));
}

function titleFromSlug(slug) {
  return String(slug || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getFallbackCategory(slug) {
  const normalizedSlug = String(slug || "").toLowerCase();
  const products = fallbackProducts.filter(
    (product) => String(product.categorySlug || "").toLowerCase() === normalizedSlug
  );

  return {
    found: products.length > 0,
    title: products[0]?.category || titleFromSlug(slug),
    products,
  };
}

const getCategoryProducts = cache(async (slug) => {
  const fallback = getFallbackCategory(slug);
  if (!apiBaseUrl) return fallback;

  try {
    const response = await fetch(
      `${apiBaseUrl}category-products/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) return fallback;

    const data = await response.json();
    const products = data.products || data.data?.products || data.data || [];
    const imageBaseUrl =
      data.base_url ||
      data.staticPath ||
      data.imagePath ||
      data.data?.base_url ||
      data.data?.staticPath ||
      data.data?.imagePath ||
      "";

    return {
      found: true,
      title: data.category?.name || data.data?.category?.name || data.name || fallback.title,
      products: Array.isArray(products)
        ? products.map((product) => ({
            ...product,
            image: buildProductImageUrl(product.image, imageBaseUrl),
          }))
        : [],
    };
  } catch {
    return fallback;
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryData = await getCategoryProducts(slug);
  const title = categoryData.title || titleFromSlug(slug);
  const canonicalPath = `/categories/${encodeURIComponent(slug)}`;

  if (!categoryData.found) {
    notFound();
  }

  return {
    title: `${title} Mineral Products`,
    description: `Browse ${title} mineral and powder products supplied by JGB Trading Private Limited in Raipur.`,
    alternates: { canonical: canonicalPath },
    openGraph: {
      url: canonicalPath,
      title: `${title} Mineral Products | JGB Trading`,
      description: `View available ${title} grades and request a quotation from JGB Trading.`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const categoryData = await getCategoryProducts(slug);

  if (!categoryData.found) notFound();

  const categoryProducts =
    categoryData.products.length > 0
      ? categoryData.products
      : getFallbackCategory(slug).products;
  const title = categoryData.title || titleFromSlug(slug);
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${title} Mineral Products`,
    url: `${siteUrl}/categories/${encodeURIComponent(slug)}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categoryProducts.length,
      itemListElement: categoryProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name || product.title,
        url: `${siteUrl}/product-details/${encodeURIComponent(product.slug)}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema).replace(/</g, "\\u003c"),
        }}
      />
      <section className="border-b border-slate-200 bg-[#f8fafc] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-xs text-slate-500">
            <Link href="/" className="transition hover:text-[#0b4ba2]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-[#0f2b5c]">{title}</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold text-[#0f2b5c] md:text-4xl">
            {title}
          </h1>

          <p className="mt-2 text-xs text-slate-500">
            {categoryProducts.length}{" "}
            {categoryProducts.length === 1 ? "mineral product" : "mineral products"}{" "}
            available in catalog
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <ProductGrid
            products={categoryProducts}
            emptyTitle={`No products in ${title}`}
          />
        </div>
      </section>
    </main>
  );
}
