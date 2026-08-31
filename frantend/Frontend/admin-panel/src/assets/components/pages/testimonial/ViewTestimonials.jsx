import { FaFilter, FaPenToSquare } from 'react-icons/fa6'

export default function ViewTestimonials() {
  return (
    <section className='w-full'>
      <nav className='flex border-b bg-white px-6 py-3 shadow-sm'>
        <ol className='inline-flex items-center space-x-2 text-gray-600'>
          <li><a className='text-md font-medium hover:text-indigo-600'>Home</a></li>
          <li>/</li>
          <li><a className='text-md font-medium hover:text-indigo-600'>Testimonial</a></li>
          <li>/</li>
          <li className='text-md font-medium text-gray-900'>View Testimonial</li>
        </ol>
      </nav>

      <div className='p-4'>
        <div id='testimonial-filter' className='hidden py-4 relative px-6 my-3 rounded-lg border border-slate-200 w-full bg-white shadow-sm'>
          <p className='font-semibold py-2 text-[20px]'>Filter</p>
          <div className='flex items-end gap-6'>
            <div className='mb-5'>
              <label className='block mb-2 font-medium text-gray-700'>Name</label>
              <input type='text' placeholder='Enter Name' className='text-[17px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 block w-full py-2.5 px-3' />
            </div>
            <button className='text-white bg-slate-500 hover:bg-slate-600 px-6 py-2.5 rounded-lg transition-all mb-5'>Clear</button>
            <button className='text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-lg shadow-sm transition-all mb-5'>Apply</button>
          </div>
        </div>

        <div className='bg-slate-100 flex justify-between items-center py-3 px-4 rounded-t-md border border-slate-300'>
          <div className='text-[26px] font-semibold'>View Testimonial</div>
          <div className='flex gap-3 items-center'>
            <button type='button' className='flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm border border-slate-300 transition-all'><FaFilter /> Filter</button>
            <button className='text-white disabled:bg-slate-400 bg-indigo-600 hover:bg-indigo-700 text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all'>Delete All</button>
            <button className='text-white disabled:bg-slate-400 bg-indigo-600 hover:bg-indigo-700 text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all'>Change Status</button>
          </div>
        </div>

        <div className='border border-t-0 rounded-b-md border-slate-300 overflow-x-auto'>
          <table className='min-w-[900px] w-full text-center text-gray-700'>
            <thead className='text-sm uppercase bg-gray-50 border-b'><tr>
              <th className='px-2 py-3 font-semibold flex items-center justify-center gap-2'><input type='checkbox' className='w-4 h-4 cursor-pointer' />Select</th>
              <th className='px-2 py-3 font-semibold'>S. No.</th>
              <th className='px-2 py-3 font-semibold'>Name</th>
              <th className='px-2 py-3 font-semibold'>Role</th>
              <th className='px-2 py-3 font-semibold'>Rating</th>
              <th className='px-2 py-3 font-semibold'>Order</th>
              <th className='px-2 py-3 font-semibold'>Status</th>
              <th className='px-2 py-3 font-semibold'>Action</th>
            </tr></thead><tbody>
            <tr className='bg-white border-b'>
              <td className='px-2 py-4'><input type='checkbox' className='testimonial-row-check w-4 h-4 cursor-pointer' /></td>
              <td className='px-2 py-4'>1</td>
              <td className='px-2 py-4'>Anjali Sharma</td>
              <td className='px-2 py-4'>Interior Designer</td>
              <td className='px-2 py-4'>5</td>
              <td className='px-2 py-4'>1</td>
              <td className='px-2 py-4 font-semibold text-green-600'>Active</td>
              <td className='px-2 py-4'><FaPenToSquare className='text-[gold] text-xl' /></td>
            </tr>
            <tr className='bg-white border-b'>
              <td className='px-2 py-4'><input type='checkbox' className='testimonial-row-check w-4 h-4 cursor-pointer' /></td>
              <td className='px-2 py-4'>2</td>
              <td className='px-2 py-4'>Rahul Mehta</td>
              <td className='px-2 py-4'>Store Owner</td>
              <td className='px-2 py-4'>4.8</td>
              <td className='px-2 py-4'>2</td>
              <td className='px-2 py-4 font-semibold text-red-600 font-bold'>Inactive</td>
              <td className='px-2 py-4'><FaPenToSquare className='text-[gold] text-xl' /></td>
            </tr>
            <tr className='bg-white border-b'>
              <td className='px-2 py-4'><input type='checkbox' className='testimonial-row-check w-4 h-4 cursor-pointer' /></td>
              <td className='px-2 py-4'>3</td>
              <td className='px-2 py-4'>Priya Jain</td>
              <td className='px-2 py-4'>Customer</td>
              <td className='px-2 py-4'>5</td>
              <td className='px-2 py-4'>3</td>
              <td className='px-2 py-4 font-semibold text-green-600'>Active</td>
              <td className='px-2 py-4'><FaPenToSquare className='text-[gold] text-xl' /></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
