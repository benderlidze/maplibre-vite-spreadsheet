import { useEffect, useState, useCallback } from "react";
import Map, {
  Layer,
  Source,
  Popup,
  NavigationControl,
  MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "../../contants";
import { MapFields } from "../../routes";
import { fetchCSVData } from "../../helpers/csvParse";

export const IframeMap = () => {
  // State management
  const [mapData, setMapData] = useState<GeoJSON.FeatureCollection | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mapFields, setMapFields] = useState<MapFields | null>(null);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    name: string;
    description: string;
  } | null>(null);

  // Get map style from URL parameters
  const queryParams = new URLSearchParams(window.location.search);
  const mapStyleParam = queryParams.get("style") ?? "Light";
  const mapStyle = MAP_STYLES[
    mapStyleParam as keyof typeof MAP_STYLES
  ] as string;

  // Parse map fields from URL parameters
  useEffect(() => {
    try {
      const mapFieldsParam = queryParams.get("mapFields");
      if (!mapFieldsParam) {
        setError("No mapFields parameter found in URL");
        setIsLoading(false);
        return;
      }

      const decodedFields = decodeURIComponent(mapFieldsParam);
      const parsedFields = JSON.parse(decodedFields) as MapFields;
      setMapFields(parsedFields);
    } catch (err) {
      console.error("Failed to parse mapFields parameter:", err);
      setError("Invalid mapFields parameter in URL");
      setIsLoading(false);
    }
  }, []);

  // Fetch CSV data when mapFields are available
  useEffect(() => {
    if (!mapFields?.dataURL) return;

    const processCSVData = (headers: string[], data: string[][]) => {
      // Convert CSV data to GeoJSON
      const features: GeoJSON.Feature[] = data
        .filter((row) => row.length >= 2) // Ensure row has enough data
        .map((row, index) => {
          // Find column indices
          const latIndex = headers.indexOf(mapFields.latField);
          const lngIndex = headers.indexOf(mapFields.lngField);
          const nameIndex = headers.indexOf(mapFields.nameField);
          const descIndex = headers.indexOf(mapFields.descField);

          // Skip if required fields are not found
          if (latIndex < 0 || lngIndex < 0) return null;

          const lat = parseFloat(row[latIndex]);
          const lng = parseFloat(row[lngIndex]);

          // Skip if lat/lng are not valid numbers
          if (isNaN(lat) || isNaN(lng)) return null;

          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            properties: {
              id: index,
              name: nameIndex >= 0 ? row[nameIndex] : "Unnamed",
              description: descIndex >= 0 ? row[descIndex] : "",
              // Include all properties for reference
              ...headers.reduce(
                (acc, header, i) => {
                  acc[header] = row[i];
                  return acc;
                },
                {} as Record<string, string>
              ),
            },
          } as GeoJSON.Feature;
        })
        .filter(Boolean) as GeoJSON.Feature[];

      setMapData({
        type: "FeatureCollection",
        features,
      });
      setIsLoading(false);
    };

    fetchCSVData({
      url: mapFields.dataURL,
      setIsLoading,
      setError,
      setHeaders: (headers) => {
        // Store headers for CSV processing
        const data = sessionStorage.getItem("csvData");
        if (data) {
          processCSVData(headers, JSON.parse(data));
        }
      },
      setCsvData: (data) => {
        // Store CSV data for processing
        sessionStorage.setItem("csvData", JSON.stringify(data));
        const headers = sessionStorage.getItem("headers");
        if (headers) {
          processCSVData(JSON.parse(headers), data);
        }
      },
    });
  }, [mapFields]);

  // Handle clicking on a map feature
  const onClick = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (feature && feature.geometry.type === "Point") {
      const [longitude, latitude] = feature.geometry.coordinates as [
        number,
        number,
      ];
      setPopupInfo({
        longitude,
        latitude,
        name: feature.properties.name,
        description: feature.properties.description,
      });
    }
  }, []);

  return (
    <div className="h-screen relative">
      {isLoading && (
        <div className="flex items-center justify-center absolute z-10 h-full w-full bg-white bg-opacity-80">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Loading map data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center absolute z-10 h-full w-full bg-white bg-opacity-80">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <Map
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 1,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        interactiveLayerIds={mapData ? ["points"] : []}
        onClick={onClick}
        attributionControl={{
          customAttribution:
            "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
        }}
      >
        <NavigationControl position="top-right" />

        {mapData && (
          <Source id="points-source" type="geojson" data={mapData}>
            <Layer
              id="points"
              type="circle"
              source="points-source"
              paint={{
                "circle-radius": 6,
                "circle-color": "#3b82f6",
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
                "circle-opacity": 0.9,
              }}
            />
          </Source>
        )}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            className="map-popup"
          >
            <div className="p-1">
              <h3 className="font-bold text-gray-800">{popupInfo.name}</h3>
              {popupInfo.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {popupInfo.description}
                </p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};
