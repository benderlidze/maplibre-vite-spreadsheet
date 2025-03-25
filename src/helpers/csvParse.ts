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
