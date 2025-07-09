import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/appointments')({
  component: AppointmentsPage,
})

// pages/appointments.tsx
import { AppointmentsTable } from '@/components/appointmentsTable';

export default function AppointmentsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <AppointmentsTable />
    </div>
  );
}
