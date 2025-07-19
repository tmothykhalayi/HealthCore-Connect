import { createFileRoute } from '@tanstack/react-router'

// pages/prescriptions.tsx
import { PrescriptionsTable } from '@/components/prescriptionsTable'

export const Route = createFileRoute('/Dashboard/admin/prescriptions')({
  component: PrescriptionsPage,
})

export default function PrescriptionsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <PrescriptionsTable />
    </div>
  )
}
