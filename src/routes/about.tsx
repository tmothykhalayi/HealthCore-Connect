import { createFileRoute } from '@tanstack/react-router'
import AboutUs from '@/components/About'

export const Route = createFileRoute('/about')({
  component: AboutUs,
})
