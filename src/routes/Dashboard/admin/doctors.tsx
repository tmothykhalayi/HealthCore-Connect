import { createFileRoute } from '@tanstack/react-router'

import { DoctorsTable } from '@/components/doctorsTable'

export const Route = createFileRoute('/Dashboard/admin/doctors')({
  component: DoctorsPage,
})

function DoctorsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Doctors Management</h1>
      <DoctorsTable />
    </div>
  )
}
