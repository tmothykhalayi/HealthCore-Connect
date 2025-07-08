import HealthcareHome from '@/components/home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home')({
  component: HealthcareHome,
})


    