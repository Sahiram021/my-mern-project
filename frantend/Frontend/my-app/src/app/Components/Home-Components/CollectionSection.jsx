import Link from "next/link";

export default function CollectionSection() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="group">
            <Link
              href="/ready-to-ship"
              className="relative block min-h-[260px] overflow-hidden rounded-xl bg-slate-900 shadow-sm md:min-h-[300px]"
            >
              <img
                src="/images/products/anti-moisture-powder-bag.png"
                alt="Anti Moisture Powder JGB Trading"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 z-10 text-left">
                <span className="inline-block rounded bg-orange-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Premium Quality
                </span>
                <h3 className="mt-2 text-[22px] font-bold leading-tight text-white md:text-[24px]">
                  Anti Moisture Powder
                </h3>
                <p className="mt-1 text-xs text-slate-200">
                  Industrial Grade • 25 KG Bags
                </p>
              </div>
            </Link>
          </div>

          <div className="group">
            <Link
              href="/ready-to-ship"
              className="relative block min-h-[260px] overflow-hidden rounded-xl bg-slate-900 shadow-sm md:min-h-[300px]"
            >
              <img
                src="/images/products/calcium-powder-bag.png"
                alt="Calcium Powder JGB Trading"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 z-10 text-left">
                <span className="inline-block rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  High Purity
                </span>
                <h3 className="mt-2 text-[22px] font-bold leading-tight text-white md:text-[24px]">
                  Calcium Powder
                </h3>
                <p className="mt-1 text-xs text-slate-200">
                  All Types of Grades Available
                </p>
              </div>
            </Link>
          </div>

          <div className="group">
            <Link
              href="/ready-to-ship"
              className="relative block min-h-[260px] overflow-hidden rounded-xl bg-slate-900 shadow-sm md:min-h-[300px]"
            >
              <img
                src="/images/banners/anti-moisture-powder-red-banner.png"
                alt="Mineral Powders JGB Trading"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 z-10 text-left">
                <span className="inline-block rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Direct Sourced
                </span>
                <h3 className="mt-2 text-[22px] font-bold leading-tight text-white md:text-[24px]">
                  Mineral Powders
                </h3>
                <p className="mt-1 text-xs text-slate-200">
                  Bulk Supply • Raipur, Chhattisgarh
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

