// components/PrescriptionsTable.tsx
import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  useGetPrescriptionQuery,
  useDeletePrescription,
  useCreatePrescription,
  useUpdatePrescription,
} from '@/hooks/prescription';
import type { TPrescription } from '@/Types/types';

export const PrescriptionsTable = () => {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<TPrescription | null>(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_id: '',
    notes: '',
  });

  const { data, isLoading, isError } = useGetPrescriptionQuery(
    pagination.pageIndex + 1,
    pagination.pageSize,
    search,
  );

  const deleteMutation = useDeletePrescription();
  const createMutation = useCreatePrescription();
  const updateMutation = useUpdatePrescription();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    setIsEditing(true);
    setEditingPrescription(null);
    setFormData({
      patient_id: '',
      doctor_id: '',
      appointment_id: '',
      notes: '',
    });
  };

  const handleEdit = (prescription: TPrescription) => {
    setIsEditing(true);
    setEditingPrescription(prescription);
    setFormData({
      patient_id: prescription.patient_id.toString(),
      doctor_id: prescription.doctor_id.toString(),
      appointment_id: prescription.appointment_id?.toString() || '',
      notes: prescription.notes,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingPrescription(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submissionData = {
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        appointment_id: formData.appointment_id ? parseInt(formData.appointment_id) : null,
        notes: formData.notes,
      };

      if (editingPrescription) {
        await updateMutation.mutateAsync({
          prescriptionId: editingPrescription.prescription_id,
          prescriptionData: submissionData,
        });
      } else {
        await createMutation.mutateAsync(submissionData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const columns = useMemo<ColumnDef<TPrescription>[]>(
    () => [
      {
        header: 'Prescription ID',
        accessorKey: 'prescription_id',
        size: 120,
      },
      {
        header: 'Patient ID',
        accessorKey: 'patient_id',
        size: 100,
      },
      {
        header: 'Doctor ID',
        accessorKey: 'doctor_id',
        size: 100,
      },
      {
        header: 'Appointment ID',
        accessorKey: 'appointment_id',
        size: 120,
      },
      {
        header: 'Notes',
        accessorKey: 'notes',
        cell: ({ row }) => (
          <div className="max-w-xs truncate hover:whitespace-normal hover:max-w-full">
            {row.original.notes}
          </div>
        ),
      },
      {
        header: 'Created At',
        cell: ({ row }) => formatDateTime(row.original.created_at),
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={()  => {
                if (confirm(`Are you sure you want to delete this prescription? ${row.original.prescription_id}`)) {
                  deleteMutation.mutate(row.original.prescription_id);
                }
              }}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ),
        size: 180,
      },
    ],
    [deleteMutation],
  );

  const table = useReactTable({
    data: data || [],
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
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Error loading prescriptions. Please try again.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Prescription Management</h1>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search prescriptions by notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing {table.getRowModel().rows.length} of {data?.total} prescriptions
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-6">
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
                });
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

      {/* Add/Edit Form at the bottom */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditing ? (editingPrescription ? 'Edit Prescription' : 'Create New Prescription') : 'Prescription Form'}
          </h2>
          {!isEditing && (
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              + Add New Prescription
            </button>
          )}
        </div>

        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID*
                </label>
                <input
                  type="number"
                  id="patient_id"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="doctor_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor ID*
                </label>
                <input
                  type="number"
                  id="doctor_id"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="appointment_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment ID
                </label>
                <input
                  type="number"
                  id="appointment_id"
                  name="appointment_id"
                  value={formData.appointment_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes*
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {(createMutation.isPending || updateMutation.isPending)
                  ? 'Saving...'
                  : (editingPrescription ? 'Update Prescription' : 'Create Prescription')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};