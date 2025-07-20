import { createFileRoute } from '@tanstack/react-router'

// pages/prescriptions.tsx
import { PrescriptionsTable } from '@/components/prescriptionsTable'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/prescriptions')({
  component: PrescriptionsPage,
})

export default function PrescriptionsPage() {
  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <PrescriptionsTable />
      </div>
    </DashboardLayout>
  )
}
