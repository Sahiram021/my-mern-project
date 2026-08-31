import Link from "next/link";
import ProductGrid from "../../Components/Product-Components/ProductGrid";
import { buildProductImageUrl } from "../../utils/imageUrl";
import { products as fallbackProducts } from "../../data/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCategoryProducts(slug) {
  try {
    if (!API_URL) {
      return {
        title: slug,
        products: [],
      };
    }

    const apiUrl = `${API_URL.replace(/\/$/, "")}/category-products/${encodeURIComponent(slug)}`;

    const response = await fetch(apiUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        title: slug,
        products: [],
      };
    }

    const data = await response.json();

    const products =
      data.products ||
      data.data?.products ||
      data.data ||
      [];

    const imageBaseUrl =
      data.base_url ||
      data.staticPath ||
      data.imagePath ||
      data.data?.base_url ||
      data.data?.staticPath ||
      data.data?.imagePath ||
      "";

    return {
      title:
        data.category?.name ||
        data.data?.category?.name ||
        data.name ||
        slug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),

      products: Array.isArray(products)
        ? products.map((product) => ({
            ...product,
            image: buildProductImageUrl(product.image, imageBaseUrl),
          }))
        : [],
    };
  } catch (error) {
    return {
      title: slug,
      products: [],
    };
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryData = await getCategoryProducts(slug);

  const title =
    categoryData.title ||
    slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `${title} | JGB TRADING PRIVATE LIMITED`,
    description: `Browse ${title} mineral and powder products from JGB TRADING PRIVATE LIMITED, Raipur.`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const categoryData = await getCategoryProducts(slug);

  let categoryProducts = Array.isArray(categoryData.products) && categoryData.products.length > 0
    ? categoryData.products
    : [];

  const title =
    categoryData.title ||
    slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  if (categoryProducts.length === 0) {
    const slugLower = slug.toLowerCase().replace(/-/g, " ");
    categoryProducts = fallbackProducts.filter((p) => {
      const pName = (p.name || "").toLowerCase();
      const pCat = (p.category || "").toLowerCase();
      return pName.includes(slugLower) || pCat.includes(slugLower) || slugLower.includes("calcium") || slugLower.includes("powder");
    });
    if (categoryProducts.length === 0) {
      categoryProducts = fallbackProducts;
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-slate-200 bg-[#f8fafc] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-xs text-slate-500">
            <Link href="/" className="transition hover:text-[#0b4ba2]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#0f2b5c] font-semibold">{title}</span>
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

