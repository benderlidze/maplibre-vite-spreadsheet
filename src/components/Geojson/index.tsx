import { GeoJsonImportFeature, Geoman } from "@geoman-io/maplibre-geoman-free";
import "@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css";
import "maplibre-gl/dist/maplibre-gl.css";
import ml from "maplibre-gl";
import React, { useEffect, useRef } from "react";

const gmOptions = {
  settings: {
    controlsPosition: "top-right",
  },
  controls: {
    // helper: {
    //   snapping: {
    //     uiEnabled: true,
    //     active: true,
    //   },
    // },
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

      // Add navigation control (zoom and rotation controls)
      map.addControl(new ml.NavigationControl(), "top-right");

      mapInstance.current = map;
      const geoman = new Geoman(map, gmOptions);
      geomanInstance.current = geoman;

      // Define loadDevShapes inside useEffect to handle dependencies correctly
      // const loadDevShapes = () => {
      //   if (!geomanInstance.current) {
      //     console.warn("Geoman not loaded yet");
      //     return;
      //   }

      //   // demoFeatures.forEach((shapeGeoJson) => {
      //   //   geomanInstance.current!.features.importGeoJsonFeature(shapeGeoJson);
      //   // });

      //   // console.log("Shapes loaded", demoFeatures);
      // };

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

        if (!geomanInstance.current) {
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
                      geoJson.features.forEach((feature: GeoJSON.Feature) => {
                        geomanInstance.current!.features.importGeoJsonFeature(
                          feature as GeoJsonImportFeature
                        );
                      });
                      console.log(
                        `Imported ${geoJson.features.length} features from ${file.name}`
                      );
                    } else if (geoJson.type === "Feature") {
                      geomanInstance.current!.features.importGeoJsonFeature(
                        geoJson
                      );
                      console.log(`Imported feature from ${file.name}`);
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

      map.on("gm:loaded", () => {
        console.log("Geoman loaded", geoman);
        // Enable drawing tools
        //geoman.enableDraw("line");
        // Load demo shapes
        // loadDevShapes();

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
