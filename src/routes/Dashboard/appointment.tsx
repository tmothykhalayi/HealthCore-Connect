import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/appointment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Dashboard/appointment"!</div>
}
