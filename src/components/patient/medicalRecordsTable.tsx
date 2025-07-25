import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { TRecord } from '@/types/alltypes'
import { useGetPatientMedicalRecordsQuery } from '@/hooks/patient/medicalRecords'

interface PatientMedicalRecordsTableProps {
  patientId: number
}

export const PatientMedicalRecordsTable = ({ patientId }: PatientMedicalRecordsTableProps) => {
  const [search, setSearch] = useState('')
  const { data, isLoading, isError } = useGetPatientMedicalRecordsQuery(patientId)
  const records = data?.data || []

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const columns = useMemo<Array<ColumnDef<TRecord>>>(
    () => [
      {
        header: 'Record ID',
        accessorKey: 'id',
        size: 100,
      },
      {
        header: 'Doctor ID',
        accessorKey: 'doctorId',
        size: 100,
      },
      {
        header: 'Appointment ID',
        accessorKey: 'appointmentId',
        size: 120,
      },
      {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ row }) => (
          <div className="max-w-md line-clamp-2">
            {row.original.description}
          </div>
        ),
      },
      {
        header: 'Created At',
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        header: 'Updated At',
        cell: ({ row }) => formatDate(row.original.updatedAt),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: records,
    columns,
    state: {
      globalFilter: search,
    },
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
        Error loading medical records. Please try again.
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          My Medical Records
        </h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search records by description, IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
                      className="px-6 py-4 text-sm text-gray-600"
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
      </div>

      {records.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500">No medical records found.</p>
          <p className="text-gray-400 text-sm">
            Your medical records will appear here after your doctor creates them.
          </p>
        </div>
      )}
    </div>
  )
} 