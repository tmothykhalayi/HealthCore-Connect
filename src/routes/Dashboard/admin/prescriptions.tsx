import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/prescriptions')({
  component: PrescriptionsPage,
})

// pages/prescriptions.tsx
import { PrescriptionsTable } from '@/components/prescriptionsTable';

export default function PrescriptionsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <PrescriptionsTable />
    </div>
  );
}
