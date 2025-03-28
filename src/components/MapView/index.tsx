// Using Maplibre
import { useState } from "react";
import Map, { Layer, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "../../contants";

type MapViewProps = {
  mapData: GeoJSON.FeatureCollection | null;
};

export const MapView = ({ mapData }: MapViewProps) => {
  const [currentStyle, setCurrentStyle] =
    useState<keyof typeof MAP_STYLES>("Dark");

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-lg font-medium mb-3">3. Map Preview </h3>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="map-style-select">Map style: </label>
          <select
            id="map-style-select"
            value={currentStyle}
            onChange={(e) =>
              setCurrentStyle(e.target.value as keyof typeof MAP_STYLES)
            }
          >
            {Object.keys(MAP_STYLES).map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Map
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 1,
        }}
        style={{ width: "100%", height: 400 }}
        mapStyle={MAP_STYLES[currentStyle]}
      >
        {mapData && (
          <Source type="geojson" data={mapData}>
            <Layer
              type="circle"
              paint={{
                "circle-radius": 5,
                "circle-color": "#007cbf",
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
