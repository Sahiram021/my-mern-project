import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { showSuccess } from "../../common/notification/notification";

export default function AddColor() {
  let {id} =useParams()
  console.log(id);
  let [editData,seteditData]=useState(null)
  let apiBaseUrl = import.meta.env.VITE_APIBASEPATH;
  let [error,setError]=useState(null)
  let navigate = useNavigate();
  let saveData = (e) => {
    e.preventDefault();
    let obj = {
      name: e.target.name.value,
      code: e.target.code.value,
      order: e.target.order.value,
    };
    if(id){
       axios.put(`${apiBaseUrl}color/update/${id}`,obj)
    .then((res)=>res.data)
    .then((finalRes)=>{
      if(finalRes.status){
        setError(null)  
        showSuccess(finalRes.message)
        e.target.reset()
        navigate('/color/view')

      }else{
        setError(finalRes.error)
      }
      
    })

    }else{
       axios.post(`${apiBaseUrl}color/create`,obj)
    .then((res)=>res.data)
    .then((finalRes)=>{
      if(finalRes.status){
        setError(null)  
        showSuccess(finalRes.message)
        e.target.reset()
        navigate('/color/view')

      }else{
        setError(finalRes.error)
      }
      
    })

    }
   
    
  };

  useEffect(()=>{
    if(id){
      axios.put(`${apiBaseUrl}color/get-detail/${id}`)
      .then((res)=>res.data)
      .then((finalRes)=>{
      seteditData(finalRes.data);

        
      })
    }
  },[id])

  return (
    <div className="w-full px-5 py-10">
      <div className="mx-auto max-w-[1220px]">
        <div className="rounded-t-md border border-slate-400 bg-slate-100 px-3 py-2 text-[20px] font-semibold">
          {
            id ? "Update Colors" : "Add Colors"
          }
          
           
        </div>
        <form
          onSubmit={saveData}
          className="rounded-b-md border border-t-0 border-slate-400 p-4"
        >
          <div id="color-name" className="mb-5">
            <label className="block font-medium text-gray-900">
              Color Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={editData?.name}
              className="block w-full rounded-lg border-2 border-gray-300 px-3 py-2.5"
              placeholder="Enter Color Name"
            />
            {error?.name && <span className="text-red-600">{error.name}</span>}
          </div>
          <div id="color-code" className="mb-5">
            <label className="block font-medium text-gray-900">
              Color Code
            </label>
            <input
              type="text"
              name="code"
              defaultValue={editData?.code}
              className="block w-full rounded-lg border-2 border-gray-300 px-3 py-2.5"
              placeholder="Enter Color Code"
            />
            {error?.code && <span className="text-red-600">{error.code}</span>}
          </div>
          <div id="color-order" className="mb-5">
            <label className="block font-medium text-gray-900">Order</label>
            <input
              type="number"
              name="order"
              defaultValue={editData?.order}
              className="block w-full rounded-lg border-2 border-gray-300 px-3 py-2.5"
              placeholder="Enter Order"
            />
          </div>
          <button
            type="submit"
            className="my-8 rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white"
          >
            {
              id ? "Update" : "Submit"
            }
          </button>
        </form>
      </div>
    </div>
  );
}
