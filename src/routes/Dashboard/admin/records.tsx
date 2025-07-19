import { createFileRoute } from '@tanstack/react-router'

// pages/records.tsx
import { RecordsTable } from '@/components/recordsTable'

export const Route = createFileRoute('/Dashboard/admin/records')({
  component: RecordsPage,
})

export default function RecordsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <RecordsTable />
    </div>
  )
}
