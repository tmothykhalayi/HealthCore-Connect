import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/doctor/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Dashboard/doctor/settings"!</div>
}
