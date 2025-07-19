import {
  FiUsers,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiPieChart,
  FiActivity,
  FiUser,
  FiShoppingCart,
  FiPieChart as FiPieChartAlt,
} from 'react-icons/fi'
import { FaUserMd, FaPills } from 'react-icons/fa'
import { Link } from '@tanstack/react-router'

const AdminDashboard = () => {
  // Route cards configuration
  const routeCards = [
    {
      title: 'Patients',
      icon: <FiUsers className="h-8 w-8" />,
      color: 'bg-blue-100 text-blue-600',
      route: '/dashboard/admin/patients',
      description: 'Manage patient records and information',
    },
    {
      title: 'Doctors',
      icon: <FaUserMd className="h-8 w-8" />,
      color: 'bg-teal-100 text-teal-600',
      route: '/dashboard/admin/doctors',
      description: 'View and manage medical staff',
    },
    {
      title: 'Appointments',
      icon: <FiCalendar className="h-8 w-8" />,
      color: 'bg-green-100 text-green-600',
      route: '/dashboard/admin/appointments',
      description: 'Schedule and track appointments',
    },
    {
      title: 'Prescriptions',
      icon: <FiFileText className="h-8 w-8" />,
      color: 'bg-purple-100 text-purple-600',
      route: '/dashboard/admin/prescriptions',
      description: 'Create and manage prescriptions',
    },
    {
      title: 'Pharmacy Orders',
      icon: <FiShoppingCart className="h-8 w-8" />,
      color: 'bg-yellow-100 text-yellow-600',
      route: '/dashboard/admin/pharmacy_orders',
      description: 'Process medication orders',
    },
    {
      title: 'Payments',
      icon: <FiDollarSign className="h-8 w-8" />,
      color: 'bg-indigo-100 text-indigo-600',
      route: '/dashboard/admin/payments',
      description: 'View payment records',
    },
    {
      title: 'Medicines',
      icon: <FaPills className="h-8 w-8" />,
      color: 'bg-pink-100 text-pink-600',
      route: '/dashboard/admin/medicines',
      description: 'Manage medicine inventory',
    },
    {
      title: 'Records',
      icon: <FiActivity className="h-8 w-8" />,
      color: 'bg-orange-100 text-orange-600',
      route: '/dashboard/admin/records',
      description: 'Access medical records',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Admin😀!
        </h1>
        <p className="text-gray-600">
          Manage your healthcare system efficiently
        </p>
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {routeCards.map((card) => (
          <Link
            key={card.title}
            to={card.route}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center hover:transform hover:-translate-y-1"
          >
            <div className={`p-4 rounded-full ${card.color} mb-4`}>
              {card.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {card.title}
            </h3>
            <p className="text-gray-500 text-sm">{card.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Stats (Optional) */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600 mb-1">Total Patients</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600 mb-1">Today's Appointments</p>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-600 mb-1">
              Pending Prescriptions
            </p>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-sm text-yellow-600 mb-1">Pharmacy Orders</p>
            <p className="text-2xl font-bold">7</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
