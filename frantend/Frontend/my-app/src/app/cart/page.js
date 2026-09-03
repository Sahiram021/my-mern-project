"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountMenu from "../Components/Common/AccountMenu";
import InnerPageHero from "../Components/Page-Sections/InnerPageHero";
import {
  deleteCartItem,
  fetchCartById,
  updateCartQuantity,
} from "../slice/cartSLise";
import {
  buildProductImageUrl,
  PRODUCT_IMAGE_PLACEHOLDER,
} from "../utils/imageUrl";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

function productSlug(item) {
  if (item.slug && !String(item.slug).match(/^[0-9a-fA-F]{24}$/)) {
    return item.slug;
  }

  return (item.name || "calcium-powder")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function notify(type, message) {
  try {
    const { default: iziToast } = await import("izitoast");
    iziToast[type]({
      message,
      position: "topRight",
      title: type === "success" ? "Success" : "Cart",
    });
  } catch {
    // The inline status remains available if the optional toast cannot load.
  }
}

export default function CartPage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userStore.token);
  const { cart = [], status = "idle", error = null } = useSelector(
    (state) => state.cartStore
  );
  const [pendingItem, setPendingItem] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCartById());
  }, [token, dispatch]);

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  async function changeQuantity(item, nextQuantity) {
    const id = String(item._id || "");
    const qty = Math.min(50, Math.max(1, Number(nextQuantity) || 1));

    if (!id || qty === Number(item.qty)) return;

    setPendingItem(id);
    setActionMessage("");
    try {
      const result = await dispatch(updateCartQuantity({ id, qty })).unwrap();
      setActionMessage(result.message || "Quantity updated");
    } catch (message) {
      const text = String(message || "Unable to update quantity");
      setActionMessage(text);
      notify("error", text);
    } finally {
      setPendingItem("");
    }
  }

  async function removeItem(item) {
    const id = String(item._id || "");
    if (!id) return;

    setPendingItem(id);
    setActionMessage("");
    try {
      const result = await dispatch(deleteCartItem(id)).unwrap();
      const text = result.message || "Item removed from cart";
      setActionMessage(text);
      notify("success", text);
    } catch (message) {
      const text = String(message || "Unable to remove this item");
      setActionMessage(text);
      notify("error", text);
    } finally {
      setPendingItem("");
    }
  }

  const showInitialLoading = status === "loading" && cart.length === 0;
  const showLoadError = status === "failed" && cart.length === 0;

  return (
    <div className="min-w-0 overflow-x-clip bg-white">
      <InnerPageHero title="Cart" />

      <section className="px-3 py-10 sm:px-4 md:py-16">
        <div className="mx-auto grid min-w-0 max-w-[1500px] gap-6 2xl:grid-cols-[220px_minmax(0,1fr)] 2xl:gap-8">
          <div className="hidden 2xl:block">
            <AccountMenu />
          </div>

          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
            <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {(error || actionMessage) && cart.length > 0 && (
                <div
                  role="status"
                  className={`border-b px-4 py-3 text-xs font-semibold ${
                    error
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {error || actionMessage}
                </div>
              )}

              {showInitialLoading ? (
                <CartLoadingState />
              ) : showLoadError ? (
                <CartErrorState
                  message={error}
                  onRetry={() => dispatch(fetchCartById())}
                />
              ) : cart.length > 0 ? (
                <>
                  <div className="space-y-3 p-3 sm:p-4 lg:hidden">
                    {cart.map((item) => (
                      <CartItemCard
                        key={item._id || item.productId || productSlug(item)}
                        item={item}
                        pending={pendingItem === String(item._id)}
                        onChangeQuantity={changeQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>

                  <div className="hidden lg:block">
                    <table className="w-full table-fixed border-collapse">
                      <colgroup>
                        <col className="w-[36%]" />
                        <col className="w-[15%]" />
                        <col className="w-[20%]" />
                        <col className="w-[18%]" />
                        <col className="w-[11%]" />
                      </colgroup>
                      <thead>
                        <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                          <th className="px-4 py-4">Product</th>
                          <th className="px-3 py-4">Price</th>
                          <th className="px-3 py-4">Qty</th>
                          <th className="px-3 py-4">Total</th>
                          <th className="px-3 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {cart.map((item) => (
                          <CartItemRow
                            key={item._id || item.productId || productSlug(item)}
                            item={item}
                            pending={pendingItem === String(item._id)}
                            onChangeQuantity={changeQuantity}
                            onRemove={removeItem}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <CartEmptyState />
              )}
            </div>

            <CartTotals total={cartTotal} hasItems={cart.length > 0} />
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductImage({ item, className }) {
  return (
    <img
      src={buildProductImageUrl(item.image)}
      alt={item.name || "Product"}
      width={80}
      height={80}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
      }}
      className={className}
    />
  );
}

function ProductDetails({ item, compact = false }) {
  return (
    <div className="min-w-0">
      <Link
        href={`/product-details/${productSlug(item)}`}
        className={`${
          compact ? "text-sm" : "text-base"
        } block break-words font-bold leading-snug text-[#0f2b5c] transition hover:text-[#0b4ba2]`}
      >
        {item.name || "Product"}
      </Link>
      {item.category && (
        <p className="mt-1 break-words text-xs text-slate-500">
          {typeof item.category === "object"
            ? item.category.name
            : item.category}
        </p>
      )}
    </div>
  );
}

function QuantityControl({ item, pending, onChangeQuantity }) {
  const qty = Math.max(1, Number(item.qty) || 1);

  return (
    <div className="flex h-11 w-32 shrink-0 items-center rounded-lg border border-slate-200 bg-white">
      <button
        className="flex h-full w-11 items-center justify-center rounded-l-lg text-base font-bold text-slate-600 transition hover:bg-slate-100 hover:text-[#0b4ba2] disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onChangeQuantity(item, qty - 1)}
        disabled={pending || qty <= 1}
        aria-label={`Decrease quantity of ${item.name || "product"}`}
        type="button"
      >
        &minus;
      </button>
      <span className="grid flex-1 place-items-center text-sm font-bold text-slate-800">
        {qty}
      </span>
      <button
        className="flex h-full w-11 items-center justify-center rounded-r-lg text-base font-bold text-slate-600 transition hover:bg-slate-100 hover:text-[#0b4ba2] disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onChangeQuantity(item, qty + 1)}
        disabled={pending || qty >= 50}
        aria-label={`Increase quantity of ${item.name || "product"}`}
        type="button"
      >
        +
      </button>
    </div>
  );
}

function RemoveButton({ item, pending, onRemove }) {
  return (
    <button
      type="button"
      onClick={() => onRemove(item)}
      disabled={pending}
      aria-label={`Remove ${item.name || "product"} from cart`}
      className="inline-flex min-h-11 items-center justify-center rounded-lg px-2 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Updating..." : "Remove"}
    </button>
  );
}

function CartItemCard({ item, pending, onChangeQuantity, onRemove }) {
  const lineTotal = Number(item.price || 0) * Number(item.qty || 0);

  return (
    <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-xs sm:p-4">
      <div className="flex min-w-0 items-start gap-3">
        <ProductImage
          item={item}
          className="h-20 w-20 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1"
        />
        <ProductDetails item={item} compact />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3 text-sm">
        <div className="min-w-0">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Price
          </dt>
          <dd className="mt-1 break-words font-semibold text-slate-700">
            {formatCurrency(item.price)}
          </dd>
        </div>
        <div className="min-w-0 text-right">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total
          </dt>
          <dd className="mt-1 break-words font-bold text-[#0f2b5c]">
            {formatCurrency(lineTotal)}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex min-w-0 items-center justify-between gap-2">
        <QuantityControl
          item={item}
          pending={pending}
          onChangeQuantity={onChangeQuantity}
        />
        <RemoveButton item={item} pending={pending} onRemove={onRemove} />
      </div>
    </article>
  );
}

function CartItemRow({ item, pending, onChangeQuantity, onRemove }) {
  const lineTotal = Number(item.price || 0) * Number(item.qty || 0);

  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-5 align-middle">
        <div className="flex min-w-0 items-center gap-3">
          <ProductImage
            item={item}
            className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1"
          />
          <ProductDetails item={item} compact />
        </div>
      </td>
      <td className="break-words px-3 py-5 align-middle font-semibold text-slate-700">
        {formatCurrency(item.price)}
      </td>
      <td className="px-3 py-5 align-middle">
        <QuantityControl
          item={item}
          pending={pending}
          onChangeQuantity={onChangeQuantity}
        />
      </td>
      <td className="break-words px-3 py-5 align-middle font-bold text-[#0f2b5c]">
        {formatCurrency(lineTotal)}
      </td>
      <td className="px-3 py-5 align-middle">
        <RemoveButton item={item} pending={pending} onRemove={onRemove} />
      </td>
    </tr>
  );
}

function CartTotals({ total, hasItems }) {
  return (
    <aside className="h-fit min-w-0 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 shadow-sm sm:p-6 xl:sticky xl:top-20">
      <h2 className="text-xl font-bold text-[#0f2b5c]">Cart Totals</h2>
      <div className="mt-6 space-y-4 text-sm text-slate-600">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <span>Subtotal</span>
          <span className="min-w-0 break-words text-right font-semibold text-slate-800">
            {formatCurrency(total)}
          </span>
        </div>
        <div className="flex min-w-0 items-start justify-between gap-3">
          <span className="shrink-0">Freight / Dispatch</span>
          <span className="min-w-0 break-words text-right font-bold text-emerald-600">
            Ready for Dispatch
          </span>
        </div>
        <div className="flex min-w-0 items-start justify-between gap-3 border-t border-slate-200 pt-4 text-base font-bold text-[#0f2b5c]">
          <span>Total</span>
          <span className="min-w-0 break-words text-right">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
      <Link
        href={hasItems ? "/checkout" : "/ready-to-ship"}
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#0b4ba2] px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500"
      >
        {hasItems ? "Proceed To Checkout" : "Shop Powder Products"}
      </Link>
    </aside>
  );
}

function CartLoadingState() {
  return (
    <div className="px-5 py-16 text-center" role="status">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b4ba2]" />
      <p className="mt-4 text-sm font-semibold text-slate-600">
        Loading your cart...
      </p>
    </div>
  );
}

function CartErrorState({ message, onRetry }) {
  return (
    <div className="px-5 py-14 text-center" role="alert">
      <h2 className="text-xl font-bold text-[#0f2b5c]">
        We could not load your cart
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {message || "Please check your connection and try again."}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b4ba2] px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-500"
      >
        Retry Cart
      </button>
    </div>
  );
}

function CartEmptyState() {
  return (
    <div className="px-5 py-14 text-center sm:px-6 sm:py-16">
      <h2 className="text-2xl font-bold text-[#0f2b5c]">Your cart is empty</h2>
      <p className="mt-2 text-sm text-slate-500">
        Add Calcium and Anti-Moisture Powder products to your cart.
      </p>
      <Link
        href="/ready-to-ship"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b4ba2] px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-orange-500"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
