import Link from "next/link";
import { 
  FaIndustry, 
  FaFlask, 
  FaPaintBrush, 
  FaCarSide, 
  FaTree, 
  FaSeedling, 
  FaArrowRight 
} from "react-icons/fa";

const applications = [
  {
    icon: FaIndustry,
    title: "Plastics & Masterbatches",
    badge: "High Demand",
    desc: "Anti-moisture and micronized calcium carbonate reduce bubble formation, prevent silver streaks, and cut polymer costs in blown film & injection molding.",
    mesh: "500 - 1200 Mesh",
    color: "from-blue-600 to-indigo-700",
  },
  {
    icon: FaFlask,
    title: "PVC Pipes, Cables & Fittings",
    badge: "Extrusion Grade",
    desc: "Imparts superior impact strength, high gloss finish, dimensional stability, and excellent dispersion in rigid PVC pipes and conduits.",
    mesh: "300 - 800 Mesh",
    color: "from-sky-600 to-blue-800",
  },
  {
    icon: FaPaintBrush,
    title: "Paints, Primers & Coatings",
    badge: "High Whiteness",
    desc: "Acts as a premium extender pigment with >96% whiteness, high opacity, scrub resistance, and optimal rheological control for emulsion paints.",
    mesh: "800 - 1200+ Mesh",
    color: "from-emerald-600 to-teal-800",
  },
  {
    icon: FaCarSide,
    title: "Rubber & Footwear Compounds",
    badge: "Reinforcing Filler",
    desc: "Improves tear resistance, hardness, abrasion resistance, and vulcanization kinetics in tires, conveyor belts, rubber sheets, and EVA soles.",
    mesh: "400 - 800 Mesh",
    color: "from-amber-600 to-orange-700",
  },
  {
    icon: FaTree,
    title: "Paper, Pulp & Packaging",
    badge: "Bright Coating",
    desc: "Provides smooth sheet formation, higher brightness, reduced ink strike-through, and cost efficiency in paper milling and packaging boards.",
    mesh: "800 - 1000 Mesh",
    color: "from-violet-600 to-purple-800",
  },
  {
    icon: FaSeedling,
    title: "Agro & Animal Feed Nutrients",
    badge: "Bio-Available",
    desc: "Ultra-pure calcium source used for agricultural soil pH neutralization, poultry calcium feed supplements, and specialty fertilizers.",
    mesh: "300 - 500 Mesh",
    color: "from-green-600 to-emerald-800",
  },
];

export default function ApplicationsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
            Industrial Versatility
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#0f2b5c] sm:text-4xl">
            Key Industrial Applications
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
            Engineered for high performance across manufacturing verticals. Sourced and processed with strict particle size consistency in Raipur.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0b4ba2] hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-[#0b4ba2] transition-colors duration-300 group-hover:bg-[#0b4ba2] group-hover:text-white">
                      <Icon />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#0f2b5c] transition group-hover:text-[#0b4ba2]">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="text-[11px] font-semibold text-slate-500">
                    Grade Range: <span className="font-bold text-[#0f2b5c]">{item.mesh}</span>
                  </div>
                  <Link
                    href="/ready-to-ship"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b4ba2] transition hover:text-orange-500"
                  >
                    View Grades <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-[#071d3b] via-[#0b4ba2] to-[#0f2b5c] p-8 text-center text-white sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h4 className="text-xl font-bold">Custom Mesh &amp; Surface Coating Requirements?</h4>
            <p className="mt-1 text-xs text-blue-100">
              We customize stearic acid coated calcium carbonate and moisture absorbers for your exact polymer recipes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:8810426236"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 px-6 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-orange-600"
            >
              Call Specialist: 8810426236
            </a>
            <Link
              href="/contact-us"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
            >
              Request Custom TDS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
