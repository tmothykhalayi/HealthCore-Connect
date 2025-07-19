import { createFileRoute } from '@tanstack/react-router'

// pages/pharmacy-orders.tsx
import { PharmacyOrdersTable } from '@/components/orders'

export const Route = createFileRoute('/Dashboard/admin/pharmacy_orders')({
  component: PharmacyOrdersPage,
})

export default function PharmacyOrdersPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <PharmacyOrdersTable />
    </div>
  )
}
