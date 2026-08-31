"use client";

import { useState } from "react";
import axios from "axios";

export default function EmailSection() {
  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  let apibaseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setShowError(true);
      setMessage("");
      return;
    }

    setShowError(false);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${apibaseUrl}home/subscribe`,
        {
          email: email.trim(),
        }
      );

      if (res.data.status) {
        setMessage("Thank you for subscribing to JGB Trading updates!");
        setEmail("");
      } else {
        setMessage(res.data.message || "Thank you for your interest!");
      }
    } catch (error) {
      setMessage("Thank you for subscribing! We will share our latest powder price catalogue.");
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white px-4 py-14 md:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center text-center">
        <span className="text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
          Stay Connected
        </span>
        <h2 className="mt-2 text-[30px] font-extrabold text-[#0f2b5c] md:text-[36px]">
          Bulk Inquiries &amp; Market Updates
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 md:text-base">
          Subscribe to receive periodic updates on Calcium Powder, Anti Moisture Powder grades, and industrial wholesale pricing.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex w-full max-w-[720px] flex-col items-start"
        >
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-0">
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (event.target.value.trim()) {
                  setShowError(false);
                  setMessage("");
                }
              }}
              placeholder="Enter your company email address..."
              className="h-[52px] w-full rounded-l-lg border border-slate-300 px-5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#0b4ba2] sm:flex-1"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-[52px] w-full rounded-r-lg bg-[#0b4ba2] px-8 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {loading ? "Submitting..." : "Get Price List"}
            </button>
          </div>

          {showError && (
            <p className="mt-2 text-xs text-red-500">
              Please enter a valid email address.
            </p>
          )}

          {message && (
            <p className="mt-2 text-xs font-medium text-emerald-600">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}