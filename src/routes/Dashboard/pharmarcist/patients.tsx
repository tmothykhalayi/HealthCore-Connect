import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/pharmarcist/patients')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/pharmarcist/patients"!</div>
}
