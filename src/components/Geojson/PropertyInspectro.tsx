import { Feature, FeatureCollection } from "geojson";
import { useState, useMemo } from "react";

type PropertyInspectorProps = {
  geojson?: FeatureCollection | Feature | null | undefined;
  onChange: (value: string) => void;
};

export const PropertyInspector = ({
  geojson,
  onChange,
}: PropertyInspectorProps) => {
  // Extract properties from GeoJSON
  const extractProperties = () => {
    if (!geojson) return [];
    if (
      "type" in geojson &&
      geojson.type === "FeatureCollection" &&
      geojson.features
    ) {
      return geojson.features.map((feature, idx) => ({
        id: feature.id || `feature-${idx}`,
        properties: feature.properties || {},
      }));
    } else if ("type" in geojson && geojson.type === "Feature") {
      return [
        {
          id: geojson.id || "feature-0",
          properties: geojson.properties || {},
        },
      ];
    }
    return [];
  };

  const featuresWithProperties = useMemo(() => extractProperties(), [geojson]);
  const [filter, setFilter] = useState("");

  const updateKeyValue = (key: string, value: string) => {
    const updatedGeojson = { ...geojson } as FeatureCollection;
    if (
      updatedGeojson &&
      "features" in updatedGeojson &&
      Array.isArray(updatedGeojson.features)
    ) {
      updatedGeojson.features.forEach((feature: Feature) => {
        if (feature.properties && key in feature.properties) {
          feature.properties[key] = value;
        }
      });
    }
    onChange(JSON.stringify(updatedGeojson, null, 2));
  };

  return (
    <div className="h-full w-full p-6 flex flex-col">
      <header className="mb-4">
        <h2 className="text-sm font-semibold text-gray-800">
          GeoJSON Properties
        </h2>
        <input
          type="text"
          placeholder="Filter property keys..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-2 w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </header>
      <div className="flex-1 overflow-auto">
        {featuresWithProperties.length > 0 ? (
          featuresWithProperties.map((feature) => (
            <section key={feature.id} className="mb-6">
              {featuresWithProperties.length > 1 && (
                <h3 className="mb-2 text-sm font-medium text-blue-500">
                  Feature: {feature.id}
                </h3>
              )}
              <div className="overflow-x-auto bg-white rounded-md border border-gray-200">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Property</th>
                      <th className="px-4 py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(feature.properties)
                      .filter(([key]) =>
                        key
                          .toLocaleLowerCase()
                          .includes(filter.toLocaleLowerCase())
                      )
                      .map(([key, value], idx) => (
                        <tr
                          key={key}
                          className={`
                            ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                            hover:bg-gray-100
                          `}
                        >
                          <td
                            className="px-4 py-2 font-mono text-gray-700"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={() => updateKeyValue(key, value)}
                          >
                            {key}
                          </td>
                          <td
                            className="px-4 py-2 font-mono text-gray-800"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={() => updateKeyValue(key, value)}
                          >
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </td>
                        </tr>
                      ))}
                    {Object.entries(feature.properties).filter(([k]) =>
                      k.includes(filter)
                    ).length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-4 text-center text-gray-400"
                        >
                          No matching properties
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        ) : (
          <div className="text-gray-400 text-center py-16">
            No properties found in GeoJSON data
          </div>
        )}
        <div className="mt-4 flex justify-between space-x-2">
          {/* <button
            onClick={handleSave}
            className="cursor-pointer px-4 py-2 bg-blue-500  text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </button> */}
        </div>
      </div>
    </div>
  );
};
