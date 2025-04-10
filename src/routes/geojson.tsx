import { createFileRoute } from "@tanstack/react-router";
import { Geojson } from "../components/Geojson";

export const Route = createFileRoute("/geojson")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Geojson />;
}
