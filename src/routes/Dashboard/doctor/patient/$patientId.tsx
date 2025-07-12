import { useGetPatientPrescriptionsQuery } from '@/hooks/doctor/patient/patientId'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctor/patient/$patientId')({
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams({ from: '/dashboard/doctor/patient/$patientId' })
  const patientId = param.patientId
  const { data, isLoading } = useGetPatientPrescriptionsQuery(Number(patientId))

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No prescriptions found for this patient.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Prescriptions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((prescription: any) => (
          <div key={prescription.prescription_id} className="bg-yellow-100 rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Prescription #{prescription.prescription_id}</h2>
              <span className="text-sm text-gray-500">
                {new Date(prescription.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient ID</h3>
                <p>{prescription.patient_id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Doctor ID</h3>
                <p>{prescription.doctor_id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Appointment ID</h3>
                <p>{prescription.appointment_id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="whitespace-pre-wrap">{prescription.notes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}