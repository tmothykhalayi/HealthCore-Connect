import { lazy } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Layout from './layout/Layout'
import Landing from './Landing'

const About = lazy(() => import('./About'))
const Services = lazy(() => import('./Services'))
const Doctors = lazy(() => import('./Doctors'))
const Doctor = lazy(() => import('./Doctor'))
const Contact = lazy(() => import('./Contact'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/services',
        element: <Services />,
      },
      {
        path: '/doctors',
        element: <Doctors />,
      },
      {
        path: '/doctors/:doctorId',
        element: <Doctor />,
      },

      {
        path: '/contact',
        element: <Contact />,
      },
    ],
  },
])

const Index = () => {
  return <RouterProvider router={router} />
}

export default Index
