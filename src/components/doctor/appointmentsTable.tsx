// components/DoctorsAppointmentsTable.tsx
import { useMemo, useState } from 'react'
import { FaVideo } from 'react-icons/fa'
import { addZoomMeetingToAppointmentFn } from '@/API/Appointment'
import {
  
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef} from '@tanstack/react-table';
import type { TAppointment } from '@/types/alltypes'
import {
  useGetAppointmentsByDoctorIdQuery,
} from '@/hooks/doctor/appointment'

export const DoctorsAppointmentsTable = ({
  doctorId,
}: {
  doctorId: number
}) => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  // Remove showForm, formData, handleInputChange, handleSubmit, and useCreateAppointment
  // Remove all UI for Add New Appointment and the form/modal

  const { data: doctorData, isLoading, isError, refetch } = useGetAppointmentsByDoctorIdQuery(doctorId)
  // Handle both array and object response formats
  const appointments = Array.isArray(doctorData) ? doctorData : doctorData?.data || []
  console.log('doctorId:', doctorId)
  console.log('doctorData:', doctorData)
  console.log('appointments:', appointments)
  console.log('isLoading:', isLoading)
  console.log('isError:', isError)

  // Filter appointments by status
  const filteredAppointments = appointments.filter((appointment: any) => {
    if (statusFilter === 'all') return true
    return appointment.status === statusFilter
  })




  const handleJoinMeeting = async (appointment: any) => {
    // Check if the appointment has Zoom meeting data from backend
    if (appointment.admin_url) {
      // Use the admin URL (start URL) for doctors
      console.log('Joining meeting using backend Zoom data:', appointment.admin_url)
      window.open(appointment.admin_url, '_blank')
    } else if (appointment.zoomMeetingId) {
      // Fallback to meeting ID if URL is not available
      const zoomUrl = `https://zoom.us/s/${appointment.zoomMeetingId}`
      console.log('Joining meeting using meeting ID:', appointment.zoomMeetingId)
      window.open(zoomUrl, '_blank')
    } else {
      // If no Zoom data is available, try to create one
      try {
        console.log('No Zoom meeting data available, creating one for appointment:', appointment.appointment_id)
        const result = await addZoomMeetingToAppointmentFn(appointment.appointment_id)
        
        if (result.data && result.data.admin_url) {
          console.log('Zoom meeting created successfully:', result.data.admin_url)
          window.open(result.data.admin_url, '_blank')
        } else {
          alert('Failed to create Zoom meeting. Please contact support.')
        }
      } catch (error) {
        console.error('Error creating Zoom meeting:', error)
        alert('Failed to create Zoom meeting. Please contact support.')
      }
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

  const columns = useMemo<Array<ColumnDef<TAppointment>>>(
    () => [
      {
        header: 'Appointment ID',
        accessorKey: 'appointment_id',
        size: 120,
      },
      {
        header: 'Patient ID',
        accessorKey: 'patient_id',
        size: 100,
      },
      {
        header: 'Appointment Time',
        cell: ({ row }) => formatDateTime(row.original.appointment_time),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <select
            value={row.original.status}
            onChange={(e) => {
              // TODO: Add status update mutation
              console.log('Status changed to:', e.target.value, 'for appointment:', row.original.appointment_id)
            }}
            className={`px-2 py-1 rounded-full text-xs border-0 focus:ring-2 focus:ring-blue-500 ${
              row.original.status === 'scheduled'
                ? 'bg-blue-100 text-blue-800'
                : row.original.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : row.original.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        ),
      },
      {
        header: 'Reason',
        accessorKey: 'reason',
        cell: ({ row }) => (
          <span className="truncate max-w-xs inline-block">
            {row.original.reason}
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
          <button
            onClick={() => handleJoinMeeting(row.original)}
            disabled={row.original.status === 'cancelled' || row.original.status === 'completed'}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
              row.original.status === 'cancelled' || row.original.status === 'completed'
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            title={
              row.original.status === 'cancelled' || row.original.status === 'completed'
                ? 'Meeting not available'
                : 'Join Zoom Meeting'
            }
          >
            <FaVideo size={12} />
            {row.original.status === 'cancelled' || row.original.status === 'completed'
              ? 'Unavailable'
              : 'Join Meeting'
            }
          </button>
        ),
        size: 120,
      },
    ],
    [],
  )

  const table = useReactTable({
    data: filteredAppointments,
    columns,
    pageCount: Math.ceil(filteredAppointments.length / pagination.pageSize),
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
        Error loading appointments. Please try again.
      </div>
    )
  }

  if (!appointments.length) {
    return (
      <div className="text-center p-4">
        <div className="text-gray-500 mb-4">
          No appointments found for this doctor.
        </div>
      </div>
    )
  }

  if (!filteredAppointments.length && appointments.length > 0) {
    return (
      <div className="text-center p-4">
        <div className="text-gray-500 mb-4">
          No appointments match the current filters.
        </div>
        <button
          onClick={() => setStatusFilter('all')}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Clear filters
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Doctor's Appointments
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex-1 flex gap-4">
            <input
              type="text"
              placeholder="Search appointments by status, reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing {table.getRowModel().rows.length} of {filteredAppointments.length}{' '}
            appointments
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
