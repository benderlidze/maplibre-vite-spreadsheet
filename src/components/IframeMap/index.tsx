import { useEffect, useState, useCallback, useMemo } from "react";
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
import { csv } from "d3-fetch";
import { generateGeoJSON } from "../../helpers/csvParse";

export const IframeMap = () => {
  // State management
  const [mapData, setMapData] = useState<GeoJSON.FeatureCollection | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    name: string;
    description: string;
  } | null>(null);

  // Get map style from URL parameters
  const queryParams = new URLSearchParams(window.location.search);
  const mapFieldsParam = queryParams.get("mapFields") ?? "";
  const decodedFields = decodeURIComponent(mapFieldsParam);
  
  const parsedFields = useMemo(() => {
    try {
      return JSON.parse(decodedFields) as MapFields;
    } catch (err) {
      console.error("Failed to parse mapFields parameter:", err);
      return {} as MapFields; // Fallback to an empty object or handle appropriately
    }
  }, [decodedFields]);

  const mapStyle = MAP_STYLES[parsedFields.mapStyle] || MAP_STYLES.Light;
  const pinColor = parsedFields.pinColor ?? "#007cbf";

  const mapCenter = parsedFields.mapCenter || { lat: 0, lng: 0 };
  const mapZoom = parsedFields.mapZoom || 1;
  const mapPitch = parsedFields.mapPitch || 0;
  const mapBearing = parsedFields.mapBearing || 0;

  // Parse map fields from URL parameters
  useEffect(() => {
    const parseData = async () => {
      try {
        if (parsedFields.dataURL && parsedFields.dataURL.length > 10) {
          const csvData = await csv(parsedFields.dataURL);
          console.log("csvData", csvData);
          const featureCollection = generateGeoJSON({
            data: csvData,
            latField: parsedFields.latField,
            lngField: parsedFields.lngField,
            nameField: parsedFields.nameField,
            descField: parsedFields.descField,
          });

          setMapData(featureCollection);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to parse mapFields parameter:", err);
        setError("Invalid mapFields parameter in URL");
        setIsLoading(false);
      }
    };

    parseData();
  }, [parsedFields]);

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
          longitude: mapCenter.lng,
          latitude: mapCenter.lat,
          zoom: mapZoom,
          pitch: mapPitch,
          bearing: mapBearing,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        interactiveLayerIds={mapData ? ["points"] : []}
        onClick={onClick}
        onMouseEnter={(e) => {
          if (e.features?.[0]?.layer.id === "points") {
            e.target.getCanvas().style.cursor = "pointer";
          }
        }}
        onMouseLeave={(e) => {
          e.target.getCanvas().style.cursor = "";
        }}
        attributionControl={{
          customAttribution:
            "© <a href='https://geomapi.com/'>geomapi.com</a> <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
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
                "circle-color": pinColor,
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
