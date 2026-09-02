"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import JgbLogo from "./JgbLogo";

export default function Footer() {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const getFooterData = async () => {
      try {
        const apibaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://jgbmtrading.online/api/web/";
        const res = await fetch(`${apibaseUrl}footer`, { cache: "no-store" });
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.footer) {
            setFooterData(result.footer);
          }
        }
      } catch (error) {
      }
    };

    getFooterData();
  }, []);

  return (
    <footer className="border-t border-[#092347] bg-[#071d3b] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1.3fr_1.2fr]">
          <div className="space-y-4">
            <JgbLogo variant="light" />

            <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
              Providing certified Calcium Powder and Anti-Moisture Powder for plastic, polymer, rubber, paint, and industrial applications across India.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-orange-500 hover:text-white"
              >
                <FaFacebookF className="text-xs" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-orange-500 hover:text-white"
              >
                <FaLinkedinIn className="text-xs" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-orange-500 hover:text-white"
              >
                <FaTwitter className="text-xs" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-orange-500 hover:text-white"
              >
                <FaInstagram className="text-xs" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 sm:text-sm">
              <li>
                <Link href="/" className="transition hover:text-orange-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="transition hover:text-orange-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/ready-to-ship" className="transition hover:text-orange-400">
                  Powder Products
                </Link>
              </li>
              <li>
                <Link href="/frequently-questions" className="transition hover:text-orange-400">
                  FAQs &amp; Grades
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="transition hover:text-orange-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Our Products
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 sm:text-sm">
              <li>
                <Link href="/ready-to-ship" className="transition hover:text-orange-400">
                  Calcium Powder
                </Link>
              </li>
              <li>
                <Link href="/ready-to-ship" className="transition hover:text-orange-400">
                  Anti Moisture Powder
                </Link>
              </li>
              <li>
                <Link href="/ready-to-ship" className="transition hover:text-orange-400">
                  Calcite Lumps
                </Link>
              </li>
              <li>
                <Link href="/ready-to-ship" className="transition hover:text-orange-400">
                  Talc Powder
                </Link>
              </li>
              <li>
                <Link href="/ready-to-ship" className="transition hover:text-orange-400">
                  Dolomite Powder
                </Link>
              </li>
              <li>
                <Link href="/ready-to-ship" className="transition hover:text-orange-400">
                  Limestone Powder
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
              <p className="flex items-start gap-2.5">
                <FaPhoneAlt className="mt-1 shrink-0 text-orange-400" />
                <a href="tel:8810426236" className="font-semibold text-white hover:text-orange-400">
                  +91 8810426236
                </a>
              </p>

              <p className="flex items-start gap-2.5">
                <FaEnvelope className="mt-1 shrink-0 text-orange-400" />
                <a href="mailto:info@jgbtrading.com" className="text-slate-300 hover:text-orange-400">
                  info@jgbtrading.com
                </a>
              </p>

              <p className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-orange-400" />
                <span>
                  MAHADEV GHAT RD RAIPUR, RAIPUR 492001, CHHATTISGARH
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Request a Quote
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-slate-400">
              Contact our sales specialists for material grade sheets, samples, and wholesale pricing.
            </p>
            <Link
              href="/contact-us"
              className="inline-block w-full rounded-lg bg-[#0b4ba2] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#f97316]"
            >
              Request Quote
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-center text-xs text-slate-500 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} JGB TRADING PRIVATE LIMITED. All Rights Reserved.</p>
          <p className="text-slate-400">Calcium &amp; Moisture Powder Available • All Grades Available</p>
        </div>
      </div>
    </footer>
  );
}
