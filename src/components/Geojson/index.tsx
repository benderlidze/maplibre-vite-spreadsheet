import Map, { NavigationControl, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "../../contants";
import { useState, useCallback } from "react";
import type { FeatureCollection } from "geojson";

export const Geojson = () => {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (file.name.endsWith('.geojson') || file.type === "application/geo+json") {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            setGeojsonData(data);
          } catch (error) {
            console.error("Error parsing GeoJSON:", error);
          }
        };
        
        reader.readAsText(file);
      }
    }
  }, []);

  return (
    <div 
      className="flex flex-1 w-full h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Map
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
        mapStyle={MAP_STYLES.Light}
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
            "© Need a map like this -> <a href='https://geomapi.com/'>geomapi.com</a>",
        }}
      >
        <NavigationControl position="top-right" />
        
        {geojsonData && (
          <Source id="geojson-data" type="geojson" data={geojsonData}>
            <Layer
              id="geojson-fill"
              type="fill"
              paint={{
                "fill-color": "#088",
                "fill-opacity": 0.5,
              }}
              filter={["==", "$type", "Polygon"]}
            />
            <Layer
              id="geojson-line"
              type="line"
              paint={{
                "line-color": "#088",
                "line-width": 2,
              }}
              filter={["in", "$type", "LineString", "Polygon"]}
            />
            <Layer
              id="geojson-point"
              type="circle"
              paint={{
                "circle-color": "#088",
                "circle-radius": 6,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#fff",
              }}
              filter={["==", "$type", "Point"]}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};
