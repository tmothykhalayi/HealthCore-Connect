import {
  FiActivity,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiPieChart,
  FiPieChart as FiPieChartAlt,
  FiShoppingCart,
  FiUser,
  FiUsers,
} from 'react-icons/fi'
import { FaPills, FaUserMd } from 'react-icons/fa'
import { Link } from '@tanstack/react-router'
import { useAdminDashboardStats, useRecentActivities, useSystemHealth } from '@/hooks/admin'

const AdminDashboard = () => {
  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminDashboardStats()
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities()
  const { data: systemHealth } = useSystemHealth()

  // Route cards configuration
  const routeCards = [
    {
      title: 'Patients',
      icon: <FiUsers className="h-8 w-8" />,
      color: 'bg-blue-100 text-blue-600',
      route: '/dashboard/admin/patients',
      description: 'Manage patient records and information',
      count: stats?.users?.byRole?.patients || 0,
    },
    {
      title: 'Doctors',
      icon: <FaUserMd className="h-8 w-8" />,
      color: 'bg-teal-100 text-teal-600',
      route: '/dashboard/admin/doctors',
      description: 'View and manage medical staff',
      count: stats?.users?.byRole?.doctors || 0,
    },
    {
      title: 'Appointments',
      icon: <FiCalendar className="h-8 w-8" />,
      color: 'bg-green-100 text-green-600',
      route: '/dashboard/admin/appointments',
      description: 'Schedule and track appointments',
      count: stats?.appointments?.total || 0,
    },
    {
      title: 'Prescriptions',
      icon: <FiFileText className="h-8 w-8" />,
      color: 'bg-purple-100 text-purple-600',
      route: '/dashboard/admin/prescriptions',
      description: 'Create and manage prescriptions',
      count: 0, // TODO: Add prescription count when endpoint is available
    },
    {
      title: 'Pharmacy Orders',
      icon: <FiShoppingCart className="h-8 w-8" />,
      color: 'bg-yellow-100 text-yellow-600',
      route: '/dashboard/admin/pharmacy_orders',
      description: 'Process medication orders',
      count: stats?.orders?.total || 0,
    },
    {
      title: 'Payments',
      icon: <FiDollarSign className="h-8 w-8" />,
      color: 'bg-indigo-100 text-indigo-600',
      route: '/dashboard/admin/payments',
      description: 'View payment records',
      count: stats?.payments?.total || 0,
    },
    {
      title: 'Medicines',
      icon: <FaPills className="h-8 w-8" />,
      color: 'bg-pink-100 text-pink-600',
      route: '/dashboard/admin/medicines',
      description: 'Manage medicine inventory',
      count: stats?.medicines?.total || 0,
    },
    {
      title: 'Records',
      icon: <FiActivity className="h-8 w-8" />,
      color: 'bg-orange-100 text-orange-600',
      route: '/dashboard/admin/records',
      description: 'Access medical records',
      count: 0, // TODO: Add records count when endpoint is available
    },
  ]

  // Loading state
  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Admin
          </h1>
          <p className="text-gray-600">
            Loading dashboard data...
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (statsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Admin
          </h1>
          <p className="text-red-600">
            Error loading dashboard data. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Admin
        </h1>
        <p className="text-gray-600">
          Manage your healthcare system efficiently
        </p>
        {systemHealth && (
          <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            systemHealth.status === 'ok' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              systemHealth.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            System Status: {systemHealth.status === 'ok' ? 'Healthy' : 'Issues Detected'}
          </div>
        )}
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
            <p className="text-gray-500 text-sm mb-3">{card.description}</p>
            <div className="text-2xl font-bold text-gray-800">
              {card.count}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600 mb-1">Total Users</p>
            <p className="text-2xl font-bold">{stats?.users?.total || 0}</p>
            <p className="text-xs text-blue-500">
              {stats?.users?.active || 0} active
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600 mb-1">Today's Appointments</p>
            <p className="text-2xl font-bold">{stats?.appointments?.recent || 0}</p>
            <p className="text-xs text-green-500">
              {stats?.appointments?.completionRate || '0'}% completion
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-600 mb-1">Pending Orders</p>
            <p className="text-2xl font-bold">{stats?.orders?.pending || 0}</p>
            <p className="text-xs text-purple-500">
              {stats?.orders?.total || 0} total orders
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-sm text-yellow-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold">${stats?.payments?.completed || 0}</p>
            <p className="text-xs text-yellow-500">
              {stats?.payments?.total || 0} transactions
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      {activities && (activities.appointments?.length > 0 || activities.orders?.length > 0 || activities.payments?.length > 0) && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activities.appointments?.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Recent Appointments</h3>
                <div className="space-y-2">
                  {activities.appointments.slice(0, 3).map((appointment: any, index: number) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">Appointment #{appointment.id}</p>
                      <p className="text-blue-600">{appointment.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activities.orders?.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Recent Orders</h3>
                <div className="space-y-2">
                  {activities.orders.slice(0, 3).map((order: any, index: number) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-green-600">{order.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activities.payments?.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Recent Payments</h3>
                <div className="space-y-2">
                  {activities.payments.slice(0, 3).map((payment: any, index: number) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">Payment #{payment.id}</p>
                      <p className="text-purple-600">${payment.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
