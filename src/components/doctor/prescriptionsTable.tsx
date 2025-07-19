import { useMemo, useState } from 'react'
import {
  
  
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef, PaginationState} from '@tanstack/react-table';
import type { TPrescription } from '@/types/alltypes'
import {
  useDeletePrescription,
  useGetPrescriptionQuery,
} from '@/hooks/prescription'
import { useCreatePrescription } from '@/hooks/doctor/prescription'

const PrescriptionTable = () => {
  // State for pagination and search
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_id: '',
    notes: '',
  })

  // Fetch data using the query hook
  const { data, isLoading, isError } = useGetPrescriptionQuery(
    pageIndex + 1, // API expects 1-based index
    pageSize,
    search,
  )

  // Mutations
  const deletePrescription = useDeletePrescription()
  const createPrescription = useCreatePrescription()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createPrescription.mutateAsync({
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        appointment_id: formData.appointment_id
          ? parseInt(formData.appointment_id)
          : null,
        notes: formData.notes,
      })
      // Reset form and hide it after successful submission
      setFormData({
        patient_id: '',
        doctor_id: '',
        appointment_id: '',
        notes: '',
      })
      setShowForm(false)
    } catch (error) {
      console.error('Error creating prescription:', error)
    }
  }

  // Columns definition
  const columns = useMemo<Array<ColumnDef<TPrescription>>>(
    () => [
      {
        header: 'Prescription ID',
        accessorKey: 'prescription_id',
      },
      {
        header: 'Patient ID',
        accessorKey: 'patient_id',
      },
      {
        header: 'Doctor ID',
        accessorKey: 'doctor_id',
      },
      {
        header: 'Appointment ID',
        accessorKey: 'appointment_id',
      },
      {
        header: 'Notes',
        accessorKey: 'notes',
        cell: ({ getValue }) => {
          const notes = getValue() as string
          return notes.length > 50 ? `${notes.substring(0, 50)}...` : notes
        },
      },
      {
        header: 'Created At',
        accessorKey: 'created_at',
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string)
          return date.toLocaleDateString()
        },
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <button
            onClick={() => {
              if (
                confirm('Are you sure you want to delete this prescription?')
              ) {
                deletePrescription.mutate(row.original.prescription_id)
              }
            }}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={deletePrescription.isPending}
          >
            {deletePrescription.isPending ? 'Deleting...' : 'Delete'}
          </button>
        ),
      },
    ],
    [deletePrescription],
  )

  // Table instance
  const table = useReactTable({
    data: data || [],
    columns,
    pageCount: data?.total ? Math.ceil(data.total / pageSize) : -1,
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  })

  if (isLoading) return <div>Loading prescriptions...</div>
  if (isError) return <div>Error loading prescriptions</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Prescriptions</h1>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search prescriptions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPagination({ pageIndex: 0, pageSize })
          }}
          className="p-2 border rounded w-full max-w-md"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 text-left border">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ›
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            »
          </button>
        </div>

        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
          className="p-1 border rounded"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {/* Add Prescription Form */}
      <div className="mt-8 border-t pt-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add New Prescription
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <h2 className="text-xl font-semibold">Add New Prescription</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Patient ID*</label>
                <input
                  type="number"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Doctor ID*</label>
                <input
                  type="number"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Appointment ID</label>
                <input
                  type="number"
                  name="appointment_id"
                  value={formData.appointment_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Notes*</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createPrescription.isPending}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {createPrescription.isPending
                  ? 'Saving...'
                  : 'Save Prescription'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default PrescriptionTable
