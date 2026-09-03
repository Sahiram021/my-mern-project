"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { FaAngleDown, FaRegUser } from "react-icons/fa";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Client-side navigation, including browser back/forward, can preserve
    // shared UI state. Always collapse the mobile account navigation when the
    // destination changes so the new page content is visible immediately.
    const timer = window.setTimeout(() => {
      setMobileMenuOpen(false);
      if (document.body.style.overflow === "hidden") {
        document.body.style.removeProperty("overflow");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    if (
      typeof document !== "undefined" &&
      document.body.style.overflow === "hidden"
    ) {
      document.body.style.removeProperty("overflow");
    }
  };

  const userLogout = () => {
    closeMobileMenu();
    clearAuthToken();
    dispatch(LogOut());
    dispatch(clearCart());
    dispatch(clearWishlist());
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    router.push("/login-register");
  };

  const activeLabel =
    menuItems.find((item) => isActive(item.href))?.label || "Account";

  const menuContent = (mobile = false) => (
    <>
      <h2 className="text-lg font-bold text-[#0f2b5c]">Account Menu</h2>

      <nav className="mt-5 space-y-1.5 text-sm" aria-label="Account navigation">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={mobile ? closeMobileMenu : undefined}
            className={`block rounded-xl px-4 py-2.5 font-medium transition ${
              isActive(item.href)
                ? "bg-[#0b4ba2] text-white font-bold shadow-sm"
                : "text-slate-600 hover:bg-slate-200/60 hover:text-[#0b4ba2]"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <div className="mt-3 border-t border-slate-200 pt-3">
          {mounted && token && token !== "" && token !== null && token !== undefined ? (
            <button
              onClick={userLogout}
              className="block w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
              type="button"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login-register"
              onClick={mobile ? closeMobileMenu : undefined}
              className="inline-flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0b4ba2] transition hover:bg-blue-50"
            >
              <FaRegUser className="text-xs" />
              Login / Register
            </Link>
          )}
        </div>
      </nav>
    </>
  );

  return (
    <>
      <div className="min-w-0 lg:hidden">
        <button
          type="button"
          aria-controls="mobile-account-menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-left text-sm font-bold text-[#0f2b5c] shadow-sm"
        >
          <span>
            Account Navigation
            <span className="ml-2 font-medium text-slate-500">{activeLabel}</span>
          </span>
          <FaAngleDown
            aria-hidden="true"
            className={`shrink-0 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {mobileMenuOpen && (
          <aside
            id="mobile-account-menu"
            className="mt-3 h-fit rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 shadow-sm"
          >
            {menuContent(true)}
          </aside>
        )}
      </div>

      <aside className="sticky top-20 hidden h-fit rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm lg:block">
        {menuContent()}
      </aside>
    </>
  );
}
