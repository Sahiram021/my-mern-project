import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { showSuccess } from "../../common/notification/notification";

export default function Addfaq() {
  let {id}=useParams()
  let [editData,seteditData]=useState(null)
  let apiBaseUrl = import.meta.env.VITE_APIBASEPATH;
  let [error,setError]=useState(null)
  let navigate = useNavigate();
  let saveData = (e) => {
    e.preventDefault();
    let obj = {
      q: e.target.q.value,
      answer: e.target.answer.value,
      order: e.target.order.value,
    };
    if(id){
    axios.put(`${apiBaseUrl}faq/update/${id}`,obj)
    .then((res)=>res.data)
    .then((finalRes)=>{
      if(finalRes.status){
        setError(null)
        showSuccess(finalRes.message)
        e.target.reset()
        navigate('/faqs/view')

      }else{
        setError(finalRes.error)
      }
      
    })
    }else{
    axios.post(`${apiBaseUrl}faq/create`,obj)
    .then((res)=>res.data)
    .then((finalRes)=>{
      if(finalRes.status){
        setError(null)
        showSuccess(finalRes.message)
        e.target.reset()
        navigate('/faqs/view')
      }else{
        setError(finalRes.error)
      }
    })
    }
    
  };

  useEffect(()=>{
    if(id){
      axios.get(`${apiBaseUrl}faq/edit/${id}`)
      .then((res)=>res.data)
      .then((finalRes)=>{
        seteditData(finalRes.data)
      })
    }
  },[id])

  return (
    <div className="w-full px-5 py-10">
      <div className="mx-auto max-w-[1220px]">
        <div className="rounded-t-md border border-slate-400 bg-slate-100 px-3 py-2 text-[20px] font-semibold">
          {id ? "Update faqs" : "Add faqs"}
        </div>
        <form
          onSubmit={saveData}
          className="rounded-b-md border border-t-0 border-slate-400 p-4"
        >
          <div id="faq-question" className="mb-5">
            <label className="block font-medium text-gray-900">
              Question
            </label>
            <input
              type="text"
              name="q"
              defaultValue={editData?.q}
              className="block w-full rounded-lg border-2 border-gray-300 px-3 py-2.5"
              placeholder="Enter Question"
            />
            {error?.q && <span className="text-red-600">{error.q}</span>}
          </div>
          <div id="faq-answer" className="mb-5">
            <label className="block font-medium text-gray-900">
              Answer
            </label>
            <textarea
              name="answer"
              defaultValue={editData?.answer}
              className="block w-full rounded-lg border-2 border-gray-300 px-3 py-2.5"
              placeholder="Enter Answer"
            />
            {error?.answer && <span className="text-red-600">{error.answer}</span>}
          </div>
          <div id="faq-order" className="mb-5">
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
            {id ? "Update" : "Add faq"}
          </button>
        </form>
      </div>
    </div>
  );
}
