import { useMemo, useState, useEffect } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import type {ColumnDef} from '@tanstack/react-table';

import type { TRecord, CreateRecordData } from '@/types/alltypes'
import { useGetRecordsQuery } from '@/hooks/doctor/medicalrecords'
import { useCreateRecord, useUpdateRecord, useDeleteRecord } from '@/hooks/medicalrecords'
import { useGetPatientsQuery } from '@/hooks/doctor/patient'
import { useGetDoctorQuery } from '@/hooks/doctor'

interface MedicalRecordsTableProps {
  doctorId: number
}

export const MedicalRecordsTable = ({ doctorId }: MedicalRecordsTableProps) => {
  const [search, setSearch] = useState('')
  const { data, isLoading, isError } = useGetRecordsQuery()
  const records = Array.isArray(data) ? data : data?.data || []

  // CRUD hooks
  const createMutation = useCreateRecord()
  const updateMutation = useUpdateRecord()
  const deleteMutation = useDeleteRecord()

  // Modal and form state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TRecord | null>(null)
  const [formData, setFormData] = useState<CreateRecordData>({
    patientId: 1,
    doctorId: doctorId,
    recordType: 'diagnosis',
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
    priority: 'normal',
    status: 'active',
  })

  const { data: patientsData } = useGetPatientsQuery();
  const { data: doctorsData } = useGetDoctorQuery(1, 100, '');
  const patients = patientsData || [];
  const doctors = doctorsData?.data || [];

  // Update formData when doctorId changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      doctorId: doctorId
    }))
  }, [doctorId])

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
      { header: 'Record ID', accessorKey: 'id', size: 80 },
      { header: 'Patient ID', accessorKey: 'patientId', size: 80 },
      { header: 'Doctor ID', accessorKey: 'doctorId', size: 80 },
      { header: 'Appointment ID', accessorKey: 'appointmentId', size: 100 },
      { header: 'Type', accessorKey: 'recordType', size: 100 },
      { header: 'Title', accessorKey: 'title', size: 120 },
      { header: 'Description', accessorKey: 'description', cell: ({ row }) => (<div className="max-w-md line-clamp-2">{row.original.description}</div>) },
      { header: 'Diagnosis', accessorKey: 'diagnosis', size: 120 },
      { header: 'Treatment', accessorKey: 'treatment', size: 120 },
      { header: 'Priority', accessorKey: 'priority', size: 80 },
      { header: 'Status', accessorKey: 'status', size: 80 },
      { header: 'Notes', accessorKey: 'notes', size: 120 },
      { header: 'Created At', cell: ({ row }) => formatDate(row.original.createdAt) },
      { header: 'Updated At', cell: ({ row }) => formatDate(row.original.updatedAt) },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >Edit</button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
              disabled={deleteMutation.isPending}
            >{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</button>
          </div>
        ),
        size: 150,
      },
    ],
    [deleteMutation.isPending]
  )

  const handleCreateRecord = () => {
    if (!formData.title || !formData.description || !formData.patientId || !formData.doctorId) {
      alert('Please fill in all required fields')
      return
    }
    createMutation.mutate(formData, {
      onSuccess: () => {
        alert('Medical record created successfully!')
        setIsCreateModalOpen(false)
        setFormData({
          patientId: patients.length > 0 ? patients[0].patient_id : 1,
          doctorId: doctorId,
          recordType: 'diagnosis',
          title: '',
          description: '',
          diagnosis: '',
          treatment: '',
          priority: 'normal',
          status: 'active',
        })
      },
      onError: (error) => {
        alert('Failed to create medical record. Please try again.')
      }
    })
  }

  const handleEdit = (record: TRecord) => {
    setEditingRecord(record)
    setFormData({
      patientId: record.patientId,
      doctorId: doctorId, // Always use current doctor's ID
      recordType: record.recordType,
      title: record.title,
      description: record.description,
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      priority: record.priority,
      status: record.status,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateRecord = () => {
    if (!editingRecord) return
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields')
      return
    }
    // Ensure nextAppointmentDate is a valid ISO 8601 string if present
    let recordData = { ...formData }
    if (recordData.nextAppointmentDate) {
      // Try to convert to ISO string if not already
      const date = new Date(recordData.nextAppointmentDate)
      if (!isNaN(date.getTime())) {
        recordData.nextAppointmentDate = date.toISOString().split('T')[0]
      } else {
        // If invalid, remove it to avoid backend error
        delete recordData.nextAppointmentDate
      }
    }
    updateMutation.mutate(
      { recordId: editingRecord.id, recordData },
      {
        onSuccess: () => {
          alert('Medical record updated successfully!')
          setIsEditModalOpen(false)
          setEditingRecord(null)
          setFormData({
            patientId: patients.length > 0 ? patients[0].patient_id : 1,
            doctorId: doctorId,
            recordType: 'diagnosis',
            title: '',
            description: '',
            diagnosis: '',
            treatment: '',
            priority: 'normal',
            status: 'active',
          })
        },
        onError: (error) => {
          alert('Failed to update medical record. Please try again.')
        }
      }
    )
  }

  const handleDelete = (recordId: number) => {
    if (confirm('Are you sure you want to delete this medical record?')) {
      deleteMutation.mutate(recordId, {
        onSuccess: () => {
          alert('Medical record deleted successfully!')
        },
        onError: (error) => {
          alert('Failed to delete medical record. Please try again.')
        }
      })
    }
  }

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
          Medical Records
        </h1>
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search records by description, IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Create Record
          </button>
        </div>
      </div>

      {/* Table and modals */}
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

      {Array.isArray(records) && records.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No medical records found.
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Create Medical Record</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleCreateRecord();
              }}
            >
              <select
                value={formData.patientId}
                onChange={e => setFormData({ ...formData, patientId: Number(e.target.value) })}
                className="w-full mb-2 p-2 border rounded"
                required
              >
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.patient_id} value={p.patient_id}>
                    {p.name} (ID: {p.patient_id})
                  </option>
                ))}
              </select>
              <div className="w-full mb-2 p-2 border rounded bg-gray-100">
                <label className="text-sm text-gray-600">Doctor ID</label>
                <div className="text-gray-800 font-medium">{doctorId}</div>
              </div>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Diagnosis"
                value={formData.diagnosis}
                onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Treatment"
                value={formData.treatment}
                onChange={e => setFormData({ ...formData, treatment: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >Cancel</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={createMutation.isPending}
                >{createMutation.isPending ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Medical Record</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleUpdateRecord();
              }}
            >
              <select
                value={formData.patientId}
                onChange={e => setFormData({ ...formData, patientId: Number(e.target.value) })}
                className="w-full mb-2 p-2 border rounded"
                required
              >
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.patient_id} value={p.patient_id}>
                    {p.name} (ID: {p.patient_id})
                  </option>
                ))}
              </select>
              <div className="w-full mb-2 p-2 border rounded bg-gray-100">
                <label className="text-sm text-gray-600">Doctor ID</label>
                <div className="text-gray-800 font-medium">{doctorId}</div>
              </div>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Diagnosis"
                value={formData.diagnosis}
                onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Treatment"
                value={formData.treatment}
                onChange={e => setFormData({ ...formData, treatment: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >Cancel</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={updateMutation.isPending}
                >{updateMutation.isPending ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
