import { createFileRoute } from '@tanstack/react-router'

// pages/medicines.tsx
import { MedicinesTable } from '@/components/medicinesTable'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/medicines')({
  component: MedicinesPage,
})

export default function MedicinesPage() {
  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Medicine Management</h1>
            <p className="mt-2 text-gray-600">
              Manage medicine inventory, add new medicines, and update medicine details.
            </p>
          </div>
          <MedicinesTable />
        </div>
      </div>
    </DashboardLayout>
  )
}
