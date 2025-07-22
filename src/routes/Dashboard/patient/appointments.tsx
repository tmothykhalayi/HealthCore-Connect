import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
//import { Link } from '@tanstack/react-router'

import { PatientAppointments } from '@/components/patient/appointmentCards'
//import { getUserIdHelper } from '@/lib/auth'
import { useState, useEffect } from 'react'
import { useCreateAppointment } from '@/hooks/patient/appointment'
import useAuthStore from '@/store/auth'
import { getPatientByUserIdFn } from '@/api/patient/patient'

export const Route = createFileRoute('/Dashboard/patient/appointments')({
  component: PatientAppointmentsPage,
})

function PatientAppointmentsPage() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    doctorId: '',
    appointment_time: '',
    reason: '',
    status: 'scheduled',
  })
  const user = useAuthStore((state) => state.user)
  const { mutate: submitAppointment, isPending, isError, isSuccess } = useCreateAppointment()
  const [patientId, setPatientId] = useState<number | null>(null)

  useEffect(() => {
    const fetchPatientId = async () => {
      const userId = user?.user_id
      if (userId) {
        const patient = await getPatientByUserIdFn(Number(userId))
        setPatientId(patient?.id || null)
      }
    }
    fetchPatientId()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Fetch patient profile for the logged-in user
    const userId = user?.user_id
    if (!userId) {
      alert('User not logged in.');
      return;
    }
    const patient = await getPatientByUserIdFn(Number(userId))
    const patientId = patient?.id
    if (!patientId) {
      alert('Patient profile not found.');
      return;
    }
    const [date, time] = formData.appointment_time.split('T')
    const finalData = {
      doctorId: Number(formData.doctorId),
      patientId,
      appointmentDate: formData.appointment_time,
      appointmentTime: time || '',
      patientEmail: user?.email || '',
      duration: 30,
      reason: formData.reason,
      status: formData.status,
      date: date || '',
      time: time || '',
      title: formData.reason,
    }
    submitAppointment(finalData)
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Appointments</h1>
        </div>
        <PatientAppointments patientId={patientId} />
      </div>
    </DashboardLayout>
  )
}
