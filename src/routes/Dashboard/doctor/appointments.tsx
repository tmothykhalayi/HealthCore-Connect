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
          const doctor = (doctorProfile as any).data ? (doctorProfile as any).data : doctorProfile;
          console.log('doctor:', doctor);
          console.log('doctor.id:', doctor.id);
          const id = Number(doctor.id);
          if (doctor && typeof id === 'number' && !isNaN(id)) {
            setDoctorId(id);
          } else {
            setDoctorId(null);
            console.error('doctor.id is invalid:', doctor.id, 'doctor:', doctor);
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
