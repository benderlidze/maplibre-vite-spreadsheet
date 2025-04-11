import { GeoJSON } from "geojson";

// LocalStorage key for GeoJSON data
const GEOJSON_STORAGE_KEY = "maplibre-geojson-data";
export type storageData = {
  data: GeoJSON;
  bounds?: [number, number, number, number];
};
// Utility functions for localStorage
export const saveGeoJSONToStorage = (storageData: storageData) => {
  try {
    localStorage.setItem(GEOJSON_STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error("Failed to save GeoJSON to localStorage:", error);
  }
};

export const loadGeoJSONFromStorage = () => {
  try {
    const data = localStorage.getItem(GEOJSON_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to load GeoJSON from localStorage:", error);
    return null;
  }
};
