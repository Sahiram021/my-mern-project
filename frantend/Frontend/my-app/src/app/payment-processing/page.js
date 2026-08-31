"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InnerPageHero from "../Components/Page-Sections/InnerPageHero";
import { clearCart, formatRupees, getOrder, saveOrder } from "../utils/store";

export default function PaymentProcessingPage() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOrder(getOrder()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function completePayment() {
    if (!order) return;

    setProcessing(true);
    window.setTimeout(() => {
      const paidOrder = { ...order, status: "Paid", paidAt: new Date().toLocaleDateString() };
      saveOrder(paidOrder);
      clearCart();
      router.push("/my-dashboard");
    }, 1200);
  }

  return (
    <div className="bg-white">
      <InnerPageHero title="Payment Processing" />

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h1 className="text-2xl font-bold text-[#0f2b5c]">Complete Your Payment</h1>
            <p className="mt-2 text-sm text-slate-500">
              Verify your order details below to process payment for JGB TRADING PRIVATE LIMITED.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b4ba2]">UPI Payment</p>
                <p className="mt-2 text-lg font-bold text-[#0f2b5c]">jgbtrading@upi</p>
                <p className="mt-1 text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b4ba2]">Bank Transfer / Card</p>
                <p className="mt-2 text-lg font-bold text-[#0f2b5c]">NEFT / RTGS / Card</p>
                <p className="mt-1 text-xs text-slate-500">Commercial &amp; Industrial Invoice Transfer</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={completePayment}
                disabled={!order || processing}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0b4ba2] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? "Processing..." : "Pay Now"}
              </button>
              <Link
                href="/checkout"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 px-6 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50"
              >
                Back To Checkout
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-[#0f2b5c]">Order Summary</h2>
            {order ? (
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-semibold text-slate-800">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-semibold uppercase text-slate-800">{order.payment}</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  {order.items?.map((item) => (
                    <div key={item.slug || item.name} className="mb-3 flex justify-between gap-4">
                      <span>{item.title || item.name} x {item.qty}</span>
                      <span className="font-semibold text-slate-800">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-[#0f2b5c]">
                  <span>Total Amount</span>
                  <span>{formatRupees(order.total)}</span>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">No pending order found.</p>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

