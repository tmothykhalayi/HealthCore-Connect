import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/doctor/prescriptions')({
  component: PrescriptionsPage,
})
import PrescriptionTable from '@/components/doctor/prescriptionsTable'

function PrescriptionsPage() {
  return (
    <div>
      <PrescriptionTable />
    </div>
  )
}

export default PrescriptionsPage
