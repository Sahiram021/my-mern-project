import Link from "next/link";
import InnerPageHero from "../Components/Page-Sections/InnerPageHero";

export default function Thankyou() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <InnerPageHero title="Order Confirmed" />

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-md md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-[#0b4ba2]">
              ✓
            </div>
            <h1 className="mt-6 text-2xl font-extrabold text-[#0f2b5c] sm:text-3xl">
              Your Mineral Order Has Been Placed!
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Thank you for trusting JGB TRADING PRIVATE LIMITED. We have received your order details and our Raipur dispatch team will process it shortly.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 text-left">
              <h2 className="text-lg font-bold text-[#0f2b5c]">Order &amp; Dispatch Summary</h2>
              <div className="mt-5 space-y-3.5 text-sm text-slate-600">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span>Order Reference</span>
                  <span className="font-bold text-[#0f2b5c]">#JGB-CONFIRMED</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span>Status</span>
                  <span className="font-bold text-emerald-600">Confirmed / Processing</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span>Dispatch Origin</span>
                  <span className="font-semibold text-slate-800">Raipur, Chhattisgarh</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Direct Support</span>
                  <a href="tel:8810426236" className="font-bold text-[#0b4ba2] hover:underline">
                    8810426236
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left">
              <h2 className="text-lg font-bold text-[#0f2b5c]">What happens next?</h2>
              <ul className="mt-4 space-y-3 text-xs text-slate-600">
                <li className="flex gap-2.5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#0b4ba2]" />
                  Our dispatch specialist validates the required mesh and packaging grade.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#0b4ba2]" />
                  Material bags are staged at our Mahadev Ghat Rd warehouse.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#0b4ba2]" />
                  Transport docket details will be shared on your registered number.
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/ready-to-ship"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0b4ba2] px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-500"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/my-dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-6 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
                >
                  My Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
