"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { products as fallbackProducts } from "@/app/data/products";
import { fetchCartById } from "@/app/slice/cartSLise";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "@/app/slice/wishlistSlice";
import { buildProductImageUrl } from "@/app/utils/imageUrl";

const tabs = [
  ["featured", "Featured"],
  ["new", "New Arrivals"],
  ["onsale", "Onsale"],
];

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

function getProductSlug(product) {
  if (product?.slug && !String(product.slug).match(/^[0-9a-fA-F]{24}$/)) {
    return product.slug;
  }

  const name = product?.name || product?.title || "";
  if (name) {
    return name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  if (product?.slug) return product.slug;
  return "";
}

export default function NewArrivalsSection({ path, data = [] }) {
  const [activeTab, setActiveTab] = useState("new");
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userStore.token);

  const rawData = Array.isArray(data) && data.length > 0 ? data : fallbackProducts;

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [token, dispatch]);

  const normalizeVal = (val) => String(val || "").toLowerCase().trim();

  const filteredProducts = (() => {
    const filtered = rawData.filter((product) => {
      const pType = normalizeVal(product?.productType || product?.type);
      const badge = normalizeVal(product?.badge);

      if (activeTab === "featured") {
        return (
          pType === "featured" ||
          pType === "fresher" ||
          badge === "featured" ||
          badge === "bestseller" ||
          badge === "best seller" ||
          badge === "premium" ||
          badge === "popular"
        );
      }

      if (activeTab === "onsale") {
        return (
          pType === "on sale" ||
          pType === "onsale" ||
          pType === "sale" ||
          pType === "discount" ||
          badge === "on sale" ||
          badge === "onsale" ||
          badge === "sale" ||
          badge === "discount"
        );
      }

      // "new" / "New Arrivals" tab
      return (
        pType === "new" ||
        pType === "new arrival" ||
        pType === "new arrivals" ||
        badge === "new" ||
        badge === "new arrival" ||
        badge === "new arrivals"
      );
    });

    if (filtered.length > 0) {
      return filtered;
    }

    // Fallback partition if specific tab is empty
    if (activeTab === "featured") {
      return rawData.filter((_, idx) => idx % 3 === 0);
    }
    if (activeTab === "onsale") {
      return rawData.filter((_, idx) => idx % 3 === 2);
    }
    return rawData.filter((_, idx) => idx % 3 === 1);
  })();


  return (
    <section className="bg-[#fafbfc] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
            Our Products
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#0f2b5c] sm:text-4xl">
            Our Calcium &amp; Mineral Powder
          </h2>
          <p className="mt-2 text-sm text-[#64748b]">
            High quality calcium powder, anti-moisture powder &amp; industrial minerals ready for dispatch.
          </p>
        </div>

        {/* TABS + SLIDER NAVIGATION */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="mx-auto sm:mx-0 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {tabs.map(([value, label], index) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value)}
                className={`rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  index ? "ml-1" : ""
                } ${
                  activeTab === value
                    ? "bg-[#0b4ba2] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#0b4ba2]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              type="button"
              aria-label="Previous products"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-[#0b4ba2] hover:text-white active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              type="button"
              aria-label="Next products"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-[#0b4ba2] hover:text-white active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* SWIPER CAROUSEL (2 PRODUCTS ON MOBILE, 3 ON TABLET, 4 ON DESKTOP) */}
        {filteredProducts.length > 0 ? (
          <Swiper
            key={activeTab}
            modules={[Navigation, Autoplay]}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={filteredProducts.length > 4}
            speed={700}
            slidesPerView={2}
            spaceBetween={10}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            onInit={(swiper) => {
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 2, spaceBetween: 14 },
              840: { slidesPerView: 3, spaceBetween: 18 },
              1200: { slidesPerView: 4, spaceBetween: 22 },
            }}
            className="pb-4"
          >
            {filteredProducts.map((obj, index) => (
              <SwiperSlide key={obj._id || index} className="h-auto">
                <ProductCardDiv path={path} productData={obj} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="py-12 text-center text-slate-500">
            No products found in this category.
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCardDiv({ path, productData }) {
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://jgbmtrading.online/api/web/";
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userStore.token);
  const cart = useSelector((state) => state.cartStore.cart || []);
  const wishlist = useSelector((state) => state.wishlistStore?.wishlist || []);

  const cartItem = cart.find((item) => item.productId === productData._id);
  const wishlistItem = wishlist.find(
    (item) => getWishlistProductId(item) === String(productData._id || "")
  );
  const isWishlisted = Boolean(wishlistItem);

  const rawImage = productData?.image || "";
  const productImage = buildProductImageUrl(rawImage, path);

  const productCategory =
    productData?.parentCategory?.name ||
    productData?.category?.name ||
    productData?.category ||
    "Calcium Powder";

  const productSlug = getProductSlug(productData);
  const productUrl = productSlug ? `/product-details/${productSlug}` : "/ready-to-ship";

  const handleWishlist = async () => {
    if (!token) {
      showToast("warning", "Please First Login to use Wishlist");
      return;
    }

    if (wishlistLoading) return;
    setWishlistLoading(true);

    try {
      const result = await dispatch(
        isWishlisted
          ? removeFromWishlist(wishlistItem._id)
          : addToWishlist({
              ...productData,
              image: productImage,
            })
      );

      if (result.payload?.status) {
        await showToast(
          "success",
          result.payload?.message ||
            (isWishlisted ? "Product removed from wishlist" : "Product added to wishlist")
        );
        dispatch(fetchWishlist());
      } else {
        await showToast(
          "warning",
          result.payload?.message || "Unable to update wishlist"
        );
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!token) {
      showToast("warning", "Please First Login to Add to Cart");
      return;
    }

    const cartObj = {
      name: productData.name,
      price: productData.price,
      image: productImage,
      qty: 1,
      productId: productData._id,
    };

    axios
      .post(`${apibaseUrl}cart/add-to-cart`, cartObj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          showToast("success", "Product added to cart!");
          dispatch(fetchCartById());
        } else {
          showToast("warning", finalRes.message || "Failed to add to cart");
        }
      })
      .catch((error) => {
        console.log("Add To Cart Error:", error);
      });
  };

  const updateQty = (nextQty) => {
    if (!token || !cartItem) {
      return;
    }

    if (nextQty <= 0) {
      axios
        .delete(`${apibaseUrl}cart/remove-cart/${cartItem._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.status) {
            dispatch(fetchCartById());
          }
        })
        .catch((error) => {
          console.log("Remove Cart Error:", error);
        });

      return;
    }

    axios
      .put(
        `${apibaseUrl}cart/change-qty/${cartItem._id}`,
        { qty: nextQty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          dispatch(fetchCartById());
        }
      })
      .catch((error) => {
        console.log("Change Quantity Error:", error);
      });
  };

  const displayBadge = productData.productType || productData.badge || "All Grades";
  const numPrice = typeof productData.price === "number" ? productData.price : parseFloat(String(productData.price).replace(/[^0-9.]/g, "")) || 0;
  const numOldPrice = productData.oldPrice || productData.mrp || Math.round(numPrice * 1.35);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={productUrl} className="relative block aspect-[1.15/1] sm:aspect-[1.28/1] overflow-hidden bg-slate-50">
        <img
          alt={productData.name || "Product"}
          width={420}
          height={328}
          className="h-full w-full object-contain p-2 sm:p-3 transition-transform duration-500 hover:scale-105"
          src={productImage}
        />
        <span className={`absolute left-2 top-2 sm:left-3 sm:top-3 rounded px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wide text-white shadow ${
          displayBadge.toLowerCase().includes("sale")
            ? "bg-rose-600"
            : displayBadge.toLowerCase().includes("new")
            ? "bg-emerald-600"
            : "bg-[#0b4ba2]"
        }`}>
          {displayBadge}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <div className="text-center">
          <span className="block truncate text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            {productCategory}
          </span>
          <h3 className="mt-1 line-clamp-2 h-8 sm:h-10 text-xs sm:text-sm font-bold leading-tight sm:leading-snug text-[#0f2b5c]">
            <Link href={productUrl} className="transition hover:text-[#0b4ba2]">
              {productData.name}
            </Link>
          </h3>
        </div>

        <div className="mt-1.5 sm:mt-2 text-center">
          <p className="text-xs sm:text-sm">
            <span className="mr-1.5 text-[10px] sm:text-xs text-slate-400 line-through">
              ₹{numOldPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs sm:text-sm font-black text-[#0b4ba2]">
              ₹{numPrice.toLocaleString('en-IN')}
            </span>
          </p>
        </div>

        <div className="mt-auto pt-2 sm:pt-3">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {cartItem && cartItem.qty > 0 ? (
              <div className="flex h-8 sm:h-10 flex-1 items-center justify-between overflow-hidden rounded-lg sm:rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => updateQty(cartItem.qty - 1)}
                  className="flex h-full w-7 sm:w-10 items-center justify-center text-sm sm:text-lg font-bold text-slate-700 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{cartItem.qty}</span>
                <button
                  type="button"
                  onClick={() => updateQty(cartItem.qty + 1)}
                  className="flex h-full w-7 sm:w-10 items-center justify-center text-sm sm:text-lg font-bold text-slate-700 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                type="button"
                className="h-8 sm:h-10 flex-1 rounded-lg sm:rounded-xl bg-[#0b4ba2] px-2 sm:px-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-orange-500 active:scale-95"
              >
                Add To Cart
              </button>
            )}

            <button
              type="button"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl transition active:scale-95 ${
                isWishlisted
                  ? "bg-red-50 text-red-500 border border-red-200"
                  : "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <Heart
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill={isWishlisted ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
