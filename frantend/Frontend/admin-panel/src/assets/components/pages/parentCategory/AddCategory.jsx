import axios from 'axios'
import { FaRegImage } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { showError, showSuccess } from '../../common/notification/notification'
import { getApiErrorMessage } from '../../../../api/errors'

export default function AddCategory() {
  let [imagePreview,setImagePreview]=useState('')
  let [editData,setEditData]=useState(null)
  let [isSaving,setIsSaving]=useState(false)
  let apiBaseUrl=import.meta.env.VITE_APIBASEPATH || 'http://localhost:8000/api/admin/'
  let {id}=useParams()
  let navigate=useNavigate()

  let saveCategory=(e)=>{
    e.preventDefault()
    setIsSaving(true)
    let apiRequest

    let formData=new FormData(e.target)
    if(id){
      apiRequest=axios.put(`${apiBaseUrl}category/update/${id}`,formData)
    }else{
      apiRequest=axios.post(`${apiBaseUrl}category/create`,formData)
    }

    apiRequest
    .then((res)=>res.data)
    .then((finalRes)=>{
      console.log(finalRes)
      if(finalRes.status){
        showSuccess(finalRes.message)
        navigate('/category/view')
      }else{
        showError(getApiErrorMessage({ response: { data: finalRes } }, 'Category could not be saved'))
      }
    })
    .catch((error)=>{
      showError(getApiErrorMessage(error, 'Category could not be saved'))
    })
    .finally(()=>setIsSaving(false))
  }

  let previewImage=(e)=>{
    let imageFile=e.target.files[0]

    if(imageFile){
      setImagePreview(URL.createObjectURL(imageFile))
    }
  }

  useEffect(()=>{
    if(id){
      axios.get(`${apiBaseUrl}category/get-detail/${id}`)
      .then((res)=>res.data)
      .then((finalRes)=>{
        if(finalRes.status){
          setEditData(finalRes.data)
          if(finalRes.data?.image){
            setImagePreview(`${finalRes.staticPath}${finalRes.data.image}`)
          }
        }
      })
    }
  },[id,apiBaseUrl])

  return (
    <div className='w-full min-h-[680px] px-4 bg-slate-50 py-10'>
      <div className='mx-auto'>
        <h3 className='text-[24px] font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 px-5 rounded-t-lg text-white border border-indigo-500'>
          {id ? 'Update Category' : 'Add New Category'}
        </h3>
        <form key={editData?._id || 'add-category'} onSubmit={saveCategory} className='border border-slate-200 border-t-0 gap-6 flex bg-white p-6 rounded-b-lg shadow-sm'>
          <div className='flex flex-col'>
            <div className='relative w-60 h-60 border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100'>
              {imagePreview
                ? <img src={imagePreview} alt='Category preview' className='w-full h-full object-cover' />
                : <div className='relative w-full h-full overflow-hidden bg-slate-200 rounded-lg flex flex-col items-center z-0 justify-center gap-4'>
                <div className='absolute inset-0 bg-slate-300 animate-pulse' />
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.8s_linear_infinite]' />
                <div className='relative z-10 flex flex-col items-center gap-3'>
                  <FaRegImage className='text-slate-600' size={55} />
                  <div className='w-28 h-3 bg-slate-400 rounded-full' />
                  <div className='w-20 h-3 bg-slate-400 rounded-full' />
                </div>
              </div>
              }
              <input onChange={previewImage} name='image' accept='image/*' className='absolute z-10 inset-0 opacity-0 cursor-pointer' type='file' required={!id} />
            </div>
          </div>
          <div className='basis-full'>
            <div className='mb-6'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Category Name</label>
              <input type='text' name='name' defaultValue={editData?.name} autoComplete='off' required minLength='2' className='text-[17px] border border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' placeholder='Enter category name' />
            </div>
            <div className='mb-6'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Order</label>
              <input type='number' name='order' defaultValue={editData?.order ?? 0} min='0' autoComplete='off' className='text-[17px] border border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' placeholder='Enter order number' />
            </div>
            <div className='flex justify-end'>
              <button type='submit' disabled={isSaving} className='mt-3 cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all disabled:cursor-not-allowed disabled:bg-slate-400'>
                {isSaving ? 'Saving...' : id ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
