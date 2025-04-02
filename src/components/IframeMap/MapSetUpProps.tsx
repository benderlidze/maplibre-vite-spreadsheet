import { MAP_STYLES } from "../../contants";
import { ColorPicker } from "../ColorPicker";
import { UrlParams } from "./constants";

type MapSetUpProps = {
  mapProps: UrlParams;
  updateCustomProp: (
    prop: keyof UrlParams,
    value: string | number | [number, number]
  ) => void;
};

export const MapSetUpProps = ({
  mapProps,
  updateCustomProp,
}: MapSetUpProps) => {
  console.log("mapProps", mapProps);
  const lat = mapProps.mapCenter?.[0] ?? 0;
  const lng = mapProps.mapCenter?.[1] ?? 0;
  const zoom = mapProps.mapZoom ?? 1;

  return (
    <div className="flex flex-row justify-between items-center">
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
            value={"007cbf"}
            onChange={(value) =>
              updateCustomProp("pinColor", value.replace("#", ""))
            }
          />
        </div>
      </div>
    </div>
  );
};
