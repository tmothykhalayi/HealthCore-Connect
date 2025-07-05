import { RegistrationPage } from '@/components/registerform'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/registration')({
  component: RegistrationPage,
})


