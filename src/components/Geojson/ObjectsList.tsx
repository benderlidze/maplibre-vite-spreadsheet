import { Feature, FeatureCollection } from "geojson";
import { useMemo } from "react";

type ObjectsListProps = {
  geojson?: FeatureCollection | Feature | null | undefined;
  onItemClick: (item: string) => void;
};

export const ObjectsList = ({ geojson, onItemClick }: ObjectsListProps) => {
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

  return (
    <div className="p-6 flex flex-col">
      <div className="flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-10rem)]">
        {featuresWithProperties.length > 0 ? (
          featuresWithProperties.map((feature) => (
            <section key={feature.id} className="mb-6">
              {featuresWithProperties.length > 1 && (
                <small
                  className="mb-2 text-sm font-medium text-blue-500 underline cursor-pointer whitespace-nowrap"
                  onClick={() => {
                    onItemClick(feature.id as string);
                  }} // onItemClick(feature)}
                >
                  id: {feature.id}
                </small>
              )}
              <div className="overflow-x-auto bg-white rounded-md border border-gray-200">
                <table className="min-w-full text-left text-sm">
                  <tbody>
                    {Object.entries(feature.properties)
                      .splice(0, 3)
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
                          >
                            {key}
                          </td>
                          <td
                            className="px-4 py-2 font-mono text-gray-800"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </td>
                        </tr>
                      ))}
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
      </div>
    </div>
  );
};

