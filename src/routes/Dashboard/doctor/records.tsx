import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/doctor/records')({
  component: RecordsPage,
})

import { MedicalRecordsTable } from '@/components/doctor/patient/recordTable'

function RecordsPage() {
  return (
    <div>
      <MedicalRecordsTable />
    </div>
  )
}
