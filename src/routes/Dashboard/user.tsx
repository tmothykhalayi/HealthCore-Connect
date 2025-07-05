import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/user')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Dashboard/user"!</div>
}
