import { createFileRoute } from '@tanstack/react-router'

import { DoctorsTable } from '@/components/doctorsTable'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/doctors')({
  component: DoctorsPage,
})

function DoctorsPage() {
  return (
    <DashboardLayout>
      <DoctorsTable />
    </DashboardLayout>
  )
}
