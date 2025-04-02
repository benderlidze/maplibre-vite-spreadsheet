import { createFileRoute } from "@tanstack/react-router";
import { useReducer, useState } from "react";
import { CodeGenerator } from "../components/CodeGenerator";
import { CSVBox } from "../components/CSVBox";
import { MapView } from "../components/MapView";
import { MAP_STYLES } from "../contants";

export const Route = createFileRoute("/")({
  component: Index,
});

export type MapFields = {
  dataURL: string;
  latField: string;
  lngField: string;
  nameField: string;
  descField: string;

  mapStyle: keyof typeof MAP_STYLES;
  pinColor?: string;
  mapCenter?: { lat: number; lng: number };
  mapZoom?: number;
  mapPitch?: number;
  mapBearing?: number;
};

type MapFieldsAction =
  | { type: "SET_DATA_FIELDS"; payload: Partial<Omit<MapFields, "mapStyle">> }
  | { type: "SET_MAP_STYLE"; payload: keyof typeof MAP_STYLES }
  | {
      type: "UPDATE_CUSTOM_PROP";
      prop: keyof MapFields;
      value: string | number | { lat: number; lng: number };
    };

function mapFieldsReducer(
  state: MapFields,
  action: MapFieldsAction
): MapFields {
  switch (action.type) {
    case "SET_DATA_FIELDS":
      return { ...state, ...action.payload };
    case "SET_MAP_STYLE":
      return { ...state, mapStyle: action.payload };
    case "UPDATE_CUSTOM_PROP":
      return { ...state, [action.prop]: action.value };
    default:
      return state;
  }
}

function Index() {
  const [mapProps, dispatch] = useReducer(mapFieldsReducer, {
    dataURL: "",
    latField: "",
    lngField: "",
    nameField: "",
    descField: "",
    mapStyle: "Light",
    pinColor: "007cbf",
  });

  const [mapData, setMapData] = useState<GeoJSON.FeatureCollection | null>(
    null
  );

  const setDataFields = (fields: Partial<Omit<MapFields, "mapStyle">>) => {
    dispatch({ type: "SET_DATA_FIELDS", payload: fields });
  };

  const updateCustomProp = (
    prop: keyof MapFields,
    value: string | number | { lat: number; lng: number }
  ) => {
    dispatch({ type: "UPDATE_CUSTOM_PROP", prop, value });
  };

  return (
    <div className="w-full p-6">
      <div className="flex flex-col gap-5 ">
        {/* https://docs.google.com/spreadsheets/d/1GkiV0OF9ifo512SYUzbBzjMXnc1eI8puAdEBkdfYKxs */}

        <div className="bg-white rounded-lg w-full ">
          <h3 className="text-lg font-medium mb-3">
            1. Add Google Spreadsheet URL{" "}
            <small>
              https://docs.google.com/spreadsheets/d/1GkiV0OF9ifo512SYUzbBzjMXnc1eI8puAdEBkdfYKxs
            </small>
          </h3>
          <CSVBox setMapFields={setDataFields} setMapData={setMapData} />
        </div>
        <MapView
          mapData={mapData}
          mapProps={mapProps}
          updateCustomProp={updateCustomProp}
        />
        <CodeGenerator mapFields={mapProps} />
      </div>
    </div>
  );
}
