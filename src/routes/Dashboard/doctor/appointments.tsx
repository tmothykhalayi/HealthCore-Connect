import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctor/appointments')({
  component: AppointmentsPage,
})

// pages/appointments.tsx
import { DoctorsAppointmentsTable } from '@/components/doctor/appointmentsTable'
import { getUserIdHelper } from '@/lib/authHelper'
function AppointmentsPage() {
  const doctorIdString = getUserIdHelper()
  const doctorId = doctorIdString !== null ? Number(doctorIdString) : undefined

  return (
    <div className="container mx-auto py-10">
      {doctorId !== undefined ? (
        <DoctorsAppointmentsTable doctorId={doctorId} />
      ) : (
        <div>Doctor ID not found.</div>
      )}
    </div>
  )
}

export default AppointmentsPage
