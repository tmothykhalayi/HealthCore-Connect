import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PharmacyOrdersList from '@/components/patient/pharmacy_orderCard'
import { getUserIdHelper } from '@/lib/auth'

export const Route = createFileRoute('/Dashboard/patient/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const userId = Number(getUserIdHelper())

  // For testing, use a valid patient ID that has orders in the database
  // In a real app, you would get the patient ID from the user's profile
  const patientId = 1 // Using patient ID 1 which has orders in the sample data

  console.log('User ID:', userId)
  console.log('Using Patient ID:', patientId)

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
        <PharmacyOrdersList patientId={patientId} />
      </div>
    </DashboardLayout>
  )
} 