import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Link } from '@tanstack/react-router'

import { PatientAppointments } from '@/components/patient/appointmentCards'
import { getUserIdHelper } from '@/lib/auth'
import { useState } from 'react'
import { useCreateAppointment } from '@/hooks/patient/appointment'
import useAuthStore from '@/store/auth'

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
  const patientId = user?.user_id
  const { mutate: submitAppointment, isPending, isError, isSuccess } = useCreateAppointment()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const [date, time] = formData.appointment_time.split('T')
    const finalData = {
      doctorId: Number(formData.doctorId),
      patientId: Number(patientId),
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
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setShowForm(true)}
          >
            Book Appointment
          </button>
        </div>
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID</label>
                  <input
                    type="number"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isPending ? 'Booking...' : 'Book'}
                  </button>
                </div>
                {isError && <div className="text-red-600 mt-2">Error booking appointment. Please try again.</div>}
                {isSuccess && <div className="text-green-600 mt-2">Appointment booked successfully!</div>}
              </form>
            </div>
          </div>
        )}
        <PatientAppointments />
      </div>
    </DashboardLayout>
  )
}
