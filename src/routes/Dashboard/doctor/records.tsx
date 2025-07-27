import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MedicalRecordsTable } from '@/components/doctor/patient/recordTable'

export const Route = createFileRoute('/Dashboard/doctor/records')({
  component: RecordsPage,
})

function RecordsPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Medical Records</h1>
          <p className="text-gray-600">View and manage patient medical records and health information</p>
        </div>
        <MedicalRecordsTable />
      </div>
    </DashboardLayout>
  )
}
