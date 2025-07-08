import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/doctors')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/doctors"!</div>
}
