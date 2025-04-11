import { Geoman } from "@geoman-io/maplibre-geoman-free";
import "@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css";
import "maplibre-gl/dist/maplibre-gl.css";
import ml from "maplibre-gl";
import React, { useEffect, useRef } from "react";

const gmOptions = {
  controls: {
    helper: {
      snapping: {
        uiEnabled: true,
        active: true,
      },
    },
  },
};

export const GmMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<ml.Map | null>(null);
  const geomanInstance = useRef<Geoman | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new ml.Map({
        container: mapRef.current,
        style: {
          version: 8,
          glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm-tiles-layer",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [0, 51],
        zoom: 5,
        fadeDuration: 50,
      });

      mapInstance.current = map;
      const geoman = new Geoman(map, gmOptions);
      geomanInstance.current = geoman;

      // Define loadDevShapes inside useEffect to handle dependencies correctly
      const loadDevShapes = () => {
        if (!geomanInstance.current) {
          console.warn("Geoman not loaded yet");
          return;
        }

        // demoFeatures.forEach((shapeGeoJson) => {
        //   geomanInstance.current!.features.importGeoJsonFeature(shapeGeoJson);
        // });

        // console.log("Shapes loaded", demoFeatures);
      };

      map.on("gm:loaded", () => {
        console.log("Geoman loaded", geoman);
        // Enable drawing tools
        geoman.enableDraw("line");
        // Load demo shapes
        loadDevShapes();
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  return (
    <div className="flex flex-1 w-full h-full">
      <div
        id="dev-map"
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          flex: "1 1 auto",
        }}
      ></div>
    </div>
  );
};
