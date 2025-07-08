import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patients/medicines')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/patients/medicines"!</div>
}
