import { MAP_STYLES } from "../../contants";

export type UrlParams = {
  dataURL: string;
  latField: number;
  lngField: number;
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
  dataURL: "",
  latField: 0,
  lngField: 0,
  nameField: "name",
  descField: "description",
  mapStyle: "Light",
  pinColor: "007cbf",
  mapCenter: [0, 0],
  mapZoom: 1,
  mapPitch: 0,
  mapBearing: 0,
};
