import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctor/prescriptions')({
  component: PrescriptionsPage,
})
import PrescriptionTable from '@/components/doctor/prescriptionsTable';

function PrescriptionsPage() {
  return (
    <div>
      <PrescriptionTable />
    </div>
  );
}

export default PrescriptionsPage;
