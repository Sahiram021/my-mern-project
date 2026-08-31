"use client";

import axios from "axios";
import iziToast from "izitoast";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ResetPassword() {
  const { id } = useParams();
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const resetPassword = (event) => {
    event.preventDefault();
    setFormErrors({});

    const newPassword = event.target.newPassword.value;
    const confirmPassword = event.target.confirmPassword.value;

    const errors = {};
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Password and Confirm Password must match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    const obj = {
      newPassword,
      confirmPassword,
    };

    axios
      .post(`${apibaseUrl}auth/reset-password/${id}`, obj)
      .then((res) => res.data)
      .then((finalRes) => {
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
          setFormErrors({ general: finalRes.message });
        }
        setLoading(false);
      })
      .catch(() => {
        iziToast.error({
          title: "Error",
          message: "Unable to reset password. Link may be expired.",
          position: "topRight",
        });
        setFormErrors({ general: "Unable to reset password. Link may be expired." });
        setLoading(false);
      });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <p className="text-xs text-slate-500">
            <Link href="/" className="hover:text-[#0b4ba2]">Home</Link> / Reset Password
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-[#0f2b5c]">
            Reset Account Password
          </h1>
        </div>
      </section>

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
          <h2 className="text-xl font-bold text-[#0f2b5c]">
            Create New Password
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Enter your new password below and confirm it to continue.
          </p>

          <form onSubmit={resetPassword} className="mt-6 space-y-4">
            {formErrors?.general && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                {formErrors.general}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                New Password
              </label>
              <input
                name="newPassword"
                type="password"
                placeholder="Enter new password (min 6 characters)"
                onChange={() => setFormErrors((prev) => ({ ...prev, newPassword: "", general: "" }))}
                className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition focus:ring-2 ${
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                onChange={() => setFormErrors((prev) => ({ ...prev, confirmPassword: "", general: "" }))}
                className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition focus:ring-2 ${
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
              className="mt-2 h-12 w-full rounded-xl bg-[#0b4ba2] text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500 disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

