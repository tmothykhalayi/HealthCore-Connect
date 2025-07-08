import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/payments"!</div>
}
