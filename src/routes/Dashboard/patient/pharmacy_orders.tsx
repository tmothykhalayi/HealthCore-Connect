import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patient/pharmacy_orders')({
  component: pharmacyOrdersCard,
})

import PharmacyOrdersList from '@/components/patient/pharmacy_orderCard';
import { getUserIdHelper } from '@/lib/authHelper';

 function pharmacyOrdersCard() {
  const patientId = Number(getUserIdHelper());
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pharmacy Orders Management</h1>
      <PharmacyOrdersList patientId={patientId ?? 0} />
    </div>
  );
}
