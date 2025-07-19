import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'

// pages/appointments.tsx
import { DoctorsAppointmentsTable } from '@/components/doctor/appointmentsTable'
import { getUserIdHelper } from '@/lib/auth'

export const Route = createFileRoute('/Dashboard/doctor/appointments')({
  component: AppointmentsPage,
})
function AppointmentsPage() {
  const doctorIdString = getUserIdHelper()
  const doctorId = doctorIdString !== null ? Number(doctorIdString) : undefined

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        {doctorId !== undefined ? (
          <DoctorsAppointmentsTable doctorId={doctorId} />
        ) : (
          <div>Doctor ID not found.</div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AppointmentsPage
