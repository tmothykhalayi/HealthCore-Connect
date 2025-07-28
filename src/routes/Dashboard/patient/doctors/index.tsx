import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DoctorsList from '@/components/patient/doctorsCards'
import { useState } from 'react'
import { useGetDoctorQuery } from '@/hooks/patient/doctor'

export const Route = createFileRoute('/Dashboard/patient/doctors/')({
  component: DoctorsPage,
})

function DoctorsPage() {
  const [view, setView] = useState<'card' | 'table'>('card')
  const { data: doctors, isLoading, isError } = useGetDoctorQuery()

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Doctors Management
            </h1>
            <p className="text-gray-600">
              Browse and connect with available doctors
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded ${view === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setView('card')}
            >
              Card View
            </button>
            <button
              className={`px-4 py-2 rounded ${view === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setView('table')}
            >
              Table View
            </button>
          </div>
        </div>
        {view === 'card' ? (
          <DoctorsList />
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Specialization</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Availability</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
                ) : isError ? (
                  <tr><td colSpan={5} className="text-center py-8 text-red-500">Error loading doctors</td></tr>
                ) : (doctors && doctors.length > 0 ? doctors.map((doctor: any) => (
                  <tr key={doctor.doctor_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{doctor.name}</td>
                    <td className="px-4 py-2">{doctor.specialization}</td>
                    <td className="px-4 py-2">{doctor.email}</td>
                    <td className="px-4 py-2">{doctor.availability}</td>
                    <td className="px-4 py-2">
                      <a
                        href={`/Dashboard/patient/doctors/appointmentsForm.${doctor.doctor_id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Book Appointment
                      </a>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="text-center py-8">No doctors found</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
