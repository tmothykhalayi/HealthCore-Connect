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
        <MedicalRecordsTable />
      </div>
    </DashboardLayout>
  )
}
