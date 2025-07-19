import { createFileRoute } from '@tanstack/react-router'

import { MedicalRecordsTable } from '@/components/doctor/patient/recordTable'

export const Route = createFileRoute('/Dashboard/doctor/records')({
  component: RecordsPage,
})

function RecordsPage() {
  return (
    <div>
      <MedicalRecordsTable />
    </div>
  )
}
