import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Link } from '@tanstack/react-router'
import { useGetPatientAppointmentsQuery } from '@/hooks/patient/appointment'
import { FaCalendarAlt, FaUserMd, FaPills, FaFileMedical, FaShoppingCart, FaCog, FaCreditCard } from 'react-icons/fa'
import { SiZoom } from 'react-icons/si'
import { useEffect, useState } from 'react'
import { getUserIdHelper } from '@/lib/auth'
import { getPatientByUserIdFn } from '@/api/patient/patient'
import { PatientMedicalRecordsTable } from '@/components/patient/medicalRecordsTable'
import { useGetPrescriptionQuery } from '@/hooks/prescription'
import { getPharmacyOrdersFn } from '@/api/patient/orders'
import { getDoctorsFn } from '@/api/patient/doctor/doctor'
import { useGetMedicineQuery } from '@/hooks/patient/medicine'
import { useRescheduleAppointment } from '@/hooks/patient/appointment'
import { MedicinesTable } from '@/components/medicinesTable'
import { useGetPatientMedicalRecordsQuery } from '@/hooks/patient/medicalRecords'
import Chat from '@/components/chat'

export const Route = createFileRoute('/Dashboard/patient/overview')({
  component: PatientOverview,
})

function PatientOverview() {
  const { data: appointments, isLoading } = useGetPatientAppointmentsQuery()
  // Add state for patientId
  const [patientId, setPatientId] = useState<number | null>(null)
  const [pharmacyOrdersCount, setPharmacyOrdersCount] = useState<number>(0)
  const [orders, setOrders] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const { data: medicinesData } = useGetMedicineQuery()
  const { data: medicalRecordsData } = useGetPatientMedicalRecordsQuery(patientId || 0)
  const { mutate: rescheduleAppointment } = useRescheduleAppointment()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  useEffect(() => {
    const fetchPatientData = async () => {
      const userId = getUserIdHelper()
      if (userId) {
        const patient = await getPatientByUserIdFn(Number(userId))
        setPatientId(patient.id)
        // Fetch pharmacy orders
        const fetchedOrders = await getPharmacyOrdersFn(patient.id)
        setOrders(fetchedOrders)
        setPharmacyOrdersCount(fetchedOrders.length)
        // Fetch assigned doctors (filter by assignedDoctorId if available)
        const allDoctors = await getDoctorsFn()
        setDoctors(allDoctors)
      }
    }
    fetchPatientData()
  }, [])
  
  // Calculate stats
  const appointmentsData = appointments?.data || appointments || []
  const totalAppointments = Array.isArray(appointmentsData) ? appointmentsData.length : 0
  console.log('Appointments data:', appointments)
  console.log('Total appointments:', totalAppointments)
  
  // Get recent appointments (last 3)
  const recentAppointments: any[] = appointmentsData.slice(0, 3) || []

  const upcomingAppointments = appointments?.data?.filter((apt: any) => 
    new Date(apt.appointmentDate) > new Date() && apt.status !== 'cancelled'
  ).length || 0
  const completedAppointments = appointments?.data?.filter((apt: any) => 
    apt.status === 'completed'
  ).length || 0

  // System Overview Cards
  const systemOverviewCards = [
    {
      title: 'Pharmacy Orders',
      value: pharmacyOrdersCount,
      icon: FaShoppingCart,
      color: 'bg-red-500',
    },
    {
      title: 'Doctors in System',
      value: doctors.length,
      icon: FaUserMd,
      color: 'bg-green-500',
    },
    {
      title: 'Total Appointments',
      value: totalAppointments,
      icon: FaCalendarAlt,
      color: 'bg-blue-500',
    },
    {
      title: 'Medical Records',
      value: medicalRecordsData?.data?.length || 0,
      icon: FaFileMedical,
      color: 'bg-purple-500',
    },
  ]

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a new appointment with a doctor',
      icon: FaCalendarAlt,
      link: '/Dashboard/patient/create-appointment',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Find Doctors',
      description: 'Browse available doctors and specialties',
      icon: FaUserMd,
      link: '/Dashboard/patient/doctors',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Medical Records',
      description: 'View your medical history and records',
      icon: FaFileMedical,
      link: '/Dashboard/patient/medical-records',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Orders',
      description: 'Track your medicine and pharmacy orders',
      icon: FaShoppingCart,
      link: '/Dashboard/patient/orders',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Payments',
      description: 'View your payment history and manage payments',
      icon: FaCreditCard,
      link: '/Dashboard/patient/payments',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Settings',
      description: 'Manage your profile and preferences',
      icon: FaCog,
      link: '/Dashboard/patient/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    },
    {
      title: 'Join Zoom Meeting',
      description: 'Join your scheduled Zoom meeting',
      icon: SiZoom,
      link: 'https://zoom.us/j/your-meeting-id',
      color: 'bg-blue-700 hover:bg-blue-800'
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
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleReschedule = (appointmentId: number) => {
    if (newDate && newTime) {
      rescheduleAppointment({
        appointmentId,
        newDate,
        newTime
      })
      setEditingId(null)
      setNewDate('')
      setNewTime('')
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to your Health Dashboard!</h1>
          <p className="text-blue-100">Manage your health, appointments, and medical records all in one place</p>
        </div>

        {/* System Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemOverviewCards.map((card, index) => (
            <div
              key={index}
              className={`rounded-lg p-6 shadow-lg flex flex-col items-center justify-center ${card.color} text-white transform hover:scale-105 transition-transform duration-200`}
            >
              <card.icon size={32} className="mb-2" />
              <div className="text-lg font-semibold text-center">{card.title}</div>
              <div className="text-3xl font-bold">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`${action.color} rounded-lg p-4 text-white text-center transform hover:scale-105 transition-all duration-200 shadow-md`}
              >
                <action.icon size={24} className="mx-auto mb-2" />
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Appointments Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Appointments</h2>
            <Link
              to="/Dashboard/patient/appointments"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>
          
          {recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment: any) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </h3>
                      <p className="text-gray-600">{appointment.reason}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => setEditingId(appointment.id)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Reschedule
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {editingId === appointment.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex space-x-4">
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="border rounded px-3 py-2"
                        />
                        <input
                          type="time"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="border rounded px-3 py-2"
                        />
                        <button
                          onClick={() => handleReschedule(appointment.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaCalendarAlt size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No appointments found</p>
              <Link
                to="/Dashboard/patient/create-appointment"
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Book your first appointment
              </Link>
            </div>
          )}
        </div>

        {/* Recent Medical Records Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Medical Records</h2>
            <Link
              to="/Dashboard/patient/medical-records"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <PatientMedicalRecordsTable patientId={patientId!} />
        </div>

        {/* Recent Medicines Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Prescriptions</h2>
            <Link
              to="/Dashboard/patient/medicines"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>
          {medicinesData?.data && medicinesData.data.length > 0 ? (
            <MedicinesTable />
          ) : (
            <div className="text-center py-8">
              <FaPills size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No prescriptions found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 