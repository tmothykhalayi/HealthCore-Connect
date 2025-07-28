import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getUserIdHelper } from '@/lib/auth'
import { getDoctorByUserIdFn } from '@/API/doctor'
import { useGetAppointmentsByDoctorIdQuery } from '@/hooks/doctor/appointment'
import { useGetPatientsQuery } from '@/hooks/doctor/patient'
import { addZoomMeetingToAppointmentFn } from '@/API/Appointment'
import { 
  FaCalendarAlt, 
  FaUserInjured, 
  FaFileMedical, 
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCog,
  FaVideo
} from 'react-icons/fa'

export const Route = createFileRoute('/Dashboard/doctor/')({
  component: DoctorDashboard,
})

function DoctorDashboard() {
  const userId = getUserIdHelper()
  const [doctorId, setDoctorId] = useState<number | null>(null)
  const [doctorProfile, setDoctorProfile] = useState<any>(null)

  // Fetch doctor profile and ID
  useEffect(() => {
    async function fetchDoctorData() {
      if (userId) {
        try {
          const doctorProfile = await getDoctorByUserIdFn(Number(userId))
          const doctor = (doctorProfile as any).data ? (doctorProfile as any).data : doctorProfile
          console.log('doctor:', doctor)
          const id = Number(doctor.id)
          if (doctor && typeof id === 'number' && !isNaN(id)) {
            setDoctorId(id)
            setDoctorProfile(doctor)
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
    fetchDoctorData()
  }, [userId])

  // Fetch appointments data
  const { data: appointmentsData, isLoading: appointmentsLoading } = useGetAppointmentsByDoctorIdQuery(doctorId || 0)
  const { data: patientsData, isLoading: patientsLoading } = useGetPatientsQuery()

  // Handle both array and object response formats
  const appointments = Array.isArray(appointmentsData) ? appointmentsData : appointmentsData?.data || []
  const patients = patientsData || []

  // Calculate statistics
  const totalAppointments = appointments.length
  const todayAppointments = appointments.filter((apt: any) => {
    const aptDate = new Date(apt.appointment_time)
    const today = new Date()
    return aptDate.toDateString() === today.toDateString()
  }).length

  const upcomingAppointments = appointments.filter((apt: any) => {
    const aptDate = new Date(apt.appointment_time)
    const now = new Date()
    return aptDate > now && apt.status !== 'cancelled'
  }).length

  const completedAppointments = appointments.filter((apt: any) => apt.status === 'completed').length
  const pendingAppointments = appointments.filter((apt: any) => apt.status === 'scheduled').length

  // Dashboard cards configuration
  const dashboardCards = [
    {
      title: 'Total Appointments',
      value: totalAppointments,
      icon: FaCalendarAlt,
      color: 'bg-blue-500',
      link: '/Dashboard/doctor/appointments',
      description: 'All appointments'
    },
    {
      title: 'Today\'s Appointments',
      value: todayAppointments,
      icon: FaClock,
      color: 'bg-green-500',
      link: '/Dashboard/doctor/appointments',
      description: 'Appointments today'
    },
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments,
      icon: FaExclamationTriangle,
      color: 'bg-yellow-500',
      link: '/Dashboard/doctor/appointments',
      description: 'Scheduled appointments'
    },
    {
      title: 'Completed Appointments',
      value: completedAppointments,
      icon: FaCheckCircle,
      color: 'bg-purple-500',
      link: '/Dashboard/doctor/appointments',
      description: 'Finished appointments'
    },
    {
      title: 'Total Patients',
      value: patients.length,
      icon: FaUserInjured,
      color: 'bg-indigo-500',
      link: '/Dashboard/doctor/patient',
      description: 'Registered patients'
    },
    {
      title: 'Pending Appointments',
      value: pendingAppointments,
      icon: FaChartLine,
      color: 'bg-orange-500',
      link: '/Dashboard/doctor/appointments',
      description: 'Awaiting confirmation'
    }
  ]

  const quickActions = [
    {
      title: 'View Appointments',
      description: 'Manage your appointment schedule',
      icon: FaCalendarAlt,
      link: '/Dashboard/doctor/appointments',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Patient Records',
      description: 'Access patient information and records',
      icon: FaUserInjured,
      link: '/Dashboard/doctor/patient',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Medical Records',
      description: 'View and manage medical records',
      icon: FaFileMedical,
      link: '/Dashboard/doctor/records',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Settings',
      description: 'Update your profile and preferences',
      icon: FaCog,
      link: '/Dashboard/doctor/settings',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleJoinMeeting = async (appointment: any) => {
    // Check if the appointment has Zoom meeting data from backend
    if (appointment.admin_url) {
      // Use the admin URL (start URL) for doctors
      console.log('Joining meeting using backend Zoom data:', appointment.admin_url)
      window.open(appointment.admin_url, '_blank')
    } else if (appointment.zoomMeetingId) {
      // Fallback to meeting ID if URL is not available
      const zoomUrl = `https://zoom.us/s/${appointment.zoomMeetingId}`
      console.log('Joining meeting using meeting ID:', appointment.zoomMeetingId)
      window.open(zoomUrl, '_blank')
    } else {
      // If no Zoom data is available, try to create one
      try {
        console.log('No Zoom meeting data available, creating one for appointment:', appointment.appointment_id)
        const result = await addZoomMeetingToAppointmentFn(appointment.appointment_id)
        
        if (result.data && result.data.admin_url) {
          console.log('Zoom meeting created successfully:', result.data.admin_url)
          window.open(result.data.admin_url, '_blank')
        } else {
          alert('Failed to create Zoom meeting. Please contact support.')
        }
      } catch (error) {
        console.error('Error creating Zoom meeting:', error)
        alert('Failed to create Zoom meeting. Please contact support.')
      }
    }
  }

  if (!doctorId) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctor profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {doctorProfile?.user?.firstName || 'Doctor'}!
          </h1>
          <p className="text-blue-100">
            Manage your patients, appointments, and medical records from your dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color} text-white`}>
                  <card.icon size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`${action.color} text-white p-4 rounded-lg hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <action.icon size={20} />
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Appointments</h2>
            <Link
              to="/Dashboard/doctor/appointments"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all appointments →
            </Link>
          </div>
          
          {appointmentsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Appointment Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.slice(0, 5).map((appointment: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.patient_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(appointment.appointment_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="truncate max-w-xs inline-block">
                          {appointment.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleJoinMeeting(appointment)}
                          disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                            appointment.status === 'cancelled' || appointment.status === 'completed'
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                          }`}
                          title={
                            appointment.status === 'cancelled' || appointment.status === 'completed'
                              ? 'Meeting not available'
                              : 'Join Zoom Meeting'
                          }
                        >
                          <FaVideo className="mr-1" size={12} />
                          {appointment.status === 'cancelled' || appointment.status === 'completed'
                            ? 'Unavailable'
                            : 'Join Meeting'
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DoctorDashboard 