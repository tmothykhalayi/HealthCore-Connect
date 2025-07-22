import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Link } from '@tanstack/react-router'
import { useGetPatientAppointmentsQuery } from '@/hooks/patient/appointment'
import { FaCalendarAlt, FaUserMd, FaPills, FaFileMedical, FaShoppingCart, FaCog } from 'react-icons/fa'
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
import Chat from '@/components/chat'

export const Route = createFileRoute('/Dashboard/patient/')({
  component: PatientDashboard,
})

function PatientDashboard() {
  const { data: appointments, isLoading } = useGetPatientAppointmentsQuery()
  // Add state for patientId
  const [patientId, setPatientId] = useState<number | null>(null)
  const [pharmacyOrdersCount, setPharmacyOrdersCount] = useState<number>(0)
  const [orders, setOrders] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const { data: medicinesData } = useGetMedicineQuery()
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
        // Fetch assigned doctors (filter by assignedDoctorId if available)
        const allDoctors = await getDoctorsFn()
        let assignedDoctors = allDoctors
        if (patient.assignedDoctorId) {
          assignedDoctors = allDoctors.filter((doc: any) => doc.doctor_id === patient.assignedDoctorId)
        }
        setDoctors(assignedDoctors)
      }
    }
    fetchPatientData()
  }, [])
  
  // Get recent appointments (last 3)
  const recentAppointments: any[] = appointments?.data?.slice(0, 3) || []
  
  // Calculate stats
  const totalAppointments = appointments?.data?.length || 0
  const upcomingAppointments = appointments?.data?.filter((apt: any) => 
    new Date(apt.appointmentDate) > new Date() && apt.status !== 'cancelled'
  ).length || 0
  const completedAppointments = appointments?.data?.filter((apt: any) => 
    apt.status === 'completed'
  ).length || 0
  // System Overview Cards
  const systemOverviewCards = [
    {
      title: 'Total Appointments',
      value: totalAppointments,
      icon: FaCalendarAlt,
      color: 'bg-blue-500',
    },
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments,
      icon: FaUserMd,
      color: 'bg-green-500',
    },
    {
      title: 'Completed Appointments',
      value: completedAppointments,
      icon: FaFileMedical,
      color: 'bg-purple-500',
    },
    {
      title: 'Pharmacy Orders',
      value: pharmacyOrdersCount,
      icon: FaShoppingCart,
      color: 'bg-red-500',
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
      title: 'Prescriptions',
      description: 'View and manage your prescriptions',
      icon: FaPills,
      link: '/Dashboard/patient/prescriptions',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Orders',
      description: 'Track your medicine and pharmacy orders',
      icon: FaShoppingCart,
      link: '/Dashboard/patient/orders',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Settings',
      description: 'Manage your profile and preferences',
      icon: FaCog,
      link: '/Dashboard/patient/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* System Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
          {systemOverviewCards.map((card, index) => (
            <div
              key={index}
              className={`rounded-lg p-6 shadow-sm flex flex-col items-center justify-center ${card.color} text-white`}
            >
              <card.icon size={32} className="mb-2" />
              <div className="text-lg font-semibold">{card.title}</div>
              <div className="text-3xl font-bold">{card.value}</div>
            </div>
          ))}
        </div>
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-blue-100">Manage your health and appointments from your dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemOverviewCards.map((card: any, index: number) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color} text-white`}>
                  <card.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Appointments</h2>
              <Link
                to="/Dashboard/patient/appointments"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : recentAppointments.length > 0 ? (
              <div className="space-y-3">
                {recentAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        Appointment #{appointment.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}
                      </p>
                      <p className="text-sm text-gray-500">
                        Doctor ID: {appointment.doctorId}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    {/* Reschedule Button */}
                    {['completed', 'cancelled'].includes(appointment.status?.toLowerCase?.()) ? null : (
                      <button
                        className="ml-4 text-blue-600 underline"
                        onClick={() => setEditingId(appointment.id)}
                      >
                        Reschedule
                      </button>
                    )}
                    {/* Inline Reschedule Form */}
                    {editingId === appointment.id && (
                      <form
                        onSubmit={e => {
                          e.preventDefault()
                          rescheduleAppointment({
                            appointmentId: appointment.id,
                            newDate,
                            newTime,
                          }, {
                            onSuccess: () => {
                              setEditingId(null)
                              setNewDate('')
                              setNewTime('')
                            }
                          })
                        }}
                        className="ml-4 flex gap-2 items-center"
                      >
                        <input
                          type="date"
                          value={newDate}
                          onChange={e => setNewDate(e.target.value)}
                          required
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="time"
                          value={newTime}
                          onChange={e => setNewTime(e.target.value)}
                          required
                          className="border rounded px-2 py-1"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="ml-2 text-gray-500">Cancel</button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No recent appointments</p>
                <Link
                  to="/Dashboard/patient/create-appointment"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Book your first appointment
                </Link>
              </div>
            )}
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
        </div>
        {/* Medical Records Table */}
        {patientId && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <PatientMedicalRecordsTable patientId={patientId} />
          </div>
        )}
        {/* Orders Table */}
        {orders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">My Pharmacy Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Medicine</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Pharmacy</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.OrderId} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{order.OrderId}</td>
                      <td className="px-4 py-2">{order.status}</td>
                      <td className="px-4 py-2">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ''}</td>
                      <td className="px-4 py-2">{order.totalAmount}</td>
                      <td className="px-4 py-2">{order.medicine?.name || order.medicineId || '-'}</td>
                      <td className="px-4 py-2">{order.quantity}</td>
                      <td className="px-4 py-2">{order.pharmacy?.name || order.pharmacyId || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Assigned Doctors */}
        {doctors.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">My Assigned Doctors</h2>
            <ul className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <li key={doctor.doctor_id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">{doctor.name}</div>
                    <div className="text-sm text-gray-500">{doctor.specialization}</div>
                  </div>
                  <div className="text-sm text-gray-400">{doctor.email}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Assigned Medicines */}
        {medicinesData && medicinesData.data && medicinesData.data.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">My Medicines</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Medicine Name</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {medicinesData.data?.map((medicine: any) => (
                    <tr key={medicine.medicine_id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{medicine.name}</td>
                      <td className="px-4 py-2">{medicine.description}</td>
                      <td className="px-4 py-2">{medicine.stock_quantity}</td>
                      <td className="px-4 py-2">{medicine.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Medicines CRUD Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <MedicinesTable />
        </div>
      </div>
      <Chat />
    </DashboardLayout>
  )
} 