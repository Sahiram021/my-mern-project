import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaCheckCircle,
  FaWhatsapp,
  FaFileAlt,
  FaAward,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";
import ProductActions from "../../Components/Product-Components/ProductActions";
import { buildProductImageUrl } from "../../utils/imageUrl";
import { products as fallbackProducts } from "../../data/products";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/web/";

async function getProduct(slug) {
  const decodedSlug = decodeURIComponent(slug || "").toLowerCase().trim();
  const normalizedSlug = decodedSlug.replace(/[^a-z0-9]/g, "");

  try {
    const response = await fetch(
      `${apiBaseUrl}products/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.product) {
        return data.product;
      }
    }
  } catch (error) {
    console.log("Product Details API:", error?.message);
  }

  try {
    const response2 = await fetch(
      `${apiBaseUrl}products/details/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (response2.ok) {
      const data = await response2.json();
      if (data.success && data.product) {
        return data.product;
      }
    }
  } catch (error) {
  }

  // Robust matching by slug and product name
  const found = fallbackProducts.find((p) => {
    const pSlug = (p.slug || "").toLowerCase().trim();
    const pSlugNorm = pSlug.replace(/[^a-z0-9]/g, "");
    const pNameNorm = (p.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const pTitleNorm = (p.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    return (
      pSlug === decodedSlug ||
      pSlugNorm === normalizedSlug ||
      pNameNorm === normalizedSlug ||
      pTitleNorm === normalizedSlug ||
      pNameNorm.includes(normalizedSlug) ||
      normalizedSlug.includes(pNameNorm) ||
      pTitleNorm.includes(normalizedSlug) ||
      normalizedSlug.includes(pTitleNorm)
    );
  });

  return found || fallbackProducts[0];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found | JGB Trading" };
  }

  return {
    title: `${product.name || product.title} | JGB TRADING PRIVATE LIMITED`,
    description:
      product.shortDescription ||
      product.sortDescription ||
      product.longDescription ||
      "High quality mineral and calcium powder supplier in Raipur, Chhattisgarh.",
  };
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const productImage = buildProductImageUrl(product.image);
  const productForActions = {
    ...product,
    image: productImage,
  };

  const otherProducts = fallbackProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#fafbfc] text-[#0f2b5c]">
      {/* BREADCRUMB */}
      <section className="border-b border-slate-200 bg-white py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 lg:px-6">
          <Link href="/" className="hover:text-[#0b4ba2]">
            Home
          </Link>
          <span>&gt;</span>
          <Link href="/ready-to-ship" className="hover:text-[#0b4ba2]">
            Products
          </Link>
          <span>&gt;</span>
          <span className="text-[#0b4ba2]">{product.name || product.title}</span>
        </div>
      </section>

      {/* PRODUCT DETAILS (MATCHING SCREENSHOT 2) */}
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            {/* LEFT: PRODUCT IMAGE & THUMBNAILS */}
            <div className="flex flex-col-reverse gap-4 sm:flex-row">
              {/* THUMBNAILS */}
              <div className="flex gap-3 sm:flex-col">
                {[productImage, productImage, productImage, productImage].map((src, idx) => (
                  <div
                    key={idx}
                    className="h-20 w-20 overflow-hidden rounded-xl border-2 border-slate-200 bg-[#f8fafc] p-1 transition hover:border-[#0b4ba2]"
                  >
                    <img src={src} alt="thumbnail" className="h-full w-full object-cover rounded-lg" />
                  </div>
                ))}
              </div>

              {/* MAIN LARGE IMAGE */}
              <div className="relative aspect-[1.1/1] flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <img
                  src={productImage}
                  alt={product.name || "Calcium Powder"}
                  className="h-full w-full object-cover rounded-xl"
                />
                <span className="absolute left-6 top-6 rounded bg-[#0b3b82] px-3 py-1 text-xs font-bold uppercase text-white shadow">
                  {product.badge || "Best Seller"}
                </span>
              </div>
            </div>

            {/* RIGHT: DETAILS & ACTIONS */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="rounded bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0b4ba2]">
                  {product.badge || "Best Seller"}
                </span>

                <h1 className="mt-3 text-3xl font-extrabold text-[#0f2b5c] md:text-4xl">
                  {product.name || product.title}
                </h1>

                <p className="mt-1 text-base font-semibold text-[#0b4ba2]">
                  {product.grade || "Industrial Grade"}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                  {product.shortDescription ||
                    product.sortDescription ||
                    "High quality industrial calcium powder for a wide range of applications. Consistent quality, timely delivery and customer satisfaction is our promise."}
                </p>

                {/* SPECIFICATION LIST (MATCHING SCREENSHOT 2) */}
                <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">🧬</span>
                    <div>
                      <span className="text-slate-400">Purity:</span>{" "}
                      <strong className="text-[#0f2b5c]">{product.purity || "98% Min"}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">⚙️</span>
                    <div>
                      <span className="text-slate-400">Whiteness:</span>{" "}
                      <strong className="text-[#0f2b5c]">{product.whiteness || "90% Min"}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">💧</span>
                    <div>
                      <span className="text-slate-400">Moisture:</span>{" "}
                      <strong className="text-[#0f2b5c]">{product.moisture || "1% Max"}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">📦</span>
                    <div>
                      <span className="text-slate-400">Packaging:</span>{" "}
                      <strong className="text-[#0f2b5c]">{product.packaging || "25 KG / 50 KG PP Bag"}</strong>
                    </div>
                  </div>
                </div>

                {/* PRICE */}
                <div className="mt-6 flex items-baseline gap-3 border-y border-slate-200 py-4">
                  <span className="text-3xl font-extrabold text-[#0b4ba2]">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    / {product.size || "25 KG Bag"}
                  </span>
                </div>

                {/* PRODUCT ACTIONS (CART + QUANTITY) */}
                <div className="mt-6">
                  <ProductActions product={productForActions} />
                </div>

                {/* ENQUIRE / REQUEST QUOTE BUTTONS (MATCHING SCREENSHOT 2) */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/918810426236?text=Hi%20JGB%20Trading,%20I%20am%20interested%20in%20${encodeURIComponent(product.name || "Calcium Powder")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0b4ba2] py-3 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-[#f97316]"
                  >
                    <FaWhatsapp className="text-base text-emerald-400" />
                    Enquire Now
                  </a>

                  <Link
                    href="/contact-us"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#0b4ba2] bg-white py-3 text-xs font-bold uppercase tracking-wider text-[#0b4ba2] transition hover:bg-blue-50"
                  >
                    <FaFileAlt className="text-xs" />
                    Request Quote
                  </Link>
                </div>

                {/* 4 GUARANTEE BADGES (MATCHING SCREENSHOT 2) */}
                <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-200 pt-6 sm:grid-cols-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <FaCheckCircle className="text-emerald-500" />
                    <span>Quality Assurance</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <FaTruck className="text-[#0b4ba2]" />
                    <span>Timely Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <FaShieldAlt className="text-[#0b4ba2]" />
                    <span>Secure Packaging</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <FaAward className="text-orange-500" />
                    <span>Best Price</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OTHER PRODUCTS SECTION (MATCHING SCREENSHOT 2) */}
      <section className="border-t border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
              Our Products
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-[#0f2b5c] sm:text-3xl">
              Other Mineral Products
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              We provide high quality minerals for various industrial applications.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherProducts.map((p) => (
              <article
                key={p.slug}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[1.2/1] overflow-hidden rounded-xl bg-[#f8fafc]">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-base font-bold text-[#0f2b5c]">{p.title || p.name}</h3>
                  <p className="text-xs text-slate-500">{p.grade}</p>
                  <p className="mt-2 text-base font-bold text-[#0b4ba2]">
                    Rs. {Number(p.price).toLocaleString()}{" "}
                    <span className="text-xs font-normal text-slate-500">/ 25 KG Bag</span>
                  </p>
                  <Link
                    href={`/product-details/${p.slug}`}
                    className="mt-4 inline-block w-full rounded-lg border border-[#0b4ba2] py-2 text-center text-xs font-bold text-[#0b4ba2] transition hover:bg-[#0b4ba2] hover:text-white"
                  >
                    View Details &gt;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
