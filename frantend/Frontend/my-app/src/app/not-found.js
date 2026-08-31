import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#f8fafc] px-4 py-16">
      <div className="w-full max-w-[650px] rounded-3xl border border-slate-200 bg-white px-8 py-14 text-center shadow-lg md:px-14">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0b4ba2]">
          Page Not Found
        </span>

        <h1 className="mt-6 text-6xl font-extrabold text-[#0f2b5c] md:text-7xl">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-[#0f2b5c] md:text-3xl">
          Page Not Found
        </h2>
        <p className="mx-auto mt-3 max-w-[480px] text-sm text-slate-500">
          The mineral product or page you are looking for may have been moved or is currently unavailable.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0b4ba2] px-8 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-500 shadow-md"
          >
            Back To Home
          </Link>
          <Link
            href="/ready-to-ship"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 px-8 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}

