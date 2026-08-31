export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#f8fafc] px-4 py-16">
      <div className="w-full max-w-[540px] text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-blue-100 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b4ba2]" />
        </div>

        <h2 className="mt-8 text-[32px] font-bold text-[#0f2b5c]">
          Loading JGB Trading
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          Please wait while we prepare the Calcium &amp; Moisture Powder collection for you.
        </p>

        <div className="mx-auto mt-8 h-1.5 w-full max-w-[280px] overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#0b4ba2]" />
        </div>
      </div>
    </div>
  );
}

