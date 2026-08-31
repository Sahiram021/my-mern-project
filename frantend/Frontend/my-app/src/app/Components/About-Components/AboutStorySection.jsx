export default function AboutStorySection() {
  return (
    <section className="bg-white px-4 py-14 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
            <img
              src="/images/products/anti-moisture-powder-bag.png"
              alt="What We Do - JGB Trading Anti Moisture Powder"
              width={520}
              height={320}
              className="h-52 w-full rounded-xl object-contain bg-white p-2"
            />
            <h3 className="mt-6 text-[22px] font-bold text-[#0f2b5c]">
              What We Do
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              We manufacture and supply industrial-grade Calcium Powder and Anti-Moisture Powder engineered for optimal polymer blending, coatings, and manufacturing durability.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
            <img
              src="/images/banners/anti-moisture-powder-banner.png"
              alt="Our Mission - JGB Trading"
              width={520}
              height={320}
              className="h-52 w-full rounded-xl object-cover"
            />
            <h3 className="mt-6 text-[22px] font-bold text-[#0f2b5c]">
              Our Mission
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              To provide Indian industries with premium mineral powders that exceed purity expectations, backed by reliable supply chains and honest pricing.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
            <img
              src="/images/products/calcium-powder-bag.png"
              alt="Quality Commitment - JGB Trading"
              width={520}
              height={320}
              className="h-52 w-full rounded-xl object-contain bg-white p-2"
            />
            <h3 className="mt-6 text-[22px] font-bold text-[#0f2b5c]">
              Quality Assurance
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Each batch dispatched from Mahadev Ghat Rd Raipur undergoes strict moisture and whiteness testing to ensure zero defect delivery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

