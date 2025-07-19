import { createFileRoute } from '@tanstack/react-router'

import MedicinesList from '@/components/patient/medicineCards'

export const Route = createFileRoute('/Dashboard/patient/medicines/')({
  component: MedicinesCard,
})
function MedicinesCard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Medicines Management</h1>
      <MedicinesList />
    </div>
  )
}
