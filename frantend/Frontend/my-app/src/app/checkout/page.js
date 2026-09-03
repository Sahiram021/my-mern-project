"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InnerPageHero from "../Components/Page-Sections/InnerPageHero";
import { useSelector } from "react-redux";
import axios from "axios";
import { fetchCartById } from "../slice/cartSLise";
import { useDispatch } from "react-redux";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { saveOrder } from "../utils/store";



export default function CheckoutPage() {
  const { error, isLoading, Razorpay } = useRazorpay();
  let cart = useSelector((myStore) => myStore.cartStore.cart);
  let token = useSelector((myStore) => myStore.userStore.token);
  const router = useRouter();
  const [payment, setPayment] = useState("cod");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    postal: "",
    address: "",
  });

  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  function updateField(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }
  let dispatch = useDispatch();
  let apibaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://jgbmtrading.online/api/web/";

  useEffect(() => {
    if (token) dispatch(fetchCartById());
  }, [token, dispatch]);
  async function placeOrder() {
    const { default: izitoast } = await import("izitoast");

    if (!cart.length) {
      setMessage("Cart empty hai. Pehle product add karo.");
      izitoast.warning({
        title: "Cart Empty",
        message: "Please add products to cart before checkout.",
        position: "topRight"
      });
      return;
    }

    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.email.trim()) {
      errors.email = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!form.phone.trim()) errors.phone = "Mobile number is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.postal.trim()) errors.postal = "Postal code / PIN is required";
    if (!form.address.trim()) errors.address = "Complete delivery address is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setMessage("Please complete all required delivery fields.");
      return;
    }

    let orderObject = {
      items: cart.map((item) => ({ name: item.name, image: item.image, price: item.price, qty: item.qty })),
      totalAmount: subtotal,
      shippingAddress: form,
      paymentMethod: payment,
    };

    axios.post(`${apibaseUrl}order/save-order`, orderObject, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (payment == "cod") {
          if (response.data.status) {
            saveOrder({
              ...orderObject,
              id: response.data.id || response.data.data?._id || response.data.order?._id,
              createdAt: new Date().toISOString(),
              status: "Confirmed",
              paymentStatus: "Pending",
            });
            izitoast.success({
              title: "Success",
              message: response.data.message,
              position: "topRight"
            });
            dispatch(fetchCartById());
            router.push("/thank-you");
          }
        }
      })
      .catch(() => {
        setMessage("Error placing order. Please try again.");
      });
  }

  return (
    <div className="bg-white">
      <InnerPageHero title="Checkout" />

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-[1500px] gap-8 xl:grid-cols-[1fr_390px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-extrabold text-[#0f2b5c]">Billing &amp; Delivery Details</h2>
            {message && <p className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-semibold text-[#0b4ba2]">{message}</p>}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={updateField}
                  type="text"
                  placeholder="First Name *"
                  className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                    formErrors?.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                  }`}
                />
                {formErrors?.firstName && <span className="mt-1 block text-xs text-red-500">{formErrors.firstName}</span>}
              </div>

              <div>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={updateField}
                  type="text"
                  placeholder="Last Name"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#0b4ba2] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <input
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  type="email"
                  placeholder="Business / Contact Email *"
                  className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                    formErrors?.email ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                  }`}
                />
                {formErrors?.email && <span className="mt-1 block text-xs text-red-500">{formErrors.email}</span>}
              </div>

              <div className="md:col-span-2">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  type="text"
                  placeholder="Mobile Number (e.g., 8810426236) *"
                  className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                    formErrors?.phone ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                  }`}
                />
                {formErrors?.phone && <span className="mt-1 block text-xs text-red-500">{formErrors.phone}</span>}
              </div>

              <div>
                <input
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  type="text"
                  placeholder="City *"
                  className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                    formErrors?.city ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                  }`}
                />
                {formErrors?.city && <span className="mt-1 block text-xs text-red-500">{formErrors.city}</span>}
              </div>

              <div>
                <input
                  name="postal"
                  value={form.postal}
                  onChange={updateField}
                  type="text"
                  placeholder="Postal Code / PIN *"
                  className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                    formErrors?.postal ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                  }`}
                />
                {formErrors?.postal && <span className="mt-1 block text-xs text-red-500">{formErrors.postal}</span>}
              </div>

              <div className="md:col-span-2">
                <textarea
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  rows={4}
                  placeholder="Full Delivery / Plant Address *"
                  className={`w-full rounded-xl border p-4 text-sm outline-none transition focus:ring-2 ${
                    formErrors?.address ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#0b4ba2] focus:ring-blue-100"
                  }`}
                />
                {formErrors?.address && <span className="mt-1 block text-xs text-red-500">{formErrors.address}</span>}
              </div>
            </div>
          </div>

          <aside className="sticky top-20 h-fit rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0f2b5c]">Your Order</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              {cart.length ? (
                cart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between gap-4 text-xs">
                    <span className="font-medium text-slate-800">{item.name} x {item.qty}</span>
                    <span className="font-bold text-[#0f2b5c]">₹{(Number(item.price || 0) * Number(item.qty || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No products in cart.</p>
              )}
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs">
                <span>Dispatch / Logistics</span>
                <span className="font-bold text-emerald-600">From Raipur Hub</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-[#0f2b5c]">
                <span>Total Amount</span>
                <span className="text-[#0b4ba2]">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-slate-200 pt-4">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                  className="accent-[#0b4ba2]"
                />
                <span>Direct Dispatch (Cash / RTGS on Delivery)</span>
              </label>

              {/* Online Payment commented out temporarily
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "online"}
                  onChange={() => setPayment("online")}
                  className="accent-[#0b4ba2]"
                />
                <span>Instant Online Payment (UPI / Razorpay)</span>
              </label>
              */}
            </div>

            <button onClick={placeOrder} className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#0b4ba2] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500">
              Confirm &amp; Place Order
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}
