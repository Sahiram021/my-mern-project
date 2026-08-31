import Link from "next/link";

export default function InnerPageHero({ title, current }) {
  return (
    <section className="bg-[#f8fafc] border-b border-slate-200 px-4 py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] text-center">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0b4ba2]">
          JGB TRADING PRIVATE LIMITED • Calcium &amp; Moisture Powder
        </p>
        <h1 className="mt-3 text-[32px] font-extrabold text-[#0f2b5c] md:text-[42px]">
          {title}
        </h1>
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-[#0b4ba2]">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">{current ?? title}</span>
        </div>
      </div>
    </section>
  );
}

