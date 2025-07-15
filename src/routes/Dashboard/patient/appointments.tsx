import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patient/appointments')({
  component: AppointmentCard,
})

import { PatientAppointments} from '@/components/patient/appointmentCards'

function AppointmentCard() {
  return (
    <div className="p-4">
      <PatientAppointments patientId={3} />
    </div>
  );
} 
