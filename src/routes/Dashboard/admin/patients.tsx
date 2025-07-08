import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/patients')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/patients"!</div>
}
