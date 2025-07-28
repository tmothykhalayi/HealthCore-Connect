import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useGetPharmacistPaymentsQuery } from '@/hooks/payment'
import { FaClipboardList, FaDollarSign, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa'

export const Route = createFileRoute('/Dashboard/pharmarcist/payments')({
  component: PharmacistPaymentsPage,
})

function PharmacistPaymentsPage() {
  const { data: paymentsData, isLoading, isError, error } = useGetPharmacistPaymentsQuery()
  
  // Debug logging
  console.log('PharmacistPaymentsPage Debug:', {
    paymentsData,
    isLoading,
    isError,
    error: error?.message,
    dataType: typeof paymentsData,
    isArray: Array.isArray(paymentsData),
    dataLength: Array.isArray(paymentsData) ? paymentsData.length : 'not array'
  })
  
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
          <div className="space-y-2">
            <p className="text-red-600 font-medium">Error Details:</p>
            <p className="text-red-600 text-sm">{error?.message || 'Unknown error occurred'}</p>
            {error && (
              <details className="mt-4">
                <summary className="text-red-700 cursor-pointer font-medium">Show Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </details>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="mt-2 text-gray-600">
                View and manage all payment transactions for your pharmacy.
              </p>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Payment Transactions</h2>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
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
                          {(() => {
                            // Try to get patient name from user relation
                            if (payment.user?.firstName && payment.user?.lastName) {
                              return `${payment.user.firstName} ${payment.user.lastName}`;
                            }
                            
                            // Try to get patient name from fullName field
                            if (payment.fullName) {
                              return payment.fullName;
                            }
                            
                            // Try to get patient ID from various fields
                            const patientId = payment.patient_id || payment.userId || payment.user?.id;
                            if (patientId) {
                              return `Patient #${patientId}`;
                            }
                            
                            // Fallback for unknown patient
                            return 'Unknown Patient';
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formatCurrency(payment.amount)}
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
              <div className="text-center py-12">
                <FaClipboardList className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payment transactions found</h3>
                <p className="text-gray-500 mb-4">
                  There are currently no payment transactions in the system.
                </p>
                <div className="text-sm text-gray-400">
                  <p>This could mean:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• No payments have been processed yet</li>
                    <li>• Payments are being processed</li>
                    <li>• There might be a connection issue</li>
                  </ul>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
