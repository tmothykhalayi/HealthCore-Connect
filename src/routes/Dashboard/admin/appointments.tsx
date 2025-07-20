import { createFileRoute } from '@tanstack/react-router'
import { AppointmentsTable } from '@/components/appointmentsTable'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/appointments')({
  component: AppointmentsPage,
})

function AppointmentsPage() {
  return (
    <DashboardLayout>
      <AppointmentsTable />
    </DashboardLayout>
  )
}
