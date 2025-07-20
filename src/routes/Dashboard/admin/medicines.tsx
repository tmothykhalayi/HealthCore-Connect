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
        <MedicinesTable />
      </div>
    </DashboardLayout>
  )
}
