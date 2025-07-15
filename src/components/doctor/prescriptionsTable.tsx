import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState
} from '@tanstack/react-table';
import { useGetPrescriptionQuery, useDeletePrescription } from '@/hooks/prescription';
import type { TPrescription } from '@/Types/types';

const PrescriptionTable = () => {
  // State for pagination and search
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');

  // Fetch data using the query hook
  const { data, isLoading, isError } = useGetPrescriptionQuery(
    pageIndex + 1, // API expects 1-based index
    pageSize,
    search
  );

  // Delete mutation
  const deletePrescription = useDeletePrescription();

  // Columns definition
  const columns = useMemo<ColumnDef<TPrescription>[]>(
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
          const notes = getValue() as string;
          return notes.length > 50 ? `${notes.substring(0, 50)}...` : notes;
        },
      },
      {
        header: 'Created At',
        accessorKey: 'created_at',
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return date.toLocaleDateString();
        },
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this prescription?')) {
                deletePrescription.mutate(row.original.prescription_id);
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
    [deletePrescription]
  );

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
  });

  if (isLoading) return <div>Loading prescriptions...</div>;
  if (isError) return <div>Error loading prescriptions</div>;

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
            setSearch(e.target.value);
            setPagination({ pageIndex: 0, pageSize });
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
                      header.getContext()
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
            table.setPageSize(Number(e.target.value));
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
    </div>
  );
};

export default PrescriptionTable;