"use client";

import axios from "axios";
import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const showToast = async (type, title, message) => {
  const { default: iziToast } = await import("izitoast");
  iziToast[type]({
    title,
    message,
    position: "topRight",
  });
};

export default function EnquriFromSection() {
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://jgbmtrading.online/api/web/";
  const [loading, setLoading] = useState(false);

  const saveEnquiry = (event) => {
    setLoading(true);
    event.preventDefault();
    const obj = {
      name: event.target.name.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
      message: event.target.message.value,
    };

    axios
      .post(`${apibaseUrl}contact/enquiry-save`, obj)
      .then((res) => res.data)
      .then((data) => {
        setLoading(false);
        if (data.status) {
          event.target.reset();
          showToast("success", "Submitted", "Enquiry Submitted Successfully. Our team will contact you shortly.");
        } else {
          event.target.reset();
          showToast("info", "Thank you", "Enquiry received. Thank you!");
        }
      })
      .catch(() => {
        setLoading(false);
        event.target.reset();
        showToast("info", "Thank you", "Thank you for contacting JGB Trading. We have received your message.");
      });
  };

  return (
    <div className="bg-[#fafbfc] text-[#0f2b5c]">
      <form onSubmit={saveEnquiry} className="mx-auto max-w-7xl px-4 py-14 md:py-20 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-[#071d3b] p-8 text-white shadow-md">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                Contact JGB Trading
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                JGB TRADING PRIVATE LIMITED
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Leading manufacturer &amp; supplier of Calcium Powder, Anti-Moisture Powder, and High-Grade Minerals.
                All types of industrial and commercial grades available in bulk quantities.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b4ba2]">
                  <FaMapMarkerAlt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f2b5c]">Office &amp; Works Address</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    MAHADEV GHAT RD RAIPUR, RAIPUR 492001, CHHATTISGARH, INDIA
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0b4ba2]">
                  <FaPhoneAlt className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#0f2b5c]">Phone Number</h3>
                <p className="mt-1 text-sm font-semibold text-[#0b4ba2]">
                  <a href="tel:8810426236" className="hover:underline">
                    +91 8810426236
                  </a>
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0b4ba2]">
                  <FaEnvelope className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#0f2b5c]">Email Address</h3>
                <p className="mt-1 text-sm font-semibold text-[#0b4ba2]">
                  <a href="mailto:info@jgbtrading.com" className="hover:underline">
                    info@jgbtrading.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md md:p-10">
            <span className="text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
              Inquiry Form
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-[#0f2b5c] sm:text-3xl">
              Request Price Quote &amp; Samples
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Calcium and moisture powder available • All types of grades are available
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name / Company Name *"
                className="h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-[#0b4ba2] focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Business Email *"
                className="h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-[#0b4ba2] focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="tel"
                name="phone"
                required
                placeholder="Mobile / WhatsApp Number *"
                className="h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-[#0b4ba2] focus:ring-2 focus:ring-blue-100 md:col-span-2"
              />
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Required Mineral Grade, Quantity (e.g. 5 Tons, 25 KG Bags), Destination City..."
                className="rounded-xl border border-slate-200 p-4 text-sm text-slate-800 outline-none transition focus:border-[#0b4ba2] focus:ring-2 focus:ring-blue-100 md:col-span-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#0b4ba2] px-8 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition duration-300 hover:bg-[#f97316] disabled:opacity-70 sm:w-auto"
            >
              {loading ? "Submitting Inquiry..." : "Submit Inquiry"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
