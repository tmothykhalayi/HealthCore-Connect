import { createFileRoute } from '@tanstack/react-router'
import Landing from '../components/Landing'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <Landing />
}
