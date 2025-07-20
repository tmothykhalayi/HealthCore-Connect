// components/AppointmentsTable.tsx
import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef} from '@tanstack/react-table';
import type { TAppointment } from '@/types/alltypes'
import { useDeleteAppointment, useGetAppointmentQuery, useUpdateAppointment, useCreateAppointment } from '@/hooks/appointment'

export const AppointmentsTable = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useGetAppointmentQuery(
    pagination.pageIndex + 1,
    pagination.pageSize,
    search,
  )

  console.log('Appointments data:', data);
  console.log('Appointments loading:', isLoading);
  console.log('Appointments error:', error);

  const deleteMutation = useDeleteAppointment()
  const updateAppointmentMutation = useUpdateAppointment();
  const createAppointmentMutation = useCreateAppointment();
  
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<TAppointment | null>(null);
  const [formState, setFormState] = useState<any>({});

  function handleUpdateAppointment(appointment: TAppointment) {
    setSelectedAppointment(appointment);
    setFormState({
      appointment_date: appointment.appointment_date || '',
      appointment_time_slot: appointment.appointment_time_slot || '',
      reason: appointment.reason || '',
      status: appointment.status || 'scheduled',
      priority: appointment.priority || 'normal',
      notes: appointment.notes || '',
      duration: appointment.duration || 30,
    });
    setShowModal(true);
  }

  function handleCreateAppointment() {
    setFormState({
      patient_id: '',
      doctor_id: '',
      appointment_date: '',
      appointment_time_slot: '',
      reason: '',
      status: 'scheduled',
      priority: 'normal',
      notes: '',
      duration: 30,
    });
    setShowCreateModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
    setShowCreateModal(false);
    setSelectedAppointment(null);
    setFormState({});
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: name === 'duration' ? Number(value) : value,
    });
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedAppointment) {
      // Update existing appointment
      updateAppointmentMutation.mutate({
        appointmentId: selectedAppointment.appointment_id,
        appointmentData: formState,
      }, {
        onSuccess: handleModalClose,
      });
    }
  }

  function handleCreateFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formState.patient_id || !formState.doctor_id || !formState.appointment_date || !formState.appointment_time_slot || !formState.reason) {
      alert('Please fill in all required fields');
      return;
    }
    
    createAppointmentMutation.mutate(formState, {
      onSuccess: handleModalClose,
    });
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString;
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-yellow-100 text-yellow-800';
      case 'rescheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'emergency':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  const columns = useMemo<Array<ColumnDef<TAppointment>>>(
    () => [
      {
        header: 'ID',
        accessorKey: 'appointment_id',
      },
      {
        header: 'Patient',
        accessorKey: 'patient_name',
        cell: ({ row }) => row.original.patient_name || `Patient ${row.original.patient_id}`,
      },
      {
        header: 'Doctor',
        accessorKey: 'doctor_name',
        cell: ({ row }) => row.original.doctor_name || `Doctor ${row.original.doctor_id}`,
      },
      {
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.appointment_date || row.original.appointment_time),
      },
      {
        header: 'Time',
        cell: ({ row }) => formatTime(row.original.appointment_time_slot || ''),
      },
      {
        header: 'Reason',
        accessorKey: 'reason',
        cell: ({ row }) => (
          <div className="max-w-xs truncate" title={row.original.reason}>
            {row.original.reason}
          </div>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}>
            {row.original.status}
          </span>
        ),
      },
      {
        header: 'Priority',
        accessorKey: 'priority',
        cell: ({ row }) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(row.original.priority || 'normal')}`}>
            {row.original.priority || 'normal'}
          </span>
        ),
      },
      {
        header: 'Duration',
        cell: ({ row }) => `${row.original.duration || 30} min`,
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateAppointment(row.original)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (
                  confirm(`Are you sure you want to delete this appointment?`)
                ) {
                  deleteMutation.mutate(row.original.appointment_id)
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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
    return <div className="text-center py-8">Loading appointments...</div>

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Appointments Management
          </h1>
          <button
            onClick={handleCreateAppointment}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Create Appointment
          </button>
        </div>
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search appointments by patient, doctor, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full max-w-md"
          />
          <span className="text-sm text-gray-600">
            Showing {table.getRowModel().rows.length} of {data?.total} appointments
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
                appointments
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

      {/* Update Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Update Appointment</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  name="appointment_date"
                  type="date"
                  value={formState.appointment_date || ''}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  name="appointment_time_slot"
                  type="time"
                  value={formState.appointment_time_slot || ''}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <input
                  name="reason"
                  value={formState.reason || ''}
                  onChange={handleFormChange}
                  placeholder="Appointment reason"
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formState.status || 'scheduled'}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formState.priority || 'normal'}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  name="duration"
                  type="number"
                  min="15"
                  max="180"
                  value={formState.duration || 30}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formState.notes || ''}
                  onChange={handleFormChange}
                  placeholder="Additional notes"
                  className="border p-2 rounded w-full"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={updateAppointmentMutation.isPending}>
                  {updateAppointmentMutation.isPending ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Appointment</h2>
            <form onSubmit={handleCreateFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID *</label>
                <input
                  name="patient_id"
                  type="number"
                  value={formState.patient_id || ''}
                  onChange={handleFormChange}
                  placeholder="Enter patient ID"
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID *</label>
                <input
                  name="doctor_id"
                  type="number"
                  value={formState.doctor_id || ''}
                  onChange={handleFormChange}
                  placeholder="Enter doctor ID"
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  name="appointment_date"
                  type="date"
                  value={formState.appointment_date || ''}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  name="appointment_time_slot"
                  type="time"
                  value={formState.appointment_time_slot || ''}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <input
                  name="reason"
                  value={formState.reason || ''}
                  onChange={handleFormChange}
                  placeholder="Appointment reason"
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formState.status || 'scheduled'}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formState.priority || 'normal'}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  name="duration"
                  type="number"
                  min="15"
                  max="180"
                  value={formState.duration || 30}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formState.notes || ''}
                  onChange={handleFormChange}
                  placeholder="Additional notes"
                  className="border p-2 rounded w-full"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded" disabled={createAppointmentMutation.isPending}>
                  {createAppointmentMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
