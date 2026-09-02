import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { FaBuilding, FaChevronDown, FaLock, FaUser, FaGlobe, FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { LogOut, setAdminData } from '../../../../slice/adminSlice'

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/profile': 'Admin Profile',
  '/color/add': 'Add New Powder Color',
  '/color/view': 'Powder Color Variations',
  '/material/add': 'Add Chemical / Mineral Grade',
  '/material/view': 'Chemical & Mineral Materials',
  '/category/add': 'Add Parent Category',
  '/category/view': 'Parent Powder Categories',
  '/sub-category/add': 'Add Sub Category',
  '/sub-category/view': 'Powder Sub Categories',
  '/sub-sub-category/add': 'Add Sub Sub Category',
  '/sub-sub-category/view': 'Mesh & Spec Sub Sub Categories',
  '/product/add': 'Add New Powder Product',
  '/product/view': 'Industrial Powder Product Catalog',
  '/orders/view': 'Customer Orders',
  '/sliders/add': 'Add Hero Banner Slider',
  '/sliders/view': 'Hero Banner Sliders',
  '/faqs/add': 'Add FAQ Item',
  '/faqs/view': 'Frequently Asked Questions',
  '/company-profile': 'JGB Company Profile',
}

const getTitle = (pathname) => {
  if (pageTitles[pathname]) return pageTitles[pathname]

  const cleanPath = pathname.split('/').filter(Boolean)
  if (cleanPath.includes('edit')) return 'Update Record'

  return 'JGB Trading Management'
}

export default function TopHeader() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  const token = useSelector((store) => store.adminStore.admintoken) || Cookies.get('token') || localStorage.getItem('token') || ''
  const adminInfo = useSelector((store) => store.adminStore.adminInfo)
  const adminImage = useSelector((store) => store.adminStore.adminImage)

  const apiBaseUrl = import.meta.env.VITE_APIBASEPATH || 'http://localhost:8000/api/admin/'
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://jgbmtrading.online')

  useEffect(() => {
    if (token) {
      axios
        .get(`${apiBaseUrl}adminauth/get-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.status && finalRes.data) {
            const path = finalRes.imagePath || 'https://jgbmtrading.online/uploads/admin/'
            const fullUrl = finalRes.data.image ? `${path}${finalRes.data.image}` : ''
            dispatch(setAdminData({ data: finalRes.data, imagePath: path, imageUrl: fullUrl }))
            setImgError(false)
          }
        })
        .catch(() => {
          // silently catch
        })
    }
  }, [token, apiBaseUrl, dispatch])

  const adminLogout = () => {
    dispatch(LogOut())
    navigate('/')
  }

  const displayName = adminInfo?.name || 'Admin'
  const displayEmail = adminInfo?.email || 'admin@jgbtrading.com'
  const displayImage = !imgError && adminImage ? adminImage : null

  return (
    <header className='sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md shadow-xs'>
      {/* Left Title & Status */}
      <div className='flex items-center gap-4'>
        <div>
          <div className='flex items-center gap-2.5'>
            <h1 className='text-xl font-black text-slate-900 tracking-tight'>{getTitle(location.pathname)}</h1>
            <span className='hidden rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 ring-1 ring-blue-700/10 sm:inline-block'>
              JGB Admin Portal
            </span>
          </div>
          <p className='text-xs text-slate-500 font-medium'>
            Industrial Anti-Moisture &amp; Mineral Powder Management
          </p>
        </div>
      </div>

      {/* Right User Bar & Quick Links */}
      <div className='flex items-center gap-4'>
        {/* Quick Website View Link */}
        <a
          href={websiteUrl}
          target='_blank'
          rel='noreferrer'
          className='hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 sm:flex shadow-2xs'
        >
          <FaGlobe className='text-blue-600' />
          <span>Live Store</span>
          <FaArrowUpRightFromSquare className='text-[10px] text-slate-400' />
        </a>

        {/* Server Indicator Badge */}
        <div className='hidden items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/10 md:flex'>
          <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse'></span>
          <span>System Online</span>
        </div>

        {/* Admin Profile Dropdown */}
        <div className='group relative flex items-center'>
          <button
            type='button'
            className='flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-1.5 pr-3 transition hover:border-slate-300 hover:bg-slate-100'
          >
            <div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-600/20'>
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={displayName}
                  className='h-full w-full object-cover'
                  onError={() => setImgError(true)}
                />
              ) : (
                <FaUser />
              )}
            </div>
            <div className='hidden text-left sm:block'>
              <span className='block text-xs font-bold text-slate-800 leading-tight max-w-[120px] truncate'>{displayName}</span>
              <span className='block text-[10px] font-medium text-slate-500'>Super User</span>
            </div>
            <FaChevronDown className='text-xs text-slate-400 transition-transform group-hover:rotate-180' />
          </button>

          <div className='invisible absolute right-0 top-[60px] w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100'>
            <div className='flex items-center gap-3 border-b border-slate-100 px-3 py-2.5 mb-1 bg-slate-50/50 rounded-xl'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-600 text-xs font-bold text-white'>
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <FaUser />
                )}
              </div>
              <div className='overflow-hidden'>
                <p className='text-xs font-bold text-slate-900 truncate'>{displayName}</p>
                <p className='text-[11px] text-slate-500 font-medium truncate'>{displayEmail}</p>
              </div>
            </div>

            <Link
              to='/profile'
              className='flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700'
            >
              <FaUser className='text-slate-400' />
              <span>Admin Profile</span>
            </Link>

            <Link
              to='/company-profile'
              className='flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700'
            >
              <FaBuilding className='text-slate-400' />
              <span>Company Information</span>
            </Link>

            <div className='my-1 border-t border-slate-100'></div>

            <button
              type='button'
              onClick={adminLogout}
              className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-bold text-red-600 transition hover:bg-red-50'
            >
              <FaLock className='text-red-500' />
              <span>Logout Securely</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
