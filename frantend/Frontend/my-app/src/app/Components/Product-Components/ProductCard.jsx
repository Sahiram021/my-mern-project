"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { buildProductImageUrl } from "../../utils/imageUrl";
import { fetchCartById } from "../../slice/cartSLise";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../../slice/wishlistSlice";
import {
  addToCart as addToCartLocal,
  toggleWishlist as toggleWishlistLocal,
} from "../../utils/store";

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

export default function ProductCard({ product, compact = false }) {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const reduxToken = useSelector((state) => state.userStore?.token);
  const wishlist = useSelector((state) => state.wishlistStore?.wishlist || []);
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://jgbmtrading.online/api/web/";

  const token = reduxToken || (typeof window !== "undefined" ? Cookies.get("token") : "");

  function showMessage(value) {
    setMessage(value);
    window.setTimeout(() => {
      setMessage("");
    }, 1600);
  }

  const productName = product.name || product.title || "Calcium Powder";

  const rawSlug = product.slug && !String(product.slug).match(/^[0-9a-fA-F]{24}$/) ? product.slug : "";
  const productSlug =
    rawSlug ||
    productName
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const productHref = productSlug ? `/product-details/${productSlug}` : "/ready-to-ship";
  const numPrice = typeof product.price === "number" ? product.price : parseFloat(String(product.price || 0).replace(/[^0-9.]/g, "")) || 0;
  const productImage = buildProductImageUrl(product.image, product.base_url);
  const productWithImage = {
    ...product,
    image: productImage,
  };

  const prodId = String(product?._id || product?.id || "");
  const wishlistItem = wishlist.find((item) => {
    const itemId = getWishlistProductId(item);
    return (prodId && itemId === prodId) || (product?.slug && item?.slug === product?.slug);
  });
  const isWishlisted = Boolean(wishlistItem);

  const handleWishlistClick = async () => {
    if (!token) {
      await showToast("warning", "Please login to manage your wishlist");
      showMessage("Please login to use wishlist");
      return;
    }

    try {
      const result = await dispatch(
        isWishlisted
          ? removeFromWishlist(wishlistItem._id)
          : addToWishlist({
              ...productWithImage,
              image: productImage,
            })
      );

      if (result.payload?.status) {
        const msg =
          result.payload?.message ||
          (isWishlisted ? "Removed from wishlist" : "Added to wishlist");
        await showToast("success", msg);
        showMessage(msg);
        dispatch(fetchWishlist());
        toggleWishlistLocal(productWithImage);
      } else {
        await showToast("warning", result.payload?.message || "Unable to update wishlist");
        showMessage(result.payload?.message || "Unable to update wishlist");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      showMessage("Error updating wishlist");
    }
  };

  const handleAddToCartClick = async () => {
    if (!token) {
      await showToast("warning", "Please login to add items to your cart");
      showMessage("Please login to add to cart");
      return;
    }

    const cartObj = {
      name: productName,
      price: numPrice,
      image: productImage,
      qty: 1,
      productId: product._id || product.id,
      slug: productSlug,
      category:
        product.parentCategory?.name ||
        product.category?.name ||
        product.category ||
        "Calcium Powder",
    };

    try {
      const res = await axios.post(`${apibaseUrl}cart/add-to-cart`, cartObj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.status || res.data?.success) {
        await showToast("success", `${productName} added to cart!`);
        showMessage("Added to cart");
        dispatch(fetchCartById());
        addToCartLocal(productWithImage, 1);
      } else {
        await showToast("warning", res.data?.message || "Could not add to cart");
        showMessage(res.data?.message || "Could not add to cart");
      }
    } catch (err) {
      console.error("Cart error:", err);
      await showToast("error", "Error adding product to cart");
      showMessage("Error adding to cart");
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:shadow-lg">
      <Link
        href={productHref}
        className={`relative block overflow-hidden bg-slate-50 ${
          compact ? "aspect-[1.15/1] sm:aspect-[1.28/1]" : "aspect-[1.15/1] sm:aspect-[1.28/1]"
        }`}
      >
        <img
          src={productImage || "/powder-images/jgb-anti-moisture-bag-25kg.jpg"}
          alt={productName}
          width={420}
          height={328}
          className="h-full w-full object-contain p-2 sm:p-3 transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/powder-images/jgb-anti-moisture-bag-25kg.jpg";
          }}
        />

        {product.badge && (
          <span className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wide text-white shadow bg-[#0b4ba2]">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-5">
        <div className="text-center">
          {product.category && (
            <span className="block truncate text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
              {typeof product.category === "object" ? product.category.name : product.category}
            </span>
          )}

          <h3 className="mt-1 line-clamp-2 h-8 sm:h-11 text-xs sm:text-base font-bold text-[#0f2b5c] leading-tight sm:leading-snug">
            <Link
              href={productHref}
              className="transition hover:text-[#0b4ba2]"
            >
              {productName}
            </Link>
          </h3>
        </div>

        <div className="mt-1.5 sm:mt-3 text-center">
          <p className="text-xs sm:text-lg font-black text-[#0b4ba2]">
            ₹{numPrice.toLocaleString('en-IN')}
            <span className="ml-1 text-[10px] sm:text-xs font-semibold text-slate-700">
              / {product.size || "25 KG Bag"}
            </span>
          </p>
        </div>

        <div className="mt-auto pt-2 sm:pt-4">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <button
              type="button"
              aria-label={`Add ${productName} to wishlist`}
              onClick={handleWishlistClick}
              className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl transition active:scale-95 ${
                isWishlisted
                  ? "bg-red-50 text-red-500 border border-red-200"
                  : "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
                strokeWidth={2}
              />
            </button>

            <button
              type="button"
              onClick={handleAddToCartClick}
              className="h-8 sm:h-10 flex-1 rounded-lg sm:rounded-xl bg-[#0b4ba2] px-2 sm:px-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-orange-500 active:scale-95"
            >
              Add To Cart
            </button>
          </div>

          {message && (
            <p className="mt-1.5 text-center text-[10px] sm:text-xs font-bold text-[#0b4ba2]">
              {message}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
