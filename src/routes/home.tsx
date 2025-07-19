import { createFileRoute } from '@tanstack/react-router'
import HealthcareHome from '@/components/home'

export const Route = createFileRoute('/home')({
  component: HealthcareHome,
})
