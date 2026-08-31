"use client";

import Link from "next/link";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function HeaderActions() {
  const { cart } = useSelector((myAllstore) => myAllstore.cartStore);
  const { wishlist } = useSelector((myAllstore) => myAllstore.wishlistStore);

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-[#0b4ba2] hover:text-[#0b4ba2]"
      >
        <FaHeart className="text-sm" />
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white shadow-sm">
          {wishlist.length}
        </span>
      </Link>
      <Link
        href="/cart"
        className="relative inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:border-[#0b4ba2] hover:text-[#0b4ba2]"
      >
        <FaShoppingCart className="text-sm" />
        <span>Cart</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#0b4ba2] px-1 text-[10px] font-bold text-white shadow-sm">
          {cart.length}
        </span>
      </Link>
    </div>
  );
}

