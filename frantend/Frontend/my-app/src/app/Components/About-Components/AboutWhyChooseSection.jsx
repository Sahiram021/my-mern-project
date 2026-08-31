import { Award, Truck, ShieldCheck, PhoneCall } from "lucide-react";

export default function AboutWhyChooseSection() {
  return (
    <section className="bg-slate-50 px-4 py-14 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
            Our Advantages
          </span>
          <h2 className="mt-2 text-[30px] font-extrabold text-[#0f2b5c] md:text-[38px]">
            Why Choose JGB Trading?
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b4ba2]">
                <Award className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#0f2b5c]">
                Consistent Lab Quality
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Minimum 98% purity, high whiteness index, and ultra-low moisture verified with regular batch testing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b4ba2]">
                <Truck className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#0f2b5c]">
                Rapid Dispatch
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Hub situated in Raipur, Chhattisgarh enabling quick truckload dispatches across all Indian industrial corridors.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b4ba2]">
                <ShieldCheck className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#0f2b5c]">
                All Grades Available
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Industrial, masterbatch, polymer, paint, and coated grades in 25 KG and 50 KG moisture-proof packaging.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b4ba2]">
                <PhoneCall className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#0f2b5c]">
                Dedicated Helpline
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Direct access to our material specialists for sample requests and bulk pricing at 8810426236.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <img
              src="/images/products/calcium-powder-bag.png"
              alt="JGB Trading Calcium Powder Industrial Grade"
              width={500}
              height={500}
              className="h-[380px] w-full rounded-xl object-contain bg-slate-50"
            />
            <div className="p-4 text-center">
              <h3 className="text-base font-bold text-[#0f2b5c]">
                JGB TRADING PRIVATE LIMITED
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Mahadev Ghat Rd Raipur, Raipur 492001, Chhattisgarh
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

