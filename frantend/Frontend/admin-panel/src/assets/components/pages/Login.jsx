import axios from 'axios'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'
import { FaEnvelope, FaLock, FaShieldHalved, FaTruckFast, FaAward } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router'
import { getToken } from '../../../slice/adminSlice'
import { useDispatch } from 'react-redux'
import JgbLogo from '../common/JgbLogo'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const apiBaseUrl = import.meta.env.VITE_APIBASEPATH || 'http://localhost:8000/admin/'

  const handleLogin = (e) => {
    e.preventDefault()
    const obj = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

    axios.post(`${apiBaseUrl}adminauth/login`, obj)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          dispatch(getToken({ token: finalRes.token, data: finalRes.data }))
          navigate('/dashboard')
        } else {
          iziToast.error({
            title: 'Login failed',
            message: finalRes.message || 'Invalid admin credentials',
            position: 'topRight',
          })
        }
      })
      .catch((err) => {
        console.error(err)
        iziToast.error({
          title: 'Server error',
          message: 'Server connection error. Please ensure backend is running on port 8000.',
          position: 'topRight',
        })
      })
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-slate-900 p-4 sm:p-6 lg:p-8 relative overflow-hidden'>
      {/* Background ambient lighting */}
      <div className='absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl'></div>
      <div className='absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-orange-600/15 blur-3xl'></div>

      <section className='relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-950/80 shadow-2xl backdrop-blur-xl md:grid-cols-2'>
        {/* Left Branding Showcase */}
        <div className='relative flex flex-col justify-between bg-gradient-to-br from-[#0B1528] via-[#122B55] to-[#1E40AF] p-8 text-white sm:p-10'>
          <div>
            <JgbLogo variant='light' className='mb-8' />
            <span className='inline-block rounded-full bg-orange-500/20 border border-orange-400/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-300 mb-3'>
              Enterprise Admin Portal
            </span>
            <h1 className='text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug'>
              Industrial Mineral Powders &amp; Desiccants
            </h1>
            <p className='mt-3 text-xs sm:text-sm text-blue-100/80 leading-relaxed'>
              Secure administrative access for managing product inventory, calcium carbonate formulations, mesh classifications, and customer orders.
            </p>
          </div>

          <div className='mt-8 space-y-3 border-t border-white/10 pt-6'>
            <div className='flex items-center gap-3 text-xs font-semibold text-blue-100'>
              <FaShieldHalved className='text-orange-400 text-sm' />
              <span>99.8% Pure Active Chemical Formulations</span>
            </div>
            <div className='flex items-center gap-3 text-xs font-semibold text-blue-100'>
              <FaAward className='text-orange-400 text-sm' />
              <span>Certified Industrial Quality Standard</span>
            </div>
            <div className='flex items-center gap-3 text-xs font-semibold text-blue-100'>
              <FaTruckFast className='text-orange-400 text-sm' />
              <span>Pan-India Supply &amp; Global Export Logistics</span>
            </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className='flex flex-col justify-center bg-white p-8 sm:p-10'>
          <div className='mb-6'>
            <h2 className='text-2xl font-black text-slate-900 tracking-tight'>Admin Sign In</h2>
            <p className='mt-1 text-xs text-slate-500'>
              Enter your authorized credentials to access portal
            </p>
          </div>

          <form onSubmit={handleLogin} className='grid gap-4'>
            <div>
              <label htmlFor='login-email' className='mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider'>
                Email Address
              </label>
              <div className='flex items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 transition focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100'>
                <FaEnvelope className='shrink-0 text-slate-400 text-sm' />
                <input
                  id='login-email'
                  name='email'
                  type='email'
                  placeholder='Enter admin email'
                  className='w-full border-0 px-3 py-3 text-xs font-medium text-slate-800 outline-none bg-transparent'
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor='login-password' className='mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider'>
                Password
              </label>
              <div className='flex items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 transition focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100'>
                <FaLock className='shrink-0 text-slate-400 text-sm' />
                <input
                  id='login-password'
                  name='password'
                  type='password'
                  placeholder='Enter password'
                  className='w-full border-0 px-3 py-3 text-xs font-medium text-slate-800 outline-none bg-transparent'
                  required
                />
              </div>
            </div>

            <div className='flex items-center justify-between text-xs'>
              <label htmlFor='remember-me' className='flex items-center gap-2 text-slate-600 font-medium cursor-pointer'>
                <input id='remember-me' name='remember' type='checkbox' defaultChecked className='h-4 w-4 rounded accent-blue-600' />
                Remember session
              </label>
              <Link to='/forgot-password' className='font-bold text-blue-600 hover:text-blue-800'>
                Forgot password?
              </Link>
            </div>

            <button
              type='submit'
              className='mt-2 cursor-pointer rounded-xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-800/30 transition hover:from-blue-800 hover:to-indigo-950 focus:ring-2 focus:ring-blue-300'
            >
              Sign In to JGB Admin
            </button>
          </form>

          <p className='mt-8 text-center text-[11px] text-slate-400'>
            © {new Date().getFullYear()} JGB Trading Private Limited. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  )
}
