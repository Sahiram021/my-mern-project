"use client";

import React from "react";
import Link from "next/link";

export default function JgbLogo({ variant = "dark", className = "" }) {
  const isLight = variant === "light";

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Official JGB Logo Image */}
      <img
        src="/images/jgb-logo.jpg"
        alt="JGB Trading Private Limited"
        className="h-11 w-11 shrink-0 rounded-xl object-contain bg-white shadow-md transition-transform duration-300 group-hover:scale-105"
      />

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xl font-extrabold tracking-tight sm:text-2xl ${
              isLight ? "text-white" : "text-[#0b3b82]"
            }`}
          >
            JGB <span className={isLight ? "text-orange-400" : "text-[#f97316]"}>TRADING</span>
          </span>
        </div>
        <span
          className={`text-[9.5px] font-semibold uppercase tracking-wider sm:text-[10px] ${
            isLight ? "text-slate-300" : "text-[#64748b]"
          }`}
        >
          Quality Minerals, Trusted Solutions
        </span>
      </div>
    </Link>
  );
}
