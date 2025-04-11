import "maplibre-gl/dist/maplibre-gl.css";
import ml, { IControl } from "maplibre-gl";
import React, { useEffect, useRef } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { drawStyles } from "./drawStyles";

// @ts-expect-error ignore
MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
// @ts-expect-error ignore
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
// @ts-expect-error ignore
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

export const GmMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<ml.Map | null>(null);
  const drawInstance = useRef<MapboxDraw | null>(null);

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

      // Add navigation control (zoom and rotation controls)
      map.addControl(new ml.NavigationControl(), "top-right");

      // Initialize MapboxDraw with custom styles
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        styles: drawStyles, // Add custom styles to make lines visible
        //custom buttons
        controls: {
          point: true,
          line_string: true,
          polygon: true,
          trash: true,
          // combine_features: true,
          // uncombine_features: true,
        },
      });

      // Add draw control to the map and cast map to any to bypass type checking
      map.addControl(draw as unknown as IControl, "top-right");
      drawInstance.current = draw;

      mapInstance.current = map;

      // Handle drag and drop functionality for GeoJSON files
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = "copy";
        }
      };

      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!drawInstance.current) {
          console.warn("Geoman not loaded yet");
          return;
        }

        if (e.dataTransfer && e.dataTransfer.files) {
          const files = Array.from(e.dataTransfer.files);

          files.forEach((file) => {
            if (
              file.type === "application/geo+json" ||
              file.name.endsWith(".geojson") ||
              file.name.endsWith(".json")
            ) {
              const reader = new FileReader();

              reader.onload = (event) => {
                try {
                  if (event.target && typeof event.target.result === "string") {
                    const geoJson = JSON.parse(event.target.result);

                    // Handle both FeatureCollection and individual Feature
                    if (
                      geoJson.type === "FeatureCollection" &&
                      geoJson.features
                    ) {
                      console.log(
                        `Imported ${geoJson.features.length} features from ${file.name}`
                      );
                      // Add all features from the collection to the draw instance
                      drawInstance.current?.add(geoJson);
                    } else if (geoJson.type === "Feature") {
                      console.log(`Imported feature from ${file.name}`);
                      // Add the individual feature to the draw instance
                      drawInstance.current?.add(geoJson);
                    } else {
                      console.error("Invalid GeoJSON format");
                    }
                  }
                } catch (error) {
                  console.error("Error parsing GeoJSON file:", error);
                }
              };

              reader.readAsText(file);
            } else {
              console.warn("Not a GeoJSON file:", file.name);
            }
          });
        }
      };

      map.on("load", () => {
        console.log("drawInstance loaded", drawInstance);

        // Add drag and drop event listeners after Geoman is loaded
        const container = map.getContainer();
        container.addEventListener("dragover", handleDragOver);
        container.addEventListener("drop", handleDrop);
      });

      return () => {
        if (mapInstance.current) {
          const container = mapInstance.current.getContainer();
          container.removeEventListener("dragover", handleDragOver);
          container.removeEventListener("drop", handleDrop);
          mapInstance.current.remove();
        }
      };
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  return (
    <div className="flex flex-1 w-full h-full flex-row">
      <div
        id="dev-map"
        ref={mapRef}
        style={{
          height: "100%",
          flex: 1,
        }}
      ></div>
      <div className="flex flex-col w-1/4 p-4 bg-gray-100">123</div>
    </div>
  );
};
