import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { PharmacyOrdersTable } from '@/components/orders'
import useAuthStore from '@/store/auth'
import { useState } from 'react'

export const Route = createFileRoute('/Dashboard/patient/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const user = useAuthStore((state) => state.user)
  const patientId = user?.user_id
  const [showAll, setShowAll] = useState(false)

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              My Orders
            </h1>
            <p className="text-gray-600">
              Track and manage your pharmacy orders
            </p>
          </div>
        </div>
        <PharmacyOrdersTable />
      </div>
    </DashboardLayout>
  )
} 