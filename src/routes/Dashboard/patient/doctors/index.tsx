import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patient/doctors/')({
  component: DoctorsPage,
})
import DoctorsList from '@/components/patient/doctorsCards';

function DoctorsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Doctors Management</h1>
      <DoctorsList />
    </div>
  );
}
