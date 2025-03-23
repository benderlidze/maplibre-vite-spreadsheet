// Using Maplibre
import Map, { Layer, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

type MapViewProps = {
  mapData: GeoJSON.FeatureCollection | null;
};

export const MapView = ({ mapData }: MapViewProps) => {
  return (
    <Map
      initialViewState={{
        longitude: 0,
        latitude: 0,
        zoom: 1,
      }}
      style={{ width: "100%", height: 400 }}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
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
  );
};
