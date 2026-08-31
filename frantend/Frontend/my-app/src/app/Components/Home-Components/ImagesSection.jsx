import Link from "next/link";
import { FaWhatsapp, FaArrowRight, FaPhoneAlt, FaCheckCircle, FaShieldAlt } from "react-icons/fa";

export default function ImagesSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061a38] via-[#092752] to-[#061730] py-14 text-white md:py-20">
      {/* GLOW EFFECTS */}
      <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          
          {/* LEFT: TEXT & ACTIONS */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-orange-300 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
              JGB TRADING PRIVATE LIMITED
            </div>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Active Anti-Moisture &amp; <br />
              <span className="bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent">
                Calcium Mineral Powder
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              All types of grades are available for industrial, polymer, rubber, paints, and manufacturing applications. Sourced and processed with certified laboratory purity in Raipur, Chhattisgarh.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs font-semibold text-blue-100">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                <span>Zero Moisture Retention (&lt;0.05%)</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                <span>Active CaO Content &gt;82%</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                <span>Eliminates Fish Eyes &amp; Gas Bubbles</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                <span>Ready Stock on Mahadev Ghat Rd, Raipur</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/ready-to-ship"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0b4ba2] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-900/40 transition duration-300 hover:bg-[#f97316] hover:scale-105"
              >
                Explore Products
                <FaArrowRight className="text-xs" />
              </Link>

              <a
                href="https://wa.me/918810426236?text=Hello%20JGB%20Trading,%20I%20need%20details%20for%20Calcium%20and%20Anti%20Moisture%20Powder."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition duration-300 hover:border-white hover:bg-white/20"
              >
                <FaWhatsapp className="text-base text-emerald-400" />
                WhatsApp Enquiry
              </a>

              <a
                href="tel:8810426236"
                className="inline-flex items-center gap-2 rounded-xl border border-orange-400/30 bg-orange-500/20 px-5 py-3 text-xs font-bold uppercase tracking-wider text-orange-200 transition duration-300 hover:bg-orange-500 hover:text-white"
              >
                <FaPhoneAlt className="text-xs" />
                8810426236
              </a>
            </div>

            <div className="mt-5 text-xs text-slate-300">
              📍 Mahadev Ghat Rd Raipur, Raipur 492001, Chhattisgarh
            </div>
          </div>

          {/* RIGHT: 3D PRODUCT BAG IMAGE */}
          <div className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-2 shadow-2xl backdrop-blur-sm">
              <img
                src="/images/banners/anti-moisture-powder-banner.jpg"
                alt="JGB Trading Anti Moisture Powder"
                className="w-full rounded-2xl object-cover aspect-[4/3] shadow-lg"
              />

              <div className="absolute right-4 top-4 rounded-xl border border-white/20 bg-[#071d3b]/90 px-3 py-1.5 shadow-lg backdrop-blur-md">
                <span className="text-[11px] font-bold text-orange-300">
                  ★ Active Desiccant Grade
                </span>
              </div>

              <div className="absolute bottom-4 left-4 rounded-xl border border-white/20 bg-[#071d3b]/90 px-3 py-1.5 shadow-lg backdrop-blur-md">
                <span className="text-[11px] font-bold text-emerald-300">
                  ✓ 25 KG Vacuum Sealed PP Bags
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
