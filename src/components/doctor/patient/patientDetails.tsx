import { useGetPatientDetailsQuery } from "@/hooks/doctor/patient/patientFDetailsHook";
import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";



// Define types for your prescription data
type Prescription = {
  prescription_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id: number;
  notes: string;
  // Add any other fields that might be present in your actual data
};

const PatientPrescriptionsTable = ({ patientId }: { patientId: number }) => {
  const { data, isLoading, error } = useGetPatientDetailsQuery(patientId);

  if (isLoading) return <div>Loading prescription details...</div>;
  if (error) return <div>Error loading prescription details</div>;

  // Since the API returns an array, we'll take the first item
  const prescriptions: Prescription[] = data || [];

  const columnHelper = createColumnHelper<Prescription>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("prescription_id", {
        header: "Prescription ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("doctor_id", {
        header: "Doctor ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("appointment_id", {
        header: "Appointment ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("notes", {
        header: "Notes",
        cell: (info) => (
          <div className="max-w-xs truncate hover:max-w-none">
            {info.getValue()}
          </div>
        ),
      }),
      // Add more columns as needed based on your actual data structure
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: prescriptions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Patient Prescriptions</h2>
      
      {prescriptions.length === 0 ? (
        <div className="text-gray-500">No prescriptions found for this patient</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
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
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptionsTable;