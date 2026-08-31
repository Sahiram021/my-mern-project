import Link from "next/link";
import { FaWarehouse, FaTruckLoading, FaVial, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function RaipurFacilitySection() {
  return (
    <section className="bg-white py-16 md:py-24 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
              Strategic Logistics Hub
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-[#0f2b5c] sm:text-4xl">
              Raipur Processing &amp; Dispatch Facility
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Situated on <strong className="text-slate-900">Mahadev Ghat Road, Raipur 492001, Chhattisgarh</strong>, JGB TRADING PRIVATE LIMITED operates a modern mineral handling and storage terminal with immediate access to national highway and rail transport networks.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-[#0b4ba2]">
                  <FaWarehouse />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2b5c]">10,000+ MT Stock</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Ready buffer inventory to safeguard your factory operations against supply disruptions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-[#0b4ba2]">
                  <FaTruckLoading />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2b5c]">Rapid Fleet Dispatch</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Daily 10-wheeler and 20-ton truckloads dispatched to Chhattisgarh, MP, Maharashtra, and across India.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-[#0b4ba2]">
                  <FaVial />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2b5c]">Quality Tested</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Every lot is analyzed for whiteness index, sieve residue, and moisture levels before loading.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-[#0b4ba2]">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2b5c]">Central India Location</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Fast transit times and minimized logistics freight costs for central and northern industrial corridors.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="tel:8810426236"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0b4ba2] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500"
              >
                <FaPhoneAlt />
                Call Dispatch: 8810426236
              </a>

              <Link
                href="/contact-us"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 px-6 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 hover:border-[#0b4ba2]"
              >
                Get Warehouse Directions
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
              <img
                src="/images/banners/anti-moisture-powder-banner.png"
                alt="JGB Trading Raipur Facility"
                className="h-full w-full rounded-2xl object-cover aspect-[4/3]"
              />
            </div>
            
            <div className="absolute -bottom-6 -right-2 max-w-[280px] rounded-2xl border border-white/40 bg-[#0f2b5c] p-5 text-white shadow-2xl backdrop-blur sm:bottom-4 sm:right-4">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Ready For Dispatch
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-200">
                Direct factory rate Calcium and Moisture Powder available in bulk quantities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
