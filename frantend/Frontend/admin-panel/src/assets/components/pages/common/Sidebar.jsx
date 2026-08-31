import { NavLink, useNavigate } from "react-router";
import {
  FaBagShopping,
  FaBoxesStacked,
  FaChartPie,
  FaChevronDown,
  FaCircleDot,
  FaDroplet,
  FaFlask,
  FaLayerGroup,
  FaRightFromBracket,
  FaSliders,
  FaSitemap,
  FaCircleQuestion,
  FaCartShopping
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "../../../../slice/adminSlice";
import { useEffect } from "react";
import JgbLogo from "../../common/JgbLogo";

const subLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-blue-600/20 text-blue-400 font-semibold shadow-inner border-l-2 border-blue-500 pl-3.5"
      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
  }`;

export default function Sidebar() {
  const closeOtherMenus = (event) => {
    if (event.currentTarget.open) {
      document.querySelectorAll(".sidebar-custom details").forEach((menu) => {
        if (menu !== event.currentTarget) {
          menu.removeAttribute("open");
        }
      });
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminLogout = () => {
    dispatch(LogOut());
    navigate("/");
  };

  const token = useSelector((store) => store.adminStore.admintoken);
  const adminInfo = useSelector((store) => store.adminStore.adminInfo);
  const adminImage = useSelector((store) => store.adminStore.adminImage);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const displayName = adminInfo?.name || "JGB Administrator";

  return (
    <aside className="sidebar-custom sticky top-0 hidden h-screen w-72 shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-800 bg-[#0b1324] text-slate-100 shadow-2xl lg:flex">
      <div>
        {/* JGB Trading Brand Logo Header */}
        <div className="flex h-20 items-center justify-start border-b border-slate-800/80 px-5 bg-slate-950/40">
          <JgbLogo variant="light" />
        </div>

        <div className="px-3 py-4">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Powder Catalog Management
          </p>

          <nav className="mt-3 flex flex-col gap-1.5">
            {/* Dashboard */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`
              }
            >
              <FaChartPie className="text-lg text-blue-400" />
              <span>Dashboard</span>
            </NavLink>

            {/* Products Menu */}
            <details onToggle={closeOtherMenus} className="group rounded-xl border border-transparent transition hover:border-slate-800" id="products-menu">
              <summary className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
                <div className="flex items-center gap-3.5">
                  <FaBagShopping className="text-lg text-orange-400" />
                  <span>Products</span>
                </div>
                <FaChevronDown className="text-xs text-slate-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="my-1 flex flex-col gap-1 pl-4 pr-1">
                <NavLink className={subLinkClass} to="/product/add">
                  <FaCircleDot className="text-[10px]" /> Add Product
                </NavLink>
                <NavLink className={subLinkClass} to="/product/view">
                  <FaCircleDot className="text-[10px]" /> View Products
                </NavLink>
              </div>
            </details>

            {/* Parent Category */}
            <details onToggle={closeOtherMenus} className="group rounded-xl border border-transparent transition hover:border-slate-800" id="parent-categories-menu">
              <summary className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
                <div className="flex items-center gap-3.5">
                  <FaLayerGroup className="text-lg text-sky-400" />
                  <span>Parent Categories</span>
                </div>
                <FaChevronDown className="text-xs text-slate-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="my-1 flex flex-col gap-1 pl-4 pr-1">
                <NavLink className={subLinkClass} to="/category/add">
                  <FaCircleDot className="text-[10px]" /> Add Category
                </NavLink>
                <NavLink className={subLinkClass} to="/category/view">
                  <FaCircleDot className="text-[10px]" /> View Categories
                </NavLink>
              </div>
            </details>

            {/* Sub Categories */}
            <details onToggle={closeOtherMenus} className="group rounded-xl border border-transparent transition hover:border-slate-800" id="sub-categories-menu">
              <summary className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
                <div className="flex items-center gap-3.5">
                  <FaSitemap className="text-lg text-emerald-400" />
                  <span>Sub Categories</span>
                </div>
                <FaChevronDown className="text-xs text-slate-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="my-1 flex flex-col gap-1 pl-4 pr-1">
                <NavLink className={subLinkClass} to="/sub-category/add">
                  <FaCircleDot className="text-[10px]" /> Add Sub Category
                </NavLink>
                <NavLink className={subLinkClass} to="/sub-category/view">
                  <FaCircleDot className="text-[10px]" /> View Sub Categories
                </NavLink>
              </div>
            </details>

            {/* Sub Sub Categories */}
            <details onToggle={closeOtherMenus} className="group rounded-xl border border-transparent transition hover:border-slate-800" id="sub-sub-categories-menu">
              <summary className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
                <div className="flex items-center gap-3.5">
                  <FaBoxesStacked className="text-lg text-cyan-400" />
                  <span>Sub Sub Categories</span>
                </div>
                <FaChevronDown className="text-xs text-slate-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="my-1 flex flex-col gap-1 pl-4 pr-1">
                <NavLink className={subLinkClass} to="/sub-sub-category/add">
                  <FaCircleDot className="text-[10px]" /> Add Sub Sub Category
                </NavLink>
                <NavLink className={subLinkClass} to="/sub-sub-category/view">
                  <FaCircleDot className="text-[10px]" /> View Sub Sub Categories
                </NavLink>
              </div>
            </details>

            {/* Materials & Chemical Grades */}
            <details onToggle={closeOtherMenus} className="group rounded-xl border border-transparent transition hover:border-slate-800" id="materials-menu">
              <summary className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
                <div className="flex items-center gap-3.5">
                  <FaFlask className="text-lg text-amber-400" />
                  <span>Materials / Grades</span>
                </div>
                <FaChevronDown className="text-xs text-slate-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="my-1 flex flex-col gap-1 pl-4 pr-1">
                <NavLink className={subLinkClass} to="/material/add">
                  <FaCircleDot className="text-[10px]" /> Add Material
                </NavLink>
                <NavLink className={subLinkClass} to="/material/view">
                  <FaCircleDot className="text-[10px]" /> View Materials
                </NavLink>
              </div>
            </details>

            {/* Colors */}
            <details onToggle={closeOtherMenus} className="group rounded-xl border border-transparent transition hover:border-slate-800" id="colors-menu">
              <summary className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
                <div className="flex items-center gap-3.5">
                  <FaDroplet className="text-lg text-rose-400" />
                  <span>Colors</span>
                </div>
                <FaChevronDown className="text-xs text-slate-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="my-1 flex flex-col gap-1 pl-4 pr-1">
                <NavLink className={subLinkClass} to="/color/add">
                  <FaCircleDot className="text-[10px]" /> Add Color
                </NavLink>
                <NavLink className={subLinkClass} to="/color/view">
                  <FaCircleDot className="text-[10px]" /> View Colors
                </NavLink>
              </div>
            </details>

            {/* Sliders */}
            <details onToggle={closeOtherMenus} className="group rounded-xl border border-transparent transition hover:border-slate-800" id="sliders-menu">
              <summary className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
                <div className="flex items-center gap-3.5">
                  <FaSliders className="text-lg text-purple-400" />
                  <span>Hero Sliders</span>
                </div>
                <FaChevronDown className="text-xs text-slate-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="my-1 flex flex-col gap-1 pl-4 pr-1">
                <NavLink className={subLinkClass} to="/sliders/add">
                  <FaCircleDot className="text-[10px]" /> Add Slider
                </NavLink>
                <NavLink className={subLinkClass} to="/sliders/view">
                  <FaCircleDot className="text-[10px]" /> View Sliders
                </NavLink>
              </div>
            </details>

            {/* Orders */}
            <NavLink
              to="/orders/view"
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`
              }
            >
              <FaCartShopping className="text-lg text-teal-400" />
              <span>Orders</span>
            </NavLink>

            {/* FAQs */}
            <details onToggle={closeOtherMenus} className="group rounded-xl border border-transparent transition hover:border-slate-800" id="faqs-menu">
              <summary className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
                <div className="flex items-center gap-3.5">
                  <FaCircleQuestion className="text-lg text-yellow-400" />
                  <span>FAQs</span>
                </div>
                <FaChevronDown className="text-xs text-slate-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="my-1 flex flex-col gap-1 pl-4 pr-1">
                <NavLink className={subLinkClass} to="/faqs/add">
                  <FaCircleDot className="text-[10px]" /> Add FAQ
                </NavLink>
                <NavLink className={subLinkClass} to="/faqs/view">
                  <FaCircleDot className="text-[10px]" /> View FAQs
                </NavLink>
              </div>
            </details>
          </nav>
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-xs font-bold text-white shadow-md">
            {adminImage ? (
              <img
                src={adminImage}
                alt={displayName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              displayName.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-xs font-bold text-slate-200">{displayName}</span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online Portal
            </span>
          </div>
        </div>

        <button
          onClick={adminLogout}
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 transition-all duration-200 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20"
        >
          <FaRightFromBracket className="text-sm" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
