"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaRegUser } from "react-icons/fa";

import InnerPageHero from "../Components/Page-Sections/InnerPageHero";
import AccountMenu from "../Components/Common/AccountMenu";
import { getUser } from "../utils/store";
import { LogOut } from "../slice/loginSLice";
import { clearCart } from "../slice/cartSLise";
import { clearWishlist } from "../slice/wishlistSlice";
import { clearAuthToken } from "../utils/authToken";

export default function MyDashboardPage() {

  // =========================
  // REDUX
  // =========================

  const dispatch = useDispatch();

  const router = useRouter();

  const token = useSelector(
    (myStore) => myStore.userStore.token
  );

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] = useState(false);

  const [data, setdata] = useState(null);

  const [imagePath, setimagePath] = useState("");

  const [previewImage, setPreviewImage] = useState("");

  const [mounted, setMounted] = useState(false);

  const [user, setUser] = useState(null);

  // =========================
  // API URL
  // =========================

  const apibaseUrl =
    process.env.NEXT_PUBLIC_API_URL;

  // =========================
  // MOUNT
  // =========================

  useEffect(() => {

    const timer = window.setTimeout(() => {

      setMounted(true);

      setUser(getUser());

    }, 0);

    return () => {
      window.clearTimeout(timer);
    };

  }, []);

  // =========================
  // PROFILE FALLBACK
  // =========================

  const profileName =
    user?.name || "Customer Name";

  const profileEmail =
    user?.email || "customer@example.com";

  const profilePhone =
    user?.phone || "+91 98765 43210";

  const profileAddress =
    user?.address ||
    "Add your complete delivery address";

  const defaultProfileImage =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80";

  const backendProfileImage =
    data?.image
      ? `${imagePath}${data.image}`
      : "";

  const profileImage =
    previewImage ||
    backendProfileImage ||
    defaultProfileImage;

  // =========================
  // GET PROFILE
  // =========================

  const getProfile = useCallback(() => {

    if (!token) {
      return;
    }

    axios
      .get(
        `${apibaseUrl}auth/get-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data)

      .then((finalRes) => {

        if (finalRes.status) {

          console.log(finalRes);

          setimagePath(
            finalRes.imagePath
          );

          setdata(
            finalRes.data
          );
        }

      })

      .catch((error) => {

        console.log(error);

      });

  }, [apibaseUrl, token]);

  // =========================
  // GET PROFILE WHEN TOKEN EXISTS
  // =========================

  useEffect(() => {

    if (mounted && token) {

      getProfile();

    }

  }, [getProfile, mounted, token]);

  // =========================
  // CHANGE PROFILE IMAGE
  // =========================

  const changeProfileImage = (event) => {

    const file =
      event.target.files?.[0];

    if (file) {

      setPreviewImage(
        URL.createObjectURL(file)
      );

    }

  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const UpdateProfile = (event) => {

    event.preventDefault();

    const formData =
      new FormData(event.target);

    setLoading(true);

    import("izitoast").then(({ default: iziToast }) => {

    axios
      .post(
        `${apibaseUrl}auth/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => res.data)

      .then((finalRes) => {

        if (finalRes.status) {

          iziToast.success({
            title: "OK",
            message: finalRes.message,
            position: "topRight",
          });

          getProfile();

          setPreviewImage("");

        } else {

          iziToast.error({
            title: "Error",
            message: finalRes.message,
            position: "topRight",
          });

        }

      })

      .catch((error) => {

        console.log(error);

        iziToast.error({
          title: "Error",
          message: "Something went wrong",
          position: "topRight",
        });

      })

      .finally(() => {

        setLoading(false);

      });

    });

  };

  // =========================
  // LOGOUT
  // =========================

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

  // =========================
  // RETURN
  // =========================

  return (

    <div className="bg-white">

      {/* HERO */}

      <InnerPageHero
        title="My Profile"
      />

      <section className="px-4 py-14 md:py-20">

        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[300px_1fr]">

          {/* =========================
              LEFT MENU
          ========================= */}

          <AccountMenu />

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b4ba2]">
                Account Management
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-[#0f2b5c] md:text-3xl">
                My Profile
              </h3>
            </div>

            <div className="grid gap-8 xl:grid-cols-[300px_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 text-center shadow-sm">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="mx-auto h-[140px] w-[140px] rounded-full border-4 border-white object-cover shadow-md"
                />

                <h2 className="mt-4 text-lg font-bold text-[#0f2b5c]">
                  {data?.name || profileName}
                </h2>

                <p className="mt-1 break-all text-xs text-slate-500">
                  {data?.email || profileEmail}
                </p>
              </div>

              <form
                onSubmit={UpdateProfile}
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                autoComplete="off"
              >
                <div>
                  <label
                    htmlFor="profileImage"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Profile Photo
                  </label>
                  <input
                    id="profileImage"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={changeProfileImage}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-600 outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[#0b4ba2] file:px-4 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={data?.name || ""}
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-[#0b4ba2] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Email (Read Only)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={data?.email || ""}
                    readOnly
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Mobile Number *
                  </label>
                  <input
                    id="mobileNumber"
                    name="phone"
                    type="tel"
                    maxLength={15}
                    defaultValue={data?.phone || ""}
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-[#0b4ba2] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Delivery / Billing Address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    defaultValue={data?.address || ""}
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-[#0b4ba2] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-[#0b4ba2] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500 disabled:opacity-50"
                >
                  {loading ? "Updating Profile..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
