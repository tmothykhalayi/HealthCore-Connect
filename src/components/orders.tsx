// components/PharmacyOrdersTable.tsx
import { useMemo, useState } from 'react'
import {
  
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef} from '@tanstack/react-table';
import type { TPharmacyOrder } from '@/types/alltypes'
import {
  useDeletePharmacyOrder,
  useGetPharmacyOrdersQuery,
  useCreatePharmacyOrder,
  useUpdatePharmacyOrder,
} from '@/hooks/orders'
import useAuthStore from '@/store/auth'
import { getUserIdHelper } from '@/lib/auth'
import { getPatientByUserIdFn } from '@/api/patient/patient'
import { useEffect } from 'react'

export const PharmacyOrdersTable = ({ patientId }: { patientId?: number }) => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const user = useAuthStore((state) => state.user)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<TPharmacyOrder | null>(null)
  const [formData, setFormData] = useState({
    patientId: '',
    pharmacyId: '',
    medicineId: '',
    quantity: '1',
    orderDate: '',
    status: 'pending',
    totalAmount: '',
    OrderId: '',
  })
  const [effectivePatientId, setEffectivePatientId] = useState<number | null>(null)

  useEffect(() => {
    const fetchPatientId = async () => {
      let id = patientId
      if (!id) {
        const userId = getUserIdHelper()
        if (userId) {
          const patient = await getPatientByUserIdFn(Number(userId))
          id = patient?.id
        }
      }
      setEffectivePatientId(id ? Number(id) : null)
    }
    fetchPatientId()
  }, [patientId])

  const { data, isLoading, isError } = useGetPharmacyOrdersQuery(
    pagination.pageIndex + 1,
    pagination.pageSize,
    search,
    effectivePatientId,
  )

  console.log('[DEBUG] PharmacyOrdersTable - data:', data);
  console.log('[DEBUG] PharmacyOrdersTable - isLoading:', isLoading);
  console.log('[DEBUG] PharmacyOrdersTable - isError:', isError);

  const deleteMutation = useDeletePharmacyOrder()
  const createMutation = useCreatePharmacyOrder()
  const updateMutation = useUpdatePharmacyOrder()

  const handleCreateOrder = () => {
    if (!effectivePatientId) {
      alert('Patient ID not found. Please log in again.');
      return;
    }
    const orderData = {
      patientId: effectivePatientId,
      pharmacyId: parseInt(formData.pharmacyId),
      medicineId: parseInt(formData.medicineId),
      quantity: parseInt(formData.quantity),
      orderDate: formData.orderDate,
      orderStatus: formData.status, // <-- use orderStatus for backend
      totalAmount: parseFloat(formData.totalAmount),
      OrderId: formData.OrderId,
    }

    createMutation.mutate(orderData, {
      onSuccess: () => {
        setShowCreateModal(false)
        setFormData({
          patientId: '',
          pharmacyId: '',
          medicineId: '',
          quantity: '1',
          orderDate: '',
          status: 'pending',
          totalAmount: '',
          OrderId: '',
        })
      },
    })
  }

  const handleUpdateOrder = () => {
    if (!selectedOrder || !effectivePatientId) return

    const orderData = {
      patientId: effectivePatientId,
      pharmacyId: parseInt(formData.pharmacyId),
      medicineId: parseInt(formData.medicineId),
      quantity: parseInt(formData.quantity),
      orderDate: formData.orderDate,
      orderStatus: formData.status, 
      totalAmount: parseFloat(formData.totalAmount),
      OrderId: formData.OrderId,
    }

    updateMutation.mutate(
      { orderId: selectedOrder.pharmacy_order_id, orderData },
      {
        onSuccess: () => {
          setShowEditModal(false)
          setSelectedOrder(null)
          setFormData({
            patientId: '',
            pharmacyId: '',
            medicineId: '',
            quantity: '1',
            orderDate: '',
            status: 'pending',
            totalAmount: '',
            OrderId: '',
          })
        },
      }
    )
  }

  const handleEditOrder = (order: TPharmacyOrder) => {
    setSelectedOrder(order)
    setFormData({
      patientId: order.patient_id.toString(),
      pharmacyId: order.doctor_id.toString(), // Using doctor_id for pharmacyId
      medicineId: order.medicine_id.toString(), // Assuming medicine_id is stored in the order object
      quantity: order.quantity.toString(),
      orderDate: new Date(order.created_at).toISOString().split('T')[0],
      status: order.status,
      totalAmount: order.quantity.toString(), // Assuming totalAmount is quantity for now
      OrderId: order.order_id || '',
    })
    setShowEditModal(true)
  }

  // Format date to Kenyan format
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const columns = useMemo<Array<ColumnDef<TPharmacyOrder>>>(
    () => [
      {
        header: 'Order ID',
        accessorKey: 'pharmacy_order_id',
        size: 100,
      },
      {
        header: 'Custom Order ID',
        accessorKey: 'order_id',
        size: 120,
      },
      {
        header: 'Patient ID',
        accessorKey: 'patient_id',
        size: 100,
      },
      {
        header: 'Pharmacy ID',
        accessorKey: 'doctor_id', // Using doctor_id field to store pharmacyId
        size: 100,
      },
      {
        header: 'Patient Name',
        accessorKey: 'patient_name',
        size: 150,
      },
      {
        header: 'Pharmacy Name',
        accessorKey: 'doctor_name', // Using doctor_name field to store pharmacy name
        size: 150,
      },
      {
        header: 'Total Amount',
        accessorKey: 'quantity',
        cell: ({ row }) => (
          <span className="font-medium">${row.original.quantity}</span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              row.original.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : row.original.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        header: 'Created At',
        cell: ({ row }) => formatDateTime(row.original.created_at),
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEditOrder(row.original)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    `Are you sure you want to delete order #${row.original.pharmacy_order_id}?`,
                  )
                ) {
                  deleteMutation.mutate(row.original.pharmacy_order_id)
                }
              }}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ),
        size: 150,
      },
    ],
    [deleteMutation],
  )

  const table = useReactTable({
    data: (data?.data || []) as TPharmacyOrder[],
    columns,
    pageCount: Math.ceil((data?.total || 0) / pagination.pageSize),
    state: {
      pagination,
      globalFilter: search,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Error loading pharmacy orders. Please try again.
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Pharmacy Orders
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Order
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search orders by status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing {table.getRowModel().rows.length} of {data?.total} orders
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => {
                setPagination({
                  ...pagination,
                  pageSize: Number(e.target.value),
                  pageIndex: 0,
                })
              }}
              className="border rounded-md p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {[10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                «
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                ‹
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                ›
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Order</h2>
            <div className="space-y-4">
              {/* Patient ID is set automatically and hidden */}
              <input type="hidden" value={effectivePatientId || ''} readOnly />
              <div>
                <label className="block text-sm font-medium text-gray-700">Pharmacy ID</label>
                <input
                  type="number"
                  value={formData.pharmacyId}
                  onChange={(e) => setFormData({ ...formData, pharmacyId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medicine ID</label>
                <input
                  type="number"
                  value={formData.medicineId}
                  onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Order Date</label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Order ID</label>
                <input
                  type="text"
                  value={formData.OrderId}
                  onChange={(e) => setFormData({ ...formData, OrderId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateOrder}
                disabled={createMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Order'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Order</h2>
            <div className="space-y-4">
              {/* Patient ID is set automatically and hidden */}
              <input type="hidden" value={effectivePatientId || ''} readOnly />
              <div>
                <label className="block text-sm font-medium text-gray-700">Pharmacy ID</label>
                <input
                  type="number"
                  value={formData.pharmacyId}
                  onChange={(e) => setFormData({ ...formData, pharmacyId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medicine ID</label>
                <input
                  type="number"
                  value={formData.medicineId}
                  onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Order Date</label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Order ID</label>
                <input
                  type="text"
                  value={formData.OrderId}
                  onChange={(e) => setFormData({ ...formData, OrderId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleUpdateOrder}
                disabled={updateMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Order'}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
