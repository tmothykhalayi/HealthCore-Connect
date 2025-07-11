import { useGetPatientsQuery } from '@/hooks/doctor/patient'
import { useNavigate } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'



export function PatientsTable() {

    // Define the patient type
type Patient = {
  patient_id: number
  name: string
  email: string
  dob: string
  gender: string
  phone: string
  address: string
}

// Define table columns
const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'patient_id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const patient = row.original
      const navigate = useNavigate()

      return (
        <button
          onClick={() => navigate({ to: `/dashboard/doctor/patient/${patient.patient_id}`})}
          className="px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-600"
        >
          View Details
        </button>
      )
    },
  },
]
  const { data, isLoading, isError } = useGetPatientsQuery()

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <div>Loading patients...</div>
  if (isError) return <div>Error loading patients</div>

  return (
    <div className="p-2 max-w-6xl mx-auto">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
