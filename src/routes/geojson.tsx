import { createFileRoute } from "@tanstack/react-router";
import { GmMap } from "../components/Geojson";

export const Route = createFileRoute("/geojson")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GmMap />;
}
