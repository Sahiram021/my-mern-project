"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../slice/loginSLice";
import { fetchCartById } from "../slice/cartSLise";
import { fetchWishlist } from "../slice/wishlistSlice";

export default function LoginRegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [activeMode, setActiveMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const handleLogin = (event) => {
    event.preventDefault();
    setLoginErrors({});

    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    const errors = {};
    if (!email) {
      errors.email = "Email Address is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoading(true);

    const obj = { email, password };

    axios
      .post(`${apibaseUrl}auth/login`, obj)
      .then((res) => res.data)
      .then((finalRes) => {
        setLoading(false);
        if (finalRes.status) {
          toast.success(finalRes.message || "Login Successful");
          if (typeof window !== "undefined") {
            localStorage.setItem("token", finalRes.token);
          }
          dispatch(getToken({ token: finalRes.token }));
          dispatch(fetchCartById());
          dispatch(fetchWishlist());
          router.push("/");
        } else {
          const msg = finalRes.message || "Invalid credentials";
          toast.error(msg);
          const backendErr = {};
          if (msg.toLowerCase().includes("email")) {
            backendErr.email = msg;
          } else if (msg.toLowerCase().includes("password")) {
            backendErr.password = msg;
          } else {
            backendErr.general = msg;
          }
          setLoginErrors(backendErr);
        }
      })
      .catch((err) => {
        setLoading(false);
        const msg = err?.response?.data?.message || "Login failed. Please check your credentials.";
        toast.error(msg);
        setLoginErrors({ general: msg });
      });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setRegisterErrors({});

    const name = event.target.name.value.trim();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    const errors = {};
    if (!name) {
      errors.name = "Full name is required";
    }
    if (!email) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setLoading(true);

    const registerObj = {
      name,
      email,
      password,
    };

    try {
      const res = await axios.post(`${apibaseUrl}auth/register`, registerObj);
      const finalRes = res.data;

      if (finalRes.status) {
        toast.success("Welcome to JGB Trading! Account created successfully.");

        // If backend returned token directly in register response
        if (finalRes.token) {
          if (typeof window !== "undefined") {
            localStorage.setItem("token", finalRes.token);
          }
          dispatch(getToken({ token: finalRes.token }));
          setLoading(false);
          router.push("/");
          return;
        }

        // Auto-login to obtain token immediately
        try {
          const loginRes = await axios.post(`${apibaseUrl}auth/login`, {
            email,
            password,
          });
          const loginData = loginRes.data;

          if (loginData.status && loginData.token) {
            if (typeof window !== "undefined") {
              localStorage.setItem("token", loginData.token);
            }
            dispatch(getToken({ token: loginData.token }));
          }
        } catch (loginErr) {
          console.log("Auto-login error:", loginErr?.message);
        }

        setLoading(false);
        router.push("/");
      } else {
        setLoading(false);
        const msg = finalRes.message || "Registration failed";
        toast.error(msg);

        const backendErrors = {};
        if (msg.toLowerCase().includes("email")) {
          backendErrors.email = msg;
        } else if (msg.toLowerCase().includes("password")) {
          backendErrors.password = msg;
        } else if (msg.toLowerCase().includes("name")) {
          backendErrors.name = msg;
        } else {
          backendErrors.general = msg;
        }
        setRegisterErrors(backendErrors);
      }
    } catch (err) {
      setLoading(false);
      const data = err?.response?.data;
      const msg = data?.message || "Validation error";
      toast.error(msg);

      const backendErrors = {};
      if (msg.toLowerCase().includes("email")) {
        backendErrors.email = msg;
      } else if (msg.toLowerCase().includes("password")) {
        backendErrors.password = msg;
      } else if (msg.toLowerCase().includes("name")) {
        backendErrors.name = msg;
      } else {
        backendErrors.general = msg;
      }
      setRegisterErrors(backendErrors);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <ToastContainer position="top-right" autoClose={3000} />

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-xs text-slate-500">
            <Link href="/" className="transition hover:text-[#0b4ba2]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-[#0f2b5c]">
              {activeMode === "login" ? "Account Login" : "Register Account"}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-[#0f2b5c]">
            {activeMode === "login" ? "Welcome Back to JGB Trading" : "Create JGB Trading Account"}
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Manage your Calcium &amp; Anti Moisture Powder orders, quotations, and dispatch tracking.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-xl px-4 lg:px-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
            {/* BRAND LOGO HEADER */}
            <div className="flex flex-col items-center justify-center border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-6 py-6 text-center">
              <img
                src="/images/jgb-logo.jpg"
                alt="JGB Trading Private Limited"
                className="h-16 w-16 rounded-2xl object-contain shadow-sm border border-slate-100 bg-white"
              />
              <span className="mt-2.5 text-base font-black tracking-tight text-[#0f2b5c]">
                JGB TRADING PRIVATE LIMITED
              </span>
              <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-[#f97316]">
                Trust • Growth • Success
              </span>
            </div>

            <div className="flex border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setActiveMode("login");
                  setLoginErrors({});
                  setRegisterErrors({});
                }}
                className={`flex-1 py-4 text-center text-sm font-bold uppercase tracking-wider transition ${
                  activeMode === "login"
                    ? "border-b-2 border-[#0b4ba2] bg-white text-[#0b4ba2]"
                    : "text-slate-500 hover:text-[#0b4ba2]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode("register");
                  setLoginErrors({});
                  setRegisterErrors({});
                }}
                className={`flex-1 py-4 text-center text-sm font-bold uppercase tracking-wider transition ${
                  activeMode === "register"
                    ? "border-b-2 border-[#0b4ba2] bg-white text-[#0b4ba2]"
                    : "text-slate-500 hover:text-[#0b4ba2]"
                }`}
              >
                Register
              </button>
            </div>

            <div className="p-8 md:p-10">
              {activeMode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  {loginErrors?.general && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                      {loginErrors.general}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your registered email"
                      onChange={() => setLoginErrors((prev) => ({ ...prev, email: "", general: "" }))}
                      className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                        loginErrors?.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                      }`}
                    />
                    {loginErrors?.email && (
                      <span className="mt-1 block text-xs font-medium text-red-500">{loginErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-[#0b4ba2] hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <input
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      onChange={() => setLoginErrors((prev) => ({ ...prev, password: "", general: "" }))}
                      className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                        loginErrors?.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                      }`}
                    />
                    {loginErrors?.password && (
                      <span className="mt-1 block text-xs font-medium text-red-500">{loginErrors.password}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-[#0b4ba2] text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500 disabled:opacity-60"
                  >
                    {loading ? "Logging in..." : "Login to Account"}
                  </button>

                  <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                    <p className="text-sm text-slate-600">
                      Don&apos;t have an account yet?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode("register");
                          setLoginErrors({});
                          setRegisterErrors({});
                        }}
                        className="font-bold text-[#0b4ba2] underline hover:text-orange-500"
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">
                  {registerErrors?.general && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                      {registerErrors.general}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Full Name / Business Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      onChange={() => setRegisterErrors((prev) => ({ ...prev, name: "", general: "" }))}
                      className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                        registerErrors?.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                      }`}
                    />
                    {registerErrors?.name && (
                      <span className="mt-1 block text-xs font-medium text-red-500">{registerErrors.name}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your business email"
                      onChange={() => setRegisterErrors((prev) => ({ ...prev, email: "", general: "" }))}
                      className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                        registerErrors?.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                      }`}
                    />
                    {registerErrors?.email && (
                      <span className="mt-1 block text-xs font-medium text-red-500">{registerErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      placeholder="Create a secure password (min 6 characters)"
                      onChange={() => setRegisterErrors((prev) => ({ ...prev, password: "", general: "" }))}
                      className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                        registerErrors?.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                      }`}
                    />
                    {registerErrors?.password && (
                      <span className="mt-1 block text-xs font-medium text-red-500">{registerErrors.password}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-[#0b4ba2] text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500 disabled:opacity-60"
                  >
                    {loading ? "Creating Account..." : "Create Account (Register)"}
                  </button>

                  <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                    <p className="text-sm text-slate-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode("login");
                          setLoginErrors({});
                          setRegisterErrors({});
                        }}
                        className="font-bold text-[#0b4ba2] underline hover:text-orange-500"
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

