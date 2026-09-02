"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, DollarSign, Calendar } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InnerPageHero from "../../Components/Page-Sections/InnerPageHero";
import AccountMenu from "../../Components/Common/AccountMenu";
import { getOrderDetails } from "../../api-services/orderApi";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const token = useSelector((myStore) => myStore.userStore.token);
  const orderId = params?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getOrderDetails(orderId, token);

      console.log("Order Details Response:", response);

      if (response?.status) {
        setOrder(response.data || response.order || response);
      } else {
        setError(response?.message || "Failed to load order details");
        toast.error("Order details load nahi ho sake");
      }
    } catch (err) {
      console.log("Order Details Error:", err);
      setError(err?.message || "Error fetching order details");
      toast.error("Kuch error aya order details load karte waqt");
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    if (!token) {
      router.push("/login-register");
      return;
    }

    if (orderId) {
      const timer = window.setTimeout(() => {
        void fetchOrderDetails();
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [token, orderId, router, fetchOrderDetails]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white">
      <InnerPageHero title="Order Details" />

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            <AccountMenu />

            <div>
              <div className="mb-6">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b4ba2] hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Orders
                </button>
              </div>

              {loading && (
                <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-[#0b4ba2] mb-3" />
                  <p className="text-sm text-slate-500">Loading order details...</p>
                </div>
              )}

              {error && !loading && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 mb-6">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {!loading && order && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0b4ba2]">Order Date</p>
                        <p className="mt-1 text-base font-bold text-[#0f2b5c]">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0b4ba2]">Status</p>
                        <p className={`mt-1 px-3 py-1 rounded-full text-xs font-bold w-fit ${getStatusColor(order.status)}`}>
                          {order.status || "Pending"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0b4ba2]">Payment</p>
                        <p className={`mt-1 text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus || order.paymentMethod || "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-[#0f2b5c] mb-5 flex items-center gap-2">
                      <Package className="h-5 w-5 text-[#0b4ba2]" />
                      Ordered Mineral Items
                    </h2>

                    <div className="space-y-4">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div key={idx} className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                            <div className="grid md:grid-cols-4 gap-4 items-center">
                              <div className="md:col-span-1">
                                <img
                                  src={item.image || "/images/products/calcium-powder-bag.png"}
                                  alt={item.name || "Product"}
                                  className="w-full h-28 object-contain rounded-lg bg-white p-1 border border-slate-200"
                                />
                              </div>

                              <div className="md:col-span-3">
                                <div className="grid md:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Item</p>
                                    <p className="mt-1 text-sm font-bold text-[#0f2b5c]">{item.name || "Calcium Powder"}</p>
                                  </div>

                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Qty &amp; Price</p>
                                    <p className="mt-1 text-sm text-slate-700">
                                      {item.qty || 1} Bag(s) @ ₹{Number(item.price || 0).toLocaleString('en-IN')}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</p>
                                    <p className="mt-1 text-base font-bold text-[#0b4ba2]">
                                      ₹{((Number(item.price || 0)) * (Number(item.qty || 1))).toLocaleString('en-IN')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">No items in this order</p>
                      )}
                    </div>
                  </div>

                  {order.shippingAddress && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h2 className="text-lg font-bold text-[#0f2b5c] mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-[#0b4ba2]" />
                        Shipping &amp; Delivery Destination
                      </h2>

                      <div className="bg-[#f8fafc] rounded-xl p-5 border border-slate-100 text-sm text-slate-700">
                        <p className="font-bold text-[#0f2b5c]">
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                        </p>
                        <p className="mt-1">{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postal}</p>
                        <p className="mt-2 text-xs text-slate-500">Email: {order.shippingAddress.email} | Phone: {order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-[#0f2b5c] mb-4 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-[#0b4ba2]" />
                      Order Summary
                    </h2>

                    <div className="space-y-2.5 bg-[#f8fafc] rounded-xl p-5 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-800">₹{Number(order.subtotal || order.totalAmount || 0).toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Dispatch / Logistics</span>
                        <span className="font-bold text-emerald-600">Dispatched from Raipur</span>
                      </div>

                      <div className="border-t border-slate-200 pt-3 mt-2 flex justify-between text-base font-bold text-[#0f2b5c]">
                        <span>Total Amount</span>
                        <span className="text-[#0b4ba2]">Rs. {order.totalAmount || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => fetchOrderDetails()}
                      className="flex-1 bg-[#0b4ba2] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-orange-500 transition shadow-md"
                    >
                      Refresh
                    </button>

                    <Link
                      href="/ready-to-ship"
                      className="flex-1 border border-slate-300 text-slate-700 px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl text-center hover:bg-slate-50 transition"
                    >
                      Browse More Products
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
}
