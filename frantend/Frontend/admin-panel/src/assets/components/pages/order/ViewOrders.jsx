import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaEye,
  FaFilter,
  FaMagnifyingGlass,
  FaRotate,
} from "react-icons/fa6";
import { showError, showSuccess } from "../../common/notification/notification";
import { getApiErrorMessage } from "../../../../api/errors";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "success", label: "Success" },
  { value: "placed", label: "Placed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusClasses = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  placed: "border-indigo-200 bg-indigo-50 text-indigo-700",
  shipped: "border-cyan-200 bg-cyan-50 text-cyan-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCustomerName(order) {
  return (
    order?.shippingAddress?.name ||
    order?.shippingAddress?.fullName ||
    order?.shippingAddress?.firstName ||
    "Customer"
  );
}

function getCustomerContact(order) {
  return (
    order?.shippingAddress?.phone ||
    order?.shippingAddress?.mobile ||
    order?.shippingAddress?.email ||
    "-"
  );
}

function getItemName(item) {
  return (
    item?.name ||
    item?.productName ||
    item?.product?.name ||
    item?.productId?.name ||
    "-"
  );
}

function getItemPrice(item) {
  return item?.price || item?.product?.price || item?.productId?.price || 0;
}

function getTotalQuantity(order) {
  return (order?.items || []).reduce(
    (total, item) => total + Number(item?.quantity || item?.qty || 1),
    0
  );
}

