import { createFileRoute } from "@tanstack/react-router";
import { IframeMap } from "../components/IframeMap";

export const Route = createFileRoute("/map")({
  component: RouteComponent,
});

function RouteComponent() {
  return <IframeMap mapData={null} />;
}
