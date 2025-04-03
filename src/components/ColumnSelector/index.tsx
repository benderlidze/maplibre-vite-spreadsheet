import { useState, useEffect } from "react";
import { UrlParams } from "../IframeMap/constants";

type ColumnSelectorProps = {
  mapProps: UrlParams;
  updateCustomProp: (
    prop: keyof UrlParams,
    value: string | number | [number, number]
  ) => void;
};

export const ColumnSelector = ({
  updateCustomProp,
  mapProps,
}: ColumnSelectorProps) => {
  const [headers, setHeaders] = useState<string[]>(mapProps.csvColumns ?? []);

  console.log("mapProps.csvColumns", mapProps.csvColumns);
  console.log("headers", headers);

  useEffect(() => {
    if (mapProps.csvColumns) {
      setHeaders(mapProps.csvColumns);
    }
  }, [mapProps.csvColumns]);

  // Auto-select fields that might contain lat/lng data
  useEffect(() => {
    if (headers.length > 0) {
      // Try to auto-detect lat/lng fields
      const possibleLatFields = headers.filter(
        (h) => /lat/i.test(h) || /latitude/i.test(h)
      );
      const possibleLngFields = headers.filter(
        (h) => /lon/i.test(h) || /lng/i.test(h) || /longitude/i.test(h)
      );

      if (possibleLatFields.length > 0)
        updateCustomProp("latField", possibleLatFields[0]);
      if (possibleLngFields.length > 0)
        updateCustomProp("lngField", possibleLngFields[0]);

      // Look for name or title fields
      const possibleNameFields = headers.filter(
        (h) => /name/i.test(h) || /title/i.test(h)
      );

      if (possibleNameFields.length > 0) {
        updateCustomProp("nameField", possibleNameFields[0]);
      }
    }
  }, [headers]);

  const renderFieldSelector = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    required: boolean = false
  ) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => {
          if (value !== e.target.value && onChange) {
            onChange(e.target.value);
          }
        }}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      >
        <option value="">Select field</option>
        {headers.map((header, index) => (
          <option key={index} value={header}>
            {header}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-4">
      {headers.length > 0 && (
        <>
          <h3 className="text-lg font-medium mb-3">2. Select Fields </h3>
          <div className="p-4 border border-gray-300 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderFieldSelector(
                "Latitude",
                mapProps.latField,
                (value: string) => {
                  updateCustomProp("latField", value);
                },
                true
              )}
              {renderFieldSelector("Longitude", mapProps.lngField, (value) => {
                updateCustomProp("lngField", value);
              })}
              {renderFieldSelector(
                "Marker Title (optional)",
                mapProps.nameField || "",
                (value) => {
                  updateCustomProp("nameField", value);
                }
              )}
              {renderFieldSelector(
                "Marker description (optional)",
                mapProps.descField || "",
                (value) => {
                  updateCustomProp("descField", value);
                }
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
