import Sidebar from './Sidebar'
import { Outlet } from 'react-router'
import TopHeader from './TopHeader'

export default function Layout() {
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
