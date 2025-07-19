import { createFileRoute } from '@tanstack/react-router'

// pages/users.tsx
import { UsersTable } from '@/components/usersTable'

export const Route = createFileRoute('/Dashboard/admin/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      <UsersTable />
    </div>
  )
}
