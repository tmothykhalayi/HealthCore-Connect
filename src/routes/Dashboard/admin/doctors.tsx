import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/doctors')({
  component: DoctorsPage,
})

import { DoctorsTable } from '@/components/doctorsTable';

 function DoctorsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Doctors Management</h1>
      <DoctorsTable />
    </div>
  );
}
