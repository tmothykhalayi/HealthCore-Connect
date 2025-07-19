import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/admin/pharmacy_orders')({
  component: PharmacyOrdersPage,
})

// pages/pharmacy-orders.tsx
import { PharmacyOrdersTable } from '@/components/orders';

export default function PharmacyOrdersPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <PharmacyOrdersTable />
    </div>
  );
}
