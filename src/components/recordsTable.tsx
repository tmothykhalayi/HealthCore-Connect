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
import { FaDownload } from 'react-icons/fa'

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

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // CSV Download function
  const downloadCSV = () => {
    if (!records || records.length === 0) {
      alert('No records to download')
      return
    }

    // Define CSV headers
    const headers = ['Record ID', 'Patient ID', 'Doctor ID', 'Type', 'Title', 'Description', 'Diagnosis', 'Treatment', 'Priority', 'Status', 'Notes', 'Created At', 'Updated At']
    
    // Convert records to CSV format
    const csvContent = [
      headers.join(','),
      ...records.map((record: TRecord) => [
        record.id,
        record.patientId,
        record.doctorId,
        `"${record.recordType?.replace(/"/g, '""') || ''}"`,
        `"${record.title?.replace(/"/g, '""') || ''}"`,
        `"${record.description?.replace(/"/g, '""') || ''}"`,
        `"${record.diagnosis?.replace(/"/g, '""') || ''}"`,
        `"${record.treatment?.replace(/"/g, '""') || ''}"`,
        `"${record.priority?.replace(/"/g, '""') || ''}"`,
        `"${record.status?.replace(/"/g, '""') || ''}"`,
        `"${record.notes?.replace(/"/g, '""') || ''}"`,
        formatDate(record.createdAt),
        formatDate(record.updatedAt)
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `medical_records_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    if (editingRecord) {
      setEditingRecord((prev) => ({
        ...prev!,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData, {
      onSuccess: () => {
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
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRecord) return

    const updateData: UpdateRecordData = {
      recordType: editingRecord.recordType,
      title: editingRecord.title,
      description: editingRecord.description,
      diagnosis: editingRecord.diagnosis,
      treatment: editingRecord.treatment,
      priority: editingRecord.priority,
      status: editingRecord.status,
      notes: editingRecord.notes,
    }

    updateMutation.mutate(
      {
        recordId: editingRecord.id,
        recordData: updateData,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false)
          setEditingRecord(null)
        },
      },
    )
  }

  const handleEditClick = (record: TRecord) => {
    setEditingRecord(record)
    setIsEditModalOpen(true)
  }

  const columns = useMemo<Array<ColumnDef<TRecord>>>(
    () => [
      {
        header: 'Record ID',
        accessorKey: 'id',
        size: 80,
      },
      {
        header: 'Patient ID',
        accessorKey: 'patientId',
        size: 80,
      },
      {
        header: 'Doctor ID',
        accessorKey: 'doctorId',
        size: 80,
      },
      {
        header: 'Type',
        accessorKey: 'recordType',
        cell: ({ row }) => (
          <span className="capitalize">{row.original.recordType}</span>
        ),
        size: 100,
      },
      {
        header: 'Title',
        accessorKey: 'title',
        cell: ({ row }) => (
          <span className="font-medium">{row.original.title}</span>
        ),
        size: 120,
      },
      {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ row }) => (
          <div className="max-w-xs truncate hover:whitespace-normal hover:max-w-full">
            {row.original.description}
          </div>
        ),
        size: 150,
      },
      {
        header: 'Diagnosis',
        accessorKey: 'diagnosis',
        cell: ({ row }) => (
          <div className="max-w-xs truncate hover:whitespace-normal hover:max-w-full">
            {row.original.diagnosis}
          </div>
        ),
        size: 120,
      },
      {
        header: 'Treatment',
        accessorKey: 'treatment',
        cell: ({ row }) => (
          <div className="max-w-xs truncate hover:whitespace-normal hover:max-w-full">
            {row.original.treatment}
          </div>
        ),
        size: 120,
      },
      {
        header: 'Priority',
        accessorKey: 'priority',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.priority === 'critical'
                ? 'bg-red-100 text-red-800'
                : row.original.priority === 'urgent'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {row.original.priority}
          </span>
        ),
        size: 80,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.original.status}
          </span>
        ),
        size: 80,
      },
      {
        header: 'Notes',
        accessorKey: 'notes',
        cell: ({ row }) => (
          <div className="max-w-xs truncate hover:whitespace-normal hover:max-w-full">
            {row.original.notes}
          </div>
        ),
        size: 120,
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: ({ row }) => formatDate(row.original.createdAt),
        size: 120,
      },
      {
        header: 'Updated At',
        accessorKey: 'updatedAt',
        cell: ({ row }) => formatDate(row.original.updatedAt),
        size: 120,
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEditClick(row.original)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    `Are you sure you want to delete this record?`,
                  )
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
        size: 120,
      },
    ],
    [deleteMutation],
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
        Error loading records. Please try again.
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Create Record Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Create New Medical Record</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient ID
                    </label>
                    <input
                      type="number"
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor ID
                    </label>
                    <input
                      type="number"
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Record Type
                    </label>
                    <select
                      name="recordType"
                      value={formData.recordType}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {recordTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis
                  </label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment
                  </label>
                  <textarea
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Record'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {isEditModalOpen && editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Edit Medical Record</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Record Type
                    </label>
                    <select
                      name="recordType"
                      value={editingRecord.recordType}
                      onChange={handleEditInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {recordTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={editingRecord.priority}
                      onChange={handleEditInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editingRecord.title}
                    onChange={handleEditInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editingRecord.description}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis
                  </label>
                  <textarea
                    name="diagnosis"
                    value={editingRecord.diagnosis}
                    onChange={handleEditInputChange}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment
                  </label>
                  <textarea
                    name="treatment"
                    value={editingRecord.treatment}
                    onChange={handleEditInputChange}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={editingRecord.notes}
                    onChange={handleEditInputChange}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Updating...' : 'Update Record'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Medical Records Management</h1>
          <div className="flex gap-2">
            {records && records.length > 0 && (
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaDownload className="w-4 h-4" />
                Download CSV
              </button>
            )}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Record
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search records by title, description, diagnosis..."
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
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    total,
                  )}
                </span>{' '}
                of <span className="font-medium">{total}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
