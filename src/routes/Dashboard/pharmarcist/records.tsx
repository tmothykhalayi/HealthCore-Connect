import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/pharmarcist/records')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <div>Hello "/dashboard/pharmarcist/records"!</div>
    </DashboardLayout>
  )
}
