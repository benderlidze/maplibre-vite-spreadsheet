import { DSVRowArray } from "d3";
import Papa from "papaparse";

type FetchCSVDataProps = {
  url: string;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setHeaders: (headers: Array<string>) => void;
  setCsvData: (csvData: Array<Array<string>>) => void;
};

export const fetchCSVData = async ({
  url,
  setIsLoading,
  setError,
  setHeaders,
  setCsvData,
}: FetchCSVDataProps) => {
  if (!url) return;

  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }

    const csvText = await response.text();

    interface PapaParseResult {
      data: Array<Array<string>>;
      errors: Array<{ message: string }>;
      meta: {
        delimiter: string;
        linebreak: string;
        aborted: boolean;
        truncated: boolean;
        cursor: number;
      };
    }

    interface PapaParseError {
      message: string;
      code?: string;
      row?: number;
    }

    Papa.parse(csvText, {
      complete: (results: PapaParseResult) => {
        const parsedData = results.data as Array<Array<string>>;
        if (parsedData.length > 0) {
          setHeaders(parsedData[0]);
          setCsvData(parsedData); // First 10 rows of data after header
        }
        setIsLoading(false);
      },
      error: (error: PapaParseError) => {
        setError(`Error parsing CSV: ${error.message}`);
        setIsLoading(false);
      },
    });
  } catch (err) {
    setError(
      `Error fetching CSV: ${err instanceof Error ? err.message : String(err)}`
    );
    setIsLoading(false);
  }
};

type GenerateGeoJSON = {
  data: DSVRowArray<string>;
  latField: number;
  lngField: number;
  nameField?: string;
  descField?: string;
};
export const generateGeoJSON = ({
  data,
  latField,
  lngField,
  nameField,
  descField,
}: GenerateGeoJSON) => {
  const features = data.map((row) => {
    const latitude = parseFloat(row[latField]);
    const longitude = parseFloat(row[lngField]);

    if (isNaN(latitude) || isNaN(longitude)) {
      return null;
    }

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        name: nameField ? row[nameField] : "",
        description: descField ? row[descField] : "",
      },
    };
  });

  const filteredFeatures = features.filter(
    (f) => f !== null
  ) as GeoJSON.Feature[];
  const featureCollection: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: filteredFeatures,
  };

  return featureCollection;
};
