"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  FaThLarge,
  FaList,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaSearch,
  FaWhatsapp,
  FaPhoneAlt,
  FaArrowUp,
  FaTimes,
  FaStar,
  FaCheck,
  FaAward,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaBoxOpen,
} from "react-icons/fa";

import {
  fetchAllProducts,
  fetchCategoriesList,
  normalizeProduct,
} from "../api-services/productApi";
import { products as initialCatalog } from "../data/products";
import { fetchCartById } from "../slice/cartSLise";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../slice/wishlistSlice";

async function showToast(type, message) {
  try {
    const { default: iziToast } = await import("izitoast");
    iziToast[type]({
      title: type === "success" ? "Success" : type === "warning" ? "Notice" : "Info",
      message,
      position: "topRight",
      timeout: 3000,
    });
  } catch {
    console.log(type, message);
  }
}

function getWishlistProductId(item) {
  return String(item?.productId?._id || item?.productId || item?._id || "");
}

const mineralCategories = [
  "All Products",
  "Calcium Powder",
  "Calcite Lumps",
  "Talc Powder",
  "Dolomite Powder",
  "Limestone Powder",
];

export default function ReadyToShipPage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userStore?.token);
  const wishlist = useSelector((state) => state.wishlistStore?.wishlist || []);
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/web/";

  // Data states - initialized with official verified catalog immediately
  const [allProducts, setAllProducts] = useState(() =>
    Array.isArray(initialCatalog) ? initialCatalog.map((p) => normalizeProduct(p)).filter(Boolean) : []
  );
  const [loading, setLoading] = useState(false);

  // UI states
  const [viewMode, setViewMode] = useState("grid");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [sortBy, setSortBy] = useState("popularity");

  // Fetch Wishlist on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist());
      dispatch(fetchCartById());
    }
  }, [token, dispatch]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Products in background
  useEffect(() => {
    async function loadData() {
      try {
        const prods = await fetchAllProducts();
        if (Array.isArray(prods) && prods.length > 0) {
          setAllProducts(prods);
        }
      } catch (err) {
        console.log("Background product load fallback");
      }
    }
    loadData();
  }, []);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (selectedCategory && selectedCategory !== "All Products") {
          const catNorm = selectedCategory.toLowerCase();
          const prodCat = (p.category || "").toLowerCase();
          const prodTitle = (p.name || "").toLowerCase();
          if (!prodCat.includes(catNorm) && !prodTitle.includes(catNorm)) {
            return false;
          }
        }
        if (selectedGrade) {
          const gradeNorm = selectedGrade.toLowerCase();
          const pGrade = (p.grade || p.shortDescription || "").toLowerCase();
          if (!pGrade.includes(gradeNorm)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low-high") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price-high-low") return (b.price || 0) - (a.price || 0);
        if (sortBy === "name-a-z") return a.name.localeCompare(b.name);
        return 0; // popularity default
      });
  }, [allProducts, selectedCategory, selectedGrade, sortBy]);

  // Add to Cart
  const handleAddToCart = async (product, qty = 1) => {
    if (!token) {
      showToast("warning", "Please login to add items to your cart");
      return;
    }

    const cartObj = {
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty,
      productId: product._id || product.id,
    };

    try {
      const res = await axios.post(`${apibaseUrl}cart/add-to-cart`, cartObj, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.status || res.data?.success) {
        showToast("success", `${product.name} added to cart!`);
        dispatch(fetchCartById());
        if (quickViewProduct) setQuickViewProduct(null);
      } else {
        showToast("warning", res.data?.message || "Could not add to cart");
      }
    } catch (err) {
      console.error("Cart error:", err);
      showToast("error", "Error adding product to cart");
    }
  };

  // Wishlist toggle
  const handleWishlistToggle = async (product) => {
    if (!token) {
      showToast("warning", "Please login to manage your wishlist");
      return;
    }

    const prodId = String(product._id || product.id || "");
    const wishlistItem = wishlist.find(
      (item) => getWishlistProductId(item) === prodId
    );
    const isWishlisted = Boolean(wishlistItem);

    try {
      const result = await dispatch(
        isWishlisted
          ? removeFromWishlist(wishlistItem._id)
          : addToWishlist({
              ...product,
              productId: product._id || product.id,
            })
      );

      if (result.payload?.status) {
        showToast("success", isWishlisted ? "Removed from wishlist" : "Added to wishlist");
        dispatch(fetchWishlist());
      } else {
        showToast("warning", result.payload?.message || "Wishlist updated");
        dispatch(fetchWishlist());
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafbfc] text-[#0f2b5c]">
      {/* ==================================================
          PAGE HERO BANNER (MATCHING SCREENSHOT 3)
      ================================================== */}
      <section className="relative overflow-hidden bg-[#071d3b] py-12 text-white md:py-16">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#071d3b] via-[#071d3b]/90 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
          <h1 className="text-3xl font-extrabold text-white md:text-5xl">
            Our Products
          </h1>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Link href="/" className="hover:text-orange-400">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-white">Products</span>
            {selectedCategory !== "All Products" && (
              <>
                <span>&gt;</span>
                <span className="text-orange-400">{selectedCategory}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================
          MAIN CONTENT: SIDEBAR + PRODUCT GRID
      ================================================== */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            {/* ==================================================
                LEFT SIDEBAR (MATCHING SCREENSHOT 3)
            ================================================== */}
            <aside className="space-y-6">
              {/* CATEGORIES CARD */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FaBoxOpen className="text-[#0b4ba2]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f2b5c]">
                    Categories
                  </h3>
                </div>

                <div className="space-y-1">
                  {mineralCategories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                          isSelected
                            ? "bg-[#e8f1fd] font-bold text-[#0b4ba2]"
                            : "text-[#475569] hover:bg-slate-50 hover:text-[#0b4ba2]"
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <FaCheck className="text-xs text-[#0b4ba2]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WHY CHOOSE US CARD (MATCHING SCREENSHOT 3) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-[#0f2b5c]">
                  Why Choose Us?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0b4ba2]">
                      <FaAward className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f2b5c]">Premium Quality</h4>
                      <p className="text-[11px] text-slate-500">We ensure 100% premium quality minerals.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0b4ba2]">
                      <FaTruck className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f2b5c]">Timely Delivery</h4>
                      <p className="text-[11px] text-slate-500">On-time delivery across India.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0b4ba2]">
                      <FaShieldAlt className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f2b5c]">Competitive Price</h4>
                      <p className="text-[11px] text-slate-500">Best quality at the most competitive price.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0b4ba2]">
                      <FaHeadset className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f2b5c]">Customer Support</h4>
                      <p className="text-[11px] text-slate-500">We are always here to help you.</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* ==================================================
                RIGHT AREA: PRODUCTS CATALOG
            ================================================== */}
            <div>
              {/* TOOLBAR */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-600">
                    Showing {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="sortBy" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Sort by:
                  </label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0b4ba2]"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="name-a-z">Alphabetically, A-Z</option>
                  </select>
                </div>
              </div>

              {/* PRODUCTS GRID (2 PRODUCTS ON MOBILE, 4 ON DESKTOP) */}
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="animate-pulse rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-xs">
                      <div className="h-32 sm:h-44 rounded-lg sm:rounded-xl bg-slate-200" />
                      <div className="mt-3 h-3 sm:h-4 w-3/4 rounded bg-slate-200" />
                      <div className="mt-2 h-3 sm:h-4 w-1/2 rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800">No products found in this category</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All Products")}
                    className="mt-4 rounded-lg bg-[#0b4ba2] px-6 py-2 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredProducts.map((product) => {
                    const prodId = String(product._id || product.id || "");
                    const isWishlisted = wishlist.some(
                      (item) => getWishlistProductId(item) === prodId
                    );
                    const rawSlug = product.slug && !String(product.slug).match(/^[0-9a-fA-F]{24}$/) ? product.slug : "";
                    const productSlug =
                      rawSlug ||
                      (product.name || product.title || "calcium-powder")
                        .toString()
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-");

                    return (
                      <article
                        key={product._id || productSlug}
                        className="group flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        {/* PRODUCT IMAGE */}
                        <div className="relative aspect-[1.15/1] sm:aspect-[1.15/1] w-full overflow-hidden bg-[#f1f5f9]">
                          <Link href={`/product-details/${productSlug}`} className="block h-full w-full">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>

                          {/* BADGE */}
                          {product.badge && (
                            <span className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded bg-[#0b3b82] px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow">
                              {product.badge}
                            </span>
                          )}

                          {/* WISHLIST BUTTON */}
                          <button
                            type="button"
                            aria-label="Wishlist"
                            onClick={() => handleWishlistToggle(product)}
                            className="absolute right-2 top-2 sm:right-3 sm:top-3 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-[#f97316] hover:text-white"
                          >
                            {isWishlisted ? (
                              <FaHeart className="text-xs text-red-500" />
                            ) : (
                              <FaRegHeart className="text-xs text-slate-700" />
                            )}
                          </button>
                        </div>

                        {/* PRODUCT DETAILS */}
                        <div className="flex flex-1 flex-col p-2.5 sm:p-4 text-center">
                          <h3 className="line-clamp-2 h-8 sm:h-10 text-xs sm:text-sm font-bold leading-tight sm:leading-snug text-[#0f2b5c] transition hover:text-[#0b4ba2]">
                            <Link href={`/product-details/${productSlug}`}>
                              {product.title || product.name}
                            </Link>
                          </h3>

                          <p className="mt-1 truncate text-[10px] sm:text-xs text-slate-400">
                            {product.grade || "Industrial Grade"}
                          </p>

                          {/* PRICE */}
                          <div className="mt-1.5 sm:mt-3 flex items-center justify-center gap-1 sm:gap-1.5">
                            <span className="text-xs sm:text-base font-black text-[#0b4ba2]">
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-700">
                              / {product.size || "25 KG Bag"}
                            </span>
                          </div>

                          {/* ACTION BUTTON */}
                          <div className="mt-auto pt-2 sm:pt-3 border-t border-slate-100 flex gap-1.5 sm:gap-2">
                            <Link
                              href={`/product-details/${productSlug}`}
                              className="flex-1 rounded-lg sm:rounded-xl border border-[#0b4ba2] py-2 sm:py-2.5 text-center text-xs sm:text-sm font-bold text-[#0b4ba2] transition hover:bg-[#0b4ba2] hover:text-white active:scale-95"
                            >
                              View Details &gt;
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          BOTTOM BLUE TRUST BAR (MATCHING SCREENSHOT 3)
      ================================================== */}
      <section className="bg-[#071d3b] py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-orange-400">
                <FaAward className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Premium Quality</h4>
                <p className="text-xs text-slate-400">We provide 100% premium quality minerals.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-orange-400">
                <FaTruck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Timely Delivery</h4>
                <p className="text-xs text-slate-400">We ensure safe and on-time delivery pan India.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-orange-400">
                <FaShieldAlt className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Competitive Price</h4>
                <p className="text-xs text-slate-400">Best quality at the most competitive price.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-orange-400">
                <FaHeadset className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Customer Support</h4>
                <p className="text-xs text-slate-400">Our team is always ready to assist you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING ACTION BUTTONS */}
      <a
        href="https://wa.me/918810426236?text=Hi%20JGB%20Trading,%20I%20am%20interested%20in%20your%20products"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-[120] flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl transition-all duration-300 hover:scale-110"
      >
        <FaWhatsapp className="h-7 w-7" />
      </a>

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-[#0b4ba2] text-white shadow-xl transition-all duration-300 hover:bg-[#f97316] hover:scale-110"
        >
          <FaArrowUp className="h-5 w-5" />
        </button>
      )}
    </main>
  );
}
