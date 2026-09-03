"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { LogOut } from "../../slice/loginSLice";
import { clearCart } from "../../slice/cartSLise";
import { clearWishlist } from "../../slice/wishlistSlice";
import { clearAuthToken } from "../../utils/authToken";

export default function AccountMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector((myStore) => myStore.userStore.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const menuItems = [
    { href: "/my-dashboard", label: "My Profile" },
    { href: "/change-password", label: "Change Password" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/cart", label: "Cart" },
    { href: "/checkout", label: "Checkout" },
    { href: "/order", label: "Order History" },
  ];

  const isActive = (href) => {
    return pathname === href;
  };

  const userLogout = () => {
    clearAuthToken();
    dispatch(LogOut());
    dispatch(clearCart());
    dispatch(clearWishlist());
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    router.push("/login-register");
  };

  return (
    <aside className="sticky top-20 h-fit rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#0f2b5c]">
        Account Menu
      </h2>

      <div className="mt-5 space-y-1.5 text-sm">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl px-4 py-2.5 font-medium transition ${
              isActive(item.href)
                ? "bg-[#0b4ba2] text-white font-bold shadow-sm"
                : "text-slate-600 hover:bg-slate-200/60 hover:text-[#0b4ba2]"
            }`}
          >
            {item.label}
          </Link>
        ))}

        {/* LOGOUT / AUTH */}
        <div className="border-t border-slate-200 pt-3 mt-3">
          {mounted && token && token !== "" && token !== null && token !== undefined ? (
            <button
              onClick={userLogout}
              className="block w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login-register"
              className="inline-flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0b4ba2] transition hover:bg-blue-50"
            >
              <FaRegUser className="text-xs" />
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
