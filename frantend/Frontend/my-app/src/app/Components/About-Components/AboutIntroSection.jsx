export default function AboutIntroSection() {
  return (
    <section className="bg-white px-4 py-14 md:py-20">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative min-h-[340px] overflow-hidden rounded-2xl shadow-md">
          <img
            src="/images/banners/anti-moisture-powder-banner.png"
            alt="JGB Trading Calcium Powder & Anti Moisture Powder"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#0b4ba2]">
            About JGB Trading Private Limited
          </span>
          <h2 className="mt-3 text-[30px] font-extrabold text-[#0f2b5c] md:text-[40px]">
            Trusted Source for Calcium &amp; Moisture Powder
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            JGB TRADING PRIVATE LIMITED is a prominent supplier and distributor of high-purity Calcium Powder, Anti-Moisture Powder, Calcite Lumps, and industrial minerals headquartered in Raipur, Chhattisgarh.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            With our facility located at Mahadev Ghat Rd Raipur, we supply all types of commercial and industrial grades in standard 25 KG and 50 KG bags with strict quality testing and reliable dispatch.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-[#0f2b5c]">
            <span className="rounded-lg bg-blue-50 px-3.5 py-2">📍 Raipur 492001, Chhattisgarh</span>
            <span className="rounded-lg bg-orange-50 px-3.5 py-2 text-orange-700">📞 Tel: 8810426236</span>
          </div>
        </div>
      </div>
    </section>
  );
}

