import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { FaRegImage } from 'react-icons/fa6'
import { useNavigate,useParams } from 'react-router';
import Select from 'react-select';
import { showError, showSuccess } from '../../common/notification/notification';

export default function AddProduct() {
     let apiBaseUrl = import.meta.env.VITE_APIBASEPATH || 'http://localhost:8000/api/admin/';
  let [parent, setParent] = useState([])
  let [subcategoryData, setsubcategoryData] = useState([])
  let [subsubcategoryData, setsubsubcategoryData] = useState([])
  let [color, setcolor] = useState([])
  let [material, setmaterial] = useState([])
  let [selectedColor, setSelectedColor] = useState([])
  let [selectedMaterial, setSelectedMaterial] = useState([])
  let [selectedParent, setSelectedParent] = useState('')
  let [selectedSubcategory, setSelectedSubcategory] = useState('')
  let [selectedSubsubcategory, setSelectedSubsubcategory] = useState('')
  let [productType, setProductType] = useState('New')
  let [imagePreview,setImagePreview]=useState('')
  let [galleryPreview,setGalleryPreview]=useState([])
  let [data,setData]=useState(null)
  let {id}=useParams()
  let navigate = useNavigate()
  

  let getParents = useCallback(() => {
       axios.get(`${apiBaseUrl}subsubcategory/parent`)
       .then((res)=>res.data)
       .then((finalRes)=>{
        setParent(finalRes.data);
        
       })
     },[apiBaseUrl])

     let getColor = useCallback(() => {
       axios.get(`${apiBaseUrl}product/colors`)
       .then((res)=>res.data)
       .then((finalRes)=>{
        let selectColorData = finalRes.data.map((obj)=>{
          return {
            value: obj._id,
            label: obj.name
          }
        })
        setcolor(selectColorData);
        
       })
     },[apiBaseUrl])

     let getMaterial = useCallback(() => {
       axios.get(`${apiBaseUrl}product/materials`)
       .then((res)=>res.data)
       .then((finalRes)=>{
        let selectMaterialData = finalRes.data.map((obj)=>{
          return {
            value: obj._id,
            label: obj.name
          }
        })
        setmaterial(selectMaterialData);
        
       })
     },[apiBaseUrl])

      let getSubCategory=useCallback((parent_id)=>{
    setSelectedParent(parent_id || '')
    setSelectedSubcategory('')
    setSelectedSubsubcategory('')
    setsubsubcategoryData([])
    if(!parent_id){
      setsubcategoryData([])
      return
    }
    axios.get(`${apiBaseUrl}product/subcategory/${parent_id}`)
     .then((res)=>res.data)
     .then((finalRes)=>{
      setsubcategoryData(finalRes.data);
      
     })
    
    
   },[apiBaseUrl])

   let getSubCategoryEdit = (parentId) =>{
    axios
    .get(`${apiBaseUrl}product/subcategory/${parentId}`)
    .then((res)=>res.data)
    .then((finalRes)=>{
      setsubcategoryData(finalRes.data);
    })

   }

    let getSubsubCategoryEdit = (parentId) =>{
    axios
    .get(`${apiBaseUrl}product/subsubcategory/${parentId}`)
    .then((res)=>res.data)
    .then((finalRes)=>{
      setsubsubcategoryData(finalRes.data);
    })

   }

   
      let getSubsubCategory=useCallback((parent_id)=>{
    setSelectedSubcategory(parent_id || '')
    setSelectedSubsubcategory('')
    if(!parent_id){
      setsubsubcategoryData([])
      return
    }
    axios.get(`${apiBaseUrl}product/subsubcategory/${parent_id}`)
     .then((res)=>res.data)
     .then((finalRes)=>{
      setsubsubcategoryData(finalRes.data);
      
     })
    
    
   },[apiBaseUrl])

   useEffect(() => {
    getParents()
    getColor()
    getMaterial()
   },[getParents,getColor,getMaterial])

   let previewImage=(e)=>{
    let imageFile=e.target.files[0]
    if(imageFile){
      if(imagePreview){
        URL.revokeObjectURL(imagePreview)
      }
      setImagePreview(URL.createObjectURL(imageFile))
    }
   }

   let previewGallery=(e)=>{
    galleryPreview.forEach((preview)=>URL.revokeObjectURL(preview))
    let galleryFiles=Array.from(e.target.files)
    setGalleryPreview(galleryFiles.map((file)=>URL.createObjectURL(file)))
   }

   useEffect(() => {
    return () => {
      if(imagePreview){
        URL.revokeObjectURL(imagePreview)
      }
      galleryPreview.forEach((preview)=>URL.revokeObjectURL(preview))
    }
   },[imagePreview,galleryPreview])

   let saveProduct=(e)=>{
    e.preventDefault()
    let fromData=new FormData(e.target)
    const apiRequest = id
      ? axios.put(`${apiBaseUrl}product/update/${id}`,fromData)
      : axios.post(`${apiBaseUrl}product/create`,fromData)

    apiRequest
    .then((res)=>res.data)
    .then((finalRes)=>{
      if(finalRes.status){
        showSuccess(finalRes.message)
        navigate('/product/view')
      }
      else{
        showError(finalRes.error || finalRes.message)
      }
    })
    .catch((error)=>{
      showError(error.response?.data?.error || error.response?.data?.message || 'Product could not be saved')
    })
   }
   
  let getProductDetails = () => {
    
    axios
      .get(`${apiBaseUrl}product/details/${id}`)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          setData(finalRes.data);
          const parentId = finalRes.data.parentCategory?._id || finalRes.data.parentCategory || ''
          const subcategoryId = finalRes.data.subcategory?._id || finalRes.data.subcategory || ''
          const subsubcategoryId = finalRes.data.subsubcategory?._id || finalRes.data.subsubcategory || ''
          setSelectedParent(parentId)
          setSelectedSubcategory(subcategoryId)
          setSelectedSubsubcategory(subsubcategoryId)
          setProductType(finalRes.data.productType || 'New')
          if(parentId) getSubCategoryEdit(parentId)
          if(subcategoryId) getSubsubCategoryEdit(subcategoryId)
          let covertColor=(finalRes.data.color || []).map((obj)=>{
            return{
              value:obj._id,
              label:obj.name
            }
          })
          setSelectedColor(covertColor);
          let covertMaterial=(finalRes.data.material || []).map((obj)=>{
            return{
              value:obj._id,
              label:obj.name
            }
          })
          setSelectedMaterial(covertMaterial);
          setImagePreview(finalRes.staticPath+finalRes.data.image)
          setGalleryPreview((finalRes.data.gallery || []).map((imgName)=>finalRes.staticPath+imgName))
          //setGalleryPreview(allImg)
          
        }
      });
  }

  useEffect(() => {
    if(id){
    getProductDetails();
    }
    else{
      const timer = window.setTimeout(() => {
        setData(null)
        setSelectedColor([])
        setSelectedMaterial([])
        setSelectedParent('')
        setSelectedSubcategory('')
        setSelectedSubsubcategory('')
        setProductType('New')
        setImagePreview('')
        setGalleryPreview([])
      }, 0)
      return () => window.clearTimeout(timer)
    }
  }, [id]);
   

  return (
    <div className='w-full min-h-[680px] px-5 bg-slate-50 py-10'>
      <div className='mx-auto'>
        <h3 className='text-[24px] font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 px-5 rounded-t-lg text-white border border-indigo-500'>
          {id ? 'Update Product' : 'Add New Product'}
        </h3>
        <form key={data?._id || (id ? 'loading-product' : 'new-product')} onSubmit={saveProduct} className='border border-slate-200 border-t-0 bg-white p-6 rounded-b-lg shadow-sm'>
          <div className='flex gap-3'>
            <div className='mb-6 basis-[33%]'>
              
              <label className='block mb-2 text-md font-medium text-gray-700'>Parent Category</label>
              <select onChange={(e)=>getSubCategory(e.target.value)} value={selectedParent} name='parentCategory' required className='text-[17px] border cursor-pointer border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3'>
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
            <div className='mb-6 basis-[33%]'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Sub Category</label>
              <select name='subcategory' onChange={(e)=>getSubsubCategory(e.target.value)} value={selectedSubcategory} required className='text-[17px] border cursor-pointer border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3'>
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
            <div className='mb-6 basis-[33%]'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Sub Sub Category</label>
               <select name='subsubcategory' value={selectedSubsubcategory} onChange={(e)=>setSelectedSubsubcategory(e.target.value)} className='text-[17px] border cursor-pointer border-slate-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3'>
                <option value=''>Select Subsub Category</option>
                {
                  subsubcategoryData.map((obj)=>{
                     return(
                <option key={obj._id} value={obj._id}>{obj.name}</option>

                     )
                  })
                }
              </select>
            </div>
          </div>
          <div className='flex gap-3'>
            <div className='mb-6 basis-[25%]'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Product Name</label>
              <input defaultValue={data?.name} type='text' name='name' autoComplete='off' required minLength='2' className='text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3' placeholder='Enter product name' />
            </div>
            <div className='mb-6 basis-[25%]'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Product Type</label>
              <select name='productType' value={productType} onChange={(e)=>setProductType(e.target.value)} required className='text-[17px] border cursor-pointer border-gray-300 rounded-lg block w-full py-2.5 px-3'>
                <option value='Featured'>Featured</option>
                <option value='New'>New Arrivals</option>
                <option value='On Sale'>On Sale</option>
                <option value='Bestseller'>Bestseller</option>
              </select>
            </div>
            <div className='mb-6 basis-[25%]'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Price</label>
              <input defaultValue={data?.price} type='number' name='price' autoComplete='off' required min='0' step='0.01' className='text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3' placeholder='Enter price' />
            </div>
            <div className='mb-6 basis-[25%]'>
              <label className='block mb-2 text-md font-medium text-gray-700'>order</label>
              <input defaultValue={data?.order ?? 0} type='number' name='order' autoComplete='off' min='0' className='text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3' placeholder='Enter order' />
            </div>
          </div>
          <div className='flex gap-3'>
            <div className='mb-6 basis-[50%]'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Color</label>
              <Select
                isMulti={true}
                name='color[]'
                value={selectedColor}
                options={color}
                placeholder='Select Color'
                onChange={setSelectedColor}
              />
              
            </div>
            <div className='mb-6 basis-[50%]'>
              <label className='block mb-2 text-md font-medium text-gray-700'>Material</label>
              <Select
                isMulti={true}
                name='material[]'
                options={material}
                placeholder='Select Material'
                value={selectedMaterial}
                onChange={setSelectedMaterial}
              />
              
            </div>
          </div>
          <div className='mb-6'>
            <label className='block mb-2 text-md font-medium text-gray-700'>Short Description</label>
            <textarea defaultValue={data?.sortDescription} name='sortDescription' placeholder='Enter short description' className='text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3' />
          </div>
          <div className='mb-6'>
            <label className='block mb-2 text-md font-medium text-gray-700'>Description</label>
            <textarea defaultValue={data?.longDescription} name='longDescription' placeholder='Enter description' className='text-[17px] border border-gray-300 rounded-lg block w-full py-2.5 px-3 min-h-[150px]' />
          </div>
          <div className='flex mb-6 flex-col'>
            <label className='block mb-2 text-md font-medium text-gray-700'>Image</label>
            <div className='relative w-60 h-60 border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100'>
              {imagePreview
                ? <img src={imagePreview} alt='Product preview' className='w-full h-full object-cover' />
                : <div className='relative w-full h-full overflow-hidden bg-slate-200 rounded-lg flex flex-col items-center justify-center gap-4'>
                <div className='absolute inset-0 bg-slate-300 animate-pulse' />
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.8s_linear_infinite]' />
                <div className='relative z-10 flex flex-col items-center gap-3'>
                  <FaRegImage className='text-slate-600' size={55} />
                  <div className='w-28 h-3 bg-slate-400 rounded-full' />
                  <div className='w-20 h-3 bg-slate-400 rounded-full' />
                </div>
              </div>}
              <input onChange={previewImage} type='file' name='image' accept='image/*' required={!id} className='absolute inset-0 opacity-0 cursor-pointer' />
            </div>
          </div>
          <div className='flex mb-6 flex-col'>
            <label className='block mb-2 text-md font-medium text-gray-700'>Gallery</label>
            <div className='relative min-h-44 border border-slate-200 rounded-lg overflow-hidden shadow bg-slate-100'>
              {galleryPreview.length
                ? <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3'>
                  {galleryPreview.map((preview,index)=>{
                    return(
                      <div key={preview} className='h-32 rounded-lg overflow-hidden border border-slate-200 bg-white'>
                        <img src={preview} name='gallery' alt={`Gallery preview ${index + 1}`} className='w-full h-full object-cover' />
                      </div>
                    )
                  })}
                </div>
                : <div className='min-h-44 bg-slate-200 rounded-lg flex flex-col items-center justify-center gap-4'>
                  <FaRegImage className='text-slate-600' size={55} />
                  <div className='w-32 h-3 bg-slate-400 rounded-full' />
                  <div className='w-24 h-3 bg-slate-400 rounded-full' />
                </div>}
              <input onChange={previewGallery} type='file' name='gallery' accept='image/*' multiple className='absolute inset-0 opacity-0 cursor-pointer' />
            </div>
          </div>
          <div className='flex justify-end'>
            <button type='submit' className='mt-3 cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-md px-6 py-2.5 shadow-sm transition-all'>
              {id ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
