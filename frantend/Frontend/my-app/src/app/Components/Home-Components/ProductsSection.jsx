"use client";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { products as fallbackProducts } from "@/app/data/products";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "@/app/slice/wishlistSlice";
import { buildProductImageUrl } from "@/app/utils/imageUrl";

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
  return String(item?.productId?._id || item?.productId || "");
}

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

  if (entity?.slug) return entity.slug;
  return "";
}

export default function ProductsSection({ path, data = [] }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userStore.token);

  const displayProducts = Array.isArray(data) && data.length > 0 ? data : fallbackProducts;

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [token, dispatch]);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[1640px] px-4 lg:px-6">
        <div className="relative mb-8 flex items-center justify-center">
          <div className="flex min-w-0 w-full max-w-[950px] items-center gap-6">
            <span className="hidden h-px flex-1 bg-[#e7e7e7] md:block" />
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
                Our Products
              </span>
              <h2 className="mt-1 shrink-0 text-center text-[28px] font-extrabold text-[#0f2b5c] md:text-[34px]">
                Bestselling Mineral Products
              </h2>
            </div>
            <span className="hidden h-px flex-1 bg-[#e7e7e7] md:block" />
          </div>

          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[#4a5563]">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              type="button"
              aria-label="Previous products"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:bg-[#0b4ba2] hover:text-white active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              type="button"
              aria-label="Next products"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:bg-[#0b4ba2] hover:text-white active:scale-95"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {displayProducts.length > 0 ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={displayProducts.length > 4}
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
              1024: { slidesPerView: 3, spaceBetween: 18 },
              1280: { slidesPerView: 4, spaceBetween: 22 },
            }}
            className="pb-4"
          >
            {displayProducts.map((product, index) => (
              <SwiperSlide key={product._id || index} className="h-auto">
                <ProductCard path={path} productData={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="py-10 text-center">
            <h2 className="text-xl text-gray-500">No Products Found</h2>
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ path, productData }) {
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userStore.token);
  const wishlist = useSelector((state) => state.wishlistStore?.wishlist || []);

  const rawImage = productData?.image || "";
  const productImage = buildProductImageUrl(rawImage, path);

  const productCategory =
    productData?.parentCategory?.name ||
    productData?.category?.name ||
    productData?.category ||
    "Calcium Powder";

  const productBadge = productData?.productType || productData?.badge || "Popular";
  const numPrice = typeof productData?.price === "number" ? productData.price : parseFloat(String(productData?.price || 0).replace(/[^0-9.]/g, "")) || 0;
  const numOldPrice = productData?.oldPrice || productData?.mrp || Math.round(numPrice * 1.35);
  const productSlug = getEntitySlug(productData);
  const productHref = productSlug ? `/product-details/${productSlug}` : "/ready-to-ship";
  const categorySlug = getEntitySlug(productData?.parentCategory);
  const categoryHref = categorySlug ? `/categories/${categorySlug}` : "/ready-to-ship";

  const wishlistItem = wishlist.find(
    (item) => getWishlistProductId(item) === String(productData?._id || "")
  );

  const isWishlisted = Boolean(wishlistItem);

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
        await showToast("warning", result.payload?.message || "Unable to update wishlist");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={productHref} className="relative block aspect-[1.15/1] sm:aspect-[1.28/1] overflow-hidden bg-slate-50">
        <img
          src={productImage || "/powder-images/jgb-anti-moisture-bag-25kg.jpg"}
          alt={productData?.name || "Product"}
          width={420}
          height={328}
          className="h-full w-full object-contain p-2 sm:p-3 transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/powder-images/jgb-anti-moisture-bag-25kg.jpg";
          }}
        />
        <span className={`absolute left-2 top-2 sm:left-3 sm:top-3 rounded px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wide text-white shadow ${
          productBadge.toLowerCase().includes("sale")
            ? "bg-rose-600"
            : productBadge.toLowerCase().includes("new")
            ? "bg-emerald-600"
            : "bg-[#0b4ba2]"
        }`}>
          {productBadge}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <div className="text-center">
          <Link
            href={categoryHref}
            className="block truncate text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 transition hover:text-[#0b4ba2]"
          >
            {productCategory}
          </Link>

          <h3 className="mt-1 line-clamp-2 h-8 sm:h-10 text-xs sm:text-sm font-bold leading-tight sm:leading-snug text-[#0f2b5c]">
            <Link href={productHref} className="transition hover:text-[#0b4ba2]">
              {productData?.name}
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
            <Link
              href={productHref}
              className="flex-1 rounded-lg sm:rounded-xl bg-slate-100 py-2 sm:py-2.5 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-[#0b4ba2] hover:text-white active:scale-95"
            >
              Details
            </Link>

            <button
              type="button"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl transition active:scale-95 ${
                isWishlisted
                  ? "bg-red-50 text-red-500 border border-red-200"
                  : "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500"
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
