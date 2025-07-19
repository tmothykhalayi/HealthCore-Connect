import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/patient/appointments')({
  component: AppointmentCard,
})

import { PatientAppointments } from '@/components/patient/appointmentCards'
import { getUserIdHelper } from '@/lib/auth'

function AppointmentCard() {
  const userId = Number(getUserIdHelper())

  // For testing, use a valid patient ID that has appointments in the database
  // In a real app, you would get the patient ID from the user's profile
  const patientId = 1 // Using patient ID 1 which has appointments in the sample data

  console.log('User ID:', userId)
  console.log('Using Patient ID:', patientId)

  return (
    <DashboardLayout>
      <div className="p-4">
        <PatientAppointments patientId={patientId} />
      </div>
    </DashboardLayout>
  )
}
