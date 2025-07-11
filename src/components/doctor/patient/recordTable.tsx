import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { useGetRecordsQuery } from '@/hooks/doctor/recordHook';
import type { TRecord } from '@/Types/types';

export const MedicalRecordsTable = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useGetRecordsQuery();
  const records = data || [];

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = useMemo<ColumnDef<TRecord>[]>(
    () => [
      {
        header: 'Record ID',
        accessorKey: 'record_id',
        size: 100,
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
        header: 'Prescription ID',
        accessorKey: 'prescription_id',
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
        cell: ({ row }) => formatDate(row.original.created_at),
      },
      {
        header: 'Updated At',
        cell: ({ row }) => formatDate(row.original.updated_at),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      globalFilter: search,
    },
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
        Error loading medical records. Please try again.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Medical Records</h1>
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
                        header.getContext()
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          No medical records found.
        </div>
      )}
    </div>
  );
};