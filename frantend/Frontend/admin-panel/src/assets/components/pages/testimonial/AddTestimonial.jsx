import { FaRegImage } from "react-icons/fa6";

export default function AddTestimonial() {
  return (
    <div className="w-full min-h-[680px] px-4 bg-slate-50 py-10">
      <div className="mx-auto">
        <h3 className="text-[24px] font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 px-5 rounded-t-lg text-white border border-indigo-500">
          Add New Testimonial
        </h3>
        <form className="border border-slate-200 border-t-0 gap-6 flex bg-white p-6 rounded-b-lg shadow-sm">
          <div className="flex flex-col">
            <label className="block mb-2 text-md font-medium text-gray-700">
              Image
            </label>
            <div className="relative w-60 h-60 border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100">
              <div className="relative w-full h-full overflow-hidden bg-slate-200 rounded-lg flex flex-col items-center z-0 justify-center gap-4">
                <div className="absolute inset-0 bg-slate-300 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.8s_linear_infinite]" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <FaRegImage className="text-slate-600" size={55} />
                  <div className="w-28 h-3 bg-slate-400 rounded-full" />
                  <div className="w-20 h-3 bg-slate-400 rounded-full" />
                </div>
              </div>
              <input
                accept="image/*"
                className="absolute z-10 inset-0 opacity-0 cursor-pointer"
                type="file"
              />
            </div>
          </div>
          <div className="basis-full">
            <div className="mb-6">
              <label className="block mb-2 text-md font-medium text-gray-700">
                Name
              </label>
              <input
                autoComplete="off"
                className="text-[17px] border border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3"
                placeholder="Enter name"
                type="text"
                name="name"
              />
            </div>
            <div className="mb-6">
              <label
                className="block mb-2 h-[50px]  text-md font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                name="message"
                autoComplete="off"
                className="text-[17px] resize-none h-[100px] border border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3"
                placeholder="Enter Message"
              />
            </div>
            <div className="flex gap-4">
              <div className="mb-6 basis-[50%]">
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Rating
                </label>
                <input
                  min="1"
                  max="5"
                  autoComplete="off"
                  className="text-[17px] border border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3"
                  placeholder="Enter rating number"
                  type="number"
                  name="rating"
                />
              </div>
              <div className="basis-[50%] mb-6">
                <label className="block mb-2 text-md font-medium text-gray-700">
                  Order
                </label>
                <input
                  min="1"
                  autoComplete="off"
                  className="text-[17px] border border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3"
                  placeholder="Enter order number"
                  type="number"
                  name="order"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-3 cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
