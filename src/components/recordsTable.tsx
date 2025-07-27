// components/RecordsTable.tsx
import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef} from '@tanstack/react-table';
import type { TRecord, CreateRecordData, UpdateRecordData } from '@/types/alltypes'
import {
  useCreateRecord,
  useDeleteRecord,
  useGetRecordsQuery,
  useUpdateRecord,
} from '@/hooks/medicalrecords'
import { getUserRoleHelper } from '@/lib/auth'

export const RecordsTable = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TRecord | null>(null)

  const { data, isLoading, isError } = useGetRecordsQuery(
    pagination.pageIndex + 1,
    pagination.pageSize,
    search,
  )

  // If backend response is { data: { data: [...], total: n } }
  const records = data?.data || [];
  const total = data?.total || 0;

  console.log('Records data:', data);
  console.log('Records array:', records);
  console.log('Total records:', total);
  console.log('Is loading:', isLoading);
  console.log('Is error:', isError);

  const deleteMutation = useDeleteRecord()
  const createMutation = useCreateRecord()
  const updateMutation = useUpdateRecord()

  const [formData, setFormData] = useState<CreateRecordData>({
    patientId: 1,
    doctorId: 1,
    recordType: 'diagnosis',
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
    priority: 'normal',
    status: 'active',
  })

  const recordTypes = [
    'diagnosis',
    'prescription',
    'lab_result',
    'imaging',
    'surgery',
    'consultation',
    'follow_up',
    'emergency',
  ]

  const priorities = ['normal', 'urgent', 'critical']
  const statuses = ['active', 'archived', 'deleted']

  const handleCreateRecord = () => {
    // Validate required fields
    if (!formData.title || !formData.description || !formData.patientId || !formData.doctorId) {
      alert('Please fill in all required fields')
      return
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        alert('Medical record created successfully!')
        setIsCreateModalOpen(false)
        setFormData({
          patientId: 1,
          doctorId: 1,
          recordType: 'diagnosis',
          title: '',
          description: '',
          diagnosis: '',
          treatment: '',
          priority: 'normal',
          status: 'active',
        })
      },
      onError: (error) => {
        console.error('Error creating record:', error)
        alert('Failed to create medical record. Please try again.')
      }
    })
  }

  const handleUpdateRecord = () => {
    if (!editingRecord) return

    // Validate required fields
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    updateMutation.mutate(
      {
        recordId: editingRecord.id,
        recordData: formData,
      },
      {
        onSuccess: () => {
          alert('Medical record updated successfully!')
          setIsEditModalOpen(false)
          setEditingRecord(null)
          setFormData({
            patientId: 1,
            doctorId: 1,
            recordType: 'diagnosis',
            title: '',
            description: '',
            diagnosis: '',
            treatment: '',
            priority: 'normal',
            status: 'active',
          })
        },
        onError: (error) => {
          console.error('Error updating record:', error)
          alert('Failed to update medical record. Please try again.')
        }
      }
    )
  }

  const handleEdit = (record: TRecord) => {
    setEditingRecord(record)
    setFormData({
      patientId: record.patientId,
      doctorId: record.doctorId,
      appointmentId: record.appointmentId,
      recordType: record.recordType,
      title: record.title,
      description: record.description,
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      medications: record.medications,
      labResults: record.labResults,
      vitals: record.vitals,
      allergies: record.allergies,
      followUpInstructions: record.followUpInstructions || '',
      nextAppointmentDate: record.nextAppointmentDate || '',
      priority: record.priority,
      status: record.status,
      notes: record.notes || '',
      attachments: record.attachments,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (recordId: number) => {
    if (confirm('Are you sure you want to delete this medical record?')) {
      deleteMutation.mutate(recordId, {
        onSuccess: () => {
          alert('Medical record deleted successfully!')
        },
        onError: (error) => {
          console.error('Error deleting record:', error)
          alert('Failed to delete medical record. Please try again.')
        }
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      case 'deleted':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
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

  const columns = useMemo<Array<ColumnDef<TRecord>>>(
    () => [
      {
        header: 'Record ID',
        accessorKey: 'id',
        cell: ({ row }) => <span>{row.original.id ?? '-'}</span>,
        size: 100,
      },
      {
        header: 'Title',
        accessorKey: 'title',
        cell: ({ row }) => <span className="font-medium">{row.original.title ?? '-'}</span>,
        size: 150,
      },
      {
        header: 'Type',
        accessorKey: 'recordType',
        cell: ({ row }) => (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {row.original.recordType?.replace('_', ' ').toUpperCase() ?? '-'}
          </span>
        ),
        size: 120,
      },
      {
        header: 'Patient',
        accessorKey: 'patientId',
        cell: ({ row }) => {
          const value = row.original.patient?.name || `Patient ${row.original.patientId}`;
          return <span>{value ?? '-'}</span>;
        },
        size: 120,
      },
      {
        header: 'Doctor',
        accessorKey: 'doctorId',
        cell: ({ row }) => {
          const value = row.original.doctor?.name || `Doctor ${row.original.doctorId}`;
          return <span>{value ?? '-'}</span>;
        },
        size: 120,
      },
      {
        header: 'Priority',
        accessorKey: 'priority',
        cell: ({ row }) => (
          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(row.original.priority)}`}>
            {row.original.priority?.toUpperCase() ?? '-'}
          </span>
        ),
        size: 100,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.original.status)}`}>
            {row.original.status?.toUpperCase() ?? '-'}
          </span>
        ),
        size: 100,
      },
      {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ row }) => (
          <div className="max-w-prose truncate hover:whitespace-normal hover:max-w-full">
            {row.original.description}
          </div>
        ),
      },
      {
        header: 'Created At',
        cell: ({ row }) => {
          const dateValue = row.original.createdAt;
          if (!dateValue) return <span>-</span>;
          const date = new Date(dateValue);
          return isNaN(date.getTime()) ? <span>-</span> : <span>{date.toLocaleString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}</span>;
        },
        size: 150,
      },
      {
        header: 'Actions',
        cell: ({ row }) => {
          const userRole = getUserRoleHelper();
          if (userRole === 'pharmacist') {
            return null;
          }
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(row.original)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(row.original.id)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          );
        },
        size: 150,
      },
    ],
    [deleteMutation.isPending],
  )

  const table = useReactTable({
    data: records,
    columns,
    pageCount: Math.ceil(total / pagination.pageSize),
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
  });

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
        Error loading medical records. Please try again.
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Record
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search records by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing {table.getRowModel().rows.length} of {total} records
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-6">
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

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Medical Record</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient ID</label>
                  <input
                    type="number"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor ID</label>
                  <input
                    type="number"
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Record Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.recordType}
                  onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                >
                  {recordTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Diagnosis</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={2}
                  value={formData.diagnosis || ''}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Treatment</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={2}
                  value={formData.treatment || ''}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleCreateRecord}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Medical Record</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient ID</label>
                  <input
                    type="number"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor ID</label>
                  <input
                    type="number"
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Record Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.recordType}
                  onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                >
                  {recordTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Diagnosis</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={2}
                  value={formData.diagnosis || ''}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Treatment</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={2}
                  value={formData.treatment || ''}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleUpdateRecord}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
