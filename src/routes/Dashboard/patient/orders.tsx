import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { PharmacyOrdersTable } from '@/components/orders'
import useAuthStore from '@/store/auth'

export const Route = createFileRoute('/Dashboard/patient/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const user = useAuthStore((state) => state.user)
  const patientId = user?.user_id

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">
            Track and manage your pharmacy orders
          </p>
        </div>
        {/* PharmacyOrdersTable does not accept patientId as a prop. If you want to filter by patient, update the table implementation. */}
        <PharmacyOrdersTable patientId={patientId} />
      </div>
    </DashboardLayout>
  )
} 