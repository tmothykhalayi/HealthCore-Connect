import { createFileRoute } from '@tanstack/react-router'

import { PatientsTable } from '@/components/patientsTable'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/patients')({
  component: PatientsPage,
})

export default function PatientsPage() {
  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <PatientsTable />
      </div>
    </DashboardLayout>
  )
}
