// components/PatientsTable.tsx
import { useMemo, useState } from 'react'
import {
  
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef} from '@tanstack/react-table';
import {
  useCreatePatient,
  useDeletePatient,
  useGetAllPatientsQuery,
  useUpdatePatient,
} from '@/hooks/patient'

interface Patient {
  id: number
  userId: number
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    isEmailVerified: boolean
    createdAt: string
  }
  gender: string
  dateOfBirth: string
  phoneNumber: string
  address: string
  emergencyContact?: string
  medicalHistory?: string
  allergies?: string[]
  assignedDoctorId?: number
  bloodType?: string
  weight?: number
  height?: number
  status?: string
}

export const PatientsTable = () => {
  const [search, setSearch] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: 'male',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
  })
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null)

  const { data: patients, isLoading, error } = useGetAllPatientsQuery()

  const deleteMutation = useDeletePatient()
  const createMutation = useCreatePatient()
  const updateMutation = useUpdatePatient()

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    if (!patients) return []
    
    return patients.filter((patient: Patient) => {
      const searchLower = search.toLowerCase()
      const fullName = `${patient.user?.firstName || ''} ${patient.user?.lastName || ''}`.toLowerCase()
      return (
        fullName.includes(searchLower) ||
        patient.user?.email?.toLowerCase().includes(searchLower) ||
        patient.phoneNumber?.toLowerCase().includes(searchLower) ||
        patient.address?.toLowerCase().includes(searchLower)
      )
    })
  }, [patients, search])

  // Paginate filtered patients
  const paginatedPatients = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredPatients.slice(start, end)
  }, [filteredPatients, pagination.pageIndex, pagination.pageSize])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    if (editingPatient) {
      setEditingPatient((prev) => ({
        ...prev!,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      name: `${newPatient.firstName} ${newPatient.lastName}`,
      email: newPatient.email,
      dob: newPatient.dateOfBirth,
      gender: newPatient.gender,
      phone: newPatient.phoneNumber,
      address: newPatient.address,
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false)
        setNewPatient({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
          gender: 'male',
          dateOfBirth: '',
          address: '',
          emergencyContact: '',
          medicalHistory: '',
        })
      },
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPatient) return

    const patientData = {
      phoneNumber: editingPatient.phoneNumber,
      address: editingPatient.address,
      emergencyContact: editingPatient.emergencyContact,
      medicalHistory: editingPatient.medicalHistory,
      bloodType: editingPatient.bloodType,
      weight: editingPatient.weight,
      height: editingPatient.height,
      status: editingPatient.status,
    }

    console.log('Sending patient update data:', {
      patientId: editingPatient.id,
      patientData
    })

    updateMutation.mutate({
      patientId: editingPatient.id,
      patientData,
    }, {
      onSuccess: (data) => {
        console.log('Update successful:', data)
        setIsEditModalOpen(false)
        setEditingPatient(null)
      },
      onError: (error) => {
        console.error('Update failed:', error)
      }
    })
  }

  const handleEditClick = (patient: Patient) => {
    setEditingPatient(patient)
    setIsEditModalOpen(true)
  }

  const columns = useMemo<Array<ColumnDef<Patient>>>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        size: 80,
      },
      {
        header: 'Name',
        accessorFn: (row) => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.user?.firstName} {row.original.user?.lastName}
          </span>
        ),
      },
      {
        header: 'Email',
        accessorFn: (row) => row.user?.email,
        cell: ({ row }) => row.original.user?.email || 'N/A',
      },
      {
        header: 'Phone',
        accessorKey: 'phoneNumber',
        cell: ({ row }) => (
          <span className="font-mono">{row.original.phoneNumber || 'N/A'}</span>
        ),
      },
      {
        header: 'Gender',
        accessorKey: 'gender',
        cell: ({ row }) => (
          <span className="capitalize">{row.original.gender || 'N/A'}</span>
        ),
      },
      {
        header: 'Date of Birth',
        accessorKey: 'dateOfBirth',
        cell: ({ row }) => formatDate(row.original.dateOfBirth),
      },
      {
        header: 'Blood Type',
        accessorKey: 'bloodType',
        cell: ({ row }) => row.original.bloodType || 'N/A',
      },
      {
        header: 'Address',
        accessorKey: 'address',
        cell: ({ row }) => (
          <span className="truncate max-w-xs inline-block">
            {row.original.address || 'N/A'}
          </span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.status === 'active'
                ? 'bg-green-100 text-green-800'
                : row.original.status === 'inactive'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.original.status || 'Active'}
          </span>
        ),
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setViewingPatient(row.original)
                setIsViewModalOpen(true)
              }}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => handleEditClick(row.original)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                const patientName = `${row.original.user?.firstName} ${row.original.user?.lastName}`
                if (confirm(`Are you sure you want to delete ${patientName}?`)) {
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
        size: 200,
      },
    ],
    [deleteMutation],
  )

  const table = useReactTable({
    data: paginatedPatients,
    columns,
    pageCount: Math.ceil(filteredPatients.length / pagination.pageSize),
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

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Error loading patients: {error.message}
      </div>
    )
  }

  const viewDetailsModal = isViewModalOpen && viewingPatient && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Patient Details</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div><strong>Name:</strong> {viewingPatient.user?.firstName && viewingPatient.user?.lastName ? `${viewingPatient.user.firstName} ${viewingPatient.user.lastName}` : '-'}</div>
          <div><strong>Email:</strong> {viewingPatient.user?.email || '-'}</div>
          <div><strong>Phone Number:</strong> {viewingPatient.phoneNumber || '-'}</div>
          <div><strong>Gender:</strong> {viewingPatient.gender || '-'}</div>
          <div><strong>Date of Birth:</strong> {formatDate(viewingPatient.dateOfBirth)}</div>
          <div><strong>Address:</strong> {viewingPatient.address || '-'}</div>
          <div><strong>Emergency Contact:</strong> {viewingPatient.emergencyContact || '-'}</div>
          <div><strong>Medical History:</strong> {viewingPatient.medicalHistory || '-'}</div>
          <div><strong>Blood Type:</strong> {viewingPatient.bloodType || '-'}</div>
          <div><strong>Weight:</strong> {viewingPatient.weight || '-'}</div>
          <div><strong>Height:</strong> {viewingPatient.height || '-'}</div>
          <div><strong>Status:</strong> {viewingPatient.status || '-'}</div>
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => {
              setIsViewModalOpen(false)
              setViewingPatient(null)
            }}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {viewDetailsModal}
      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={newPatient.firstName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={newPatient.lastName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newPatient.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={newPatient.password}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={newPatient.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={newPatient.gender}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={newPatient.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={newPatient.address}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={newPatient.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical History
                    </label>
                    <textarea
                      name="medicalHistory"
                      value={newPatient.medicalHistory}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create Patient'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {isEditModalOpen && editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Edit Patient</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={`${editingPatient.user?.firstName} ${editingPatient.user?.lastName}`}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingPatient.user?.email}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editingPatient.phoneNumber || ''}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={editingPatient.address || ''}
                      onChange={(e) => handleEditInputChange(e)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={editingPatient.emergencyContact || ''}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Type
                    </label>
                    <input
                      type="text"
                      name="bloodType"
                      value={editingPatient.bloodType || ''}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., A+, B-, O+"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={editingPatient.weight || ''}
                        onChange={handleEditInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={editingPatient.height || ''}
                        onChange={handleEditInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical History
                    </label>
                    <textarea
                      name="medicalHistory"
                      value={editingPatient.medicalHistory || ''}
                      onChange={(e) => handleEditInputChange(e)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editingPatient.status || 'active'}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Patient'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingPatient(null)
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Patient
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search patients by name, email, phone, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing {table.getRowModel().rows.length} of {filteredPatients.length} patients
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
    </div>
  )
}
