import { BadgeCheck, Clock3, Truck } from "lucide-react";

export default function ShippingSection() {
  return (
    <section className="bg-[#f8fafc] py-14 md:py-18">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="group flex flex-col items-center justify-center rounded-xl bg-white p-6 text-center shadow-sm">
            <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-blue-50 text-[#0b4ba2] transition-colors duration-300 group-hover:bg-[#0b4ba2] group-hover:text-white">
              <Truck className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <h3 className="mt-5 text-[18px] font-bold text-[#0f2b5c]">
              Nationwide Fast Dispatch
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Reliable logistics network from Raipur to industrial hubs all over India.
            </p>
          </div>

          <div className="group flex flex-col items-center justify-center rounded-xl bg-white p-6 text-center shadow-sm">
            <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-blue-50 text-[#0b4ba2] transition-colors duration-300 group-hover:bg-[#0b4ba2] group-hover:text-white">
              <BadgeCheck className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <h3 className="mt-5 text-[18px] font-bold text-[#0f2b5c]">
              Quality &amp; Grade Guarantee
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Consistent mesh, whiteness, and moisture control with lab-certified quality.
            </p>
          </div>

          <div className="group flex flex-col items-center justify-center rounded-xl bg-white p-6 text-center shadow-sm">
            <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-blue-50 text-[#0b4ba2] transition-colors duration-300 group-hover:bg-[#0b4ba2] group-hover:text-white">
              <Clock3 className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <h3 className="mt-5 text-[18px] font-bold text-[#0f2b5c]">
              Direct Phone Support
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Immediate quotation and order tracking assistance at 8810426236.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

