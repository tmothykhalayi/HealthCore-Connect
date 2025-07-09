import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/payments')({
  component: PaymentsPage,
})

// pages/payments.tsx
import { PaymentsTable } from '@/components/paymentsTable';

export default function PaymentsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <PaymentsTable />
    </div>
  );
}
