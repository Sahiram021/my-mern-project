import axios from 'axios';
import { useEffect, useState } from 'react'
import { FaFilter, FaMagnifyingGlass, FaPenToSquare, FaRotate } from 'react-icons/fa6'
import { Link } from 'react-router'
import { showSuccess, showWarning } from '../../common/notification/notification'
import { confirmDelete } from '../../common/sweetAlert/deleteConfirm'

const apiBaseUrl=import.meta.env.VITE_APIBASEPATH

export default function ViewCategories() {
  const [data,setData]=useState([])
  const [imagePath,setImagePath]=useState('')
  const [ids,setIds]=useState([])
  const [searchName,setSearchName]=useState('')
  const [searchOrder,setSearchOrder]=useState('')
  const [showSearch,setShowSearch]=useState(false)

  let getCategory=()=>{
    let searchObj={
      name:searchName,
      order:searchOrder
    }
    axios.get(`${apiBaseUrl}category/view`,{
      params:searchObj
    })
    .then((res)=>res.data)
    .then((finalRes)=>{
      if(finalRes.status){
        setData(finalRes.data)
        setImagePath(finalRes.staticPath)
      }
    })
  }

  useEffect(()=>{
    getCategory()
  },[searchName,searchOrder])

  let getCheckValue=(e)=>{
    let checkBoxValue=e.target.value
    if(e.target.checked){
      setIds([...ids,checkBoxValue])
    }else{
      setIds(ids.filter((id)=>id!=checkBoxValue))
    }
  }

  let allCheck=(e)=>{
    if(e.target.checked){
      let getIds=data.map((obj)=>obj._id)
      setIds(getIds)
    }else{
      setIds([])
    }
  }

  let multiDelete=async ()=>{
    if(ids.length>=1){
      let isConfirmed = await confirmDelete()
      if(!isConfirmed) return
      let obj={ids}
      axios.post(`${apiBaseUrl}category/multidelete`,obj)
      .then((res)=>res.data)
      .then((finalRes)=>{
        if(finalRes.status){
          showSuccess(finalRes.message)
          getCategory()
          setIds([])
        }
      })
    }else{
      showWarning('Please select at least one category')
    }
  }

  let changeStatus=()=>{
    if(ids.length>=1){
      let obj={ids}
      axios.post(`${apiBaseUrl}category/changestatus`,obj)
      .then((res)=>res.data)
      .then((finalRes)=>{
        if(finalRes.status){
          showSuccess(finalRes.message)
          getCategory()
          setIds([])
        }
      })
    }else{
      showWarning('Please select at least one category')
    }
  }

  return (
    <section className='w-full'>
      <nav className='flex border-b bg-white px-6 py-3 shadow-sm'>
        <ol className='inline-flex items-center space-x-2 text-gray-600'>
          <li><a className='text-md font-medium hover:text-indigo-600'>Home</a></li>
          <li>/</li>
          <li><a className='text-md font-medium hover:text-indigo-600'>Category</a></li>
          <li>/</li>
          <li className='text-md font-medium text-gray-900'>View Category</li>
        </ol>
      </nav>

      <div className='p-4'>
        <div id='category-filter' className={`${showSearch ? 'block' : 'hidden'} py-4 relative px-6 my-3 rounded-lg border border-slate-200 w-full bg-white shadow-sm`}>
          <p className='font-semibold py-2 text-[20px]'>Search Category</p>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <label className='block mb-2 font-medium text-gray-700'>Name</label>
              <input type='text' value={searchName} onChange={(e)=>setSearchName(e.target.value)} placeholder='Search by name' className='text-[17px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' />
            </div>
            <div>
              <label className='block mb-2 font-medium text-gray-700'>Order</label>
              <input type='number' value={searchOrder} onChange={(e)=>setSearchOrder(e.target.value)} placeholder='Search by order' className='text-[17px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' />
            </div>
          </div>
          <div className='flex justify-end gap-3 border-t border-slate-200 mt-4 pt-4'>
            <button onClick={()=>{
              setSearchName('')
              setSearchOrder('')
            }} className='inline-flex items-center gap-2 text-white bg-slate-500 hover:bg-slate-600 px-6 py-2.5 rounded-lg transition-all'><FaRotate /> Reset</button>
            <button onClick={getCategory} className='inline-flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-lg shadow-sm transition-all'><FaMagnifyingGlass /> Search</button>
          </div>
        </div>

        <div className='bg-slate-100 flex justify-between items-center py-3 px-4 rounded-t-md border border-slate-300'>
          <div className='text-[26px] font-semibold'>View Category</div>
          <div className='flex gap-3 items-center'>
            <button type='button' onClick={()=>setShowSearch(!showSearch)} className='flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm border border-slate-300 transition-all'><FaFilter /> Search</button>
            <button onClick={multiDelete} className='text-white disabled:bg-slate-400 bg-indigo-600 hover:bg-indigo-700 text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all'>Delete All</button>
            <button onClick={changeStatus} className='text-white disabled:bg-slate-400 bg-indigo-600 hover:bg-indigo-700 text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all'>Change Status</button>
          </div>
        </div>

        <div className='border border-t-0 rounded-b-md border-slate-300 overflow-x-auto'>
          <table className='min-w-[900px] w-full text-center text-gray-700'>
            <thead className='text-sm uppercase bg-gray-50 border-b'>
            <tr>
              <th className='px-2 py-3 font-semibold'><span className='flex items-center justify-center gap-2'><input type='checkbox' checked={data.length>=1 && data.length==ids.length} onChange={allCheck} className='w-4 h-4 cursor-pointer' />Select</span></th>
              <th className='px-2 py-3 font-semibold'>S. No.</th>
              <th className='px-2 py-3 font-semibold'>Name</th>
              <th className='px-2 py-3 font-semibold'>Image</th>
              <th className='px-2 py-3 font-semibold'>Order</th>
              <th className='px-2 py-3 font-semibold'>Status</th>
              <th className='px-2 py-3 font-semibold'>Action</th>
            </tr>
            </thead>
            <tbody>
              {data.map((obj,index)=>(
                <tr key={obj._id} className='bg-white border-b'>
                  <td className='px-2 py-4'><input type='checkbox' value={obj._id} checked={ids.includes(obj._id)} onChange={getCheckValue} className='category-row-check w-4 h-4 cursor-pointer' /></td>
                  <td className='px-2 py-4'>{index+1}</td>
                  <td className='px-2 py-4'>{obj.name}</td>
                  <td className='px-2 py-4'>
                    <img src={imagePath+obj.image} alt={obj.name} className='w-16 h-16 mx-auto rounded object-cover' />
                  </td>
                  <td className='px-2 py-4'>{obj.order}</td>
                  <td className={`px-2 py-4 font-semibold ${obj.status ? 'text-green-600' : 'text-red-600'}`}>{obj.status ? 'Active' : 'Deactive'}</td>
                  <td className='px-2 py-4'>
                    <Link to={`/category/edit/${obj._id}`} className='inline-flex'>
                      <span className='flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-sm'><FaPenToSquare className='text-lg' /></span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
