import { useUrlParams } from "./useUrlParams";
import { MapDisplay } from "./MapDisplay";

export const IframeMap = () => {
  const params = useUrlParams();
  console.log("params-->>>", params);

  return <MapDisplay params={params} />;
};
