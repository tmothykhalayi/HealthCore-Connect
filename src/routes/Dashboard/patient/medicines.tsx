import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patient/medicines')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/patients/medicines"!</div>
}
