import { createFileRoute } from '@tanstack/react-router'

// pages/appointments.tsx
import { AppointmentsTable } from '@/components/appointmentsTable'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/appointments')({
  component: AppointmentsPage,
})

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <AppointmentsTable />
      </div>
    </DashboardLayout>
  )
}
