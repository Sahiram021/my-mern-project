"use client";

import { Star } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const defaultReviews = [
  {
    id: 1,
    title: "Rajesh Sharma",
    role: "Industrial Polymer Manufacturer, Raipur",
    description:
      "JGB Trading provides the most consistent grade of Calcium Powder and Anti Moisture Powder. Their dispatch is always on time, and quality meets our exact laboratory specifications.",
    rating: 5,
  },
  {
    id: 2,
    title: "Vikas Agrawal",
    role: "Masterbatch & Plastic Compounds, Bilaspur",
    description:
      "We regularly source anti-moisture powder in 25 KG bags from JGB Trading. Excellent whiteness, minimal moisture, and very competitive bulk pricing.",
    rating: 5,
  },
  {
    id: 3,
    title: "Sunil Kumar",
    role: "Paints & Coatings Industry, Durg",
    description:
      "Top-grade mineral powder supply with prompt support from the Raipur office. Highly recommended for industrial bulk requirements.",
    rating: 5,
  },
];

function Rating({ count }) {
  const safeCount = Number(count) || 5;

  return (
    <div className="mt-4 flex items-center justify-center gap-1 text-orange-400">
      {Array.from({ length: Math.max(0, Math.min(5, safeCount)) }).map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-current" strokeWidth={1.8} />
      ))}
    </div>
  );
}

export default function AboutSection({ imagespath, rsdata = [] }) {
  const reviews = Array.isArray(rsdata) && rsdata.length > 0
    ? rsdata.map((obj, idx) => ({
        id: obj._id || obj.id || idx,
        title: obj.title || obj.name || obj.userName || "Industrial Buyer",
        role: obj.role || obj.designation || obj.company || "Manufacturing Partner",
        description:
          obj.description ||
          obj.message ||
          obj.comment ||
          obj.review ||
          "JGB Trading provides premium Calcium Powder and Anti Moisture Powder with certified laboratory purity and prompt dispatch.",
        rating: Number(obj.rating || obj.stars) || 5,
        image: obj.image
          ? obj.image.startsWith("http") || obj.image.startsWith("/")
            ? obj.image
            : `${imagespath || ""}${obj.image}`
          : null,
      }))
    : defaultReviews;

  return (
    <section className="bg-slate-50 px-4 py-14 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
            Client Testimonials
          </span>
          <h2 className="mt-2 text-[30px] font-extrabold text-[#0f2b5c] md:text-[38px]">
            What Our Clients Say
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Trusted by manufacturing and industrial enterprises across India for quality Calcium &amp; Moisture Powder.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          loop={reviews.length > 1}
          speed={700}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="about-testimonial-swiper"
        >
          {reviews.map((obj, index) => (
            <SwiperSlide key={obj.id || index}>
              <div className="mx-auto flex max-w-[820px] flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
                {obj.image && (
                  <img
                    src={obj.image}
                    alt={obj.title}
                    className="mb-4 h-16 w-16 rounded-full border-2 border-[#0b4ba2] object-cover shadow"
                  />
                )}
                <p className="text-base leading-relaxed text-slate-700 italic md:text-lg">
                  &ldquo;{obj.description}&rdquo;
                </p>
                <div className="mt-6 flex flex-col items-center">
                  <span className="text-lg font-bold text-[#0f2b5c]">
                    {obj.title}
                  </span>
                  <span className="text-xs text-slate-500">
                    {obj.role}
                  </span>
                  <Rating count={obj.rating} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

