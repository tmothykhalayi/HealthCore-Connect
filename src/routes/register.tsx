import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '@/components/register'

export const Route = createFileRoute('/register')({
  component: RegisterForm,
})
