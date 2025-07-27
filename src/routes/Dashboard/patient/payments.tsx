import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState, useEffect } from 'react'
import { FaCreditCard, FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa'
import useAuthStore from '@/store/auth'
import { getPatientByUserIdFn } from '@/api/patient/patient'
import { useGetPatientPayments, useCancelPayment } from '@/hooks/patient/payment'

export const Route = createFileRoute('/Dashboard/patient/payments')({
  component: PaymentsPage,
})

interface Payment {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  amount: number
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded'
  type: 'appointment' | 'order'
  paystackReference: string
  createdAt: string
  updatedAt: string
  order?: {
    id: number
    status: string
  }
}

function PaymentsPage() {
  const user = useAuthStore((state) => state.user)
  const [patientId, setPatientId] = useState<number | null>(null)
  
  // Use the patient-specific payment hooks
  const { data: payments = [], isLoading, error } = useGetPatientPayments()
  const { mutate: cancelPayment, isPending: isCancelling } = useCancelPayment()

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        if (user?.user_id) {
          const patient = await getPatientByUserIdFn(Number(user.user_id))
          setPatientId(patient.id)
        }
      } catch (err) {
        console.error('Error fetching patient data:', err)
      }
    }

    fetchPatientData()
  }, [user])

  const handleCancelPayment = (paymentId: string) => {
    if (window.confirm('Are you sure you want to cancel this payment?')) {
      cancelPayment(paymentId)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />
      case 'failed':
        return <FaTimesCircle className="text-red-500" />
      case 'pending':
        return <FaClock className="text-yellow-500" />
      case 'cancelled':
        return <FaExclamationTriangle className="text-gray-500" />
      case 'refunded':
        return <FaMoneyBillWave className="text-blue-500" />
      default:
        return <FaClock className="text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <p className="text-red-700">Failed to load payments. Please try again.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Payments</h1>
          <p className="text-gray-600">View and manage your payment history</p>
        </div>

        {/* Payment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <FaCreditCard className="text-blue-500 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'success').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <FaClock className="text-yellow-500 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-blue-500 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Payment History</h2>
          </div>
          
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <FaCreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No payments found</p>
              <p className="text-gray-400 text-sm">Your payment history will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              {getStatusIcon(payment.status)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {payment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paystackReference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => handleCancelPayment(payment.id)}
                            disabled={isCancelling}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {isCancelling ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 