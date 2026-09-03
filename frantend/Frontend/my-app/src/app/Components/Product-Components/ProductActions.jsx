"use client";

import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { fetchCartById } from "../../slice/cartSLise";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../../slice/wishlistSlice";
import { toggleWishlist as toggleWishlistLocal } from "../../utils/store";

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

export default function ProductActions({ product }) {
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const dispatch = useDispatch();
  const reduxToken = useSelector((state) => state.userStore?.token);
  const wishlist = useSelector((state) => state.wishlistStore?.wishlist || []);
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://jgbmtrading.online/api/web/";

  const token = reduxToken || (typeof window !== "undefined" ? Cookies.get("token") : "");

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist());
      dispatch(fetchCartById());
    }
  }, [token, dispatch]);

  function flash(value) {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 2000);
  }

  const prodId = String(product?._id || product?.id || "");
  const wishlistItem = wishlist.find((item) => {
    const itemId = getWishlistProductId(item);
    return (prodId && itemId === prodId) || (product?.slug && item?.slug === product?.slug);
  });
  const isWishlisted = Boolean(wishlistItem);

  const handleAddToCart = async () => {
    if (!token) {
      await showToast("warning", "Please login to add items to your cart");
      flash("Please login to add items to cart");
      return;
    }

    if (cartLoading) return;
    setCartLoading(true);

    const numPrice =
      typeof product.price === "number"
        ? product.price
        : parseFloat(String(product.price || 0).replace(/[^0-9.]/g, "")) || 0;

    const cartObj = {
      name: product.name || product.title,
      price: numPrice,
      image: product.image,
      qty: qty,
      productId: product._id || product.id,
      slug: product.slug,
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
        await showToast(
          "success",
          res.data?.message || `${product.name || product.title || "Product"} added to cart!`
        );
        flash(`${qty} item(s) added to cart`);
        dispatch(fetchCartById());
      } else {
        await showToast("warning", res.data?.message || "Could not add to cart");
        flash(res.data?.message || "Could not add to cart");
      }
    } catch (err) {
      console.error("Cart error:", err);
      await showToast("error", "Error adding product to cart");
      flash("Error adding to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      await showToast("warning", "Please login to manage your wishlist");
      flash("Please login to use wishlist");
      return;
    }

    if (wishlistLoading) return;
    setWishlistLoading(true);

    try {
      const result = await dispatch(
        isWishlisted
          ? removeFromWishlist(wishlistItem._id)
          : addToWishlist({
              ...product,
              image: product.image,
            })
      );

      if (result.payload?.status) {
        const msg =
          result.payload?.message ||
          (isWishlisted ? "Product removed from wishlist" : "Product added to wishlist");
        await showToast("success", msg);
        flash(msg);
        dispatch(fetchWishlist());
        toggleWishlistLocal(product);
      } else {
        await showToast("warning", result.payload?.message || "Unable to update wishlist");
        flash(result.payload?.message || "Unable to update wishlist");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      await showToast("error", "Error updating wishlist");
      flash("Error updating wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* QUANTITY CONTROLLER */}
        <div className="flex h-12 w-32 items-center rounded-xl border border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            className="flex h-full w-10 items-center justify-center text-lg font-bold text-slate-600 hover:bg-slate-100 hover:text-[#0b4ba2]"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="grid flex-1 place-items-center text-sm font-bold text-[#0f2b5c]">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((value) => value + 1)}
            className="flex h-full w-10 items-center justify-center text-lg font-bold text-slate-600 hover:bg-slate-100 hover:text-[#0b4ba2]"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* ADD TO CART BUTTON */}
        <button
          type="button"
          disabled={cartLoading}
          onClick={handleAddToCart}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0b4ba2] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500 disabled:opacity-70"
        >
          {cartLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          {cartLoading ? "Adding..." : "Add To Cart"}
        </button>

        {/* WISHLIST BUTTON */}
        <button
          type="button"
          disabled={wishlistLoading}
          onClick={handleWishlistToggle}
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-6 text-xs font-bold uppercase tracking-wider transition ${
            isWishlisted
              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-[#0b4ba2] hover:text-[#0b4ba2]"
          } disabled:opacity-70`}
        >
          {wishlistLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-red-500"
              }`}
            />
          )}
          {isWishlisted ? "Wishlisted" : "Wishlist"}
        </button>
      </div>
      {message && <p className="mt-3 text-xs font-bold text-[#0b4ba2]">{message}</p>}
    </div>
  );
}
