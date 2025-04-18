import "maplibre-gl/dist/maplibre-gl.css";
import ml from "maplibre-gl";
import React, { useEffect, useRef, useState } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { drawStyles } from "./drawStyles";
import bbox from "@turf/bbox";
import { MAP_STYLES } from "../../contants";
import { MapStyleSwitcher } from "./MapStyleSwitcher";
import {
  checkLocalStorage,
  clearGeoJSONFromStorage,
  loadGeoJSONFromStorage,
  saveGeoJSONToStorage,
} from "../../helpers/localStorage";
import { MapMenu } from "./MapMenu";
import { GeoJsonEditor } from "./GeoJsonEditor";
import { Feature, FeatureCollection } from "geojson";

// @ts-expect-error ignore
MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
// @ts-expect-error ignore
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
// @ts-expect-error ignore
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

const defaultStyle = "Light";

export const GmMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<ml.Map | null>(null);
  const drawInstance = useRef<MapboxDraw | null>(null);

  const [currentStyle, setCurrentStyle] =
    useState<keyof typeof MAP_STYLES>(defaultStyle);
  const [bounds, setBounds] = useState<[number, number][]>([]);
  const [geoJSON, setGeoJSON] = useState<FeatureCollection | Feature>({
    type: "FeatureCollection",
    features: [],
  });

  console.log("bounds", bounds);

  // Handle opening GeoJSON files
  const handleOpenGeoJSONFile = (files: File[]) => {
    if (!drawInstance.current || !mapInstance.current) {
      console.warn("Map or draw instance not loaded yet");
      return;
    }

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
                (geoJson.type === "FeatureCollection" ||
                  geoJson.type === "Feature") &&
                geoJson.features
              ) {
                console.log(
                  `Imported ${geoJson.features.length} features from ${file.name}`
                );
                // Add all features from the collection to the draw instance
                drawInstance.current?.add(geoJson);

                // Calculate bounds with TurfJS
                if (geoJson.features.length > 0) {
                  const bounds_ = bbox(geoJson);
                  // Bounds from TurfJS are in [minX, minY, maxX, maxY] format
                  // Convert to MapLibre bounds format [[minX, minY], [maxX, maxY]]
                  mapInstance.current?.fitBounds(
                    [
                      [bounds_[0], bounds_[1]],
                      [bounds_[2], bounds_[3]],
                    ],
                    { padding: 50, maxZoom: 16 }
                  );

                  setBounds([
                    [bounds_[0], bounds_[1]],
                    [bounds_[2], bounds_[3]],
                  ]);
                }

                clearGeoJSONFromStorage(); // Clear previous data
                // Save to localStorage after adding to map
                const allFeatures = drawInstance.current?.getAll();
                if (allFeatures) {
                  saveGeoJSONToStorage({
                    data: allFeatures,
                  });
                }
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
  };

  useEffect(() => {
    if (mapRef.current) {
      const map = new ml.Map({
        container: mapRef.current,
        style: MAP_STYLES[defaultStyle],
        center: [0, 0],
        zoom: 1,
        fadeDuration: 50,
      });

      // Add navigation control (zoom and rotation controls)
      map.addControl(new ml.NavigationControl(), "top-right");

      // Initialize MapboxDraw with custom styles
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        styles: drawStyles, // Add custom styles to make lines visible
        controls: {
          point: true,
          line_string: true,
          polygon: true,
          trash: true,
        },
      });

      // Add draw control to the map and cast map to any to bypass type checking
      map.addControl(draw as unknown as ml.IControl, "top-right");
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

        if (e.dataTransfer && e.dataTransfer.files) {
          const files = Array.from(e.dataTransfer.files);
          handleOpenGeoJSONFile(files);
        }
      };

      map.on("load", () => {
        console.log("drawInstance loaded", drawInstance);

        const isStorageDataAvailable = checkLocalStorage();
        if (isStorageDataAvailable) {
          //ask if you want to use it with popup
          const useStorage = window.confirm(
            "Do you want to use the saved data?"
          );
          if (useStorage) {
            const savedGeoJSON = loadGeoJSONFromStorage();
            console.log("savedGeoJSON", savedGeoJSON);
            if (savedGeoJSON && drawInstance.current) {
              // Add features from localStorage to the map
              drawInstance.current.add(savedGeoJSON);

              // If there are features, fit the map to their bounds
              if (savedGeoJSON.features && savedGeoJSON.features.length > 0) {
                console.log("savedGeoJSON.features", savedGeoJSON.features);
                try {
                  const bounds_ = bbox(savedGeoJSON);
                  setBounds([
                    [bounds_[0], bounds_[1]],
                    [bounds_[2], bounds_[3]],
                  ]);
                } catch (error) {
                  console.error(
                    "Error fitting bounds to saved features:",
                    error
                  );
                }
                updateGeoJSON(); // Update the GeoJSON state
              }
            }
          } else {
            clearGeoJSONFromStorage();
          }
        }

        // Add drag and drop event listeners after Geoman is loaded
        const container = map.getContainer();
        container.addEventListener("dragover", handleDragOver);
        container.addEventListener("drop", handleDrop);
      });

      // Save GeoJSON when features are created, updated or deleted

      map.on("draw.create", updateGeoJSON);
      map.on("draw.update", updateGeoJSON);
      map.on("draw.delete", updateGeoJSON);

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

  useEffect(() => {
    if (mapInstance.current && bounds.length > 0) {
      const [[minX, minY], [maxX, maxY]] = bounds;
      mapInstance.current.fitBounds(
        [
          [minX, minY],
          [maxX, maxY],
        ],
        {
          padding: 10,
          maxZoom: 16,
        }
      );
    }
  }, [bounds]);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setStyle(MAP_STYLES[currentStyle]);
    }
  }, [currentStyle]);

  function updateGeoJSON() {
    console.log("updateGeoJSON1");
    if (drawInstance.current) {
      console.log("updateGeoJSON2");
      const allFeatures = drawInstance.current.getAll();
      setGeoJSON(allFeatures);
      saveGeoJSONToStorage({ data: allFeatures });
    }
  }

  const onEditorChange = (value: string) => {
    try {
      const parsedGeoJSON = JSON.parse(value);
      if (parsedGeoJSON && drawInstance.current) {
        drawInstance.current.set(parsedGeoJSON);
        setGeoJSON(parsedGeoJSON);
        saveGeoJSONToStorage({ data: parsedGeoJSON });
      }
    } catch (error) {
      console.error("Error parsing GeoJSON:", error);
    }
  };

  return (
    <div className="flex flex-1 w-full h-full flex-row ">
      <MapMenu
        handleOpenGeoJSONFile={handleOpenGeoJSONFile}
        geojson={geoJSON}
      />
      <div
        id="dev-map"
        ref={mapRef}
        style={{
          height: "100%",
          flex: 1,
        }}
      ></div>

      <MapStyleSwitcher
        currentStyle={currentStyle}
        setCurrentStyle={setCurrentStyle}
      />

      <div className="flex flex-col w-1/3 bg-gray-100">
        <GeoJsonEditor geojson={geoJSON} onChange={onEditorChange} />
      </div>
    </div>
  );
};
