import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { PatientMedicalRecordsTable } from '@/components/patient/medicalRecordsTable'
import { getUserIdHelper } from '@/lib/auth'

export const Route = createFileRoute('/Dashboard/patient/medical-records')({
  component: MedicalRecordsPage,
})

function MedicalRecordsPage() {
  const userId = Number(getUserIdHelper())

  // For testing, use a valid patient ID that has records in the database
  // In a real app, you would get the patient ID from the user's profile
  const patientId = 1 // Using patient ID 1 which has records in the sample data

  console.log('User ID:', userId)
  console.log('Using Patient ID:', patientId)

  return (
    <DashboardLayout>
      <div className="p-4">
        <PatientMedicalRecordsTable patientId={patientId} />
      </div>
    </DashboardLayout>
  )
} 