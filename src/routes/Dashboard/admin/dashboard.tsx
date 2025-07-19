import AdminDashboard from '@/components/adminLanding'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/admin/dashboard')({
  component: AdminDashboard,
})


