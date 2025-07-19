import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/pharmarcist/prescriptions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/pharmarcist/prescriptions"!</div>
}
