import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState } from 'react'
import { usePharmacistProfile, usePharmacyDetails, usePatientsWithOrders } from '@/hooks/pharmacist'
import { FaSearch, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShoppingCart } from 'react-icons/fa'

export const Route = createFileRoute('/Dashboard/pharmarcist/patients')({
  component: PharmacistPatients,
})

interface Patient {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  address: string
  dateOfBirth: string
  gender: string
  orders?: Array<{
    id: number
    totalAmount: number
    status: string
    createdAt: string
  }>
}

function PharmacistPatients() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const { data: pharmacistProfile } = usePharmacistProfile()
  const { data: pharmacyDetails } = usePharmacyDetails()
  const pharmacyId = pharmacyDetails?.id || pharmacyDetails?.pharmacyId
  
  const { data: patients, isLoading, error } = usePatientsWithOrders(pharmacyId)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPatients = patients?.filter((patient: Patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    const email = patient.email.toLowerCase()
    const phone = patient.phoneNumber || ''
    
    return fullName.includes(searchTerm.toLowerCase()) ||
           email.includes(searchTerm.toLowerCase()) ||
           phone.includes(searchTerm)
  }) || []

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patients...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 mb-2">
              <FaUser className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Patients</h3>
            <p className="text-red-700 text-sm">Failed to load patients with orders</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Patients with Orders</h1>
            <p className="text-gray-600">
              View patients who have placed orders with your pharmacy
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{patients?.length || 0}</p>
            </div>
            <FaUser className="text-blue-500" size={24} />
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient: Patient) => (
              <div key={patient.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">Patient ID: {patient.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaEnvelope className="text-gray-400" size={14} />
                    <span>{patient.email}</span>
                  </div>
                  
                  {patient.phoneNumber && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaPhone className="text-gray-400" size={14} />
                      <span>{patient.phoneNumber}</span>
                    </div>
                  )}
                  
                  {patient.address && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400" size={14} />
                      <span className="truncate">{patient.address}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Gender: {patient.gender}</span>
                    <span className="text-gray-600">
                      {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : 'N/A'}
                    </span>
                  </div>

                  {patient.orders && patient.orders.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Orders: {patient.orders.length}
                        </span>
                        <FaShoppingCart className="text-green-500" size={16} />
                      </div>
                      <div className="mt-2 space-y-1">
                        {patient.orders.slice(0, 2).map((order) => (
                          <div key={order.id} className="flex justify-between items-center text-xs">
                            <span>Order #{order.id}</span>
                            <span className={`px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        ))}
                        {patient.orders.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{patient.orders.length - 2} more orders
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedPatient(patient)
                      setShowDetails(true)
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                <FaUser className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No patients found</p>
                <p className="text-sm">
                  {searchTerm ? 'No patients match your search criteria' : 'No patients have placed orders yet'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Patient Details Modal */}
        {showDetails && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Patient Details: {selectedPatient.firstName} {selectedPatient.lastName}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaUser size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Patient ID</p>
                    <p className="text-lg">{selectedPatient.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                    <p className="text-lg">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-lg">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-lg">{selectedPatient.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gender</p>
                    <p className="text-lg">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                    <p className="text-lg">
                      {selectedPatient.dateOfBirth ? formatDate(selectedPatient.dateOfBirth) : 'N/A'}
                    </p>
                  </div>
                </div>
                
                {selectedPatient.address && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Address</p>
                    <p className="text-lg">{selectedPatient.address}</p>
                  </div>
                )}
                
                {selectedPatient.orders && selectedPatient.orders.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Order History</p>
                    <div className="space-y-2">
                      {selectedPatient.orders.map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Order #{order.id}</span>
                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.totalAmount || 0}</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedPatient.appointments && selectedPatient.appointments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Appointments</p>
                    <div className="space-y-2">
                      {selectedPatient.appointments.map((appointment: any) => (
                        <div key={appointment.id || appointment.appointment_id} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <div>
                            <span className="font-medium">Appointment #{appointment.id || appointment.appointment_id}</span>
                            <p className="text-sm text-gray-600">
                              {appointment.date || appointment.appointment_date || appointment.dateOfAppointment || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {appointment.status || 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
