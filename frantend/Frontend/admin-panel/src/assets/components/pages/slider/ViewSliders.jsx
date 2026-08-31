import axios from "axios";
import { useEffect, useState } from "react";
import { FaFilter, FaMagnifyingGlass, FaPenToSquare, FaRotate } from "react-icons/fa6";
import { Link } from "react-router";
import { showSuccess, showWarning } from "../../common/notification/notification";
import { confirmDelete } from "../../common/sweetAlert/deleteConfirm";

const apiBaseUrl = import.meta.env.VITE_APIBASEPATH;

export default function ViewSliders() {
  const [data, setData] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [ids, setIds] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchOrder, setSearchOrder] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  let getSliders = () => {
    let searchObj = {
      title: searchTitle,
      order: searchOrder,
    };

    axios
      .get(`${apiBaseUrl}slider/view`, {
        params: searchObj,
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          setData(finalRes.data);
          setImagePath(finalRes.staticPath);
        }
      });
  };

  useEffect(() => {
    getSliders();
  }, [searchTitle, searchOrder]);

  let getCheckValue = (e) => {
    let checkBoxValue = e.target.value;
    if (e.target.checked) {
      setIds([...ids, checkBoxValue]);
    } else {
      setIds(ids.filter((id) => id != checkBoxValue));
    }
  };

  let allCheck = (e) => {
    if (e.target.checked) {
      let getIds = data.map((obj) => obj._id);
      setIds(getIds);
    } else {
      setIds([]);
    }
  };

  let multiDelete = async () => {
    if (ids.length >= 1) {
      let isConfirmed = await confirmDelete();
      if (!isConfirmed) return;
      let obj = { ids };
      axios
        .post(`${apiBaseUrl}slider/multidelete`, obj)
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.status) {
            showSuccess(finalRes.message);
            getSliders();
            setIds([]);
          }
        });
    } else {
      showWarning("Please select at least one slider");
    }
  };

  let changeStatus = () => {
    if (ids.length >= 1) {
      let obj = { ids };
      axios
        .post(`${apiBaseUrl}slider/changestatus`, obj)
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.status) {
            showSuccess(finalRes.message);
            getSliders();
            setIds([]);
          }
        });
    } else {
      showWarning("Please select at least one slider");
    }
  };

  return (
    <section className="w-full">
      <nav className="flex border-b bg-white px-6 py-3 shadow-sm">
        <ol className="inline-flex items-center space-x-2 text-gray-600">
          <li><a className="text-md font-medium hover:text-indigo-600">Home</a></li>
          <li>/</li>
          <li><a className="text-md font-medium hover:text-indigo-600">Slider</a></li>
          <li>/</li>
          <li className="text-md font-medium text-gray-900">View Slider</li>
        </ol>
      </nav>

      <div className="p-4">
        <div id="slider-filter" className={`${showSearch ? "block" : "hidden"} relative my-3 w-full rounded-lg border border-slate-200 bg-white px-6 py-4 shadow-sm`}>
          <p className="py-2 text-[20px] font-semibold">Search Slider</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">Title</label>
              <input type="text" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} placeholder="Search by title" className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[17px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="mb-2 block font-medium text-gray-700">Order</label>
              <input type="number" value={searchOrder} onChange={(e) => setSearchOrder(e.target.value)} placeholder="Search by order" className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[17px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button onClick={() => { setSearchTitle(""); setSearchOrder(""); }} className="inline-flex items-center gap-2 rounded-lg bg-slate-500 px-6 py-2.5 text-white transition-all hover:bg-slate-600"><FaRotate /> Reset</button>
            <button onClick={getSliders} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-white shadow-sm transition-all hover:bg-indigo-700"><FaMagnifyingGlass /> Search</button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-t-md border border-slate-300 bg-slate-100 px-4 py-3">
          <div className="text-[26px] font-semibold">View Slider</div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setShowSearch(!showSearch)} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition-all hover:bg-slate-200"><FaFilter /> Search</button>
            <button onClick={multiDelete} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm text-white shadow-sm transition-all hover:bg-indigo-700">Delete All</button>
            <button onClick={changeStatus} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm text-white shadow-sm transition-all hover:bg-indigo-700">Change Status</button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-b-md border border-t-0 border-slate-300">
          <table className="min-w-[900px] w-full text-center text-gray-700">
            <thead className="border-b bg-gray-50 text-sm uppercase">
              <tr>
                <th className="px-2 py-3 font-semibold"><span className="flex items-center justify-center gap-2"><input type="checkbox" checked={data.length >= 1 && data.length == ids.length} onChange={allCheck} className="h-4 w-4 cursor-pointer" />Select</span></th>
                <th className="px-2 py-3 font-semibold">S. No.</th>
                <th className="px-2 py-3 font-semibold">Title</th>
                <th className="px-2 py-3 font-semibold">Image</th>
                <th className="px-2 py-3 font-semibold">Link</th>
                <th className="px-2 py-3 font-semibold">Order</th>
                <th className="px-2 py-3 font-semibold">Status</th>
                <th className="px-2 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length >= 1 ? data.map((obj, index) => (
                <tr key={obj._id} className="border-b bg-white">
                  <td className="px-2 py-4"><input type="checkbox" value={obj._id} checked={ids.includes(obj._id)} onChange={getCheckValue} className="h-4 w-4 cursor-pointer" /></td>
                  <td className="px-2 py-4">{index + 1}</td>
                  <td className="px-2 py-4">{obj.title}</td>
                  <td className="px-2 py-4">
                    <img src={imagePath + obj.image} alt={obj.title} className="mx-auto h-16 w-28 rounded object-cover" />
                  </td>
                  <td className="max-w-[220px] truncate px-2 py-4">{obj.link}</td>
                  <td className="px-2 py-4">{obj.order}</td>
                  <td className={`px-2 py-4 font-semibold ${obj.status ? "text-green-600" : "text-red-600"}`}>{obj.status ? "Active" : "Deactive"}</td>
                  <td className="px-2 py-4">
                    <Link to={`/sliders/edit/${obj._id}`} className="inline-flex">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-sm"><FaPenToSquare className="text-lg" /></span>
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="border-t p-6 text-center text-gray-500">No slider found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
