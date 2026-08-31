import Link from "next/link";
import InnerPageHero from "../Components/Page-Sections/InnerPageHero";

export default function MyAccountPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <InnerPageHero title="My Account" />

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-[#0b4ba2]">
                🔑
              </div>
              <h2 className="mt-4 text-2xl font-bold text-[#0f2b5c]">Existing Customer</h2>
              <p className="mt-2 text-xs text-slate-500">
                Log in to check order status, download quotes, and manage mineral shipments.
              </p>
              <Link
                href="/login-register"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#0b4ba2] text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500"
              >
                Sign In to Account
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl font-bold text-orange-600">
                📝
              </div>
              <h2 className="mt-4 text-2xl font-bold text-[#0f2b5c]">New Buyer / Partner</h2>
              <p className="mt-2 text-xs text-slate-500">
                Create a JGB Trading account to place bulk orders and receive exclusive grade pricing.
              </p>
              <Link
                href="/login-register"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-800 transition hover:bg-slate-50 hover:border-[#0b4ba2]"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

