import { createFileRoute } from '@tanstack/react-router'

import { PatientsTable } from '@/components/patientsTable'

export const Route = createFileRoute('/Dashboard/admin/patients')({
  component: PatientsPage,
})

export default function PatientsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <PatientsTable />
    </div>
  )
}
