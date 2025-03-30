// Using Maplibre
import Map, { Layer, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "../../contants";
import { ColorPicker } from "../ColorPicker";
import { MapFields } from "../../routes";

type MapViewProps = {
  mapData: GeoJSON.FeatureCollection | null;
  mapProps: MapFields;
  updateCustomProp: (prop: keyof MapFields, value: string) => void;
};

export const MapView = ({
  mapData,
  mapProps,
  updateCustomProp,
}: MapViewProps) => {
  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-2">
        <h3 className="text-lg font-medium">3. Map Preview </h3>
        <div className="flex flex-row items-center gap-4">
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
              value={mapProps.pinColor}
              onChange={(value) => updateCustomProp("pinColor", value)}
            />
          </div>
        </div>
      </div>

      <Map
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 1,
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
                "circle-color": mapProps.pinColor,
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
