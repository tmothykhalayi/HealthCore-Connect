import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Link } from '@tanstack/react-router'
import { usePharmacistProfile, usePharmacyDetails, usePharmacyOrders } from '@/hooks/pharmacist'
import { FaPills, FaShoppingCart, FaUsers, FaFileMedical, FaMoneyBillWave, FaChartBar } from 'react-icons/fa'

export const Route = createFileRoute('/Dashboard/pharmarcist/')({
  component: PharmacistDashboard,
})

function PharmacistDashboard() {
  const { data: pharmacistProfile, isLoading: profileLoading } = usePharmacistProfile()
  const { data: pharmacyDetails, isLoading: pharmacyLoading } = usePharmacyDetails()
  
  // Get pharmacy ID from pharmacy details
  const pharmacyId = pharmacyDetails?.id || pharmacyDetails?.pharmacyId
  
  const { data: orders, isLoading: ordersLoading } = usePharmacyOrders(pharmacyId)
  
  // Calculate stats
  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0
  const totalRevenue = orders?.filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0

  const dashboardCards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: FaShoppingCart,
      color: 'bg-blue-500',
      link: '/Dashboard/pharmarcist/pharmacy_orders'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: FaPills,
      color: 'bg-yellow-500',
      link: '/Dashboard/pharmarcist/pharmacy_orders'
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: FaFileMedical,
      color: 'bg-green-500',
      link: '/Dashboard/pharmarcist/pharmacy_orders'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: FaMoneyBillWave,
      color: 'bg-purple-500',
      link: '/Dashboard/pharmarcist/payments'
    }
  ]

  const quickActions = [
    {
      title: 'View Orders',
      description: 'Manage pharmacy orders and prescriptions',
      icon: FaShoppingCart,
      link: '/Dashboard/pharmarcist/pharmacy_orders',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Prescriptions',
      description: 'View and process prescriptions',
      icon: FaPills,
      link: '/Dashboard/pharmarcist/prescriptions',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Patients',
      description: 'View patients with orders',
      icon: FaUsers,
      link: '/Dashboard/pharmarcist/patients',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Payments',
      description: 'Track payments and revenue',
      icon: FaMoneyBillWave,
      link: '/Dashboard/pharmarcist/payments',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Records',
      description: 'View pharmacy records and reports',
      icon: FaChartBar,
      link: '/Dashboard/pharmarcist/records',
      color: 'bg-red-500 hover:bg-red-600'
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (profileLoading || pharmacyLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pharmacist dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome, Pharmacist!</h1>
          <p className="text-green-100">
            {pharmacyDetails?.name ? `Managing ${pharmacyDetails.name}` : 'Manage your pharmacy operations'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color} text-white`}>
                  <card.icon size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
              <Link
                to="/Dashboard/pharmarcist/pharmacy_orders"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {ordersLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)} - ${order.totalAmount || 0}
                      </p>
                      <p className="text-sm text-gray-500">
                        Patient ID: {order.patientId}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No orders found</p>
                <p className="text-gray-400 text-sm">Orders will appear here when patients place them</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`${action.color} text-white p-4 rounded-lg hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon size={20} />
                    <div>
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 