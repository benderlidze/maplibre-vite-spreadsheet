import { useState, useEffect, useCallback } from "react";
import { MapFields } from "../../routes";
import { fetchCSVData } from "../../helpers/csvParse";

type CSVBoxProps = {
  setMapFields: (fields: Partial<Omit<MapFields, "mapStyle">>) => void;
  setMapData: (data: GeoJSON.FeatureCollection) => void;
};

export const CSVBox = ({ setMapFields, setMapData }: CSVBoxProps) => {
  const [csvUrl, setCsvUrl] = useState<string>(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1RLwN8Q0x34xLsVAnqlRaTVWT6gezOa4O87UYgpCz137eIiZ7zHnNbEPi6ELEPgpKQoehHxse74n-/pub?output=csv"
  );
  const [csvData, setCsvData] = useState<Array<Array<string>>>([]);
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Field selection state
  const [latField, setLatField] = useState<string>("");
  const [lngField, setLngField] = useState<string>("");
  const [nameField, setNameField] = useState<string>("");
  const [descField, setDescField] = useState<string>("");

  useEffect(() => {
    if (csvUrl) {
      fetchCSVData({
        url: csvUrl,
        setIsLoading,
        setError,
        setHeaders,
        setCsvData,
      });
    }
  }, [csvUrl]);

  // Auto-select fields that might contain lat/lng data
  useEffect(() => {
    if (headers.length > 0) {
      // Try to auto-detect lat/lng fields
      const possibleLatFields = headers.filter(
        (h) => /lat/i.test(h) || /latitude/i.test(h)
      );
      const possibleLngFields = headers.filter(
        (h) => /lon/i.test(h) || /lng/i.test(h) || /longitude/i.test(h)
      );

      if (possibleLatFields.length > 0) setLatField(possibleLatFields[0]);
      if (possibleLngFields.length > 0) setLngField(possibleLngFields[0]);

      // Look for name or title fields
      const possibleNameFields = headers.filter(
        (h) => /name/i.test(h) || /title/i.test(h)
      );

      if (possibleNameFields.length > 0) setNameField(possibleNameFields[0]);
    }
  }, [headers]);

  const handleApplyClick = useCallback(() => {
    // Apply field selection
    // Pass selected fields to parent component
    setMapFields({
      dataURL: csvUrl,
      latField,
      lngField,
      nameField,
      descField,
    });

    //convert csvData to geojson
    const geojson = {
      type: "FeatureCollection",
      features: csvData
        .slice(1) // Skip header row
        .map((row) => {
          const lat = parseFloat(row[headers.indexOf(latField)]);
          const lng = parseFloat(row[headers.indexOf(lngField)]);
          const name = nameField ? row[headers.indexOf(nameField)] : "";
          const desc = descField ? row[headers.indexOf(descField)] : "";

          return {
            type: "Feature",
            properties: {
              name,
              description: desc,
            },
            geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
          };
        }),
    };

    setMapData(geojson as GeoJSON.FeatureCollection);
  }, [
    csvData,
    csvUrl,
    descField,
    headers,
    latField,
    lngField,
    nameField,
    setMapData,
    setMapFields,
  ]);

  useEffect(() => {
    handleApplyClick();
  }, [latField, lngField, nameField, descField]);

  const renderFieldSelector = (
    label: string,
    value: string,
    setter: (value: string) => void,
    required: boolean = false
  ) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => {
          setter(e.target.value);
        }}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      >
        <option value="">Select field</option>
        {headers.map((header, index) => (
          <option key={index} value={header}>
            {header}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={csvUrl}
          onChange={(e) => setCsvUrl(e.target.value)}
          placeholder="Enter Google Spreadsheet CSV URL"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() =>
            fetchCSVData({
              url: csvUrl,
              setIsLoading,
              setError,
              setHeaders,
              setCsvData,
            })
          }
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

      {headers.length > 0 && (
        <>
          <h3 className="text-lg font-medium mb-3">2. Select Fields </h3>
          <div className="p-4 border border-gray-300 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderFieldSelector("Latitude", latField, setLatField, true)}
              {renderFieldSelector("Longitude", lngField, setLngField, true)}
              {renderFieldSelector(
                "Marker Title (optional)",
                nameField,
                setNameField
              )}
              {renderFieldSelector(
                "Marker description (optional)",
                descField,
                setDescField
              )}
            </div>
            {/* <div className="mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={!latField || !lngField}
                onClick={handleApplyClick}
              >
                Apply Field Selection
              </button>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};
