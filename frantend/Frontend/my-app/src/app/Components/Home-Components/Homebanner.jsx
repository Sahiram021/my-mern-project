"use client";

import Link from "next/link";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import {
  FaArrowRight,
  FaAward,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const fallbackBanners = [
  {
    title: "JGB Trading — Premier Industrial Chemical & Calcium Powders",
    image: "/powder-images/jgb-calcium-minerals-slider.jpg",
    link: "/ready-to-ship",
    badge: "Certified Lab Purity",
  },
  {
    title: "Advanced Anti-Moisture Powder for Plastic & Polymer Processing",
    image: "/powder-images/jgb-anti-moisture-tech-slider.jpg",
    link: "/ready-to-ship",
    badge: "Active CaO >82%",
  },
  {
    title: "Ultra-Fine Calcium Carbonate & Micronized Mineral Powders",
    image: "/powder-images/jgb-factory-warehouse-slider.jpg",
    link: "/ready-to-ship",
    badge: "Ready Stock in Raipur",
  },
];

export default function Homebanner({ imagepath, sdata = [] }) {
  const swiperRef = useRef(null);

  const bannerSlides = Array.isArray(sdata) && sdata.length > 0
    ? sdata.map((item, idx) => {
        let img = item.image || item.sliderImage || item.bannerImage || "";
        if (img && imagepath && !img.startsWith("http") && !img.startsWith("/")) {
          img = `${imagepath.replace(/\/$/, "")}/${img.replace(/^\//, "")}`;
        }
        if (!img) {
          img = fallbackBanners[idx % fallbackBanners.length].image;
        }

        let link = item.link || item.btnUrl || "/ready-to-ship";
        if (link === "/product/view") {
          link = "/ready-to-ship";
        }

        return {
          id: item._id || idx,
          title: item.title || item.heading || item.name || "Calcium & Mineral Powder",
          image: img,
          link: link,
          badge: item.badge || item.tag || "JGB TRADING PRIVATE LIMITED",
        };
      })
    : fallbackBanners;

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div className="relative w-full bg-[#05162e]">
      {/* LARGE FULL-WIDTH HERO BANNER SLIDER */}
      <section className="relative w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={800}
          loop={bannerSlides.length > 1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: "!bg-orange-500 !w-8 !rounded-full transition-all duration-300",
            bulletClass: "inline-block h-2.5 w-2.5 rounded-full bg-white/50 cursor-pointer mx-1.5 transition-all",
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="hero-slider-main group w-full"
        >
          {bannerSlides.map((slide, index) => (
            <SwiperSlide key={slide.id || index} className="relative w-full">
              <Link href={slide.link} className="relative block w-full overflow-hidden">
                {/* BIG PROMINENT HERO BANNER IMAGE (RESPONSIVE HEIGHTS) */}
                <div className="relative w-full h-[220px] sm:h-[360px] md:h-[480px] lg:h-[540px] xl:h-[600px] bg-slate-900">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* SUBTLE GRADIENT OVERLAY FOR ELEGANCE & READABILITY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                  {/* BOTTOM BANNER CAPTION BAR */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-3.5 sm:p-8 lg:p-14">
                    <div className="mx-auto max-w-7xl">
                      <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-orange-400/40 bg-orange-500/20 px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-[1.5px] sm:tracking-[2px] text-orange-300 backdrop-blur-md">
                          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-orange-400 animate-pulse" />
                          {slide.badge}
                        </span>

                        <h2 className="mt-1.5 sm:mt-3 text-base sm:text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-lg line-clamp-2">
                          {slide.title}
                        </h2>

                        <div className="mt-2.5 sm:mt-5 flex items-center gap-2 sm:gap-4">
                          <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[#0b4ba2] px-3.5 py-1.5 sm:px-6 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:bg-orange-500 hover:scale-105 active:scale-95">
                            Explore
                            <FaArrowRight className="text-[10px] sm:text-xs" />
                          </span>

                          <span className="hidden sm:inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20">
                            View All Grades
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CUSTOM NAVIGATION ARROWS (WORK ON ALL SCREENS & FULLY CLICKABLE) */}
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-6 top-1/2 z-30 -translate-y-1/2 flex h-8 w-8 sm:h-12 sm:w-12 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-[#0b4ba2] hover:scale-110 active:scale-95"
        >
          <FaChevronLeft className="text-xs sm:text-base" />
        </button>

        <button
          onClick={handleNext}
          type="button"
          aria-label="Next Slide"
          className="absolute right-2 sm:right-6 top-1/2 z-30 -translate-y-1/2 flex h-8 w-8 sm:h-12 sm:w-12 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-[#0b4ba2] hover:scale-110 active:scale-95"
        >
          <FaChevronRight className="text-xs sm:text-base" />
        </button>
      </section>

      {/* FEATURE CARDS STRIP (RESPONSIVE 2-COL ON MOBILE) */}
      <div className="relative z-20 mx-auto -mt-4 sm:-mt-10 max-w-7xl px-3 sm:px-4 lg:px-6 pb-6 sm:pb-8">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 shadow-xl sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:p-7">
          <div className="flex items-center sm:items-start gap-2.5 sm:gap-4 p-1 sm:p-2">
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 text-[#0b4ba2]">
              <FaAward className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0f2b5c]">Premium Quality</h4>
              <p className="hidden sm:block mt-1 text-xs leading-relaxed text-[#64748b]">
                High purity calcium &amp; moisture powder.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-2.5 sm:gap-4 p-1 sm:p-2">
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 text-[#0b4ba2]">
              <FaTruck className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0f2b5c]">All Grades</h4>
              <p className="hidden sm:block mt-1 text-xs leading-relaxed text-[#64748b]">
                Industrial &amp; customized mesh sizes in stock.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-2.5 sm:gap-4 p-1 sm:p-2">
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 text-[#0b4ba2]">
              <FaShieldAlt className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0f2b5c]">Direct Price</h4>
              <p className="hidden sm:block mt-1 text-xs leading-relaxed text-[#64748b]">
                Direct manufacturer &amp; trader pricing.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-2.5 sm:gap-4 p-1 sm:p-2">
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 text-[#0b4ba2]">
              <FaHeadset className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0f2b5c]">Direct Support</h4>
              <p className="hidden sm:block mt-1 text-xs leading-relaxed text-[#64748b]">
                Call 8810426236 for technical support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


