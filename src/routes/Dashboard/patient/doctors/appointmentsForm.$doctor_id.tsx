import { useState } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useCreateAppointment } from '@/hooks/patient/appointment'
import useAuthStore from '@/store/auth'
import { getPatientByUserIdFn } from '@/api/patient/patient'
import { useEffect } from 'react'

export const Route = createFileRoute(
  '/Dashboard/patient/doctors/appointmentsForm/$doctor_id',
)({
  component: AppointmentForm,
})

interface AppointmentFormProps {
  doctorId?: number;
  onSuccess?: () => void;
}
function AppointmentForm({ doctorId, onSuccess }: AppointmentFormProps) {
  const {
    mutate: submitAppointment,
    isPending,
    isError,
    isSuccess,
  } = useCreateAppointment()
  const { doctor_id } = useParams({ strict: false })
  const doctorIdNumber = typeof doctorId === 'number' ? doctorId : Number(doctor_id)
  const patient_id = useAuthStore((state) => state.user?.user_id)
  const user = useAuthStore((state) => state.user)

  const [patientId, setPatientId] = useState<number | null>(null)
  const [loadingPatient, setLoadingPatient] = useState(true)

  useEffect(() => {
    async function fetchPatient() {
      setLoadingPatient(true)
      try {
        if (user?.user_id) {
          const patientProfile = await getPatientByUserIdFn(Number(user.user_id))
          setPatientId(patientProfile?.id || null)
        } else {
          setPatientId(null)
        }
      } catch (err) {
        setPatientId(null)
      } finally {
        setLoadingPatient(false)
      }
    }
    fetchPatient()
  }, [user?.user_id])

  const patientEmail = user?.email || '';

  const [formData, setFormData] = useState({
    appointment_time: '',
    reason: '',
    status: 'scheduled',
  })

  const [error, setError] = useState<string | null>(null)

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
    setError(null)
    if (loadingPatient) {
      setError('Loading patient profile. Please wait.')
      return
    }
    if (typeof patientId !== 'number' || isNaN(patientId)) {
      setError('Patient profile not found. Please complete your profile or contact support.')
      return
    }
    // Parse date and time from datetime-local input
    const [date, time] = formData.appointment_time.split('T')
    const appointmentDateISO = formData.appointment_time
      ? new Date(formData.appointment_time).toISOString()
      : ''
    const finalData = {
      doctorId: doctorIdNumber,
      patientId: patientId,
      appointmentDate: appointmentDateISO,
      appointmentTime: time || '',
      patientEmail: patientEmail,
      duration: 30,
      reason: formData.reason,
      status: formData.status,
      date: date || '',
      time: time || '',
      title: 'Consultation',
    }
    submitAppointment(finalData, {
      onSuccess: () => {
        if (onSuccess) onSuccess()
      },
    })
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
        {loadingPatient && (
          <div className="mb-2 p-2 bg-yellow-100 text-yellow-700 rounded">Loading patient profile...</div>
        )}
        {error && (
          <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}
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
