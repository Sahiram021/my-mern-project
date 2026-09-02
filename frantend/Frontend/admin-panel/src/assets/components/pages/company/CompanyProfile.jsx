import axios from "axios";
import { useEffect, useState } from "react";
import { FaCloudArrowUp, FaCamera } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { showError, showSuccess } from "../../common/notification/notification";
import { setAdminData } from "../../../../slice/adminSlice";

export default function CompanyProfile() {
  const dispatch = useDispatch();
  const apiBaseUrl = import.meta.env.VITE_APIBASEPATH || "http://localhost:8000/admin/";

  const token = useSelector(
    (store) => store.adminStore.admintoken
  );

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imgError, setImgError] = useState(false);

  const getMapSrc = (mapUrl) => {
    if (!mapUrl)
      return "https://www.google.com/maps?q=Jodhpur&output=embed";

    if (
      mapUrl.includes("/embed") ||
      mapUrl.includes("output=embed")
    ) {
      return mapUrl;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(
      mapUrl
    )}&output=embed`;
  };

  const getProfile = () => {
    if (!token) return;
    axios
      .get(`${apiBaseUrl}adminauth/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status && finalRes.data) {
          setData(finalRes.data);
          const path = finalRes.imagePath || `${apiBaseUrl.replace(/\/admin\/?$/, "")}/uploads/admin/`;
          setImagePath(path);
          const fullUrl = finalRes.data.image ? `${path}${finalRes.data.image}` : "";
          setImgError(false);
          dispatch(setAdminData({ data: finalRes.data, imagePath: path, imageUrl: fullUrl }));
        } else {
          showError(finalRes.message || "Failed to load company details");
        }
      })
      .catch(() => {
        showError("Company profile get nahi hui");
      });
  };

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);

  const changeProfileImage = (event) => {
    let file = event.target.files[0];

    if (file) {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
      setImgError(false);
    }
  };

  const UpdateProfile = (event) => {
    event.preventDefault();

    setLoading(true);

    let formData = new FormData(event.target);

    axios
      .post(
        `${apiBaseUrl}adminauth/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          showSuccess(finalRes.message || "Company profile updated successfully");
          getProfile();
          setPreviewImage("");
        } else {
          showError(finalRes.message);
        }
      })
      .catch(() => {
        showError("Company profile update nahi hui");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const currentImageUrl = previewImage || (data?.image && !imgError ? `${imagePath || 'https://jgbmtrading.online/uploads/admin/'}${data.image}` : "");

  return (
    <div className="w-full bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-t-2xl border border-slate-200 bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-xl font-bold text-white shadow-md">
          Company Profile &amp; Contact Info
        </div>

        <form
          key={data?._id || "company-profile-form"}
          onSubmit={UpdateProfile}
          className="rounded-b-2xl border border-t-0 border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
        >
          <div className="grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)]">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Company Brand / Logo Image
              </label>

              <div className="group relative flex h-60 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-blue-500 hover:bg-slate-100/60 shadow-inner">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={changeProfileImage}
                  className="absolute inset-0 z-20 cursor-pointer opacity-0"
                />

                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt="Company Profile"
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <FaCloudArrowUp className="text-4xl text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">
                      Upload Company Image
                    </span>
                    <span className="text-xs text-slate-400">Click or drag &amp; drop</span>
                  </div>
                )}

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white">
                  <FaCamera className="text-2xl mb-1" />
                  <span className="text-xs font-bold">Change Image</span>
                </div>
              </div>
            </div>

            <div className="grid content-start gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Company / Admin Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={data?.name}
                  placeholder="Enter Company Name"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={data?.email}
                  placeholder="Enter Contact Email"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mobile / Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={data?.phone}
                  placeholder="Enter Mobile / Phone Number"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Registered Office Address
            </label>
            <textarea
              name="address"
              defaultValue={data?.address}
              rows="3"
              placeholder="Enter Full Physical Address"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Google Maps Location Query / Embed URL
            </label>
            <textarea
              name="mapUrl"
              defaultValue={data?.mapUrl}
              rows="2"
              placeholder="Google Map Embed URL or Address"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook"
                defaultValue={data?.facebook}
                placeholder="https://facebook.com/..."
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram"
                defaultValue={data?.instagram}
                placeholder="https://instagram.com/..."
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Youtube Channel URL
              </label>
              <input
                type="url"
                name="youtube"
                defaultValue={data?.youtube}
                placeholder="https://youtube.com/..."
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-2 shadow-xs">
            <iframe
              title="Company location map"
              src={getMapSrc(data?.mapUrl)}
              className="h-48 w-full rounded-xl border-0"
              loading="lazy"
            />
          </div>

          <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-700/25 transition hover:from-blue-800 hover:to-indigo-800 focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Saving Information..." : "Save Company Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
