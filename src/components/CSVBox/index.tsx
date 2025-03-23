import { useState, useEffect } from "react";
import Papa from "papaparse";

export const CSVBox = () => {
  const [csvUrl, setCsvUrl] = useState<string>(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1RLwN8Q0x34xLsVAnqlRaTVWT6gezOa4O87UYgpCz137eIiZ7zHnNbEPi6ELEPgpKQoehHxse74n-/pub?output=csv"
  );
  const [csvData, setCsvData] = useState<Array<Array<string>>>([]);
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCSVData = async () => {
    if (!csvUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(csvUrl);

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
            setCsvData(parsedData.slice(1, 5)); // First 10 rows of data after header
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
        `Error fetching CSV: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (csvUrl) {
      fetchCSVData();
    }
  }, [csvUrl]);

  return (
    <div className="space-y-4 ">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={csvUrl}
          onChange={(e) => setCsvUrl(e.target.value)}
          placeholder="Enter Google Spreadsheet CSV URL"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchCSVData}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || !csvUrl}
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {csvData.length > 0 ? (
        <div className="border border-gray-400 rounded-lg shadow-sm w-full overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[200px] truncate sm:px-4 sm:py-3"
                      title={header} // Show full text on hover
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csvData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={
                      rowIndex % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 text-xs sm:text-sm text-gray-500 max-w-[200px] truncate sm:px-4 sm:py-3"
                        title={cell} // Show full text on hover
                      >
                        <div className="break-words whitespace-normal sm:whitespace-nowrap overflow-hidden text-ellipsis">
                          {cell}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">
          {isLoading
            ? "Loading CSV data..."
            : "Enter a CSV URL to display data"}
        </div>
      )}
    </div>
  );
};
