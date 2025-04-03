import { useState, useEffect } from "react";
import { fetchCSVData } from "../../helpers/csvParse";
import { UrlParams } from "../IframeMap/constants";
import React from "react";

type CSVBoxProps = {
  dataURL: string;
  updateCustomProp: (
    prop: keyof UrlParams,
    value: string | number | [number, number] | string[]
  ) => void;
};

export const CSVBox = React.memo(
  ({ updateCustomProp, dataURL }: CSVBoxProps) => {
    const [csvData, setCsvData] = useState<Array<Array<string>>>([]);
    const [headers, setHeaders] = useState<Array<string>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (dataURL) {
        fetchCSVData({
          url: dataURL,
          setIsLoading,
          setError,
          setHeaders: (headers: string[]) =>
            updateCustomProp("csvColumns", headers),
          setCsvData,
        });
      }
    }, [dataURL, updateCustomProp]);

    console.log("HEADER", headers);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={dataURL}
            onChange={(e) => updateCustomProp("dataURL", e.target.value)}
            placeholder="Enter Google Spreadsheet CSV URL"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() =>
              fetchCSVData({
                url: dataURL,
                setIsLoading,
                setError,
                setHeaders,
                setCsvData,
              })
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !dataURL}
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
                  {csvData.slice(1, 3).map((row, rowIndex) => (
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
  },

  (prevProps, nextProps) => prevProps.dataURL === nextProps.dataURL
);
