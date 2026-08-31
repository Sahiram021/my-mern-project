"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import InnerPageHero from "../Components/Page-Sections/InnerPageHero";
import AccountMenu from "../Components/Common/AccountMenu";
import { fetchCartById } from "../slice/cartSLise";
import { fetchWishlist, removeFromWishlist } from "../slice/wishlistSlice";

export default function WishlistPage() {
  const [message, setMessage] = useState("");
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const token = useSelector((myAllstore) => myAllstore.userStore.token);
  const { wishlist } = useSelector((myAllstore) => myAllstore.wishlistStore);

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [token, dispatch]);

  function flash(value) {
    setMessage(value);
    window.setTimeout(() => {
      setMessage("");
    }, 1400);
  }

  async function moveToCart(item) {
    if (!token) {
      flash("Please First Login");
      return;
    }

    const cartObj = {
      name: item.name,
      price: item.price,
      image: item.image,
      qty: 1,
      productId: item.productId?._id || item.productId,
      slug: item.slug,
      category: item.category,
    };

    try {
      const res = await axios.post(`${apibaseUrl}cart/add-to-cart`, cartObj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.status) {
        dispatch(fetchCartById());
        flash(`${item.name} added to cart`);
      } else {
        flash(res.data?.message || "Unable to add product to cart");
      }
    } catch (error) {
      console.log("Add Wishlist Item To Cart Error:", error);
      flash("Unable to add product to cart");
    }
  }

  async function handleRemove(id) {
    const result = await dispatch(removeFromWishlist(id));

    if (removeFromWishlist.fulfilled.match(result) && result.payload?.status) {
      flash(result.payload?.message || "Product removed from wishlist");
    } else {
      flash(result.payload?.message || "Unable to remove product from wishlist");
    }
  }

  return (
    <div className="bg-white">
      <InnerPageHero title="Wishlist" />

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[300px_1fr]">
          <AccountMenu />

          <div>
            {message && (
              <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-[#0b4ba2]">
                {message}
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {wishlist.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Availability</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                      {wishlist.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <img
                                src={item.image}
                                alt={item.name || "Product"}
                                width={80}
                                height={80}
                                className="h-20 w-20 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100"
                              />

                              <div>
                                <Link
                                  href={`/product-details/${(item.slug && !String(item.slug).match(/^[0-9a-fA-F]{24}$/)) ? item.slug : (item.name || "calcium-powder").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}`}
                                  className="text-base font-bold text-[#0f2b5c] transition hover:text-[#0b4ba2]"
                                >
                                  {item.name}
                                </Link>

                                <p className="mt-1 text-xs text-slate-500">
                                  {item.category}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 font-semibold text-slate-700">₹{Number(item.price || 0).toLocaleString('en-IN')}</td>

                          <td className="px-6 py-5 font-bold text-emerald-600">In Stock</td>

                          <td className="px-6 py-5">
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => moveToCart(item)}
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0b4ba2] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-orange-500"
                              >
                                Add To Cart
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemove(item._id)}
                                className="text-xs font-bold text-red-500 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <h2 className="text-2xl font-bold text-[#0f2b5c]">
                    Your wishlist is empty
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    Explore our Calcium and Anti-Moisture Powder products to add items here.
                  </p>

                  <Link
                    href="/ready-to-ship"
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#0b4ba2] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-orange-500"
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/cart"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 px-8 text-xs font-bold uppercase tracking-wider text-[#0f2b5c] transition hover:bg-slate-50 hover:border-[#0b4ba2]"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
