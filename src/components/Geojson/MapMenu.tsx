import { useEffect, useRef, useState } from "react";
import { Feature, FeatureCollection } from "geojson";
import { toKML } from "@placemarkio/tokml";
import { saveAs } from "file-saver";
import shpwrite, { DownloadOptions, ZipOptions } from "@mapbox/shp-write";
import { topology } from "topojson-server";

type MapMenuProps = {
  handleOpenGeoJSONFile: (files: File[]) => void;
  geojson?: FeatureCollection | Feature;
};

export const MapMenu: React.FC<MapMenuProps> = ({
  handleOpenGeoJSONFile,
  geojson,
}) => {
  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simplified file selection handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      console.log("Selected files:", files);
      handleOpenGeoJSONFile(files);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSaveMenuOpen(false);
      }
    };

    if (isSaveMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSaveMenuOpen]);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const exportToFormat = async (format: string) => {
    if (!geojson) {
      alert("No data to export. Please load GeoJSON data first.");
      return;
    }

    const filename = new Date().toISOString().split("T")[0]; // Use current date as filename

    // Ensure we're working with a FeatureCollection
    const featureCollection: FeatureCollection =
      "type" in geojson && geojson.type === "Feature"
        ? { type: "FeatureCollection", features: [geojson as Feature] }
        : (geojson as FeatureCollection);

    console.log("geojson", geojson);

    switch (format) {
      case "geojson": {
        const geojsonString = JSON.stringify(featureCollection, null, 2);
        downloadFile(geojsonString, "export.geojson", "application/json");
        break;
      }

      case "kml": {
        // Convert GeoJSON to KML using tokml
        const kmlString = toKML(featureCollection);
        downloadFile(
          kmlString,
          "export.kml",
          "application/vnd.google-earth.kml+xml"
        );
        break;
      }

      case "topojson": {
        // Convert GeoJSON to TopoJSON using topojson-server
        const topoData = topology({ collection: featureCollection });
        const topoString = JSON.stringify(topoData, null, 2);
        downloadFile(topoString, "export.topojson", "application/json");
        break;
      }

      case "csv": {
        // Start by collecting headers and rowsalert(`Export to ${format} format not implemented yet.`);
        const headers = new Set<string>(["lng", "lat"]);
        const rows: Record<string, string>[] = [];

        // Process each feature
        featureCollection.features.forEach((feature) => {
          // Skip non-point features
          if (feature.geometry.type !== "Point") {
            console.warn("Skipping non-point feature in CSV export");
            return;
          }

          const [lng, lat] = feature.geometry.coordinates;
          const row: Record<string, string> = {
            lng: lng.toString(),
            lat: lat.toString(),
          };

          // Add all properties as columns
          if (feature.properties) {
            Object.entries(feature.properties).forEach(([key, value]) => {
              headers.add(key);
              row[key] =
                value !== null && value !== undefined ? String(value) : "";
            });
          }

          rows.push(row);
        });

        if (rows.length === 0) {
          alert("No point features found for CSV export.");
          return;
        }

        // Convert to CSV string
        const headerArray = Array.from(headers);
        const csvContent = [
          // Header row
          headerArray.join(","),
          // Data rows
          ...rows.map((row) =>
            headerArray
              .map((header) => {
                const val = row[header] || "";
                // Quote values with commas or quotes
                return val.includes(",") || val.includes('"')
                  ? `"${val.replace(/"/g, '""')}"`
                  : val;
              })
              .join(",")
          ),
        ].join("\n");

        downloadFile(csvContent, `export.csv`, "text/csv");
        break;
      }

      case "shapefile": {
        try {
          // Optional custom options passed to the underlying `zip` call
          const options = {
            outputType: "blob",
            compression: "DEFLATE",
          } as DownloadOptions & ZipOptions;

          const zipData = (await shpwrite.zip(
            featureCollection,
            options
          )) as Blob;
          saveAs(zipData, filename);
        } catch (error) {
          console.error("Error during shapefile export process:", error);
          alert(
            "Error during shapefile export process. Check console for details."
          );
        }
        break;
      }

      default:
        alert(`Unknown export format: ${format}`);
    }

    // Close the menu after exporting
    setIsSaveMenuOpen(false);
  };

  // Helper function for file downloads
  const downloadFile = (
    content: string,
    filename: string,
    contentType: string
  ) => {
    const blob = new Blob([content], { type: contentType });
    saveAs(blob, filename);
  };

  return (
    <div className="absolute z-10 bg-white bg-opacity-90 text-gray-800 p-2 shadow-md rounded">
      {/* Single file input with combined accept types */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".geojson,.json,.csv,.kml,.shp,.zip"
        multiple
        onChange={handleFileInputChange}
      />
      <div className="flex space-x-4">
        <div className="relative">
          <button
            className="px-3 py-1 hover:bg-gray-100 rounded"
            onClick={openFileDialog}
          >
            Open
          </button>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            className="px-3 py-1 hover:bg-gray-100 rounded flex items-center"
            onClick={() => setIsSaveMenuOpen(!isSaveMenuOpen)}
          >
            Save
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isSaveMenuOpen && (
            <div className="absolute mt-1 z-50 bg-white text-gray-800 border border-gray-200 shadow-lg rounded-md">
              <ul className="py-1">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    exportToFormat("geojson");
                  }}
                >
                  GeoJSON
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    exportToFormat("topojson");
                  }}
                >
                  TopoJSON
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    exportToFormat("csv");
                  }}
                >
                  CSV
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    exportToFormat("shapefile");
                  }}
                >
                  Shapefile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    exportToFormat("kml");
                  }}
                >
                  KML
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
