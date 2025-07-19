import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/pharmarcist/records')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/pharmarcist/records"!</div>
}
