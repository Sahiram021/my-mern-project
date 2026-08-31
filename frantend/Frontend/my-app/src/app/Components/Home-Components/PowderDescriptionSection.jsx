import Link from "next/link";
import { FaCheckCircle, FaMapMarkerAlt, FaPhoneAlt, FaTruck, FaVial, FaIndustry } from "react-icons/fa";

export default function PowderDescriptionSection() {
  return (
    <section className="border-t border-slate-200 bg-[#f8fafc] py-14 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        
        {/* MAIN HEADING & INTRO */}
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-[#0f2b5c] sm:text-3xl">
            Explore Premium Calcium and Anti-Moisture Powder at JGB TRADING PRIVATE LIMITED — India&apos;s Trusted Mineral Supplier
          </h2>
          
          <p className="text-sm leading-relaxed text-slate-600">
            Welcome to <strong>JGB TRADING PRIVATE LIMITED</strong>, your premier destination for buying high-grade Calcium Carbonate (CaCO3), Micronized Calcite, and Active Anti-Moisture Desiccant Powder in India. Sourced and processed under strict laboratory controls at our central processing terminal on <strong>Mahadev Ghat Road, Raipur 492001, Chhattisgarh</strong>, we provide a complete spectrum of industrial mineral grades tailored for plastics, polymer recycling, masterbatches, PVC pipes, paints, rubber, and chemical manufacturing.
          </p>

          <p className="text-sm leading-relaxed text-slate-600">
            As a leading supplier in Central India, we pride ourselves on consistent particle size distribution, exceptional whiteness (&gt;96%), certified high purity (&gt;98%), and ultra-low moisture retention. Whether you require standard 300 to 1200+ mesh natural ground calcium carbonate or surface-treated stearic coated powder for high-speed compounding, our extensive inventory guarantees seamless production continuity for your factory.
          </p>
        </div>

        {/* APPLICATION CATEGORIES GRID */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-[#0f2b5c]">
            Industrial Applications &amp; Specialized Powder Categories
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Engineered for high performance across manufacturing verticals:
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-base font-bold text-[#0b4ba2]">
                Plastics, Masterbatches &amp; Recycling
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                High-potency Active Anti-Moisture Powder eliminates moisture in recycled plastic granules, preventing fish eyes, surface voids, and silver streaks in blown film and injection moulding lines.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-base font-bold text-[#0b4ba2]">
                PVC Pipes, Cables &amp; Conduits
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Micronized Calcium Powder enhances dimensional stability, impact strength, and smooth surface finish in rigid PVC pipes, electrical conduit fittings, and wire insulation compounds.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-base font-bold text-[#0b4ba2]">
                Paints, Primers &amp; Coatings
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Top whiteness index (&gt;96%) and controlled oil absorption make our calcite powder the ideal extender pigment for emulsion paints, primers, decorative wall putty, and architectural coatings.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-base font-bold text-[#0b4ba2]">
                Rubber &amp; Footwear Formulations
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Provides essential reinforcement, increases tear resistance, improves abrasion resistance, and optimizes compounding costs in conveyor belts, footwear soles, and automotive molded rubber.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-base font-bold text-[#0b4ba2]">
                Paper, Packaging &amp; Adhesives
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Imparts higher sheet opacity, optimal brightness, smooth ink receptivity, and superior filling properties in paper manufacturing, sealants, tile adhesives, and construction grouts.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-base font-bold text-[#0b4ba2]">
                Agriculture &amp; Animal Feed
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                High-bioavailability calcium source used for agricultural soil pH neutralization, organic crop conditioning, poultry eggshell fortification, and balanced livestock feed premixes.
              </p>
            </div>
          </div>
        </div>

        {/* ADVANTAGES */}
        <div className="mt-10 border-t border-slate-200 pt-8">
          <h3 className="text-xl font-bold text-[#0f2b5c]">
            Advantages of Sourcing Mineral Powder from JGB TRADING PRIVATE LIMITED
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div className="flex items-start gap-2.5">
              <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <strong className="text-slate-900">Wide Grade Range:</strong> 300 to 1200+ Mesh, micronized, and stearic coated powders available in ready stock.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <strong className="text-slate-900">Lab Tested Purity:</strong> Every shipment includes a Certificate of Analysis (COA) verifying &gt;98% CaCO3 content and &lt;0.05% moisture.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <strong className="text-slate-900">Direct Factory Wholesale Rates:</strong> Highly competitive manufacturer prices on full truckload (FTL) and multi-ton supply contracts.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <strong className="text-slate-900">Central India Logistics Hub:</strong> Rapid dispatch from Mahadev Ghat Road, Raipur directly connected to national highway networks.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <strong className="text-slate-900">Free Testing Samples:</strong> 2 KG complimentary laboratory evaluation samples dispatched on request.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <strong className="text-slate-900">Tailored Packaging:</strong> 25 KG moisture-proof HDPE/PP bags, aluminum foil vacuum-sealed liners, and jumbo 1-ton bulk bags.
              </div>
            </div>
          </div>
        </div>

        {/* BUYING GUIDE */}
        <div className="mt-10 border-t border-slate-200 pt-8">
          <h3 className="text-xl font-bold text-[#0f2b5c]">
            Industrial Powder Buying Guide: Choosing the Right Grade
          </h3>

          <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
            <p>
              <strong className="text-slate-900">1. Assess Particle Mesh Size:</strong> Choose 300–400 mesh for PVC pipes and heavy construction chemicals; select 500–800 mesh for filler masterbatches and emulsion paints; and 1000–1200+ coated mesh for automotive polymers and thin blown films.
            </p>
            <p>
              <strong className="text-slate-900">2. Determine Moisture Sensitivity:</strong> For reprocessed plastic compounds and humidity-sensitive extrusions, integrate JGB Active Anti-Moisture Desiccant Powder at 1%–3% dosing to eliminate bubbling and porosity completely.
            </p>
            <p>
              <strong className="text-slate-900">3. Verify Whiteness &amp; Purity Requirements:</strong> Premium paints and masterbatches require higher whiteness (&gt;96%). Request a batch test report to match your factory&apos;s optical and chemical standards.
            </p>
          </div>
        </div>

        {/* CONTACT / CTA STRIP */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b4ba2]">
              JGB TRADING PRIVATE LIMITED
            </span>
            <p className="text-sm font-semibold text-slate-800">
              Mahadev Ghat Rd Raipur, Raipur 492001, Chhattisgarh | Tel: 8810426236
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:8810426236"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0b4ba2] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-orange-500"
            >
              Call 8810426236
            </a>
            <Link
              href="/contact-us"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
            >
              Request Quote
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
