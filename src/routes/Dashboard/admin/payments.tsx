import { createFileRoute } from '@tanstack/react-router'

// pages/payments.tsx
import { PaymentsTable } from '@/components/paymentsTable'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/payments')({
  component: PaymentsPage,
})

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="mt-2 text-gray-600">
              Manage all payment records, create new payments, and update payment statuses.
            </p>
          </div>
          <PaymentsTable />
        </div>
      </div>
    </DashboardLayout>
  )
}
