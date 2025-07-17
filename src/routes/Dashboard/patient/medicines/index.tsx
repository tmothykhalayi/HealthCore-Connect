import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patient/medicines/')({
  component:  MedicinesCard,
})

import MedicinesList from '@/components/patient/medicineCards';
function MedicinesCard() {
  return(
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Medicines Management</h1>
      <MedicinesList />
    </div>
  )
}
