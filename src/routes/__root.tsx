import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouteContext {
  queryClient: QueryClient
}

export const Route = createRootRoute<MyRouteContext>({
  component: () => (
    <>
      <Header />

      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