export default function ViewOrders() {
  const [data, setData] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [draftStatus, setDraftStatus] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  const rawBaseUrl =
    import.meta.env.VITE_APIBASEPATH || "http://localhost:8000/admin/";
  const apiBaseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;

  const getOrders = useCallback(() => {
    setLoading(true);
    axios
      .get(`${apiBaseUrl}order/view`)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          const orders = finalRes.data || [];
          setData(orders);
          setDraftStatus(
            orders.reduce((acc, order) => {
              acc[order._id] = order.status || "pending";
              return acc;
            }, {})
          );
        } else {
          showError(finalRes.message || "Failed to load orders");
        }
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Error occurred while loading orders";
        showError(typeof errorMsg === "string" ? errorMsg : "Error occurred while loading orders");
      })
      .finally(() => setLoading(false));
  }, [apiBaseUrl]);

  useEffect(() => {
    const timer = window.setTimeout(() => getOrders(), 0);
    return () => window.clearTimeout(timer);
  }, [getOrders]);

  const filteredOrders = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return data.filter((order) => {
      const currentStatus = draftStatus[order._id] || order.status || "pending";
      const matchesStatus = statusFilter ? currentStatus === statusFilter : true;
      const haystack = [
        order._id,
        getCustomerName(order),
        getCustomerContact(order),
        order.paymentMethod,
        order.PaymentStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!search || haystack.includes(search));
    });
  }, [data, draftStatus, searchText, statusFilter]);

  const stats = useMemo(() => {
    return data.reduce(
      (acc, order) => {
        const currentStatus = draftStatus[order._id] || order.status || "pending";
        acc.total += 1;
        acc.amount += Number(order.totalAmount || 0);
        acc[currentStatus] = (acc[currentStatus] || 0) + 1;
        return acc;
      },
      { total: 0, amount: 0, pending: 0, processing: 0, success: 0 }
    );
  }, [data, draftStatus]);

  const updateStatus = (orderId) => {
    const nextStatus = draftStatus[orderId];
    if (!nextStatus) {
      showError("Please select a status");
      return;
    }

    setSavingId(orderId);
    axios
      .patch(`${apiBaseUrl}order/${orderId}/status`, { status: nextStatus })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          const persistedOrder = finalRes.data || { _id: orderId, status: nextStatus };
          setData((orders) =>
            orders.map((order) =>
              order._id === orderId ? { ...order, ...persistedOrder } : order
            )
          );
          setDraftStatus((statuses) => ({
            ...statuses,
            [orderId]: persistedOrder.status || nextStatus,
          }));
          setViewData((order) =>
            order?._id === orderId ? { ...order, ...persistedOrder } : order
          );
          showSuccess(finalRes.message || "Order status updated successfully");
        } else {
          const errorMsg =
            finalRes.message ||
            (typeof finalRes.error === "string" ? finalRes.error : finalRes.error?.status) ||
            "Failed to update order status";
          showError(errorMsg);
        }
      })
      .catch((err) => {
        showError(getApiErrorMessage(err, "Error occurred while saving order status"));
      })
      .finally(() => setSavingId(""));
  };
  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("");
  };

  return (
    <section className="w-full bg-slate-50">
      <nav className="flex border-b bg-white px-6 py-3 shadow-sm">
        <ol className="inline-flex items-center space-x-2 text-gray-600">
          <li className="text-md font-medium">Home</li>
          <li>/</li>
          <li className="text-md font-medium">Orders</li>
          <li>/</li>
          <li className="text-md font-medium text-gray-900">View Orders</li>
        </ol>
      </nav>

      <div className="space-y-5 p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Total Orders</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-amber-700">Pending</p>
            <p className="mt-2 text-3xl font-bold text-amber-800">{stats.pending}</p>
          </div>
          <div className="rounded-md border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">Processing</p>
            <p className="mt-2 text-3xl font-bold text-blue-800">{stats.processing}</p>
          </div>
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-emerald-700">Success</p>
            <p className="mt-2 text-3xl font-bold text-emerald-800">{stats.success}</p>
          </div>
        </div>

        <div className="rounded-md border border-slate-300 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-slate-100 px-5 py-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Order View</h2>
              <p className="mt-1 text-sm text-slate-500">
                Total amount: Rs. {stats.amount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <FaFilter /> Filter
              </button>
              <button
                type="button"
                onClick={getOrders}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-950"
              >
                <FaRotate /> Refresh
              </button>
            </div>
          </div>

          {showSearch && (
            <div className="grid gap-4 border-b border-slate-200 px-5 py-4 md:grid-cols-[1fr_220px_auto] md:items-end">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Search
                </label>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Order ID, customer, phone, email"
                  className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <FaMagnifyingGlass /> Reset
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-left text-sm text-slate-600">
              <thead className="border-b bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-700">
                <tr>
                  <th className="px-5 py-4">S. No.</th>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Qty</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-5 py-10 text-center text-slate-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => {
                    const currentStatus = draftStatus[order._id] || order.status || "pending";
                    const isDirty = currentStatus !== (order.status || "pending");

                    return (
                      <tr key={order._id} className="border-b bg-white align-top last:border-b-0 hover:bg-slate-50">
                        <td className="px-5 py-5 font-semibold text-slate-800">{index + 1}</td>
                        <td className="px-5 py-5">
                          <div className="max-w-[170px] break-all font-semibold text-slate-900">
                            #{order._id}
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <p className="font-semibold text-slate-900">{getCustomerName(order)}</p>
                          <p className="mt-1 text-xs text-slate-500">{getCustomerContact(order)}</p>
                        </td>
                        <td className="px-5 py-5 font-semibold">{getTotalQuantity(order)}</td>
                        <td className="px-5 py-5 font-bold text-slate-900">
                          Rs. {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-5 py-5">
                          <p className="font-semibold capitalize text-slate-800">
                            {order.paymentMethod || "-"}
                          </p>
                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {order.PaymentStatus || "pending"}
                          </p>
                        </td>
                        <td className="px-5 py-5">{formatDate(order.createdAt)}</td>
                        <td className="px-5 py-5">
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              setDraftStatus((prev) => ({
                                ...prev,
                                [order._id]: e.target.value,
                              }))
                            }
                            className={`h-10 w-36 rounded-lg border px-3 text-sm font-bold capitalize outline-none transition focus:ring-2 focus:ring-blue-100 ${statusClasses[currentStatus] || statusClasses.pending}`}
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => updateStatus(order._id)}
                              disabled={!isDirty || savingId === order._id}
                              className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              <FaCheck /> {savingId === order._id ? "Saving" : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewData(viewData?._id === order._id ? null : order)}
                              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                            >
                              <FaEye /> View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="px-5 py-10 text-center text-slate-500">
                      No order found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {viewData && (
          <div className="rounded-md border border-slate-300 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-slate-100 px-5 py-4 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Order Details</h3>
                <p className="mt-1 break-all text-sm text-slate-500">#{viewData._id}</p>
              </div>
              <span
                className={`inline-flex w-fit rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${statusClasses[draftStatus[viewData._id] || viewData.status] || statusClasses.pending}`}
              >
                {draftStatus[viewData._id] || viewData.status || "pending"}
              </span>
            </div>

            <div className="grid gap-4 p-5 text-sm text-slate-700 md:grid-cols-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Total Amount</p>
                <p className="mt-1 text-lg font-bold text-slate-950">
                  Rs. {Number(viewData.totalAmount || 0).toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Payment Method</p>
                <p className="mt-1 font-semibold capitalize">{viewData.paymentMethod || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Payment Status</p>
                <p className="mt-1 font-semibold capitalize">{viewData.PaymentStatus || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Date</p>
                <p className="mt-1 font-semibold">{formatDate(viewData.createdAt)}</p>
              </div>
            </div>

            <div className="grid gap-5 border-t border-slate-200 p-5 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <h4 className="mb-3 text-lg font-semibold text-slate-950">Shipping Address</h4>
                <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-4">
                  {Object.entries(viewData.shippingAddress || {}).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-[120px_1fr] gap-3 text-sm">
                      <span className="font-bold capitalize text-slate-500">{key}</span>
                      <span className="break-words text-slate-800">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-lg font-semibold text-slate-950">Order Items</h4>
                <div className="overflow-x-auto rounded-md border border-slate-200">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="p-3">S. No.</th>
                        <th className="p-3">Product</th>
                        <th className="p-3">Quantity</th>
                        <th className="p-3">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(viewData.items || []).map((item, index) => (
                        <tr key={item._id || index} className="border-t">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3 font-semibold text-slate-900">{getItemName(item)}</td>
                          <td className="p-3">{item.quantity || item.qty || 1}</td>
                          <td className="p-3">
                            Rs. {Number(getItemPrice(item)).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
