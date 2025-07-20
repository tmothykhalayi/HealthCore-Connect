import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { RecordsTable } from '@/components/recordsTable'

export const Route = createFileRoute('/Dashboard/pharmarcist/records')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <RecordsTable />
    </DashboardLayout>
  );
}
