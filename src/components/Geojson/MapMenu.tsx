import { useEffect, useRef, useState } from "react";

type MapMenuProps = {
  handleOpenGeoJSONFile: (files: File[]) => void;
};

export const MapMenu: React.FC<MapMenuProps> = ({ handleOpenGeoJSONFile }) => {
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
                  onClick={() => {}}
                >
                  GeoJSON
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  TopoJSON
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  CSV
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Shapefile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
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
