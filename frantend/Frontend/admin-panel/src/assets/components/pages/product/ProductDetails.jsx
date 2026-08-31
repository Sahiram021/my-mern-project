import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useParams } from "react-router";

export default function ProductDetails() {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const apiBaseUrl = import.meta.env.VITE_APIBASEPATH;

  const getGalleryImagePath = (img) => {
    if (img?.startsWith("local-parent-category-")) {
      return imagePath.replace("/product/", "/category/") + img;
    }
    if (img?.startsWith("local-sub-category-")) {
      return imagePath.replace("/product/", "/subcategory/") + img;
    }
    if (img?.startsWith("local-sub-sub-category-")) {
      return imagePath.replace("/product/", "/subsubcategory/") + img;
    }
    return imagePath + img;
  };

  let getProductsDetails = useCallback(() => {
    axios
      .get(`${apiBaseUrl}product/details/${id}`)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          setData(finalRes.data);
          setImagePath(finalRes.staticPath);
        }
      });
  }, [apiBaseUrl, id]);

  useEffect(() => {
    getProductsDetails();
  }, [getProductsDetails]);
  return (
    <section className="w-full bg-slate-50">
      <nav className="flex border-b bg-white px-6 py-3 shadow-sm">
        <ol className="inline-flex items-center space-x-2 text-gray-600">
          <li>
            <Link
              to="/dashboard"
              className="text-md font-medium hover:text-indigo-600"
            >
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to="/product/view"
              className="text-md font-medium hover:text-indigo-600"
            >
              Product
            </Link>
          </li>
          <li>/</li>
          <li className="text-md font-medium text-gray-900">Product Details</li>
        </ol>
      </nav>
      {data && (
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between rounded-t-md border border-slate-300 bg-slate-100 px-4 py-3">
            <div>
              <h1 className="text-[26px] font-semibold text-slate-900">
                Product Name
              </h1>
              <p className="text-sm text-slate-500">Product ID: {data._id}</p>
            </div>
            <Link
              to="/product/view"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <FaArrowLeft /> Back
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
                  <img src={imagePath + data.image} alt={data.name} className=" w-full h-full object-cover "/>
                </div>
              </div>

              <h2 className="mb-3 text-lg font-semibold text-slate-800">
                Galler
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {data.gallery.map((img, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={getGalleryImagePath(img)}
                      alt={data.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-slate-900">
                  Basic Details
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-1 text-sm font-medium text-slate-500">
                      Name
                    </p>
                    <p className="break-words text-[17px] font-semibold text-slate-900">
                      {data.name}
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-1 text-sm font-medium text-slate-500">
                      Parent Category
                    </p>
                    <p className="break-words text-[17px] font-semibold text-slate-900">
                      {data.parentCategory.name}
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-1 text-sm font-medium text-slate-500">
                      Sub Category
                    </p>
                    <p className="break-words text-[17px] font-semibold text-slate-900">
                      {data.subcategory.name}
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-1 text-sm font-medium text-slate-500">
                      Sub Sub Category
                    </p>
                    <p className="break-words text-[17px] font-semibold text-slate-900">
                      {data.subsubcategory.name}
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-1 text-sm font-medium text-slate-500">
                      Price
                    </p>
                    <p className="break-words text-[17px] font-semibold text-slate-900">
                      {data.price}
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-1 text-sm font-medium text-slate-500">
                      Order
                    </p>
                    <p className="break-words text-[17px] font-semibold text-slate-900">
                      {data.order}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-slate-900">
                    Color
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {data.color.map((obj, index) => {
                      return (
                        <span
                          key={index}
                          className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700"
                        >
                          {obj.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-slate-900">
                    Material
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {data.material.map((obj, index) => {
                      return (
                        <span
                          key={index}
                          className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700"
                        >
                          {obj.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-xl font-semibold text-slate-900">
                  Short Description
                </h2>
                <p className="leading-7 text-slate-700">
                  {data.sortDescription}
                </p>
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-xl font-semibold text-slate-900">
                  Long Description
                </h2>
                <p className="leading-7 text-slate-700">
                  {data.longDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
