import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Link } from '@tanstack/react-router'

import { PatientAppointments } from '@/components/patient/appointmentCards'
import { getUserIdHelper } from '@/lib/auth'

export const Route = createFileRoute('/Dashboard/patient/appointments')({
  component: AppointmentCard,
})

function AppointmentCard() {
  const userId = Number(getUserIdHelper())

  // Use the actual user ID as patient ID
  // In a real app, you would get the patient ID from the user's profile
  const patientId = userId

  console.log('User ID:', userId)
  console.log('Using Patient ID:', patientId)

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                My Appointments
              </h1>
              <p className="text-gray-600">
                View and manage your appointments with doctors
              </p>
            </div>
            <Link
              to="/Dashboard/patient/create-appointment"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Appointment
            </Link>
          </div>
        </div>
        <PatientAppointments patientId={patientId} />
      </div>
    </DashboardLayout>
  )
}
