import { createFileRoute } from '@tanstack/react-router'
import { PharmacistsTable } from '@/components/pharmacistsTable'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/Dashboard/admin/pharmacists')({
  component: () => (
    <DashboardLayout>
      <PharmacistsTable />
    </DashboardLayout>
  ),
}) 