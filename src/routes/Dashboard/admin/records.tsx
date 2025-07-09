import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/records')({
  component: RecordsPage,
})

// pages/records.tsx
import { RecordsTable } from '@/components/recordsTable';

export default function RecordsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <RecordsTable />
    </div>
  );
}
