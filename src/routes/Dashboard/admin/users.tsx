import { createFileRoute } from '@tanstack/react-router'

// pages/users.tsx
import { UsersTable } from '@/components/usersTable'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <DashboardLayout>
      <UsersTable />
    </DashboardLayout>
  )
}
