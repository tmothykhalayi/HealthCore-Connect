import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useCreateAppointment } from '@/hooks/patient/appointment'
import { useGetDoctorQuery } from '@/hooks/patient/doctor'
import { getUserIdHelper } from '@/lib/auth'

export const Route = createFileRoute('/Dashboard/patient/create-appointment')({
  component: CreateAppointmentPage,
})

function CreateAppointmentPage() {
  const navigate = useNavigate()
  const {
    mutate: submitAppointment,
    isPending,
    isError,
    isSuccess,
  } = useCreateAppointment()
  
  const { data: doctors, isLoading: doctorsLoading } = useGetDoctorQuery()
  const patientId = Number(getUserIdHelper())

  console.log('Doctors data:', doctors)
  console.log('Doctors loading:', doctorsLoading)

  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    status: 'scheduled',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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

    // Validate that a doctor is selected
    if (!formData.doctorId) {
      alert('Please select a doctor')
      return
    }

    const doctorId = Number(formData.doctorId)
    if (isNaN(doctorId) || doctorId <= 0) {
      alert('Please select a valid doctor')
      return
    }

    // For now, we'll use the user ID as patient ID, but this should be improved
    // In a real app, you would get the patient ID from the user's profile
    const patientId = Number(getUserIdHelper())

    // Combine date and time into a single string (YYYY-MM-DDTHH:mm)
    let appointmentDate = formData.appointmentDate
    if (formData.appointmentDate && formData.appointmentTime) {
      appointmentDate = `${formData.appointmentDate}T${formData.appointmentTime}`
    }

    const finalData = {
      doctorId: doctorId,
      patientId: patientId,
      appointmentDate: appointmentDate, // always a string
      appointmentTime: formData.appointmentTime,
      patientEmail: 'patient@example.com', // This should come from user profile
      duration: 30, // Default duration
      reason: formData.reason,
      status: formData.status,
      date: formData.appointmentDate,
      time: formData.appointmentTime,
      title: `Appointment with Doctor ${doctorId}`,
    }

    console.log('Final appointment data:', finalData)
    console.log('User ID (used as patient ID):', patientId)

    submitAppointment(finalData, {
      onSuccess: () => {
        // Navigate back to appointments page after successful creation
        setTimeout(() => {
          navigate({ to: '/Dashboard/patient/appointments' })
        }, 2000)
      },
      onError: (error) => {
        console.error('Appointment creation failed:', error)
        // Check if it's a patient not found error
        if (error.message && error.message.includes('Patient with ID')) {
          alert('Patient profile not found. Please contact support to set up your patient profile.')
        } else {
          alert('Failed to create appointment. Please try again.')
        }
      }
    })
  }

  if (doctorsLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Create New Appointment
            </h1>
            <p className="text-gray-600">
              Schedule an appointment with one of our doctors
            </p>
          </div>

          {isError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error creating appointment
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    Please try again or contact support if the problem persists.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Appointment created successfully!
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    Redirecting you to appointments page...
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor
                </label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors && doctors.length > 0 ? (
                    doctors.map((doctor: any) => (
                      <option key={doctor.doctor_id} value={doctor.doctor_id}>
                        Dr. {doctor.name} - {doctor.specialization} (${doctor.consultation_fee})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No doctors available</option>
                  )}
                </select>
                {doctors && doctors.length === 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    No doctors are currently available. Please contact support.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Time
                  </label>
                  <input
                    type="time"
                    id="appointmentTime"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Appointment
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Please describe the reason for your appointment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate({ to: '/Dashboard/patient/appointments' })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isPending ? 'Creating...' : 'Create Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 