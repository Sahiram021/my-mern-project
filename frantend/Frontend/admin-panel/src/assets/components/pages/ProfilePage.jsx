import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { FaRegImage, FaCamera } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { showError, showSuccess } from "../common/notification/notification";
import { setAdminData } from "../../../slice/adminSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  let [imagePreview, setImagePreview] = useState("");
  let [editData, setEditData] = useState(null);
  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);
  let [imgError, setImgError] = useState(false);
  let apiBaseUrl = import.meta.env.VITE_APIBASEPATH || "http://localhost:8000/admin/";

  let getToken = () => Cookies.get("token") || localStorage.getItem("token") || "";

  let getProfile = useCallback(() => {
    let token = getToken();

    if (!token) {
      showError("Login token not found. Please login first.");
      return;
    }

    setLoading(true);
    axios
      .get(`${apiBaseUrl}adminauth/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status && finalRes.data) {
          setEditData(finalRes.data);
          let imagePath = finalRes.imagePath || `${apiBaseUrl.replace(/\/admin\/?$/, "")}/uploads/admin/`;
          let fullUrl = finalRes.data.image ? `${imagePath}${finalRes.data.image}` : "";
          if (fullUrl) {
            setImagePreview(fullUrl);
            setImgError(false);
          }
          dispatch(setAdminData({ data: finalRes.data, imagePath, imageUrl: fullUrl }));
        } else {
          showError(finalRes.message || "Could not fetch profile");
        }
      })
      .catch((error) => {
        showError(error.response?.data?.message || "Profile get nahi ho rahi hai");
      })
      .finally(() => setLoading(false));
  }, [apiBaseUrl, dispatch]);

  let updateProfile = (e) => {
    e.preventDefault();
    let token = getToken();

    if (!token) {
      showError("Login token not found. Please login first.");
      return;
    }

    let formData = new FormData(e.target);
    setLoading(true);

    axios
      .post(`${apiBaseUrl}adminauth/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          setError(null);
          showSuccess(finalRes.message || "Profile updated successfully");
          getProfile();
        } else {
          setError(finalRes.error);
          showError(finalRes.error || finalRes.message);
        }
      })
      .catch((error) => {
        showError(error.response?.data?.message || "Profile update nahi hui");
      })
      .finally(() => setLoading(false));
  };

  let previewImage = (e) => {
    let imageFile = e.target.files[0];

    if (imageFile) {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(imageFile));
      setImgError(false);
    }
  };

  useEffect(() => {
    let timer = setTimeout(getProfile, 0);
    return () => clearTimeout(timer);
  }, [getProfile]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="w-full min-h-[680px] px-4 bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl">
        <h3 className="text-[22px] font-bold bg-gradient-to-r from-blue-700 to-indigo-700 py-3.5 px-6 rounded-t-2xl text-white shadow-md">
          Admin Profile Settings
        </h3>
        <form
          key={editData?._id || "profile-form"}
          onSubmit={updateProfile}
          className="border border-slate-200 border-t-0 gap-8 flex flex-col md:flex-row bg-white p-6 sm:p-8 rounded-b-2xl shadow-sm"
        >
          <div className="flex flex-col items-center md:items-start shrink-0">
            <label className="mb-2 block text-sm font-bold text-slate-700 uppercase tracking-wider">
              Profile Photo
            </label>
            <div className="group relative h-56 w-56 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 shadow-sm transition hover:border-blue-500">
              <input
                onChange={previewImage}
                name="image"
                accept="image/*"
                className="absolute inset-0 z-20 cursor-pointer opacity-0"
                type="file"
              />
              {imagePreview && !imgError ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="relative z-0 flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-100 text-slate-400">
                  <FaRegImage className="text-slate-400" size={48} />
                  <span className="text-xs font-semibold text-slate-500">Click to upload photo</span>
                </div>
              )}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white">
                <FaCamera className="text-2xl mb-1" />
                <span className="text-xs font-bold">Change Photo</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">JPG, PNG or WEBP (Max 5MB)</p>
            {error?.image && <span className="mt-2 text-xs font-semibold text-red-600">{error.image}</span>}
          </div>

          <div className="basis-full">
            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editData?.name}
                autoComplete="off"
                className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="Enter name"
                required
              />
              {error?.name && <span className="text-xs font-semibold text-red-600">{error.name}</span>}
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                defaultValue={editData?.email}
                autoComplete="off"
                className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="Enter email"
                required
              />
              {error?.email && <span className="text-xs font-semibold text-red-600">{error.email}</span>}
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={editData?.phone}
                autoComplete="off"
                className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="Enter mobile number"
              />
              {error?.phone && <span className="text-xs font-semibold text-red-600">{error.phone}</span>}
            </div>

            <div className="mb-6">
              <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Office / Business Address
              </label>
              <textarea
                name="address"
                defaultValue={editData?.address}
                autoComplete="off"
                rows="3"
                className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="Enter address"
              />
              {error?.address && <span className="text-xs font-semibold text-red-600">{error.address}</span>}
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-700/20 transition-all hover:from-blue-800 hover:to-indigo-800 focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
