import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { FaRegImage } from 'react-icons/fa6'
import { useNavigate, useParams } from 'react-router';
import { showError, showSuccess } from '../../common/notification/notification';

export default function AddSubSubCategory() {

   let apiBaseUrl = import.meta.env.VITE_APIBASEPATH || 'http://localhost:8000/api/admin/';
   let [parent, setParent] = useState([])
   let [subcategoryData, setsubcategoryData] = useState([])
   let [editData, setEditData] = useState(null)
   let [selectedParentCategory, setSelectedParentCategory] = useState('')
   let [selectedSubCategory, setSelectedSubCategory] = useState('')
   let [imagePreview, setImagePreview] = useState('')
   let navigate = useNavigate();
   let {id} = useParams()


   let saveSubsubCategory=(e)=>{
    e.preventDefault()
    let formData = new FormData(e.target)
    let apiRequest = id
      ? axios.put(`${apiBaseUrl}subsubcategory/update/${id}`, formData)
      : axios.post(`${apiBaseUrl}subsubcategory/create`,formData)

    apiRequest
    .then((res)=>res.data)
    .then((finalRes)=>{
    if(finalRes.status){
      showSuccess(finalRes.message)
      navigate('/sub-sub-category/view')
    }else{
      showError(finalRes.error || finalRes.message)
    }
      
    })
    .catch((error)=>{
      showError(error.response?.data?.error || error.response?.data?.message || 'Sub-subcategory could not be saved')
    })
   }

   let previewImage=(e)=>{
    let imageFile=e.target.files[0]
    if(imageFile){
      setImagePreview(URL.createObjectURL(imageFile))
    }
   }


   
   let getParents = useCallback(() => {
     axios.get(`${apiBaseUrl}subsubcategory/parent`)
     .then((res)=>res.data)
     .then((finalRes)=>{
      setParent(finalRes.data);
      
     })
   },[apiBaseUrl])

   let getSubCategory=useCallback((parent_id, defaultValue = '')=>{
    setSelectedParentCategory(parent_id || '')
    if(!parent_id){
      setsubcategoryData([])
      setSelectedSubCategory('')
      return
    }
    axios.get(`${apiBaseUrl}subsubcategory/subcategory/${parent_id}`)
     .then((res)=>res.data)
     .then((finalRes)=>{
      const subCategoryList = finalRes.data || []
      setsubcategoryData(subCategoryList)
      const nextValue = subCategoryList.some((item) => item._id === defaultValue) ? defaultValue : ''
      setSelectedSubCategory(nextValue)
     })
   },[apiBaseUrl])

   useEffect(() => {
    getParents()
   },[getParents])

   useEffect(()=>{
    if(id){
      axios.get(`${apiBaseUrl}subsubcategory/get-detail/${id}`)
      .then((res)=>res.data)
      .then((finalRes)=>{
        if(finalRes.status){
          setEditData(finalRes.data)
          let parentId = finalRes.data?.parentCategory?._id || finalRes.data?.parentCategory
          const selectedSubId = finalRes.data?.subcategory?._id || finalRes.data?.subcategory || ''
          setSelectedParentCategory(parentId || '')
          setSelectedSubCategory(selectedSubId)
          getSubCategory(parentId, selectedSubId)
          if(finalRes.data?.image){
            setImagePreview(`${finalRes.staticPath}${finalRes.data.image}`)
          }
        }
      })
    }
  },[id, apiBaseUrl, getSubCategory])

  return (
    <div className='w-full min-h-[680px] px-5 bg-slate-50 py-10'>
      <div className='mx-auto'>
        <h3 className='text-[24px] font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 px-5 rounded-t-lg text-white border border-indigo-500'>
          {id ? 'Update Sub Sub Category' : 'Add New Sub Sub Category'}
        </h3>
        <form key={editData?._id || 'add-sub-sub-category'} onSubmit={saveSubsubCategory} className='border border-slate-200 border-t-0 gap-6 flex bg-white p-6 rounded-b-lg shadow-sm'>
          <div className='flex flex-col'>
            <label className='block mb-2 text-md font-medium text-gray-700'>Image</label>
            <div className='relative w-60 h-60 border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100'>
              {imagePreview
                ? <img src={imagePreview} alt='Sub sub category preview' className='w-full h-full object-cover' />
                : <div className='relative w-full h-full overflow-hidden bg-slate-200 rounded-lg flex flex-col items-center justify-center gap-4'>
                <div className='absolute inset-0 bg-slate-300 animate-pulse' />
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.8s_linear_infinite]' />
                <div className='relative z-10 flex flex-col items-center gap-3'>
                  <FaRegImage className='text-slate-600' size={55} />
                  <div className='w-28 h-3 bg-slate-400 rounded-full' />
                  <div className='w-20 h-3 bg-slate-400 rounded-full' />
                </div>
              </div>
              }
              <input onChange={previewImage} name='image' accept='image/*' className='absolute inset-0 opacity-0 cursor-pointer' type='file' required={!id} />
            </div>
          </div>
          <div className='w-full'>
            <div className='mb-6'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Select Parent Category</label>
              <select
                onChange={(e) => getSubCategory(e.target.value)}
                value={selectedParentCategory}
                name='parentCategory'
                required
                className='text-[17px] border cursor-pointer border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3'
              >
                <option value=''>Select Parent Category</option>
                {
                  parent.map((obj)=>{
                    return(
                <option key={obj._id} value={obj._id}>{obj.name}</option>
                    )

                  })
                }
              </select>
              
            </div>
            <div className='mb-6'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Select Parent Sub Category</label>
              <select
                name='subCategory'
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                required
                className='text-[17px] border cursor-pointer border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3'
              >
                <option value=''>Select Sub Category</option>
                {
                  subcategoryData.map((obj)=>{
                     return(
                <option key={obj._id} value={obj._id}>{obj.name}</option>

                     )
                  })
                }
              </select>
            </div>
            <div className='mb-6'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Name</label>
              <input type='text' name='name' defaultValue={editData?.name} autoComplete='off' required minLength='2' className='text-[17px] border border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' placeholder='Enter sub sub category name' />
            </div>
            <div className='mb-6'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Slug</label>
              <input type='text' name='slug' defaultValue={editData?.slug} autoComplete='off' className='text-[17px] border border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' placeholder='Enter slug' />
            </div>
            <div className='mb-6'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Order</label>
              <input type='number' name='order' defaultValue={editData?.order ?? 0} min='0' autoComplete='off' className='text-[17px] border border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' placeholder='Enter order number' />
            </div>
            <div className='flex justify-end'>
              <button type='submit' className='mt-3 cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all'>
                {id ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
