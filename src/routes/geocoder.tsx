import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/geocoder')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/geocoder"!</div>
}
