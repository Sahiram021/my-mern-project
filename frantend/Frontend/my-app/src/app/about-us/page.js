import Link from "next/link";
import React from "react";
import {
  FaShieldAlt,
  FaChartLine,
  FaHandshake,
  FaBullseye,
  FaEye,
  FaAward,
  FaTruck,
  FaTag,
  FaBox,
  FaHeadset,
  FaPhoneAlt,
} from "react-icons/fa";

export const metadata = {
  title: "About Us | JGB TRADING PRIVATE LIMITED",
  description:
    "JGB Trading Private Limited is a trusted name in the mineral industry, committed to delivering high quality mineral powders across India.",
};

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#fafbfc] text-[#0f2b5c]">
      {/* ==================================================
          ABOUT US HERO (MATCHING SCREENSHOT 4)
      ================================================== */}
      <section className="relative overflow-hidden bg-[#071d3b] py-16 text-white md:py-24">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#071d3b] via-[#071d3b]/90 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
          <span className="rounded-full bg-blue-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-blue-300 backdrop-blur-sm">
            About Us
          </span>

          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Building Trust. <br />
            <span className="text-[#38bdf8]">Delivering Quality.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            JGB Trading Private Limited is a trusted name in the mineral industry, committed to delivering high quality
            mineral powders that meet the diverse needs of industries across India.
          </p>

          {/* 3 PILL CARDS */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md">
              <FaShieldAlt className="text-orange-400" />
              <span>Trusted Quality</span>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md">
              <FaChartLine className="text-[#38bdf8]" />
              <span>Sustainable Growth</span>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md">
              <FaHandshake className="text-emerald-400" />
              <span>Customer First</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          OUR STORY: OUR JOURNEY SO FAR (MATCHING SCREENSHOT 4)
      ================================================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* IMAGE */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&auto=format&fit=crop&q=80"
                alt="JGB Trading Processing Facility"
                className="h-[420px] w-full rounded-2xl object-cover"
              />
              <div className="absolute bottom-6 left-6 rounded-xl bg-[#0b3b82]/95 px-5 py-3 text-white backdrop-blur-md shadow-lg">
                <p className="text-xs uppercase tracking-wider text-slate-300">Headquarters</p>
                <p className="text-sm font-bold">Raipur, Chhattisgarh</p>
              </div>
            </div>

            {/* CONTENT & STATS */}
            <div>
              <span className="text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
                Our Story
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-[#0f2b5c] sm:text-4xl">
                Our Journey So Far
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#475569]">
                Established with a vision to provide superior quality mineral solutions, JGB Trading Private Limited has
                grown into a reliable partner for businesses nationwide. Through our dedication to quality, transparency,
                and customer satisfaction, we have built long-term relationships based on trust and performance.
              </p>

              <p className="mt-4 text-base leading-relaxed text-[#475569]">
                We source the finest raw materials and process them with advanced technology to ensure consistent quality in
                every product we deliver.
              </p>

              {/* 4 STATS COUNTERS (MATCHING SCREENSHOT 4) */}
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-200 pt-8 sm:grid-cols-4">
                <div>
                  <h3 className="text-3xl font-black text-[#0b4ba2]">5+</h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">Years of Experience</p>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-[#0b4ba2]">100+</h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">Happy Clients</p>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-[#0b4ba2]">20+</h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">Products Delivered</p>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-[#0b4ba2]">100%</h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">Quality Assurance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          OUR MISSION & VISION (MATCHING SCREENSHOT 4)
      ================================================== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* MISSION */}
            <div className="rounded-3xl border border-slate-200 bg-[#fafbfc] p-8 transition hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-[#0b4ba2]">
                <FaBullseye className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-2xl font-extrabold text-[#0f2b5c]">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                To provide high quality mineral products that empower industries to build a stronger, more sustainable future.
                We aim to deliver excellence through innovation, integrity, and a commitment to customer success.
              </p>
            </div>

            {/* VISION */}
            <div className="rounded-3xl border border-slate-200 bg-[#fafbfc] p-8 transition hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-[#0b4ba2]">
                <FaEye className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-2xl font-extrabold text-[#0f2b5c]">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                To be a leading and most trusted mineral solutions provider in India, recognized for our quality,
                reliability, and our contribution to the growth of industries and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          WHY CHOOSE US: WHAT SETS US APART (MATCHING SCREENSHOT 4)
      ================================================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
              Why Choose Us
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0f2b5c] sm:text-4xl">
              What Sets Us Apart
            </h2>
            <div className="mx-auto mt-3 h-1 w-12 rounded bg-[#0b4ba2]" />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {/* 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b4ba2]">
                <FaAward className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-sm font-bold text-[#0f2b5c]">Premium Quality</h4>
              <p className="mt-2 text-xs leading-relaxed text-[#64748b]">
                We deliver 100% premium quality minerals tested for performance.
              </p>
            </div>

            {/* 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b4ba2]">
                <FaTruck className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-sm font-bold text-[#0f2b5c]">Timely Delivery</h4>
              <p className="mt-2 text-xs leading-relaxed text-[#64748b]">
                We ensure on-time delivery across India with reliable logistics.
              </p>
            </div>

            {/* 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b4ba2]">
                <FaTag className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-sm font-bold text-[#0f2b5c]">Competitive Price</h4>
              <p className="mt-2 text-xs leading-relaxed text-[#64748b]">
                Best quality at the most competitive prices in the market.
              </p>
            </div>

            {/* 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b4ba2]">
                <FaBox className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-sm font-bold text-[#0f2b5c]">Secure Packaging</h4>
              <p className="mt-2 text-xs leading-relaxed text-[#64748b]">
                Our products are packed with care to ensure safety and purity.
              </p>
            </div>

            {/* 5 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b4ba2]">
                <FaHeadset className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-sm font-bold text-[#0f2b5c]">Customer Support</h4>
              <p className="mt-2 text-xs leading-relaxed text-[#64748b]">
                Our team is always ready to support you with your requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CTA BANNER (MATCHING SCREENSHOT 4)
      ================================================== */}
      <section className="mx-auto mb-16 max-w-7xl px-4 lg:px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#071d3b] p-8 text-white shadow-2xl sm:p-12 md:flex-row">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-orange-400">
              <FaPhoneAlt className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white">Let&apos;s Build a Stronger Future Together</h3>
              <p className="mt-1 text-sm text-slate-300">
                Partner with JGB Trading for high quality mineral solutions that drive your business forward.
              </p>
            </div>
          </div>

          <a
            href="tel:8810426236"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#071d3b] shadow transition duration-300 hover:bg-orange-500 hover:text-white"
          >
            Get In Touch
            <FaPhoneAlt className="text-xs" />
          </a>
        </div>
      </section>
    </main>
  );
}
