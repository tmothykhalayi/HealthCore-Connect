import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/patients')({
  component: PatientsPage,
})

import { PatientsTable } from '@/components/patientsTable';

export default function PatientsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <PatientsTable />
    </div>
  );
} 
