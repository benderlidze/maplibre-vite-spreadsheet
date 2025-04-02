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
import { csv } from "d3-fetch";
import { generateGeoJSON } from "../../helpers/csvParse";
import { UrlParams } from "./constants";

type MapDisplayProps = {
  params: UrlParams;
  updateCustomProp?: (
    prop: keyof UrlParams,
    value: string | number | [number, number]
  ) => void;
  className?: string;
};

export const MapDisplay = ({
  params,
  updateCustomProp,
  className,
}: MapDisplayProps) => {
  console.log("params", params);

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

  useEffect(() => {
    const parseData = async () => {
      try {
        if (
          params.dataURL &&
          params.dataURL.length > 10 &&
          params.latField !== "" &&
          params.lngField !== ""
        ) {
          const csvData = await csv(params.dataURL);
          const featureCollection = generateGeoJSON({
            data: csvData,
            latField: params.latField ?? "",
            lngField: params.lngField ?? "",
            nameField: params.nameField,
            descField: params.descField,
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
  }, [params]);

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
    <div className={`relative ` + className}>
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

      {!isLoading && (
        <Map
          initialViewState={{
            longitude: Number(params.mapCenter?.[0]) || 0,
            latitude: Number(params.mapCenter?.[1]) || 0,
            zoom: Number(params.mapZoom) || 1,
            pitch: Number(params.mapPitch) || 0,
            bearing: Number(params.mapBearing) || 0,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle={MAP_STYLES[params.mapStyle]}
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
          onIdle={(e) => {
            if (updateCustomProp && updateCustomProp instanceof Function) {
              const map = e.target;
              const center = map.getCenter();
              const zoom = map.getZoom().toFixed(2);
              console.log("Center:", center, "Zoom:", zoom);

              updateCustomProp("mapZoom", zoom);
              updateCustomProp("mapCenter", [
                +center.lng.toFixed(4),
                +center.lat.toPrecision(4),
              ]);
              updateCustomProp("mapPitch", map.getPitch().toFixed(2));
              updateCustomProp("mapBearing", map.getBearing().toFixed(2));
            }
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
                  "circle-color": params.pinColor
                    ? `#${params.pinColor}`
                    : "#007cbf",
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
      )}
    </div>
  );
};
