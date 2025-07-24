import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MedicinesTable } from '@/components/medicinesTable'

export const Route = createFileRoute('/Dashboard/pharmarcist/medicines')({
  component: () => (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Medicines</h1>
        <MedicinesTable />
      </div>
    </DashboardLayout>
  ),
}) 