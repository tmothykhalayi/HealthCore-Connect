import { Suspense } from 'react'
import { Outlet } from '@tanstack/react-router'

import ScrollToTop from '../utils/ScrollToTop'
import Loading from '../../components/Loading'
import Appointment from '../../components/Appointment'
import Footer from './Footer'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div>
      <ScrollToTop />

      <header>
        <Navbar />
      </header>

      <main className="max-w-[2300px] my-0 mx-auto overflow-x-hidden">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>

        <Appointment />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Layout
