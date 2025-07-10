import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctor/patient/$patientId')({
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams( {from: '/dashboard/doctor/patient/$patientId'} )
  const patientId = param.patientId
  return <div>Hello "{`/dashboard/doctor/patient/${patientId}`}!"</div>
}
