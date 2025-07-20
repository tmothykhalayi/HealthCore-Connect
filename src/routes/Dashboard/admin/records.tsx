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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Medical Records Management</h1>
            <p className="mt-2 text-gray-600">
              Manage all medical records in the system. Create, view, edit, and delete patient records.
            </p>
          </div>
          <RecordsTable />
        </div>
      </div>
    </DashboardLayout>
  )
}
