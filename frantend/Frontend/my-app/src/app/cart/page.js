"use client";

import Link from "next/link";
import { useEffect } from "react";
import InnerPageHero from "../Components/Page-Sections/InnerPageHero";
import AccountMenu from "../Components/Common/AccountMenu";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { fetchCartById } from "../slice/cartSLise";

export default function CartPage() {
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL;

  const token = useSelector(
    (myAllstore) => myAllstore.userStore.token
  );

  const { cart } = useSelector(
    (myAllstore) => myAllstore.cartStore
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchCartById());
    }
  }, [token, dispatch]);

  const deleteCartItem = async (id) => {
    try {
      const { default: iziToast } = await import("izitoast");

      const res = await axios.delete(
        `${apibaseUrl}cart/remove-cart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const finalRes = res.data;

      if (finalRes.status) {
        iziToast.success({
          message: finalRes.message,
          position: "topRight",
          title: "Success",
        });

        dispatch(fetchCartById());
      }
    } catch (error) {
      console.log("Delete Cart Error:", error);
    }
  };

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  return (
    <div className="bg-white">
      <InnerPageHero title="Cart" />

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[300px_1fr]">
          <AccountMenu />

          <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {cart.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Qty</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                      {cart.map((item) => (
                        <CartItemRow
                          key={item._id}
                          item={item}
                          deleteCartItem={deleteCartItem}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <h2 className="text-2xl font-bold text-[#0f2b5c]">
                    Your cart is empty
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    Add Calcium and Anti-Moisture Powder products to your cart.
                  </p>

                  <Link
                    href="/ready-to-ship"
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#0b4ba2] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-orange-500"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>

            <aside className="sticky top-20 h-fit rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0f2b5c]">
                Cart Totals
              </h2>

              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Freight / Dispatch</span>
                  <span className="font-bold text-emerald-600">Ready for Dispatch</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-bold text-[#0f2b5c]">
                  <span>Total</span>
                  <span>
                    ₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Link
                href={cart.length ? "/checkout" : "/ready-to-ship"}
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#0b4ba2] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500"
              >
                {cart.length
                  ? "Proceed To Checkout"
                  : "Shop Powder Products"}
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function CartItemRow({ item, deleteCartItem }) {
  const dispatch = useDispatch();

  const ChangeQty = async (type) => {
    try {
      const { default: iziToast } = await import("izitoast");
      const apibaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const id = item._id;

      let FinalQty = item.qty;

      if (type === "+" && item.qty < 50) {
        FinalQty = item.qty + 1;
      }

      if (type === "-" && item.qty > 1) {
        FinalQty = item.qty - 1;
      }

      if (FinalQty === item.qty) {
        return;
      }

      const res = await axios.put(
        `${apibaseUrl}cart/change-qty/${id}`,
        {
          qty: FinalQty,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const finalRes = res.data;

      if (finalRes.status) {
        iziToast.success({
          message: finalRes.message,
          position: "topRight",
          title: "Success",
        });

        dispatch(fetchCartById());
      }
    } catch (error) {
    }
  };

  return (
    <tr className="hover:bg-slate-50/50">
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

      <td className="px-6 py-5 font-semibold text-slate-700">
        ₹{Number(item.price || 0).toLocaleString('en-IN')}
      </td>

      <td className="px-6 py-5">
        <div className="flex h-9 w-28 items-center rounded-lg border border-slate-200 bg-white">
          <button
            className="flex h-full w-9 items-center justify-center font-bold text-slate-600 hover:bg-slate-100 hover:text-[#0b4ba2]"
            onClick={() => ChangeQty("-")}
            type="button"
          >
            -
          </button>

          <span className="grid flex-1 place-items-center text-xs font-bold text-slate-800">
            {item.qty}
          </span>

          <button
            className="flex h-full w-9 items-center justify-center font-bold text-slate-600 hover:bg-slate-100 hover:text-[#0b4ba2]"
            onClick={() => ChangeQty("+")}
            type="button"
          >
            +
          </button>
        </div>
      </td>

      <td className="px-6 py-5 font-bold text-[#0f2b5c]">
        ₹{(
          Number(item.price || 0) *
          Number(item.qty || 0)
        ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </td>

      <td className="px-6 py-5">
        <button
          type="button"
          onClick={() => deleteCartItem(item._id)}
          className="text-xs font-bold text-red-500 hover:underline"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}