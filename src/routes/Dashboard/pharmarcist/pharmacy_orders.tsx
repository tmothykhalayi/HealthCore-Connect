import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState } from 'react'
import { usePharmacistProfile, usePharmacyDetails, useGetAllOrders, useUpdateOrderStatus } from '@/hooks/pharmacist'
import { FaFilter, FaSearch, FaEye, FaCheck, FaTimes, FaClock, FaShoppingCart } from 'react-icons/fa'
import { PharmacyOrdersTable } from '@/components/orders'

interface Order {
  id: number
  patientId: number
  totalAmount: number
  status: string
  createdAt: string
  updatedAt?: string
  items?: Array<{
    medicineName?: string
    quantity: number
    price: number
  }>
}

export const Route = createFileRoute('/Dashboard/pharmarcist/pharmacy_orders')({
  component: PharmacyOrders,
})

function PharmacyOrders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const { data: pharmacistProfile } = usePharmacistProfile()
  const { data: pharmacyDetails } = usePharmacyDetails()
  const pharmacyId = pharmacyDetails?.id || pharmacyDetails?.pharmacyId
  
  const { data: orders, isLoading, error } = useGetAllOrders()
  const updateOrderStatus = useUpdateOrderStatus()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus })
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const filteredOrders = orders?.filter((order: Order) => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
                         order.patientId.toString().includes(searchTerm) ||
                         order.status.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  }) || []

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o: Order) => o.status === 'pending').length || 0,
    processing: orders?.filter((o: Order) => o.status === 'processing').length || 0,
    completed: orders?.filter((o: Order) => o.status === 'completed').length || 0,
    cancelled: orders?.filter((o: Order) => o.status === 'cancelled').length || 0,
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pharmacy orders...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 mb-2">
              <FaTimes className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Orders</h3>
            <p className="text-red-700 text-sm">Failed to load pharmacy orders</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pharmacy Orders</h1>
        <PharmacyOrdersTable />
      </div>
    </DashboardLayout>
  )
}
