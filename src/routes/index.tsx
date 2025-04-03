import { createFileRoute } from "@tanstack/react-router";
import { useReducer } from "react";
import { CodeGenerator } from "../components/CodeGenerator";
import { CSVBox } from "../components/CSVBox";
import { MapDisplay } from "../components/IframeMap/MapDisplay";
import { MapSetUpProps } from "../components/IframeMap/MapSetUpProps";
import { defaultParams, UrlParams } from "../components/IframeMap/constants";

export const Route = createFileRoute("/")({
  component: Index,
});

type MapFieldsAction = {
  type: "UPDATE_CUSTOM_PROP";
  prop: keyof UrlParams;
  value: string | number | [number, number];
};

function mapFieldsReducer(
  state: UrlParams,
  action: MapFieldsAction
): UrlParams {
  switch (action.type) {
    case "UPDATE_CUSTOM_PROP":
      return { ...state, [action.prop]: action.value };
    default:
      return state;
  }
}

function Index() {
  const [mapProps, dispatch] = useReducer(mapFieldsReducer, defaultParams);

  const updateCustomProp = (
    prop: keyof UrlParams,
    value: string | number | [number, number]
  ) => {
    dispatch({ type: "UPDATE_CUSTOM_PROP", prop, value });
  };

  console.log("mapProps", mapProps);

  return (
    <div className="w-full p-6">
      <div className="flex flex-col gap-5 ">
        {/* https://docs.google.com/spreadsheets/d/1GkiV0OF9ifo512SYUzbBzjMXnc1eI8puAdEBkdfYKxs */}

        <div className="bg-white rounded-lg w-full ">
          <h3 className="text-lg font-medium mb-3">
            1. Add Google Spreadsheet URL{" "}
            <small className="text-gray-500">
              like
              https://docs.google.com/spreadsheets/d/1GkiV0OF9ifo512SYUzbBzjMXnc1eI8puAdEBkdfYKxs
            </small>
          </h3>
          <CSVBox mapProps={mapProps} updateCustomProp={updateCustomProp} />
        </div>

        <MapSetUpProps
          mapProps={mapProps}
          updateCustomProp={updateCustomProp}
        />

        <MapDisplay
          className="h-96"
          params={mapProps}
          updateCustomProp={updateCustomProp}
        />

        <CodeGenerator mapFields={mapProps} />
      </div>
    </div>
  );
}
