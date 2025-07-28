// components/DoctorsTable.tsx
import { useMemo, useState } from 'react'
import {
  
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef} from '@tanstack/react-table';
import type { TDoctor } from '@/types/alltypes'
import { useDeleteDoctor, useGetDoctorQuery, useUpdateDoctor } from '@/hooks/doctor'

export const DoctorsTable = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading } = useGetDoctorQuery(
    pagination.pageIndex + 1,
    pagination.pageSize,
    search,
  )

  const deleteMutation = useDeleteDoctor()
  const updateDoctorMutation = useUpdateDoctor();
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<TDoctor | null>(null);
  const [formState, setFormState] = useState<any>({});

  function handleUpdateDoctor(doctor: TDoctor) {
    setSelectedDoctor(doctor);
    setFormState(doctor);
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
    setSelectedDoctor(null);
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
    if (selectedDoctor) {
      updateDoctorMutation.mutate({
        doctorId: selectedDoctor.doctor_id,
        doctorData: formState,
      }, {
        onSuccess: handleModalClose,
      });
    }
  }



  const columns = useMemo<Array<ColumnDef<TDoctor>>>(
    () => [
      {
        header: 'ID',
        accessorKey: 'doctor_id',
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
        header: 'Specialization',
        accessorKey: 'specialization',
      },
      {
        header: 'License Number',
        accessorKey: 'license_number',
      },
      {
        header: 'Availability',
        accessorKey: 'availability',
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateDoctor(row.original)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Update
            </button>
            <button
              onClick={() => {
                if (
                  confirm(`Are you sure you want to delete ${row.original.name}?`)
                ) {
                  deleteMutation.mutate(row.original.doctor_id)
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
    return <div className="text-center py-8">Loading doctors...</div>

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Doctors Management
        </h1>
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search doctors by name, email, or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full max-w-md"
          />
          <span className="text-sm text-gray-600">
            Showing {table.getRowModel().rows.length} of {data?.total} doctors
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
                doctors
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
        <h2 className="text-xl font-bold mb-4">Update Doctor</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            name="name"
            value={formState.name || ''}
            onChange={handleFormChange}
            placeholder="Name"
            className="border p-2 rounded w-full"
            disabled
          />
          <input
            name="email"
            value={formState.email || ''}
            onChange={handleFormChange}
            placeholder="Email"
            className="border p-2 rounded w-full"
            disabled
          />
          <input
            name="specialization"
            value={formState.specialization || ''}
            onChange={handleFormChange}
            placeholder="Specialization"
            className="border p-2 rounded w-full"
          />
          <input
            name="license_number"
            value={formState.license_number || ''}
            onChange={handleFormChange}
            placeholder="License Number"
            className="border p-2 rounded w-full"
          />
          <input
            name="availability"
            value={formState.availability || ''}
            onChange={handleFormChange}
            placeholder="Availability"
            className="border p-2 rounded w-full"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={updateDoctorMutation.isPending}>
              {updateDoctorMutation.isPending ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
    </div>
  )
}
