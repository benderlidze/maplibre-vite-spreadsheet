// Using Maplibre
import { useState } from "react";
import Map, { Layer, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

type MapViewProps = {
  mapData: GeoJSON.FeatureCollection | null;
};

const MAP_STYLES = {
  Dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  Light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  Voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  Contrast: "https://demotiles.maplibre.org/style.json",
};

export const MapView = ({ mapData }: MapViewProps) => {
  const [currentStyle, setCurrentStyle] =
    useState<keyof typeof MAP_STYLES>("Dark");

  console.log("mapData", mapData);

  return (
    <div>
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
