export default function Loading() {
  return (
    <main className="bg-[#f8fafc] min-h-screen">
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:px-6">
          <div className="aspect-[1.2/1] animate-pulse rounded-2xl bg-slate-200" />
          <div className="space-y-5">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-28 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </section>
    </main>
  );
}

