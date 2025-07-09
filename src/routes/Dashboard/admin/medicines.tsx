import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/medicines')({
  component: MedicinesPage,
})

// pages/medicines.tsx
import { MedicinesTable } from '@/components/medicinesTable';

export default function MedicinesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <MedicinesTable />
    </div>
  );
}