import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '@/components/login'

export const Route = createFileRoute('/login')({
  component: LoginForm,
})
