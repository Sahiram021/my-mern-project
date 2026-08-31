"use client";

import Link from "next/link";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import InnerPageHero from "../Components/Page-Sections/InnerPageHero";
import AccountMenu from "../Components/Common/AccountMenu";
import { getOrders } from "../api-services/orderApi";

export default function OrderPage() {
  const router = useRouter();

  const token = useSelector((myStore) => myStore.userStore.token);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getOrders(token);

      console.log("Orders Response:", response);

      if (response?.status) {
        setOrders(response.data || response.orders || []);
      } else {
        setOrders([]);
        setError(response?.message || "Failed to load orders");
      }
    } catch (err) {
      console.log("Order Error:", err);

      setError(err?.message || "Error fetching orders");

      toast.error("Kuch error aaya order load karte waqt");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      router.push("/login-register");
      return;
    }

    fetchOrders();
  }, [token, router, fetchOrders]);

  const handleRefresh = () => {
    fetchOrders();
  };

  return (
    <>
      <div className="bg-white">
        <InnerPageHero title="My Orders" />

        <section className="px-4 py-14 md:py-20">
          <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[300px_1fr]">

            {/* ACCOUNT MENU */}
            <AccountMenu />

            {/* MAIN */}
            <div>
              <div className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b4ba2]">
                    JGB Account Orders
                  </p>
                  <h1 className="mt-2 text-2xl font-extrabold text-[#0f2b5c] md:text-3xl">
                    Order &amp; Dispatch History
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:border-[#0b4ba2] hover:text-[#0b4ba2] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </button>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {loading && (
                <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-12 text-center">
                  <p className="text-sm text-slate-500">
                    Loading Orders...
                  </p>
                </div>
              )}

              {!loading && orders.length === 0 && !error && (
                <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-12 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-[#0b4ba2]" />

                  <h2 className="mt-4 text-xl font-bold text-[#0f2b5c]">
                    No Orders Found
                  </h2>

                  <p className="mt-2 text-xs text-slate-500">
                    You have not placed any mineral product orders yet.
                  </p>

                  <Link
                    href="/ready-to-ship"
                    className="mt-6 inline-flex rounded-xl bg-[#0b4ba2] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-orange-500"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}

              {!loading && orders.length > 0 && (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const orderId = order?._id || order?.id;

                    return (
                      <div
                        key={orderId}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                      >
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-[#0b4ba2]">
                              Order ID
                            </div>
                            <div className="mt-1 break-all text-sm font-semibold text-slate-800">
                              {orderId}
                            </div>
                          </div>

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-[#0b4ba2]">
                            {order?.status || "Pending"}
                          </span>
                        </div>

                        <div className="text-sm text-slate-600">
                          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                            Products:
                          </div>

                          <ul className="space-y-2">
                            {order?.items && order.items.length > 0 ? (
                              order.items.map((item, idx) => {
                                const quantity =
                                  item?.qty ||
                                  item?.quantity ||
                                  1;

                                const price =
                                  Number(item?.price) || 0;

                                return (
                                  <li
                                    key={item?._id || idx}
                                    className="flex justify-between gap-4 border-b border-slate-50 pb-2 text-xs"
                                  >
                                    <span>
                                      {item?.name || "Calcium Powder"} x{" "}
                                      {quantity}
                                    </span>

                                    <span className="font-semibold text-slate-800">
                                      Rs. {price * quantity}
                                    </span>
                                  </li>
                                );
                              })
                            ) : (
                              <li className="text-xs text-slate-400">
                                Powder Material
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                          <div>
                            <div className="text-xs text-slate-500">Total Amount</div>
                            <div className="mt-0.5 text-base font-bold text-[#0f2b5c]">
                              Rs. {order?.totalAmount || 0}
                            </div>
                          </div>

                          <Link
                            href={`/order-details/${orderId}`}
                            className="text-xs font-bold text-[#0b4ba2] hover:underline"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <ToastContainer position="top-right" />
    </>
  );
}
