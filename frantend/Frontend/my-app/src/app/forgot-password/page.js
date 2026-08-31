"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);

  const ForgotPasswordCheck = async (event) => {
    setLoading(true);
    event.preventDefault();
    const email = event.target.email.value;
    const { default: iziToast } = await import("izitoast");

    axios
      .post(`${apibaseUrl}auth/forgot-password`, { email })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          iziToast.success({
            title: "OK",
            message: finalRes.message,
            position: "topRight",
          });
          event.target.reset();
        } else {
          iziToast.error({
            title: "Error",
            message: finalRes.message,
            position: "topRight",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        iziToast.error({
          title: "Error",
          message: "Something went wrong. Please try again.",
          position: "topRight",
        });
        setLoading(false);
      });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg lg:flex-row">
        <section className="flex-1 bg-[#071d3b] p-8 text-white sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/images/jgb-logo.jpg"
                alt="JGB Trading Logo"
                className="h-14 w-14 rounded-2xl object-contain bg-white p-1 shadow-md border border-white/20"
              />
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-white">
                  JGB TRADING
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                  Private Limited
                </p>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
              Forgot your password?
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              Enter your registered email address and we’ll send you instructions to reset your account password.
            </p>
          </div>
          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Direct Assistance</p>
            <p className="mt-1 text-xs text-slate-300">
              Need immediate support? Call our Raipur helpdesk at{" "}
              <a href="tel:8810426236" className="text-orange-400 font-bold hover:underline">
                8810426236
              </a>
              .
            </p>
          </div>
        </section>

        <section className="flex-1 p-8 sm:p-10 lg:p-12">
          <div className="mb-6">
            <p className="text-xs text-slate-500">
              <Link href="/" className="transition hover:text-[#0b4ba2]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-800">Forgot Password</span>
            </p>
          </div>

          <form onSubmit={ForgotPasswordCheck} className="space-y-5">
            <div>
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your registered email"
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-[#0b4ba2] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#0b4ba2] text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-600">
            <Link href="/login-register" className="hover:text-[#0b4ba2]">
              Back to Login
            </Link>
            <Link href="/" className="hover:text-[#0b4ba2]">
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

