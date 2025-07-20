import { createFileRoute } from '@tanstack/react-router'

// pages/records.tsx
import { RecordsTable } from '@/components/recordsTable'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/records')({
  component: RecordsPage,
})

export default function RecordsPage() {
  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <RecordsTable />
      </div>
    </DashboardLayout>
  )
}
