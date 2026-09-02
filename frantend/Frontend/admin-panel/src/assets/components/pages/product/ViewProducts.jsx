import axios from 'axios'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { FaFilter, FaMagnifyingGlass, FaPenToSquare, FaRotate } from 'react-icons/fa6'
import { Link } from 'react-router'
import { showError, showSuccess, showWarning } from '../../common/notification/notification'
import { confirmDelete } from '../../common/sweetAlert/deleteConfirm'
import ImagePathPreview from '../../common/ImagePathPreview'

export default function ViewProducts() {
    const [showSearch,setShowSearch]=useState(false)
    const [data,setData]=useState([])
    const [imagePath,setImagePath]=useState('')
      const [ids,setIds]=useState([])
      const [searchName,setSearchName]=useState('')
      const [searchSlug,setSearchSlug]=useState('')
      const [searchPrice,setSearchPrice]=useState('')
      const [searchOrder,setSearchOrder]=useState('')
    const apiBaseUrl=import.meta.env.VITE_APIBASEPATH
    
      let getProducts=useCallback(()=>{
        let searchObj={
          name:searchName,
          slug:searchSlug,
          price:searchPrice,
          order:searchOrder
        }
        axios.get(`${apiBaseUrl}product/view`,{
          params:searchObj
        })
        .then((res)=>res.data)
        .then((finalRes)=>{
          if(finalRes.status){
            setData(finalRes.data)
            setImagePath(finalRes.staticPath || '')
          }
        })
        .catch((error)=>showError(error.response?.data?.message || 'Unable to load products'))
      },[apiBaseUrl,searchName,searchSlug,searchPrice,searchOrder])
    
      useEffect(()=>{
        getProducts()
      },[getProducts])

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
          axios.post(`${apiBaseUrl}product/multidelete`,obj)
          .then((res)=>res.data)
          .then((finalRes)=>{
            if(finalRes.status){
              showSuccess(finalRes.message)
              getProducts()
              setIds([])
            }
          })
          .catch((error)=>showError(error.response?.data?.message || 'Unable to delete products'))
        }else{
          showWarning('Please select at least one product')
        }
      }

      let changeStatus=()=>{
        if(ids.length>=1){
          let obj={ids}
          axios.post(`${apiBaseUrl}product/changestatus`,obj)
          .then((res)=>res.data)
          .then((finalRes)=>{
            if(finalRes.status){
              showSuccess(finalRes.message)
              getProducts()
              setIds([])
            }
          })
          .catch((error)=>showError(error.response?.data?.message || 'Unable to change product status'))
        }else{
          showWarning('Please select at least one product')
        }
      }

  return (
    <section className='w-full'>
      <nav className='flex border-b bg-white px-6 py-3 shadow-sm'>
        <ol className='inline-flex items-center space-x-2 text-gray-600'>
          <li><a className='text-md font-medium hover:text-indigo-600'>Home</a></li>
          <li>/</li>
          <li><a className='text-md font-medium hover:text-indigo-600'>Product</a></li>
          <li>/</li>
          <li className='text-md font-medium text-gray-900'>View Product</li>
        </ol>
      </nav>

      <div className='p-4'>
        <div id='product-filter' className={`${showSearch ? 'block' : 'hidden'} py-4 relative px-6 my-3 rounded-lg border border-slate-200 w-full bg-white shadow-sm`}>
          <p className='font-semibold py-2 text-[20px]'>Search Product</p>
          <div className='grid gap-4 md:grid-cols-4'>
            <div>
              <label className='block mb-2 font-medium text-gray-700'>Product Name</label>
              <input type='text' value={searchName} onChange={(e)=>setSearchName(e.target.value)} placeholder='Search by product name' className='text-[17px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' />
            </div>
            <div>
              <label className='block mb-2 font-medium text-gray-700'>Slug</label>
              <input type='text' value={searchSlug} onChange={(e)=>setSearchSlug(e.target.value)} placeholder='Search by slug' className='text-[17px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' />
            </div>
            <div>
              <label className='block mb-2 font-medium text-gray-700'>Price</label>
              <input type='number' value={searchPrice} onChange={(e)=>setSearchPrice(e.target.value)} placeholder='Search by price' className='text-[17px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' />
            </div>
            <div>
              <label className='block mb-2 font-medium text-gray-700'>Order</label>
              <input type='number' value={searchOrder} onChange={(e)=>setSearchOrder(e.target.value)} placeholder='Search by order' className='text-[17px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' />
            </div>
          </div>
          <div className='flex justify-end gap-3 border-t border-slate-200 mt-4 pt-4'>
            <button onClick={()=>{
              setSearchName('')
              setSearchSlug('')
              setSearchPrice('')
              setSearchOrder('')
            }} className='inline-flex items-center gap-2 text-white bg-slate-500 hover:bg-slate-600 px-6 py-2.5 rounded-lg transition-all'><FaRotate /> Reset</button>
            <button onClick={getProducts} className='inline-flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-lg shadow-sm transition-all'><FaMagnifyingGlass /> Search</button>
          </div>
        </div>

        <div className='bg-slate-100 flex justify-between items-center py-3 px-4 rounded-t-md border border-slate-300'>
          <div className='text-[26px] font-semibold'>View Product</div>
          <div className='flex gap-3 items-center'>
            <button type='button' onClick={()=>setShowSearch(!showSearch)} className='flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm border border-slate-300 transition-all'><FaFilter /> Search</button>
            <button onClick={multiDelete} className='text-white disabled:bg-slate-400 bg-indigo-600 hover:bg-indigo-700 text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all'>Delete All</button>
            <button onClick={changeStatus} className='text-white disabled:bg-slate-400 bg-indigo-600 hover:bg-indigo-700 text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all'>Change Status</button>
          </div>
        </div>

        <div className='border border-t-0 rounded-b-md border-slate-300 overflow-x-auto'>
          <table className='min-w-[900px] w-full text-center text-gray-700'>
            <thead className='text-sm uppercase bg-gray-50 border-b'><tr>
              <th className='px-2 py-3 font-semibold'><span className='flex items-center justify-center gap-2'><input type='checkbox' checked={data.length>=1 && data.length==ids.length} onChange={allCheck} className='w-4 h-4 cursor-pointer' />Select</span></th>
              <th className='px-2 py-3 font-semibold'>S. No.</th>
              <th className='px-2 py-3 font-semibold'>Product Name</th>
              <th className='px-2 py-3 font-semibold'>Image / URL</th>
              <th className='px-2 py-3 font-semibold'>parentCategory</th>
              <th className='px-2 py-3 font-semibold'>Price</th>
              <th className='px-2 py-3 font-semibold'>Order</th>
              <th className='px-2 py-3 font-semibold'>details</th>
              <th className='px-2 py-3 font-semibold'>Status</th>
              <th className='px-2 py-3 font-semibold'>Action</th>
            </tr></thead><tbody>

           {
            data.map((obj,index)=>{
              return(
                   <tr key={obj._id} className='bg-white border-b'>
              <td className='px-2 py-4'><input type='checkbox' value={obj._id} checked={ids.includes(obj._id)} onChange={getCheckValue} className='product-row-check w-4 h-4 cursor-pointer' /></td>
              <td className='px-2 py-4'>{index + 1}</td>
              <td className='px-2 py-4'>{obj.name}</td>
              <td className='px-2 py-4'><ImagePathPreview basePath={imagePath} filename={obj.image} alt={obj.name} /></td>
              <td className='px-2 py-4'>{obj.parentCategory?.name}</td>
              <td className='px-2 py-4'>{obj.price}</td>
              <td className='px-2 py-4'>{obj.order}</td>
              <td className='px-2 py-4'>
                <Link to={`/product/view/${obj._id}`}>
                <button>
                
                view
                </button>
                </Link>
                
                </td>
              <td className={`px-2 py-4 font-semibold ${obj.status ? 'text-green-600' : 'text-red-600'}`}>{obj.status ? 'Active' : 'Deactive'}</td>
              <td className='px-2 py-4'>
                <Link to={`/product/edit/${obj._id}`}>
                <FaPenToSquare className='text-[gold] text-xl'/>      
                </Link>
              </td>
            </tr>
              )
            })
           }

            
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
