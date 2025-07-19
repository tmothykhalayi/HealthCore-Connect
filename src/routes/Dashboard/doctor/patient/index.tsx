import { createFileRoute } from '@tanstack/react-router'

import { PatientsTable } from '@/components/doctor/patientTable'

export const Route = createFileRoute('/Dashboard/doctor/patient/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      <PatientsTable />
    </div>
  )
}
