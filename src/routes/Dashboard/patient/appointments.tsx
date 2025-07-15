import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patient/appointments')({
  component: RouteComponent,
})

import { PatientAppointments} from '@/components/patient/appointmentCards'

function RouteComponent() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Appointments</h1>
      <PatientAppointments patientId={1} />
    </div>
  )
}
