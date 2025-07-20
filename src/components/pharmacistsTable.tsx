// components/PharmacistsTable.tsx
import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef} from '@tanstack/react-table';
import type { TPharmacist } from '@/types/alltypes'
import { useDeletePharmacist, useGetAllPharmacists, useUpdatePharmacist } from '@/hooks/pharmacist'

export const PharmacistsTable = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useGetAllPharmacists(
    pagination.pageIndex + 1,
    pagination.pageSize,
    search,
  )

  const deleteMutation = useDeletePharmacist()
  const updatePharmacistMutation = useUpdatePharmacist();
  const [showModal, setShowModal] = useState(false);
  const [selectedPharmacist, setSelectedPharmacist] = useState<TPharmacist | null>(null);
  const [formState, setFormState] = useState<any>({});

  function handleUpdatePharmacist(pharmacist: TPharmacist) {
    setSelectedPharmacist(pharmacist);
    setFormState(pharmacist);
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
    setSelectedPharmacist(null);
    setFormState({});
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedPharmacist) {
      updatePharmacistMutation.mutate({
        pharmacistId: selectedPharmacist.pharmacist_id,
        pharmacistData: formState,
      }, {
        onSuccess: handleModalClose,
      });
    }
  }

  const columns = useMemo<Array<ColumnDef<TPharmacist>>>(
    () => [
      {
        header: 'ID',
        accessorKey: 'pharmacist_id',
      },
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Pharmacy Name',
        accessorKey: 'pharmacy_name',
      },
      {
        header: 'License Number',
        accessorKey: 'license_number',
      },
      {
        header: 'Phone Number',
        accessorKey: 'phone_number',
      },
      {
        header: 'Status',
        accessorKey: 'status',
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdatePharmacist(row.original)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Update
            </button>
            <button
              onClick={() => {
                if (
                  confirm(`Are you sure you want to delete ${row.original.name}?`)
                ) {
                  deleteMutation.mutate(row.original.pharmacist_id)
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
    data: data?.data || [],
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

  if (isLoading)
    return <div className="text-center py-8">Loading pharmacists...</div>

  if (error)
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error loading pharmacists:</div>
        <div className="text-sm text-gray-600">{error.message}</div>
        <div className="mt-4 text-xs text-gray-500">
          Please check the browser console for more details.
        </div>
      </div>
    )

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pharmacists Management
        </h1>
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search pharmacists by name, email, or pharmacy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full max-w-md"
          />
          <span className="text-sm text-gray-600">
            Showing {table.getRowModel().rows.length} of {data?.total} pharmacists
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
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

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {pagination.pageIndex * pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(
                    (pagination.pageIndex + 1) * pagination.pageSize,
                    data?.total || 0,
                  )}
                </span>{' '}
                of <span className="font-medium">{data?.total || 0}</span>{' '}
                pharmacists
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
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
                  className="border rounded p-1 text-sm"
                >
                  {[10, 20, 30, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <nav className="flex space-x-2">
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  «
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  ‹
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  ›
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  »
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Pharmacist</h2>
        <p className="text-sm text-gray-600 mb-4">
          Note: Only the license number can be updated for pharmacists. Other details are managed through the user profile.
        </p>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={formState.name || ''}
              className="border p-2 rounded w-full bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              value={formState.email || ''}
              className="border p-2 rounded w-full bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name</label>
            <input
              name="pharmacy_name"
              value={formState.pharmacy_name || ''}
              className="border p-2 rounded w-full bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
            <input
              name="license_number"
              value={formState.license_number || ''}
              onChange={handleFormChange}
              placeholder="Enter license number"
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="phone_number"
              value={formState.phone_number || ''}
              className="border p-2 rounded w-full bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <input
              name="status"
              value={formState.status || ''}
              className="border p-2 rounded w-full bg-gray-100"
              disabled
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={updatePharmacistMutation.isPending}>
              {updatePharmacistMutation.isPending ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
    </div>
  )
} 