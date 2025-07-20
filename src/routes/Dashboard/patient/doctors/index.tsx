import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DoctorsList from '@/components/patient/doctorsCards'

export const Route = createFileRoute('/Dashboard/patient/doctors/')({
  component: DoctorsPage,
})

function DoctorsPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Doctors Management
          </h1>
          <p className="text-gray-600">
            Browse and connect with available doctors
          </p>
        </div>
        <DoctorsList />
      </div>
    </DashboardLayout>
  )
}
