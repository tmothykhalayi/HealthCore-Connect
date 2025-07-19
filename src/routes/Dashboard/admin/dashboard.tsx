import AdminDashboard from '@/components/adminLanding'
import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/dashboard')({
  component: () => (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  ),
})
