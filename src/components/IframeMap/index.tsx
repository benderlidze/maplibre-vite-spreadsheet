import { useUrlParams } from "./useUrlParams";
import { MapDisplay } from "./MapDisplay";

export const IframeMap = () => {
  const params = useUrlParams();
  return <MapDisplay params={params} className="h-screen" />;
};
