import { FaPenToSquare } from 'react-icons/fa6'

const inputClass = 'w-full rounded border border-gray-300 px-3 py-2.5 outline-none focus:border-violet-500'

export function AddSlider() {
  return <div className='admin-page'><div className='admin-title'>Add Slider</div><div className='admin-form'>
    <div id='slider-title'><label>Slider Title</label><input className={inputClass} type='text' placeholder='Enter slider title' /></div>
    <div id='slider-image'><label>Slider Image</label><input className={inputClass} type='file' /></div>
    <div id='slider-link'><label>Slider Link</label><input className={inputClass} type='text' placeholder='Enter slider link' /></div>
    <div id='slider-order'><label>Order</label><input className={inputClass} type='number' placeholder='Enter order' /></div>
    <button className='admin-submit'>Add Slider</button>
  </div></div>
}

export function ViewSliders() {
  return <div className='admin-page'><div className='admin-list-title'><span>View Sliders</span><div><button>Filter</button><button>Delete All</button><button>Change Status</button></div></div><div className='admin-table'>
    <div className='admin-row admin-head'><div>Select</div><div>S. No.</div><div>Title</div><div>Image</div><div>Order</div><div>Status</div><div>Action</div></div>
    <div id='slider-row-1' className='admin-row'><div><input type='checkbox' /></div><div>1</div><div>Summer Collection</div><div>slider-1.jpg</div><div>1</div><div className='active'>Active</div><div><FaPenToSquare /></div></div>
  </div></div>
}

export function AddTerms() {
  return <div className='admin-page'><div className='admin-title'>Add Terms &amp; Conditions</div><div className='admin-form'>
    <div id='terms-title'><label>Title</label><input className={inputClass} type='text' placeholder='Enter title' /></div>
    <div id='terms-description'><label>Description</label><textarea className={`${inputClass} min-h-48`} placeholder='Enter terms and conditions' /></div>
    <button className='admin-submit'>Add Terms</button>
  </div></div>
}

export function ViewTerms() {
  return <div className='admin-page'><div className='admin-list-title'><span>View Terms &amp; Conditions</span><div><button>Filter</button><button>Delete All</button><button>Change Status</button></div></div><div className='admin-table'>
    <div className='admin-row admin-head'><div>Select</div><div>S. No.</div><div>Title</div><div>Description</div><div>Order</div><div>Status</div><div>Action</div></div>
    <div id='terms-row-1' className='admin-row'><div><input type='checkbox' /></div><div>1</div><div>Website Terms</div><div>Terms and conditions for customers.</div><div>1</div><div className='active'>Active</div><div><FaPenToSquare /></div></div>
  </div></div>
}
