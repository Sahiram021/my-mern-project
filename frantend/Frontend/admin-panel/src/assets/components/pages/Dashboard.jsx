import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import {
  FaBagShopping,
  FaBoxesStacked,
  FaFlask,
  FaLayerGroup,
  FaPlus,
  FaSitemap,
  FaSliders,
  FaArrowRight,
  FaCircleCheck,
  FaShieldHalved,
  FaEye
} from 'react-icons/fa6'
import PageHeader from './common/PageHeader'

export default function Dashboard() {
  const apiBaseUrl = import.meta.env.VITE_APIBASEPATH || 'http://localhost:8000/admin/'
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    subCategories: 0,
    subSubCategories: 0,
    materials: 0,
    colors: 0,
    sliders: 0,
    orders: 0,
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          prodRes,
          catRes,
          subCatRes,
          subSubCatRes,
          matRes,
          colorRes,
          sliderRes,
          orderRes
        ] = await Promise.allSettled([
          axios.get(`${apiBaseUrl}product/view`),
          axios.get(`${apiBaseUrl}category/view`),
          axios.get(`${apiBaseUrl}subcategory/view`),
          axios.get(`${apiBaseUrl}subsubcategory/view`),
          axios.get(`${apiBaseUrl}material/view`),
          axios.get(`${apiBaseUrl}color/view`),
          axios.get(`${apiBaseUrl}slider/view`),
          axios.get(`${apiBaseUrl}orders/view`),
        ])

        const prodData = prodRes.status === 'fulfilled' ? prodRes.value.data?.data || [] : []
        const catData = catRes.status === 'fulfilled' ? catRes.value.data?.data || [] : []
        const subCatData = subCatRes.status === 'fulfilled' ? subCatRes.value.data?.data || [] : []
        const subSubCatData = subSubCatRes.status === 'fulfilled' ? subSubCatRes.value.data?.data || [] : []
        const matData = matRes.status === 'fulfilled' ? matRes.value.data?.data || [] : []
        const colorData = colorRes.status === 'fulfilled' ? colorRes.value.data?.data || [] : []
        const sliderData = sliderRes.status === 'fulfilled' ? sliderRes.value.data?.data || [] : []
        const orderData = orderRes.status === 'fulfilled' ? orderRes.value.data?.data || [] : []

        setStats({
          products: prodData.length,
          categories: catData.length,
          subCategories: subCatData.length,
          subSubCategories: subSubCatData.length,
          materials: matData.length,
          colors: colorData.length,
          sliders: sliderData.length,
          orders: orderData.length,
        })

        setRecentProducts(prodData.slice(0, 6))
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [apiBaseUrl])

  return (
    <div className='min-h-screen bg-slate-50/60 pb-16'>
      <PageHeader current='Dashboard' />

      <div className='mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8'>
        {/* Welcome Banner for JGB Trading */}
        <div className='relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1528] via-[#122B55] to-[#1E40AF] p-8 text-white shadow-2xl shadow-blue-950/20'>
          {/* Subtle background decorative shapes */}
          <div className='absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl'></div>
          <div className='absolute -bottom-10 right-40 h-48 w-48 rounded-full bg-orange-500/10 blur-2xl'></div>

          <div className='relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
            <div className='max-w-2xl'>
              <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-200 backdrop-blur-sm'>
                <span className='h-2 w-2 rounded-full bg-orange-400 animate-ping'></span>
                <span>JGB Trading Private Limited</span>
              </div>
              <h2 className='text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-white'>
                Industrial Powder &amp; Minerals Control Portal
              </h2>
              <p className='mt-2.5 text-sm text-blue-100/90 leading-relaxed'>
                Centralized dashboard to manage Anti-Moisture Powders, Calcium Carbonate (CaCO3), Micronized Talc, Dolomite, and Masterbatch polymer additives.
              </p>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <Link
                to='/product/add'
                className='inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-amber-600'
              >
                <FaPlus />
                <span>Add New Powder</span>
              </Link>
              <Link
                to='/product/view'
                className='inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20'
              >
                <span>View Full Catalog</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* 6 High-Impact Metric Cards */}
        <div className='mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
          {/* Card 1: Products */}
          <Link
            to='/product/view'
            className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300'
          >
            <div className='flex items-center justify-between'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>Products</span>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white'>
                <FaBagShopping className='text-base' />
              </div>
            </div>
            <div className='mt-4'>
              <span className='text-3xl font-black text-slate-900'>
                {loading ? '...' : stats.products}
              </span>
              <p className='mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-1'>
                <FaCircleCheck className='text-[10px]' /> Ready in Catalog
              </p>
            </div>
          </Link>

          {/* Card 2: Parent Categories */}
          <Link
            to='/category/view'
            className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-sky-300'
          >
            <div className='flex items-center justify-between'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>Categories</span>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white'>
                <FaLayerGroup className='text-base' />
              </div>
            </div>
            <div className='mt-4'>
              <span className='text-3xl font-black text-slate-900'>
                {loading ? '...' : stats.categories}
              </span>
              <p className='mt-1 text-[11px] font-semibold text-slate-500'>
                Parent Segments
              </p>
            </div>
          </Link>

          {/* Card 3: Sub Categories */}
          <Link
            to='/sub-category/view'
            className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300'
          >
            <div className='flex items-center justify-between'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>Sub Categories</span>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white'>
                <FaSitemap className='text-base' />
              </div>
            </div>
            <div className='mt-4'>
              <span className='text-3xl font-black text-slate-900'>
                {loading ? '...' : stats.subCategories}
              </span>
              <p className='mt-1 text-[11px] font-semibold text-slate-500'>
                Application Grades
              </p>
            </div>
          </Link>

          {/* Card 4: Sub-Sub Categories */}
          <Link
            to='/sub-sub-category/view'
            className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-300'
          >
            <div className='flex items-center justify-between'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>Mesh Sizing</span>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-600 group-hover:text-white'>
                <FaBoxesStacked className='text-base' />
              </div>
            </div>
            <div className='mt-4'>
              <span className='text-3xl font-black text-slate-900'>
                {loading ? '...' : stats.subSubCategories}
              </span>
              <p className='mt-1 text-[11px] font-semibold text-slate-500'>
                Micron Specs (D97)
              </p>
            </div>
          </Link>

          {/* Card 5: Materials / Chemical Grades */}
          <Link
            to='/material/view'
            className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-amber-300'
          >
            <div className='flex items-center justify-between'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>Materials</span>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-600 group-hover:text-white'>
                <FaFlask className='text-base' />
              </div>
            </div>
            <div className='mt-4'>
              <span className='text-3xl font-black text-slate-900'>
                {loading ? '...' : stats.materials}
              </span>
              <p className='mt-1 text-[11px] font-semibold text-slate-500'>
                Chemical Compounds
              </p>
            </div>
          </Link>

          {/* Card 6: Hero Sliders */}
          <Link
            to='/sliders/view'
            className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-purple-300'
          >
            <div className='flex items-center justify-between'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>Sliders</span>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white'>
                <FaSliders className='text-base' />
              </div>
            </div>
            <div className='mt-4'>
              <span className='text-3xl font-black text-slate-900'>
                {loading ? '...' : stats.sliders}
              </span>
              <p className='mt-1 text-[11px] font-semibold text-slate-500'>
                Active Web Banners
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Actions & Industry Value Points */}
        <div className='mb-10 grid gap-6 lg:grid-cols-3'>
          {/* Quick Management Shortcuts */}
          <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-xs'>
            <h3 className='text-base font-extrabold text-slate-900'>Quick Actions</h3>
            <p className='mt-1 text-xs text-slate-500'>Fast shortcuts to manage powder catalog</p>

            <div className='mt-5 flex flex-col gap-2.5'>
              <Link
                to='/product/add'
                className='flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700'
              >
                <span className='flex items-center gap-2.5'>
                  <FaPlus className='text-blue-600' /> Add Powder Product
                </span>
                <FaArrowRight className='text-[10px] text-slate-400' />
              </Link>
              <Link
                to='/category/add'
                className='flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700'
              >
                <span className='flex items-center gap-2.5'>
                  <FaPlus className='text-sky-600' /> Add Parent Category
                </span>
                <FaArrowRight className='text-[10px] text-slate-400' />
              </Link>
              <Link
                to='/material/add'
                className='flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-amber-50 hover:text-amber-700'
              >
                <span className='flex items-center gap-2.5'>
                  <FaPlus className='text-amber-600' /> Add Material / Grade
                </span>
                <FaArrowRight className='text-[10px] text-slate-400' />
              </Link>
              <Link
                to='/sliders/add'
                className='flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-purple-50 hover:text-purple-700'
              >
                <span className='flex items-center gap-2.5'>
                  <FaPlus className='text-purple-600' /> Add Hero Slider Banner
                </span>
                <FaArrowRight className='text-[10px] text-slate-400' />
              </Link>
            </div>
          </div>

          {/* JGB Manufacturing Specifications Banner */}
          <div className='rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-900 to-slate-900 p-6 text-white shadow-xs lg:col-span-2 flex flex-col justify-between'>
            <div>
              <div className='flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest'>
                <FaShieldHalved /> Quality Guaranteed
              </div>
              <h3 className='mt-2 text-xl font-extrabold text-white'>
                JGB Trading Powder Specifications &amp; Standards
              </h3>
              <p className='mt-2 text-xs text-slate-300 leading-relaxed'>
                Direct manufacturer processing with high whiteness calcite (&gt;97%), moisture absorption capacity (&gt;25% weight ratio), and precision micronization from 300 Mesh to 3000 Mesh with food-grade stearic acid surface coating.
              </p>
            </div>

            <div className='mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-4'>
              <div className='rounded-xl bg-white/5 p-3 text-center'>
                <span className='block text-lg font-black text-white'>99.8%</span>
                <span className='text-[10px] font-bold text-slate-300 uppercase'>Active Purity</span>
              </div>
              <div className='rounded-xl bg-white/5 p-3 text-center'>
                <span className='block text-lg font-black text-white'>25 KG</span>
                <span className='text-[10px] font-bold text-slate-300 uppercase'>Moisture Lock</span>
              </div>
              <div className='rounded-xl bg-white/5 p-3 text-center'>
                <span className='block text-lg font-black text-white'>3000#</span>
                <span className='text-[10px] font-bold text-slate-300 uppercase'>Nano Mesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured / Recent Powder Products Preview Table */}
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs'>
          <div className='flex items-center justify-between border-b border-slate-200 px-6 py-4'>
            <div>
              <h3 className='text-base font-extrabold text-slate-900'>Live Powder Products Catalog</h3>
              <p className='text-xs text-slate-500'>Latest added industrial chemical powders</p>
            </div>
            <Link
              to='/product/view'
              className='inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700'
            >
              <span>View All ({stats.products})</span>
              <FaEye />
            </Link>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='bg-slate-50/80 uppercase text-[10px] font-bold tracking-wider text-slate-500 border-b border-slate-100'>
                <tr>
                  <th className='py-3.5 px-6'>#</th>
                  <th className='py-3.5 px-6'>Product Name</th>
                  <th className='py-3.5 px-6'>Category</th>
                  <th className='py-3.5 px-6'>Price (₹ / 25KG)</th>
                  <th className='py-3.5 px-6'>Type</th>
                  <th className='py-3.5 px-6'>Status</th>
                  <th className='py-3.5 px-6 text-right'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 font-medium text-slate-700'>
                {recentProducts.length > 0 ? (
                  recentProducts.map((prod, idx) => (
                    <tr key={prod._id || idx} className='hover:bg-slate-50/50 transition'>
                      <td className='py-4 px-6 text-slate-400 font-bold'>{idx + 1}</td>
                      <td className='py-4 px-6'>
                        <span className='font-bold text-slate-900 block'>{prod.name}</span>
                        <span className='text-[10px] text-slate-400 line-clamp-1'>
                          {prod.sortDescription || 'Industrial Grade 25 KG Bag'}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <span className='rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700'>
                          {prod.parentCategory?.name || 'Industrial Powders'}
                        </span>
                      </td>
                      <td className='py-4 px-6 font-bold text-slate-900'>
                        ₹{prod.price ? Number(prod.price).toLocaleString('en-IN') : '1,450'}
                      </td>
                      <td className='py-4 px-6'>
                        <span className='rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 border border-amber-200/60'>
                          {prod.productType || 'Featured'}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60'>
                          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500'></span>
                          Active
                        </span>
                      </td>
                      <td className='py-4 px-6 text-right'>
                        <Link
                          to={`/product/edit/${prod._id}`}
                          className='inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition hover:bg-blue-600 hover:text-white'
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className='py-8 text-center text-slate-400'>
                      No products found. Run seeder to populate.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
