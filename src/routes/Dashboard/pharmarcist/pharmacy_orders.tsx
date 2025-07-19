import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/pharmarcist/pharmacy_orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/pharmarcist/pharmacy_orders"!</div>
}
