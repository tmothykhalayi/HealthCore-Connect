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
import { FaDownload } from 'react-icons/fa'

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

  // CSV Download function
  const downloadCSV = () => {
    if (!records || records.length === 0) {
      alert('No records to download')
      return
    }

    // Define CSV headers
    const headers = ['Record ID', 'Doctor ID', 'Appointment ID', 'Description', 'Created At', 'Updated At']
    
    // Convert records to CSV format
    const csvContent = [
      headers.join(','),
      ...records.map((record: TRecord) => [
        record.id,
        record.doctorId,
        record.appointmentId,
        `"${record.description?.replace(/"/g, '""') || ''}"`, // Escape quotes in description
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            My Medical Records
          </h1>
          {records.length > 0 && (
            <button
              onClick={downloadCSV}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              aria-label="Download CSV"
            >
              <FaDownload className="w-5 h-5" />
            </button>
          )}
        </div>
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

      {records.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
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
      ) : (
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