import axios from "axios";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass, FaPenToSquare, FaRotate } from "react-icons/fa6";
import { showError, showSuccess, showWarning } from "../../common/notification/notification";
import { Link } from "react-router";
import { confirmDelete } from "../../common/sweetAlert/deleteConfirm";

export default function ViewColors() {
    let [data,setData]=useState([])
    const [searchName, setSearchName] = useState("");
    const [searchCode, setSearchCode] = useState("");
    const [searchOrder, setSearchOrder] = useState("");
    const [showSearch, setShowSearch] = useState(false);
  
    const [ids, setIds] = useState ([])
    let apiBaseUrl = import.meta.env.VITE_APIBASEPATH;

   

    let getColors=()=>{

      let searchObj={
    name:searchName,
    code:searchCode,
    order:searchOrder
   }
      axios.get(`${apiBaseUrl}color/view`,{
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
     getColors()
    },[searchName,searchCode,searchOrder])

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
       axios.post(`${apiBaseUrl}color/multidelete`,obj)
       .then((res)=>res.data)
       .then((finalRes)=>{
        if (finalRes.status){
        showSuccess(finalRes.message)
        getColors();
        setIds([])
        }
       })
      }else{
        showWarning("Please select at least one color")
      }

    }

    let changeStatus=()=>{
      if(ids.length>=1){
        let obj={
          ids
        }
        axios.post(`${apiBaseUrl}color/changestatus`, obj)
       .then((res)=>res.data)
       .then((finalRes)=>{
        if (finalRes.status){
        showSuccess(finalRes.message)
        getColors();
        setIds([])
        }
       })
      }else{
        showWarning("Please select at least one color")
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
        <span className="text-gray-600">Home / Color / </span>
        <span className="font-medium">View</span>
      </div>
      <div
        id="color-filter"
        className={`${showSearch ? "block" : "hidden"} mx-auto mt-10 max-w-[1220px] rounded-md border border-slate-300 bg-white shadow-sm`}
      >
        <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
          <h3 className="text-[20px] font-semibold text-slate-800">
            Search Color
          </h3>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Search by name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Code
            </label>
            <input
              type="text"
              name="code"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Search by code"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Order
            </label>
            <input
              type="number"
              name="order"
              value={searchOrder} 
              onChange={(e) => setSearchOrder(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Search by order"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-4 py-3">
          <button
            onClick={getColors}
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
          >
            <FaMagnifyingGlass />
            Search
          </button>
          <button
          onClick={()=>{
            setSearchName(''),
            setSearchCode(''),
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
          <div className="text-[26px] font-semibold">View Color</div>
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
            <thead className="bg-gray-50 text-xs font-semibold uppercase">
              <tr>
              <th className="p-4">
                <input type="checkbox" checked={data.length==ids.length} onChange={allCheck}/>
              </th>
              <th className="p-4">S. No.</th>
              <th className="p-4">Color Name</th>
              <th className="p-4">Color</th>
              <th className="p-4">Order</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length >= 1 ? (
                data.map((obj, index) => {
                  return (
                    <tr
                      key={obj._id}
                      id={`color-row-${obj._id}`}
                      className="border-t bg-white"
                    >
                      <td className="p-4">
                        <input type="checkbox" onChange={getCheckValue} value={obj._id} checked={ids.includes(obj._id)} />
                      </td>
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{obj.name}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-2">
                        <span
                          className="h-7 w-7 rounded"
                          style={{ backgroundColor: obj.code }}
                        />
                        {obj.code}
                        </span>
                      </td>
                      <td className="p-4">{obj.order}</td>
                      <td className={`p-4 font-semibold ${obj.status ? "text-green-600" : "text-red-600"}`}>
                        {obj.status ? "Active" : "Deactive"}
                      </td>
                      <td className="p-4 text-center"><Link to={`/color/edit/${obj._id}`} className="inline-flex">
                      <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-sm transition hover:bg-yellow-200">
                        <FaPenToSquare className="text-lg" />
                      </button>
                      </Link></td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="7" className="border-t p-6 text-center text-gray-500">No color Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
