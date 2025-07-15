import { useState } from 'react'
import { useCreateAppointment } from '@/hooks/patients/appointmentHook'
import useAuthStore from '@/store/authStore'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/patient/doctors/appointmentsForm/$doctor_id',
)({
  component: AppointmentForm,
})

function AppointmentForm() {
  const {
    mutate: submitAppointment,
    isPending,
    isError,
    isSuccess,
  } = useCreateAppointment()
  const { doctor_id } = useParams({ strict: false })
  const doctorIdNumber = Number(doctor_id)
  const patient_id = useAuthStore((state) => state.user?.user_id)

  const [formData, setFormData] = useState({
    appointment_time: '', // Changed from appointmentDate
    reason: '',
    status: 'scheduled', // Added status to form state
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting appointment with data:', formData)

    const finalData = {
      doctor_id: doctorIdNumber,
      patient_id: Number(patient_id),
      status: formData.status,
      reason: formData.reason,
      appointment_time: new Date(formData.appointment_time), // Convert to Date object
      created_at: new Date(), // Add current timestamp
    }
    
    submitAppointment(finalData)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Book an Appointment
      </h2>

      {isError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error submitting appointment. Please try again.
        </div>
      )}

      {isSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Appointment booked successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700"
          >
            Reason for Appointment
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Enter the reason for the appointment"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <label
            htmlFor="appointment_time"
            className="block text-sm font-medium text-gray-700"
          >
            Appointment Date & Time
          </label>
          <input
            type="datetime-local"
            id="appointment_time"
            name="appointment_time"
            value={formData.appointment_time}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isPending ? 'Submitting...' : 'Submit Appointment'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AppointmentForm