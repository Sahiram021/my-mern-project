import axios from "axios";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass, FaPenToSquare, FaRotate } from "react-icons/fa6";
import { showError, showSuccess, showWarning } from "../../common/notification/notification";
import { Link } from "react-router";
import { confirmDelete } from "../../common/sweetAlert/deleteConfirm";

export default function Viewmaterials() {
    let [data,setData]=useState([])
    const [ids, setIds] = useState ([])
    const [searchName, setSearchName] = useState("");
    const [searchOrder, setSearchOrder] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    let apiBaseUrl = import.meta.env.VITE_APIBASEPATH;
    let getmaterials=()=>{
      let searchObj={
        name:searchName,
        order:searchOrder
      }
      axios.get(`${apiBaseUrl}material/view`,{
        params:searchObj
      })
      .then((res)=>res.data)
      .then((finalRes)=>{
        console.log(finalRes);
        if(finalRes.status){
          setData(finalRes.data)
        }else{
          showError(finalRes.error)
        }
        
      })
    }
    useEffect(()=>{
     getmaterials()
    },[searchName,searchOrder])

    let getCheckValue=(e)=>{
      let checkBoxValue=e.target.value
      if(e.target.checked){
        setIds([...ids,checkBoxValue])
        
      }else{
         setIds(ids.filter((id)=>id!=checkBoxValue))
      }
      

    }
   
    let multiDelete=async ()=>{
      if(ids.length>=1){
        let isConfirmed = await confirmDelete()
        if(!isConfirmed) return
        let obj={
          ids
        }
       axios.post(`${apiBaseUrl}material/multidelete`,obj)
       .then((res)=>res.data)
       .then((finalRes)=>{
        if (finalRes.status){
        showSuccess(finalRes.message)
        getmaterials();
        setIds([])
        }
       })
      }else{
        showWarning("Please select at least one material")
      }

    }

    let changeStatus=()=>{
      if(ids.length>=1){
        let obj={
          ids
        }
        axios.post(`${apiBaseUrl}material/changestatus`, obj)
       .then((res)=>res.data)
       .then((finalRes)=>{
        if (finalRes.status){
        showSuccess(finalRes.message)
        getmaterials();
        setIds([])
        }
       })
      }else{
        showWarning("Please select at least one material")
      }

    }

    let allCheck=(e)=>{
      if(e.target.checked){
       let getIds= data.map((obj)=>obj._id)
       setIds(getIds);
       
      }else{
        setIds([])
      }

    }

    
  return (
    <section className="w-full">
      <div className="border-b bg-white px-6 py-3 shadow-sm">
        <span className="text-gray-600">Home / material / </span>
        <span className="font-medium">View</span>
      </div>
      <div
        id="material-filter"
        className={`${showSearch ? "block" : "hidden"} mx-auto mt-10 max-w-[1220px] rounded-md border border-slate-300 bg-white shadow-sm`}
      >
        <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
          <h3 className="text-[20px] font-semibold text-slate-800">Search Material</h3>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={searchName} onChange={(e)=>setSearchName(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Search by name" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Order</label>
            <input type="number" name="order" value={searchOrder} onChange={(e)=>setSearchOrder(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Search by order" />
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={getmaterials}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
          >
            <FaMagnifyingGlass />
            Search
          </button>
          <button
            onClick={()=>{
              setSearchName('')
              setSearchOrder('')
            }}
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            <FaRotate />
            Reset
          </button>
        </div>
      </div>
      <div className="mx-auto min-h-[610px] max-w-[1220px] py-5">
        <div className="flex items-center justify-between rounded-t-md border border-slate-400 bg-slate-100 px-4 py-3">
          <div className="text-[26px] font-semibold">View material</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white"
            >
              <FaMagnifyingGlass />
              Search
            </button>
            <button
              type="button"
              onClick={()=>{
                setSearchName('')
                setSearchOrder('')
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-600 text-white"
            >
              <FaRotate />
            </button>
            <button
            onClick={changeStatus}
              type="button"
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white"
            >
              Change Status
            </button>
            <button
              onClick={multiDelete}
              type="button"
              className="rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-b-md border border-t-0 border-slate-400">
          <table className="min-w-[850px] w-full text-left">
            <thead className="bg-gray-50 text-xs font-semibold uppercase"><tr>
              <th className="p-4">
                <input type="checkbox" checked={data.length==ids.length} onChange={allCheck}/>
              </th>
              <th className="p-4">S. No.</th><th className="p-4">Material Name</th>
              <th className="p-4">Order</th><th className="p-4">Status</th><th className="p-4">Action</th>
            </tr></thead>
            <tbody>
              {data.length >= 1 ? (
                data.map((obj, index) => {
                  return (
                    <tr
                      key={obj._id}
                      id={`material-row-${obj._id}`}
                      className="border-t bg-white"
                    >
                      <td className="p-4">
                        <input type="checkbox" onChange={getCheckValue} value={obj._id} checked={ids.includes(obj._id)} />
                      </td>
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{obj.name}</td>
                      
                      <td className="p-4">{obj.order}</td>
                      <td className={`p-4 font-semibold ${obj.status ? "text-green-600" : "text-red-600"}`}>
                        {obj.status ? "Active" : "Deactive"}
                      </td>
                      <td className="p-4 text-center"><Link to={`/material/edit/${obj._id}`} className="inline-flex">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-sm transition hover:bg-yellow-200">
                          <FaPenToSquare className="text-lg" />
                        </span>
                      </Link></td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6" className="border-t p-6 text-center text-gray-500">No material Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
