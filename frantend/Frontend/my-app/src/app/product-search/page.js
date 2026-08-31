import Link from "next/link";
import ProductGrid from "../Components/Product-Components/ProductGrid";
import { products, searchProducts } from "../data/products";

export const metadata = {
  title: "Product Search | JGB TRADING PRIVATE LIMITED",
  description: "Search Calcium Powder, Anti Moisture Powder, and industrial mineral products.",
};

export default async function ProductSearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.search === "string" ? params.search : "";
  const results = query ? searchProducts(query) : products;

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-[#f8fafc] py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <p className="text-sm text-slate-500">
            <Link href="/" className="transition hover:text-[#0b4ba2]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#0f2b5c]">Product Search</span>
          </p>
          <h1 className="mt-4 text-3xl font-extrabold text-[#0f2b5c] sm:text-4xl">
            Search Powder &amp; Minerals
          </h1>

          <form action="/product-search" className="mt-6 flex max-w-2xl overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
            <input
              name="search"
              type="search"
              defaultValue={query}
              placeholder="Search Calcium Powder, Anti Moisture, Grade..."
              className="min-w-0 flex-1 px-5 py-3.5 text-sm text-slate-800 outline-none"
            />
            <button className="bg-[#0b4ba2] px-7 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-500">
              Search
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-500">
            {query ? `${results.length} result(s) found for "${query}"` : `${results.length} products available in catalog`}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <ProductGrid products={results} emptyTitle="No matching mineral products found" />
        </div>
      </section>
    </main>
  );
}

