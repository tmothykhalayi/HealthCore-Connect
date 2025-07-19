import { createFileRoute } from '@tanstack/react-router'

// pages/payments.tsx
import { PaymentsTable } from '@/components/paymentsTable'

export const Route = createFileRoute('/Dashboard/admin/payments')({
  component: PaymentsPage,
})

export default function PaymentsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <PaymentsTable />
    </div>
  )
}
