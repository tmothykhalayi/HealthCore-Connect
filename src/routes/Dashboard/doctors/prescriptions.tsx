import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctors/prescriptions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/doctors/prescriptions"!</div>
}
