// components/UsersTable.tsx
import { useMemo, useState } from 'react'
import {
  
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef} from '@tanstack/react-table';
import { useCreateUser, useDeleteUser, useGetAllUsersQuery, useUpdateUser } from '@/hooks/user'
import { FaDownload } from 'react-icons/fa'

interface TUser {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  phoneNumber?: string
  isEmailVerified: boolean
  isActive: boolean
  createdAt: string
}

export const UsersTable = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null)
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient',
    phoneNumber: '',
  })
  const [updateUser, setUpdateUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'patient',
    phoneNumber: '',
    isActive: true,
    isEmailVerified: false,
  })

  const { data: users, isLoading, error } = useGetAllUsersQuery()

  const deleteMutation = useDeleteUser()
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!users) return []
    
    return users.filter((user: any) => {
      const searchLower = search.toLowerCase()
      return (
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower)
      )
    })
  }, [users, search])

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredUsers.slice(start, end)
  }, [filteredUsers, pagination.pageIndex, pagination.pageSize])

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // CSV Download function
  const downloadCSV = () => {
    if (!users || users.length === 0) {
      alert('No users to download')
      return
    }

    // Define CSV headers
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Phone Number', 'Email Verified', 'Active', 'Created At']
    
    // Convert users to CSV format
    const csvContent = [
      headers.join(','),
      ...users.map((user: TUser) => [
        user.id,
        `"${user.firstName?.replace(/"/g, '""') || ''}"`,
        `"${user.lastName?.replace(/"/g, '""') || ''}"`,
        `"${user.email?.replace(/"/g, '""') || ''}"`,
        `"${user.role?.replace(/"/g, '""') || ''}"`,
        `"${user.phoneNumber?.replace(/"/g, '""') || ''}"`,
        user.isEmailVerified ? 'Yes' : 'No',
        user.isActive ? 'Yes' : 'No',
        formatDate(user.createdAt)
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(newUser, {
      onSuccess: () => {
        setShowCreateForm(false)
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: 'patient',
          phoneNumber: '',
        })
      },
    })
  }

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    updateMutation.mutate(
      {
        userId: selectedUser.id,
        userData: updateUser,
      },
      {
        onSuccess: () => {
          setShowUpdateForm(false)
          setSelectedUser(null)
          setUpdateUser({
            firstName: '',
            lastName: '',
            email: '',
            role: 'patient',
            phoneNumber: '',
            isActive: true,
            isEmailVerified: false,
          })
        },
      },
    )
  }

  const columns =
    useMemo<Array<ColumnDef<TUser>>>(
      () => [
        {
          header: 'ID',
          accessorKey: 'id',
          size: 80,
        },
        {
          header: 'First Name',
          accessorKey: 'firstName',
          cell: ({ row }) => (
            <span className="font-medium">{row.original.firstName}</span>
          ),
        },
        {
          header: 'Last Name',
          accessorKey: 'lastName',
          cell: ({ row }) => (
            <span className="font-medium">{row.original.lastName}</span>
          ),
        },
        {
          header: 'Email',
          accessorKey: 'email',
          cell: ({ row }) => row.original.email,
        },
        {
          header: 'Role',
          accessorKey: 'role',
          cell: ({ row }) => (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.original.role === 'admin'
                  ? 'bg-red-100 text-red-800'
                  : row.original.role === 'doctor'
                  ? 'bg-blue-100 text-blue-800'
                  : row.original.role === 'patient'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {row.original.role}
            </span>
          ),
        },
        {
          header: 'Phone Number',
          accessorKey: 'phoneNumber',
          cell: ({ row }) => row.original.phoneNumber || 'N/A',
        },
        {
          header: 'Email Verified',
          accessorKey: 'isEmailVerified',
          cell: ({ row }) => (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.original.isEmailVerified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {row.original.isEmailVerified ? 'Yes' : 'No'}
            </span>
          ),
        },
        {
          header: 'Active',
          accessorKey: 'isActive',
          cell: ({ row }) => (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.original.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {row.original.isActive ? 'Yes' : 'No'}
            </span>
          ),
        },
        {
          header: 'Created At',
          accessorKey: 'createdAt',
          cell: ({ row }) => formatDate(row.original.createdAt),
        },
        {
          header: 'Actions',
          cell: ({ row }) => (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedUser(row.original)
                  setUpdateUser({
                    firstName: row.original.firstName,
                    lastName: row.original.lastName,
                    email: row.original.email,
                    role: row.original.role,
                    phoneNumber: row.original.phoneNumber || '',
                    isActive: row.original.isActive,
                    isEmailVerified: row.original.isEmailVerified,
                  })
                  setShowUpdateForm(true)
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      `Are you sure you want to delete user ${row.original.firstName} ${row.original.lastName}?`,
                    )
                  ) {
                    deleteMutation.mutate(row.original.id)
                  }
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ),
        },
      ],
      [deleteMutation],
    )

  const table = useReactTable({
    data: paginatedUsers,
    columns,
    pageCount: Math.ceil(filteredUsers.length / pagination.pageSize),
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
        Error loading users: {error.message}
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Create New User</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={newUser.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={newUser.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={newUser.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
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

      {/* Update User Modal */}
      {showUpdateForm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Update User</h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={updateUser.firstName}
                    onChange={handleUpdateInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={updateUser.lastName}
                    onChange={handleUpdateInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={updateUser.email}
                    onChange={handleUpdateInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={updateUser.role}
                    onChange={handleUpdateInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={updateUser.phoneNumber}
                    onChange={handleUpdateInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Updating...' : 'Update User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUpdateForm(false)}
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
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <div className="flex gap-2">
            {users && users.length > 0 && (
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaDownload className="w-4 h-4" />
                Download CSV
              </button>
            )}
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add User
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing {table.getRowModel().rows.length} of {filteredUsers.length} users
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
                    filteredUsers.length,
                  )}
                </span>{' '}
                of <span className="font-medium">{filteredUsers.length}</span> results
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
