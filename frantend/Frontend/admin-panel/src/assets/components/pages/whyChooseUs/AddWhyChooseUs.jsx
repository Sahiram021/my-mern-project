import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegImage } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";
import { showError, showSuccess } from "../../common/notification/notification";
export default function AddWhyChooseUs() {
  let [imagePreview, setImagePreview] = useState("");
  let [formValues, setFormValues] = useState({
    title: "",
    description: "",
    rating: "",
    order: "",
  });
  let [error, setError] = useState(null);
  let apiBaseUrl = import.meta.env.VITE_APIBASEPATH;
  let { id } = useParams();
  let navigate = useNavigate();

  const getFieldValue = (data, keys, defaultValue = "") => {
    let value = keys.map((key) => data?.[key]).find((item) => item !== undefined && item !== null);
    return value ?? defaultValue;
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setFormValues((oldValues) => ({
      ...oldValues,
      [name]: value,
    }));
  };

  let savewhychooseus = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    if (!id && !formData.get("image")) {
      showError("Please select an image");
      return;
    }

    let apiRequest;

    if (id) {
      apiRequest = axios.put(`${apiBaseUrl}whychooseus/update/${id}`, formData);
    } else {
      apiRequest = axios.post(`${apiBaseUrl}whychooseus/create`, formData);
    }

    apiRequest
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          setError(null);
          showSuccess(finalRes.message);
          navigate("/why-choose-us/view");
        } else {
          setError(finalRes.error);
          showError(finalRes.error || finalRes.message);
        }
      })
      .catch((error) => {
        showError(error.response?.data?.message || "whychooseus save nahi hua");
      });
  };

  let previewImage = (e) => {
    let imageFile = e.target.files[0];

    if (imageFile) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(imageFile));
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`${apiBaseUrl}whychooseus/edit/${id}`)
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.status) {
            setFormValues({
              title: getFieldValue(finalRes.data, ["title", "Title"]),
              description: getFieldValue(finalRes.data, ["description", "desc", "Description"]),
              rating: getFieldValue(finalRes.data, ["rating", "ratings", "Rating"]),
              order: getFieldValue(finalRes.data, ["order", "Order"]),
            });
            if (finalRes.data?.image) {
              setImagePreview(finalRes.staticPath + finalRes.data.image);
            }
          }
        });
    }
  }, [id, apiBaseUrl]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className='w-full min-h-[680px] px-4 bg-slate-50 py-10'>
      <div className='mx-auto'>
        <h3 className='text-[24px] font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 px-5 rounded-t-lg text-white border border-indigo-500'>
                   {id ? "Update Why Choose Us " : "Add New Why Choose Us "} 
        </h3>
        <form onSubmit={savewhychooseus} className='border border-slate-200 border-t-0 gap-6 flex bg-white p-6 rounded-b-lg shadow-sm'>
         <div className="flex flex-col">
            <label className="mb-2 block text-md font-medium text-gray-700">Image</label>
            <div className="relative h-60 w-80 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow">
              <input
                onChange={previewImage}
                name="image"
                accept="image/*"
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                type="file"
                required={!id}
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="whychooseus preview"
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
            </div>
            {error?.image && <span className="mt-2 text-red-600">{error.image}</span>}
          </div>

          <div className="basis-full">
            <div className="mb-6">
              <label className="mb-2 block text-md font-medium text-gray-700">
                whychooseus Title
              </label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                autoComplete="off"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[17px] text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter whychooseus title"
              />
              {error?.title && <span className="text-red-600">{error.title}</span>}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-md font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                autoComplete="off"
                rows="4"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[17px] text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter description"
              />
              {error?.description && <span className="text-red-600">{error.description}</span>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="mb-6">
                <label className="mb-2 block text-md font-medium text-gray-700">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formValues.rating}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  step="0.1"
                  autoComplete="off"
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[17px] text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter rating number"
                />
                {error?.rating && <span className="text-red-600">{error.rating}</span>}
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-md font-medium text-gray-700">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formValues.order}
                  onChange={handleInputChange}
                  min="1"
                  autoComplete="off"
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[17px] text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter order number"
                />
                {error?.order && <span className="text-red-600">{error.order}</span>}
              </div>
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
  )
}
