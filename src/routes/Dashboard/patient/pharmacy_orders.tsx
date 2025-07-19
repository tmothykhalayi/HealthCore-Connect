import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/patient/pharmacy_orders')({
  beforeLoad: () => {
    throw redirect({
      to: '/Dashboard/patient/orders',
    })
  },
  component: () => null,
})
