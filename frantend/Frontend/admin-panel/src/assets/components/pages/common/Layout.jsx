import Sidebar from './Sidebar'
import { Navigate, Outlet } from 'react-router'
import TopHeader from './TopHeader'
import { useSelector } from 'react-redux'

export default function Layout() {
  const token = useSelector((state) => state.adminStore.admintoken)

  if (!token) {
    return <Navigate to='/' replace />
  }

  return (
    <section className='min-h-screen w-full bg-slate-50 lg:grid lg:grid-cols-[290px_minmax(0,1fr)]'>
      <Sidebar />
      <main className='min-w-0 w-full overflow-x-hidden'>
        <TopHeader />
        <Outlet />
      </main>
    </section>
  )
}
