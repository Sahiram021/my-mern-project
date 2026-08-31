import Link from "next/link";
import { FaDownload, FaWhatsapp, FaCheckCircle, FaSlidersH } from "react-icons/fa";

const gradesData = [
  {
    gradeName: "JGB Anti-Moisture Active Desiccant",
    mesh: "Micronized",
    purity: "Active CaO > 82%",
    whiteness: "92% Min",
    moisture: "< 0.05%",
    packaging: "25 KG / 50 KG PP Bags",
    primaryUse: "Plastic Recycling, Reprocessed Granules, Blown Film",
    status: "Ready Stock in Raipur",
  },
  {
    gradeName: "JGB Micro-Cal 300 (Natural CaCO3)",
    mesh: "300 Mesh (53 Micron)",
    purity: "CaCO3 > 98.2%",
    whiteness: "94% Min",
    moisture: "< 0.20%",
    packaging: "25 KG / 50 KG / Jumbo",
    primaryUse: "PVC Rigid Pipes, Cable Insulation, Footwear Compounds",
    status: "Ready Stock in Raipur",
  },
  {
    gradeName: "JGB Ultra-Cal 500 (Micronized)",
    mesh: "500 Mesh (25 Micron)",
    purity: "CaCO3 > 98.5%",
    whiteness: "96% Min",
    moisture: "< 0.15%",
    packaging: "25 KG / 50 KG Bags",
    primaryUse: "Filler Masterbatch, Emulsion Paints, Rubber Sheets",
    status: "Ready Stock in Raipur",
  },
  {
    gradeName: "JGB Super-Fine 800 (High Brightness)",
    mesh: "800 Mesh (15 Micron)",
    purity: "CaCO3 > 98.8%",
    whiteness: "97% Min",
    moisture: "< 0.10%",
    packaging: "25 KG Laminated Bags",
    primaryUse: "Premium Paints, Inks, Adhesives, Paper Coating",
    status: "Ready Stock in Raipur",
  },
  {
    gradeName: "JGB Nano-Coat 1200+ (Stearic Acid Coated)",
    mesh: "1200+ Mesh (Sub-micron)",
    purity: "CaCO3 > 99.0%",
    whiteness: "97.5% Min",
    moisture: "< 0.08%",
    packaging: "25 KG HDPE Bags",
    primaryUse: "Automotive Plastics, Engineering Polymers, High Speed Film",
    status: "Ready Stock in Raipur",
  },
];

export default function GradesSection() {
  return (
    <section className="bg-[#f8fafc] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
            Technical Matrix
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#0f2b5c] sm:text-4xl">
            Mineral Powder Grades &amp; Specifications
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
            All grades are manufactured under strict laboratory testing for purity, particle size distribution, and whiteness.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-[#0f2b5c] text-white">
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Product / Grade Name</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Particle Mesh</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">CaCO3 Purity</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Whiteness</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Moisture</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Primary Applications</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Inquiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {gradesData.map((row, idx) => (
                  <tr key={idx} className="transition hover:bg-blue-50/40">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0f2b5c]">{row.gradeName}</div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <FaCheckCircle className="text-[9px]" /> {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{row.mesh}</td>
                    <td className="px-6 py-4 text-[#0b4ba2] font-bold">{row.purity}</td>
                    <td className="px-6 py-4">{row.whiteness}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-700">{row.moisture}</td>
                    <td className="max-w-[220px] px-6 py-4 text-slate-600">{row.primaryUse}</td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`https://wa.me/918810426236?text=Hi%20JGB%20Trading,%20please%20send%20quote%20for%20${encodeURIComponent(row.gradeName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0b4ba2] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-orange-500"
                      >
                        <FaWhatsapp /> Quote
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row shadow-sm">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b4ba2]">
              Need a Custom Mesh Size?
            </span>
            <p className="text-sm font-semibold text-slate-700">
              We process custom micronized batches from 300 to 1500 Mesh with tailored surface treatments.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/ready-to-ship"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0b4ba2] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-orange-500"
            >
              Browse All Products
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
            >
              Contact Lab Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
