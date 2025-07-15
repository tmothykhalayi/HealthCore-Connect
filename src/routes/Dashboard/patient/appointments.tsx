import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patient/appointments')({
  component: AppointmentCard,
})

import { PatientAppointments} from '@/components/patient/appointmentCards'
import { getUserIdHelper } from '@/lib/authHelper';

function AppointmentCard() {
  const  patientId = Number(getUserIdHelper());
  return (
    <div className="p-4">
      <PatientAppointments patientId={patientId ?? 0} />
    </div>
  );
} 
