import { useEffect, useState, useCallback } from "react";
import { defaultParams, UrlParams } from "./constants";

export const useUrlParams = (): UrlParams => {
  const [params, setParams] = useState<UrlParams>(defaultParams);

  // Parse URL parameters from hash fragment
  const parseHashParams = useCallback(() => {
    // Get the path and query portion from the hash
    const hashPath = window.location.hash.substring(1); // Remove the # symbol
    const queryStartIndex = hashPath.indexOf("?");

    if (queryStartIndex === -1) {
      return defaultParams;
    }

    const queryString = hashPath.substring(queryStartIndex + 1);
    const searchParams = new URLSearchParams(queryString);
    const parsedParams = { ...defaultParams };

    // Process each parameter
    searchParams.forEach((value, key) => {
      console.log("Parsing param:", key, value);

      if (key === "pinColor") {
        parsedParams.pinColor = value;
      } else if (key === "mapCenter") {
        parsedParams.mapCenter = value.split(",").map(Number) as [
          number,
          number,
        ];
      } else if (key in parsedParams && value !== "") {
        (parsedParams as Record<string, unknown>)[key] = value;
      }
    });

    return parsedParams;
  }, []);

  useEffect(() => {
    // Set initial params
    setParams(parseHashParams());

    // Update params when hash changes
    const handleHashChange = () => {
      setParams(parseHashParams());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [parseHashParams]);

  return params;
};
