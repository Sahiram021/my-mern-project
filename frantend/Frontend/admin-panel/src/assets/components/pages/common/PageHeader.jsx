import { NavLink } from 'react-router'

export default function PageHeader({ current }) {
  return (
    <header className='w-full border-b border-slate-950 bg-white px-4 py-4 sm:px-8'>
      <div className='flex items-center gap-4 text-xl font-semibold'>
        <NavLink to='/dashboard' className='text-slate-900 hover:text-indigo-600'>
          Home
        </NavLink>
        <span className='text-slate-400'>/</span>
        <span className='text-slate-900'>{current}</span>
      </div>
    </header>
  )
}
