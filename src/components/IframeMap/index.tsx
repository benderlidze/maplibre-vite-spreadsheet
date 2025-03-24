// Using Maplibre
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

export const IframeMap = ({ mapData }: MapViewProps) => {
  return (
    <Map
      initialViewState={{
        longitude: 0,
        latitude: 0,
        zoom: 1,
      }}
      style={{ width: "100%", height: "100vh" }}
      mapStyle={MAP_STYLES["Dark"]}
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
