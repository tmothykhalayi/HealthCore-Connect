import { useGetAppointmentsByIdQuery } from '@/hooks/patient/appointment'
import { useGetDoctorById } from '@/hooks/doctor'
import { useState } from 'react'
import { FaCalendarAlt, FaClock, FaUserMd, FaTimes, FaEdit, FaEye } from 'react-icons/fa'

interface AppointmentCardProps {
  appointment: {
    id: number
    patientId: number
    doctorId: number
    appointmentDate: string
    appointmentTime: string
    status: string
    reason: string
    createdAt: string
  }
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const [showActions, setShowActions] = useState(false)
  
  // Fetch doctor information
  const { data: doctor, isLoading: doctorLoading } = useGetDoctorById(appointment.doctorId)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getStatusColor = (status: string | undefined) => {
    if (!status) {
      return 'bg-gray-100 text-gray-800'
    }

    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isUpcoming = new Date(appointment.appointmentDate) > new Date() && appointment.status !== 'cancelled'
  const canCancel = isUpcoming && ['scheduled', 'confirmed', 'pending'].includes(appointment.status.toLowerCase())

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Appointment #{appointment.id}
        </h3>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              appointment.status,
            )}`}
          >
            {appointment.status}
          </span>
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <FaEdit size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Doctor Information */}
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <FaUserMd className="text-blue-600" size={20} />
          <div className="flex-1">
            {doctorLoading ? (
              <p className="text-sm text-gray-600">Loading doctor info...</p>
            ) : doctor ? (
              <div>
                <p className="font-medium text-gray-800">
                  Dr. {doctor.firstName} {doctor.lastName}
                </p>
                <p className="text-sm text-gray-600">{doctor.specialization}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Doctor ID: {appointment.doctorId}</p>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center space-x-3">
          <FaCalendarAlt className="text-gray-400" size={16} />
          <span className="text-gray-600">{formatDate(appointment.appointmentDate)}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <FaClock className="text-gray-400" size={16} />
          <span className="text-gray-600">{formatTime(appointment.appointmentTime)}</span>
        </div>

        {/* Reason */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Reason:</span> {appointment.reason}
          </p>
        </div>

        {/* Created Date */}
        <p className="text-gray-500 text-sm">
          <span className="font-medium">Created:</span>{' '}
          {formatDate(appointment.createdAt)}
        </p>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <FaEye size={14} />
            <span>View Details</span>
          </button>
          
          {canCancel && (
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              <FaTimes size={14} />
              <span>Cancel Appointment</span>
            </button>
          )}
          
          {isUpcoming && (
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
              <FaEdit size={14} />
              <span>Reschedule</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export const PatientAppointments = ({ patientId }: { patientId: number }) => {
  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useGetAppointmentsByIdQuery(patientId)

  console.log('Appointments Data:', appointments)
  console.log('Patient ID:', patientId)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Appointments</h3>
          <p className="text-red-700 text-sm">{error?.message || 'Failed to load appointments'}</p>
        </div>
      </div>
    )
  }

  // Check if appointments exists and is an array
  const appointmentsArray = Array.isArray(appointments) ? appointments : appointments ? [appointments] : []

  if (!appointmentsArray || appointmentsArray.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments Found</h3>
        <p className="text-gray-500 mb-4">
          You don't have any appointments scheduled at the moment.
        </p>
        <p className="text-gray-400 text-sm">
          Contact your doctor to schedule an appointment or check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Your Appointments ({appointmentsArray.length})
          </h2>
          <p className="text-sm text-gray-600">
            Manage and view your scheduled appointments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointmentsArray.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </div>
    </div>
  )
}

export default PatientAppointments
