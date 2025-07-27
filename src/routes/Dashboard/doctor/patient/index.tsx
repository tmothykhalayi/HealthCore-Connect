import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { PatientsTable } from '@/components/doctor/patientTable'
import { useEffect, useState } from 'react'
import { getUserIdHelper } from '@/lib/auth'
import { getDoctorByUserIdFn } from '@/api/doctor'

export const Route = createFileRoute('/Dashboard/doctor/patient/')({
  component: PatientsPage,
})

function PatientsPage() {
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
          setDoctorId(null)
        }
      }
    }
    fetchDoctorId()
  }, [userId])

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Patients</h1>
        {doctorId !== null ? (
          <PatientsTable />
        ) : (
          <div>Doctor ID not found.</div>
        )}
      </div>
    </DashboardLayout>
  )
}
