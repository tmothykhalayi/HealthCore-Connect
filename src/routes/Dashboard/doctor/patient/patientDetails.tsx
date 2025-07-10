import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctor/patient/patientDetails')({
  component: PatientPrescriptionsTable,
});



import PatientPrescriptionsTable from '@/components/doctor/patient/patientDetails';

const PatientDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      {/* Other patient details components */}
      <PatientPrescriptionsTable patientId={Number(params.id)} />
    </div>
  );
};

export default PatientDetailsPage;
