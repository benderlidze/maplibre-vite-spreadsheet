import { useEffect, useState } from "react";
import { defaultParams, UrlParams } from "./constants";

export const useUrlParams = (): UrlParams => {
  const [params, setParams] = useState<UrlParams>(defaultParams);

  useEffect(() => {
    const parseQueryParams = () => {
      const queryString = window.location.search;
      const newParams = { ...defaultParams };

      if (!queryString) return newParams;

      const urlParams = new URLSearchParams(queryString);

      urlParams.forEach((value, key) => {
        console.log("value,key", value, key);

        if (key === "pinColor") {
          newParams["pinColor"] = value; // Ensure the full value is used
        } else if (key === "mapCenter") {
          newParams["mapCenter"] = value.split(",").map(Number) as [
            number,
            number,
          ];
        } else if (key in newParams && value !== "") {
          (newParams as Record<string, unknown>)[key] = value;
        }
      });

      setParams(newParams); // Trigger state update
    };

    parseQueryParams();

    const handleUrlChange = () => {
      parseQueryParams(); // Re-parse URL on popstate
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  return params;
};
