import { MAP_STYLES } from "../../contants";

export type UrlParams = {
  dataURL: string;
  latField: string;
  lngField: string;
  mapStyle: keyof typeof MAP_STYLES;
  nameField?: string;
  descField?: string;
  pinColor?: string;
  mapCenter?: [number, number];
  mapZoom?: number;
  mapPitch?: number;
  mapBearing?: number;
};

export const defaultParams: UrlParams = {
  dataURL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1RLwN8Q0x34xLsVAnqlRaTVWT6gezOa4O87UYgpCz137eIiZ7zHnNbEPi6ELEPgpKQoehHxse74n-/pub?output=csv",
  latField: "",
  lngField: "",
  nameField: "name",
  descField: "description",
  mapStyle: "Light",
  pinColor: "007cbf",
  mapCenter: [0, 0],
  mapZoom: 1,
  mapPitch: 0,
  mapBearing: 0,
};
