import { createFileRoute } from '@tanstack/react-router'
import DoctorsList from '@/components/patient/doctorsCards'

export const Route = createFileRoute('/Dashboard/patient/doctors/')({
  component: DoctorsPage,
})

function DoctorsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Doctors Management</h1>
      <DoctorsList />
    </div>
  )
}
