import Link from "next/link";
import { FaWhatsapp, FaPhoneAlt, FaTruck, FaFileContract, FaCheck } from "react-icons/fa";

export default function QuickQuoteSection() {
  return (
    <section className="bg-gradient-to-br from-[#071d3b] via-[#0b4ba2] to-[#0a2540] py-16 text-white md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-orange-400 backdrop-blur">
              Direct Manufacturer Pricing
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              Request Free Mineral Samples Or Wholesale Truckload Quotation
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-blue-100 md:text-base">
              Whether you require 1 Metric Ton test batch or 500+ MT recurring monthly shipments, JGB TRADING PRIVATE LIMITED guarantees competitive direct-from-source wholesale rates.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-semibold text-blue-100">
              <div className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                <span>Free 2 KG lab testing samples available</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                <span>Certificate of Analysis (COA) with each batch</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                <span>Immediate loading from Mahadev Ghat Rd, Raipur</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                <span>Flexible payment &amp; credit terms for verified buyers</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
              <h3 className="text-xl font-bold">Fast Direct Quote</h3>
              <p className="mt-1 text-xs text-blue-200">
                Connect instantly with our Raipur technical sales desk:
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href="https://wa.me/918810426236?text=Hi%20JGB%20Trading,%20I%20need%20a%20bulk%20quote%20for%20Calcium%20/%20Anti-Moisture%20Powder."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-emerald-600"
                >
                  <FaWhatsapp className="text-lg" />
                  Quote on WhatsApp (8810426236)
                </a>

                <a
                  href="tel:8810426236"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-orange-600"
                >
                  <FaPhoneAlt />
                  Call Now: 8810426236
                </a>

                <Link
                  href="/contact-us"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
                >
                  <FaFileContract />
                  Fill Inquiry Form
                </Link>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 text-center text-[11px] text-blue-200">
                Mahadev Ghat Rd, Raipur 492001, Chhattisgarh
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
