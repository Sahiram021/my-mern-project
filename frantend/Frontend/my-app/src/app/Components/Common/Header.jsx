"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaAngleDown,
  FaAngleRight,
  FaBars,
  FaTimes,
  FaFacebookF,
  FaInstagram,
  FaRegUser,
  FaSearch,
  FaTwitter,
  FaPhoneAlt,
  FaHeart,
  FaShoppingCart,
  FaWhatsapp,
  FaBoxOpen,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartById, clearCart } from "@/app/slice/cartSLise";
import { fetchWishlist, clearWishlist } from "@/app/slice/wishlistSlice";

function getEntitySlug(entity) {
  if (entity?.slug && !String(entity.slug).match(/^[0-9a-fA-F]{24}$/)) {
    return entity.slug;
  }

  const name = entity?.name || entity?.title || "";
  if (name) {
    return name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  if (entity?.slug) {
    return entity.slug;
  }

  return "";
}

function getCategoryHref(entity) {
  const slug = getEntitySlug(entity);
  return slug ? `/categories/${slug}` : "/ready-to-ship";
}

function getProductHref(product) {
  const slug = getEntitySlug(product);
  return slug ? `/product-details/${slug}` : "/ready-to-ship";
}

const pages = [
  ["Home", "/"],
  ["About Us", "/about-us"],
  ["Products", "/ready-to-ship"],
  ["Cart", "/cart"],
  ["Checkout", "/checkout"],
  ["FAQs & Grades", "/frequently-questions"],
  ["Contact Us", "/contact-us"],
];

function MegaMenu({ item, backendUrl, index, totalItems }) {
  const positionClass =
    index === 0
      ? "left-0"
      : index === totalItems - 1
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <li className="group relative flex h-full items-center">
      <button
        type="button"
        className="flex h-full items-center gap-1 whitespace-nowrap px-3 text-sm font-semibold uppercase tracking-wide text-[#242424] transition-all duration-300 hover:text-[#0b4ba2]"
      >
        <span>{item.name}</span>
        <FaAngleDown className="text-xs transition-transform duration-300 group-hover:rotate-180" />
      </button>

      <div
        className={`invisible absolute top-full ${positionClass} z-50 w-[800px] max-w-[90vw] translate-y-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100`}
      >
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl ring-1 ring-black/5">
          <div className="grid grid-cols-3 gap-6">
            {item.subcategories?.slice(0, 6).map((subcategory) => (
              <div key={subcategory._id} className="space-y-2">
                <Link
                  href={getCategoryHref(subcategory)}
                  className="block text-xs font-bold uppercase tracking-wider text-[#0f2b5c] transition hover:text-[#0b4ba2]"
                >
                  {subcategory.name}
                </Link>

                <ul className="space-y-1">
                  {subcategory.subSubcategories?.slice(0, 5).map((subSub) => (
                    <li key={subSub._id}>
                      <Link
                        href={getCategoryHref(subSub)}
                        className="block truncate text-xs text-slate-500 transition hover:translate-x-1 hover:text-[#0b4ba2]"
                      >
                        {subSub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.userStore?.token);
  const cart = useSelector((state) => state.cartStore?.cart || []);
  const wishlist = useSelector((state) => state.wishlistStore?.wishlist || []);

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [megaMenu, setMegaMenu] = useState([]);
  const [megaMenuLoading, setMegaMenuLoading] = useState(true);

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://jgbmtrading.online/api/web/";
  const backendUrl = apibaseUrl.replace(/\/web\/?$/, "");

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchCartById());
      dispatch(fetchWishlist());
    } else {
      dispatch(clearCart());
      dispatch(clearWishlist());
    }
  }, [token, dispatch]);

  useEffect(() => {
    // Close mobile menu on route change
    const timer = window.setTimeout(() => setMobileMenuOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Fetch mega menu categories safely
  useEffect(() => {
    let isMounted = true;
    const getMegaMenu = async () => {
      try {
        setMegaMenuLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${apibaseUrl}mega-menu`, {
          signal: controller.signal,
        }).catch(() => null);

        clearTimeout(timeoutId);

        if (response && response.ok) {
          const data = await response.json().catch(() => null);
          if (isMounted && data && (data.success || data.status)) {
            setMegaMenu(data.data || data.categories || []);
          }
        }
      } catch (error) {
        // Silently fallback without triggering console error overlays
      } finally {
        if (isMounted) setMegaMenuLoading(false);
      }
    };

    getMegaMenu();
    return () => {
      isMounted = false;
    };
  }, [apibaseUrl]);

  // Live search handler safely
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(
        `${apibaseUrl}products/search?search=${encodeURIComponent(value.trim())}`,
        { signal: controller.signal }
      ).catch(() => null);

      clearTimeout(timeoutId);

      if (response && response.ok) {
        const data = await response.json().catch(() => null);
        setProducts(data?.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/product-search?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setProducts([]);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* ==================================================
          TOP ANNOUNCEMENT BAR (DESKTOP)
      ================================================== */}
      <div className="hidden border-b border-slate-200 bg-[#0a2540] text-xs text-slate-200 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-6">
          <div className="flex items-center gap-6">
            <a href="tel:8810426236" className="flex items-center gap-1.5 transition hover:text-orange-400">
              <FaPhoneAlt className="text-[10px]" />
              <span className="font-semibold">+91 8810426236</span>
            </a>
            <span>Mahadev Ghat Rd, Raipur 492001, Chhattisgarh</span>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <Link href="#" aria-label="Facebook" className="transition hover:text-orange-400">
                <FaFacebookF />
              </Link>
              <Link href="#" aria-label="Twitter" className="transition hover:text-orange-400">
                <FaTwitter />
              </Link>
              <Link href="#" aria-label="Instagram" className="transition hover:text-orange-400">
                <FaInstagram />
              </Link>
            </div>

            {mounted && token ? (
              <Link
                href="/my-dashboard"
                className="inline-flex items-center gap-1.5 font-bold text-white transition hover:text-orange-400"
              >
                <CgProfile className="text-sm" />
                My Dashboard
              </Link>
            ) : (
              <Link
                href="/login-register"
                className="inline-flex items-center gap-1.5 font-semibold text-slate-200 transition hover:text-orange-400"
              >
                <FaRegUser className="text-[10px]" />
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          MAIN HEADER (MYNTRA-STYLE MOBILE & DESKTOP)
      ================================================== */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
          
          {/* LEFT: HAMBURGER (MOBILE) + BRAND LOGO */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              aria-label="Open Navigation Menu"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-800 transition hover:bg-slate-50 lg:hidden active:scale-95"
            >
              <FaBars className="text-base" />
            </button>

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/images/jgb-logo.jpg"
                alt="JGB Trading Private Limited Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-contain bg-white shadow-xs border border-slate-100"
              />
              <div>
                <div className="text-base sm:text-lg font-black leading-tight tracking-tight text-[#071d3b]">
                  JGB TRADING
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#f97316]">
                  Private Limited
                </div>
              </div>
            </Link>
          </div>

          {/* CENTER: SEARCH BAR (DESKTOP) */}
          <div className="relative hidden flex-1 max-w-xl lg:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search Calcium Powder, Anti-Moisture Powder, Grade..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 pr-12 text-sm text-[#242424] outline-none transition focus:border-[#0b4ba2] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b4ba2] text-white transition hover:bg-orange-500"
              >
                <FaSearch className="text-xs" />
              </button>
            </form>

            {/* LIVE SEARCH RESULTS (DESKTOP) */}
            {search.trim() && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                {loading && (
                  <div className="p-4 text-center text-sm text-slate-500">
                    Searching minerals...
                  </div>
                )}
                {!loading && products.length > 0 && (
                  <div className="space-y-1">
                    {products.map((prod) => (
                      <Link
                        key={prod._id}
                        href={getProductHref(prod)}
                        onClick={() => {
                          setSearch("");
                          setProducts([]);
                        }}
                        className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-slate-50"
                      >
                        <img
                          src={`${backendUrl}/uploads/product/${prod.image}`}
                          alt={prod.name}
                          className="h-12 w-12 shrink-0 rounded-lg bg-slate-50 object-contain p-1"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-xs font-bold text-[#0f2b5c]">
                            {prod.name}
                          </h4>
                          <p className="mt-0.5 text-xs font-bold text-[#0b4ba2]">
                            Rs. {prod.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {!loading && products.length === 0 && (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: QUICK ACTIONS (MYNTRA-STYLE ICONS) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* WISHLIST */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-[#0b4ba2] hover:text-[#0b4ba2] active:scale-95"
            >
              <FaHeart className="text-sm sm:text-base" />
              {wishlist.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] sm:text-[10px] font-bold text-white shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="relative flex h-9 sm:h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-2.5 sm:px-3 text-slate-700 transition hover:border-[#0b4ba2] hover:text-[#0b4ba2] active:scale-95"
            >
              <FaShoppingCart className="text-sm sm:text-base text-[#0b4ba2]" />
              <span className="hidden sm:inline text-xs font-bold uppercase">Cart</span>
              <span className="flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-[#0b4ba2] px-1 text-[9px] sm:text-[10px] font-bold text-white shadow-sm">
                {cart.length}
              </span>
            </Link>

            {/* ACCOUNT (MOBILE & DESKTOP) */}
            <Link
              href={mounted && token ? "/my-dashboard" : "/login-register"}
              aria-label="Account"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-[#0b4ba2] hover:text-[#0b4ba2] active:scale-95"
            >
              {mounted && token ? (
                <CgProfile className="text-lg text-[#0b4ba2]" />
              ) : (
                <FaRegUser className="text-xs sm:text-sm" />
              )}
            </Link>
          </div>
        </div>

        {/* ==================================================
            MOBILE SEARCH BAR ROW (ALWAYS CLEAN & VISIBLE ON MOBILE)
        ================================================== */}
        <div className="px-3 pb-3 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search Calcium, Anti-Moisture Powder..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-10 text-xs text-[#242424] outline-none transition focus:border-[#0b4ba2] focus:bg-white focus:ring-1 focus:ring-blue-100"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b4ba2] text-white"
            >
              <FaSearch className="text-[11px]" />
            </button>
          </form>

          {/* LIVE SEARCH RESULTS (MOBILE) */}
          {search.trim() && (
            <div className="absolute left-3 right-3 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
              {loading && (
                <div className="p-3 text-center text-xs text-slate-500">
                  Searching minerals...
                </div>
              )}
              {!loading && products.length > 0 && (
                <div className="space-y-1">
                  {products.map((prod) => (
                    <Link
                      key={prod._id}
                      href={getProductHref(prod)}
                      onClick={() => {
                        setSearch("");
                        setProducts([]);
                      }}
                      className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
                    >
                      <img
                        src={`${backendUrl}/uploads/product/${prod.image}`}
                        alt={prod.name}
                        className="h-10 w-10 shrink-0 rounded-lg bg-slate-50 object-contain p-1"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-xs font-bold text-[#0f2b5c]">
                          {prod.name}
                        </h4>
                        <p className="text-xs font-bold text-[#0b4ba2]">
                          Rs. {prod.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {!loading && products.length === 0 && (
                <div className="p-3 text-center text-xs text-slate-500">
                  No products found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ==================================================
          DESKTOP NAVIGATION STRIP (STICKY)
      ================================================== */}
      <div className="hidden border-b border-[#ededed] bg-white lg:block">
        <div className="mx-auto flex h-13 max-w-7xl items-center justify-between px-4 lg:px-6">
          <nav className="h-full">
            <ul className="flex h-full items-center gap-1">
              <li className="flex h-full items-center">
                <Link
                  href="/"
                  className={`flex h-full items-center px-4 text-xs font-bold uppercase tracking-wider transition ${
                    pathname === "/"
                      ? "border-b-2 border-[#0b4ba2] text-[#0b4ba2]"
                      : "text-slate-700 hover:text-[#0b4ba2]"
                  }`}
                >
                  Home
                </Link>
              </li>

              <li className="flex h-full items-center">
                <Link
                  href="/ready-to-ship"
                  className={`flex h-full items-center px-4 text-xs font-bold uppercase tracking-wider transition ${
                    pathname === "/ready-to-ship"
                      ? "border-b-2 border-[#0b4ba2] text-[#0b4ba2]"
                      : "text-slate-700 hover:text-[#0b4ba2]"
                  }`}
                >
                  Ready To Ship
                </Link>
              </li>

              {/* DYNAMIC MEGA MENU FOR CATEGORIES */}
              {!megaMenuLoading &&
                megaMenu.map((item, index) => (
                  <MegaMenu
                    key={item._id}
                    item={item}
                    backendUrl={backendUrl}
                    index={index}
                    totalItems={megaMenu.length}
                  />
                ))}

              <li className="flex h-full items-center">
                <Link
                  href="/about-us"
                  className={`flex h-full items-center px-4 text-xs font-bold uppercase tracking-wider transition ${
                    pathname === "/about-us"
                      ? "border-b-2 border-[#0b4ba2] text-[#0b4ba2]"
                      : "text-slate-700 hover:text-[#0b4ba2]"
                  }`}
                >
                  About Us
                </Link>
              </li>

              <li className="flex h-full items-center">
                <Link
                  href="/contact-us"
                  className={`flex h-full items-center px-4 text-xs font-bold uppercase tracking-wider transition ${
                    pathname === "/contact-us"
                      ? "border-b-2 border-[#0b4ba2] text-[#0b4ba2]"
                      : "text-slate-700 hover:text-[#0b4ba2]"
                  }`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:8810426236"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0b4ba2] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-orange-500"
            >
              <FaPhoneAlt className="text-[10px]" />
              8810426236
            </a>
          </div>
        </div>
      </div>

      {/* ==================================================
          MYNTRA-STYLE SLIDE-OUT MOBILE NAVIGATION DRAWER
      ================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* BACKDROP OVERLAY */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* SLIDE-OUT DRAWER CONTAINER */}
          <div className="relative flex h-full w-[85%] max-w-[320px] flex-col bg-white shadow-2xl">
            {/* DRAWER TOP BAR */}
            <div className="flex items-center justify-between bg-[#071d3b] p-4 text-white">
              <div className="flex items-center gap-3">
                <img
                  src="/images/jgb-logo.jpg"
                  alt="JGB Trading Logo"
                  className="h-10 w-10 rounded-xl object-contain bg-white p-0.5 border border-white/20"
                />
                <div>
                  <h3 className="text-sm font-bold leading-tight">JGB TRADING</h3>
                  <p className="text-[10px] font-semibold text-orange-400">
                    Industrial Minerals &amp; Chemicals
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                type="button"
                aria-label="Close Menu"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
              >
                <FaTimes />
              </button>
            </div>

            {/* USER LOGIN PROMPT OR STATUS */}
            <div className="border-b border-slate-100 bg-slate-50 p-3">
              {mounted && token ? (
                <Link
                  href="/my-dashboard"
                  className="flex items-center justify-between text-xs font-bold text-[#0b4ba2]"
                >
                  <span className="flex items-center gap-2">
                    <CgProfile className="text-base" /> My Dashboard
                  </span>
                  <FaAngleRight />
                </Link>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Welcome, Guest</span>
                  <Link
                    href="/login-register"
                    className="rounded-lg bg-[#0b4ba2] px-3 py-1.5 text-[11px] font-bold text-white"
                  >
                    Login / Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* DRAWER NAVIGATION ITEMS (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="space-y-1">
                <Link
                  href="/"
                  className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    pathname === "/" ? "bg-blue-50 text-[#0b4ba2]" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>Home</span>
                  <FaAngleRight className="text-[10px] text-slate-400" />
                </Link>

                <Link
                  href="/ready-to-ship"
                  className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    pathname === "/ready-to-ship" ? "bg-blue-50 text-[#0b4ba2]" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FaBoxOpen className="text-orange-500" /> All Products (Ready to Ship)
                  </span>
                  <FaAngleRight className="text-[10px] text-slate-400" />
                </Link>

                {/* CATEGORIES ACCORDION */}
                <div className="pt-2">
                  <div className="px-2.5 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Product Categories
                  </div>

                  {!megaMenuLoading &&
                    megaMenu.map((cat) => {
                      const isExpanded = expandedCategory === cat._id;
                      return (
                        <div key={cat._id} className="border-b border-slate-100 py-1">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCategory(isExpanded ? null : cat._id)
                            }
                            className="flex w-full cursor-pointer items-center justify-between rounded-lg p-2 text-left text-xs font-bold text-slate-800 transition hover:bg-slate-50"
                          >
                            <span>{cat.name}</span>
                            <FaAngleDown
                              className={`text-xs transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-[#0b4ba2]" : "text-slate-400"
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="space-y-1 pl-3 pb-2 pt-1">
                              {cat.subcategories?.map((sub) => (
                                <Link
                                  key={sub._id}
                                  href={getCategoryHref(sub)}
                                  className="block rounded-lg py-1.5 px-2 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-[#0b4ba2]"
                                >
                                  • {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* OTHER PAGES */}
                <div className="pt-3">
                  <div className="px-2.5 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Company &amp; Support
                  </div>

                  <Link
                    href="/about-us"
                    className="flex items-center justify-between rounded-xl p-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span>About JGB Trading</span>
                    <FaAngleRight className="text-[10px] text-slate-400" />
                  </Link>

                  <Link
                    href="/frequently-questions"
                    className="flex items-center justify-between rounded-xl p-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span>FAQs &amp; Mineral Grades</span>
                    <FaAngleRight className="text-[10px] text-slate-400" />
                  </Link>

                  <Link
                    href="/contact-us"
                    className="flex items-center justify-between rounded-xl p-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span>Contact Us</span>
                    <FaAngleRight className="text-[10px] text-slate-400" />
                  </Link>

                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between rounded-xl p-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2">
                      <FaHeart className="text-rose-500" /> My Wishlist ({wishlist.length})
                    </span>
                    <FaAngleRight className="text-[10px] text-slate-400" />
                  </Link>

                  <Link
                    href="/cart"
                    className="flex items-center justify-between rounded-xl p-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2">
                      <FaShoppingCart className="text-[#0b4ba2]" /> My Cart ({cart.length})
                    </span>
                    <FaAngleRight className="text-[10px] text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>

            {/* DRAWER FOOTER: DIRECT CONTACT */}
            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <div className="flex gap-2">
                <a
                  href="tel:8810426236"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0b4ba2] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-orange-500"
                >
                  <FaPhoneAlt className="text-xs" /> Call
                </a>

                <a
                  href="https://wa.me/918810426236?text=Hello%20JGB%20Trading,%20I%20am%20interested%20in%20mineral%20powders."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <FaWhatsapp className="text-sm" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
