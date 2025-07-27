import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useGetPharmacistPaymentsQuery } from '@/hooks/payment'
import { FaClipboardList, FaDollarSign, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa'

export const Route = createFileRoute('/Dashboard/pharmarcist/payments')({
  component: PharmacistPaymentsPage,
})

function PharmacistPaymentsPage() {
  const { data: paymentsData, isLoading, isError } = useGetPharmacistPaymentsQuery()
  
  // Process payments data
  const payments = Array.isArray(paymentsData) ? paymentsData : []
  
  // Calculate statistics
  const totalPayments = payments.length
  const completedPayments = payments.filter((payment: any) => payment.status === 'completed').length
  const pendingPayments = payments.filter((payment: any) => payment.status === 'pending').length
  const failedPayments = payments.filter((payment: any) => payment.status === 'failed').length
  const totalRevenue = payments
    .filter((payment: any) => payment.status === 'completed')
    .reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <FaCheckCircle className="text-green-600" />
      case 'pending':
        return <FaClock className="text-yellow-600" />
      case 'failed':
        return <FaTimes className="text-red-600" />
      default:
        return <FaClipboardList className="text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payments...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-4">Error Loading Payments</h2>
          <p className="text-red-600">Failed to load payment data. Please try again later.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="mt-2 text-gray-600">
              View and manage all payment transactions for your pharmacy.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaClipboardList className="text-blue-600" size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPayments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaCheckCircle className="text-green-600" size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedPayments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaClock className="text-yellow-600" size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaTimes className="text-red-600" size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-gray-900">{failedPayments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaDollarSign className="text-purple-600" size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Payment Transactions</h2>
            </div>
            
            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{payment.payment_id || payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.user?.firstName && payment.user?.lastName 
                            ? `${payment.user.firstName} ${payment.user.lastName}`
                            : `Patient ${payment.patient_id || payment.userId}`
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.payment_method || payment.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(payment.status)}
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                              {payment.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(payment.created_at || payment.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No payment transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
