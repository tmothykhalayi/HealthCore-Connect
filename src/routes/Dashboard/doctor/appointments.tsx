import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useEffect, useState } from 'react'
import { getDoctorByUserIdFn } from '@/api/doctor'

// pages/appointments.tsx
import { DoctorsAppointmentsTable } from '@/components/doctor/appointmentsTable'
import { getUserIdHelper } from '@/lib/auth'

export const Route = createFileRoute('/Dashboard/doctor/appointments')({
  component: AppointmentsPage,
})
function AppointmentsPage() {
  const userId = getUserIdHelper()
  const [doctorId, setDoctorId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchDoctorId() {
      if (userId) {
        try {
          const doctorProfile = await getDoctorByUserIdFn(Number(userId))
          // If backend wraps doctor in a 'data' field, adjust accordingly
          const doctor = doctorProfile.data ? doctorProfile.data : doctorProfile
          setDoctorId(doctor.id)
        } catch (e) {
          setDoctorId(null)
        }
      }
    }
    fetchDoctorId()
  }, [userId])

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        {doctorId !== null ? (
          <DoctorsAppointmentsTable doctorId={doctorId} />
        ) : (
          <div>Doctor ID not found.</div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AppointmentsPage
