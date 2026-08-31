import axios from "axios";
import { useEffect, useState } from "react";

export default function ViewOrders() {
  const [data, setData] = useState([]);
  const [viewData, setViewData] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_APIBASEPATH;

  let getOrders = () => {
    axios
      .get(`${apiBaseUrl}order/view`)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          setData(finalRes.data);
        }
      });
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <section className="w-full p-4">
      <div className="rounded-t-md border border-slate-400 bg-slate-100 px-5 py-5">
        <h2 className="text-[32px] font-semibold text-black">Order's List</h2>
      </div>

      <div className="overflow-x-auto rounded-b-md border border-t-0 border-slate-400 bg-white">
        <table className="w-full min-w-[1100px] text-left text-[18px] text-slate-600">
          <thead className="bg-slate-50 text-[17px] font-bold uppercase text-slate-800">
            <tr>
              <th className="px-8 py-5">
                <button className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white">
                  Delete
                </button>
              </th>
              <th className="px-6 py-5">S. No.</th>
              <th className="px-6 py-5">Order ID</th>
              <th className="px-6 py-5">Name</th>
              <th className="px-6 py-5">Quantity</th>
              <th className="px-6 py-5">Price</th>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">View</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((obj, index) => {
                let totalQty = 0;
                obj.items?.forEach((item) => {
                  totalQty += Number(item.quantity || item.qty || 1);
                });

                return (
                  <tr key={obj._id} className="border-t bg-white">
                    <td className="px-8 py-8">
                      <input type="checkbox" className="h-5 w-5" />
                    </td>
                    <td className="px-6 py-8 font-semibold">{index + 1}</td>
                    <td className="px-6 py-8">{obj._id}</td>
                    <td className="px-6 py-8">
                      {obj.shippingAddress?.name ||
                        obj.shippingAddress?.fullName ||
                        obj.shippingAddress?.firstName ||
                        "-"}
                    </td>
                    <td className="px-6 py-8">{totalQty}</td>
                    <td className="px-6 py-8">₹ {obj.totalAmount}</td>
                    <td className="px-6 py-8">
                      {obj.createdAt ? obj.createdAt.slice(0, 10) : "-"}
                    </td>
                    <td className="px-6 py-8 capitalize">
                      {obj.status ? `${obj.status}...` : "-"}
                    </td>
                    <td className="px-6 py-8">
                      <button
                        type="button"
                        onClick={() => setViewData(viewData?._id === obj._id ? null : obj)}
                        className="rounded-full border border-slate-300 px-7 py-3 font-semibold text-black hover:bg-slate-100"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="border-t px-6 py-8 text-center text-slate-500">
                  No order found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewData && (
        <div className="mt-6 rounded-md border border-slate-400 bg-white">
          <div className="border-b border-slate-300 bg-slate-100 px-5 py-4 text-[24px] font-semibold">
            Order Details
          </div>
          <div className="grid gap-4 p-5 text-[17px] text-slate-700 md:grid-cols-2">
            <div><b>Order ID:</b> {viewData._id}</div>
            <div><b>Total Amount:</b> ₹ {viewData.totalAmount}</div>
            <div><b>Payment Method:</b> {viewData.paymentMethod}</div>
            <div><b>Payment Status:</b> {viewData.PaymentStatus}</div>
            <div><b>Status:</b> {viewData.status}</div>
            <div><b>Date:</b> {viewData.createdAt ? viewData.createdAt.slice(0, 10) : "-"}</div>
            <div><b>Razorpay Order ID:</b> {viewData.razorpayOrderId || "-"}</div>
            <div><b>Razorpay Payment ID:</b> {viewData.razorpayPaymentId || "-"}</div>
          </div>

          <div className="border-t border-slate-300 p-5">
            <h3 className="mb-3 text-[22px] font-semibold">Shipping Address</h3>
            <div className="text-[17px] text-slate-700">
              {Object.entries(viewData.shippingAddress || {}).map(([key, value]) => (
                <div key={key} className="mb-1">
                  <b>{key}:</b> {String(value)}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-300 p-5">
            <h3 className="mb-3 text-[22px] font-semibold">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-[16px]">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3">S. No.</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {viewData.items?.map((item, index) => (
                    <tr key={item._id || index} className="border-t">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        {item.name || item.productName || item.product?.name || item.productId?.name || "-"}
                      </td>
                      <td className="p-3">{item.quantity || item.qty || 1}</td>
                      <td className="p-3">₹ {item.price || item.product?.price || item.productId?.price || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
