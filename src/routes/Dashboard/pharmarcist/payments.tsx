import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/pharmarcist/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/pharmarcist/payments"!</div>
}
