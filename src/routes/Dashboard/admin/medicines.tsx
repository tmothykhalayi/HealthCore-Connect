import { createFileRoute } from '@tanstack/react-router'

// pages/medicines.tsx
import { MedicinesTable } from '@/components/medicinesTable'

export const Route = createFileRoute('/Dashboard/admin/medicines')({
  component: MedicinesPage,
})

export default function MedicinesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <MedicinesTable />
    </div>
  )
}
