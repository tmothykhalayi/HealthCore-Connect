import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctor/patient/')({
  component: RouteComponent,
})

import { PatientsTable } from '@/components/doctor/patientTable'

function RouteComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      <PatientsTable />
    </div>
  )
}
