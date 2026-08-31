"use client";

import InnerPageHero from "../Components/Page-Sections/InnerPageHero";
import AccountMenu from "../Components/Common/AccountMenu";
import { useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";

export default function ChangePassword() {
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const token = useSelector((myStore) => myStore.userStore.token);

  const changeMyPassword = async (event) => {
    event.preventDefault();
    setFormErrors({});

    const oldPassword = event.target.oldPassword.value;
    const newPassword = event.target.newPassword.value;
    const confirmPassword = event.target.confirmPassword.value;

    const errors = {};
    if (!oldPassword) {
      errors.oldPassword = "Old password is required";
    }
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters long";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "New password and Confirm password must match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    const { default: iziToast } = await import("izitoast");

    const obj = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    axios
      .post(`${apibaseUrl}auth/change-password`, obj, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data)
      .then((finalRes) => {
        setLoading(false);
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
          const msg = finalRes.message || "";
          if (msg.toLowerCase().includes("old") || msg.toLowerCase().includes("current")) {
            setFormErrors({ oldPassword: msg });
          } else {
            setFormErrors({ general: msg });
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        const msg = err?.response?.data?.message || "Failed to update password";
        iziToast.error({
          title: "Error",
          message: msg,
          position: "topRight",
        });
        setFormErrors({ general: msg });
      });
  };

  return (
    <div className="bg-white">
      <InnerPageHero title="Change Password" />

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[300px_1fr]">
          <AccountMenu />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="max-w-[620px]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b4ba2]">
                Account Security
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#0f2b5c] md:text-3xl">
                Change Account Password
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Update your account password by entering your old password and confirming the new one.
              </p>

              <form onSubmit={changeMyPassword} className="mt-6 space-y-4">
                {formErrors?.general && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                    {formErrors.general}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="oldPassword"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Old Password
                  </label>
                  <input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    placeholder="Enter current password"
                    onChange={() => setFormErrors((prev) => ({ ...prev, oldPassword: "", general: "" }))}
                    className={`h-11 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                      formErrors?.oldPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                    }`}
                  />
                  {formErrors?.oldPassword && (
                    <span className="mt-1 block text-xs font-medium text-red-500">{formErrors.oldPassword}</span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    onChange={() => setFormErrors((prev) => ({ ...prev, newPassword: "", general: "" }))}
                    className={`h-11 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                      formErrors?.newPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                    }`}
                  />
                  {formErrors?.newPassword && (
                    <span className="mt-1 block text-xs font-medium text-red-500">{formErrors.newPassword}</span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    onChange={() => setFormErrors((prev) => ({ ...prev, confirmPassword: "", general: "" }))}
                    className={`h-11 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                      formErrors?.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                    }`}
                  />
                  {formErrors?.confirmPassword && (
                    <span className="mt-1 block text-xs font-medium text-red-500">{formErrors.confirmPassword}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-[#0b4ba2] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

