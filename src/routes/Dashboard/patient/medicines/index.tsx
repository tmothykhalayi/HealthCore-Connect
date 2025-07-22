import { createFileRoute } from '@tanstack/react-router'
import MedicinesList from '@/components/patient/medicineCards'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/patient/medicines/')({
  component: MedicinesCard,
})
function MedicinesCard() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="sticky top-0 z-20 bg-white pb-2 mb-6">
          <h1 className="text-2xl font-bold">Medicines Management</h1>
        </div>
        <MedicinesList />
      </div>
    </DashboardLayout>
  )
}
