import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patient')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Dashboard/patient"!</div>
}
