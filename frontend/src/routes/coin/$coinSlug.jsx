import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/coin/$coinSlug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/coin/$coinSlug"!</div>
}
