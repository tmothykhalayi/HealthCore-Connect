import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useGetPatientPrescriptionsQuery } from '@/hooks/doctor/patient/patient'
import { getUserIdHelper } from '@/lib/auth'

export const Route = createFileRoute('/Dashboard/patient/prescriptions')({
  component: PrescriptionsPage,
})

function PrescriptionsPage() {
  const userId = Number(getUserIdHelper())

  // For testing, use a valid patient ID that has prescriptions in the database
  // In a real app, you would get the patient ID from the user's profile
  const patientId = 1 // Using patient ID 1 which has prescriptions in the sample data

  const { data: prescriptions, isLoading, isError } = useGetPatientPrescriptionsQuery(patientId)

  console.log('User ID:', userId)
  console.log('Using Patient ID:', patientId)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            Error loading prescriptions. Please try again.
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            My Prescriptions
          </h1>
          <p className="text-gray-600">
            View all your prescriptions from doctors
          </p>
        </div>

        {!prescriptions || prescriptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500">No prescriptions found.</p>
            <p className="text-gray-400 text-sm">
              Your prescriptions will appear here after your doctor creates them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription: any) => (
              <div
                key={prescription.prescription_id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Prescription #{prescription.prescription_id}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(prescription.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Doctor ID</h3>
                    <p className="text-gray-800">{prescription.doctor_id}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Appointment ID</h3>
                    <p className="text-gray-800">{prescription.appointment_id || 'N/A'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {prescription.notes || 'No notes provided'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 