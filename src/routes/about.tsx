import { createFileRoute } from "@tanstack/react-router";
import { IframeMap } from "../components/IframeMap";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      Free map <IframeMap />
    </div>
  );
}
