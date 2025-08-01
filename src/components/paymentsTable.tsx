// components/PaymentsTable.tsx
import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef} from '@tanstack/react-table';
import type { TPayment } from '@/types/alltypes'
import { useDeletePaymentAdmin, useGetAllPaymentsQuery, useCreatePayment, useUpdatePayment } from '@/hooks/payment'
import { PaymentStatus } from '@/API/payment'

interface PaymentFormData {
  userId: number
  orderId: string
  amount: number
  paymentMethod: string
  status: PaymentStatus
  relatedEntityType: string
  relatedEntityId: number
  transactionId: string
}

export const PaymentsTable = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<TPayment | null>(null)
  const [formData, setFormData] = useState<PaymentFormData>({
    userId: 0,
    orderId: '',
    amount: 0,
    paymentMethod: 'credit_card',
    status: PaymentStatus.PENDING,
    relatedEntityType: 'Order',
    relatedEntityId: 0,
    transactionId: '',
  })

  const { data: allPayments, isLoading, isError } = useGetAllPaymentsQuery()

  // Debug logging
  console.log('All payments data:', allPayments)
  if (allPayments && allPayments.length > 0) {
    console.log('Sample payment:', {
      id: allPayments[0].id,
      fullName: allPayments[0].fullName,
      email: allPayments[0].email,
      user: allPayments[0].user,
      hasUser: !!allPayments[0].user,
      userFirstName: allPayments[0].user?.firstName,
      userLastName: allPayments[0].user?.lastName,
    })
  }

  const createMutation = useCreatePayment()
  const updateMutation = useUpdatePayment()
  const deleteMutation = useDeletePaymentAdmin()

  // Filter and paginate payments
  const filteredPayments = useMemo(() => {
    if (!allPayments) return []
    
    return allPayments.filter((payment: any) => {
      const searchLower = search.toLowerCase()
      const fullName = `${payment.user?.firstName || ''} ${payment.user?.lastName || ''}`.toLowerCase()
      const email = payment.user?.email?.toLowerCase() || ''
      const paymentId = payment.id?.toString() || ''
      
      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        paymentId.includes(searchLower) ||
        payment.paystackReference?.toLowerCase().includes(searchLower)
      )
    })
  }, [allPayments, search])

  const paginatedPayments = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredPayments.slice(start, end)
  }, [filteredPayments, pagination.pageIndex, pagination.pageSize])

  // Format currency to Kenyan Shillings
  const formatToKES = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(amount)
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

  const handleCreatePayment = () => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
        setFormData({
          userId: 0,
          orderId: '',
          amount: 0,
          paymentMethod: 'credit_card',
          status: PaymentStatus.PENDING,
          relatedEntityType: 'Order',
          relatedEntityId: 0,
          transactionId: '',
        })
      },
    })
  }

  const handleUpdatePayment = () => {
    if (!editingPayment) return

    updateMutation.mutate(
      {
        paymentId: editingPayment.payment_id,
        paymentData: formData,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false)
          setEditingPayment(null)
          setFormData({
            userId: 0,
            orderId: '',
            amount: 0,
            paymentMethod: 'credit_card',
            status: PaymentStatus.PENDING,
            relatedEntityType: 'Order',
            relatedEntityId: 0,
            transactionId: '',
          })
        },
      }
    )
  }

  const handleEdit = (payment: any) => {
    setEditingPayment(payment)
    setFormData({
      userId: payment.userId || 0,
      orderId: payment.order?.id?.toString() || '',
      amount: parseFloat(payment.amount),
      paymentMethod: 'paystack',
      status: payment.status as PaymentStatus,
      relatedEntityType: payment.type === 'order' ? 'Order' : 'Appointment',
      relatedEntityId: payment.order?.id || 0,
      transactionId: payment.paystackReference || '',
    })
    setIsEditModalOpen(true)
  }

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'Payment ID',
        accessorKey: 'id',
        size: 100,
      },
      {
        header: 'Patient Name',
        accessorFn: (row) => {
          if (row.user?.firstName && row.user?.lastName) {
            return `${row.user.firstName} ${row.user.lastName}`
          }
          return row.fullName || 'N/A'
        },
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.user?.firstName && row.original.user?.lastName 
              ? `${row.original.user.firstName} ${row.original.user.lastName}`
              : row.original.fullName || 'N/A'
            }
          </span>
        ),
        size: 150,
      },
      {
        header: 'Email',
        accessorFn: (row) => row.user?.email || row.email,
        cell: ({ row }) => row.original.user?.email || row.original.email || 'N/A',
        size: 200,
      },
      {
        header: 'Type',
        accessorKey: 'type',
        cell: ({ row }) => (
          <span className="capitalize">{row.original.type}</span>
        ),
        size: 100,
      },
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ row }) => formatToKES(parseFloat(row.original.amount)),
        size: 120,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              row.original.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : row.original.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : row.original.status === 'refunded'
                    ? 'bg-blue-100 text-blue-800'
                  : row.original.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.original.status}
          </span>
        ),
        size: 100,
      },
      {
        header: 'Reference',
        accessorKey: 'paystackReference',
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.paystackReference || 'N/A'}</span>
        ),
        size: 150,
      },
      {
        header: 'Created At',
        cell: ({ row }) => formatDateTime(row.original.createdAt),
        size: 150,
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (
                  confirm(`Delete payment record #${row.original.id}?`)
                ) {
                  deleteMutation.mutate(row.original.id)
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
    [deleteMutation, handleEdit],
  )

  const table = useReactTable({
    data: paginatedPayments || [],
    columns,
    pageCount: Math.ceil(filteredPayments.length / pagination.pageSize),
    state: {
      pagination,
      globalFilter: search,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  } as any)

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
        Error loading payment records. Please try again.
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Payment
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search payments by method or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing {table.getRowModel().rows.length} of {filteredPayments.length} payments
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

      {/* Create Payment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Payment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="number"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PaymentStatus })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={PaymentStatus.PENDING}>Pending</option>
                  <option value={PaymentStatus.COMPLETED}>Completed</option>
                  <option value={PaymentStatus.FAILED}>Failed</option>
                  <option value={PaymentStatus.REFUNDED}>Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Entity Type
                </label>
                <input
                  type="text"
                  value={formData.relatedEntityType}
                  onChange={(e) => setFormData({ ...formData, relatedEntityType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Entity ID
                </label>
                <input
                  type="number"
                  value={formData.relatedEntityId}
                  onChange={(e) => setFormData({ ...formData, relatedEntityId: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreatePayment}
                disabled={createMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Payment'}
              </button>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {isEditModalOpen && editingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Payment #{editingPayment.payment_id}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="number"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PaymentStatus })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={PaymentStatus.PENDING}>Pending</option>
                  <option value={PaymentStatus.COMPLETED}>Completed</option>
                  <option value={PaymentStatus.FAILED}>Failed</option>
                  <option value={PaymentStatus.REFUNDED}>Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Entity Type
                </label>
                <input
                  type="text"
                  value={formData.relatedEntityType}
                  onChange={(e) => setFormData({ ...formData, relatedEntityType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Entity ID
                </label>
                <input
                  type="number"
                  value={formData.relatedEntityId}
                  onChange={(e) => setFormData({ ...formData, relatedEntityId: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleUpdatePayment}
                disabled={updateMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Payment'}
              </button>
              <button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingPayment(null)
                }}
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
