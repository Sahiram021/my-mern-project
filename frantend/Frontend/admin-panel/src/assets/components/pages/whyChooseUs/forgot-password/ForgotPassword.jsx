import axios from 'axios'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'
import { useState } from 'react'
import { FaEnvelope } from 'react-icons/fa6'
import { Link } from 'react-router'

export default function ForgotPassword() {
  const apiBaseUrl = import.meta.env.VITE_APIBASEPATH
  const [loading, setLoading] = useState(false)

  const forgotPasswordCheck = (event) => {
    event.preventDefault()
    setLoading(true)

    const obj = {
      email: event.target.email.value,
    }

    axios.post(`${apiBaseUrl}adminauth/forgotpassword`, obj)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes.status) {
          iziToast.success({
            title: 'OK',
            message: finalRes.message,
            position: 'topRight',
          })
          event.target.reset()
        } else {
          iziToast.error({
            title: 'Error',
            message: finalRes.message,
            position: 'topRight',
          })
        }
      })
      .catch((error) => {
        iziToast.error({
          title: 'Error',
          message: error.response?.data?.message || 'Something went wrong. Please try again.',
          position: 'topRight',
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8'>
      <section className='grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2'>
        <div className='flex min-h-[420px] flex-col justify-center bg-gradient-to-br from-blue-700 to-indigo-900 p-8 text-white sm:p-10 md:min-h-[520px]'>
          <img src='https://www.wscubetech.com/images/ws-cube-white-logo.svg' alt='WsCube Tech' className='mb-8 w-48 sm:w-52' />
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-blue-100'>Admin Panel</p>
          <h1 className='mt-4 text-3xl font-bold sm:text-4xl'>Forgot Password?</h1>
          <p className='mt-4 text-base leading-7 text-blue-100 sm:text-lg'>
            Enter your registered admin email address and we will send password reset details.
          </p>
        </div>

        <div className='flex min-h-[520px] flex-col justify-center p-8 sm:p-10'>
          <h2 className='text-3xl font-bold text-slate-900'>Reset Access</h2>
          <p className='mb-8 mt-2 text-slate-500'>Recover your admin account password</p>

          <form onSubmit={forgotPasswordCheck} className='grid gap-5'>
            <div>
              <label htmlFor='forgot-email' className='mb-2 block font-medium text-slate-700'>Email Address</label>
              <div className='flex items-center rounded-lg border border-slate-300 px-3 transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'>
                <FaEnvelope className='shrink-0 text-slate-400' />
                <input
                  id='forgot-email'
                  name='email'
                  type='email'
                  placeholder='Enter email address'
                  className='w-full border-0 px-3 py-3 outline-none'
                  required
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='rounded-lg bg-blue-700 py-3 text-center font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-400'
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className='mt-6 flex flex-wrap items-center justify-between gap-3 text-sm'>
            <Link to='/' className='font-medium text-blue-700 hover:text-blue-800'>Back to Login</Link>
            <Link to='/dashboard' className='text-slate-500 hover:text-slate-700'>Back to Dashboard</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
