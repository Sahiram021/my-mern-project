import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegImage } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";
import { showError, showSuccess } from "../../common/notification/notification";
import { getApiErrorMessage } from "../../../../api/errors";

export default function AddSlider() {
  let [imagePreview, setImagePreview] = useState("");
  let [editData, setEditData] = useState(null);
  let [error, setError] = useState(null);
  let apiBaseUrl = import.meta.env.VITE_APIBASEPATH || 'http://localhost:8000/api/admin/';
  let { id } = useParams();
  let navigate = useNavigate();

  let saveSlider = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let apiRequest;

    if (id) {
      apiRequest = axios.put(`${apiBaseUrl}slider/update/${id}`, formData);
    } else {
      apiRequest = axios.post(`${apiBaseUrl}slider/create`, formData);
    }

    apiRequest
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          setError(null);
          showSuccess(finalRes.message);
          navigate("/sliders/view");
        } else {
          setError(finalRes.error);
          showError(getApiErrorMessage({ response: { data: finalRes } }, "Slider could not be saved"));
        }
      })
      .catch((error) => {
        showError(getApiErrorMessage(error, "Slider could not be saved"));
      });
  };

  let previewImage = (e) => {
    let imageFile = e.target.files[0];

    if (imageFile) {
      setImagePreview(URL.createObjectURL(imageFile));
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`${apiBaseUrl}slider/edit/${id}`)
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.status) {
            setEditData(finalRes.data);
            if (finalRes.data?.image) {
              setImagePreview(finalRes.staticPath + finalRes.data.image);
            }
          }
        });
    }
  }, [id, apiBaseUrl]);

  return (
    <div className="w-full min-h-[680px] bg-slate-50 px-4 py-10">
      <div className="mx-auto">
        <h3 className="rounded-t-lg border border-indigo-500 bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3 text-[24px] font-semibold text-white">
          {id ? "Update Slider" : "Add New Slider"}
        </h3>
        <form
          key={editData?._id || "add-slider"}
          onSubmit={saveSlider}
          className="flex gap-6 rounded-b-lg border border-t-0 border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col">
            <div className="relative h-60 w-80 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Slider preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="relative z-0 flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-slate-200">
                  <div className="absolute inset-0 animate-pulse bg-slate-300" />
                  <div className="absolute inset-0 animate-[shimmer_1.8s_linear_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <FaRegImage className="text-slate-600" size={55} />
                    <div className="h-3 w-28 rounded-full bg-slate-400" />
                    <div className="h-3 w-20 rounded-full bg-slate-400" />
                  </div>
                </div>
              )}
              <input
                onChange={previewImage}
                name="image"
                accept="image/*"
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                type="file"
                required={!id}
              />
            </div>
            {error?.image && <span className="mt-2 text-red-600">{error.image}</span>}
          </div>

          <div className="basis-full">
            <div className="mb-6">
              <label className="mb-2 block text-md font-medium text-gray-700">
                Slider Title
              </label>
              <input
                type="text"
                name="title"
                required
                minLength="2"
                defaultValue={editData?.title}
                autoComplete="off"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[17px] text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter slider title"
              />
              {error?.title && <span className="text-red-600">{error.title}</span>}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-md font-medium text-gray-700">
                Slider Link
              </label>
              <input
                type="text"
                name="link"
                defaultValue={editData?.link}
                autoComplete="off"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[17px] text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter slider link"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-md font-medium text-gray-700">
                Order
              </label>
              <input
                type="number"
                name="order"
                min="0"
                defaultValue={editData?.order ?? 0}
                autoComplete="off"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[17px] text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter order number"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-3 cursor-pointer rounded-lg bg-indigo-600 px-6 py-2.5 text-md font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
              >
                {id ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
