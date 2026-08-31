"use client";

import { Star } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Rameshwar Patel",
    role: "Production Head, Industrial Polymers Raipur",
    content:
      "JGB Trading Private Limited has been our trusted partner for Anti Moisture Powder and Calcium Powder. Their prompt dispatch from Raipur and certified purity have improved our extrusion efficiency significantly.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sanjay Gupta",
    role: "Managing Director, Apex Masterbatches",
    content:
      "We purchase bulk 25 KG bags of Calcium Powder regularly. The whiteness index and uniform mesh size are unmatched, and the team provides excellent commercial support.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amitabh Sen",
    role: "Plant Incharge, Coating Minerals Corp",
    content:
      "Very reliable supply chain. Whenever we have emergency order requirements, JGB Trading delivers to our facility without delays. Best quality Calcium & Moisture Powder supplier in Chhattisgarh.",
    rating: 5,
  },
];

function Rating({ count }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-1 text-orange-400">
      {Array.from({ length: count }).map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-current" strokeWidth={1.8} />
      ))}
    </div>
  );
}

export default function AboutTestimonialsSection() {
  return (
    <section className="bg-[#f8fafc] px-4 py-14 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
            Client Feedback
          </span>
          <h2 className="mt-2 text-[30px] font-extrabold text-[#0f2b5c] md:text-[38px]">
            What Our Industrial Clients Say
          </h2>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          loop={true}
          speed={700}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="about-testimonial-swiper"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="mx-auto flex max-w-[850px] flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
                <p className="text-base leading-relaxed text-slate-700 italic md:text-lg">
                  &ldquo;{item.content}&rdquo;
                </p>
                <div className="mt-6 flex flex-col items-center">
                  <span className="text-lg font-bold text-[#0f2b5c]">
                    {item.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.role}
                  </span>
                  <Rating count={item.rating} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

