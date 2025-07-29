import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { usePharmacistProfile, usePharmacyDetails } from '@/hooks/pharmacist'
import { useGetPharmacistPaymentsQuery } from '@/hooks/payment'
import { FaClipboardList, FaUsers, FaPills, FaCog, FaShoppingCart } from 'react-icons/fa'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/pharmarcist/')({
  component: PharmacistDashboard,
})

function PharmacistDashboard() {
  const queryClient = useQueryClient()
  const { data: pharmacistProfile, isLoading: profileLoading, refetch: refetchProfile, error: profileError } = usePharmacistProfile()
  const { data: pharmacyDetails, isLoading: pharmacyLoading, refetch: refetchPharmacy, error: pharmacyError } = usePharmacyDetails()
  
  // Fetch payments data
  const { data: paymentsData, isLoading: paymentsLoading } = useGetPharmacistPaymentsQuery()
  
  // Get pharmacy ID from pharmacy details
  const pharmacyId = pharmacyDetails?.id || pharmacyDetails?.pharmacyId || pharmacyDetails?.data?.id || pharmacyDetails?.data?.pharmacyId
  
  // Process payments data
  const payments = Array.isArray(paymentsData) ? paymentsData : []
  
  // Calculate payment statistics
  const totalPayments = payments.length
  const completedPayments = payments.filter((payment: any) => payment.status === 'completed').length
  const pendingPayments = payments.filter((payment: any) => payment.status === 'pending').length
  const totalRevenue = payments
    .filter((payment: any) => payment.status === 'completed')
    .reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0)
  
  // // Debug logging
  // console.log('Pharmacist Dashboard Debug:', {
  //   pharmacistProfile: pharmacistProfile ? 'Loaded' : 'null',
  //   pharmacyDetails: pharmacyDetails ? 'Loaded' : 'null',
  //   pharmacyId,
  //   profileLoading,
  //   pharmacyLoading,
  //   profileError: profileError ? profileError.message : 'null',
  //   pharmacyError: pharmacyError ? pharmacyError.message : 'null',
  //   paymentsCount: payments.length,
  //   totalRevenue
  // })

  // Additional debugging for pharmacy ID extraction
  console.log('Pharmacy ID Debug:', {
    'pharmacyDetails?.id': pharmacyDetails?.id,
    'Final pharmacyId': pharmacyId,
  })

  const quickActions = [
    {
      title: 'Manage Orders',
      description: 'View and process pharmacy orders',
      icon: FaClipboardList,
      link: '/Dashboard/pharmarcist/pharmacy_orders',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Patient Records',
      description: 'Access patient information and history',
      icon: FaUsers,
      link: '/Dashboard/pharmarcist/patients',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Medicines',
      description: 'Manage medicine inventory',
      icon: FaPills,
      link: '/Dashboard/pharmarcist/medicines',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Payments',
      description: `Track payment transactions (${totalPayments} total)`,
      icon: FaShoppingCart,
      link: '/Dashboard/pharmarcist/payments',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Settings',
      description: 'Update pharmacy settings',
      icon: FaCog,
      link: '/Dashboard/pharmarcist/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ]

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

  // Show errors if any
  if (profileError || pharmacyError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-4">Error Loading Dashboard</h2>
            {profileError && (
              <div className="mb-4">
                <p className="text-red-700 font-medium">Pharmacist Profile Error:</p>
                <p className="text-red-600 text-sm">{profileError.message}</p>
              </div>
            )}
            {pharmacyError && (
              <div className="mb-4">
                <p className="text-red-700 font-medium">Pharmacy Details Error:</p>
                <p className="text-red-600 text-sm">{pharmacyError.message}</p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
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
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, Pharmacist!</h1>
            <p className="text-green-100">
              {pharmacyDetails?.name ? `Managing ${pharmacyDetails.name}` : 'Manage your pharmacy operations'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
    </DashboardLayout>
  )
} 