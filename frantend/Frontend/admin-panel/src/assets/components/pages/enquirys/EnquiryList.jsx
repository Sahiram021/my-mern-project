import { useState, useEffect } from "react";
import axios from "axios";

export default function EnquiryList() {
  const [data, setData] = useState([]);

  const apiBaseUrl = import.meta.env.VITE_APIBASEPATH;

  let getEnquiries = () => {
    axios
      .get(`${apiBaseUrl}enquiry/view`)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          setData(finalRes.data);
        }
      });
  };
  useEffect(() => {
    getEnquiries();
  }, []);
  return (
    <section className="w-full">
      <div className="border-b bg-white px-6 py-3 shadow-sm">
        <span className="text-gray-600">Home / Enquiry / </span>
        <span className="font-medium">List</span>
      </div>

      <div className="mx-auto max-w-[1220px] px-4 py-6">
        <div className="rounded-t-md border border-slate-300 bg-slate-100 px-5 py-4">
          <h2 className="text-2xl font-semibold text-slate-800">
            Enquiry List
          </h2>
        </div>

        <div className="overflow-x-auto rounded-b-md border border-t-0 border-slate-300 bg-white">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.length > 0 ? (
                data.map((enquiry) => (
                  <tr key={enquiry.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {enquiry.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {enquiry.email}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {enquiry.phone}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {enquiry.message}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-4 text-center text-slate-600"
                  >
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
