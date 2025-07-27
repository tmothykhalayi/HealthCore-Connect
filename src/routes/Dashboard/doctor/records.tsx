import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MedicalRecordsTable } from '@/components/doctor/patient/recordTable'
import { useEffect, useState } from 'react'
import { getUserIdHelper } from '@/lib/auth'
import { getDoctorByUserIdFn } from '@/API/doctor'

export const Route = createFileRoute('/Dashboard/doctor/records')({
  component: RecordsPage,
})

function RecordsPage() {
  const userId = getUserIdHelper()
  const [doctorId, setDoctorId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchDoctorId() {
      if (userId) {
        try {
          const doctorProfile = await getDoctorByUserIdFn(Number(userId))
          const doctor = (doctorProfile as any).data ? (doctorProfile as any).data : doctorProfile
          const id = Number(doctor.id)
          if (doctor && typeof id === 'number' && !isNaN(id)) {
            setDoctorId(id)
          } else {
            setDoctorId(null)
            console.error('doctor.id is invalid:', doctor.id, 'doctor:', doctor)
          }
        } catch (e) {
          console.error('Error fetching doctor profile:', e)
          setDoctorId(null)
        }
      }
    }
    fetchDoctorId()
  }, [userId])

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Medical Records</h1>
          <p className="text-gray-600">View and manage patient medical records and health information</p>
        </div>
        {doctorId !== null ? (
          <MedicalRecordsTable doctorId={doctorId} />
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading doctor profile...</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
