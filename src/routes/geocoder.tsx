import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import * as XLSX from "xlsx";

// Define types for geocoding
interface GeocodingResult {
  rowIndex: number;
  address: string;
  lat?: number;
  lon?: number;
  displayName?: string;
  error?: string;
}

export const Route = createFileRoute("/geocoder")({
  component: RouteComponent,
});

function RouteComponent() {
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [rowCount, setRowCount] = useState<number>(0);
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, boolean>
  >({});
  // Add new state variables for geocoding
  const [rawData, setRawData] = useState<any[]>([]);
  const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>(
    []
  );
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.data.length > 0) {
            const columns = Object.keys(results.data[0]);
            setColumns(columns);
            setRowCount(results.data.length);
            setRawData(results.data); // Store the raw data
            // Initialize all columns as unselected
            const initialSelected = columns.reduce(
              (acc, column) => {
                acc[column] = false;
                return acc;
              },
              {} as Record<string, boolean>
            );
            setSelectedColumns(initialSelected);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      // Parse Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length > 0) {
          const columns = Object.keys(jsonData[0]);
          setColumns(columns);
          setRowCount(jsonData.length);
          setRawData(jsonData); // Store the raw data
          // Initialize all columns as unselected
          const initialSelected = columns.reduce(
            (acc, column) => {
              acc[column] = false;
              return acc;
            },
            {} as Record<string, boolean>
          );
          setSelectedColumns(initialSelected);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Add function to geocode addresses
  const geocodeAddresses = async () => {
    // Reset geocoding state
    setGeocodingResults([]);
    setIsGeocoding(true);
    setGeocodingProgress(0);
    setGeocodingError(null);

    // Get selected column names
    const selectedColumnNames = Object.keys(selectedColumns).filter(
      (column) => selectedColumns[column]
    );

    if (selectedColumnNames.length === 0) {
      setGeocodingError("Please select at least one column to geocode");
      setIsGeocoding(false);
      return;
    }

    const results: GeocodingResult[] = [];

    // Process each row
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];

      // Combine the selected columns to form an address
      const addressParts = selectedColumnNames.map((column) => row[column]);
      const address = addressParts.filter((part) => part).join(", ");

      if (!address) {
        results.push({
          rowIndex: i,
          address: "Empty address",
          error: "No address data found in selected columns",
        });
        continue;
      }

      try {
        // Respect Nominatim usage policy (max 1 request per second)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Make API call to Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
          results.push({
            rowIndex: i,
            address,
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            displayName: data[0].display_name,
          });
        } else {
          results.push({
            rowIndex: i,
            address,
            error: "No results found",
          });
        }
      } catch (error) {
        results.push({
          rowIndex: i,
          address,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      // Update progress
      setGeocodingProgress(Math.floor(((i + 1) / rawData.length) * 100));
    }

    setGeocodingResults(results);
    setIsGeocoding(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  // Calculate the number of selected columns
  const selectedColumnCount =
    Object.values(selectedColumns).filter(Boolean).length;

  // Add download functionality
  const prepareDataForDownload = () => {
    // Create a copy of the raw data
    const enrichedData = [...rawData];

    // Add geocoding results to the corresponding rows
    geocodingResults.forEach((result) => {
      if (result.lat && result.lon) {
        enrichedData[result.rowIndex] = {
          ...enrichedData[result.rowIndex],
          Latitude: result.lat,
          Longitude: result.lon,
        };
      }
    });

    return enrichedData;
  };

  const downloadAsCSV = (data: any[]) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `geocoded_${fileName}`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAsExcel = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Geocoded");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `geocoded_${fileName}`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    const enrichedData = prepareDataForDownload();
    const fileExtension = fileName.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      downloadAsCSV(enrichedData);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      downloadAsExcel(enrichedData);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        File Upload & Column Extraction
      </h1>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-4 ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <div>
            <p>
              Drag and drop a CSV or Excel file here, or click to select a file
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: .csv, .xlsx, .xls
            </p>
          </div>
        )}
      </div>

      {fileName && (
        <p className="mb-2">
          <strong>File uploaded:</strong> {fileName}
        </p>
      )}

      {rowCount > 0 && (
        <p className="mb-2">
          <strong>Number of rows:</strong> {rowCount}
        </p>
      )}

      {columns.length > 0 && (
        <div className="">
          <h2 className="text-xl font-semibold mb-2">Columns Found:</h2>
          <ul className="pl-5 ">
            {columns.map((column, index) => (
              <li key={index} className="mb-2 flex items-center">
                <input
                  type="checkbox"
                  id={`column-${index}`}
                  checked={selectedColumns[column] || false}
                  onChange={() => handleColumnChange(column)}
                  className="mr-2"
                />
                <label htmlFor={`column-${index}`}>{column}</label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Geocoding section */}
      {columns.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Geocoding</h2>

          {selectedColumnCount > 0 ? (
            <p className="mb-4">
              {selectedColumnCount} column(s) selected for geocoding. Selected
              columns will be combined to form addresses.
            </p>
          ) : (
            <p className="mb-4 text-amber-600">
              Please select at least one column to geocode.
            </p>
          )}

          <button
            onClick={geocodeAddresses}
            disabled={isGeocoding || selectedColumnCount === 0}
            className={`px-4 py-2 rounded ${
              isGeocoding || selectedColumnCount === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isGeocoding ? "Geocoding..." : "Start Geocoding"}
          </button>

          {isGeocoding && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${geocodingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Progress: {geocodingProgress}% (Please wait, this may take
                several minutes)
              </p>
            </div>
          )}

          {geocodingError && (
            <p className="mt-2 text-red-500">{geocodingError}</p>
          )}

          {geocodingResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Results ({geocodingResults.length} addresses processed)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Row</th>
                      <th className="px-4 py-2 border">Address</th>
                      <th className="px-4 py-2 border">Latitude</th>
                      <th className="px-4 py-2 border">Longitude</th>
                      <th className="px-4 py-2 border">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geocodingResults.map((result, index) => (
                      <tr
                        key={index}
                        className={result.error ? "bg-red-50" : "bg-green-50"}
                      >
                        <td className="px-4 py-2 border">
                          {result.rowIndex + 1}
                        </td>
                        <td className="px-4 py-2 border">{result.address}</td>
                        <td className="px-4 py-2 border">
                          {result.lat || "-"}
                        </td>
                        <td className="px-4 py-2 border">
                          {result.lon || "-"}
                        </td>
                        <td className="px-4 py-2 border">
                          {result.error ? (
                            <span className="text-red-500">{result.error}</span>
                          ) : (
                            <span className="text-green-500">
                              Success: {result.displayName}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {geocodingResults.length > 0 && (
            <div className="mt-4">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
              >
                Download Geocoded Data
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
