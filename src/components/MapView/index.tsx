// Using Maplibre
import Map, { Layer, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "../../contants";
import { ColorPicker } from "../ColorPicker";
import { MapFields } from "../../routes";

type MapViewProps = {
  mapData: GeoJSON.FeatureCollection | null;
  mapProps: MapFields;
  updateCustomProp: (
    prop: keyof MapFields,
    value: string | number | { lat: number; lng: number }
  ) => void;
};

export const MapView = ({
  mapData,
  mapProps,
  updateCustomProp,
}: MapViewProps) => {
  console.log("mapProps.mapCenter?.lat", mapProps);

  const { lat, lng } = mapProps.mapCenter || { lat: 0, lng: 0 };
  const zoom = mapProps.mapZoom || 1;
  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-2">
        <h3 className="text-lg font-medium">3. Map Preview </h3>
        <div className="flex flex-row items-center gap-4">
          <div>
            Center: {`${lat.toFixed(2)},${lng.toFixed(2)}`} Zoom: {zoom}
          </div>
          <div>
            <label htmlFor="map-style-select">Map style: </label>
            <select
              id="map-style-select"
              value={mapProps.mapStyle}
              onChange={(e) => {
                // setCurrentStyle(e.target.value as keyof typeof MAP_STYLES)
                updateCustomProp("mapStyle", e.target.value);
              }}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(MAP_STYLES).map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
          <div>
            <ColorPicker
              value={mapProps.pinColor || "007cbf"}
              onChange={(value) =>
                updateCustomProp("pinColor", value.replace("#", ""))
              }
            />
          </div>
        </div>
      </div>

      <Map
        initialViewState={{
          longitude: mapProps.mapCenter ? lng : 0,
          latitude: mapProps.mapCenter ? lat : 0,
          zoom: mapProps.mapZoom || 1,
        }}
        onIdle={(e) => {
          const map = e.target;
          const center = map.getCenter();
          const zoom = map.getZoom().toFixed(2);
          console.log("Center:", center, "Zoom:", zoom);

          updateCustomProp("mapZoom", zoom);
          updateCustomProp("mapCenter", {
            lat: +center.lat.toPrecision(4),
            lng: +center.lng.toFixed(4),
          });
          updateCustomProp("mapPitch", map.getPitch().toFixed(2));
          updateCustomProp("mapBearing", map.getBearing().toFixed(2));
        }}
        style={{ width: "100%", height: 400 }}
        mapStyle={MAP_STYLES[mapProps.mapStyle]}
      >
        {mapData && (
          <Source type="geojson" data={mapData}>
            <Layer
              type="circle"
              paint={{
                "circle-radius": 5,
                "circle-color": mapProps.pinColor
                  ? `#${mapProps.pinColor}`
                  : "#007cbf",
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff",
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};
