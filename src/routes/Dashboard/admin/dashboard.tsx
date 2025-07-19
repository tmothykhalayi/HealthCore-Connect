import { createFileRoute } from '@tanstack/react-router'
import AdminDashboard from '@/components/adminLanding'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/dashboard')({
  component: () => (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  ),
})
