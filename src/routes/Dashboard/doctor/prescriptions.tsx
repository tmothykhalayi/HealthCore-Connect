import { createFileRoute } from '@tanstack/react-router'
import PrescriptionTable from '@/components/doctor/prescriptionsTable'

export const Route = createFileRoute('/Dashboard/doctor/prescriptions')({
  component: PrescriptionsPage,
})

function PrescriptionsPage() {
  return (
    <div>
      <PrescriptionTable />
    </div>
  )
}

export default PrescriptionsPage
